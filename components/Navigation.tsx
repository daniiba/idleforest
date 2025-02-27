import React from 'react';
import { Button } from "@/components/ui/button";
import { User, Users, Share2, Leaf } from "lucide-react";
import type { TabType } from "~api/types";

interface NavigationProps {
	activeTab: TabType;
	onTabChange: (tab: TabType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {

	return (
		<div className="flex justify-center gap-2 mb-6 bg-white/50 p-2 rounded-lg">
			<Button
				variant={activeTab === 'planting' ? 'default' : 'ghost'}
				className="flex gap-2 items-center"
				onClick={() => onTabChange('planting')}
			>
				<Leaf className="h-4 w-4" />
				Planting
			</Button>
			<Button
				variant={activeTab === 'profile' ? 'default' : 'ghost'}
				className="flex gap-2 items-center"
				onClick={() => onTabChange('profile')}
			>
				<User className="h-4 w-4" />
				Profile
			</Button>
			<Button
				variant={activeTab === 'team' ? 'default' : 'ghost'}
				className="flex gap-2 items-center"
				onClick={() => onTabChange('team')}
			>
				<Users className="h-4 w-4" />
				Team
			</Button>
			<Button
				variant={activeTab === 'referral' ? 'default' : 'ghost'}
				className="flex gap-2 items-center"
				onClick={() => onTabChange('referral')}
			>
				<Share2 className="h-4 w-4" />
				Referral
			</Button>
		</div>
	);
};

export default Navigation;