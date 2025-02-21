import React, { useEffect, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSelector } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { GetApi } from '../../../untils/Api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceFrownOpen } from '@fortawesome/free-solid-svg-icons';
import { socket_IO_Client } from '../../../routes/MainRoutes';
import { Badge, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CircleIcon from '@mui/icons-material/Circle';
import NotiNew from '../notification/NotiNew';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';
import { t } from 'i18next';
import { HOST_BE } from '../../../common/Common';

interface MenuNotificationProps {}
const MenuNotification: React.FC<MenuNotificationProps> = (props) => {
    //
    const lng = useSelector((state: ReducerProps) => state.lng);
    //
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setNumberUnread(0);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    //
    const [notifications, setNotifications] = useState<any>(undefined);
    const [notificationsCurrent, setNotificationsCurrent] = useState<any>(undefined);
    const [limit, setLimit] = useState<number>(6);
    const [skip, setSkip] = useState<number>(0);
    const [isReq, setIsReq] = useState<boolean>(false);
    const [numberUnread, setNumberUnread] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [isReqMore, setIsReqMore] = useState<boolean>(false);
    const [isInUnRead, setIsInUnRead] = useState<boolean>(false);
    const [isShowNotiNew, setIsShowNotiNew] = useState<boolean>(false);
    const nav = useNavigate();
    const user = useSelector((state: ReducerProps) => state.user);
    //
    const getDataNotification = async () => {
        const notificationsRes = await GetApi(`/user/get-notification/${limit}/${skip}`, localStorage.getItem('token'));
        if (notificationsRes.data.message == 'Success') {
            //set notifications
            if (notifications && isReqMore) {
                setNotifications(notifications.concat(notificationsRes.data.notifications));
                setIsReqMore(false);
            } else {
                setNotifications(notificationsRes.data.notifications);
            }
            //has more ?
            if (notificationsRes.data.notifications.length == limit) {
                setHasMore(true);
            } else {
                setHasMore(false);
            }
        }
    };
    const handleClickMore = () => {
        setSkip((prev) => (prev += 1));
        setIsReqMore(true);
        setIsReq(true);
    };
    const handleClickNotification = async (notification: any) => {
        if (notification.status == 'UNREAD') {
            const res = await GetApi(`/user/read-notification/${notification.id}`, localStorage.getItem('token'));
            if (res.data.message == 'Success') {
                setIsReq(true);
                if (notification.link == '/user/order/cancle') {
                    // window.location.href = '/user/order';
                    nav('/user/order', { state: { indexTabs: 4 } });
                }
                if (notification.link == '/user/order/processed') {
                    // window.location.href = '/user/order';
                    nav('/user/order', { state: { indexTabs: 3 } });
                }
                if (notification.link == '/user/order/confirmed') {
                    // window.location.href = '/user/order';
                    nav('/user/order', { state: { indexTabs: 2 } });
                }
                if (notification.link == '/user/order/delivering') {
                    // window.location.href = '/user/order';
                    nav('/user/order', { state: { indexTabs: 1 } });
                }
                if (notification.link == '/user/order') {
                    // window.location.href = '/user/order';
                    nav('/user/order', { state: { indexTabs: 0 } });
                }
                if (notification.link == '/user/wallet') {
                    // window.location.href = '/user/order';
                    nav('/user/wallet');
                }
                setAnchorEl(null);
            }
        } else {
            if (notification.link == '/user/order/cancle') {
                // window.location.href = '/user/order';
                nav('/user/order', { state: { indexTabs: 4 } });
            }
            if (notification.link == '/user/order/processed') {
                // window.location.href = '/user/order';
                nav('/user/order', { state: { indexTabs: 3 } });
            }
            if (notification.link == '/user/order/confirmed') {
                // window.location.href = '/user/order';
                nav('/user/order', { state: { indexTabs: 2 } });
            }
            if (notification.link == '/user/order/delivering') {
                // window.location.href = '/user/order';
                nav('/user/order', { state: { indexTabs: 1 } });
            }
            if (notification.link == '/user/order') {
                // window.location.href = '/user/order';
                nav('/user/order', { state: { indexTabs: 0 } });
            }
            if (notification.link == '/user/wallet') {
                // window.location.href = '/user/order';
                nav('/user/wallet');
            }
            if (notification.link.startsWith('/product')) {
                window.location.href = notification.link;
            }
            setAnchorEl(null);
        }
    };
    useEffect(() => {
        if (user.id && !notifications) {
            getDataNotification();
        }
    }, [user]);
    useEffect(() => {
        if (isReq) {
            if (user.id) {
                getDataNotification();
                setIsReq(false);
            } else {
                setIsReq(false);
            }
        }
    }, [isReq]);

    useEffect(() => {
        if (notifications) {
            //set number unread
            if (isInUnRead) {
                setNotificationsCurrent(notifications.filter((item: any) => item.status == 'UNREAD'));
            } else {
                setNotificationsCurrent(notifications);
            }
            const notiUnread = notifications.filter((notification: any) => notification.status == 'UNREAD');
            setNumberUnread(notiUnread.length);
        }
    }, [notifications]);
    useEffect(() => {
        socket_IO_Client.on('reqNotification', (data) => {
            setIsReq(true);
        });
        socket_IO_Client.on('reqNotifitionByOrther', (data) => {
            setIsShowNotiNew(true);
        });
    }, []);
    return (
        <div className="">
            <span onClick={handleClick} className="mr-3 ml-3 cursor-pointer scale">
                <Badge badgeContent={numberUnread} color="error">
                    <NotificationsIcon sx={{color: "rgba(7, 110, 145, 0.89)"}} />
                </Badge>
            </span>
            <Menu
                style={{ marginTop: 18 }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            >
                <div className="relative" style={{ minWidth: 400, height: 650 }}>
                    <div className="flex items-center mb-6 ml-6 select-none">
                        <div className="font-bold  text-blue-500 ">{t('notification.Notifications')}</div>
                        <div
                            onClick={() => {
                                if (!isInUnRead) {
                                    setNotificationsCurrent(
                                        notifications.filter((item: any) => item.status == 'UNREAD'),
                                    );
                                } else {
                                    setNotificationsCurrent(notifications);
                                }
                                setIsInUnRead((prev: any) => !prev);
                            }}
                            className={`font-bold bg-general p-2  ml-6 rounded-lg hover:opacity-60 transition-all duration-500 cursor-pointer select-none ${
                                isInUnRead ? 'bg-blue-500 text-white' : ''
                            }`}
                        >
                            {!isInUnRead ? t('notification.UNREAD') : t('notification.All')}{' '}
                        </div>
                    </div>
                    <Divider />
                    {notificationsCurrent ? (
                        notificationsCurrent.map((notification: any) => (
                            <div
                                key={notification.id}
                                onClick={() => handleClickNotification(notification)}
                                style={{ width: 400, height: 100 }}
                                className={`relative p-3 m-1 hover:bg-gray-300 transition-all duration-500 rounded-xl cursor-pointer select-none ${
                                    notification.status == 'UNREAD' ? 'bg-gray-100' : ''
                                }`}
                            >
                                <div className="grid grid-cols-4">
                                    <div>
                                        <img
                                            className="rounded-full"
                                            style={{ objectFit: 'contain', height: 80, width: 80 }}
                                            src={
                                                notification.image == 'OrderSuccess' ||
                                                notification.image == 'ReOrderSuccess'
                                                    ? require('../../../static/order-success.png')
                                                    : notification.image == 'OrderDelivering'
                                                    ? require('../../../static/order-delivering.png')
                                                    : notification.image == 'OrderDelivered'
                                                    ? require('../../../static/order-delivered.png')
                                                    : notification.image == 'CancleOrderSuccess'
                                                    ? require('../../../static/order-cancle.png')
                                                    : notification.image == 'DepositeSuccess'
                                                    ? require('../../../static/deposite-success.png')
                                                    : notification.image == 'WithdrawSuccess'
                                                    ? require('../../../static/deposite-success.png')
                                                    : notification.image == 'WithdrawPending'
                                                    ? require('../../../static/WithdrawPending.png')
                                                    : notification.image == 'WithdrawCancel'
                                                    ? require('../../../static/WithdrawCancel.png')
                                                    : notification.image.startsWith('uploads')
                                                    ? `${HOST_BE}/${notification.image}`
                                                    : 'https://media.istockphoto.com/id/1344512181/vi/vec-to/bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-loa-m%C3%A0u-%C4%91%E1%BB%8F.jpg?s=612x612&w=0&k=20&c=t8xmvCQKhdqmyG2ify0vXMIgK5ty7IpOyicWE-Rrpzg='
                                            }
                                        />
                                    </div>

                                    <div className="col-span-3 font-bold text-sm mt-2">{notification.describe}</div>
                                    <div
                                        className={`${
                                            notification.status == 'UNREAD' ? '' : 'hidden'
                                        } absolute top-1 right-1`}
                                    >
                                        <CircleIcon style={{ width: 10, height: 10 }} />
                                    </div>
                                    <div className="absolute bottom-1 right-3 text-xs">
                                        {lng == 'vn'
                                            ? formatDistanceToNow(new Date(notification.createDate), {
                                                  addSuffix: true,
                                                  locale: vi,
                                              })
                                            : formatDistanceToNow(new Date(notification.createDate), {
                                                  addSuffix: true,
                                                  locale: enUS,
                                              })}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>
                            <div className="w-full text-center mt-12">
                                <FontAwesomeIcon icon={faFaceFrownOpen} size="2xl" style={{ color: '#74C0FC' }} />
                            </div>
                        </div>
                    )}
                    <div
                        onClick={handleClickMore}
                        className={`sticky z-10 bottom-0 left-0 right-auto box-shadow bg-blue-100 w-full mt-6 text-center rounded p-3 text-sm font-bold text-blue-500 cursor-pointer ${
                            hasMore ? '' : 'hidden'
                        }`}
                    >
                        {t('notification.More')}
                    </div>
                </div>
            </Menu>
            <NotiNew isShow={isShowNotiNew} setIsShow={setIsShowNotiNew} />
        </div>
    );
};

export default MenuNotification;
