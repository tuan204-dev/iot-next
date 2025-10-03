import { IAction } from "@/types/action"
import { axiosInstance } from "."

export const getAllActions = async () => {
    const { data } = await axiosInstance.get<IAction[]>('/actions');

    return data;
}