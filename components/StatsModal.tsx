import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Leaf, TreePine, Sprout, Wind, Users, InfoIcon } from 'lucide-react';

interface StatsModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	stats: {
		earnings: string;
		requestsTotal: number;
		treesPlanted?: number;
	};
	metrics: {
		userEarnings: string;
		userProgress: number;
		personalCo2Saved: number;
		referralCount?: number;
	};
	userLifetimeRequests: number;
	SEEDS_PER_TREE: number;
}

export const StatsModal: React.FC<StatsModalProps> = ({ 
  open, 
  onOpenChange, 
  stats, 
  metrics, 
  userLifetimeRequests,
  SEEDS_PER_TREE 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[560px] max-h-[85vh] overflow-y-auto p-6 bg-brand-grey border border-brand-darkblue rounded-none">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-candu tracking-wide uppercase text-brand-darkblue">
            {chrome.i18n.getMessage('stats_title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info banner */}
          <div className="bg-brand-yellow text-brand-darkblue border border-brand-darkblue px-4 py-3 flex items-start gap-3">
            <div className="flex-shrink-0 pt-0.5">
              <InfoIcon className="h-5 w-5" />
            </div>
            <p className="text-sm">
              <span >{chrome.i18n.getMessage('stats_participationMessage')}</span>
            </p>
          </div>

          {/* Dark tiles grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Earnings */}
            <div className="bg-brand-darkblue text-white border border-brand-grey px-4 py-5">
              <p className="text-xs opacity-80">{chrome.i18n.getMessage('stats_earnings')}</p>
              <p className="mt-1 text-3xl font-candu tracking-wide">${metrics.userEarnings}</p>
            </div>
            {/* Global Earnings */}
            <div className="bg-brand-darkblue text-white border border-brand-grey px-4 py-5">
              <p className="text-xs opacity-80">{chrome.i18n.getMessage('stats_globalEarnings')}</p>
              <p className="mt-1 text-3xl font-candu tracking-wide">{stats.earnings}</p>
            </div>
            {/* Total Requests */}
            <div className="bg-brand-darkblue text-white border border-brand-grey px-4 py-5">
              <p className="text-xs opacity-80">{chrome.i18n.getMessage('stats_totalRequests')}</p>
              <p className="mt-1 text-3xl font-candu tracking-wide">{stats.requestsTotal}</p>
            </div>
            {/* Trees Planted (global) */}
            <div className="bg-brand-darkblue text-white border border-brand-grey px-4 py-5">
              <p className="text-xs opacity-80">{chrome.i18n.getMessage('stats_treesPlanted')}</p>
              <p className="mt-1 text-3xl font-candu tracking-wide">{stats.treesPlanted ?? 0}</p>
            </div>
          </div>

          {/* Light grey summary cards */}
          <div className="space-y-3">
            <div className="bg-brand-grey border border-brand-darkblue px-5 py-4">
              <p className="text-sm text-brand-darkblue">{chrome.i18n.getMessage('stats_earnings')}</p>
              <p className="mt-1 text-3xl text-brand-darkblue font-candu tracking-wide">${metrics.userEarnings}</p>
            </div>
            <div className="bg-brand-grey border border-brand-darkblue px-5 py-4">
              <p className="text-sm text-brand-darkblue">{chrome.i18n.getMessage('stats_globalEarnings')}</p>
              <p className="mt-1 text-3xl text-brand-darkblue font-candu tracking-wide">{stats.earnings}</p>
            </div>
            {/* Seeds collected (user) */}
            <div className="bg-brand-grey border border-brand-darkblue px-5 py-4">
              <p className="text-sm text-brand-darkblue">{chrome.i18n.getMessage('stats_seedsCollected')}</p>
              <p className="mt-1 text-3xl text-brand-darkblue font-candu tracking-wide">{Math.floor(metrics.userProgress * SEEDS_PER_TREE)}</p>
              <p className="text-xs text-brand-darkblue/80 mt-1">{chrome.i18n.getMessage('stats_seedsPerTreeRule')}</p>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};