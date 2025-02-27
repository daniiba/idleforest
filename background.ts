import Mellowtel from "mellowtel";
import { supabase } from "./core/supabase";
import { Storage } from "@plasmohq/storage";
import browser from "webextension-polyfill";

const storage = new Storage({
  area: "local"
})  
let mellowtel: Mellowtel;
const TWENTY_FOUR_HOURS =  2*60*60 * 1000;

const updateSupabaseCount = async () => {
  try { 
    const  last_supabase_sync  = await storage.get('last_supabase_sync');
    const now = new Date();
    console.log(last_supabase_sync,now.getTime() - new Date(last_supabase_sync).getTime() >= TWENTY_FOUR_HOURS)
    
    if (!last_supabase_sync || 
      (now.getTime() - new Date(last_supabase_sync).getTime() >= TWENTY_FOUR_HOURS)) {
     
      const  lifetime_total_count_m  = await storage.get('lifetime_total_count_m');
      const nodeId = await mellowtel.getNodeId();
    
    if (!nodeId) {
      console.error('No node identifier found');
      return;
    }

    const { error: nodeError } = await supabase
      .from('nodes')
      .update({ total_requests: lifetime_total_count_m })
      .eq('node_identifier', nodeId);

    if (nodeError) {
      console.error('Error updating node:', nodeError);
      return;
    }

    await storage.set(
      'last_supabase_sync', new Date().toISOString()
    );
  }
  else {
    console.log("not old enough")
  }
  } catch (error) {
    console.error('Error updating count:', error);
  }
};

const startDailySync = async () => {
   await updateSupabaseCount();
  await connectNodeToProfile()

  setInterval(async () => {
    await updateSupabaseCount();
  }, 60000);
};

const connectNodeToProfile = async()=> {
  const nodeId = await mellowtel.getNodeId();
            const { data: existingNode } = await supabase
              .from('nodes')
              .select('node_identifier, user_id')
              .eq('node_identifier', nodeId)
              .single();
    
            if (existingNode && !existingNode.user_id) {
              const { data: { session } } = await supabase.auth.getSession();
              if (session?.user?.id) {
                await supabase
                  .from('nodes')
                  .update({ user_id: session.user.id })
                  .eq('node_identifier', nodeId);
              }
            }
}
const start = async () => {
  try {
    mellowtel = new Mellowtel(process.env.PLASMO_PUBLIC_MELLOWTEL);
    
    await mellowtel.initBackground();
    console.log("Mellowtel background initialized");

    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Error getting Supabase session:', sessionError);
    }

    await startDailySync();
  } catch (error) {
    console.error("Error initializing Mellowtel:", error);
  }
}

// Plasmo message handlers
export const handler = {
  storeReferralCode: async ({ body }) => {
    await storage.set('referralCode', body.code)
    console.log('Referral code stored:', body.code);
    return { success: true };
  },

  getReferralCode: async () => {
    const referralCode = await storage.get('referralCode');
    return { referralCode };
  },

  share: async ({ body }) => {
    const { platform } = body;
    // Handle share event
    console.log('Share event:', platform);
    return { success: true };
  }
};

browser.runtime.onInstalled.addListener(async function (details) {
  if (details.reason === 'install') {
    // Check if install page is already open
    const tabs = await browser.tabs.query({url: 'https://idleforest.com/welcome'});
    
    if (tabs.length === 0) {
      // If not open, create a new tab with the install page
      browser.tabs.create({ url: 'https://idleforest.com/welcome' });
    } else {
      // If already open, refresh the tab
      browser.tabs.reload(tabs[0].id);
    }
  }
  try {
   

    if (details.reason === "install" || details.reason === "update") {
      const node_identifier = await mellowtel.getNodeId();
      
      // Check if node already exists
      const { data: existingNode } = await supabase
        .from('nodes')
        .select('node_identifier, user_id')
        .eq('node_identifier', node_identifier)
        .single();

      // Get current session to check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!existingNode) {
        // Create new node
        await supabase.from('nodes').insert({
          node_identifier,
          total_requests: 0,
          created_at: new Date().toISOString(),
          user_id: session?.user?.id // Link to user if logged in
        });
      } else if (!existingNode.user_id && session?.user?.id) {
        // Update existing node with user if not linked yet
        await supabase
          .from('nodes')
          .update({ user_id: session.user.id })
          .eq('node_identifier', node_identifier);
      }
    }
  } catch (error) {
    console.error('Error during installation/update:', error);
  }
  
  await mellowtel.generateAndOpenOptInLink();
  const feedbackUrl = await mellowtel.generateFeedbackLink();
  browser.runtime.setUninstallURL(feedbackUrl);
});

start();