import { login, getMe, register } from "@/services/auth.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useAuth = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const userQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled,
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push("/");
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push("/");
    },
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
  };
};