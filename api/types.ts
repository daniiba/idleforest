import type { User } from '@supabase/auth-helpers-nextjs';
import Mellowtel from "mellowtel"
export interface Profile {
	id: string;
	user_id: string;
	display_name: string;
	created_at: string;
}

export interface TeamMember {
	id: string;
	user_id: string;
	joined_at: string;
	initial_requests: number;
	profiles?: Profile;
}

export interface Team {
	id: string;
	name: string;
	created_at: string;
	total_points: number;
	team_members: TeamMember[];
	created_by: string;
}

export interface ReferralStats {
	id: string;
	user_id: string;
	total_referrals: number;
	total_points: number;
	total_earnings: number;
	pending_earnings: number;
	donated_amount: number;
	created_at: string;
}

export interface ReferralCode {
	id: string;
	user_id: string;
	code: string;
	created_at: string;
	uses: number;
}

export interface AuthContextType {
	user: User | null;
	profile: Profile | null;
	team: Team | null;
	referralStats: ReferralStats | null;
	referralCode: ReferralCode | null;
	loading: boolean;
	mellowtel: Mellowtel;
}

export interface TeamManagementProps {
	isCreator: boolean;
	onLeave: () => Promise<void>;
	onDelete: () => Promise<void>;
}

export interface TeamTabProps {
	team?: Team;
}

export interface TeamCreationModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export interface ReferralTabProps {
	referralStats: ReferralStats | null;
	referralCode: ReferralCode | null;
}

export type TabType = "team" | "profile" | "referral" | "planting" | "socials";

export interface NavigationProps {
	activeTab: TabType;
	onTabChange: (tab: TabType) => void;
}

export interface ProfileTabProps {
	profile: Profile | null;
}

export interface ShareModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	referralCode?: string;
	onShare?: (platform: string) => void;
	onRate?: () => void;
	helpTasks?: {
		shared: boolean;
		rated: boolean;
	};
}

export interface AuthModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export interface CreateTeamParams {
	name: string;
	userId: string;
	initialRequests: number;
}