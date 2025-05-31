import { toast } from 'react-toastify';
import { passwordStrength } from 'check-password-strength';
import { set_number_cart, set_number_cart_from_zero } from '../reducers/Actions';
//format price
export const formatTitle = (title: string) => {
    if (!title) {
        return '';
    }
    return title
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
export const formatPrice = (amount: any) => {
    if (amount == 0) {
        return '0 đ';
    }
    if (amount) {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
};
export const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^0[0-9]{9}$/;
    return phoneRegex.test(phone);
};
export const formatCurrency = (value: any) => {
    return value.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};
export const shortedString = (input: string, length: number = 4) => {
    if (input.length <= length) {
        return input;
    }
    return input.slice(0, length) + '...';
};
/// filter input
export const filterSpecialInput = (value: any, setValue: any) => {
    value = value
        .replace('?', '')
        .replace('`', '')
        .replace('!', '')
        .replace('#', '')
        .replace('$', '')
        .replace('%', '')
        .replace('^', '')
        .replace('&', '')
        .replace('*', '')
        .replace('(', '')
        .replace(')', '')
        .replace('_', '')
        .replace('-', '')
        .replace('+', '')
        .replace('=', '')
        .replace('<', '')
        .replace('>', '')
        .replace('/', '')
        .replace(':', '')
        .replace(';', '')
        .replace('{', '')
        .replace('}', '')
        .replace('script', '');

    setValue(value);
    return value;
};
export const filterInput = (value: any, setValue: any) => {
    //value = value.replace(/[^a-zA-Z0-9àáảâáăạấầẩậặắẳòóọỏôồốổộơờớợởưừứửựùúụủìíịỉỳýỵỷeêếệểềéẹẻèiếđ" "]/g, '');
    setValue(value);
};
export const filterPassword = (value: any, setValue: any, setStrength: any) => {
    //value = value.replace(/[^a-zA-Z0-9àáảâáăạấầẩậặắẳòóọỏôồốổộơờớợởưừứửựùúụủìíịỉỳýỵỷeêếệểềéẹẻèiếđ" "]/g, '');
    setValue(value);
    setStrength(passwordStrength(value).id);
};
export const filterInputWebsite = (value: any, setValue: any) => {
    value = value.replace(/[^a-zA-Z0-9./]/g, '');
    setValue(value);
};
export const filterInputNumber = (value: any, setValue: any) => {
    value = value.replace(/[^0-9]/g, '');
    setValue(value);
};
export const filterInputNumberCart = (value: any, setValue: any) => {
    value = value.replace(/[^0-9]/g, '');
    value = parseInt(value);
    setValue(value);
};
export const filterInputNumberInCart = (
    id: any,
    value: any,
    setValue: any,
    productDetail: any,
    setTotalPrice: any,
    setTotalItem: any,
    isCheck: boolean,
    quantityOld: number,
    store: any,
) => {
    value = value.replace(/[^0-9]/g, '');
    const existingCart = JSON.parse(localStorage.getItem('listCart') || '[]');
    const productIndex = existingCart.findIndex((productDetail: any) => productDetail.productDetailId === id);
    if (productIndex != -1) {
        if (productDetail.quantity - parseInt(value) > 0 && parseInt(value) != 0) {
            existingCart[productIndex].quantity = parseInt(value);
            setValue(parseInt(value));
            localStorage.setItem('listCart', JSON.stringify(existingCart));
            if (isCheck) {
                setTotalItem((prev: any) => (prev = prev - quantityOld + parseInt(value)));
                setTotalPrice(
                    (prev: any) =>
                        (prev =
                            prev -
                            quantityOld * parseInt(productDetail.price) +
                            parseInt(value) * parseInt(productDetail.price)),
                );
            }
        }
    }
    //
    const existingCart_new = JSON.parse(localStorage.getItem('listCart') || '[]');
    const number = existingCart_new.reduce(
        (total: any, current: any) => parseInt(total) + parseInt(current.quantity),
        [0],
    );
    store.dispatch(set_number_cart_from_zero(number));
};
export const checkIsEmail = (email: string) => {
    // Sử dụng biểu thức chính quy để kiểm tra định dạng email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return false;
    } else {
        return true;
    }
};
export const toastError = (text: string) => {
    toast.error(text, { position: 'top-right', autoClose: 3000, pauseOnHover: false, closeOnClick: true });
};
export const toastSuccess = (text: string) => {
    toast.success(text, { position: 'top-right', autoClose: 3000, pauseOnHover: false, closeOnClick: true });
};
export const toastInfo = (text: string) => {
    toast.info(text, { position: 'top-right', autoClose: 3000, pauseOnHover: false, closeOnClick: true });
};
export const toastWarning = (text: string) => {
    toast.warning(text, { position: 'top-right', autoClose: 3000, pauseOnHover: false, closeOnClick: true });
};

