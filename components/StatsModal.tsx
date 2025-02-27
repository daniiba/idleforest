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
      <DialogContent className="w-[480px] max-h-[85vh] rounded-lg overflow-y-auto p-6">
<DialogHeader className="">
  <DialogTitle className="text-xl font-semibold text-gray-900">Forest Statistics</DialogTitle>
</DialogHeader>
<div className="space-y-5">
  <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
	<p className="flex items-center gap-3 text-blue-700">
	  <InfoIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
	  <span className="text-sm font-medium">
		Your participation matters! Even with low initial requests, you're helping grow our early-stage network. 
		As we expand, you'll see increased activity and greater environmental impact.
	  </span>
	</p>
  </div>
          {/* Earnings Section */}
          <div className="grid grid-cols-2 gap-4 bg-gradient-to-br from-green-50/50 to-white p-4 rounded-lg border border-gray-100">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500">Your Earnings</p>
              <h3 className="text-2xl font-semibold text-gray-900">${metrics.userEarnings}</h3>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-xs font-medium text-gray-500">Global Earnings</p>
              <h3 className="text-2xl font-semibold text-gray-900">{stats.earnings}</h3>
            </div>
            <div className="col-span-2 pt-3 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500">Global Requests</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.requestsTotal.toLocaleString()}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-200 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-50 rounded-md">
                  <Wind className="h-3.5 w-3.5 text-gray-600" />
                </div>
                <p className="text-xs font-medium text-gray-500">Your Requests</p>
              </div>
              <p className="text-xl font-semibold text-gray-900">{userLifetimeRequests.toLocaleString()}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-200 transition-colors">
  <div className="flex items-center gap-3 mb-2">
	<div className="p-2 bg-gray-50 rounded-md">
	  <Sprout className="h-3.5 w-3.5 text-gray-600" />
	</div>
	<p className="text-xs font-medium text-gray-500">Seeds Planted</p>
  </div>
  <p className="text-xl font-semibold text-gray-900">
	{Math.floor(metrics.userProgress * SEEDS_PER_TREE)}
  </p>
  <p className="text-xs text-gray-500 mt-1">100 seeds = 1 tree</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-200 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-50 rounded-md">
                  <TreePine className="h-3.5 w-3.5 text-gray-600" />
                </div>
                <p className="text-xs font-medium text-gray-500">Your Trees</p>
              </div>
              <p className="text-xl font-semibold text-gray-900">{Math.floor(metrics.userProgress)}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-200 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-50 rounded-md">
                  <Leaf className="h-3.5 w-3.5 text-gray-600" />
                </div>
                <p className="text-xs font-medium text-gray-500">CO₂ Saved</p>
              </div>
              <p className="text-xl font-semibold text-gray-900">{metrics.personalCo2Saved.toFixed(1)}kg</p>
            </div>
  </div>

  {/* Referral Stats Section */}
  <div className="mt-5 bg-white p-4 rounded-lg border border-gray-200 hover:border-green-200 transition-colors">
	<div className="flex items-center gap-3 mb-3">
	  <div className="p-2 bg-gray-50 rounded-md">
		<Users className="h-3.5 w-3.5 text-gray-600" />
	  </div>
	  <p className="text-sm font-medium text-gray-900">Referral Impact</p>
	</div>
	
	<div className="grid grid-cols-2 gap-4">
	  <div>
		<p className="text-xs text-gray-500">Friends Joined</p>
		<p className="text-xl font-semibold text-gray-900">
		  {metrics.referralCount || 0}
		</p>
	  </div>
	  <div>
		<p className="text-xs text-gray-500">Bonus Seeds</p>
		<p className="text-xl font-semibold text-gray-900">
		  {(metrics.referralCount || 0) * 10}
		</p>
	  </div>
	</div>
  </div>
  </div>
  </DialogContent>
  </Dialog>
	);
};