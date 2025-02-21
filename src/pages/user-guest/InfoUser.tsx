import { Avatar, Dialog } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useStore } from 'react-redux';
import { Button, Input } from '../../components/ComponentsLogin';
import { ReducerProps } from '../../reducers/ReducersProps';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import FestivalIcon from '@mui/icons-material/Festival';
import SecurityIcon from '@mui/icons-material/Security';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { AlertSaveInfo } from '../../components/alert/Alert';
import { PostApi, PostGuestApi } from '../../untils/Api';
import OtpInput from 'react-otp-input';
import InventoryIcon from '@mui/icons-material/Inventory';
import {
    filterInput,
    filterInputNumber,
    filterPassword,
    filterSpecialInput,
    toastError,
    toastSuccess,
    toastWarning,
} from '../../untils/Logic';
import { change_is_loading, change_user } from '../../reducers/Actions';
import LeftNav from '../../components/user-guest/info-user/LeftNav';
import { HOST_BE, typeRank } from '../../common/Common';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Button as Btn } from '@mui/material';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import CheckPasswordMeter from '../../components/user-guest/CheckPasswordMeter';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import Footer from '../../components/user-guest/footer/Footer';
interface InfoUserProps {}

const InfoUser: React.FC<InfoUserProps> = (props) => {
    const store = useStore();
    const nav = useNavigate();

    const { t } = useTranslation();
    const user = useSelector((state: ReducerProps) => state.user);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [sex, setSex] = useState<string>('');
    const [birthday, setBirthday] = useState<Dayjs | undefined>(undefined);
    const [phone, setPhone] = useState<string>('');
    const [rank, setRank] = useState<string>('');
    const [point, setPoint] = useState<number | undefined>(undefined);
    const [addressIdList, setAddressIdList] = useState([]);
    //
    const [passwordOld, setPasswordOld] = useState<string>('');
    const [passwordNew, setPasswordNew] = useState<string>('');
    const [rePasswordNew, setRePasswordNew] = useState<string>('');
    const [strength, setStrength] = useState(0);
    const [isHidePassword, setIsHidePassword] = useState<boolean>(true);
    //time
    const [time, setTime] = useState(300);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<any>(null);
    //
    const [comfirm, setComfirm] = useState<any>([]);
    const [otp, setOtp] = useState<string>('');
    //
    const [openOtp, setOpenOtp] = useState<boolean>(false);
    //
    const [selectImage, setSelectImage] = useState<File | null>(null);

    const [image, setImage] = useState<string | undefined>(undefined);
    //birthday
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (newValue: any) => {
        setSelectedDate(newValue);
    };
    //
    const [isNotEdit, setIsNotEdit] = useState(true);
    //
    const [isShowChangePassword, setIsShowChangePassword] = useState(false);
    const [isShowChangePhone, setIsShowChangePhone] = useState(false);
    //
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });
    //
    const getData = () => {
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone);
        setBirthday(dayjs(user.birthDay));
        setSex(user ? (user.sex ? 'male' : 'female') : '');
        setImage(user.image);
    };
    const changeIsHidePassword = () => {
        setIsHidePassword((prev) => !prev);
    };
    const toggleShowChangePassword = () => {
        setIsShowChangePassword((prev) => !prev);
    };
    const toggleIsNotEdit = () => {
        setIsNotEdit((prev) => !prev);
    };
    const toggleIsShowPhone = () => {
        setIsShowChangePhone((prev) => !prev);
    };
    const openDialog = () => {
        setOpenOtp(true);
    };

    const handleCloseDialog = () => {
        setOpenOtp(false);
    };
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
    const toggleSex = () => {
        if (!isNotEdit) {
            setSex((prev) => {
                if (prev == 'male') {
                    return 'female';
                } else {
                    return 'male';
                }
            });
        }
    };
    const handleChangePassword = async () => {
        if (passwordNew != rePasswordNew) {
            toastWarning(t('auth.Password and Re-password do not match'));
            return;
        }
        const resChangePassword = await PostApi('/user/change-password', localStorage.getItem('token'), {
            passwordOld: passwordOld,
            email: user.email,
        });
        if (resChangePassword.data.message == 'Email sent successfully') {
            openDialog();
            setIsRunning(true);
        }
        if (resChangePassword.data.message == 'Incorrect password') {
            toastWarning(t('auth.IncorrectPassword'));
        }
    };
    const handleClickAddress = () => {
        nav('/user/address');
    };
    const handleUpdateImage = async () => {
        store.dispatch(change_is_loading(true));

        const data = new FormData();
        if (selectImage) {
            const imageBlob = await fetch(URL.createObjectURL(selectImage)).then((response) => response.blob());
            data.append('file', imageBlob);
        }

        try {
            const resUpdateImg = await axios.post(`${HOST_BE}/user/update-image`, data, {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (resUpdateImg.status == 200) {
                toastSuccess(t('Success'));
                setSelectImage(null);
                user.image = resUpdateImg.data.user.image;
                store.dispatch(change_user(user));
                setImage(resUpdateImg.data.user.image);
            } else {
                toastError(t('Fail'));
            }
            store.dispatch(change_is_loading(false));
        } catch (e) {
            store.dispatch(change_is_loading(false));
        }
    };
    const handleChangePhone = async () => {
        if (phone != '') {
            AlertSaveInfo(async () => {
                store.dispatch(change_is_loading(true));
                const res = await PostApi('/user/update-user-info', localStorage.getItem('token'), {
                    phone: phone,
                });
                setIsShowChangePhone(false);
                if (res.data.message == 'Success') {
                    store.dispatch(change_user(res.data.user));
                }
                store.dispatch(change_is_loading(false));
            });
        } else {
            toastWarning('');
        }
    };
    const handleSaveInfo = async () => {
        AlertSaveInfo(async () => {
            store.dispatch(change_is_loading(true));
            const res = await PostApi('/user/update-user-info', localStorage.getItem('token'), {
                name: name,
                birthDay: birthday?.date() ? birthday?.toISOString() : null,
                sex: sex == 'female' ? false : sex == 'male' ? true : null,
            });
            setIsNotEdit(true);
            if (res.data.message == 'Success') {
                store.dispatch(change_user(res.data.user));
            }
            store.dispatch(change_is_loading(false));
        });
    };
    const handleVerifyOTP = async (otp: string, comfirm: any) => {
        try {
            const res = await PostGuestApi('/user/change-password-2fa', {
                code: otp,
                passwordNew: passwordNew,
            });
            if (res.data.message == 'Code expiry') {
                return toastWarning('OTP hết hạn');
            }
            if (res.data.message == 'Success') {
                store.dispatch(change_user(res.data.user));
                toastSuccess(t('auth.Success'));
                handleCloseDialog();
                setIsShowChangePassword(false);
                setIsHidePassword(true);
                setPasswordNew('');
                setPasswordOld('');
                setRePasswordNew('');
            }
        } catch {}
    };
    //time otp
    const handleResendOtp = async () => {
        try {
            const resResend = await PostGuestApi('/auth/require-otp', { email: user.email });
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
        handleResendOtp();
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
    useEffect(() => {
        getData();
    }, [user]);

    return (
        <>
            <div className="container marginTop">
                <div className="grid grid-cols-4 gap-4">
                    <div className="hidden lg:block col-span-1 bg-white box-shadow rounded-xl">
                        <LeftNav index={0} />
                    </div>
                    <div className="col-span-4 lg:col-span-3 mt-12 lg:mt-0 ">
                        <h1 className="text-2xl font-bold">{t('user.Profile')}</h1>
                        <div className="bg-white p-6 rounded-lg box-shadow mt-4 relative border-light">
                            <div className="absolute top-3 right-3 cursor-pointer rounded-full p-2 ">
                                {isNotEdit ? (
                                    <EditIcon onClick={toggleIsNotEdit} />
                                ) : (
                                    <>
                                        <div onClick={handleSaveInfo}>
                                            <SaveIcon />
                                        </div>
                                        <div onClick={() => setIsNotEdit(true)} className="mt-3">
                                            <ArrowBackIcon />
                                        </div>
                                    </>
                                )}
                            </div>
                            <h1 className="text-xl">{t('user.Info Profile')}</h1>
                            <div className="lg:grid lg:grid-cols-3 mt-3 gap-4 ">
                                <div className="border border-solid p-3 rounded-xl col-span-1 flex justify-center items-center bg-blue-100 mt-12 lg:mt-0">
                                    {/* {user.image ? (
                                        <Avatar sx={{ width: 70, height: 70 }} sizes="30" src={user.image}></Avatar>
                                    ) : (
                                        <Avatar sx={{ width: 70, height: 70 }}></Avatar>
                                    )} */}
                                    <div className="relative">
                                        {image ? (
                                            selectImage ? (
                                                <div>
                                                    <Avatar
                                                        src={URL.createObjectURL(selectImage)}
                                                        sx={{ width: 200, height: 200 }}
                                                    />
                                                </div>
                                            ) : (
                                                <Avatar
                                                    src={image.startsWith('uploads') ? `${HOST_BE}/${image}` : image}
                                                    sx={{ width: 200, height: 200 }}
                                                />
                                            )
                                        ) : selectImage ? (
                                            <div>
                                                <Avatar
                                                    sx={{ width: 200, height: 200 }}
                                                    src={URL.createObjectURL(selectImage)}
                                                />
                                            </div>
                                        ) : (
                                            <Avatar sx={{ width: 200, height: 200 }} />
                                        )}

                                        <span
                                            className={`absolute bottom-0 left-16 bg-gray-white flex justify-center items-center rounded-full w-[20px] h-[20px] cursor-pointer ${
                                                selectImage ? 'hidden' : ''
                                            }`}
                                        >
                                            <Btn component="label">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                                                        stroke="black"
                                                        stroke-width="3"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    />
                                                    <path
                                                        d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
                                                        stroke="black"
                                                        stroke-width="3"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    />
                                                </svg>
                                                <VisuallyHiddenInput
                                                    type="file"
                                                    accept=".png, .jpg, .jpeg"
                                                    onChange={(e: any) => {
                                                        const file = e.target.files[0];
                                                        if (
                                                            file &&
                                                            (file.type === 'image/png' || file.type === 'image/jpeg')
                                                        ) {
                                                            setSelectImage(file);
                                                        } else {
                                                            toastWarning('Incorrect file type');
                                                        }
                                                    }}
                                                />
                                            </Btn>
                                        </span>

                                        {selectImage ? (
                                            <div className=" flex justify-center items-center mt-6 mb-6">
                                                <div
                                                    className="right-14 absolute cursor-pointer hover:bg-gray-500 hover:opacity-70 p-3 rounded-lg"
                                                    onClick={() => {
                                                        setSelectImage(null);
                                                    }}
                                                >
                                                    <CancelPresentationIcon />
                                                </div>
                                                <div
                                                    className="left-14 absolute cursor-pointer hover:bg-gray-500 hover:opacity-70 p-3 rounded-lg"
                                                    onClick={handleUpdateImage}
                                                >
                                                    <SaveIcon />
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div
                                    className={`col-span-2 ${
                                        isNotEdit ? 'bg-gray-100 cursor-not-allowed' : ''
                                    } p-6 rounded-lg mt-6 lg:mt-0`}
                                >
                                    <div className="grid grid-cols-3">
                                        <h1 className="p-2 font-normal flex items-center text-sm xl:text-lg">
                                            {t('user.Name')}
                                        </h1>
                                        <Input
                                            className="col-span-2 sm:col-span-1"
                                            disabled={isNotEdit}
                                            value={name}
                                            onChange={(e) => filterSpecialInput(e.target.value, setName)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 mt-3">
                                        <h1 className="p-2 font-normal flex items-center text-sm xl:text-lg">
                                            {t('Email')}
                                        </h1>
                                        <h1 className="p-2 font-bold flex  items-center overload-hidden"> {email}</h1>
                                    </div>
                                    <span className="grid grid-cols-3 mt-6">
                                        <h1 className="p-2 font-normal flex justify-start  items-center text-sm xl:text-lg">
                                            {t('user.Sex')}
                                        </h1>
                                        {user.id ? (
                                            <RadioGroup
                                                className="col-span-2 sm:col-span-1"
                                                row
                                                value={sex}
                                                onChange={toggleSex}
                                            >
                                                <FormControlLabel
                                                    disabled={isNotEdit}
                                                    value="male"
                                                    control={<Radio />}
                                                    label={t('user.Male')}
                                                />
                                                <FormControlLabel
                                                    disabled={isNotEdit}
                                                    value="female"
                                                    control={<Radio />}
                                                    label={t('user.Female')}
                                                />
                                            </RadioGroup>
                                        ) : (
                                            <></>
                                        )}
                                    </span>
                                    <span className="grid grid-cols-3 mt-6">
                                        <h1 className="p-2 font-normal flex justify-start  items-center text-sm xl:text-lg">
                                            {t('user.Birthday')}
                                        </h1>
                                        <div className="w-64">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker', 'DatePicker']}>
                                                    <DatePicker
                                                        disabled={isNotEdit}
                                                        value={birthday}
                                                        onChange={(newValue: any) => setBirthday(newValue)}
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </div>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 lg:col-span-1">
                                <div className="grid grid-cols-3 flex justify-center items-center mt-6 box-shadow rounded pt-12 pb-12 p-6 relative">
                                    <div className="col-span-2">
                                        <div className="flex items-center">
                                            <LocalPhoneIcon /> &nbsp; &nbsp;
                                            <div className="text-xl">{t('user.Phone')}</div>
                                        </div>
                                        {!isShowChangePhone ? (
                                            phone == null ? (
                                                <div className="ml-3 mt-3">----------</div>
                                            ) : (
                                                <div className="ml-3 mt-3">{phone}</div>
                                            )
                                        ) : (
                                            <div className="pl-4 pr-4">
                                                <Input
                                                    value={phone}
                                                    onChange={(e) => filterInputNumber(e.target.value, setPhone)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {!isShowChangePhone ? (
                                        <div className="cursor-pointer absolute top-3 right-5">
                                            <EditIcon onClick={toggleIsShowPhone} />
                                        </div>
                                    ) : (
                                        <div className="cursor-pointer absolute top-3 right-5">
                                            <SaveIcon onClick={handleChangePhone} />
                                            <div className="mt-3">
                                                <ArrowBackIcon onClick={toggleIsShowPhone} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-3 flex justify-center items-center mt-6 box-shadow rounded pt-12 pb-12 p-6 relative">
                                    <div className="col-span-2">
                                        <div className="flex items-center">
                                            <FestivalIcon /> &nbsp; &nbsp;
                                            <div className="text-xl">{t('user.Address')}</div>
                                        </div>

                                        <div className="ml-3 mt-3">----------</div>
                                    </div>
                                    <div className="absolute right-5 top-3 cursor-pointer">
                                        <EditIcon onClick={handleClickAddress} />
                                    </div>
                                </div>
                                {localStorage.getItem('oauth2') == 'false' ? (
                                    <div className="grid grid-cols-3 flex justify-center items-center mt-6 box-shadow rounded pt-12 pb-12 p-6 relative">
                                        {!isShowChangePassword ? (
                                            <>
                                                <div className="col-span-2">
                                                    <div className="flex items-center">
                                                        <SecurityIcon /> &nbsp; &nbsp;
                                                        <div className="text-xl">{t('user.Secure')}</div>
                                                    </div>
                                                    <div className="ml-3 mt-3"> ***********</div>
                                                </div>
                                                <div className="absolute right-5 top-3 cursor-pointer">
                                                    <EditIcon onClick={toggleShowChangePassword} />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="col-span-2">
                                                    <div className="flex items-center">
                                                        <SecurityIcon /> &nbsp; &nbsp;
                                                        <div className="text-xl">{t('user.Secure')}</div>
                                                    </div>
                                                    <div className="mt-3">{t('auth.Password')}</div>
                                                    <div>
                                                        <span className="w-full relative">
                                                            <Input
                                                                type={isHidePassword ? 'password' : 'text'}
                                                                placeholder={t('auth.Password')}
                                                                value={passwordOld}
                                                                onChange={(e) => setPasswordOld(e.target.value)}
                                                            />
                                                            <span
                                                                className="absolute top-0 right-2"
                                                                onClick={changeIsHidePassword}
                                                            >
                                                                {isHidePassword ? (
                                                                    <VisibilityIcon />
                                                                ) : (
                                                                    <VisibilityOffIcon />
                                                                )}
                                                            </span>
                                                        </span>
                                                        <span className="w-full relative">
                                                            <Input
                                                                type={isHidePassword ? 'password' : 'text'}
                                                                placeholder={t('auth.Password')}
                                                                value={passwordNew}
                                                                onChange={(e) => {
                                                                    filterPassword(
                                                                        e.target.value,
                                                                        setPasswordNew,
                                                                        setStrength,
                                                                    );
                                                                }}
                                                            />
                                                            <span
                                                                className="absolute top-0 right-2"
                                                                onClick={changeIsHidePassword}
                                                            >
                                                                {isHidePassword ? (
                                                                    <VisibilityIcon />
                                                                ) : (
                                                                    <VisibilityOffIcon />
                                                                )}
                                                            </span>
                                                        </span>
                                                        <div className="w-full h-5">
                                                            {passwordNew ? (
                                                                <CheckPasswordMeter password={passwordNew} />
                                                            ) : null}
                                                        </div>

                                                        <span className="w-full relative">
                                                            <Input
                                                                type={isHidePassword ? 'password' : 'text'}
                                                                placeholder={t('auth.Re-password')}
                                                                value={rePasswordNew}
                                                                onChange={(e) =>
                                                                    filterInput(e.target.value, setRePasswordNew)
                                                                }
                                                            />
                                                            <span
                                                                className="absolute top-0 right-2"
                                                                onClick={changeIsHidePassword}
                                                            >
                                                                {isHidePassword ? (
                                                                    <VisibilityIcon />
                                                                ) : (
                                                                    <VisibilityOffIcon />
                                                                )}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="ml-10 cursor-pointer absolute right-5 top-3">
                                                    <SaveIcon onClick={handleChangePassword} />
                                                    <div className="mt-3">
                                                        <ArrowBackIcon onClick={toggleShowChangePassword} />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                            <div className="col-span-2 lg:col-span-1 ">
                                <div className="mt-6 box-shadow rounded pt-6 pb-7 p-6 relative">
                                    <div>
                                        <InventoryIcon />
                                        &nbsp; {t('user.Orders')} :
                                    </div>
                                    <div className="text-center mt-6 mb-6 text-3xl">
                                        {user.id ? user.orderIdList.length : null}
                                    </div>
                                    <div
                                        onClick={() => nav('/user/order')}
                                        className="absolute right-6 top-3 cursor-pointer hover:opacity-40 transition-all duration-500"
                                    >
                                        <KeyboardTabIcon />
                                    </div>
                                </div>
                                <div className=" mt-6 box-shadow rounded pt-12 pb-12 p-6 mt-6">
                                    <div className="flex justify-center">
                                        {user.id ? (
                                            user.point >= 3000 ? (
                                                <img
                                                    style={{ objectFit: 'cover', height: 187 }}
                                                    src={require('../../static/diamond-medal.png')}
                                                />
                                            ) : user.point >= 2000 ? (
                                                <img
                                                    style={{ objectFit: 'cover', height: 187 }}
                                                    src={require('../../static/gold-medal.png')}
                                                />
                                            ) : user.point >= 1000 ? (
                                                <img
                                                    style={{ objectFit: 'cover', height: 187 }}
                                                    src={require('../../static/silver-medal.png')}
                                                />
                                            ) : (
                                                <img
                                                    style={{ objectFit: 'cover', height: 187 }}
                                                    src={require('../../static/bronze-medal.png')}
                                                />
                                            )
                                        ) : null}
                                    </div>
                                    <div className="flex justify-center mt-6 text-3xl">
                                        {user.id ? user.point : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            <Dialog onClose={() => {}} open={openOtp}>
                <Button className="mt-2 ml-2 w-2 mb-10 flex items-center justify-center" onClick={handleCloseDialog}>
                    <ArrowBackIcon />
                </Button>
                <h1 className="text-center text-2xl font-bold">OTP</h1>
                <OtpInput
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
        </>
    );
};
export default InfoUser;
