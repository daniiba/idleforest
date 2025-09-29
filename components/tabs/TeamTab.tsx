import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Users, Plus, LogOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import TeamCreationModal from '../TeamCreationModal';
import { useAuth } from "~context/AuthProvider";
import { useTeams } from "~api/queries";
import { useJoinTeam, useLeaveTeam, useDeleteTeam } from "~api/mutations";
import type { TeamManagementProps, TeamTabProps } from '~api/types';

const LoadingSkeleton = () => (
	<Card className="p-6 bg-brand-grey border border-brand-darkblue rounded-none">
		<div className="space-y-6">
			<div>
				<div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2" />
				<div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
			</div>
			<div>
				<div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
				<div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
			</div>
			<div>
				<div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-4" />
				<div className="space-y-2">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
					))}
				</div>
			</div>
		</div>
	</Card>
);

const TeamManagement: React.FC<TeamManagementProps> = ({ isCreator, onLeave, onDelete }) => {
	const [showLeaveDialog, setShowLeaveDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [loading, setLoading] = useState(false);

	return (
		<>
			<div className="flex gap-2 mt-6 pt-6 border-t border-brand-darkblue">
				<Button
					variant="outline"
					className="text-red-600 hover:bg-red-50 rounded-none uppercase font-candu tracking-wide border border-brand-darkblue"
					onClick={() => setShowLeaveDialog(true)}
				>
					<LogOut className="h-4 w-4 mr-2" />
					{chrome.i18n.getMessage('team_leaveTeam')}
				</Button>
				{isCreator && (
					<Button
						variant="outline"
						className="text-red-600 hover:bg-red-50 rounded-none uppercase font-candu tracking-wide border border-brand-darkblue"
						onClick={() => setShowDeleteDialog(true)}
					>
						<Trash2 className="h-4 w-4 mr-2" />
						{chrome.i18n.getMessage('team_deleteTeam')}
					</Button>
				)}
			</div>

			<AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{chrome.i18n.getMessage('team_leaveTeamTitle')}</AlertDialogTitle>
						<AlertDialogDescription>
							{chrome.i18n.getMessage('team_leaveTeamDescription')}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>{chrome.i18n.getMessage('team_cancel')}</AlertDialogCancel>
						<AlertDialogAction
							onClick={async () => {
								setLoading(true);
								await onLeave();
								setLoading(false);
								setShowLeaveDialog(false);
							}}
							className="bg-red-600 hover:bg-red-700"
						>
							{loading ? chrome.i18n.getMessage('team_leaving') : chrome.i18n.getMessage('team_leaveTeam')}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{chrome.i18n.getMessage('team_deleteTeamTitle')}</AlertDialogTitle>
						<AlertDialogDescription>
							{chrome.i18n.getMessage('team_deleteTeamDescription')}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>{chrome.i18n.getMessage('team_cancel')}</AlertDialogCancel>
						<AlertDialogAction
							onClick={async () => {
								setLoading(true);
								await onDelete();
								setLoading(false);
								setShowDeleteDialog(false);
							}}
							className="bg-red-600 hover:bg-red-700"
						>
							{loading ? chrome.i18n.getMessage('team_deleting') : chrome.i18n.getMessage('team_deleteTeam')}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

const TeamTab: React.FC<TeamTabProps> = ({ team }) => {
	const [showCreateTeam, setShowCreateTeam] = useState(false);
	const [selectedTeam, setSelectedTeam] = useState<any>(null);
	const [showAllMembers, setShowAllMembers] = useState(false);
	const { user } = useAuth();
	const { data: availableTeams, isLoading } = useTeams();
	
	const joinTeam = useJoinTeam();
	const leaveTeam = useLeaveTeam();
	const deleteTeam = useDeleteTeam();

	const handleJoinTeam = async (teamId: string) => {
		joinTeam.mutate({ 
			teamId, 
			userId: user?.id!
			 
		});
	};

	const handleLeaveTeam =  async () => {
		await leaveTeam.mutateAsync({ 
			teamId: team?.id!, 
			userId: user?.id! 
		});
	};

	const handleDeleteTeam =  async () => {
		await deleteTeam.mutateAsync({ 
			teamId: team?.id! 
		});
	};

	// Sort teams by member count (descending)
	const sortedAvailableTeams = (availableTeams ?? [])
		.slice()
		.sort((a, b) => (b.team_members?.length || 0) - (a.team_members?.length || 0));

	const otherTeamsSorted = sortedAvailableTeams.filter((t) => t.id !== team?.id);

	if (!team && isLoading) {
		return <LoadingSkeleton />;
	}

	if (!team && !isLoading) {
		return (
			<div className="space-y-4">
				<Card className="p-6 text-center bg-brand-grey border border-brand-darkblue rounded-none">
					<Users className="h-12 w-12 mx-auto mb-4 text-brand-darkblue" />
					<h3 className="text-lg font-medium text-brand-darkblue">{chrome.i18n.getMessage('team_noTeamYet')}</h3>
					<p className="text-brand-darkblue/80 mb-4">{chrome.i18n.getMessage('team_noTeamDescription')}</p>
					<Button 
						onClick={() => setShowCreateTeam(true)}
						className="inline-flex items-center gap-2 mb-4 bg-brand-darkblue hover:brightness-110 text-white uppercase font-candu tracking-wide"
					>
						<Plus className="h-4 w-4" />
						{chrome.i18n.getMessage('team_createTeam')}
					</Button>
				</Card>

				<div className="space-y-4">
					<h3 className="text-lg font-medium text-brand-darkblue">{chrome.i18n.getMessage('team_availableTeams')}</h3>
					{sortedAvailableTeams.map((availableTeam) => (
						<Card key={availableTeam.id} className="p-4 bg-brand-grey border border-brand-darkblue rounded-none">
							<div className="flex items-center justify-between">
								<div>
									<h4 className="font-medium text-brand-darkblue">{availableTeam.name}</h4>
									<p className="text-xs text-brand-darkblue/80">{chrome.i18n.getMessage('team_creatorLabel')}</p>
									<p className="text-sm text-brand-darkblue/80">
										{availableTeam.team_members?.length || 0} members
									</p>
								</div>
								<Button
									className="bg-brand-darkblue hover:brightness-110 text-white uppercase font-candu tracking-wide"
									onClick={() => handleJoinTeam(availableTeam.id)}
									disabled={joinTeam.isPending}
								>
									{chrome.i18n.getMessage('team_joinTeam')}
								</Button>
							</div>
						</Card>
					))}
				</div>

				<TeamCreationModal 
					open={showCreateTeam} 
					onOpenChange={setShowCreateTeam}
				/>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<Card className="p-6 bg-brand-grey border border-brand-darkblue rounded-none">
				{isLoading ? (
					<LoadingSkeleton />
				) : (
					<div className="space-y-6">
						{/* Team display section */}
						<div>
							<Label className="text-brand-darkblue">{chrome.i18n.getMessage('team_teamName')}</Label>
							<p className="text-lg font-medium text-brand-darkblue">{team.name}</p>
						</div>
						<div>
							<Label className="text-brand-darkblue">{chrome.i18n.getMessage('team_created')}</Label>
							<p className="text-lg text-brand-darkblue">{new Date(team.created_at).toLocaleDateString()}</p>
						</div>
						<div>
							<Label className="mb-2 block text-brand-darkblue">{chrome.i18n.getMessage('team_teamMembers')}</Label>
							<div className="space-y-2">
								{(showAllMembers ? team.team_members : team.team_members?.slice(0, 5))?.map((member) => (
									<div key={member.id} className="flex items-center justify-between p-2 bg-brand-grey border border-brand-darkblue rounded-none">
										<span>
											{member.profiles?.display_name || 'Unknown User'}
										</span>
										<span className="text-sm text-brand-darkblue/80">
											{chrome.i18n.getMessage('team_joinedOn', [new Date(member.joined_at).toLocaleDateString()])}
										</span>
									</div>
								))}
								{(team.team_members?.length || 0) > 5 && (
									<Button
										variant="outline"
										className="rounded-none uppercase font-candu tracking-wide border border-brand-darkblue"
										onClick={() => setShowAllMembers((v) => !v)}
									>
										{showAllMembers
											? (chrome.i18n.getMessage('team_showLessMembers') || 'Show less')
											: (chrome.i18n.getMessage('team_showAllMembers') || 'Show all members')}
									</Button>
								)}
							</div>
						</div>
						{team && (
							<TeamManagement
								isCreator={team.created_by === user?.id}
								onLeave={handleLeaveTeam}
								onDelete={handleDeleteTeam}
							/>
						)}
					</div>
				)}
			</Card>

			<div className="space-y-4">
				<h3 className="text-lg font-medium text-brand-darkblue">{chrome.i18n.getMessage('team_otherAvailableTeams')}</h3>
				{otherTeamsSorted.map((availableTeam) => (
					<Card 
						key={availableTeam.id} 
						className={`p-4 cursor-pointer bg-brand-grey border border-brand-darkblue rounded-none ${selectedTeam?.id === availableTeam.id ? 'ring-2 ring-brand-darkblue' : ''}`}
						onClick={() => setSelectedTeam(selectedTeam?.id === availableTeam.id ? null : availableTeam)}
					>
						<div className="flex items-center justify-between">
							<div>
								<h4 className="font-medium text-brand-darkblue">{availableTeam.name}</h4>
								<p className="text-sm text-brand-darkblue/80">
									{availableTeam.team_members?.length || 0} members
								</p>
							</div>
						</div>
						{selectedTeam?.id === availableTeam.id && (
							<div className="mt-4 pt-4 border-t border-brand-darkblue">
								<div className="space-y-2">
									<p className="text-sm font-medium text-brand-darkblue">{chrome.i18n.getMessage('team_teamPoints')}: {availableTeam.total_points?.toLocaleString() || 0}</p>
									<div className="space-y-1">
										<p className="text-sm font-medium text-brand-darkblue">{chrome.i18n.getMessage('team_members')}:</p>
										{availableTeam.team_members?.map((member: any) => (
											<p key={member.id} className="text-sm text-brand-darkblue/80">
												{member.profiles?.display_name || 'Unknown User'}
											</p>
										))}
									</div>
								</div>
							</div>
						)}
					</Card>
				))}
			</div>
		</div>
	);
};

export default TeamTab;
