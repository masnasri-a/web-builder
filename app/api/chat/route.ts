import { groq, CHAT_MODEL } from "@/lib/groq"
import { searchFaqs } from "@/lib/pinecone"

const SYSTEM_PROMPT = `Kamu adalah asisten virtual Selembar.id, platform undangan pernikahan digital Indonesia yang dibuat oleh Nuratech.id.

Tugasmu: Bantu pengguna menjawab pertanyaan seputar platform Selembar.id secara ramah, ringkas, dan akurat.

Panduan:
- Gunakan bahasa yang sama dengan pengguna (Indonesia atau English)
- Jawab berdasarkan konteks FAQ di bawah jika relevan
- Jika tidak ada di konteks, katakan kamu belum punya informasinya dan sarankan hubungi support via WhatsApp
- Jangan mengarang informasi yang tidak ada di konteks
- Nada ramah dan profesional, seperti customer service yang baik
- Jawaban singkat dan to the point (2-4 kalimat), kecuali diperlukan lebih panjang
- Jangan sebut "konteks FAQ" atau "berdasarkan FAQ" secara eksplisit — jawab langsung seolah kamu tahu`

export async function POST(req: Request) {
  try {
    const { message, history = [] } = await req.json()
    if (!message?.trim()) {
      return new Response("Message required", { status: 400 })
    }

    // 1. Semantic search on Pinecone
    const matches = await searchFaqs(message, 4)
    const context =
      matches.length > 0
        ? "\n\n---\nInformasi relevan:\n" +
          matches
            .map((m, i) => `${i + 1}. Pertanyaan: ${m.question}\n   Jawaban: ${m.answer}`)
            .join("\n\n")
        : ""

    // 2. Call Groq with streaming
    const stream = await groq.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT + context },
        // Keep last 8 turns for conversational memory
        ...history.slice(-8),
        { role: "user", content: message },
      ],
      stream: true,
      max_tokens: 600,
      temperature: 0.25,
    })

    // 3. Pipe Groq stream → Response stream
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? ""
            if (text) controller.enqueue(encoder.encode(text))
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  } catch (err) {
    console.error("[chat] error:", err)
    return new Response("Maaf, terjadi kesalahan. Silakan coba lagi.", { status: 500 })
  }
}
