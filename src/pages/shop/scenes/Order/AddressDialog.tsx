import React, { useState } from 'react';
import {
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    Button,
} from '@mui/material';

import { useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { OrderModel } from '../../../../models/order';


interface AddressDialogProps {
    onClose: () => void;
    open: boolean;
    order?: OrderModel;
}

const AddressDialog: React.FC<AddressDialogProps> = (props) => {
    const { t } = useTranslation();
    const store = useStore();
    const { onClose, open, order } = props;

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <Dialog
                maxWidth="md"
                open={open}
                onClose={handleClose}
            >
                <DialogTitle sx={{ textTransform: 'capitalize'}}>{t('order.DeliveryAddress')}</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText sx={{ mb: 1 }}>{t('or.Admin.FormEditCategory')}
                    </DialogContentText> */}
                    <Stack>
                    <TextField
                    
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label={t('order.Province')}
                        type="name"
                        fullWidth
                        value={order?.address.city.province_name}
                        variant="outlined"
                        sx={{ mb: 1 }}
                    />
                    <TextField
                    
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label={t('order.District')}
                        type="name"
                        fullWidth
                        value={order?.address.district.district_name}
                        variant="outlined"
                        sx={{ mb: 1 }}
                    />
                    <TextField
                    
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label={t('order.Ward')}
                        type="name"
                        fullWidth
                        value={order?.address.ward.ward_name}
                        variant="outlined"
                        sx={{ mb: 1 }}
                    />
                    <TextField         
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label={t('order.Province')}
                        type="name"
                        fullWidth
                        value={order?.address.apartment}
                        variant="outlined"
                        sx={{ mb: 1 }}
                    />

                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('action.Close')}</Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default AddressDialog;