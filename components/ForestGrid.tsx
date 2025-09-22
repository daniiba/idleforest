import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Share2, BarChart2, Info } from "lucide-react";
import type { TabType } from "~api/types";
import { Storage } from "@plasmohq/storage"
import { sendToBackground } from "@plasmohq/messaging"
import browser from "webextension-polyfill";
import logoUrl from "url:~assets/logo.png";

interface HelpTasks {
  shared: boolean;
  rated: boolean;
}

import { Button } from "@/components/ui/button";
import Mellowtel from "mellowtel";
import { StatsModal } from './StatsModal';
import { AuthModal } from './AuthModal';
import Navigation from './Navigation';
import ProfileTab from './tabs/ProfileTab';
import TeamTab from './tabs/TeamTab';
import ReferralTab from './tabs/ReferralTab';
import PlantingTab from './tabs/PlantingTab';
import { MellowtelAnimation } from './MellowtelAnimation';
import { useAuth } from "~context/AuthProvider";
import ShareModal from './ShareModal';
import LanguageSelector from './LanguageSelector';
import Promo from './Promo';

const STORAGE_KEY = "idleforest_help_tasks";
const COST_PER_TREE = 0.30;
const CO2_PER_TREE = 28.5;
const SEEDS_PER_TREE = 100;

const getStoreUrl = () => {
  const id = browser.runtime.id;
  const browserInfo = navigator.userAgent;
 
  if (browserInfo.includes("Edg")) {
    return `https://microsoftedge.microsoft.com/addons/detail/${id}`;
  }
/*   if (browserInfo.includes("Safari")) {
    return `https://apps.apple.com/app/idleforest/id${id}`;
  } */

  // Default to Chrome Web Store
  return `https://chrome.google.com/webstore/detail/ofdclafhpmccdddnmfalihgkahgiomjk`;
};

