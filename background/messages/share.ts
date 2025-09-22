import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { platform } = req.body;
  // Handle share event
  console.log('Share event:', platform);
  res.send({ success: true })
}

export default handler
