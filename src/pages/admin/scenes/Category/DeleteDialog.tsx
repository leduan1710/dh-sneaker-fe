import React from 'react';
import { useTranslation } from "react-i18next";
import { toastSuccess } from "../../../../untils/Logic";
import { GetApi, PostApi } from "../../../../untils/Api";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface DeleteDialogProps {
    onClose: () => void;
    open: boolean;
    categoryId?: string;
    onUpdate: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, categoryId, onUpdate } = props;

    const handleClose = () => {
        onClose();
    };
    const handleDelete = async () => {
        try {
            const res = await GetApi(`/admin/delete/category/${categoryId}`, localStorage.getItem('token'), {});

            if (res.data.message === 'Success') {
                toastSuccess(t('toast.DeleteSuccess'));
                onUpdate();
            }
        } catch (error) {
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
                    {t('category.Admin.DeleteCategory')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        {t('category.Admin.ConfirmToDeleteCategory')} ?
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