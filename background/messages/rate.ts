import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const storage = new Storage({ area: "local" })
const STORAGE_KEY = "idleforest_help_tasks"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const { url } = req.body || {}
    console.log("Rate event for:", url)

    const raw = await storage.get(STORAGE_KEY)
    let state: { shared: boolean; rated: boolean; rateHistory?: Array<{ url?: string; at: string }> } = {
      shared: false,
      rated: false
    }
    if (raw) {
      try {
        state = { ...state, ...(typeof raw === "string" ? JSON.parse(raw) : raw) }
      } catch (e) {
        console.warn("Failed to parse existing help tasks, resetting", e)
      }
    }

    const updated = {
      ...state,
      rated: true,
      rateHistory: [
        ...(state.rateHistory || []),
        { url: url ? String(url) : undefined, at: new Date().toISOString() }
      ]
    }

    await storage.set(STORAGE_KEY, JSON.stringify(updated))

    res.send({ success: true })
  } catch (error) {
    console.error("Error handling rate event:", error)
    res.send({ success: false, error: String(error) })
  }
}

export default handler
