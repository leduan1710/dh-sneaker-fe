import React, { useEffect, useState } from 'react';
import { filterSpecialInput, formatPrice, toastWarning } from '../../../untils/Logic';
import { GetApi, GetGuestApi } from '../../../untils/Api';
import { Input } from '../../ComponentsLogin';
import { useTranslation } from 'react-i18next';
import DiscountIcon from '@mui/icons-material/Discount';
import EastIcon from '@mui/icons-material/East';
import { Button, Dialog, DialogTitle } from '@mui/material';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { formatDistance, formatDistanceToNow } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import { set_voucher_using } from '../../../reducers/Actions';
import { HOST_BE } from '../../../common/Common';
interface GroupedShopProps {
    groupedShop: any;
    discounts: any;
    getPriceDiscount_1: any;
    getQuantity: any;
    setPriceVoucherAll: any;
}
const GroupedShop: React.FC<GroupedShopProps> = (props) => {
    const { groupedShop, discounts, getPriceDiscount_1, getQuantity, setPriceVoucherAll } = props;
    const [shops, setShops] = useState<any>([]);
    const [code, setCode] = useState<string>('');
    const [shopIdCurrent, setShopIdCurrent] = useState<any>(undefined);
    const voucherUsing = useSelector((state: ReducerProps) => state.voucherUsing);
    const store = useStore();
    const { t } = useTranslation();
    const [vouchers, setVouchers] = useState<any>(undefined);
    const getDataShop = async () => {
        groupedShop.map(async (shop: any) => {
            const shopRes = await GetGuestApi(`/api/shop/${shop.shopId}`);
            if (shopRes.data.message == 'Success') {
                setShops((prev: any) => [...prev, shopRes.data.shop]);
            }
        });
    };
    const getShopName = (shopId: any) => {
        if (shops.length > 0) {
            const index = shops.findIndex((item: any) => item.id == shopId);
            if (index != -1) {
                return shops[index].name;
            } else {
                return '';
            }
        } else {
            return '';
        }
    };
    const getVoucherByUser = async () => {
        const res = await GetApi('/user/get-voucher-by-user', localStorage.getItem('token'));
        if (res.data.message == 'Success') {
            setVouchers(res.data.vouchers);
        }
    };
    useEffect(() => {
        getDataShop();
        getVoucherByUser();
    }, []);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = (shopId: any) => {
        setOpen(true);
        setShopIdCurrent(shopId);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const filterVouchersByShop = (shopId: any, vouchers: any) => {
        if (vouchers && shopId) {
            return vouchers.filter((voucher: any) => voucher.shopId == shopId);
        } else {
            return [];
        }
    };
    const user = useSelector((state: ReducerProps) => state.user);
    const lng = useSelector((state: ReducerProps) => state.lng);
    const checkVoucher = (voucher: any) => {
        if (new Date(voucher.expired) <= new Date()) {
            return false;
        }
        return true;
    };
    const handleUsingVoucher = (voucher: any) => {
        if (!checkVoucher(voucher)) {
            toastWarning(t('toast.VoucherIsNoLonger'));
            return;
        }
        if (user.voucherUsedIdList.includes(voucher.id)) {
            toastWarning(t('toast.VoucherHasUsed'));
            return;
        }
        const shopInStore = JSON.parse(sessionStorage.getItem('checkout') || '[]');
        const listProductDetailUsing = groupedShop.filter((item: any) => item.shopId == shopIdCurrent)[0]
            .productDetails;
        const totalPriceProductDetail_Shop = listProductDetailUsing.reduce(
            (total: any, item: any) => {
                const index = shopInStore.findIndex((itemInStore: any) => itemInStore.productDetailId == item.id);
                const index_discount = discounts.findIndex((itemDiscount: any) => itemDiscount.id == item.discountId);
                if (index != -1) {
                    if (index_discount != -1) {
                        return (
                            total +
                            item.price * shopInStore[index].quantity -
                            item.price * discounts[index_discount].percent * shopInStore[index].quantity
                        );
                    } else {
                        return total + item.price * shopInStore[index].quantity;
                    }
                }
                return total;
            },
            [0],
        );
        if (totalPriceProductDetail_Shop >= voucher.condition) {
            const voucherUsingTemp = voucherUsing.filter((itemVoucher: any) => itemVoucher.shopId !== shopIdCurrent);
            store.dispatch(
                set_voucher_using([
                    ...voucherUsingTemp,
                    { shopId: shopIdCurrent, voucherId: voucher.id, reduce: voucher.reduce },
                ]),
            );
            // setVoucherUsing([...voucherUsingTemp, { shopId: shopIdCurrent, voucherId: voucher.id }]);
            setOpen(false);
        } else {
            toastWarning(t('toast.NotEnoughCondition'));
        }
    };
    const getVoucherPrice = (shopId: string, voucherUsing: any) => {
        const index = voucherUsing.findIndex((item: any) => item.shopId == shopId);
        if (index != -1) {
            return `Voucher : - ${formatPrice(voucherUsing[index].reduce)}`;
        }
    };
    const handleUsingVoucherByCode = async () => {
        if (shopIdCurrent && code) {
            const res = await GetApi(
                `/user/get-voucher-by-code/${shopIdCurrent}/${code}`,
                localStorage.getItem('token'),
            );
            if (res.data.message == 'Success') {
                const shopInStore = JSON.parse(sessionStorage.getItem('checkout') || '[]');
                const listProductDetailUsing = groupedShop.filter((item: any) => item.shopId == shopIdCurrent)[0]
                    .productDetails;
                const totalPriceProductDetail_Shop = listProductDetailUsing.reduce(
                    (total: any, item: any) => {
                        const index = shopInStore.findIndex(
                            (itemInStore: any) => itemInStore.productDetailId == item.id,
                        );
                        const index_discount = discounts.findIndex(
                            (itemDiscount: any) => itemDiscount.id == item.discountId,
                        );
                        if (index != -1) {
                            if (index_discount != -1) {
                                return (
                                    total +
                                    item.price * shopInStore[index].quantity -
                                    item.price * discounts[index_discount].percent * shopInStore[index].quantity
                                );
                            } else {
                                return total + item.price * shopInStore[index].quantity;
                            }
                        }
                        return total;
                    },
                    [0],
                );
                if (totalPriceProductDetail_Shop >= res.data.voucher.condition) {
                    const voucherUsingTemp = voucherUsing.filter(
                        (itemVoucher: any) => itemVoucher.shopId !== shopIdCurrent,
                    );
                    store.dispatch(
                        set_voucher_using([
                            ...voucherUsingTemp,
                            { shopId: shopIdCurrent, voucherId: res.data.voucher.id, reduce: res.data.voucher.reduce },
                        ]),
                    );
                    setOpen(false);
                } else {
                    toastWarning(t('toast.NotEnoughCondition'));
                }
            }
            if (res.data.message == 'Run out of voucher') {
                toastWarning(t('toast.VoucherOutOfStock'));
            }
            if (res.data.message == 'Voucher not found') {
                toastWarning(t('toast.VoucherNotFound'));
            }
            if (res.data.message == 'Voucher used') {
                toastWarning(t('toast.VoucherHasUsed'));
            }
        }
    };
    const getTotalPriceVoucher = () => {
        const totalPrice = voucherUsing.reduce(
            (total: any, item: any) => {
                return parseFloat(total + item.reduce);
            },
            [0],
        );
        setPriceVoucherAll(totalPrice);
    };
    useEffect(() => {
        if (voucherUsing.length > 0) {
            getTotalPriceVoucher();
        }
    }, [voucherUsing]);
    return (
        <>
            {groupedShop.map((shop: any, index: number) => (
                <div className="border-b border-gray-200 relative">
                    <div className="">{getShopName(shop.shopId)}</div>
                    {shop.productDetails.map((productDetail: any) => (
                        <a
                            href={`/product/${productDetail.productId}`}
                            className={`grid grid-cols-3 ${
                                index > 0 ? 'mt-6' : ''
                            } p-3 hover:opacity-70 transition-all duration-500`}
                        >
                            <div className="col-span-1 flex justify-center">
                                <img
                                    style={{ objectFit: 'cover', width: '90%', height: 200 }}
                                    className="rounded-xl"
                                    src={
                                        productDetail.images[0]
                                            ? productDetail.images[0].startsWith('uploads')
                                                ? `${HOST_BE}/${productDetail.images[0]}`
                                                : productDetail.images[0]
                                            : ''
                                    }
                                />
                            </div>
                            <div className="col-span-2">
                                <div className="p-3">
                                    <div className="font-normal">{productDetail.name}</div>
                                    {discounts ? (
                                        <div className="text-red-400 mt-3">{getPriceDiscount_1(productDetail)}</div>
                                    ) : (
                                        <div className="text-red-400 mt-3">
                                            {formatPrice(productDetail.price)} x {getQuantity(productDetail)}
                                        </div>
                                    )}

                                    <div className="flex items-center text-blue-400 mt-2">
                                        <div className="font-thin pr-3 border-r border-gray-300">
                                            {productDetail.option1}
                                        </div>
                                        <div className="font-thin ml-2">{productDetail.option2}</div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                    <div
                        onClick={() => handleClickOpen(shop.shopId)}
                        className="text-thin text-sm p-5 select-none text-gray-500 cursor-pointer"
                    >
                        <DiscountIcon /> {t('order.AddShopVoucher')} <EastIcon />
                    </div>
                    <div className="absolute bottom-0 right-0 text-sm text-blue-300">
                        {getVoucherPrice(shop.shopId, voucherUsing)}
                    </div>
                </div>
            ))}
            <React.Fragment>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle id="alert-dialog-title">{'VOUCHER'}</DialogTitle>

                    <div className="pl-12 pr-12 pb-12 pt-3">
                        <div className="grid grid-cols-5 gap-4  p-2 ">
                            <div className="col-span-4 relative flex justify-center items-center">
                                <div style={{ left: -24, top: 18 }} className="absolute ">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g clip-path="url(#clip0_1392_114948)">
                                            <path
                                                d="M7.9165 9.16659C8.60686 9.16659 9.1665 8.60694 9.1665 7.91659C9.1665 7.22623 8.60686 6.66659 7.9165 6.66659C7.22615 6.66659 6.6665 7.22623 6.6665 7.91659C6.6665 8.60694 7.22615 9.16659 7.9165 9.16659Z"
                                                fill="#0A68FF"
                                            ></path>
                                            <path
                                                d="M13.3332 12.0833C13.3332 12.7736 12.7735 13.3333 12.0832 13.3333C11.3928 13.3333 10.8332 12.7736 10.8332 12.0833C10.8332 11.3929 11.3928 10.8333 12.0832 10.8333C12.7735 10.8333 13.3332 11.3929 13.3332 12.0833Z"
                                                fill="#0A68FF"
                                            ></path>
                                            <path
                                                d="M12.2558 8.92251C12.5812 8.59707 12.5812 8.06943 12.2558 7.744C11.9303 7.41856 11.4027 7.41856 11.0772 7.744L7.74392 11.0773C7.41848 11.4028 7.41848 11.9304 7.74392 12.2558C8.06935 12.5813 8.59699 12.5813 8.92243 12.2558L12.2558 8.92251Z"
                                                fill="#0A68FF"
                                            ></path>
                                            <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M3.33317 3.33325C2.4127 3.33325 1.6665 4.07944 1.6665 4.99992V7.64295C1.6665 7.86396 1.7543 8.07592 1.91058 8.23221L2.49978 8.82141C3.15066 9.47228 3.15066 10.5276 2.49978 11.1784L1.91058 11.7676C1.7543 11.9239 1.6665 12.1359 1.6665 12.3569V14.9999C1.6665 15.9204 2.4127 16.6666 3.33317 16.6666L16.6665 16.6666C17.587 16.6666 18.3332 15.9204 18.3332 14.9999V12.3569C18.3332 12.127 18.2387 11.9125 18.0798 11.7584L17.4998 11.1784C16.8489 10.5276 16.8489 9.47228 17.4998 8.82141L18.0798 8.24143C18.2387 8.08737 18.3332 7.87288 18.3332 7.64295V4.99992C18.3332 4.07945 17.587 3.33325 16.6665 3.33325H3.33317ZM16.3213 12.3569L16.6665 12.7022V14.9999H3.33317V12.7021L3.6783 12.3569C4.98004 11.0552 4.98004 8.94464 3.6783 7.6429L3.33317 7.29777V4.99992L16.6665 4.99992V7.29766L16.3213 7.6429C15.0195 8.94464 15.0195 11.0552 16.3213 12.3569Z"
                                                fill="#0A68FF"
                                            ></path>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1392_114948">
                                                <rect
                                                    width="16.6667"
                                                    height="16.6667"
                                                    fill="white"
                                                    transform="translate(1.6665 1.66663)"
                                                ></rect>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <Input
                                    style={{ padding: '8px 5px' }}
                                    placeholder={`Code`}
                                    value={code}
                                    onChange={(e: any) => filterSpecialInput(e.target.value, setCode)}
                                />
                            </div>
                            <div className="col-span-1 flex justify-center items-center">
                                <Button style={{ padding: 8 }} onClick={handleUsingVoucherByCode} variant="contained">
                                    {t('order.Using')}
                                </Button>
                            </div>
                        </div>
                        <div>
                            {filterVouchersByShop(shopIdCurrent, vouchers).map((voucher: any) => (
                                <div className="flex justify-center items-center">
                                    <div
                                        style={{ width: 340 }}
                                        className="voucher box-shadow rounded-xl p-3 select-none relative mt-3"
                                    >
                                        <h2 className="voucher-title text-center">{voucher.name}</h2>
                                        <p className="voucher-discount  absolute top-3 left-0 text-sm opacity-70">
                                            - {formatPrice(voucher.reduce)}
                                        </p>
                                        <p className="text-sm text-center">
                                            {t('shop.Condition')} : {formatPrice(voucher.condition)}
                                        </p>
                                        <p
                                            style={{
                                                backgroundColor: user
                                                    ? user.voucherIdList.includes(voucher.id)
                                                        ? 'gray'
                                                        : undefined
                                                    : undefined,
                                            }}
                                            className={`voucher-code text-center cursor-pointer transition-all duration-500 ${
                                                user
                                                    ? user.voucherIdList.includes(voucher.id)
                                                        ? 'cursor-not-allowed'
                                                        : 'hover:opacity-80'
                                                    : ''
                                            }`}
                                        >
                                            Code: <strong>{voucher.code}</strong>
                                        </p>
                                        <p className="voucher-expiry text-center">
                                            {t('shop.Expery')}:
                                            {lng == 'vn'
                                                ? formatDistanceToNow(voucher.expired, {
                                                      addSuffix: true,
                                                      locale: vi,
                                                  })
                                                : formatDistanceToNow(voucher.expired, {
                                                      addSuffix: true,
                                                      locale: enUS,
                                                  })}
                                        </p>
                                        {user ? (
                                            user.voucherIdList.includes(voucher.id) ? (
                                                <div className="absolute top-1 right-1">
                                                    <img
                                                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                                                        src={require('../../../static/claimed.png')}
                                                    />
                                                </div>
                                            ) : null
                                        ) : null}
                                    </div>
                                    <div className="ml-12">
                                        <Button onClick={() => handleUsingVoucher(voucher)} variant="outlined">
                                            {t('order.Using')}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Dialog>
            </React.Fragment>
        </>
    );
};

export default GroupedShop;
