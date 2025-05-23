import './App.css';
import MainRouters from './routes/MainRoutes';
import LoadingProcess from './components/loading/LoadingProcess';
import SelectTranslate from './components/SelectTranslate';
import { applyMiddleware, createStore } from 'redux';
import { useEffect, useRef, useState } from 'react';
import myReducer from './reducers/Reducers';
import { Provider, useSelector } from 'react-redux';
import { change_list_address, change_role, change_user } from './reducers/Actions';
import { SOCKET_HOST, typeLng, typeRole } from './common/Common';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initI18n } from './translate/Translate';
import { GetApi } from './untils/Api';
import { thunk } from 'redux-thunk';
import { totalQuantityInCart } from './untils/Logic';
import ThemeProvider from './theme/ThemeProvider';

function App() {
    const store = createStore(myReducer, applyMiddleware(thunk));
    initI18n(sessionStorage.getItem('lng') || typeLng.VN);

    //get role if have token
    const getRoleAndUser = async () => {
        try {
            const res_role = await GetApi('/user/get-role', localStorage.getItem('token'));
            store.dispatch(change_role(res_role.data.role));
            const res_user = await GetApi('/user/get-user', localStorage.getItem('token'));
            store.dispatch(change_user(res_user.data.user));
            if (res_user.data.user.id) {
                store.dispatch(change_role(res_user.data.user.role));
            }
        } catch (e) {
            localStorage.removeItem('token');
        }
    };
    // const getDataAddress = async () => {
    //     const resDataAddress = await GetApi('/user/address/get', localStorage.getItem('token'));
    //     if (resDataAddress.status == 200) {
    //         store.dispatch(change_list_address(resDataAddress.data.listAddress));
    //     }
    // };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getRoleAndUser();
            // getDataAddress();
        } else {
            store.dispatch(change_role('GUEST'));
        }
    }, []);

    return (
        <Provider store={store}>
            <ThemeProvider>
                <MainRouters />
                <ToastContainer />
                <LoadingProcess />
            </ThemeProvider>
        </Provider>
    );
}

export default App;
