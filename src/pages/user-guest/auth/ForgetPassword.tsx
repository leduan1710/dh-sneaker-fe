import { TextField } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import {
    checkIsEmail,
    filterInput,
    filterInputNumber,
    toastError,
    toastSuccess,
    toastWarning,
} from '../../../untils/Logic';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PostApi, PostGuestApi } from '../../../untils/Api';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useStore } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import CheckPasswordMeter from '../../../components/user-guest/CheckPasswordMeter';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { passwordStrength } from 'check-password-strength';

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
import OTPInput from 'react-otp-input';
interface ForgetPasswordProps {}
const ForgetPassword: React.FC<ForgetPasswordProps> = (props) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rePassword, setRePassword] = useState<string>('');
    const [errEmail, setErrEmail] = useState<boolean>(false);
    const [errPassword, setErrPassword] = useState<boolean>(false);
    const [errRePassword, setErrRePassword] = useState<boolean>(false);
    const [isHidePassword, setIsHidePassword] = useState<boolean>(true);
    const [isHiddenPassword, setIsHiddenPassword] = useState<boolean>(true);
    //
    const nav = useNavigate();
    const store = useStore();
    //

    //
    //
    //time
    const [time, setTime] = useState(300);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<any>(null);
    //
    const [comfirm, setComfirm] = useState<any>([]);
    const [otp, setOtp] = useState<string>('');
    //
    const [openOtp, setOpenOtp] = useState<boolean>(false);

    const handleSendOTP = async () => {
        try {
            localStorage.setItem('email', email);
            const resCheck = await PostGuestApi('/auth/forget-password/', { email: email });
            if (resCheck.data.message == 'User not found') {
                toastError(t('auth.Can not find user'));
            }
            if (resCheck.data.message == 'Email sent successfully') {
                openDialog();
            }
        } catch {
            toastError(t('auth.Can not send OTP'));
        }
    };

    const handleClickSubmit = async () => {
        if (email) {
            if (checkIsEmail(email)) {
                setIsRunning(true);
                await handleSendOTP();
            } else {
                toastWarning(t('auth.Please enter complete information'));
            }
        } else {
            toastWarning(t('auth.Please enter complete information'));
            if (email == '') {
                setErrEmail(true);
            }
        }
    };

    const hidePassword = () => {
        setIsHidePassword((prev) => !prev);
    };
    const openDialog = () => {
        setOpenOtp(true);
    };

    const handleCloseDialog = () => {
        setOpenOtp(false);
    };
    //
    const handleOtpChange = (otpValue: string) => {
        const otpNumber = parseInt(otpValue, 10);
        setOtp(otpValue);
    };
    const handlePaste: React.ClipboardEventHandler = (event) => {
        const data = event.clipboardData.getData('text');
        if (!isNaN(parseInt(data, 10))) {
            setOtp(data);
        }
    };
    //
    const setNewPassword = async () => {
        if (password == rePassword) {
            if (passwordStrength(password).id === 3) {
                const res = await PostApi('/auth/change-password', sessionStorage.getItem('tokenOtp'), {
                    password: password,
                });
                if (res.data.message == 'Fail') {
                }
                if (res.data.message == 'Success') {
                    sessionStorage.removeItem('tokenOtp');
                    window.location.href = '/login-register';
                }
            } else {
                toastWarning(t('auth.Password is no strong'));
            }
        } else {
            toastError(t('auth.Password and Re-password do not match'));
        }
    };
    //
    const handleVerifyOTP = async (otp: string, comfirm: any) => {
        try {
            const res = await PostGuestApi('/auth/verify-otp', { code: otp, email: email });
            if (res.data.message == 'Code expery') {
                toastWarning(t('toast.OTPExpired'));
            }
            if (res.data.message == 'Success') {
                sessionStorage.setItem('tokenOtp', res.data.token);
                handleCloseDialog();
                setIsHiddenPassword(false);
            }
        } catch {}
    };
    //time otp
    const handleResendOtpRegister = async () => {
        try {
            const resResend = await PostGuestApi('/auth/require-otp', { email: localStorage.getItem('email') });
            if (resResend.data.message == 'More require') {
                toastWarning(t('toast.PleaseWait'));
            }
        } catch (e) {}
    };

    const handleStart = () => {
        intervalRef.current = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime == 1) {
                    setIsRunning(false);
                }
                return prevTime - 1;
            });
        }, 1000);
    };
    const handleReset = () => {
        setTime(300);
        setIsRunning(true);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        handleResendOtpRegister();
    };
    useEffect(() => {
        if (isRunning) {
            handleStart();
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);
    return (
        <div className="mt-3 flex justify-center align-center">
            <div className="text-center" style={{ width: 400 }}>
                <h1 className="font-bold">{t('auth.Enter Email')}</h1>
                <div className="mt-6">
                    <TextField
                        label={t('Email')}
                        variant="outlined"
                        placeholder={t('Email')}
                        value={email}
                        onChange={(e) => {
                            setErrEmail(false);
                            setEmail(e.target.value);
                        }}
                        fullWidth
                        error={errEmail}
                    />
                </div>
                <div className={`mt-3 relative ${isHiddenPassword ? 'hidden' : ''}`}>
                    <TextField
                        label={t('auth.Password')}
                        variant="outlined"
                        placeholder={t('auth.Password')}
                        value={password}
                        onChange={(e) => {
                            setErrPassword(false);
                            filterInput(e.target.value, setPassword);
                        }}
                        fullWidth
                        error={errPassword}
                        type={isHidePassword ? 'password' : 'text'}
                    />
                    {isHidePassword ? (
                        <span className="absolute top-3 right-1" onClick={hidePassword}>
                            <RemoveRedEyeIcon />
                        </span>
                    ) : (
                        <span className="absolute top-3 right-1" onClick={hidePassword}>
                            <VisibilityOffIcon />
                        </span>
                    )}
                </div>
                {password ? <CheckPasswordMeter password={password} /> : null}

                <div className={`mt-3 relative ${isHiddenPassword ? 'hidden' : ''}`}>
                    <TextField
                        label={t('auth.Re-password')}
                        variant="outlined"
                        placeholder={t('auth.Re-password')}
                        value={rePassword}
                        onChange={(e) => {
                            setErrRePassword(false);
                            filterInput(e.target.value, setRePassword);
                        }}
                        fullWidth
                        error={errRePassword}
                        type={isHidePassword ? 'password' : 'text'}
                    />
                    {isHidePassword ? (
                        <span className="absolute top-3 right-1" onClick={hidePassword}>
                            <RemoveRedEyeIcon />
                        </span>
                    ) : (
                        <span className="absolute top-3 right-1" onClick={hidePassword}>
                            <VisibilityOffIcon />
                        </span>
                    )}
                </div>

                <div className={`mt-6 ${isHiddenPassword ? '' : 'hidden'}`}>
                    <Button className="w-full" onClick={handleClickSubmit}>
                        {t('auth.Submit')}
                    </Button>
                </div>
                <div className={`mt-6 ${isHiddenPassword ? 'hidden' : ''}`}>
                    <Button className="mt-3 w-full" onClick={setNewPassword}>
                        {t('auth.Change')}
                    </Button>
                </div>
            </div>
            <Dialog onClose={() => {}} open={openOtp}>
                <Button className="mt-2 ml-2 w-2 mb-10 flex items-center justify-center" onClick={handleCloseDialog}>
                    <ArrowBackIcon />
                </Button>
                <h1 className="text-center text-2xl font-bold">OTP</h1>
                <OTPInput
                    containerStyle={{ padding: 20 }}
                    inputStyle={{
                        backgroundColor: '#CAF5FF',
                        borderRadius: 4,
                        width: 50,
                        height: 50,
                        marginBottom: 10,
                        color: 'black',
                        outline: 'none',
                        margin: 5,
                    }}
                    value={otp}
                    onChange={handleOtpChange}
                    onPaste={handlePaste}
                    numInputs={6}
                    renderInput={(props) => <input {...props} />}
                />
                <Button className="mt-10 ml-12 mr-12 mb-10" onClick={() => handleVerifyOTP(otp, comfirm)}>
                    {t('Submit')}
                </Button>
                <div className="text-[16px] font-[700] flex justify-center items-center mt-12 mb-3">
                    <Button disabled={time > 0 ? true : false} onClick={handleReset}>
                        {time > 0 ? `${time} s` : 'Reset'}
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};
export default ForgetPassword;
