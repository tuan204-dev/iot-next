import { IRecentSensorData } from "@/types";
import { axiosInstance, ISensorDataParams } from ".";

export const downloadSensorDataCSV = async (params: ISensorDataParams = {}) => {
    const { data } = await axiosInstance.post('/sensor-data/download-csv', params, {
        responseType: 'blob',
    });

    return data;
}

export const getRecentSensorData = async () => {
    const { data } = await axiosInstance.get<{ data: IRecentSensorData }>('/sensor-data/recent');
    return data?.data;
}