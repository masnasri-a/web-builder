import { Pinecone } from "@pinecone-database/pinecone"
import type { DenseEmbedding } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/inference"

const INDEX_NAME = process.env.PINECONE_INDEX ?? "selembar-support"
const EMBED_MODEL = "multilingual-e5-large"
const DIMENSIONS = 1024

const globalForPinecone = globalThis as unknown as { pinecone: Pinecone }
const pc =
  globalForPinecone.pinecone ??
  new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
if (process.env.NODE_ENV !== "production") globalForPinecone.pinecone = pc

async function ensureIndex() {
  const existing = await pc.listIndexes()
  const names = existing.indexes?.map(i => i.name) ?? []
  if (!names.includes(INDEX_NAME)) {
    await pc.createIndex({
      name: INDEX_NAME,
      dimension: DIMENSIONS,
      metric: "cosine",
      spec: { serverless: { cloud: "aws", region: "us-east-1" } },
      waitUntilReady: true,
    })
  }
  return pc.index(INDEX_NAME)
}

async function embedTexts(
  texts: string[],
  inputType: "passage" | "query"
): Promise<number[][]> {
  const result = await pc.inference.embed({
    model: EMBED_MODEL,
    inputs: texts,
    parameters: { input_type: inputType, truncate: "END" },
  })
  return result.data.map(d => (d as DenseEmbedding).values as number[])
}

export async function syncFaqsToPinecone(): Promise<{ synced: number }> {
  const { db } = await import("@/lib/db")
  const faqs = await db.faqItem.findMany({ where: { isActive: true } })

  const index = await ensureIndex()
  try {
    await index.deleteAll()
  } catch {
    // empty index, ignore
  }

  if (faqs.length === 0) return { synced: 0 }

  const texts = faqs.map(f => `${f.question}\n${f.answer}`)
  const vectors = await embedTexts(texts, "passage")

  await index.upsert({
    records: faqs.map((faq, i) => ({
      id: faq.id,
      values: vectors[i],
      metadata: { question: faq.question, answer: faq.answer },
    })),
  })

  return { synced: faqs.length }
}

export async function searchFaqs(
  query: string,
  topK = 4
): Promise<{ question: string; answer: string; score: number }[]> {
  try {
    const [queryVector] = await embedTexts([query], "query")
    const index = pc.index(INDEX_NAME)
    const result = await index.query({
      vector: queryVector,
      topK,
      includeMetadata: true,
    })
    return result.matches
      .filter(m => (m.score ?? 0) > 0.45)
      .map(m => ({
        question: m.metadata?.question as string,
        answer: m.metadata?.answer as string,
        score: m.score ?? 0,
      }))
  } catch (err) {
    console.error("[pinecone] search error:", err)
    return []
  }
}
