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
import { VoucherModel } from '../../../../models/voucher';

interface EditVoucherProps {
    onClose: () => void;
    open: boolean;
    voucher?: VoucherModel;
    onUpdate: () => void;
}

const EditVoucherDialog: React.FC<EditVoucherProps> = (props) => {
    const { t } = useTranslation();
    const store = useStore();
    const { onClose, open, voucher, onUpdate } = props;
    const user = useSelector((state: ReducerProps) => state.user);
    const [expireDate, setExpireDate] = useState<Date | null>(null);
    const [codeError, setCodeError] = useState<string | null>(null);

    useEffect(() => {
        if (voucher) {
            setExpireDate(new Date(voucher.expired));
        }
    }, [voucher]);

    const handleClose = () => {
        onClose();
    };

    const handleEditVoucher = async (
        id: string,
        name: string,
        code: string,
        reduce: number,
        condition: number,
        quantity: number,
        expired: Date | null,
    ) => {
        store.dispatch(change_is_loading(true));
        if (user) {
            const shopId = user.shopId;
            const voucherData = {
                id,
                name,
                code,
                reduce,
                condition,
                quantity,
                expired: expired ? expired.toISOString() : null,
                shopId,
            };
            try {
                const response = await PostApi(`/shop/update/voucher`, localStorage.getItem('token'), voucherData);
                console.log(response);
                onUpdate();
                toastSuccess(t('toast.EditSuccess'));
            } catch (error) {
                toastWarning(t('toast.EditFail'));
            } finally {
                store.dispatch(change_is_loading(false));
            }
        }
    };

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

                            if (expireDate) {
                                if (voucher)
                                    await handleEditVoucher(
                                        voucher.id,
                                        name,
                                        code,
                                        reduce,
                                        condition,
                                        quantity,
                                        expireDate,
                                    );
                                handleClose();
                            } else {
                                toastWarning(t('toast.SelectExpireDate'));
                            }
                        },
                    }}
                >
                    <DialogTitle>{t('voucher.EditVoucher')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ mb: 1 }}>{t('voucher.EditVoucherForm')}</DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            name="name"
                            label="Tên Voucher"
                            type="name"
                            defaultValue={voucher?.name}
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
                            defaultValue={voucher?.code}
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
                                defaultValue={voucher?.reduce}
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
                                defaultValue={voucher?.condition}
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
                                defaultValue={voucher?.quantity}
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

export default EditVoucherDialog;
