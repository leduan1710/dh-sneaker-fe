import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    Button,
    TextField,
    DialogContent,
    DialogContentText,
    DialogActions,
    SelectChangeEvent,
    FormControl,
    Select,
    MenuItem,
    Stack,
    FormHelperText,
    styled,
    Box,
    IconButton,
    Avatar,
} from '@mui/material';

import { useSelector, useStore } from 'react-redux';
import { change_is_loading } from '../../../../reducers/Actions';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import { HOST_BE } from '../../../../common/Common';
import axios from 'axios';
import { toastSuccess, toastWarning } from '../../../../untils/Logic';
import { useTranslation } from 'react-i18next';
import { PostApi } from '../../../../untils/Api';

const Input = styled('input')({
    display: 'none',
});

interface CreateStylesProps {
    onClose: () => void;
    open: boolean;
    categories: Array<any>;
    onUpdate: any;
}

const CreateStyles: React.FC<CreateStylesProps> = (props) => {
    const { t } = useTranslation();
    const store = useStore();
    const { onClose, open, categories, onUpdate } = props;
    const handleClose = () => {
        onClose();
    };

    const handleAddCategory = async (name: string) => {
        store.dispatch(change_is_loading(true));

        const res = await PostApi('/admin/create/styles', localStorage.getItem('token'), { name });

        if (res.data.message === 'Success') {
            toastSuccess(t('toast.CreateSuccess'));
            onUpdate();
        }
        if (res.data.message === 'Already exists') {
            toastWarning(t('toast.NameAlreadyExists'));
        }
        store.dispatch(change_is_loading(false));
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
                            await handleAddCategory(name);
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
                            sx={{ mb: 1 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Hủy</Button>
                        <Button type="submit">Xác nhận</Button>
                    </DialogActions>
                </Dialog>
            </Dialog>
        </React.Fragment>
    );
};
export default CreateStyles;
