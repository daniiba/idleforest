import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "~context/AuthProvider";
import { useCreateTeam } from "~api/mutations";
import type { TeamCreationModalProps } from "~api/types";


const TeamCreationModal: React.FC<TeamCreationModalProps> = ({ open, onOpenChange }) => {
	const [teamName, setTeamName] = useState("");
	const [error, setError] = useState("");
	const { user } = useAuth();
	
	const createTeam = useCreateTeam();

	const handleCreateTeam = async () => {
		if (!teamName.trim()) {
			setError(chrome.i18n.getMessage('team_teamNameRequired'));
			return;
		}

		try {
			setError("");
			
			await createTeam.mutateAsync({
				name: teamName,
				userId: user?.id!
			});
			onOpenChange(false)
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{chrome.i18n.getMessage('team_createTeamTitle')}</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					<div className="space-y-2">
						<Label htmlFor="team-name">{chrome.i18n.getMessage('team_teamName')}</Label>
						<Input
							id="team-name"
							value={teamName}
							onChange={(e) => setTeamName(e.target.value)}
							placeholder={chrome.i18n.getMessage('team_enterTeamName')}
						/>
					</div>
					<Button 
						className="w-full" 
						onClick={handleCreateTeam}
						disabled={createTeam.isPending}
					>
						{createTeam.isPending ? chrome.i18n.getMessage('team_creating') : chrome.i18n.getMessage('team_createTeam')}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default TeamCreationModal;
