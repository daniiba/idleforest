import React from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { supabase } from "~core/supabase";
import { useQueryClient } from '@tanstack/react-query';
import type { ReferralStats, ReferralCode, ReferralTabProps } from "~api/types";

const ReferralTab: React.FC<ReferralTabProps> = ({ referralStats, referralCode }) => {
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
			queryClient.invalidateQueries(['referralCode', user.id]);
		}
	};

	return (
		<div className="space-y-6">
			<Card className="p-6">
				<h3 className="font-medium mb-4">Referral Stats</h3>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label>Total Referrals</Label>
						<p className="text-lg">{referralStats?.total_referrals||0}</p>
					</div>
					<div>
						<Label>Total Referral Requests</Label>
						<p className="text-lg">{referralStats?.total_requests||0}</p>
					</div>
				</div>
			</Card>

			<Card className="p-6">
				<h3 className="font-medium mb-4">Your Referral Code</h3>
				{referralCode ? (
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<code className="flex-1 p-2 bg-gray-50 rounded">{referralCode?.code}</code>
							<Button size="icon" variant="ghost" onClick={handleCopyCode}>
								<Copy className="h-4 w-4" />
							</Button>
						</div>
						<div className="text-sm text-gray-500">
							Used {referralCode.uses} times since {new Date(referralCode?.created_at).toLocaleDateString()}
						</div>
					</div>
				) : (
					<div className="space-y-4">
						<p className="text-gray-500">No referral code generated yet</p>
						<Button onClick={generateReferralCode}>Generate Referral Code</Button>
					</div>
				)}
			</Card>
		</div>
	);
};

export default ReferralTab;