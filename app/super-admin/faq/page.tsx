import { db } from "@/lib/db"
import { FaqManager } from "./faq-manager"

export default async function SuperAdminFaqPage() {
  const [faqs, config] = await Promise.all([
    db.faqItem.findMany({ orderBy: { order: "asc" } }),
    db.supportConfig.findFirst(),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">FAQ & Support</h1>
        <p className="text-muted-foreground">Kelola pertanyaan yang tampil di chatbot landing page</p>
      </div>
      <FaqManager
        initialFaqs={faqs}
        initialConfig={config ?? { id: "", waNumber: "", waMessage: "Halo, saya butuh bantuan terkait Selembar.id" }}
      />
    </div>
  )
}
