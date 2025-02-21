import React, { useState, ChangeEvent, useEffect } from 'react';
import {
    Box,
    Typography,
    FormControlLabel,
    Switch,
    Tabs,
    Tab,
    TextField,
    IconButton,
    InputAdornment,
    Avatar,
    List,
    Button,
    Tooltip,
    Divider,
    AvatarGroup,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    lighten,
    styled,
} from '@mui/material';
import { formatDistance, subMinutes, subHours } from 'date-fns';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import AlarmTwoToneIcon from '@mui/icons-material/AlarmTwoTone';
import { Link as RouterLink } from 'react-router-dom';
import Label from '../../../../components/admin-shop/label/Label';
import { useSelector } from 'react-redux';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { GetApi, GetGuestApi, PostApi } from '../../../../untils/Api';
import Opposite from './Opposite';
import { Sidebar } from 'react-chat-elements';
import { HOST_BE } from '../../../../common/Common';
import { socket_IO_Client } from '../../../../routes/MainRoutes';
import { useTranslation } from 'react-i18next';

const AvatarSuccess = styled(Avatar)(
    ({ theme }) => `
          background-color: ${theme.colors.success.lighter};
          color: ${theme.colors.success.main};
          width: ${theme.spacing(8)};
          height: ${theme.spacing(8)};
          margin-left: auto;
          margin-right: auto;
    `,
);

const MeetingBox = styled(Box)(
    ({ theme }) => `
          background-color: ${lighten(theme.colors.alpha.black[10], 0.5)};
          margin: ${theme.spacing(2)} 0;
          border-radius: ${theme.general.borderRadius};
          padding: ${theme.spacing(2)};
    `,
);

const RootWrapper = styled(Box)(
    ({ theme }) => `
        padding: ${theme.spacing(2.5)};
  `,
);

const ListItemWrapper = styled(ListItemButton)(
    ({ theme }) => `
        &.MuiButtonBase-root {
            margin: ${theme.spacing(1)} 0;
        }
  `,
);

const TabsContainerWrapper = styled(Box)(
    ({ theme }) => `
        .MuiTabs-indicator {
            min-height: 4px;
            height: 4px;
            box-shadow: none;
            border: 0;
        }

        .MuiTab-root {
            &.MuiButtonBase-root {
                padding: 0;
                margin-right: ${theme.spacing(3)};
                font-size: ${theme.typography.pxToRem(16)};
                color: ${theme.colors.alpha.black[50]};

                .MuiTouchRipple-root {
                    display: none;
                }
            }

            &.Mui-selected:hover,
            &.Mui-selected {
                color: ${theme.colors.alpha.black[100]};
            }
        }
  `,
);
interface SidebarContentProps {
    setOppositeCurrent: any;
    oppositeCurrent: any;
}
const SidebarContent: React.FC<SidebarContentProps> = (props) => {
    const { setOppositeCurrent, oppositeCurrent } = props;
    const user = useSelector((state: ReducerProps) => state.user);
    const {t} = useTranslation();
    const [shop, setShop] = useState<any>(undefined);
    const [messages, setMessages] = useState<any>(undefined);
    const [opposites, setOpposites] = useState<any>(undefined);
    const [isReq, setIsReq] = useState<boolean>(false);

    const [state, setState] = useState({
        invisible: true,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };

    const [currentTab, setCurrentTab] = useState<string>('all');

    const tabs = [
        { value: 'all', label: 'All' },
        { value: 'unread', label: 'Unread' },
        { value: 'archived', label: 'Archived' },
    ];

    const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
        setCurrentTab(value);
    };
    const getDataShop = async () => {
        const res = await GetGuestApi(`/api/shop/${user.shopId}`);
        if (res.data.message == 'Success') {
            setShop(res.data.shop);
        }
    };
    const getDataMessage = async () => {
        const res = await GetApi('/shop/get-message', localStorage.getItem('token'));
        if (res.data.message == 'Success') {
            setMessages(res.data.messages);
        }
        const userIdList = res.data.messages.map((item: any) => item.userId);
        const resOpposite = await PostApi('/shop/get-opposite', localStorage.getItem('token'), {
            userIdList: userIdList,
        });
        if (resOpposite.data.message == 'Success') {
            const listOppositesFilter = res.data.messages.map((item: any) => {
                const index = resOpposite.data.opposites.findIndex(
                    (itemOpposite: any) => itemOpposite.id == item.userId,
                );
                if (index != -1) {
                    return resOpposite.data.opposites[index];
                }
            });
            setOpposites(listOppositesFilter);
        }
    };

    useEffect(() => {
        if (user.shopId) {
            getDataShop();
        }
    }, [user]);
    useEffect(() => {
        if (shop) {
            getDataMessage();
        }
    }, [shop]);

    useEffect(() => {
        if (isReq) {
            getDataMessage();
            setIsReq(false);
        }
    }, [isReq]);
    useEffect(() => {
        socket_IO_Client.on('reqMessageNew', (data) => {
            setIsReq(true);
        });
        socket_IO_Client.on('reqMessageShopNew', (data) => {
            setIsReq(true);
        });
    }, []);
    return (
        <RootWrapper>
            <Box display="flex" alignItems="flex-start">
                <Avatar
                    alt={shop ? shop.name : ''}
                    src={
                        shop
                            ? shop.image
                                ? shop.image.startsWith('uploads')
                                : shop.image
                                ? `${HOST_BE}/${shop.image}`
                                : shop.image
                            : ''
                    }
                />
                <Box
                    sx={{
                        ml: 1.5,
                        flex: 1,
                    }}
                >
                    <Box>
                        <div className="flex items-center mt-1"> {shop ? shop.name : ''}</div>
                    </Box>
                </Box>
            </Box>

            {/* <TextField
                sx={{
                    mt: 2,
                    mb: 1,
                }}
                size="small"
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchTwoToneIcon />
                        </InputAdornment>
                    ),
                }}
                placeholder="Search..."
            /> */}

            <Typography
                sx={{
                    mb: 1,
                    mt: 2,
                }}
                variant="h3"
            >
                {t('orther.Chats')}
            </Typography>

            <Box mt={2}>
                <List disablePadding component="div">
                    {opposites &&
                        opposites.map((opposite: any) => (
                            <Opposite
                                key={opposite.id}
                                opposite={opposite}
                                setOppositeCurrent={setOppositeCurrent}
                                oppositeCurrent={oppositeCurrent}
                            />
                        ))}
                </List>
            </Box>
        </RootWrapper>
    );
};

export default SidebarContent;
