import { axiosInstance } from "."

export const ping = async (): Promise<boolean> => {
    const { data } = await axiosInstance.get('/devices/ping');
    return data.status;
}