import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { set_number_cart } from '../../../reducers/Actions';
import DrawerMenu from './DrawerMenu';
import DrawerSearch from './DrawerSearch';
import { Box, Divider, Typography } from '@mui/material';
import { FEMALE_ID, MALE_ID, typeRole } from '../../../common/Common';
import MenuUser from './MenuUser';
import DrawerCart from './DrawerCart';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import HeaderNotifications from './Notification';
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
    const listCart = JSON.parse(localStorage.getItem('listCart') || '[]');

    const store = useStore();
    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [openCart, setOpenCart] = useState<boolean>(false);
    const [showAnnouncement, setShowAnnouncement] = useState(true);
    const [announcements, setAnnouncements] = useState([]);

    const [search, setSearch] = useState<string>('');
    const role = useSelector((state: ReducerProps) => state.role);
    const user = useSelector((state: ReducerProps) => state.user);
    //
    const typingTimeoutRef = useRef<any>(null);
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }

    const getAnnouncement = async () => {
        const res = await GetApi('/api/announcements', null);
        if (res.data.message == 'Success') {
            setAnnouncements(res.data.announcements);
        }
    };

    //
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
        const handleScroll = () => {
            if (window.scrollY > 70) {
                setShowAnnouncement(false);
            } else {
                setShowAnnouncement(true);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    useEffect(() => {
        setNumberCart();
    }, []);
    useEffect(() => {
        getAnnouncement();
    }, []);
    const leftAnnouncement = announcements.filter((announcement: any) => announcement.position === 'LEFT');
    const rightAnnouncement = announcements.filter((announcement: any) => announcement.position === 'RIGHT');
    const centerAnnouncement = announcements.filter((announcement: any) => announcement.position === 'CENTER');

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
            <div className="box-shadow bg-white fixed top-0 right-auto w-full" style={{ zIndex: 999, height: 'auto' }}>
                {/* {showAnnouncement && ( */}
                <Box
                    display="flex"
                    bgcolor="#333"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                        transition: 'opacity 0.5s ease, transform 0.5s ease, max-height 0.5s ease',
                        opacity: showAnnouncement ? 1 : 0,
                        transform: showAnnouncement ? 'translateY(0)' : 'translateY(-10px)',
                        pointerEvents: showAnnouncement ? 'auto' : 'none',
                        maxHeight: showAnnouncement ? '35px' : '0px',
                        visibility: showAnnouncement ? 'visible' : 'hidden',
                    }}
                >
                    <Box flex={1} sx={{ width: { xs: '100%', sm: '45%' } }}>
                        <Swiper
                            spaceBetween={50}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                                waitForTransition: true,
                            }}
                            style={{ padding: '5px 0' }}
                            modules={[Autoplay]}
                        >
                            {leftAnnouncement.map((announcement: any) => (
                                <SwiperSlide key={announcement.id}>
                                    <a style={{ color: 'white', textAlign: 'center', textDecoration: 'none' }}>
                                        <p>{announcement.content}</p>
                                    </a>
                                </SwiperSlide>
                            ))}
                            <SwiperSlide>
                                <a style={{ color: 'white', textAlign: 'center', textDecoration: 'none' }}>
                                    <p>
                                        Đón đầu xu hướng với giày dép{' '}
                                        <span style={{ textDecoration: 'underline' }}>
                                            <strong>MỚI NHẤT 2025</strong>
                                        </span>
                                    </p>
                                </a>
                            </SwiperSlide>
                        </Swiper>
                    </Box>
                    <Box flex={1} maxWidth="25%" textAlign="center" sx={{ display: { xs: 'none', sm: 'block' } }}></Box>

                    <Box flex={1} maxWidth="30%" textAlign="center" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Swiper
                            spaceBetween={50}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                                waitForTransition: true,
                            }}
                            style={{ padding: '5px 0' }}
                            modules={[Autoplay]}
                        >
                            {rightAnnouncement.map((announcement: any) => (
                                <SwiperSlide key={announcement.id}>
                                    <a style={{ color: 'white', textAlign: 'center', textDecoration: 'none' }}>
                                        <p>{announcement.content}</p>
                                    </a>
                                </SwiperSlide>
                            ))}
                            <SwiperSlide>
                                <a style={{ color: 'white', textAlign: 'center', textDecoration: 'none' }}>
                                    <p>Mua ngay để nhận nhiều ưu đãi hấp dẫn! 🤩</p>
                                </a>
                            </SwiperSlide>
                        </Swiper>
                    </Box>
                </Box>
                {/* )} */}

                <div className="flex items-center justify-between container h-90 bg-white">
                    <div
                        className="flex items-center cursor-pointer lg:hidden ml-6 flex-grow"
                        onClick={toggleDrawerMenu(true)}
                    >
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
                            href="/"
                            style={{ fontSize: '19px' }}
                            className={`hover:border-blue-300 border-b-2 border-white mr-5 cursor-pointer text-3xl hover:text-blue-500 transition-all duration-800 ${
                                index === 0 ? 'font-bold text-blue-400' : ''
                            }`}
                        >
                            TRANG CHỦ
                        </a>
                        <a
                            href="collections?category=Crocs"
                            style={{ fontSize: '19px' }}
                            className={`hover:border-blue-300 border-b-2 border-white mr-5 cursor-pointer text-3xl hover:text-blue-500 transition-all duration-800 ${
                                index === 1 ? 'font-bold text-blue-400' : ''
                            }`}
                        >
                            CROCS
                        </a>
                        <a
                            href={`collections?category=MLB`}
                            style={{ fontSize: '19px' }}
                            className={`hover:border-blue-300 border-b-2 border-white mr-5 cursor-pointer text-3xl hover:text-blue-500 transition-all duration-800 ${
                                index === 2 ? 'font-bold text-blue-400' : ''
                            }`}
                        >
                            MLB
                        </a>
                        <a
                            href={`collections?category=Adidas`}
                            style={{ fontSize: '19px' }}
                            className={`hover:border-blue-300 border-b-2 border-white mr-5 cursor-pointer text-3xl hover:text-blue-500 transition-all duration-800 ${
                                index === 2 ? 'font-bold text-blue-400' : ''
                            }`}
                        >
                            ADIDAS
                        </a>
                        <a
                            href={`collections?category=Trẻ em`}
                            style={{ fontSize: '19px' }}
                            className={`hover:border-blue-300 border-b-2 border-white mr-5 cursor-pointer text-3xl hover:text-blue-500 transition-all duration-800 ${
                                index === 2 ? 'font-bold text-blue-400' : ''
                            }`}
                        >
                            TRẺ EM
                        </a>
                        <a
                            href={`collections?category=Jibbitz`}
                            style={{ fontSize: '19px' }}
                            className={`hover:border-blue-300 border-b-2 border-white  cursor-pointer text-3xl hover:text-blue-500 transition-all duration-800 ${
                                index === 3 ? 'font-bold text-blue-400' : ''
                            }`}
                        >
                            JIBBITZ
                        </a>
                    </div>

                    <div className="flex items-center justify-end flex-grow">
                        <HeaderNotifications />
                        <span onClick={() => setOpenCart(true)} className="mr-3 cursor-pointer">
                            <Badge badgeContent={listCart.length} color="error">
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
                        <span className="mr-3 cursor-pointer">
                            <SearchIcon sx={{ color: 'rgba(7, 110, 145, 0.89)' }} onClick={toggleDrawerSearch(true)} />
                        </span>
                    </div>
                </div>
                <Divider style={{ backgroundColor: 'gray', margin: '2px 0' }} />

                {/* {showAnnouncement && ( */}
                <Box
                    bgcolor="rgb(254, 201, 96)"
                    sx={{
                        transition: 'opacity 0.5s ease, transform 0.5s ease, max-height 0.5s ease',
                        opacity: showAnnouncement ? 1 : 0,
                        transform: showAnnouncement ? 'translateY(0)' : 'translateY(-10px)',
                        pointerEvents: showAnnouncement ? 'auto' : 'none',
                        maxHeight: showAnnouncement ? 'auto' : '0px',
                        visibility: showAnnouncement ? 'visible' : 'hidden',
                        overflow: 'hidden',
                    }}
                >
                    <Swiper
                        spaceBetween={50}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        style={{ padding: '10px 0' }}
                        modules={[Autoplay]}
                    >
                        {centerAnnouncement.map((announcement: any) => (
                            <SwiperSlide key={announcement.id}>
                                <a style={{ color: 'black', textAlign: 'center', textDecoration: 'none' }}>
                                    <p>{announcement.content}</p>
                                </a>
                            </SwiperSlide>
                        ))}
                        <SwiperSlide>
                            <a
                                style={{ color: 'black', textAlign: 'center', textDecoration: 'none' }}
                            >
                                <p>
                                    {' '}
                                    <b>CLICK&amp;COLLECT</b> - Mua ONLINE Nhận NHANH tại cửa hàng.{' '}
                                    <b>
                                        <u>Khám phá ngay!</u>
                                    </b>
                                </p>
                            </a>
                        </SwiperSlide>
                    </Swiper>
                </Box>
                {/* )} */}
                <DrawerMenu open={openMenu} toggleDrawer={toggleDrawerMenu} />
                <DrawerSearch open={openSearch} toggleDrawer={toggleDrawerSearch} />
                <DrawerCart open={openCart} toggleDrawer={setOpenCart} />
            </div>
        </div>
    );
};
export default Header;
