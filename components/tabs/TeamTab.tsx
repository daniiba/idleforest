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
	<Card className="p-6">
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
			<div className="flex gap-2 mt-6 pt-6 border-t">
				<Button
					variant="outline"
					className="text-red-600 hover:bg-red-50"
					onClick={() => setShowLeaveDialog(true)}
				>
					<LogOut className="h-4 w-4 mr-2" />
					Leave Team
				</Button>
				{isCreator && (
					<Button
						variant="outline"
						className="text-red-600 hover:bg-red-50"
						onClick={() => setShowDeleteDialog(true)}
					>
						<Trash2 className="h-4 w-4 mr-2" />
						Delete Team
					</Button>
				)}
			</div>

			<AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Leave Team</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to leave this team? You'll lose access to team features.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={async () => {
								setLoading(true);
								await onLeave();
								setLoading(false);
								setShowLeaveDialog(false);
							}}
							className="bg-red-600 hover:bg-red-700"
						>
							{loading ? "Leaving..." : "Leave Team"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Team</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the team and remove all members.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={async () => {
								setLoading(true);
								await onDelete();
								setLoading(false);
								setShowDeleteDialog(false);
							}}
							className="bg-red-600 hover:bg-red-700"
						>
							{loading ? "Deleting..." : "Delete Team"}
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





	if (!team && isLoading) {
		return <LoadingSkeleton />;
	}

	if (!team && !isLoading) {
		return (
			<div className="space-y-4">
				<Card className="p-6 text-center">
					<Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
					<h3 className="text-lg font-medium mb-2">No Team Yet</h3>
					<p className="text-gray-500 mb-4">Create a new team or join an existing one</p>
					<Button 
						onClick={() => setShowCreateTeam(true)}
						className="inline-flex items-center gap-2 mb-4"
					>
						<Plus className="h-4 w-4" />
						Create Team
					</Button>
				</Card>

				<div className="space-y-4">
					<h3 className="text-lg font-medium">Available Teams</h3>
					{availableTeams.map((availableTeam) => (
						<Card key={availableTeam.id} className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<h4 className="font-medium">{availableTeam.name}</h4>
									<p className="text-sm text-gray-500">
										{availableTeam.team_members?.length || 0} members
									</p>
								</div>
								<Button
									variant="outline"
									onClick={() => handleJoinTeam(availableTeam.id)}
									disabled={joinTeam.isPending}
								>
									Join Team
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
			<Card className="p-6">
				{isLoading ? (
					<LoadingSkeleton />
				) : (
					<div className="space-y-6">
						{/* Team display section */}
						<div>
							<Label>Team Name</Label>
							<p className="text-lg font-medium">{team.name}</p>
						</div>
						<div>
							<Label>Total Points</Label>
							<p className="text-lg">{team.total_points.toLocaleString()}</p>
						</div>
						<div>
							<Label className="mb-2 block">Team Members</Label>
							<div className="space-y-2">
								{team.team_members?.map((member) => (
									<div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
										<span>
											{member.profiles?.display_name || 'Unknown User'}
										</span>
										<span className="text-sm text-gray-500">
											Joined {new Date(member.joined_at).toLocaleDateString()}
										</span>
									</div>
								))}
							</div>
						</div>
						{/* Team management section */}
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
				<h3 className="text-lg font-medium">Other Available Teams</h3>
				{availableTeams?.filter(availableTeam => availableTeam.id !== team?.id).map((availableTeam) => (
					<Card 
						key={availableTeam.id} 
						className={`p-4 cursor-pointer ${selectedTeam?.id === availableTeam.id ? 'ring-2 ring-blue-500' : ''}`}
						onClick={() => setSelectedTeam(selectedTeam?.id === availableTeam.id ? null : availableTeam)}
					>
						<div className="flex items-center justify-between">
							<div>
								<h4 className="font-medium">{availableTeam.name}</h4>
								<p className="text-sm text-gray-500">
									{availableTeam.team_members?.length || 0} members
								</p>
							</div>
						</div>
						{selectedTeam?.id === availableTeam.id && (
							<div className="mt-4 pt-4 border-t">
								<div className="space-y-2">
									<p className="text-sm font-medium">Team Points: {availableTeam.total_points?.toLocaleString() || 0}</p>
									<div className="space-y-1">
										<p className="text-sm font-medium">Members:</p>
										{availableTeam.team_members?.map((member: any) => (
											<p key={member.id} className="text-sm text-gray-600">
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
