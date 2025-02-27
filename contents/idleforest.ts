import type { PlasmoCSConfig } from "plasmo"
import { sendToBackground } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["https://*.idleforest.com/*"],
  all_frames: true,
  run_at: "document_start"
}

// Check if we're on the install page
if (window.location.pathname === '/welcome') {
    // Get referral code from URL
    const referralCode = localStorage.getItem("idleforest_referral");
    console.log(referralCode);
    if (referralCode) {
      // Send it to the background script using Plasmo messaging
      sendToBackground({
        name: "storeReferralCode",
        body: { code: referralCode }
      });
    }
}