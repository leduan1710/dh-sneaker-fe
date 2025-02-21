declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_ID_CLIENT_GG: string; // Thêm các biến môi trường khác nếu cần
        REACT_APP_GOOGLE_CLIENT_SECRET: string;
        REACT_APP_YOUR_CLIENT_ID:string;
        REACT_APP_CLOUD_NAME_CD:string;
        REACT_APP_API_KEY_CD:string;
        REACT_APP_API_SECRET_CD:string;
        REACT_APP_PRESET_NAME_CD:string
    }
    
}

declare global{
    interface Window {
        paypal: any;
    }
}

export {};

