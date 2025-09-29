import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, Twitter, Globe, PlayCircle } from "lucide-react";

const getDiscordUrl = () => {
  return process.env.PLASMO_PUBLIC_DISCORD_INVITE || "https://discord.gg/kgUJPUhDv3";
};

const SocialsTab: React.FC = () => {
  const links = {
    discord: getDiscordUrl(),
    linkedin: "https://www.linkedin.com/company/idleforest",
    x: "https://x.com/IdleForestTree",
    tiktok: "https://www.tiktok.com/@idleforest",
    website: "https://idleforest.com",
  };

  return (
    <Card className="p-6 bg-brand-grey border border-brand-darkblue rounded-none">
      <div className="space-y-4">
        <h3 className="heading-candu text-brand-darkblue text-xl uppercase tracking-wide">
          {chrome.i18n.getMessage('share_supportTitle') || 'Support Our Forest'}
        </h3>
        <p className="text-brand-darkblue/80 text-sm">
          {chrome.i18n.getMessage('share_description') || 'Share your forest with friends and family!'}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => window.open(links.discord, '_blank')}
            className="bg-brand-darkblue hover:brightness-110 text-white uppercase font-candu tracking-wide rounded-none px-6"
          >
            {chrome.i18n.getMessage('support_joinDiscord') || 'Join our Discord'}
          </Button>
          <Button
            onClick={() => window.open(links.linkedin, '_blank')}
            className="bg-brand-darkblue hover:brightness-110 text-white uppercase font-candu tracking-wide rounded-none px-6 flex items-center gap-2"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Button>
          <Button
            onClick={() => window.open(links.x, '_blank')}
            className="bg-brand-darkblue hover:brightness-110 text-white uppercase font-candu tracking-wide rounded-none px-6 flex items-center gap-2"
          >
            <Twitter className="h-4 w-4" />
            {chrome.i18n.getMessage('share_shareOnX') || 'X (Twitter)'}
          </Button>
          <Button
            onClick={() => window.open(links.tiktok, '_blank')}
            className="bg-brand-darkblue hover:brightness-110 text-white uppercase font-candu tracking-wide rounded-none px-6 flex items-center gap-2"
          >
            <PlayCircle className="h-4 w-4" />
            TikTok
          </Button>
          <Button
            onClick={() => window.open(links.website, '_blank')}
            className="bg-brand-darkblue hover:brightness-110 text-white uppercase font-candu tracking-wide rounded-none px-6 flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            {chrome.i18n.getMessage('app_title') || 'Website'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SocialsTab;
