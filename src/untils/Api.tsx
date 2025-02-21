import axios from 'axios';
import { HOST_BE } from '../common/Common';
import { toastError, toastWarning } from './Logic';

const api = axios.create({
    baseURL: HOST_BE,
});
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const { response } = error;
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            localStorage.removeItem('token');
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await api.post('/auth/refreshToken', { refreshToken: refreshToken });

            if (response.status === 200) {
                const { accessToken } = response.data;
                localStorage.setItem('token', accessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                return api(originalRequest);
            }
        }
        if (response && response.status === 429) {
            // Thay đổi mã trạng thái thành 200 và trả về thông báo

            return Promise.resolve({
                status: 200,
                data: { success: false, message: 'MORE REQUEST' },
            });
        }

        // Kiểm tra mã trạng thái
        if (response && response.status === 409) {
            // Thay đổi mã trạng thái thành 200 và trả về thông báo

            return Promise.resolve({
                status: 200,
                data: { success: false, message: response.data.message },
            });
        }
        if (response && response.status === 502) {
            toastError('Fail');
            return Promise.resolve({
                status: 200,
                data: { success: false, message: '502' },
            });
        }
        if (response && response.status === 404) {
            // window.location.href = '/err404';

            return Promise.resolve({
                status: 200,
                data: { success: false, message: '404' },
            });
        }
        if (response && response.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login-register';
            return Promise.resolve({
                status: 200,
                data: { success: false, message: '403' },
            });
        }
        if (response && response.status === 500) {
            toastError('Fail');
            return Promise.resolve({
                status: 200,
                data: { success: false, message: '500' },
            });
        }
        // Trả lại lỗi cho các mã trạng thái khác
        return Promise.reject(error);
        // return Promise.resolve({
        //     status: 200,
        //     data: { success: false, message: 'err' },
        // });
    },
);
export const GetGuestApi = (url: string, data?: any) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${HOST_BE}${url}`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: data ? data : {},
    };

    return api.request(config);
};
export const PostGuestApi = (url: string, data: object) => {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${HOST_BE}${url}`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: data,
    };

    return api.request(config);
};
export const GetApi = (url: string, token: string | null, data?: any) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${HOST_BE}${url}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        data: data ? data : {},
    };

    return api.request(config);
};

export const PostApi = (url: string, token: string | null, data: any) => {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${HOST_BE}${url}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        data: data,
    };

    return api.request(config);
};
