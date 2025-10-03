import { ISensor } from "@/types";
import { axiosInstance } from ".";

export const getAllSensors = async () => {
    const { data } = await axiosInstance.get<ISensor[]>('/sensors');
    return data;
}