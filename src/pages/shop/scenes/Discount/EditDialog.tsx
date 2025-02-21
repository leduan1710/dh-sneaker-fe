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
import { useTranslation } from 'react-i18next';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { PostApi } from '../../../../untils/Api';
import { ProductDetail, ProductModel } from '../../../../models/product';
import { Discount } from '../../../../models/discount';

interface EditDiscountProps {
    onClose: () => void;
    open: boolean;
    productDetail?: ProductDetail;
    product?: ProductModel;
    onUpdate: () => void;
    discount?: Discount;
    all: boolean;
}

const EditDiscountDialog: React.FC<EditDiscountProps> = (props) => {
    const { t } = useTranslation();
    const store = useStore();
    const { onClose, open, productDetail, onUpdate, discount, product, all } = props;
    const user = useSelector((state: ReducerProps) => state.user);
    const [codeError, setCodeError] = useState<string | null>(null);

    useEffect(() => {}, [productDetail]);

    const handleClose = () => {
        onClose();
    };

    const handleAddDiscount = async (name: string, percent: number) => {
        handleClose();
        store.dispatch(change_is_loading(true));
        if (user) {
            const shopId = user.shopId;
            const productDetailId = productDetail?.id;
            const productId = product?.id;
            const discountData = {
                name,
                percent,
                shopId,
                productDetailId,
                productId,
                all,
            };
            try {
                const response = await PostApi(`/shop/add/discount`, localStorage.getItem('token'), discountData);
                console.log(response);
                onUpdate();
                toastSuccess(t('toast.CreateSuccess'));
            } catch (error) {
                toastWarning(t('toast.CreateFail'));
            } finally {
                store.dispatch(change_is_loading(false));
            }
        }
    };
    const handleEditDiscount = async (id: string, name: string, percent: number) => {
        handleClose();
        store.dispatch(change_is_loading(true));
        if (user) {
            const shopId = user.shopId;
            const productDetailId = productDetail?.id;
            const productId = product?.id;
            const discountData = {
                id,
                name,
                percent,
                shopId,
                productDetailId,
                productId,
            };
            try {
                const response = await PostApi(`/shop/update/discount`, localStorage.getItem('token'), discountData);
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
                            const percent = parseInt(formJson.percent, 10) / 100;
                            setCodeError(null);

                            if (discount) await handleEditDiscount(discount.id, name, percent);
                            else await handleAddDiscount(name, percent);
                        },
                    }}
                >
                    <DialogTitle>{t('discount.EditDiscount')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ mb: 1 }}>{t('discount.EditDiscountForm')}</DialogContentText>

                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="name"
                                name="name"
                                label={t('discount.Name')}
                                type="name"
                                defaultValue={discount?.name || ''}
                                fullWidth
                                variant="outlined"
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                required
                                margin="dense"
                                id="percent"
                                name="percent"
                                label={t('discount.Percent')}
                                type="number"
                                defaultValue={discount ? Math.floor(discount.percent * 100) : 0}
                                fullWidth
                                variant="outlined"
                                sx={{ mb: 1 }}
                            />
                        </Stack>
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

export default EditDiscountDialog;
