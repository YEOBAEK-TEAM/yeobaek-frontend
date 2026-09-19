import { useQuery } from "@tanstack/react-query";

import { getOngoingTraining } from "@/api/training/ongoingTraining";
import { toOngoingTraining } from "@/utils/training/toOngoingTraining";

export const useOngoingTraining = () =>
  useQuery({
    queryKey: ["trainings", "recommend"],
    queryFn: ({ signal }) => getOngoingTraining(signal),
    select: toOngoingTraining,
  });
