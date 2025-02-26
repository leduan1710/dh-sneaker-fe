import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { set_number_cart, set_number_favorite } from '../../../reducers/Actions';
import DrawerMenu from './DrawerMenu';
import DrawerSearch from './DrawerSearch';
import { Box, Divider, TextField } from '@mui/material';
import { filterSpecialInput, unCheck } from '../../../untils/Logic';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { FEMALE_ID, MALE_ID, typeRole } from '../../../common/Common';
import MenuUser from './MenuUser';
import DrawerCart from './DrawerCart';
import DrawerFavorite from './DrawerFavorite';
import { AlertLogin } from '../../alert/Alert';
import MenuNotification from './MenuNotification';
import { GetApi } from '../../../untils/Api';

interface HeaderProps {
    index?: number;
}
const Header: React.FC<HeaderProps> = (props) => {
    const location = useLocation();

    const { index } = props;
    const nav = useNavigate();
    const { t } = useTranslation();
    const Logo = require('../../../static/dhsneaker-logo.png');
    const numberCart = useSelector((state: ReducerProps) => state.numberCart);
    const numberFavorite = useSelector((state: ReducerProps) => state.numberFavorite);

    const store = useStore();
    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [openCart, setOpenCart] = useState<boolean>(false);
    const [openFavorite, setOpenFavorite] = useState<boolean>(false);

    const [search, setSearch] = useState<string>('');
    const role = useSelector((state: ReducerProps) => state.role);
    const user = useSelector((state: ReducerProps) => state.user);
    //
    const typingTimeoutRef = useRef<any>(null);
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }
    //
    const toggleDrawerFavorite = (newOpen: boolean) => () => {
        setOpenFavorite(newOpen);
    };
    const toggleDrawerMenu = (newOpen: boolean) => () => {
        setOpenMenu(newOpen);
    };

    const toggleDrawerSearch = (newOpen: boolean) => () => {
        setOpenSearch(newOpen);
    };

    const setNumberCart = () => {
        const numberString = localStorage.getItem('nCart');
        if (numberString) {
            try {
                const numberInt = parseInt(numberString);
                store.dispatch(set_number_cart(numberInt));
            } catch (e) {}
        }
    };

    useEffect(() => {
        setNumberCart();
    }, []);

    const getDataSearch = async () => {
        console.log('getApi');
    };
    useEffect(() => {
        typingTimeoutRef.current = setTimeout(() => {
            if (search) {
                getDataSearch();
            }
        }, 500);
    }, [search]);
    const getNumberFavorite = async () => {
        const res = await GetApi('/user/get-number-favorite', localStorage.getItem('token'));
        if (res.data.message == 'Success') {
            store.dispatch(set_number_favorite(res.data.number));
        }
    };
    useEffect(() => {
        if (user.id && numberFavorite == 0) {
            getNumberFavorite();
        }
    }, [user]);
    return (
        <div
            className={`${
                location.pathname == '/login' ||
                location.pathname == '/login-register' ||
                location.pathname == '/forget-password'
                    ? 'hidden'
                    : ''
            }`}
        >
            <div className="box-shadow bg-white fixed top-0 right-auto w-full" style={{ zIndex: 999, height: 110 }}>
                <Box bgcolor="rgba(7, 110, 145, 0.89)" height={20} />
                <div className="flex items-center justify-between container h-90 bg-white">
                    <div className="flex items-center cursor-pointer lg:hidden ml-6 flex-grow" onClick={toggleDrawerMenu(true)}>
                        <MenuIcon sx={{ color: 'rgba(7, 110, 145, 0.89)' }} />
                    </div>

                    <div className="flex justify-center flex-grow">
                        <img
                            className="cursor-pointer"
                            src={Logo}
                            style={{ height: '80px', objectFit: 'cover' }}
                            onClick={() => (window.location.href = '/')}
                        />
                    </div>
                    <div className="lg:flex hidden flex-grow items-center justify-center">
                        <a
                            href="/category"
                            style={{ fontSize: '19px' }}
                            className={`hover:border-blue-300 border-b-2 border-white mr-5 cursor-pointer text-3xl hover:text-blue-500 transition-all duration-800 ${
                                index === 0 ? 'font-bold text-blue-400' : ''
                            }`}
                        >
                            TRANG CHỦ
                        </a>
                        <a
                            href="#product-new-id"
                            style={{ fontSize: '19px' }}
                            className={`hover:border-blue-300 border-b-2 border-white mr-5 cursor-pointer text-3xl hover:text-blue-500 transition-all duration-800 ${
                                index === 1 ? 'font-bold text-blue-400' : ''
                            }`}
                        >
                            TẤT CẢ SẢN PHẨM
                        </a>
                        <a
                            href={`/category-view/${MALE_ID}`}
                            style={{ fontSize: '19px' }}
                            className={`hover:border-blue-300 border-b-2 border-white mr-5 cursor-pointer text-3xl hover:text-blue-500 transition-all duration-800 ${
                                index === 2 ? 'font-bold text-blue-400' : ''
                            }`}
                        >
                            SẢN PHẨM MỚI
                        </a>
                        <a
                            href={`/category-view/${FEMALE_ID}`}
                            style={{ fontSize: '19px'}}
                            className={`hover:border-blue-300 border-b-2 border-white  cursor-pointer text-3xl hover:text-blue-500 transition-all duration-800 ${
                                index === 3 ? 'font-bold text-blue-400' : ''
                            }`}
                        >
                            NỔI BẬT
                        </a>
                    </div>

                    <div className="flex items-center justify-end flex-grow">
                        {/* <span
                            className="mr-3 cursor-pointer"
                            onClick={() => {
                                if (role === typeRole.CTV || role === typeRole.SHOP) {
                                    setOpenFavorite(true);
                                } else {
                                    AlertLogin();
                                }
                            }}
                        >
                            <Badge badgeContent={numberFavorite} color="error">
                                <FavoriteIcon sx={{ color: 'rgba(7, 110, 145, 0.89)' }} />
                            </Badge>
                        </span> */}
                        <span onClick={() => setOpenCart(true)} className="mr-3 cursor-pointer">
                            <Badge badgeContent={numberCart} color="error">
                                <LocalMallIcon sx={{ color: 'rgba(7, 110, 145, 0.89)' }} />
                            </Badge>
                        </span>
                        {role === typeRole.GUEST ? (
                            <span className="mr-3 cursor-pointer" onClick={() => nav('/login-register')}>
                                <AccountCircleIcon sx={{ color: 'rgba(7, 110, 145, 0.89)' }} />
                            </span>
                        ) : (
                            <div className="mr-3 cursor-pointer">
                                <MenuUser avatar={user.image || ''} />
                            </div>
                        )}
                        <span className="mr-3 cursor-pointer hidden lg:block">
                            <SearchIcon sx={{ color: 'rgba(7, 110, 145, 0.89)' }} onClick={toggleDrawerSearch(true)} />
                        </span>
                    </div>
                </div>

                <DrawerMenu open={openMenu} toggleDrawer={toggleDrawerMenu} />
                <DrawerSearch open={openSearch} toggleDrawer={toggleDrawerSearch} />
                <DrawerCart open={openCart} toggleDrawer={setOpenCart} />
                <DrawerFavorite open={openFavorite} toggleDrawer={toggleDrawerFavorite} />
            </div>
            <div
                onClick={toggleDrawerSearch(true)}
                style={{ marginTop: 120 }}
                className={`mt-6 mb-6 ml-12 mr-12 relative lg:hidden block ${index == 0 ? 'hidden' : ''}`}
            >
                <span className="absolute top-1 left-2">
                    <SearchIcon sx={{ color: 'rgba(7, 110, 145, 0.89)' }} />
                </span>

                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    fullWidth
                    value={search}
                    InputProps={{
                        style: { borderRadius: '100px', height: '37px' },
                    }}
                    inputProps={{
                        style: { paddingLeft: 40, paddingRight: 40 },
                    }}
                    // onChange={(e) => {
                    //     filterSpecialInput(e.target.value, setSearch);
                    // }}
                />
                {search ? (
                    <span className="absolute top-1 right-2 cursor-pointer">
                        <HighlightOffIcon onClick={() => setSearch('')} sx={{ color: 'rgba(7, 110, 145, 0.89)' }} />
                    </span>
                ) : null}
            </div>

        </div>
    );
};
export default Header;
