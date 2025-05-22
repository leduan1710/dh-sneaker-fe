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
import GoogleIcon from '@mui/icons-material/Google';
import {
    Container,
    RegisterContainer,
    LogInContainer,
    OverlayContainer,
    Overlay,
    LeftOverlayPanel,
    RightOverlayPanel,
    GhostButton,
    Paragraph,
    Form,
    Anchor,
    Title,
    Input,
    Button,
} from '../../../components/ComponentsLogin';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import OtpInput from 'react-otp-input';
import Dialog from '@mui/material/Dialog';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import CheckPasswordMeter from '../../../components/user-guest/CheckPasswordMeter';
import { REDIRECT_URL_GMAIL } from '../../../common/Common';
import { Avatar, Typography } from '@mui/material';
function LoginRegister() {
    const [logIn, toggle] = React.useState(true);
    const { t } = useTranslation();
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [name, setName] = useState<string>('');

    const [errPhone, setErrPhone] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [rePassword, setRePassword] = useState<string>('');
    const [errPassword, setErrPassword] = useState<boolean>(false);
    const [errRePassword, setErrRePassword] = useState<boolean>(false);
    const [isHidePassword, setIsHidePassword] = useState<boolean>(true);
    //
    const [strength, setStrength] = useState(0);
    //time
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<any>(null);
    //
    const [openOtp, setOpenOtp] = useState<boolean>(false);
    //
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
                }
                else {
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
                        setPassword('');
                        setRePassword('');
                        toastError(t('auth.Account have already exist'));
                        return null;
                    }
                    if (res.data.message == 'Account creation fail') {
                        setEmail('');
                        setPhone('');
                        setPassword('');
                        setRePassword('');
                        return null;
                    }
                    if (res.data.message == 'Success') {
                        setEmail('');
                        setPhone('');
                        setPassword('');
                        setRePassword('');
                        toastSuccess('Đăng ký thành công')
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
    const openDialog = () => {
        setOpenOtp(true);
    };

    const handleCloseDialog = () => {
        setOpenOtp(false);
    };
    //
    const changeIsHidePassword = () => {
        setIsHidePassword((prev) => !prev);
    };

    const handleClickSignWithGoogle = (e: any) => {
        e.preventDefault();

        if (process.env.REACT_APP_ID_CLIENT_GG) {
            const url_gg = new URL(
                `https://accounts.google.com/o/oauth2/auth?scope=email&redirect_uri=${REDIRECT_URL_GMAIL}&response_type=code&client_id=${process.env.REACT_APP_ID_CLIENT_GG}&approval_prompt=force`,
            );
            window.location.href = url_gg.toString();
        }
    };
    const getGmail = useCallback(async () => {
        const query = new URLSearchParams(window.location.search);
        const gmailCode = query.get('code');
        if (gmailCode != null) {
            try {
                let data = JSON.stringify({
                    client_id: process.env.REACT_APP_ID_CLIENT_GG,
                    client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
                    redirect_uri: REDIRECT_URL_GMAIL,
                    code: gmailCode,
                    grant_type: 'authorization_code',
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://accounts.google.com/o/oauth2/token',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: data,
                };

                const response = await axios.request(config);
                //save access token to sessionStorage
                sessionStorage.setItem('gmailAccesstoken', JSON.stringify(response.data.access_token));
                if (sessionStorage.getItem('gmailAccesstoken')) {
                    let config = {
                        method: 'get',
                        maxBodyLength: Infinity,
                        url: `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${sessionStorage.getItem(
                            'gmailAccesstoken',
                        )}`,
                        headers: {},
                    };
                    const response = await axios.request(config);
                    //save gmail to sessionStorage
                    const loginGmail = await PostGuestApi('/auth/login-gmail', {
                        email: response.data.email,
                        password: response.data.id,
                    });
                    if (loginGmail.data.message == 'Login success') {
                        sessionStorage.removeItem('gmailAccesstoken');
                        localStorage.setItem('token', loginGmail.data.accessToken);
                        localStorage.setItem('refreshToken', loginGmail.data.refreshToken);
                        localStorage.setItem('oauth2', 'true');
                        window.location.href = '/';
                    }
                    if (loginGmail.data.message == 'You have been baned') {
                        toastWarning(t('toast.Banned'));
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    }, []);

    useEffect(() => {
        getGmail();
    }, []);
    return (
        <div className="mt-3 flex justify-center align-center" style={{}}>
            <div
                className="mt-3 flex justify-center align-center"
                style={{ width: 900, background: '#f6f5f7', padding: '30px', borderRadius: '10px' }}
            >
                <Container>
                    <RegisterContainer logIn={logIn}>
                        <Form>
                            <Typography sx={{ mb: 1, fontWeight: '600' }} variant="h5">
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
                                onClick={(e) => handleClickRegister(e)}
                            >
                                {t('auth.Register')}
                            </Button>
                        </Form>
                    </RegisterContainer>

                    {/*------------------------------- LOGIN-------------------------------------- */}

                    <LogInContainer logIn={logIn}>
                        <Form>
                            <Typography sx={{ mb: 1, fontWeight: '600' }} variant="h5">
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
                            <Button className="w-full" onClick={(e) => handleClickLogin(e)}>
                                {t('auth.Login')}
                            </Button>
                            <div className="mt-3">---{t('auth.OrLoginWith')}---</div>

                            <Button className="mt-3 w-full" onClick={(e) => handleClickSignWithGoogle(e)}>
                                <GoogleIcon />
                            </Button>
                        </Form>
                    </LogInContainer>

                    <OverlayContainer logIn={logIn}>
                        <Overlay logIn={logIn}>
                            <LeftOverlayPanel logIn={logIn}>
                                <Avatar
                                    sx={{ height: 356, width: 350 }}
                                    variant="rounded"
                                    src="https://savani.vn/images/config/frame_1643271037.svg"
                                ></Avatar>
                                <Paragraph>{t('auth.To login please enter your personal information')}</Paragraph>
                                <GhostButton
                                    onClick={() => {
                                        toggle(true);
                                    }}
                                >
                                    {t('auth.Login')}
                                </GhostButton>
                            </LeftOverlayPanel>

                            <RightOverlayPanel logIn={logIn}>
                                <Avatar
                                    sx={{ height: 356, width: 350 }}
                                    variant="rounded"
                                    src="https://savani.vn/images/config/frame_1643271037.svg"
                                ></Avatar>
                                <Paragraph>{t('auth.Become a member to receive many attractive offers')}</Paragraph>
                                <GhostButton onClick={() => toggle(false)}>{t('auth.Register')}</GhostButton>
                            </RightOverlayPanel>
                        </Overlay>
                    </OverlayContainer>
                </Container>
            </div>
        </div>
    );
}

export default LoginRegister;
