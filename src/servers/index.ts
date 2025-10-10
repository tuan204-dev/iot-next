import { IPaginatedResponse, ISensorData } from "@/types";
import axios from "axios";

export const axiosInstance = axios.create({
    // baseURL: "http://localhost:8000",
    baseURL: "https://zjvprhmg-8000.asse.devtunnels.ms",
})

interface ITriggerDeviceParams {
    actionId: number;
    actuatorId: number;
}

interface ITriggerDeviceResponse {
    status: string;
}

export const triggerDevice = async (params: ITriggerDeviceParams) => {
    const { data } = await axiosInstance.post<ITriggerDeviceResponse>('devices/trigger', params);

    return data;
}

export interface ISensorDataParams {
    page?: number;
    size?: number;
    sensorIds?: number[];
    unit?: string;
    startDate?: number;
    endDate?: number;
    startValue?: number;
    endValue?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}


export const getSensorData = async (params: ISensorDataParams = {}) => {
    const { data } = await axiosInstance.post<IPaginatedResponse<ISensorData>>('/sensor-data/search', params);
    return data;
}