export const addToListCartStore = (
    productDetailId: string,
    quantity: number,
    productDetail: any,
    isCheck: boolean,
    isJibbitz: boolean,
) => {
    const existingCart = JSON.parse(localStorage.getItem('listCart') || '[]');
    const productIndex = existingCart.findIndex(
        (productDetail: any) => productDetail.productDetailId === productDetailId,
    );
    if (productIndex != -1) {
        if (productDetail.quantity > existingCart[productIndex].quantity) {
            existingCart[productIndex].quantity = parseInt(existingCart[productIndex].quantity) + quantity;
            localStorage.setItem('listCart', JSON.stringify(existingCart));
        } else {
            toastWarning('Không đủ số lượng');
        }
    } else {
        localStorage.setItem(
            'listCart',
            JSON.stringify([
                ...existingCart,
                { productDetailId: productDetailId, quantity: quantity, isCheck: isCheck, isJibbitz: isJibbitz },
            ]),
        );
    }
};

export const removeFromListCartStore = (productDetailId: string, quantity: number, productDetail: any) => {
    const existingCart = JSON.parse(localStorage.getItem('listCart') || '[]');
    const productIndex = existingCart.findIndex(
        (productDetail: any) => productDetail.productDetailId === productDetailId,
    );
    if (productIndex != -1) {
        if (existingCart[productIndex].quantity - quantity > 0) {
            existingCart[productIndex].quantity -= quantity;
            localStorage.setItem('listCart', JSON.stringify(existingCart));
        } else {
            const updatedCart = existingCart.filter(
                (productDetail: any) => productDetail.productDetailId === productDetailId,
            );
            localStorage.setItem('listCart', JSON.stringify(updatedCart));
        }
    } else {
        localStorage.setItem(
            'listCart',
            JSON.stringify([...existingCart, { productDetailId: productDetailId, quantity: quantity, isCheck: false }]),
        );
    }
};

export const totalQuantityInCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('listCart') || '[]');
    if (existingCart.length > 0) {
        const total = existingCart.reduce((sum: any, item: any) => sum + item.quantity, 0);
        return total;
    } else {
        return 0;
    }
};
export const checkCart = (productDetailIds: any) => {
    const productDetailIds_v1 = productDetailIds.map((item: any) => item.id);
    const existingCart = JSON.parse(localStorage.getItem('listCart') || '[]');
    if (existingCart.length > 0) {
        const productDetailIds_inCart = existingCart.map((item: any) => item.productDetailId);
        productDetailIds_inCart.map((productDetailId_inCart: string) => {
            if (!productDetailIds_v1.includes(productDetailId_inCart)) {
                const index = existingCart.findIndex((item: any) => item.productDetailId == productDetailId_inCart);
                if (index != -1) existingCart.splice(index, 1);
            }
        });
        if (existingCart.length == 0) {
            localStorage.removeItem('listCart');
        } else {
            localStorage.setItem('listCart', JSON.stringify(existingCart));
        }
    } else {
        return 0;
    }
};
export const getListProductIdInCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('listCart') || '[]');
    if (existingCart.length > 0) {
        const productsIds = existingCart.map((item: any) => item.productDetailId);
        return productsIds;
    } else {
        return [];
    }
};
export const findProductDetailInStore = (id: string) => {
    const existingCart = JSON.parse(localStorage.getItem('listCart') || '[]');
    return existingCart.find((item: any, index: number) => item.productDetailId == id);
};

export const setCheckInStore = (id: string, isCheck: boolean) => {
    const existingCart = JSON.parse(localStorage.getItem('listCart') || '[]');
    const productIndex = existingCart.findIndex((productDetail: any) => productDetail.productDetailId === id);
    if (productIndex != -1) {
        existingCart[productIndex].isCheck = isCheck;
        localStorage.setItem('listCart', JSON.stringify(existingCart));
    }
};

export const removeItemFromCart = (id: string) => {
    const existingCart = JSON.parse(localStorage.getItem('listCart') || '[]');
    const updatedCart = existingCart.filter((item: any) => item.productDetailId !== id);
    localStorage.setItem('listCart', JSON.stringify(updatedCart));
};

export function formatNumber(num: number) {
    if (num >= 1e6) {
        return (num / 1e6).toFixed(1) + 'M'; // Triệu
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + 'k'; // Nghìn
    } else {
        return num.toString(); // Số nhỏ hơn 1000
    }
}

export const addCheckout = (productDetail: any, quantity: number, isJibbitz: boolean) => {
    try {
        sessionStorage.setItem('checkout', '');
        sessionStorage.setItem(
            'checkout',
            JSON.stringify([{ productDetailId: productDetail.id, quantity: quantity, isJibbitz: isJibbitz }]),
        );
        return true;
    } catch {
        return false;
    }
};

export const addCheckoutBuyAll = () => {
    sessionStorage.setItem('checkout', '');
    let list_item = JSON.parse(localStorage.getItem('listCart') || '[]');
    if (list_item.length > 0) {
        list_item = list_item.filter((item: any) => item.isCheck == true);
        if (list_item.length > 0) {
            sessionStorage.setItem('checkout', JSON.stringify(list_item));
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

export const convertToPercentage = (num: number) => {
    return `${num * 100}%`;
};

export const unCheck = () => {
    let list_item = JSON.parse(localStorage.getItem('listCart') || '[]');
    list_item.map((item: any) => {
        item.isCheck = false;
    });
    localStorage.setItem('listCart', JSON.stringify(list_item));
};

export function hideMiddleChars(str: string) {
    if (str.length <= 5) {
        return str;
    }
    const start = str.slice(0, 2);
    const end = str.slice(-3);
    return `${start}...${end}`;
}
