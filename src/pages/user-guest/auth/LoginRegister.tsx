import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    checkIsEmail,
    filterInput,
    filterPassword,
    toastError,
    toastSuccess,
    toastWarning,
} from '../../../untils/Logic';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { GetApi, PostGuestApi } from '../../../untils/Api';
import { change_is_loading, change_role, change_user } from '../../../reducers/Actions';
import { passwordStrength } from 'check-password-strength';
import { useStore } from 'react-redux';
import {
    Anchor,
    Input,
} from '../../../components/ComponentsLogin';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';
import CheckPasswordMeter from '../../../components/user-guest/CheckPasswordMeter';
import { Avatar, Box, Button, Container, Link, Typography } from '@mui/material';
function LoginRegister() {
    const [logIn, toggle] = React.useState(true);
    const { t } = useTranslation();
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [isLogin, setIsLogin] = useState(true);

    const [errPhone, setErrPhone] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [rePassword, setRePassword] = useState<string>('');
    const [errPassword, setErrPassword] = useState<boolean>(false);
    const [errRePassword, setErrRePassword] = useState<boolean>(false);
    const [isHidePassword, setIsHidePassword] = useState<boolean>(true);
    //
    const [strength, setStrength] = useState(0);

    const nav = useNavigate();
    if (localStorage.getItem('token')) {
        nav('/');
    }
    const store = useStore();
    //

    //Handle login
    const handleClickLogin = async (e: any) => {
        e.preventDefault();
        if (!checkIsEmail(email)) {
            return toastWarning(t('toast.InvalidEmailFormat'));
        }
        if (email && password) {
            store.dispatch(change_is_loading(true));
            const res = await PostGuestApi(`/auth/login`, { email: email, password: password });
            store.dispatch(change_is_loading(false));
            if (res.data.message == 'Phone or password is incorrect') {
                toastWarning(t('auth.Account is incorrect'));
                return null;
            }
            if (res.data.message == 'Account is inActive') {
                localStorage.setItem('email', email);
                toastWarning(t('auth.Account is inActive'));
            }
            if (res.data.message == 'Login success') {
                store.dispatch(change_is_loading(true));
                localStorage.setItem('token', res.data.accessToken);
                localStorage.setItem('refreshToken', res.data.refreshToken);
                const res_role = await GetApi(`/user/get-role`, res.data.accessToken);
                // const res_user = await GetApi('/user/get-user', res.data.accessToken);
                store.dispatch(change_is_loading(false));
                localStorage.setItem('oauth2', 'false');
                if (res_role.data.role == 'ADMIN' || res_role.data.role == 'SUB_ADMIN') {
                    window.location.href = '/admin';
                } else {
                    window.location.href = '/';
                }
            }
            if (res.data.message == 'You have been baned') {
                toastWarning(t('toast.Banned'));
            }
        } else {
            toastWarning(t('auth.Please enter complete information'));
            if (email == '') {
                setErrPhone(true);
            }
            if (password == '') {
                setErrPassword(true);
            }
        }
    };

    const handleClickRegister = async (e: any) => {
        e.preventDefault();
        if (!checkIsEmail(email)) {
            return toastWarning(t('toast.InvalidEmailFormat'));
        }
        if (email && password && rePassword) {
            if (rePassword === password) {
                if (passwordStrength(password).id === 3) {
                    const res = await PostGuestApi('/auth/register', {
                        email: email,
                        phone: phone,
                        name: name,
                        password: password,
                    });
                    if (res.data.message == 'Account have already exist') {
                        setEmail('');
                        setPhone('');
                        setName('');
                        setPassword('');
                        setRePassword('');
                        toastError(t('auth.Account have already exist'));
                        return null;
                    }
                    if (res.data.message == 'Account creation fail') {
                        setEmail('');
                        setPhone('');
                        setName('');
                        setPassword('');
                        setRePassword('');
                        return null;
                    }
                    if (res.data.message == 'Success') {
                        setEmail('');
                        setPhone('');
                        setName('');
                        setPassword('');
                        setRePassword('');
                        toastSuccess('Đăng ký thành công');
                    }
                } else {
                    toastWarning(t('auth.Password is no strong'));
                }
            } else {
                toastError(t('auth.Password and Re-password do not match'));
            }
        } else {
            toastWarning(t('auth.Please enter complete information'));
            if (email == '') {
                setErrPhone(true);
            }
            if (password == '') {
                setErrPassword(true);
            }
            if (rePassword == '') {
                setErrRePassword(true);
            }
        }
    };

    const changeIsHidePassword = () => {
        setIsHidePassword((prev) => !prev);
    };
    return (
        <div className="mt-3 flex justify-center align-center" style={{}}>
            <Container
                maxWidth="xs"
                sx={{
                    backgroundColor: '#fff',
                    mt: 10,
                    borderRadius: '10px',
                    boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
                    display: 'flex',
                    mx: 2,
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 3,
                        borderRadius: 2,
                        boxShadow: 3,
                        width: '100%',
                        backgroundColor: '#fff',
                        
                    }}
                >
                    {isLogin ? (
                        <>
                            <Link onClick={() => nav('/')} sx={{ mb: 3 }}>
                                <img
                                    src={require('../../../static/dhsneaker-logo.png')}
                                    alt="Logo"
                                    style={{ width: '100px', cursor: 'pointer' }}
                                />
                            </Link>
                            <Typography sx={{ mb: 1, fontWeight: '600', fontSize: 18 }} variant="h5">
                                {t('auth.Login')}
                            </Typography>
                            <span className="w-full">
                                <span className="w-full">
                                    <Input
                                        type={'text'}
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </span>
                            </span>

                            <span className="w-full relative">
                                <Input
                                    type={isHidePassword ? 'password' : 'text'}
                                    placeholder={t('auth.Password')}
                                    value={password}
                                    onChange={(e) => {
                                        filterPassword(e.target.value, setPassword, setStrength);
                                    }}
                                />
                                <span className="absolute top-4 right-2" onClick={changeIsHidePassword}>
                                    {isHidePassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </span>
                            </span>
                            <Anchor className="italic" href="forget-password">
                                {t('auth.Forget password')}
                            </Anchor>
                            <Button
                                className="w-full"
                                sx={{
                                    backgroundColor: 'rgba(7, 110, 145, 0.89)',
                                    color: '#ffffff',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(7, 110, 145, 0.7)',
                                    },
                                }}
                                onClick={(e) => handleClickLogin(e)}
                            >
                                {t('auth.Login')}
                            </Button>
                            <Button
                                className="w-full"
                                onClick={() => setIsLogin(false)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(7, 110, 145, 0.89)',
                                    color: '#ffffff',
                                    mt: 2,
                                    cursor: 'pointer',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(7, 110, 145, 0.7)',
                                    },
                                }}
                            >
                                <ArrowForwardIcon sx={{ mr: 1 }} />
                                {t('auth.Register')}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography sx={{ mb: 1, fontWeight: '600', fontSize: 18 }} variant="h5">
                                {t('auth.Register')}
                            </Typography>
                            <span className="w-full">
                                <Input
                                    type={'text'}
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </span>
                            <span className="w-full">
                                <Input
                                    type={'text'}
                                    placeholder="Họ và tên"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </span>
                            <span className="w-full">
                                <Input
                                    type={'text'}
                                    placeholder="Số điện thoại"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </span>
                            <span className="w-full relative">
                                <Input
                                    type={isHidePassword ? 'password' : 'text'}
                                    placeholder={t('auth.Password')}
                                    value={password}
                                    onChange={(e) => {
                                        filterPassword(e.target.value, setPassword, setStrength);
                                    }}
                                />
                                <span className="absolute top-4 right-2" onClick={changeIsHidePassword}>
                                    {isHidePassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </span>
                            </span>
                            <div className="w-full h-5">
                                {password ? <CheckPasswordMeter password={password} /> : null}
                            </div>

                            <span className="w-full relative">
                                <Input
                                    type={isHidePassword ? 'password' : 'text'}
                                    placeholder={t('auth.Re-password')}
                                    value={rePassword}
                                    onChange={(e) => filterInput(e.target.value, setRePassword)}
                                />
                                <span className="absolute top-4 right-2" onClick={changeIsHidePassword}>
                                    {isHidePassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </span>
                            </span>
                            <Button
                                className="w-full mt-3"
                                id="register-button"
                                sx={{
                                    backgroundColor: 'rgba(7, 110, 145, 0.89)',
                                    color: '#ffffff',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(7, 110, 145, 0.7)',
                                    },
                                }}
                                onClick={(e) => handleClickRegister(e)}
                            >
                                {t('auth.Register')}
                            </Button>
                            <Button
                                className="w-full"
                                onClick={() => setIsLogin(true)}
                                sx={{
                                    backgroundColor: 'rgba(7, 110, 145, 0.89)',
                                    color: '#ffffff',
                                    mt: 2,
                                    cursor: 'pointer',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(7, 110, 145, 0.7)',
                                    },
                                }}
                            >
                                <ArrowBackIcon sx={{ mr: 1 }} />
                                {t('auth.Login')}
                            </Button>
                        </>
                    )}
                </Box>
            </Container>
        </div>
    );
}

export default LoginRegister;
