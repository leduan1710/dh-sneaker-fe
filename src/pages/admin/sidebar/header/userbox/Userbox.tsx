import { useRef, useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';

import {
    Avatar,
    Box,
    Button,
    Divider,
    Hidden,
    lighten,
    List,
    ListItem,
    ListItemText,
    Popover,
    Typography,
} from '@mui/material';

import InboxTwoToneIcon from '@mui/icons-material/InboxTwoTone';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import React from 'react';
import { ReducerProps } from '../../../../../reducers/ReducersProps';
import { useSelector, useStore } from 'react-redux';
import { AlertLogout } from '../../../../../components/alert/Alert';
import { PostApi } from '../../../../../untils/Api';
import { change_role, change_user } from '../../../../../reducers/Actions';
import { HOST_BE, typeRole } from '../../../../../common/Common';
import { socket_IO_Client } from '../../../../../routes/MainRoutes';
import { useTranslation } from 'react-i18next';
const UserBoxButton = styled(Button)(
    ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`,
);

const MenuUserBox = styled(Box)(
    ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`,
);

const UserBoxText = styled(Box)(
    ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`,
);

const UserBoxLabel = styled(Typography)(
    ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`,
);

const UserBoxDescription = styled(Typography)(
    ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`,
);

function HeaderUserbox() {
    const nav = useNavigate();
    const user = useSelector((state: ReducerProps) => state.user);
    const store = useStore();
    const { t } = useTranslation();
    const ref = useRef<any>(null);
    const [isOpen, setOpen] = useState<boolean>(false);

    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
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
        handleClose();
        AlertLogout(logOut);
    };
    return (
        <>
            <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
                <Avatar
                    variant="rounded"
                    alt={user.name}
                    src={
                        user.image
                            ? user.image.startsWith('uploads')
                                ? `${HOST_BE}/${user.image}`
                                : user.image
                            : user.image
                    }
                />
                <Hidden mdDown>
                    <UserBoxText>
                        <UserBoxLabel variant="body1">{user.name}</UserBoxLabel>
                        <UserBoxDescription variant="body2">{user.role}</UserBoxDescription>
                    </UserBoxText>
                </Hidden>
                <Hidden smDown>
                    <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
                </Hidden>
            </UserBoxButton>
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
                <MenuUserBox sx={{ minWidth: 210 }} display="flex">
                    <Avatar
                        variant="rounded"
                        alt={user.name}
                        src={
                            user.image
                                ? user.image.startsWith('uploads')
                                    ? `${HOST_BE}/${user.image}`
                                    : user.image
                                : user.image
                        }
                    />
                    <UserBoxText>
                        <UserBoxLabel variant="body1">{user.name}</UserBoxLabel>
                        <UserBoxDescription variant="body2">{user.role}</UserBoxDescription>
                    </UserBoxText>
                </MenuUserBox>
                <Divider sx={{ mb: 0 }} />
                <Divider />
                <Box sx={{ m: 1 }}>
                    <Button color="primary" fullWidth onClick={handleClickLogout}>
                        <LockOpenTwoToneIcon sx={{ mr: 1 }} />
                        {t('action.SignOut')}
                    </Button>
                </Box>
            </Popover>
        </>
    );
}

export default HeaderUserbox;
