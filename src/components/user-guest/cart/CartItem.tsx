import React, { useEffect, useState } from 'react';
import {
    addCheckout,
    convertToPercentage,
    filterInputNumber,
    filterInputNumberInCart,
    findProductDetailInStore,
    formatPrice,
    removeItemFromCart,
    setCheckInStore,
    shortedString,
} from '../../../untils/Logic';
import { Divider } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../ComponentsLogin';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useSelector, useStore } from 'react-redux';
import {
    decrease_more_number_cart,
    decrementNumberCart,
    incrementNumberCart,
    remove_item_from_cart,
    set_number_cart,
} from '../../../reducers/Actions';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { useTranslation } from 'react-i18next';
import Checkbox from '@mui/material/Checkbox';
import { GetGuestApi } from '../../../untils/Api';
import { AlertLogin } from '../../alert/Alert';
import { HOST_BE, typeRole } from '../../../common/Common';
interface CartItemProps {
    productDetail: any;
    setTotalPrice: any;
    setTotalItem: any;
    isCheck_F: boolean;
    setIsCheckAll: any;
    getIsCheck: any;
    toggleDrawer: any;
}
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const CartItem: React.FC<CartItemProps> = (props) => {
    const location = useLocation();
    const { productDetail, setTotalPrice, setTotalItem, isCheck_F, setIsCheckAll, getIsCheck, toggleDrawer } = props;
    const productDetailInStore = findProductDetailInStore(productDetail.id);
    const role = useSelector((state: ReducerProps) => state.role);
    const [quantity, setQuantity] = useState<number>(0);
    const numberCart = useSelector((state: ReducerProps) => state.numberCart);
    const [isCheck, setIsCheck] = useState<boolean>(false);
    const nav = useNavigate();

    const store = useStore();
    const { t } = useTranslation();
    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            store.dispatch(decrementNumberCart());
            setQuantity((prev: any) => parseInt(prev) - 1);
            const existingCart = JSON.parse(localStorage.getItem('listCart') || '[]');
            const productIndex = existingCart.findIndex((item: any) => item.productDetailId === productDetail.id);
            existingCart[productIndex].quantity -= 1;
            localStorage.setItem('listCart', JSON.stringify(existingCart));
        }
    };
    const handleDeleleInStore = () => {
        store.dispatch(decrease_more_number_cart(quantity));
        store.dispatch(remove_item_from_cart(productDetail.id));
        removeItemFromCart(productDetail.id);
    };
    const handleIncreaseQuantity = () => {
        if (quantity < productDetail.quantity) {
            store.dispatch(incrementNumberCart());
            setQuantity((prev: any) => parseInt(prev) + 1);
            const existingCart = JSON.parse(localStorage.getItem('listCart') || '[]');
            const productIndex = existingCart.findIndex((item: any) => item.productDetailId === productDetail.id);
            existingCart[productIndex].quantity += 1;
            localStorage.setItem('listCart', JSON.stringify(existingCart));
        }
    };

    const handleCheck = () => {
        setCheckInStore(productDetailInStore.productDetailId, !isCheck);
        //if check
        if (!isCheck) {
            setTotalPrice((prev: any) => (prev += parseInt(productDetail.sellPrice) * quantity));
            setTotalItem((prev: any) => (prev = parseInt(prev) + quantity));
        } else {
            setTotalPrice((prev: any) => (prev -= parseInt(productDetail.sellPrice) * quantity));
            setTotalItem((prev: any) => (prev = parseInt(prev) - quantity));
        }
        setIsCheckAll(getIsCheck());
    };

    useEffect(() => {
        if (productDetailInStore) {
            setQuantity(productDetailInStore.quantity);
            setIsCheck(productDetailInStore.isCheck);
        }
    }, []);
    useEffect(() => {
        if (isCheck_F != isCheck) {
            if (productDetailInStore)
                if (productDetailInStore.isCheck) {
                } else {
                    setIsCheck(isCheck_F);
                    handleCheck();
                }
        }
    }, [isCheck_F]);
    return (
        <div
            style={{
                width: '100%',
            }}
            className="border border-gray-300 mb-1 rounded relative ml-3 pb-2"
        >
            <div
                style={{
                    top: 0,
                    left: -50,
                }}
                className="absolute"
            >
                <Checkbox
                    {...label}
                    checked={isCheck}
                    onChange={() => setIsCheck((prev) => !prev)}
                    onClick={handleCheck}
                />
            </div>

            <div
                className="absolute top-0 right-0 hover:bg-red-400 cursor-pointer p-1 rounded"
                onClick={handleDeleleInStore}
            >
                <HighlightOffIcon />
            </div>
            <a
                href={`/product/${productDetail.productId}`}
                className="grid grid-cols-3  p-2 rounded flex items-center hover:bg-gray-300 cursor-pointer transition-all duration-500 border-b border-gray-300"
            >
                <div className="col-span-1 border-r border-gray-300 flex items-center justify-center">
                    <img
                        className="rounded-xl"
                        style={{
                            width: '75%',
                            objectFit: 'cover',
                        }}
                        src={
                            productDetail.image.startsWith('uploads')
                                ? `${HOST_BE}/${productDetail.image}`
                                : productDetail.image
                        }
                    />
                </div>
                <div className="ml-6 col-span-2 ">
                    <div className="font-bold text-xs lg:text-sm select-none pr-6 lg:pr-3">
                        {shortedString(productDetail.name, 150)}
                    </div>
                    <div className="text-xs lg:text-sm select-none text-blue-300">
                        <span>{productDetail.sizeName}</span>
                        <span className="ml-3">|</span>
                        <span className="ml-3">{productDetail.colorName}</span>
                    </div>
                    <div className="mt-3 font-thin text-red-400 select-none flex items-center relative grid grid-cols-3">
                        {/* {formatPrice(parseInt(productDetail.price) * parseInt(productDetailInStore.quantity))} */}
                        <> {formatPrice(productDetail.sellPrice)}</>

                        <span className="ml-12 font-bold text-black col-span-3 lg:col-span-1">
                            x {productDetailInStore ? productDetailInStore.quantity : 0}
                        </span>
                    </div>
                </div>
            </a>
            <div className="grid grid-cols-3 w-full mt-2">
                <div className="col-span-2 lg:col-span-1 flex items-center justify-start lg:justify-end pl-5">
                    <div
                        className={`p-3 pl-6 pr-6 hover:bg-gray-300 rounded m-1 cursor-pointer border border-gray-400 select-none flex justify-center ${
                            quantity == 1 ? 'cursor-not-allowed bg-gray-200 opacity-70 border-none' : ''
                        }`}
                        style={{ width: 50, height: 50 }}
                        onClick={handleDecreaseQuantity}
                    >
                        -
                    </div>

                    <input
                        value={quantity}
                        style={{ width: '50px' }}
                        className="p-3 rounded m-1 border border-gray-300 text-center"
                        onChange={(e) => {
                            if (e.target.value <= productDetail.quantity) {
                                if (e.target.value.toString() == '') {
                                } else {
                                    filterInputNumberInCart(
                                        productDetailInStore.productDetailId,
                                        e.target.value,
                                        setQuantity,
                                        productDetail,
                                        setTotalPrice,
                                        setTotalItem,
                                        isCheck,
                                        quantity,
                                        store,
                                    );
                                }
                            }
                        }}
                    />

                    <div
                        onClick={handleIncreaseQuantity}
                        style={{ width: 50, height: 50 }}
                        className={`p-3 pl-6 pr-6 hover:bg-gray-300 rounded m-1 cursor-pointer border border-gray-400 select-none flex justify-center ${
                            quantity == productDetail.quantity
                                ? 'cursor-not-allowed bg-gray-200 opacity-70 border-none'
                                : ''
                        }`}
                    >
                        +
                    </div>
                </div>
                <div className="flex items-center pl-5">
                    <h1 className="font-bold text-sm">
                        {t('product.Total')} :{' '}
                        <>
                            {formatPrice(
                                parseInt(productDetail.sellPrice) *
                                    parseInt(productDetailInStore ? productDetailInStore.quantity : 0),
                            )}
                        </>
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
