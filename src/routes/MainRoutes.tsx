import React, { useEffect, useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { HOST_BE, SOCKET_HOST, typeRole } from '../common/Common';
import ForgetPassword from '../pages/user-guest/auth/ForgetPassword';
import HomePage from '../pages/user-guest/Homepage';
import { ReducerProps } from '../reducers/ReducersProps';
import LoginRegister from '../pages/user-guest/auth/LoginRegister';
import { Login } from '@mui/icons-material';
import InfoUser from '../pages/user-guest/InfoUser';
import AllAddress from '../pages/user-guest/address/AllAddress';
import AddressCreate from '../pages/user-guest/address/AddressCreate';
import AddressEdit from '../pages/user-guest/address/AddressEdit';
import Page404 from '../pages/default/page404';
import Category from '../pages/user-guest/category/Category';
import CategoryView from '../pages/user-guest/category/CategoryView';
import CategoryManagement from '../pages/admin/scenes/Category';
import Checkout from '../pages/user-guest/order/Checkout2';
import Order from '../pages/user-guest/order/Order2';
import { io } from 'socket.io-client';
import { change_list_address, set_number_cart, set_socket_id_client } from '../reducers/Actions';
import Header from '../components/user-guest/header/Header';
import { GetApi, PostGuestApi } from '../untils/Api';
import IndexAdmin from '../pages/admin';
import ApplicationsMessenger from '../pages/admin/scenes/Messenger';
import Wallet from '../pages/user-guest/wallet/Wallet';
import RegisterWallet from '../pages/user-guest/wallet/RegisterWallet';
import Voucher from '../pages/user-guest/voucher/voucher';
import DashboardAdmin from '../pages/admin/scenes/Dashboard';
import UserManagement from '../pages/admin/scenes/User';
import { checkCart, getListProductIdInCart, toastWarning, totalQuantityInCart } from '../untils/Logic';
import AdminSidebarLayout from '../pages/admin/sidebar/Index';
import { useTranslation } from 'react-i18next';
import OriginManagement from '../pages/admin/scenes/Origin';
import BrandManagement from '../pages/admin/scenes/Brand';
import MaterialManagement from '../pages/admin/scenes/Material';
import StylesManagement from '../pages/admin/scenes/Styles';
import OrderRevenueManagement from '../pages/shop/scenes/Revenue';
import HomeLayout from '../pages/user-guest/HomeLayout';
import ProductDetail from '../pages/user-guest/product/ProductDetail2';
import ProductCollection from '../pages/user-guest/category/Collection';
import ProductManagement from '../pages/admin/scenes/Product';
import Footer from '../components/admin-shop/footer/Footer';
import NewOrder from '../pages/admin/scenes/NewOrder';
import OrderManagement from '../pages/admin/scenes/OrderManament';
import DetailCommissionManagement from '../pages/admin/scenes/DetailCommission';
import CommissionStatistic from '../pages/admin/scenes/CommissionStatistic';

//--------------------------------------------------------------
//--------------------------------------------------------------
interface MainRoutersProps {}
export const socket_IO_Client = io(SOCKET_HOST);
//--------------------------------------------------------------

const MainRouters: React.FC<MainRoutersProps> = (props) => {
    const store = useStore();
    const [id, setId] = useState<any>(undefined);
    const { t } = useTranslation();
    const role = useSelector((state: ReducerProps) => state.role);
    const user = useSelector((state: ReducerProps) => state.user);
    // const getDataAddress = async () => {
    //     const resDataAddress = await GetApi('/user/address/get', localStorage.getItem('token'));
    //     if (resDataAddress.status == 200) {
    //         store.dispatch(change_list_address(resDataAddress.data.listAddress));
    //     }
    // };
    const getNumberCart = async () => {
        const res_number_cart = await PostGuestApi('/api/check-cart', { productDetailIds: getListProductIdInCart() });
        if (res_number_cart.data.message == 'Success') {
            checkCart(res_number_cart.data.productDetailIds);
            store.dispatch(set_number_cart(totalQuantityInCart()));
        }
    };
    useEffect(() => {
        //
        // getNumberCart();
        //
        socket_IO_Client.on('sendIdFromServer', (data) => {
            store.dispatch(set_socket_id_client(data));
        });
        return () => {
            socket_IO_Client.disconnect();
        };
    }, []);
    useEffect(() => {
        if (localStorage.getItem('token')) {
            // getDataAddress();
        }
        if (user?.id) {
            socket_IO_Client.emit('sendUserIdFromClient', user.id);
        }
    }, [user]);

    const defaultPage = (
        <>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/err404" element={<Page404 />}></Route>
            <Route path="/product/:productId" element={<ProductDetail />}></Route>
            <Route path="/category" element={<Category />}></Route>
            <Route path="/collections" element={<ProductCollection />}></Route>
            <Route path="/category-view/:categoryId" element={<CategoryView />}></Route>
        </>
    );

    if (role === typeRole.GUEST) {
        return (
            <>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<HomeLayout />}>

                            {defaultPage}
                            <Route path="/login" element={<Login />}></Route>
                            <Route path="/login-register" element={<LoginRegister />}></Route>
                            <Route path="/forget-password" element={<ForgetPassword />}></Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </>
        );
    } else if (role === typeRole.CTV) {
        return (
            <>
                <BrowserRouter>
                    <Header />
                    <Routes>
                        {defaultPage}
                        <Route path="/user/info-user" element={<InfoUser />}></Route>
                        <Route path="/user/address" element={<AllAddress />}></Route>
                        <Route path="/user/wallet" element={<Wallet />}></Route>
                        <Route path="/user/wallet/register" element={<RegisterWallet />}></Route>
                        <Route path="/user/address/create" element={<AddressCreate />}></Route>
                        <Route path="/user/address/edit/:addressId" element={<AddressEdit />}></Route>
                        <Route path="/user/voucher" element={<Voucher />}></Route>
                        <Route path="/checkout" element={<Checkout />}></Route>
                        <Route path="/user/order" element={<Order />}></Route>
                    </Routes>

                </BrowserRouter>
            </>
        );
    } else if (role === typeRole.ADMIN) {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/err404" element={<Page404 />}></Route>
                    <Route path="/" element={<IndexAdmin />}></Route>
                    <Route path="/admin" element={<AdminSidebarLayout />}>
                        {/* <Route path="" element={<DashboardAdmin />} /> */}
                        <Route path="dashboard" element={<DashboardAdmin />} />
                        <Route path="management/categories" element={<CategoryManagement />} />
                        <Route path="management/products" element={<ProductManagement />} />
                        <Route path="management/new-orders" element={<NewOrder />} />
                        <Route path="management/orders" element={<OrderManagement />} />
                        <Route path="management/detail-commission" element={<DetailCommissionManagement />} />
                        <Route path="management/commission-statistics" element={<CommissionStatistic />} />
                        <Route path="management/user" element={<UserManagement />} />
                        <Route path="management/origin" element={<OriginManagement />} />
                        <Route path="management/styles" element={<StylesManagement />} />
                        <Route path="management/material" element={<MaterialManagement />} />
                        <Route path="management/brand" element={<BrandManagement />} />
                        <Route path="messenger" element={<ApplicationsMessenger />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        );
    } else {
        return <></>;
    }
};
export default MainRouters;
