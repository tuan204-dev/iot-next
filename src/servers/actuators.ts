import { IActuator } from "@/types/actuator"
import { axiosInstance } from "."

export const getAllActuators = async () => {
    const { data } = await axiosInstance.get<IActuator[]>('/actuators');

    return data;
}