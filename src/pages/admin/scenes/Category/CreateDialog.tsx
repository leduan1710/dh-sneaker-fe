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

interface CreateCateDialogProps {
    onClose: () => void;
    open: boolean;
    categories: Array<any>;
    onUpdate: any;
}

const CreateCateDialog: React.FC<CreateCateDialogProps> = (props) => {
    const { t } = useTranslation();
    const store = useStore();
    const { onClose, open, categories, onUpdate } = props;
    const [selectImage, setSelectImage] = useState<File | null>(null);

    const handleClose = () => {
        onClose();
        setSelectImage(null);
    };

    const handleAddCategory = async (name: string, image: File) => {
        store.dispatch(change_is_loading(true));
        const formData = new FormData();
        formData.append('name', name);
        const resCheck = await PostApi('/admin/check-name-category', localStorage.getItem('token'), { name: name });
        if (resCheck.data.message == 'Already exists') {
            toastWarning(t('toast.NameAlreadyExists'));
            store.dispatch(change_is_loading(false));
            return;
        }
        if (image) {
            const uniqueFilename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const imageBlob = await fetch(URL.createObjectURL(image)).then((response) => response.blob());
            formData.append('file', imageBlob, uniqueFilename);
        }
        try {
            const res = await axios.post(`${HOST_BE}/admin/add/category`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Nếu cần token
                },
            });

            if (res.data.message === 'Success') {
                toastSuccess(t('toast.CreateSuccess'));
                onUpdate();
            }
        } catch (error) {
        } finally {
            store.dispatch(change_is_loading(false));
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
                            const image = formJson.image;

                            console.log(name, image);
                            await handleAddCategory(name, image);
                            handleClose();
                        },
                    }}
                >
                    <DialogTitle>Thêm Danh Mục</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ mb: 1 }}>Form tạo danh mục mới</DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            name="name"
                            label="Tên Danh Mục"
                            type="name"
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 1 }}
                        />
                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <Avatar
                                variant="square"
                                sx={{ minWidth: 200, minHeight: 200 }}
                                src={selectImage ? URL.createObjectURL(selectImage) : undefined}
                            />
                            <label htmlFor="image" style={{ position: 'absolute', bottom: '8px', right: '8px' }}>
                                <IconButton component="span" color="primary">
                                    <UploadTwoToneIcon />
                                </IconButton>
                            </label>
                            <Input
                                required
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }} // Ẩn input file
                                onChange={(e: any) => {
                                    const file = e.target.files[0];
                                    console.log(file);
                                    if (
                                        file &&
                                        (file.type === 'image/png' ||
                                            file.type === 'image/jpeg' ||
                                            file.type === 'image/webp')
                                    ) {
                                        setSelectImage(file);
                                    } else {
                                        toastWarning('File type is not allowed');
                                    }
                                }}
                            />
                        </Box>
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
export default CreateCateDialog;
