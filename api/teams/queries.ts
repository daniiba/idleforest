import { useQuery } from '@tanstack/react-query';
import { supabase } from "~core/supabase";
import type { Team, Profile, TeamMember } from '~api/types';

export const fetchTeams = async () => {
	const { data: teams, error } = await supabase.from('teams').select(`
		*,
		team_members (
			id,
			user_id,
			joined_at,
			initial_requests
		)
	`);

	if (error) throw error;

	if (teams) {
		const userIds = [...new Set(teams.flatMap((t: Team) => t.team_members?.map((m: TeamMember) => m.user_id) || []))];
		const { data: profiles } = await supabase.from('profiles').select('*').in('user_id', userIds);

		return teams.map((team: Team) => ({
			...team,
			team_members: team.team_members?.map((member: TeamMember) => ({
				...member,
				profiles: profiles?.find((p: Profile) => p.user_id === member.user_id)
			})) || []
		}));
	}
	return [];
};


export const useTeams = () => {
	return useQuery({
		queryKey: ['teams'],
		queryFn: fetchTeams
	});
};