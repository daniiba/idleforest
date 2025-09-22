import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const storage = new Storage({
  area: "local"
})

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const referralCode = await storage.get('referralCode');
  res.send({ referralCode })
}

export default handler
