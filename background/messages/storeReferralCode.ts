import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const storage = new Storage({
  area: "local"
})

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  await storage.set('referralCode', req.body.code)
  console.log('Referral code stored:', req.body.code);
  res.send({ success: true })
}

export default handler
