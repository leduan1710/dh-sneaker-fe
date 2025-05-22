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
import { toastSuccess } from '../../../../untils/Logic';
import { TextField } from '@mui/material';

interface StatusUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    onUpdate: () => void;
    order: OrderModel;
    status: string;
}

const StatusUpdateDialog: React.FC<StatusUpdateDialogProps> = ({ open, onClose, order, onUpdate, status }) => {
    const { t } = useTranslation();
    const store = useStore();
    const [cancelReason, setCancelReason] = useState('');

    const handleStatusOrder = async () => {
        if (order) {
            onClose();
            store.dispatch(change_is_loading(true));
            if (status == 'SUCCESS') {
                const resOrder = await GetApi(`/admin/update/order-success/${order.id}`, localStorage.getItem('token'));
                if (resOrder.data.message == 'Success') {
                    toastSuccess(t('toast.Success'));
                    onUpdate();
                }
                store.dispatch(change_is_loading(false));
            }
            if (status == 'CANCEL') {
                const resOrder = await PostApi(
                    `/admin/update/order-cancelled/${order.id}`,
                    localStorage.getItem('token'),
                    {
                        cancelReason: cancelReason,
                    },
                );
                if (resOrder.data.message == 'Success') {
                    toastSuccess(t('toast.Success'));
                    onUpdate();
                }
                store.dispatch(change_is_loading(false));
            }
            if (status == 'BOOM') {
                const resOrder = await GetApi(`/admin/update/order-boom/${order.id}`, localStorage.getItem('token'));

                if (resOrder.data.message == 'Success') {
                    toastSuccess(t('toast.Success'));
                    onUpdate();
                }
                store.dispatch(change_is_loading(false));
            }
        }
    };
    return (
        <React.Fragment>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
                <DialogContent>
                    <Typography>
                        Xác nhận cập nhật trạng thái đơn hàng là "{status === 'SUCCESS' && 'THÀNH CÔNG'}
                        {status === 'CANCEL' && 'ĐÃ HỦY'}
                        {status === 'BOOM' && 'BOOM'}" ?
                    </Typography>
                    {status === 'CANCEL' && (
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
