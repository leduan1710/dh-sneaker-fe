import { useTranslation } from "react-i18next";
import { GetApi } from "../../../../untils/Api";
import { toastSuccess, toastWarning } from "../../../../untils/Logic";
import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface DeleteDialogProps {
    onClose: () => void;
    open: boolean;
    discountId?: string;
    productDetailId?: string;
    product?: any;
    onUpdate: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, discountId, onUpdate, product, productDetailId} = props;

    const handleClose = () => {
        onClose();
    };
    const handleDelete = async () => {
        try {
            if(product.percentDiscountTop == 0)
            {
                toastWarning(t('toast.NoDiscount'));
                onClose();
                return;

            }
            if(product)
            {
                const res = await GetApi(`/shop/delete-discount-product/${product.id}`, localStorage.getItem('token'), {});

                if (res.data.message === 'Success') {
                    toastSuccess(t('toast.DeleteSuccess'));
                    onUpdate();
                }
            }
            else{
                const res = await GetApi(`/shop/delete-discount/${discountId}/${productDetailId}`, localStorage.getItem('token'), {});

                if (res.data.message === 'Success') {
                    toastSuccess(t('toast.DeleteSuccess'));
                    onUpdate();
                }
            }

        } catch (error) {
            console.error('Xóa không thành công', error);
            // Xử lý lỗi nếu cần
        }
        onClose();
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
            >
                <DialogTitle sx={{ textTransform: 'capitalize' }} id="dialog-title">
                    {t('discount.DeleteDiscount')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        {t('discount.ConfirmToDeleteDiscount')} ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('action.Cancel')}</Button>
                    <Button onClick={handleDelete} autoFocus>
                        {t('action.Confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default DeleteDialog;