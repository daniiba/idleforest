import React from 'react';
import { Button } from "@/components/ui/button";
import { User, Users, Share2, Leaf, MessageCircle } from "lucide-react";
import type { TabType } from "~api/types";

interface NavigationProps {
	activeTab: TabType;
	onTabChange: (tab: TabType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {

	return (
		<div className="flex justify-start gap-2 mb-6 bg-white/50 p-2 rounded-lg overflow-x-auto">
			<Button
				variant={activeTab === 'planting' ? 'default' : 'ghost'}
				className="flex gap-2 items-center whitespace-nowrap shrink-0"
				onClick={() => onTabChange('planting')}
			>
				<Leaf className="h-4 w-4" />
				{chrome.i18n.getMessage('navigation_planting')}
			</Button>
			<Button
				variant={activeTab === 'profile' ? 'default' : 'ghost'}
				className="flex gap-2 items-center whitespace-nowrap shrink-0"
				onClick={() => onTabChange('profile')}
			>
				<User className="h-4 w-4" />
				{chrome.i18n.getMessage('navigation_profile')}
			</Button>
			<Button
				variant={activeTab === 'team' ? 'default' : 'ghost'}
				className="flex gap-2 items-center whitespace-nowrap shrink-0"
				onClick={() => onTabChange('team')}
			>
				<Users className="h-4 w-4" />
				{chrome.i18n.getMessage('navigation_team')}
			</Button>
			<Button
				variant={activeTab === 'referral' ? 'default' : 'ghost'}
				className="flex gap-2 items-center whitespace-nowrap shrink-0"
				onClick={() => onTabChange('referral')}
			>
				<Share2 className="h-4 w-4" />
				{chrome.i18n.getMessage('navigation_referral')}
			</Button>
			<Button
				variant={activeTab === 'socials' ? 'default' : 'ghost'}
				className="flex gap-2 items-center whitespace-nowrap shrink-0"
				onClick={() => onTabChange('socials')}
			>
				<MessageCircle className="h-4 w-4" />
				{chrome.i18n.getMessage('navigation_socials') || 'Socials'}
			</Button>
		</div>
	);
};

export default Navigation;