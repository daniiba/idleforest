import React from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { supabase } from "~core/supabase";
import { useQueryClient } from '@tanstack/react-query';
import type { ReferralStats, ReferralCode, ReferralTabProps } from "~api/types";

const ReferralTab: React.FC<ReferralTabProps> = ({ referralStats, referralCode }) => {
	const REFERRALS_FOR_TREE = 3;
	const referrals = referralStats?.total_referrals || 0;
	const treesEarned = Math.floor(referrals / REFERRALS_FOR_TREE);
	const progress = referrals % REFERRALS_FOR_TREE;
	const queryClient = useQueryClient();

	const STORE_URLS = {
		chrome: 'https://chromewebstore.google.com/detail/idle-forest-plant-trees-f/ofdclafhpmccdddnmfalihgkahgiomjk',
		website: 'https://idleforest.com'
	};

	const handleCopyCode = () => {
		if (referralCode) {
			// Create a referral link that goes through the website
			const referralLink = `${STORE_URLS.website}/install?ref=${referralCode.code}`;
			navigator.clipboard.writeText(referralLink);
		}
	};

	const generateReferralCode = async () => {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) return;

		// Generate a random 8-character code
		const code = Math.random().toString(36).substring(2, 10).toUpperCase();

		// Insert the new referral code
		const { error } = await supabase
			.from('referral_codes')
			.insert({
				user_id: user.id,
				code: code,
				uses: 0
			});

		if (!error) {
			// Invalidate the referral code query to trigger a refresh
			queryClient.invalidateQueries({ queryKey: ['referralCode', user.id] });
		}
	};

	return (
		<div className="space-y-6">
			<Card className="p-6 bg-brand-grey border border-brand-darkblue rounded-none">
				<h3 className="font-medium mb-2 text-brand-darkblue">{chrome.i18n.getMessage('referral_promo_title')}</h3>
				<p className="text-sm text-brand-darkblue/80 mb-4">{chrome.i18n.getMessage('referral_promo_description')}</p>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-brand-darkblue">{chrome.i18n.getMessage('referral_promo_progress')}</Label>
						<p className="text-lg text-brand-darkblue">{progress} / {REFERRALS_FOR_TREE}</p>
					</div>
					<div>
						<Label className="text-brand-darkblue">{chrome.i18n.getMessage('referral_promo_trees_earned')}</Label>
						<p className="text-lg text-brand-darkblue">{treesEarned}</p>
					</div>
				</div>
			</Card>
			<Card className="p-6 bg-brand-grey border border-brand-darkblue rounded-none">
				<h3 className="font-medium mb-4 text-brand-darkblue">{chrome.i18n.getMessage('referral_stats_title')}</h3>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-brand-darkblue">{chrome.i18n.getMessage('referral_total_referrals')}</Label>
						<p className="text-lg text-brand-darkblue">{referralStats?.total_referrals||0}</p>
					</div>
					<div>
						<Label className="text-brand-darkblue">{chrome.i18n.getMessage('referral_total_referral_requests')}</Label>
						<p className="text-lg text-brand-darkblue">{referralStats?.total_points || 0}</p>
					</div>
				</div>
			</Card>

			<Card className="p-6 bg-brand-grey border border-brand-darkblue rounded-none">
				<h3 className="font-medium mb-4 text-brand-darkblue">{chrome.i18n.getMessage('referral_yourCode')}</h3>
				{referralCode ? (
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<code className="flex-1 p-2 bg-brand-grey border border-brand-darkblue rounded-none text-brand-darkblue">{referralCode?.code}</code>
							<Button size="icon" variant="ghost" onClick={handleCopyCode} className="bg-brand-darkblue hover:brightness-110 text-white">
								<Copy className="h-4 w-4" />
							</Button>
						</div>
						<div className="text-sm text-brand-darkblue/80">
							{chrome.i18n.getMessage('referral_usedTimes', [referralCode.uses.toString(), new Date(referralCode?.created_at).toLocaleDateString()])}
						</div>
					</div>
				) : (
					<div className="space-y-4">
						<p className="text-brand-darkblue/80">{chrome.i18n.getMessage('referral_no_referral_code')}</p>
						<Button onClick={generateReferralCode} className="bg-brand-darkblue hover:brightness-110 text-white uppercase font-candu tracking-wide">
							{chrome.i18n.getMessage('referral_generate_referral_code')}
						</Button>
					</div>
				)}
			</Card>
		</div>
	);
};

export default ReferralTab;