const storage = new Storage({area:"local"})
const ForestGrid: React.FC = () => {
  // State declarations remain the same
  const [stats, setStats] = useState<any>({ 
    requestsTotal: 0, 
    earnings: "$0.00", 
    publicKey: "" 
  });
  const [helpTasks, setHelpTasks] = useState<HelpTasks>({ shared: false, rated: false });
  const [userLifetimeRequests, setUserLifetimeRequests] = useState(0);
  const { user, profile, team, referralStats, referralCode, loading } = useAuth();
  const [isMellowtelActive, setIsMellowtelActive] = useState(false);

 

  const [showStats, setShowStats] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('planting');

  // Effects and handlers remain the same
  useEffect(() => {
    const getHelpTasks = async () => {
      const storedTasks = await storage.get(STORAGE_KEY)
      console.log(storedTasks)
      if (storedTasks) {
        try {
          const parsedTasks = JSON.parse(storedTasks) as HelpTasks
          setHelpTasks(parsedTasks)
        } catch (e) {
          console.error('Error parsing help tasks:', e)
        }
      }
    }

    const getMellowtelStatus = async () => {
      const optIn = await storage.get('mellowtelOptIn')
      setIsMellowtelActive(!!optIn)
    }

    getHelpTasks()
    getMellowtelStatus()
  }, []);

  const handleOptIn = async () => {
    try {
      const mellowtel = new Mellowtel(process.env.PLASMO_PUBLIC_MELLOWTEL);
      await mellowtel.optIn();
      browser.runtime.reload();
    } catch (error) {
      console.error('Error during opt-in:', error);
    }
  };

  const handleOptOut = async () => {
    try {
      const mellowtel = new Mellowtel(process.env.PLASMO_PUBLIC_MELLOWTEL);
      await mellowtel.optOut();
      browser.runtime.reload();
    } catch (error) {
      console.error('Error during opt-out:', error);
    }
  };

  const shareText = (platform: string) => {
    const handle = platform === 'bluesky' ? '@idleforest.bsky.social' : '@IdleForestTree';
    return chrome.i18n.getMessage('share_social_text', [handle]);
  };

  const handleShare = async (platform: string) => {
    // Send share event to background
   
    const text = shareText(platform);
    let baseUrl = '';

    switch (platform) {
      case 'x':
        baseUrl = 'https://twitter.com/intent/tweet';
        break;
      case 'bluesky':
        baseUrl = 'https://bsky.app/intent/compose';
        break;
      case 'whatsapp':
        baseUrl = 'https://api.whatsapp.com/send';
        break;
    }
    console.log(baseUrl);
    if (baseUrl) {
      const url = new URL(baseUrl);
      url.searchParams.set('text', text);
      
      window.open(url.toString(), '_blank');
      const newHelpTasks = { ...helpTasks, shared: true };
      setHelpTasks(newHelpTasks);
      await storage.set(STORAGE_KEY, JSON.stringify(newHelpTasks));
    }
  };

  const handleRate = async () => {
    window.open(getStoreUrl(), '_blank');
    const newHelpTasks = { ...helpTasks, rated: true };
    setHelpTasks(newHelpTasks);
    await storage.set(STORAGE_KEY, JSON.stringify(newHelpTasks));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://fcgv4rovovvlixqc2a7qncvev40dbxsy.lambda-url.us-east-1.on.aws/?publicKey=' + process.env.PLASMO_PUBLIC_MELLOWTEL);
        const mellowtelStats = await response.json();

        const lifetimeRequests = await storage.get('lifetime_total_count_m') || 0;
        setUserLifetimeRequests(Number(lifetimeRequests));
        // Apply legacy formula from webapp to compute formatted earnings and total trees
        const earningsParsed = parseFloat(String(mellowtelStats.earnings).replace('$', '')) || 0;
        const earningsNum = earningsParsed + 25; // legacy offset
        const treesPlantedRaw = Math.floor((earningsNum - 205) / 0.55) + 652;
        const formattedEarnings = `$${earningsNum.toFixed(2)}`; // ensure 2 decimals

        setStats((prev: any) => ({
          ...prev,
          ...mellowtelStats,
          requestsTotal: mellowtelStats.requestsTotal ?? 0,
          earnings: formattedEarnings,
          treesPlanted: Number.isFinite(treesPlantedRaw) ? Math.max(0, treesPlantedRaw) : 0,
          totalUsers: mellowtelStats.totalUsers ?? mellowtelStats.active_node_count ?? 0,
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const calculateMetrics = useCallback(() => {
    const totalEarnings = parseFloat(stats.earnings.replace('$', '')) || 0;
    const calculatedTrees = Math.floor(totalEarnings / COST_PER_TREE);
    const totalTrees = Math.max(1, calculatedTrees);

    let userProgress = 0;
    if (stats.requestsTotal > 0) {
      const userEarnings = (userLifetimeRequests / stats.requestsTotal) * totalEarnings;
      userProgress = userEarnings / COST_PER_TREE;
    }

    const displayProgress = Math.max(0.01, calculatedTrees === 0 ? totalEarnings / COST_PER_TREE : userProgress);

    return {
      totalTrees,
      userProgress: userProgress,
      totalCo2Saved: totalTrees * CO2_PER_TREE,
      userEarnings: (displayProgress * COST_PER_TREE).toFixed(2),
      isMinimumTree: calculatedTrees === 0
    };
  }, [stats, userLifetimeRequests]);




  const renderTabContent = () => {
    if (!user) return null;

    switch (activeTab) {
      case 'profile':
        return <ProfileTab profile={profile} />;
      case 'team':
        return <TeamTab team={team} />;
      case 'referral':
        return <ReferralTab referralStats={referralStats} referralCode={referralCode} />;
      case 'planting':
        return <PlantingTab 
          isActive={isMellowtelActive}
          onOptIn={handleOptIn}
          onOptOut={handleOptOut}
        />;
      default:
        return null;
    }
  };

  const metrics = calculateMetrics();
  const { userProgress } = metrics;
  const personalCo2Saved = userProgress * CO2_PER_TREE;

  const hasUncompletedTasks = !helpTasks.shared || !helpTasks.rated;

  return (
    <div className="w-[560px] mx-auto bg-brand-grey">
      <Card className="border border-brand-grey bg-brand-grey rounded-none">
        <CardContent className="p-6">
          {/* Header with icons */}
          <div className="flex justify-between items-center mb-6">
            <img src={logoUrl} alt="Idle Forest" className="h-6" />
            <div className="flex gap-2 items-center">
              <LanguageSelector />
              {loading ? (
                <div className="animate-pulse bg-brand-grey h-8 w-16" />
              ) : !user ? (
                <Button
                  variant="ghost"
                  onClick={() => setShowAuthModal(true)}
                  className="text-brand-darkblue hover:bg-brand-grey/40"
                >
                  {chrome.i18n.getMessage('app_login')}
                </Button>
              ) : null}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowShareModal(!showShareModal)}
                  className="h-9 w-9 rounded-full hover:bg-brand-grey/40"
                >
                  <Share2 className="h-5 w-5 text-brand-darkblue" />
                </Button>
                {hasUncompletedTasks && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-yellow rounded-full" />
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowStats(!showStats)}
                className="h-9 w-9 rounded-full hover:bg-brand-grey/40"
              >
                <BarChart2 className="h-5 w-5  text-brand-darkblue" />
              </Button>
            </div>
          </div>

          {user && <Navigation activeTab={activeTab} onTabChange={setActiveTab} />}


          <Promo onNavigate={setActiveTab} />
          {/* Show content for non-logged-in users */}
          {!user && (
            <>
              <div className="mb-8">
                <MellowtelAnimation isActive={isMellowtelActive} />
                <div className="flex justify-center mt-4">
                  {isMellowtelActive ? (
                    <Button
                      onClick={handleOptOut}
                      className="bg-brand-darkblue hover:brightness-110 text-white uppercase font-candu tracking-wide  px-6"
                      >
                      {chrome.i18n.getMessage('app_stopPlanting')}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleOptIn}
                      className="bg-brand-darkblue hover:brightness-110 text-white uppercase font-candu tracking-wide  px-6"
                    >
                      {chrome.i18n.getMessage('app_startPlanting')}
                    </Button>
                  )}
                </div>
                {!isMellowtelActive && (
                  <div className="bg-brand-grey border border-brand-darkblue text-brand-darkblue text-xs p-4 mt-8 flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full  flex items-center justify-center mt-0.5">
                      <Info className="h-3.5 w-3.5" />
                    </div>
                    <p>
                      {chrome.i18n.getMessage('app_shareBandwidth')}{' '}
                      <a
                        href="https://www.mellowtel.com/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold hover:underline"
                      >
                        {chrome.i18n.getMessage('app_learnMore')}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Show tab content for logged in users */}
          {renderTabContent()}
        </CardContent>
      </Card>

      <ShareModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        onShare={handleShare}
        onRate={handleRate}
        helpTasks={helpTasks}
      />

      <StatsModal
        open={showStats}
        onOpenChange={setShowStats}
        stats={stats}
        metrics={{
          userEarnings: metrics.userEarnings,
          userProgress,
          personalCo2Saved
        }}
        userLifetimeRequests={userLifetimeRequests}
        SEEDS_PER_TREE={SEEDS_PER_TREE}
      />

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
      />
    </div>
  );
};

export default ForestGrid;