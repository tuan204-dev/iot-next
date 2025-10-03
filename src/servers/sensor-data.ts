import { axiosInstance, ISensorDataParams } from ".";

export const downloadSensorDataCSV = async (params: ISensorDataParams = {}) => {
    const { data } = await axiosInstance.post('/sensor-data/download-csv', params, {
        responseType: 'blob',
    });

    return data;
}