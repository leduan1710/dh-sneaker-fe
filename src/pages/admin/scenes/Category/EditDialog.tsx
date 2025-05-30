import React, { useState, useEffect } from 'react';
import {
    Box,
    IconButton,
    Avatar,
    Button,
    MenuItem,
    FormHelperText,
    FormControl,
    Select,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    SelectChangeEvent,
    styled,
    DialogActions,
} from '@mui/material';

import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';

import { CategoryModel } from '../../../../models/category';
import { HOST_BE } from '../../../../common/Common';
import { toastSuccess, toastWarning } from '../../../../untils/Logic';
import axios from 'axios';
import { useStore } from 'react-redux';
import { GetApi, PostApi } from '../../../../untils/Api';
import { useTranslation } from 'react-i18next';

const Input = styled('input')({
    display: 'none',
});

interface EditCateDialogProps {
    onClose: () => void;
    open: boolean;
    categories: Array<any>;
    category?: CategoryModel;
    onUpdate: () => void;
}

const EditCateDialog: React.FC<EditCateDialogProps> = (props) => {
    const { t } = useTranslation();
    const store = useStore();
    const { onClose, open, categories, category, onUpdate } = props;
    const [categoryName, setCategoryName] = useState('');


    const handleClose = () => {
        onClose();
    };

    const handleEditCategory = async (name: string, image: File, previousId: string) => {
        const formData = new FormData();
        formData.append('id', category ? category.id : '');
        formData.append('name', name);
        if (image) {
            const uniqueFilename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const imageBlob = await fetch(URL.createObjectURL(image)).then((response) => response.blob());
            formData.append('file', imageBlob, uniqueFilename);
        }
        try {
            const res = await axios.post(`${HOST_BE}/admin/update/category`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Nếu cần token
                },
            });

            if (res.data.message === 'Success') {
                toastSuccess(t('toast.EditSuccess'));
                onUpdate();
                handleClose(); // Đóng dialog
            }
        } catch (error) {
        }
    };

    return (
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
                        const image = formJson.image;

                        handleClose();
                    },
                }}
            >
                <DialogTitle sx={{ textTransform: 'capitalize'}}>{t('category.Admin.EditCategory')}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 1 }}>{t('category.Admin.FormEditCategory')}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label={t('category.CategoryName')}
                        type="name"
                        fullWidth
                        defaultValue={category ? category.name : ''}
                        variant="outlined"
                        sx={{ mb: 1 }}
                    />
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('action.Cancel')}</Button>
                    <Button type="submit">{t('action.Confirm')}</Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default EditCateDialog;