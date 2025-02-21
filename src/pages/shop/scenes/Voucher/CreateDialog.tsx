import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    Button,
    TextField,
    DialogContent,
    DialogContentText,
    DialogActions,
    Stack,
} from '@mui/material';

import { useSelector, useStore } from 'react-redux';
import { change_is_loading } from '../../../../reducers/Actions';
import { toastSuccess, toastWarning } from '../../../../untils/Logic';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useTranslation } from 'react-i18next';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { PostApi } from '../../../../untils/Api';

interface CreateVoucherProps {
    onClose: () => void;
    open: boolean;
    onUpdate: ()=> void;
}

const CreateVoucherDialog: React.FC<CreateVoucherProps> = (props) => {
    const { t } = useTranslation();
    const store = useStore();
    const { onClose, open, onUpdate } = props;
    const user = useSelector((state: ReducerProps) => state.user);
    const [expireDate, setExpireDate] = useState<Date | null>(null);
    const [codeError, setCodeError] = useState<string | null>(null);

    const handleClose = () => {
        onClose();
    };
    const checkDuplicateCode = async (code: string) => {
        try {
            const response = await PostApi(`/shop/check/voucher-code`, localStorage.getItem('token'), { code });
            return response.data.exists;
        } catch (error) {
            console.error('Check code voucher thất bại', error);
            return false;
        }
    };
    const handleAddVoucher = async (
        name: string,
        code: string,
        reduce: number,
        condition: number,
        quantity: number,
        expired: Date | null,
    ) => {
        store.dispatch(change_is_loading(true));
        // Prepare the data to send to the API
        if (user) {
            const shopId = user.shopId;
            const voucherData = {
                name,
                code,
                reduce,
                condition,
                quantity,
                expired: expired ? expired.toISOString() : null,
                shopId,
            };
            try {
                const response = await PostApi(`/shop/add/voucher`, localStorage.getItem('token'), voucherData);
                if(response.data.message == 'Success')
                    toastSuccess(t('toast.CreateSuccess'));
                onUpdate();
            } catch (error) {
            } finally {
                store.dispatch(change_is_loading(false));
            }
        }
    };

    useEffect(() => {
        setExpireDate(null);
    }, []);
    return (
        <React.Fragment>
            <Dialog onClose={handleClose} open={open}>
                <Dialog
                    maxWidth="md"
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries((formData as any).entries());
                            const name = formJson.name;
                            const code = formJson.code;
                            const reduce = parseFloat(formJson.reduce);
                            const condition = parseFloat(formJson.condition);
                            const quantity = parseInt(formJson.quantity, 10);
                            setCodeError(null);
                            if (reduce < 0 || condition < 0 || quantity < 0) {
                                toastWarning(t('toast.ReductConditionQuantityNonNegative'));
                                return;
                            }
                            const isDuplicate = await checkDuplicateCode(code);
                            if (isDuplicate) {
                                setCodeError(t('toast.VoucherCodeAlreadyExists'));
                                return;
                            }

                            if (expireDate) {
                                if(expireDate < new Date())
                                {
                                    toastWarning(t('toast.ConditionExpireDate'));
                                    return;
                                }
                                await handleAddVoucher(name, code, reduce, condition, quantity, expireDate);
                                handleClose();
                            } else {
                                toastWarning(t('toast.SelectExpireDate'));
                            }
                        },
                    }}
                >
                    <DialogTitle>{t('voucher.CreateVoucher')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ mb: 1 }}>{t('voucher.CreateVoucherForm')}</DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            name="name"
                            label="Tên Voucher"
                            type="name"
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 1 }}
                        />
                        <TextField
                            required
                            margin="dense"
                            id="code"
                            name="code"
                            label="Code"
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 1 }}
                            error={!!codeError}
                            helperText={codeError}
                        />
                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                            <TextField
                                required
                                margin="dense"
                                id="reduce"
                                name="reduce"
                                label="Số tiền giảm"
                                type="number"
                                fullWidth
                                variant="outlined"
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                required
                                margin="dense"
                                id="condition"
                                name="condition"
                                label="Điều kiện giảm"
                                type="number"
                                fullWidth
                                variant="outlined"
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                required
                                margin="dense"
                                id="quantity"
                                name="quantity"
                                label="Số lượng voucher"
                                type="number"
                                fullWidth
                                variant="outlined"
                                sx={{ mb: 1 }}
                            />
                        </Stack>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label={t('voucher.ExpireDate') + ' *'}
                                value={expireDate}
                                onChange={(newValue) => setExpireDate(newValue)} // Update state on date change
                            />
                        </LocalizationProvider>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>{t('action.Cancel')}</Button>
                        <Button type="submit">{t('action.Confirm')}</Button>
                    </DialogActions>
                </Dialog>
            </Dialog>
        </React.Fragment>
    );
};
export default CreateVoucherDialog;
