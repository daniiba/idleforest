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
		<Card className="p-6">
			<div className="space-y-4">
				<div>
					<Label>Display Name</Label>
					<p className="text-lg">{profile?.display_name}</p>
				</div>
				<div>
					<Label>Member Since</Label>
					<p className="text-lg">{new Date(profile?.created_at).toLocaleDateString()}</p>
				</div>
				<Button 
					className="w-full" 
					onClick={handleLogout}
					disabled={loading}
				>
					{loading ? "Logging out..." : "Logout"}
				</Button>
			</div>
		</Card>
	);
};

export default ProfileTab;