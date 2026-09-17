import { useQuery } from "@tanstack/react-query";

import { getOngoingTraining } from "@/api/training/ongoingTraining";

export const useOngoingTraining = () => {
  return useQuery({
    queryKey: ["trainings", "ongoing"],
    queryFn: () => getOngoingTraining(),
  });
};
