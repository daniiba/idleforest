import Mellowtel from "mellowtel"
import type { PlasmoCSConfig } from "plasmo"


export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
  run_at: "document_start"
}

const start = async () => {
  try {
    mellowtel = new Mellowtel(process.env.PLASMO_PUBLIC_MELLOWTEL
    );
    
    const resp = await mellowtel.initContentScript("tabs/pascoli.html")
    console.log("Mellowtel initialized:", resp)

  } catch (error) {
    console.error("Error initializing Mellowtel:", error)
  }
}

let mellowtel
start()

