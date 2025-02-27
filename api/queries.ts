import { useQuery } from '@tanstack/react-query';
import { supabase } from "~core/supabase";
import type { Team, Profile, TeamMember } from '~api/types';

const fetchTeams = async () => {
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

export const useSession = () => {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });
};

export const useProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      return data;
    },
    enabled: !!userId
  });
};

export const useTeam = (userId?: string) => {
  return useQuery({
    queryKey: ['userTeam', userId],
    queryFn: async () => {
      const { data: teamMember } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', userId)
        .single();

      if (!teamMember) return null;

      const { data: teamData } = await supabase
        .from('teams')
        .select(`
          *,
          team_members!inner (
            id,
            user_id,
            joined_at,
            initial_requests
          )
        `)
        .eq('id', teamMember.team_id)
        .single();

      if (!teamData) return null;

      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', teamData.team_members.map(m => m.user_id));

      return {
        ...teamData,
        team_members: teamData.team_members.map(member => ({
          ...member,
          profiles: profiles?.find(p => p.user_id === member.user_id)
        }))
      };
    },
    enabled: !!userId
  });
};

export const useReferralStats = (userId?: string) => {
  return useQuery({
    queryKey: ['referralStats', userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('referral_stats')
        .select('*')
        .eq('user_id', userId)
        .single();
      return data;
    },
    enabled: !!userId
  });
};

export const useReferralCode = (userId?: string) => {
  return useQuery({
    queryKey: ['referralCode', userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('user_id', userId)
        .single();
      return data;
    },
    enabled: !!userId
  });
};