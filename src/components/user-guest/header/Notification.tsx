import React, { useEffect, useRef, useState } from 'react';
import {
    alpha,
    Avatar,
    Badge,
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    Popover,
    Tooltip,
    Typography,
    Button,
    CircularProgress,
} from '@mui/material';
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { styled } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { enUS, vi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { socket_IO_Client } from '../../../routes/MainRoutes';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { GetApi } from '../../../untils/Api';

const NotificationsBadge = styled(Badge)(
    ({ theme }) => `
    .MuiBadge-badge {
        background-color: ${alpha(theme.palette.error.main, 0.1)};
        color: ${theme.palette.error.main};
        min-width: 16px; 
        height: 16px;
        padding: 0;

        &::after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-shadow: 0 0 0 1px ${alpha(theme.palette.error.main, 0.3)};
            content: "";
        }
    }
`,
);

function HeaderNotifications() {
    const { t } = useTranslation();
    const user = useSelector((state: ReducerProps) => state.user);
    const lng = useSelector((state: ReducerProps) => state.lng);

    const ref = useRef<any>(null);
    const navigate = useNavigate();
    const [isOpen, setOpen] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showAll, setShowAll] = useState<boolean>(false);
    const [onlyUnread, setOnlyUnread] = useState<boolean>(false);

    const getDataNotification = async () => {
        const notificationsRes = await GetApi(`/user/get-notification`, localStorage.getItem('token'));
        if (notificationsRes.data.message === 'Success') {
            setNotifications(notificationsRes.data.notifications);
        }
    };

    const handleReadNotification = async (notificationId: any) => {
        const notificationsRes = await GetApi(
            `/user/read-notification/${notificationId}`,
            localStorage.getItem('token'),
        );
        if (notificationsRes.data.message === 'Success') {
            getDataNotification();
        }
    };

    const handleNotificationClick = (notification: any) => {
        setOpen(false);

        if (notification.status != 'SEEN') handleReadNotification(notification.id);

        // Khi nhấp vào thông báo, điều hướng và truyền trạng thái
        if (notification.link === '/orders/cancel') {
            navigate('/user/order');
        }
    };

    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    const toggleOnlyUnread = () => {
        setOnlyUnread(!onlyUnread);
    };

    useEffect(() => {
        if (user.id) {
            getDataNotification();
        }
    }, [user]);

    useEffect(() => {
        const handleNewNotification = () => {
            getDataNotification();
        };

        socket_IO_Client.on('reqNotification', handleNewNotification);
        return () => {
            socket_IO_Client.off('reqNotification', handleNewNotification);
        };
    }, []);

    const filteredNotifications = onlyUnread
        ? notifications.filter((notification) => notification.status !== 'SEEN')
        : notifications;

    const displayedNotifications = showAll ? filteredNotifications : filteredNotifications.slice(0, 5);

    return (
        <>
            <Tooltip arrow title={t('notification.Notifications')}>

                {/* <IconButton color="primary" ref={ref} onClick={handleOpen}>
                    <NotificationsBadge
                        badgeContent={filteredNotifications.filter((notification) => notification.status !== 'SEEN').length}
                    >
                        <NotificationsIcon sx={{color: "rgba(7, 110, 145, 0.89)"}}/>
                    </NotificationsBadge>
                </IconButton> */}
                        <span onClick={handleOpen} className="mr-3 ml-3 cursor-pointer scale" ref={ref}>
            <Badge badgeContent={filteredNotifications.filter((notification) => notification.status !== 'SEEN').length} color="error">
                <NotificationsIcon sx={{ color: "rgba(7, 110, 145, 0.89)" }} />
            </Badge>
        </span>
            </Tooltip>
            <Popover
                anchorEl={ref.current}
                onClose={handleClose}
                open={isOpen}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box sx={{ p: 2, minWidth: 250 }} display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h5">Thông báo</Typography>
                    <Button onClick={toggleOnlyUnread} color="primary">
                        {onlyUnread ? t('notification.All') : t('notification.UNREAD')}
                    </Button>
                </Box>
                <Divider />
                <List sx={{ pl: 1, pr: 1 }}>
                    {displayedNotifications.length > 0 ? (
                        displayedNotifications.map((notification, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    p: 2,
                                    maxWidth: 360,
                                    minWidth: 300,
                                    display: 'flex',
                                    borderRadius: 1,
                                    flexDirection: 'row',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: (theme) => theme.palette.action.hover,
                                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                                    },
                                }}
                                onClick={() => {
                                    handleNotificationClick(notification);
                                }}
                            >
                                <Avatar
                                    variant="rounded"
                                    sx={{ mr: 1 }}
                                    src={
                                        notification.image === 'NewOrder'
                                            ? require('../../../static/new-order.png')
                                            : 'https://media.istockphoto.com/id/1344512181/vi/vec-to/bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-loa-m%C3%A0u-%C4%91%E1%BB%8F.jpg?s=612x612&w=0&k=20&c=t8xmvCQKhdqmyG2ify0vXMIgK5ty7IpOyicWE-Rrpzg='
                                    }
                                />
                                <Box flex="1">
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography
                                            sx={{ fontWeight: notification.status === 'SEEN' ? 'normal' : 'bold' }}
                                        >
                                            {notification.describe}
                                        </Typography>
                                        {notification.status === 'UNREAD' && (
                                            <FiberManualRecordIcon fontSize="small"></FiberManualRecordIcon>
                                        )}
                                    </Box>
                                    <Typography component="span" variant="body2" color="text.secondary">
                                        {lng === 'vn'
                                            ? formatDistanceToNow(new Date(notification.createDate), {
                                                  addSuffix: true,
                                                  locale: vi,
                                              })
                                            : formatDistanceToNow(new Date(notification.createDate), {
                                                  addSuffix: true,
                                                  locale: enUS,
                                              })}
                                    </Typography>
                                </Box>
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <Typography variant="body2" color="text.secondary">
                                {t('notification.NoNotification')}
                            </Typography>
                        </ListItem>
                    )}
                </List>
                <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={toggleShowAll} color="primary">
                        {showAll ? t('notification.Hide') : t('notification.More')}
                    </Button>
                </Box>
            </Popover>
        </>
    );
}

export default HeaderNotifications;
