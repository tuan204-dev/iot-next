import { IPaginatedResponse } from "@/types";
import { axiosInstance } from "."
import { IActionHistory } from "@/types/action-history";

interface IActionHistoryParams {
    page?: number;
    size?: number;
    actuatorIds?: string[];
    actionIds?: string[];
    status?: string;
    queryName?: string;
    startDate?: number;
    endDate?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export const getActionHistories = async (p: IActionHistoryParams = {}) => {
    const { data } = await axiosInstance.post<IPaginatedResponse<IActionHistory>>('/action-histories/search', p);
    return data;
}

export const downloadActionHistoryCSV = async (params: IActionHistoryParams = {}) => {
    const { data } = await axiosInstance.post('/action-histories/download-csv', params, {
        responseType: 'blob',
    });

    return data;
}

export const getDeviceCountDay = async () => {
    const { data } = await axiosInstance.get('/action-histories/device-counts-today')

    return data?.devices;
}