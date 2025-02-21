import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PersonIcon from '@mui/icons-material/Person';
import MapIcon from '@mui/icons-material/Map';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DialogAddressCheckout from '../../../components/user-guest/address/DialogAddressCheckout';
import { useLocation, useNavigate } from 'react-router-dom';
import { GetApi, GetGuestApi, PostApi, PostGuestApi } from '../../../untils/Api';
import { change_is_loading } from '../../../reducers/Actions';
import { formatPrice, toastWarning } from '../../../untils/Logic';
import { Button } from '../../../components/ComponentsLogin';
import DialogMember from '../../../components/user-guest/order/DialogMember';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MopedIcon from '@mui/icons-material/Moped';
import PaymentsIcon from '@mui/icons-material/Payments';
import { HOST_BE, typeRole, USD } from '../../../common/Common';
import { Alert, AlertBuy, AlertLogin } from '../../../components/alert/Alert';
import GroupedShop from '../../../components/user-guest/order/GroupedShop';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
interface CheckoutProps {}
const Checkout: React.FC<CheckoutProps> = (props) => {
    const location = useLocation();
    const { t } = useTranslation();
    //
    const paymentOptions = [
        { value: 0, string: t('order.CashOnDelivery') },
        { value: 1, string: 'Paypall' },
        { value: 2, string: t('user.Wallet') },
    ];

    //
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const nav = useNavigate();
    const role = useSelector((state: ReducerProps) => state.role);
    const listAddress = useSelector((state: ReducerProps) => state.listAddress);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [totalItem, setTotalItem] = useState<number>(0);
    const [discounts, setDiscounts] = useState<any>(undefined);
    const [addressCurrent, setAddressCurrent] = useState<any>(undefined);
    const [ships, setShips] = useState<any>(undefined);
    const [shipCurrent, setShipCurrent] = useState<any>(undefined);
    const [paymentCurrent, setPaymentCurrent] = useState<any>(paymentOptions[0].value);
    const [isShowPaypal, setIsShowPaypal] = useState<any>(false);
    const [wallet, setWallet] = useState<any>(undefined);
    const [listProductDetailInStore, setListProductDetailInStore] = useState<any>(
        JSON.parse(sessionStorage.getItem('checkout') || '[]'),
    );
    const voucherUsing = useSelector((state: ReducerProps) => state.voucherUsing);
    const [groupedShop, setGroupedShop] = useState<any>([]);
    const [listProductDetail, setListProductDetail] = useState<any>([]);
    const [priceVoucherAll, setPriceVoucherAll] = useState<any>(0);

    ///////////---------------////////////////////////
    const loadSDK = (isShowPaypal: any) => {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_YOUR_CLIENT_ID}`;
        script.async = true;
        script.onload = () => {
            // Khởi tạo PayPal Buttons
            window.paypal
                .Buttons({
                    createOrder: async (data: any, actions: any) => {
                        const totalPrice = parseFloat((getPriceAll() / USD).toFixed(2));
                        const response = await fetch(`${HOST_BE}/create-order`, {
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ amount: totalPrice, quantity: groupedShop.length }),
                        });
                        const orderData = await response.json();
                        return orderData.id;
                    },
                    onApprove: async (data: any, actions: any) => {
                        const response = await fetch(`${HOST_BE}/capture-order/${data.orderID}`, {
                            method: 'post',
                        });
                        const orderData = await response.json();
                        if (orderData) {
                            handleBuy();
                        }
                    },
                    onError: (err: any) => {},
                })
                .render('#paypal-button-container'); // Hiển thị nút PayPal
        };
        if (isShowPaypal) {
            document.body.appendChild(script);
        }
    };
    const removeFromCart = () => {
        let list_cart = JSON.parse(localStorage.getItem('listCart') || '[]');
        listProductDetailInStore.map((item_store: any) => {
            list_cart = list_cart.filter((item: any) => item.productDetailId !== item_store.productDetailId);
        });
        localStorage.setItem('listCart', JSON.stringify(list_cart));
    };

    const countShop = () => {
        const count = new Set(listProductDetail.map((productDetail: any) => productDetail.shopId));
        return count.size;
    };
    const groupedByShopId = (listProductDetail: any) => {
        const new_list = listProductDetail.reduce((accumulator: any, current: any) => {
            let group = accumulator.find((g: any) => g.shopId === current.shopId);

            if (!group) {
                group = { shopId: current.shopId, productDetails: [] };
                accumulator.push(group);
            }
            group.productDetails.push(current);

            return accumulator;
        }, []);
        setGroupedShop(new_list);
    };
    ///////////////////////////////
    const handleBuy = async () => {
        const listShopId = listProductDetail.map((item: any) => listProductDetail.shopId);
        if (listShopId.includes(user.shopId)) {
            toastWarning(t('toast.CantBuyOwnProduct'));
        }
        ////
        if (!addressCurrent) {
            toastWarning(t('toast.MissingAddress'));
        } else if (totalPrice == 0 || totalItem == 0) {
            toastWarning('');
        } else {
            store.dispatch(change_is_loading(true));
            //voucher first
            const resVoucher = await PostApi('/user/use-voucher', localStorage.getItem('token'), {
                voucherUsing: voucherUsing,
            });
            if (resVoucher.data.message == 'Run out of voucher') {
                toastWarning(t('toast.VoucherOutOfStock'));
            }
            //
            if (resVoucher.data.message == 'Success') {
                for (const shop of groupedShop) {
                    if (paymentCurrent == 1 || paymentCurrent == 2) {
                        const listProductDetailByShop = listProductDetail.filter(
                            (item: any) => item.shopId == shop.shopId,
                        );
                        let priceVoucher = 0;
                        if (voucherUsing.length > 0) {
                            priceVoucher = voucherUsing.reduce(
                                (total: any, item: any) => {
                                    if (item.shopId == shop.shopId) {
                                        return parseFloat(total + item.reduce);
                                    }
                                    return parseFloat(total);
                                },
                                [0],
                            );
                        }
                        const value = listProductDetailByShop.reduce(
                            (accumulator: any, item: any) => {
                                const index_quantity = listProductDetailInStore.findIndex(
                                    (item_inStore: any) => item_inStore.productDetailId == item.id,
                                );
                                const index_discount = discounts.findIndex(
                                    (item_discount: any) => item_discount.id == item.discountId,
                                );
                                let discountPrice = null;
                                if (index_discount != -1) {
                                    discountPrice = discounts[index_discount].percent * item.price;
                                }
                                return (
                                    accumulator +
                                    parseFloat(item.price) *
                                        parseFloat(listProductDetailInStore[index_quantity].quantity) -
                                    (discountPrice ? discountPrice : 0)
                                );
                            },
                            [0],
                        );
                        const percentPriceMember =
                            Math.trunc(user.point / 1000) * 0.01 > 0.03 ? 0.03 : Math.trunc(user.point / 1000) * 0.01;
                        const priceMember = value * percentPriceMember;
                        const index_ship = ships.findIndex((item: any) => item.id == shipCurrent);
                        const priceShip = ships[index_ship].price;
                        if (paymentCurrent == 2 && wallet[0].balance < value - priceMember - priceVoucher + priceShip) {
                            toastWarning(t('toast.NotEnoughBalance'));
                            store.dispatch(change_is_loading(false));
                            return;
                        }

                        const resTransfer = await PostApi('/user/transfer-to-shop', localStorage.getItem('token'), {
                            value: value,
                            priceShip: priceShip,
                            priceMember: priceMember,
                            priceVoucher: priceVoucher,
                            shopId: shop.shopId,
                            from: paymentCurrent == 2 ? user.walletId : '-',
                            describe: 'transfer',
                        });
                        if (resTransfer.data.message == 'Success') {
                            const listProductDetailByShop = listProductDetail.filter(
                                (item: any) => item.shopId == shop.shopId,
                            );
                            const listOrderDetail = listProductDetailByShop.map((item: any) => {
                                const index_quantity = listProductDetailInStore.findIndex(
                                    (item_inStore: any) => item_inStore.productDetailId == item.id,
                                );
                                const index_discount = discounts.findIndex(
                                    (item_discount: any) => item_discount.id == item.discountId,
                                );
                                let discountPrice = null;
                                if (index_discount != -1) {
                                    discountPrice = discounts[index_discount].percent * item.price;
                                }
                                return {
                                    productDetailId: item.id,
                                    price: item.price,
                                    discountId: item.discountId,
                                    discountPrice: discountPrice,
                                    quantity: listProductDetailInStore[index_quantity].quantity,
                                };
                            });
                            const address = addressCurrent;
                            const shipId = shipCurrent;
                            let priceVoucher = 0;
                            if (voucherUsing.length > 0) {
                                priceVoucher = voucherUsing.reduce(
                                    (total: any, item: any) => {
                                        if (item.shopId == shop.shopId) {
                                            return parseFloat(total + item.reduce);
                                        }
                                        return parseFloat(total);
                                    },
                                    [0],
                                );
                            }
                            // voucherId

                            const voucherId = voucherUsing.map((item: any) => {
                                if (item.shopId == shop.shopId) return item.voucherId;
                            });
                            //
                            const percentPriceMember =
                                Math.trunc(user.point / 1000) * 0.01 > 0.03
                                    ? 0.03
                                    : Math.trunc(user.point / 1000) * 0.01;
                            const priceMember = parseFloat(value) * percentPriceMember;
                            const paid = paymentCurrent == 0 ? false : true;
                            const shopId = shop.shopId;
                            //ship
                            const index = ships.findIndex((item: any) => item.id == shipCurrent);
                            const priceShip = ships[index].price;
                            ///
                            const order = {
                                address: address,
                                shipId: shipId,
                                paid: paid,
                                voucherId: voucherId.length > 0 ? voucherId[0] : null,
                                priceVoucher: priceVoucher,
                                priceMember: priceMember,
                                shopId: shopId,
                                priceShip: priceShip,
                                isOnline: true,
                            };
                            //////////////
                            const orders = await PostApi('/user/handle-order', localStorage.getItem('token'), {
                                order: order,
                                listOrderDetail: listOrderDetail,
                            });
                            if (orders.data.message == 'Success') {
                            } else {
                            }
                        }
                    } else {
                        const listProductDetailByShop = listProductDetail.filter(
                            (item: any) => item.shopId == shop.shopId,
                        );
                        const value = listProductDetailByShop.reduce(
                            (accumulator: any, item: any) => {
                                const index_quantity = listProductDetailInStore.findIndex(
                                    (item_inStore: any) => item_inStore.productDetailId == item.id,
                                );
                                const index_discount = discounts.findIndex(
                                    (item_discount: any) => item_discount.id == item.discountId,
                                );
                                let discountPrice = null;
                                if (index_discount != -1) {
                                    discountPrice = discounts[index_discount].percent * item.price;
                                }
                                return (
                                    accumulator +
                                    parseFloat(item.price) *
                                        parseFloat(listProductDetailInStore[index_quantity].quantity) -
                                    (discountPrice ? discountPrice : 0)
                                );
                            },
                            [0],
                        );
                        const listOrderDetail = listProductDetailByShop.map((item: any) => {
                            const index_quantity = listProductDetailInStore.findIndex(
                                (item_inStore: any) => item_inStore.productDetailId == item.id,
                            );
                            const index_discount = discounts.findIndex(
                                (item_discount: any) => item_discount.id == item.discountId,
                            );
                            let discountPrice = null;
                            if (index_discount != -1) {
                                discountPrice = discounts[index_discount].percent * item.price;
                            }
                            return {
                                productDetailId: item.id,
                                price: item.price,
                                discountId: item.discountId,
                                discountPrice: discountPrice,
                                quantity: listProductDetailInStore[index_quantity].quantity,
                            };
                        });
                        const address = addressCurrent;
                        const shipId = shipCurrent;
                        const paid = paymentCurrent == 0 ? false : true;
                        const shopId = shop.shopId;
                        let priceVoucher = 0;
                        if (voucherUsing.length > 0) {
                            priceVoucher = voucherUsing.reduce(
                                (total: any, item: any) => {
                                    if (item.shopId == shop.shopId) {
                                        return parseFloat(total + item.reduce);
                                    }
                                    return parseFloat(total);
                                },
                                [0],
                            );
                        }
                        const percentPriceMember =
                            Math.trunc(user.point / 1000) * 0.01 > 0.03 ? 0.03 : Math.trunc(user.point / 1000) * 0.01;
                        const priceMember = parseFloat(value) * percentPriceMember;
                        //ship
                        const index = ships.findIndex((item: any) => item.id == shipCurrent);
                        const priceShip = ships[index].price;
                        ///
                        // voucherId
                        const voucherId = voucherUsing.map((item: any) => {
                            if (item.shopId == shop.shopId) return item.voucherId;
                        });
                        //
                        const order = {
                            address: address,
                            shipId: shipId,
                            paid: paid,
                            shopId: shopId,
                            voucherId: voucherId.length > 0 ? voucherId[0] : null,
                            priceVoucher: priceVoucher,
                            priceMember: priceMember,
                            priceShip: priceShip,
                            isOnline: false,
                        };
                        ////////////////
                        const orders = await PostApi('/user/handle-order', localStorage.getItem('token'), {
                            order: order,
                            listOrderDetail: listOrderDetail,
                        });
                        if (orders.data.message == 'Success') {
                        } else {
                        }
                    }
                }
            }
            sessionStorage.removeItem('checkout');
            removeFromCart();
            window.location.href = '/user/order';
            store.dispatch(change_is_loading(false));
        }
    };
    //////////////////////////////////
    const [openDialogChangeAddress, setOpenDialogChangeAddress] = useState<boolean>(
        sessionStorage.getItem('prev') == 'Create' || sessionStorage.getItem('prev') == 'Edit' ? true : false,
    );
    ///////////////////////////////////////////////////////////////////
    const handleChangeShip = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShipCurrent((event.target as HTMLInputElement).value);
    };
    const handleChangePayment = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentCurrent((event.target as HTMLInputElement).value);
    };
    const getAddressDefault = () => {
        const addressDefault = listAddress.filter((item: any) => user.defaultAddressId === item.id);
        setAddressCurrent(addressDefault[0]);
    };
    const handleChangeAddress = () => {
        setOpenDialogChangeAddress(true);
    };

    //////////////////////////////////////////
    const getDataProductDetail = async () => {
        store.dispatch(change_is_loading(true));
        const listProductDetailId = listProductDetailInStore.map((item: any) => item.productDetailId);
        const resProductDetails = await PostGuestApi('/api/get-product-detail-many', {
            listProductDetailId: listProductDetailId,
        });
        console.log(resProductDetails.data);
        if (resProductDetails.data.message == 'Success') {
            setListProductDetail(resProductDetails.data.productDetails);
            groupedByShopId(resProductDetails.data.productDetails);
        }
        // dicount
        const discountIds = resProductDetails.data.productDetails
            .map((productDetail: any) => productDetail.discountId)
            .filter((discountId: any) => discountId !== null);
        const resDiscount = await PostGuestApi(`/api/discount-many/`, { discountIdList: discountIds });
        if (resDiscount.data.message == 'Success') {
            setDiscounts(resDiscount.data.discounts);
        }
        store.dispatch(change_is_loading(false));
    };
    const getDataShip = async () => {
        const ships = await GetGuestApi('/api/all-ship');
        if (ships.data.message == 'Success') {
            setShips(ships.data.ships);
            setShipCurrent(ships.data.ships[0].id);
        }
    };
    ///////////////////////////////////

    const getQuantity = (productDetail: any) => {
        const product_quantity = listProductDetailInStore.find((item: any) => {
            return item.productDetailId === productDetail.id;
        });
        return product_quantity.quantity;
    };
    //
    const getPriceDiscount_1 = (productDetail: any) => {
        const index_discount = discounts.findIndex((item: any) => item.id == productDetail.discountId);
        if (index_discount != -1) {
            return (
                <div className="flex">
                    <div className="line-through text-black">{formatPrice(productDetail.price)}</div>
                    <div className="ml-1">
                        {formatPrice(productDetail.price * (1 - discounts[index_discount].percent))} x
                        {getQuantity(productDetail)}
                    </div>
                </div>
            );
        } else {
            return (
                <>
                    {formatPrice(productDetail.price)} x {getQuantity(productDetail)}
                </>
            );
        }
    };
    //
    const getPrice = () => {
        const total = listProductDetail.reduce((accumulator: any, currentValue: any) => {
            const index = listProductDetailInStore.findIndex((item: any) => item.productDetailId == currentValue.id);
            return accumulator + currentValue.price * listProductDetailInStore[index].quantity;
        }, 0);
        return total;
    };
    const getPriceHaveDiscount = () => {
        const total = listProductDetail.reduce((accumulator: any, currentValue: any) => {
            const index = listProductDetailInStore.findIndex((item: any) => item.productDetailId == currentValue.id);
            let index_discount = -1;
            if (discounts) {
                index_discount = discounts.findIndex((item: any) => item.id == currentValue.discountId);
            }
            if (index_discount != -1) {
                return (
                    accumulator +
                    currentValue.price * listProductDetailInStore[index].quantity -
                    currentValue.price * listProductDetailInStore[index].quantity * discounts[index_discount].percent
                );
            } else {
                return accumulator + currentValue.price * listProductDetailInStore[index].quantity;
            }
        }, 0);
        return total;
    };
    const getPriceShip = () => {
        if (shipCurrent) {
            const index = ships.findIndex((item: any) => item.id == shipCurrent);
            return ships[index].price;
        }
    };
    const getPriceSale = () => {
        if (discounts) {
            const total = listProductDetail.reduce((accumulator: any, currentValue: any) => {
                if (currentValue.discountId != null) {
                    const index_discount = discounts.findIndex((item: any) => item.id == currentValue.discountId);
                    const index = listProductDetailInStore.findIndex(
                        (item: any) => item.productDetailId == currentValue.id,
                    );

                    if (index_discount != -1) {
                        return (
                            accumulator +
                            currentValue.price *
                                discounts[index_discount].percent *
                                listProductDetailInStore[index].quantity
                        );
                    } else {
                        return accumulator;
                    }
                } else {
                    return accumulator;
                }
            }, 0);
            return total + priceVoucherAll;
        } else {
            return priceVoucherAll;
        }
    };
    const getPriceAll = () => {
        const percentPriceMember =
            Math.trunc(user.point / 1000) * 0.01 > 0.03 ? 0.03 : Math.trunc(user.point / 1000) * 0.01;
        if (user.id) {
            return getPrice() + getPriceShip() * countShop() - getPriceSale() - getPrice() * percentPriceMember;
        }
        return 0;
    };
    const getTotalPriceAndItem = () => {
        //total item
        const totalItem = listProductDetail.reduce((accumulator: any, currentValue: any) => {
            const index = listProductDetailInStore.findIndex((item: any) => item.productDetailId == currentValue.id);
            if (index != -1) {
                return accumulator + listProductDetailInStore[index].quantity;
            } else {
                return accumulator;
            }
        }, 0);
        setTotalItem(totalItem);
        //total price
        const totalPrice = listProductDetail.reduce((accumulator: any, currentValue: any) => {
            const inx = listProductDetailInStore.findIndex((item: any) => item.productDetailId == currentValue.id);
            if (discounts) {
                const inx_discount = discounts.findIndex((item: any) => item.id == currentValue.discountId);
                if (inx_discount != -1) {
                    return (
                        accumulator +
                        listProductDetailInStore[inx].quantity *
                            currentValue.price *
                            (1 - discounts[inx_discount].percent)
                    );
                } else {
                    return accumulator + listProductDetailInStore[inx].quantity * currentValue.price;
                }
            } else {
                return accumulator + listProductDetailInStore[inx].quantity * currentValue.price;
            }
        }, 0);
        setTotalPrice(totalPrice);
    };

    useEffect(() => {
        if (user.id && listAddress.length > 0) {
            getAddressDefault();
        }
    }, [user]);
    useEffect(() => {
        sessionStorage.removeItem('prev');
        getDataShip();
    }, []);
    useEffect(() => {
        if (listProductDetailInStore.length > 0) {
            getDataProductDetail();
        }
    }, [listProductDetailInStore]);

    useEffect(() => {
        if (listProductDetail.length > 0) {
            getTotalPriceAndItem();
        }
    }, [listProductDetail, discounts]);
    useEffect(() => {
        loadSDK(isShowPaypal);
    }, [isShowPaypal]);
    const getWallet = async () => {
        const res = await GetApi('/user/get-wallet', localStorage.getItem('token'));
        if (res.data.message == 'Success') {
            setWallet(res.data.wallet);
        }
    };
    useEffect(() => {
        if (user.walletId) {
            getWallet();
        }
    }, [user]);
    return (
        <div>
            <div className="marginTop">
                {!isShowPaypal ? (
                    <>
                        <div className="container">
                            <div className="grid grid-cols-5 flex items-center box-shadow rounded-xl p-3 pb-6 pt-5">
                                <div className="font-bold text-3xl text-blue-500 col-span-5 lg:col-span-1 mb-10 lg:mb-0 text-center lg:border-r border-gray-300 ">
                                    {t('order.Checkout')}
                                </div>
                                <div className="col-span-5 lg:col-span-4 relative">
                                    <div className="text-blue-500 font-bold text-2xl border-b border-gray-300 pb-6">
                                        <LocationOnIcon /> &nbsp; {t('order.DeliveryAddress')}
                                    </div>
                                    <div
                                        onClick={handleChangeAddress}
                                        className="absolute top-0 right-5 flex items-center text-blue-500 cursor-pointer hover:opacity-70 select-none"
                                    >
                                        <ChangeCircleIcon />
                                    </div>

                                    <div>
                                        {addressCurrent ? (
                                            <div className="block sm:flex items-center mt-6 ">
                                                <div className="font-bold text-sm sm:text-lg flex items-center ">
                                                    <div className="text-blue-500 flex items-center">
                                                        <PersonIcon /> &nbsp;
                                                    </div>
                                                    {addressCurrent.name}
                                                </div>
                                                <div className="ml-0 sm:ml-6 font-bold text-sm sm:text-lg flex items-center">
                                                    <div className="text-blue-500 flex items-center">
                                                        <LocalPhoneIcon /> &nbsp;
                                                    </div>
                                                    {addressCurrent.phone}
                                                </div>
                                                <div className="ml-0 sm:ml-6 font-bold text-sm sm:text-lg flex items-center">
                                                    <div className="text-blue-500 flex items-center">
                                                        <MapIcon /> &nbsp;
                                                    </div>
                                                    <div>
                                                        {addressCurrent.apartment}, {addressCurrent.ward.ward_name},{' '}
                                                        {addressCurrent.district.district_name},{' '}
                                                        {addressCurrent.city.province_name}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center mt-3">Vui lòng cài đặt địa chỉ</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container" style={{ marginTop: 24 }}>
                            {listProductDetail.length > 0 ? (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-3 xl:col-span-2">
                                        <div className="box-shadow rounded-xl p-3">
                                            {groupedShop.length > 0 ? (
                                                <GroupedShop
                                                    groupedShop={groupedShop}
                                                    discounts={discounts}
                                                    getPriceDiscount_1={getPriceDiscount_1}
                                                    getQuantity={getQuantity}
                                                    setPriceVoucherAll={setPriceVoucherAll}
                                                />
                                            ) : null}
                                        </div>
                                    </div>
                                    {listProductDetail.length > 0 ? (
                                        <div className="col-span-3 xl:col-span-1  p-3 bg-gray-100 rounded-xl mt-6 xl:mt-0 border-4 boder-gray-500 pl-12 xl:pl-3">
                                            <div className="text-center font-bold text-blue-400 text-xl mb-6">
                                                {t('order.Checkout')}
                                            </div>

                                            <div className="grid grid-cols-2">
                                                {/* ----------------DELIVERED--------------------- */}
                                                <div className="col-span-1 xl:col-span-2 p-3">
                                                    <div className="font-bold text-blue-400 text-lg">
                                                        <MopedIcon />
                                                        &nbsp; {t('order.DeliveredMethod')}
                                                    </div>
                                                    {ships ? (
                                                        <RadioGroup
                                                            className="mt-3"
                                                            aria-labelledby="demo-radio-buttons-group-label"
                                                            name="radio-buttons-group"
                                                            value={shipCurrent}
                                                            onChange={handleChangeShip}
                                                        >
                                                            {ships.map((ship: any) => (
                                                                <>
                                                                    <FormControlLabel
                                                                        value={ship.id}
                                                                        control={<Radio />}
                                                                        label={
                                                                            <>
                                                                                {ship.name}
                                                                                <span className="font-thin opacity-50">
                                                                                    ({t('order.Estimated')}{' '}
                                                                                    {ship.estimated})
                                                                                </span>
                                                                            </>
                                                                        }
                                                                    />
                                                                </>
                                                            ))}
                                                        </RadioGroup>
                                                    ) : null}
                                                </div>
                                                {/* ------------------------PAYMENT------------------------- */}
                                                <div className="col-span-1 xl:col-span-2 p-3">
                                                    <div className="font-bold text-blue-400 text-lg">
                                                        <PaymentsIcon />
                                                        &nbsp; {t('order.PaymentMethod')}
                                                    </div>

                                                    <RadioGroup
                                                        className="mt-3"
                                                        aria-labelledby="demo-radio-buttons-group-label"
                                                        name="radio-buttons-group"
                                                        value={paymentCurrent}
                                                        onChange={handleChangePayment}
                                                    >
                                                        {paymentOptions.map((paymentOption: any) => (
                                                            <>
                                                                <FormControlLabel
                                                                    value={paymentOption.value}
                                                                    control={<Radio />}
                                                                    label={paymentOption.string}
                                                                />
                                                            </>
                                                        ))}
                                                    </RadioGroup>
                                                </div>
                                                {/* ---------------------------------------------------------------- */}
                                                <div className="col-span-1 xl:col-span-2">
                                                    <div className="p-3 grid grid-cols-2">
                                                        <div> {t('product.Price')} : </div>
                                                        <span className="font-bold text-red-400 opacity-80">
                                                            {formatPrice(getPrice())}
                                                        </span>
                                                    </div>
                                                    <div className="w-full p-3 grid grid-cols-2">
                                                        <div> {t('order.PriceShip')} : </div>
                                                        <span className="font-bold text-red-400 opacity-80">
                                                            {formatPrice(getPriceShip())} x {countShop()}
                                                        </span>
                                                    </div>
                                                    <div className="w-full p-3 grid grid-cols-2">
                                                        <div> {t('category.Sale')} :</div>
                                                        <span className="font-bold text-red-400 opacity-80">
                                                            - {formatPrice(getPriceSale())}
                                                        </span>
                                                    </div>
                                                    <div className="w-full border-b border-gray-400 p-3 grid grid-cols-2 relative">
                                                        <div> {t('order.Member')} : &nbsp;</div>
                                                        <span className="font-bold text-red-400 opacity-80">
                                                            -{' '}
                                                            {formatPrice(
                                                                user.id
                                                                    ? user.point >= 3000
                                                                        ? getPriceHaveDiscount() *
                                                                              Math.trunc(user.point / 1000) *
                                                                              0.03 >
                                                                          0.03
                                                                            ? getPriceHaveDiscount() * 0.03
                                                                            : getPriceHaveDiscount() *
                                                                              Math.trunc(user.point / 1000) *
                                                                              0.03
                                                                        : user.point >= 2000
                                                                        ? getPriceHaveDiscount() *
                                                                          Math.trunc(user.point / 1000) *
                                                                          0.02
                                                                        : user.point >= 1000
                                                                        ? getPriceHaveDiscount() *
                                                                          Math.trunc(user.point / 1000) *
                                                                          0.01
                                                                        : 0
                                                                    : 0,
                                                            )}
                                                        </span>
                                                        <span className="absolute right-0 top-3">
                                                            <DialogMember />{' '}
                                                        </span>
                                                    </div>
                                                    <div className="w-full pt-3 pl-3 pr-3 grid grid-cols-2">
                                                        <div> {t('product.Total')} : </div>
                                                        <span className="font-bold text-red-400 opacity-80">
                                                            {formatPrice(getPriceAll())}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end p-3 items-center mt-3">
                                                <Button
                                                    onClick={() => {
                                                        if (role == typeRole.CTV || role == typeRole.SHOP) {
                                                            if (paymentCurrent == 0) {
                                                                AlertBuy(handleBuy);
                                                            } else if (paymentCurrent == 2) {
                                                                if (user.walletId) {
                                                                    AlertBuy(handleBuy);
                                                                } else {
                                                                    Alert(() => {
                                                                        nav('/user/wallet/register', {
                                                                            state: { previous: 'checkout' },
                                                                        });
                                                                    }, 'Tạo ví');
                                                                }
                                                            } else {
                                                                const listShopId = listProductDetail.map(
                                                                    (item: any) => listProductDetail.shopId,
                                                                );
                                                                if (listShopId.includes(user.shopId)) {
                                                                    toastWarning(t('toast.CantBuyOwnProduct'));
                                                                }
                                                                ////
                                                                if (!addressCurrent) {
                                                                    toastWarning(t('toast.MissingAddress'));
                                                                } else if (totalPrice == 0 || totalItem == 0) {
                                                                } else {
                                                                    setIsShowPaypal(true);
                                                                }
                                                            }
                                                        } else {
                                                            AlertLogin();
                                                        }
                                                    }}
                                                >
                                                    {t('product.Buy')}
                                                    <span className="font-bold ">({totalItem})</span>
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </>
                ) : (
                    <div className="container flex justify-center relative">
                        <div
                            onClick={() => setIsShowPaypal(false)}
                            className="absolute left-12 top-0 cursor-pointer hover:opacity-70"
                        >
                            <ArrowBackIcon />
                        </div>
                        <div>
                            <div>
                                <h1>Thanh toán với PayPal</h1>
                                <div id="paypal-button-container"></div>
                            </div>
                            <div className="w-full pt-3 pl-3 pr-3 grid grid-cols-2">
                                <div> {t('product.Total')} : </div>
                                <span className="font-bold text-red-400 opacity-80">
                                    {parseFloat((getPriceAll() / USD).toFixed(2))} $
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <DialogAddressCheckout
                open={openDialogChangeAddress}
                setAddressCurrent={setAddressCurrent}
                onClose={() => setOpenDialogChangeAddress(false)}
            />
        </div>
    );
};

export default Checkout;
