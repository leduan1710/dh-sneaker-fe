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
import { GetApi } from '../../../../untils/Api';
import { toastSuccess } from '../../../../untils/Logic';

interface StatusUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    onUpdate: () => void;
    order: OrderModel;
}

const StatusUpdateDialog: React.FC<StatusUpdateDialogProps> = ({ open, onClose, order, onUpdate }) => {
    const { t } = useTranslation();
    const store = useStore();
    const handleStatusOrder = async () => {
        if (order) {
            onClose();
            store.dispatch(change_is_loading(true));
            if (order.status == 'PROCESSING') {
                const resOrder = await GetApi(`/shop/update/order-confirmed/${order.id}`, localStorage.getItem('token'));
                if (resOrder.data.message == 'Success') {
                    toastSuccess(t('toast.Success'))
                    onUpdate();
                }
                store.dispatch(change_is_loading(false));
            };
            if (order.status == 'CONFIRMED') {
                const resOrder = await GetApi(`/shop/update/order-delivering/${order.id}`, localStorage.getItem('token'));
                if (resOrder.data.message == 'Success') {
                    toastSuccess(t('toast.Success'))
                    onUpdate();
                }
                store.dispatch(change_is_loading(false));
            };
            if (order.status == 'DELIVERING')
            {
                const resOrder = await GetApi(`/shop/update/order-processed/${order.id}`, localStorage.getItem('token'));
                
                if (resOrder.data.message == 'Success') {
                    toastSuccess(t('toast.Success'))
                    onUpdate();
                }
                store.dispatch(change_is_loading(false));
                if (resOrder.data.message == 'Success') {
                    await GetApi(`/shop/send-order-email/${order.id}`, localStorage.getItem('token'));
                }
            };
            

        }
    };
    return (
        <React.Fragment>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>{t('order.ConfirmAction')}</DialogTitle>
                <DialogContent>
                    <Typography>
                        {order.status === 'PROCESSING' && t('order.ConfirmOrder')}
                        {order.status === 'CONFIRMED' && t('order.ConfirmDelivering')}
                        {order.status === 'DELIVERING' && t('order.ConfirmDelivered')} ?
                    </Typography>
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
