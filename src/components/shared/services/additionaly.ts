import { axiosInstance } from "./instance";
import { ApiRoutes } from "./constants";
import { Additionally } from "@prisma/client";

export const getAll = async (): Promise<Additionally[]> => {
  return (await axiosInstance.get<Additionally[]>(ApiRoutes.ADDITIONALLY)).data;
};
