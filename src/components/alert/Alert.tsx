import axios from 'axios';
import Swal from 'sweetalert2';
export const AlertLogout = (logOut: any) => {
    Swal.fire({
        title: 'Bạn có muốn thoát?',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
    }).then((result: any) => {
        if (result.isConfirmed) {
            logOut();
        } else if (result.isDenied) {
        }
    });
};

export const AlertSaveInfo = (save: any) => {
    Swal.fire({
        title: 'Đồng ý lưu?',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
    }).then((result: any) => {
        if (result.isConfirmed) {
            save();
        } else if (result.isDenied) {
        }
    });
};

export const AlertAddShop = (createShop: any) => {
    Swal.fire({
        title: 'Tạo mới shop ?',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
    }).then((result: any) => {
        if (result.isConfirmed) {
            createShop();
        } else if (result.isDenied) {
        }
    });
};
export const AlertLogin = () => {
    Swal.fire({
        title: 'Đăng nhập?',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
    }).then((result: any) => {
        if (result.isConfirmed) {
            window.location.href = '/login-register';
        } else if (result.isDenied) {
        }
    });
};
export const AlertChangeOrder = (handleChange: any) => {
    Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: 'Bạn sẽ không thể khôi phục trong vòng 24h!',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
    }).then((result: any) => {
        if (result.isConfirmed) {
            handleChange();
        } else if (result.isDenied) {
        }
    });
};
export const AlertChangeOrderRefund = (handleChange: any) => {
    Swal.fire({
        title: 'Bạn có chắc chắn hoàn tiền?',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
    }).then((result: any) => {
        if (result.isConfirmed) {
            handleChange();
        } else if (result.isDenied) {
        }
    });
};
export const AlertBuy = (handleBuy: any) => {
    Swal.fire({
        title: 'Đồng ý mua',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
    }).then((result: any) => {
        if (result.isConfirmed) {
            handleBuy();
        } else if (result.isDenied) {
        }
    });
};
export const Alert = (handleBack: any, title: string) => {
    Swal.fire({
        title: title,
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
    }).then((result: any) => {
        if (result.isConfirmed) {
            handleBack();
        } else if (result.isDenied) {
        }
    });
};
