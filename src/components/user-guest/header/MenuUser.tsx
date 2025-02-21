import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import { change_role, change_user } from '../../../reducers/Actions';
import { HOST_BE, typeRole } from '../../../common/Common';
import { useNavigate } from 'react-router-dom';
import { AlertLogout } from '../../alert/Alert';
import { PostApi, PostGuestApi } from '../../../untils/Api';
import { Avatar } from '@mui/material';
import { socket_IO_Client } from '../../../routes/MainRoutes';
interface MenuUserProps {
    avatar: String;
}

const MenuUser: React.FC<MenuUserProps> = (props) => {
    const { t } = useTranslation();
    const settings = [t('user.Profile'), t('user.Orders'), t('Voucher'), t('user.Logout'), t('user.Wallet')];
    const store = useStore();
    const { avatar } = props;
    const nav = useNavigate();
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleClickWallet = () => {
        window.location.href = '/user/wallet';
    };
    const handleClickLogout = async (e: any) => {
        const logOut = async () => {
            const resLogout = await PostApi('/user/logout', localStorage.getItem('token'), {});
            if (resLogout.data.message == 'Success') {
                localStorage.clear();
                // store.dispatch(change_user({}));
                // store.dispatch(change_role(typeRole.GUEST));
                socket_IO_Client.disconnect();
                window.location.href = '/login-register';
            } else {
            }
        };
        handleCloseUserMenu();
        AlertLogout(logOut);
    };
    const handleClickInfoUser = () => {
        handleCloseUserMenu();

        nav('/user/info-user');
    };
    return (
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ width: 27, height: 27 }} src={`${HOST_BE}/${avatar}`} />
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <MenuItem key={settings[0]} onClick={handleClickInfoUser}>
                    <Typography sx={{ textAlign: 'center' }}>{settings[0]}</Typography>
                </MenuItem>
                <MenuItem
                    key={settings[1]}
                    onClick={() => {
                        nav('/user/order', { state: { indexTabs: 0 } });
                        handleCloseUserMenu();
                    }}
                >
                    <Typography sx={{ textAlign: 'center' }}>{settings[1]}</Typography>
                </MenuItem>
                <MenuItem key={settings[4]} onClick={handleClickWallet}>
                    <Typography sx={{ textAlign: 'center' }}>{settings[4]}</Typography>
                </MenuItem>
                <MenuItem
                    key={settings[2]}
                    onClick={() => {
                        handleCloseUserMenu();
                        nav('/user/voucher');
                    }}
                >
                    <Typography sx={{ textAlign: 'center' }}>{settings[2]}</Typography>
                </MenuItem>
                <MenuItem key={settings[3]} onClick={handleClickLogout}>
                    <Typography sx={{ textAlign: 'center' }}>{settings[3]}</Typography>
                </MenuItem>
            </Menu>
        </Box>
    );
};
export default MenuUser;
