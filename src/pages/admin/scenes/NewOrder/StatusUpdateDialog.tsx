import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { OrderModel } from '../../../../models/order';
import { change_is_loading } from '../../../../reducers/Actions';
import { useStore } from 'react-redux';
import { GetApi, PostApi } from '../../../../untils/Api';
import { toastError, toastSuccess } from '../../../../untils/Logic';
import { TextField } from '@mui/material';
import axios from 'axios';
import DeliveryCodeDialog from './DeliveryCodeDialog';

interface StatusUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (deliveryCode: any) => void;
    order: any;
    selection: string;
}

const StatusUpdateDialog: React.FC<StatusUpdateDialogProps> = ({ open, onClose, order, onUpdate, selection }) => {
    const { t } = useTranslation();
    const store = useStore();
    const [cancelReason, setCancelReason] = useState('');
    const [orderNote, setOrderNote] = useState('');

    const checkTokenExpiration = () => {
        const expiration = localStorage.getItem('VIETTELPOST_TOKEN_EXPIRATION');
        return expiration && Date.now() < Number(expiration);
    };

    const fetchNewToken = async () => {
        const response = await GetApi(`/admin/get/tokenVTP`, localStorage.getItem('token'));
        const { token, expired } = response.data;
        saveTokenToLocalStorage(token, expired);
        return token;
    };

    const saveTokenToLocalStorage = (token: string, expirationTime: string) => {
        localStorage.setItem('VIETTELPOST_TOKEN', token);
        localStorage.setItem('VIETTELPOST_TOKEN_EXPIRATION', expirationTime);
    };

    const handleStatusOrder = async () => {
        if (order) {
            onClose();
            let tokenVTP;
            store.dispatch(change_is_loading(true));
            if (selection == 'SUCCESS') {
                if (order.shipMethod === 'VIETTELPOST') {
                    if (!checkTokenExpiration()) {
                        tokenVTP = await fetchNewToken();
                    } else {
                        tokenVTP = localStorage.getItem('VIETTELPOST_TOKEN');
                    }
                    const resOrder = await PostApi(`/admin/createVTPOrder`, localStorage.getItem('token'), {
                        VTPToken: tokenVTP,
                        orderId: order.id,
                        orderNote: orderNote,
                    });
                    if (resOrder.data.message == 'Success') {
                        toastSuccess(t('toast.Success'));
                        onUpdate(resOrder.data.data.data.ORDER_NUMBER);
                    } else toastError('Thất bại');
                } else {
                    const resOrder = await PostApi(
                        `/admin/update/order-confirmed/${order.id}`,
                        localStorage.getItem('token'),
                        { orderNote: orderNote },
                    );
                    if (resOrder.data.message == 'Success') {
                        toastSuccess(t('toast.Success'));
                        onUpdate('');
                    } else toastError('Thất bại');
                }

                store.dispatch(change_is_loading(false));
            }
            if (selection == 'CANCEL') {
                const resOrder = await PostApi(
                    `/admin/update/order-cancelled/${order.id}`,
                    localStorage.getItem('token'),
                    {
                        cancelReason: cancelReason,
                    },
                );
                if (resOrder.data.message == 'Success') {
                    toastSuccess(t('toast.Success'));
                    onUpdate('');
                } else toastError('Thất bại');
                store.dispatch(change_is_loading(false));
            }
        }
    };
    return (
        <React.Fragment>
            <Dialog open={open} onClose={onClose} maxWidth={'xs'} fullWidth={true}>
                <DialogTitle>{t('order.ConfirmAction')}</DialogTitle>
                <DialogContent>
                    <Typography>
                        {selection === 'SUCCESS' && 'Xác nhận đơn hàng thành công ?'}
                        {selection === 'CANCEL' && 'Xác nhận từ chối đơn hàng này ?'}
                    </Typography>
                    {selection === 'SUCCESS' && (
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            name="reason"
                            label="Ghi chú của quản trị viên"
                            type="text"
                            value={orderNote}
                            onChange={(e) => {
                                setOrderNote(e.target.value);
                            }}
                            fullWidth
                            variant="standard"
                        />
                    )}
                    {selection === 'CANCEL' && (
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            name="reason"
                            label="Lý do từ chối đơn"
                            type="text"
                            value={cancelReason}
                            onChange={(e) => {
                                setCancelReason(e.target.value);
                            }}
                            fullWidth
                            variant="standard"
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        {t('action.Cancel')}
                    </Button>
                    <Button onClick={handleStatusOrder} color="primary">
                        {t('action.Confirm')}
                    </Button>
                </DialogActions>
            </Dialog>

        </React.Fragment>
    );
};

export default StatusUpdateDialog;
