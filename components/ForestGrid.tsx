import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Share2, BarChart2 } from "lucide-react";
import type { TabType } from "~api/types";
import { Storage } from "@plasmohq/storage"
import { sendToBackground } from "@plasmohq/messaging"
import browser from "webextension-polyfill";

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

const STORAGE_KEY = "idleforest_help_tasks";
const COST_PER_TREE = 0.30;
const CO2_PER_TREE = 28.5;
const SEEDS_PER_TREE = 100;

const getStoreUrl = () => {
  const id = browser.runtime.id;
  const browserInfo = navigator.userAgent;
  if (browserInfo.includes("Firefox")) {
    return `https://addons.mozilla.org/firefox/addon/idleforest`;
  }
  if (browserInfo.includes("Edg")) {
    return `https://microsoftedge.microsoft.com/addons/detail/${id}`;
  }
  if (browserInfo.includes("Safari")) {
    return `https://apps.apple.com/app/idleforest/id${id}`;
  }
  if (browserInfo.includes("OPR")) {
    return `https://addons.opera.com/extensions/details/idleforest`;
  }
  // Default to Chrome Web Store
  return `https://chrome.google.com/webstore/detail/${id}`;
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
    return `I'm growing a forest while browsing with ${handle}! Join me in making a difference - it's completely free and automatic at https://idleforest.com.`;
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
        setStats(mellowtelStats);
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
    <div className="w-[500px] mx-auto bg-gradient-to-b from-green-50 to-white">
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-6">
            {/* Header with icons */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-green-800">Idle Forest</h2>
              <div className="flex gap-3 items-center">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded" />
                ) : !user ? (
                  <Button
                    variant="ghost"
                    onClick={() => setShowAuthModal(true)}
                    className="text-green-600 hover:bg-green-50"
                  >
                    Login
                  </Button>
                ) : null}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowShareModal(!showShareModal)}
                    className="h-9 w-9 rounded-full hover:bg-green-50"
                  >
                    <Share2 className="h-5 w-5 text-green-600" />
                  </Button>
                  {hasUncompletedTasks && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowStats(!showStats)}
                  className="h-9 w-9 rounded-full hover:bg-green-50"
                >
                  <BarChart2 className="h-5 w-5 text-green-600" />
                </Button>
              </div>
            </div>

            {user && <Navigation activeTab={activeTab} onTabChange={setActiveTab} />}
            
            {/* Show planting animation for non-logged in users */}
            {!user && (
              <div className="mb-8">
                <MellowtelAnimation isActive={isMellowtelActive} />
                <div className="flex justify-center mt-4">
                  {isMellowtelActive ? (
                    <Button 
                      variant="outline" 
                      onClick={handleOptOut}
                      className="bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300"
                    >
                      Stop Planting
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleOptIn}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Start Planting
                    </Button>
                  )}
                </div>
              </div>
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