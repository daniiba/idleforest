import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "~core/supabase";
import type { Profile, ProfileTabProps } from "~api/types";
import { useQueryClient } from '~node_modules/@tanstack/react-query/build/legacy';

export const ProfileTab: React.FC<ProfileTabProps> = ({ profile }) => {
	const queryClient = useQueryClient();

	const [loading, setLoading] = useState(false);

	const handleLogout = async () => {
		try {
			setLoading(true);
			await supabase.auth.signOut();

			queryClient.invalidateQueries({ queryKey: ['session'] });
		} catch (error) {
			console.error('Error logging out:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="p-6 bg-brand-grey border border-brand-darkblue rounded-none">
			<div className="space-y-4">
				<div>
					<Label className="text-brand-darkblue">{chrome.i18n.getMessage('profile_displayName')}</Label>
					<p className="text-lg text-brand-darkblue">{profile?.display_name}</p>
				</div>
				<div>
					<Label className="text-brand-darkblue">{chrome.i18n.getMessage('profile_memberSince')}</Label>
					<p className="text-lg text-brand-darkblue">{new Date(profile?.created_at).toLocaleDateString()}</p>
				</div>
				<Button 
					className="w-full bg-brand-darkblue hover:brightness-110 text-white uppercase font-candu tracking-wide" 
					onClick={handleLogout}
					disabled={loading}
				>
					{loading ? chrome.i18n.getMessage('profile_loggingOut') : chrome.i18n.getMessage('profile_logout')}
				</Button>
			</div>
		</Card>
	);
};

export default ProfileTab;