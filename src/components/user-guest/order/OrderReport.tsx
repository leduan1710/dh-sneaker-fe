import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { Dialog, FormControlLabel, Modal, Radio, RadioGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Button as Btn } from '../../ComponentsLogin';
import { PostApi } from '../../../untils/Api';
import { toastSuccess, toastWarning } from '../../../untils/Logic';
import { useSelector, useStore } from 'react-redux';
import { change_user } from '../../../reducers/Actions';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import axios from 'axios';
import { HOST_BE } from '../../../common/Common';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ReducerProps } from '../../../reducers/ReducersProps';

interface OrderReportProps {
    orderDetail: any;
    open: any;
    setOpen: any;
}
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
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};
const OrderReport: React.FC<OrderReportProps> = (props) => {
    const { orderDetail, open, setOpen } = props;
    const { t } = useTranslation();
    const [value, setValue] = useState<any>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const user = useSelector((state: ReducerProps) => state.user);
    const store = useStore();
    const [imageSelected, setImageSelected] = useState<any>(undefined);
    const handleClose = () => {
        setOpen(false);
    };
    const handleCloseModal = () => {
        setIsOpenModal(false);
    };
    const handleReportOrderDetail = async () => {
        if (value == 1 && user.walletId == null) {
            toastWarning(t('toast.PleaseRegisterWallet'));
            return;
        }
        if (value == 0 && !imageSelected) {
            toastWarning(t('auth.Please enter complete information'));
            return;
        }
        if (imageSelected) {
            const data = new FormData();
            const imageBlob = await fetch(URL.createObjectURL(imageSelected)).then((response) => response.blob());
            data.append('file', imageBlob);
            const resUpdateImg = await axios.post(`${HOST_BE}/user/upload-image-review`, data, {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (resUpdateImg.data.message == 'Success') {
                const res = await PostApi('/user/report-orderDetail', localStorage.getItem('token'), {
                    orderDetailId: orderDetail.id,
                    describe: value == 0 ? 'Sản phẩm không đúng' : 'Sản phẩm chưa được giao',
                    image: resUpdateImg.data.path,
                });
                if (res.data.message == 'Success') {
                    toastSuccess(t('auth.Success'));
                    setOpen(false);
                    store.dispatch(change_user(res.data.new_user));
                }
            }
        } else {
            const res = await PostApi('/user/report-orderDetail', localStorage.getItem('token'), {
                orderDetailId: orderDetail.id,
                describe: value == 0 ? 'Sản phẩm không đúng' : 'Sản phẩm chưa được giao',
            });
            if (res.data.message == 'Success') {
                toastSuccess(t('auth.Success'));
                setOpen(false);
                store.dispatch(change_user(res.data.new_user));
            }
        }
    };
    return (
        <React.Fragment>
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                PaperProps={{
                    style: {
                        padding: '30px',
                    },
                }}
            >
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                    onChange={(e: any) => setValue(e.target.value)}
                    value={value}
                >
                    <FormControlLabel value={0} control={<Radio />} label={t('order.ProductIsInCorrect')} />
                    {value == 0 ? (
                        <div className="flex flex-col items-center gap-4">
                            {imageSelected ? (
                                <>
                                    <img
                                        className="rounded-xl cursor-pointer border border-gray-200"
                                        style={{ width: 130, height: 130, objectFit: 'cover' }}
                                        src={URL.createObjectURL(imageSelected)}
                                        onClick={() => {
                                            setIsOpenModal(true);
                                        }}
                                    />
                                    <Button
                                        startIcon={<CloudUploadIcon />}
                                        component="label"
                                        role={undefined}
                                        variant="outlined"
                                    >
                                        Change
                                        <VisuallyHiddenInput
                                            type="file"
                                            onChange={(e: any) => {
                                                const file = e.target.files[0];
                                                if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
                                                    setImageSelected(file);
                                                } else {
                                                    toastWarning('Incorrect file type');
                                                }
                                            }}
                                            multiple
                                        />
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    style={{ width: 130, height: 130 }}
                                    component="label"
                                    role={undefined}
                                    variant="outlined"
                                    tabIndex={-1}
                                >
                                    +
                                    <VisuallyHiddenInput
                                        type="file"
                                        onChange={(e: any) => {
                                            const file = e.target.files[0];
                                            if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
                                                setImageSelected(file);
                                            } else {
                                                toastWarning('Incorrect file type');
                                            }
                                        }}
                                        multiple
                                    />
                                </Button>
                            )}
                        </div>
                    ) : null}
                    <FormControlLabel
                        className="mt-12"
                        value={1}
                        control={<Radio />}
                        label={t('order.ProductHasNotBeenDelivered')}
                    />
                    <Btn onClick={handleReportOrderDetail} className="mt-6">
                        {t('order.RequestRefund')}
                    </Btn>
                </RadioGroup>
                <Modal open={isOpenModal} onClose={handleCloseModal}>
                    <Box sx={{ ...style, width: 400 }}>
                        <img
                            src={imageSelected ? URL.createObjectURL(imageSelected) : ''}
                            style={{ width: 550, objectFit: 'cover' }}
                        />
                    </Box>
                </Modal>
            </Dialog>
        </React.Fragment>
    );
};

export default OrderReport;
