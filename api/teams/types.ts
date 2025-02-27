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

export interface CreateTeamParams {
    name: string;
    userId: string;
    initialRequests: number;
}