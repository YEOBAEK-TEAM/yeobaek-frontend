import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileImage } from "@/api/my";

export const useUpdateProfileImage = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: updateProfileImage,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["mypage"] });
    },
  });
};
