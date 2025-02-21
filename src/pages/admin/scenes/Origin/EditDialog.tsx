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

interface EditProps {
    onClose: () => void;
    open: boolean;
    categories: Array<any>;
    category?: CategoryModel;
    onUpdate: () => void;
}

const Edit: React.FC<EditProps> = (props) => {
    const { t } = useTranslation();
    const store = useStore();
    const { onClose, open, categories, category, onUpdate } = props;

    const handleClose = () => {
        onClose();
    };

    const handleEditCategory = async (name: string) => {
        const res = await PostApi(`/admin/edit/origin/${category?.id}`, localStorage.getItem('token'), { name: name });
        if (res.data.message == 'Success') {
            toastSuccess(t('auth.Success'));
            onUpdate();
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
                        await handleEditCategory(name);
                        handleClose();
                    },
                }}
            >
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label={t('user.Name')}
                        type="name"
                        fullWidth
                        variant="outlined"
                        defaultValue={category ? category.name : ''}
                        sx={{ mb: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button type="submit">Xác nhận</Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default Edit;
