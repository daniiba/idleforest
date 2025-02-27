import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "~core/supabase";

interface TeamMutationParams {
	teamId: string;
	userId: string;
}

interface CreateTeamParams {
	name: string;
	userId: string;
}


export const useCreateTeam = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: async ({ name, userId }: CreateTeamParams) => {
			const { data: team, error: teamError } = await supabase
				.from('teams')
				.insert([{ name, created_by: userId, total_points: 0 }])
				.select()
				.single();

			if (teamError) throw teamError;

			const { error: memberError } = await supabase
				.from('team_members')
				.insert([{
					team_id: team.id,
					user_id: userId
				}]);

			if (memberError) throw memberError;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['teams'] });
			
		}
	});
};

export const useJoinTeam = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: async ({ teamId, userId }: TeamMutationParams) => {
			const { error } = await supabase
				.from('team_members')
				.insert([{
					team_id: teamId,
					user_id: userId
				}]);

			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['teams'] });
			queryClient.invalidateQueries({ queryKey: ['userTeam'] });
			
		}
	});
};

export const useLeaveTeam = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
	  mutationFn: async ({ teamId, userId }: TeamMutationParams) => {
		const { error } = await supabase
		  .from('team_members')
		  .delete()
		  .match({ team_id: teamId, user_id: userId });
  
		if (error) throw error;
	  },
	  onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ['teams'] });
		queryClient.invalidateQueries({ queryKey: ['userTeam'] });
		
	  }
	});
  };

export const useDeleteTeam = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: async ({ teamId }: { teamId: string }) => {
			await supabase
				.from('team_members')
				.delete()
				.match({ team_id: teamId });

			const { error } = await supabase
				.from('teams')
				.delete()
				.match({ id: teamId });

			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['teams'] });
			
		}
	});
};