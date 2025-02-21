import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LeftNav from '../../../components/user-guest/info-user/LeftNav';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from '../../../components/ComponentsLogin';
import { filterInputNumber, filterSpecialInput, toastWarning } from '../../../untils/Logic';
import { change_is_loading } from '../../../reducers/Actions';
import { PostApi } from '../../../untils/Api';
import * as faceapi from 'face-api.js';
import { useSelector } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { useTranslation } from 'react-i18next';

const steps = ['Tạo ví', 'Tạo phương thức thanh toán'];
const RegisterWallet: React.FC<any> = (props) => {
    const location = useLocation();
    const previous = location.state?.previous;
    const nav = useNavigate();
    const { t } = useTranslation();
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set<number>());
    const [nameBank, setNameBank] = useState<string>('');
    const [numberBank, setNumberBank] = useState<string>('');
    const [nameUser, setNameUser] = useState<string>('');
    const user = useSelector((state: ReducerProps) => state.user);
    const isStepOptional = (step: number) => {
        return step === 1;
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = async () => {
        if (activeStep == 1) {
            if (nameBank != '' && nameUser != '' && numberBank != '') {
                change_is_loading(true);
                const res = await PostApi('/user/create-wallet', localStorage.getItem('token'), {
                    nameUser: nameUser,
                    nameBank: nameBank,
                    numberBank: numberBank,
                });
                if (res.data.message == 'Success') {
                    let newSkipped = skipped;
                    if (isStepSkipped(activeStep)) {
                        newSkipped = new Set(newSkipped.values());
                        newSkipped.delete(activeStep);
                    }

                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                    setSkipped(newSkipped);
                }
                change_is_loading(false);
            } else {
                toastWarning(t('auth.Please enter complete information'));
            }
        } else {
            let newSkipped = skipped;
            if (isStepSkipped(activeStep)) {
                newSkipped = new Set(newSkipped.values());
                newSkipped.delete(activeStep);
            }

            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSkipped(newSkipped);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        if (previous) {
            window.location.href = '/checkout';
        } else {
            window.location.href = '/user/info-user';
        }
    };

    return (
        <div className="marginTop container pl-12 pr-12">
            <div className="grid grid-cols-4 gap-4">
                <div className="hidden lg:block col-span-1 bg-white box-shadow rounded-xl">
                    <LeftNav index={2} />
                </div>
                {user.id ? (
                    !user.walletId ? (
                        <div className="col-span-4 lg:col-span-3 mt-12 lg:mt-0">
                            <Box sx={{ width: '100%' }}>
                                <Stepper activeStep={activeStep}>
                                    {steps.map((label, index) => {
                                        const stepProps: { completed?: boolean } = {};
                                        const labelProps: {
                                            optional?: React.ReactNode;
                                        } = {};
                                        if (isStepOptional(index)) {
                                        }
                                        if (isStepSkipped(index)) {
                                            stepProps.completed = false;
                                        }
                                        return (
                                            <Step key={label} {...stepProps}>
                                                <StepLabel {...labelProps}>{label}</StepLabel>
                                            </Step>
                                        );
                                    })}
                                </Stepper>
                                {activeStep === steps.length ? (
                                    <React.Fragment>
                                        <Typography sx={{ mt: 2, mb: 1 }}>
                                            {t('orther.AllStepCompleted')}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                            <Box sx={{ flex: '1 1 auto' }} />
                                            <Button onClick={handleReset}>{t('orther.Complete')}</Button>
                                        </Box>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        {activeStep == 1 ? (
                                            <Typography sx={{ mt: 2, mb: 1 }}>
                                                <Input
                                                    value={nameBank}
                                                    onChange={(e: any) =>
                                                        filterSpecialInput(e.target.value, setNameBank)
                                                    }
                                                    placeholder="Tên ngân hàng"
                                                />
                                                <Input
                                                    value={numberBank}
                                                    onChange={(e: any) =>
                                                        filterInputNumber(e.target.value, setNumberBank)
                                                    }
                                                    placeholder="Số tài khoản"
                                                />
                                                <Input
                                                    value={nameUser}
                                                    onChange={(e: any) =>
                                                        filterSpecialInput(e.target.value, setNameUser)
                                                    }
                                                    placeholder="Tên người dùng"
                                                />
                                            </Typography>
                                        ) : (
                                            <Typography sx={{ mt: 2, mb: 1 }}>
                                                <div className="pl-6">
                                                    <li>Ví dùng để thanh toán sản phẩm</li>
                                                    <li>Có thể nạp và rút</li>
                                                </div>
                                            </Typography>
                                        )}
                                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                            <Button
                                                color="inherit"
                                                disabled={activeStep === 0}
                                                onClick={handleBack}
                                                sx={{ mr: 1 }}
                                            >
                                            {t('action.Back')}
                                            </Button>
                                            <Box sx={{ flex: '1 1 auto' }} />
                                            <Button onClick={handleNext}>
                                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                            </Button>
                                        </Box>
                                    </React.Fragment>
                                )}
                            </Box>
                        </div>
                    ) : null
                ) : null}
            </div>
        </div>
    );
};

export default RegisterWallet;
