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

interface DetailDialogProps {
    onClose: () => void;
    open: boolean;
    categories: Array<any>;
    category?: CategoryModel;
}

const DetailDialog: React.FC<DetailDialogProps> = (props) => {
    const { t } = useTranslation();
    const store = useStore();
    const { onClose, open, categories, category } = props;
    const [selectImage, setSelectImage] = useState<File | null>(null);
    const [categoryName, setCategoryName] = useState('');
    const [parentCateId, setParentCateId] = useState('');

    const handleClose = () => {
        onClose();
        setSelectImage(null);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <Dialog
                maxWidth="md"
                open={open}
                onClose={handleClose}
            >
                <DialogTitle sx={{ textTransform: 'capitalize'}}>{t('category.Admin.DetailCategory')}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 1 }}>{t('category.Detail')}
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        id="name"
                        name="name"
                        label={t('category.CategoryName')}
                        type="name"
                        fullWidth
                        value={category ? category.name : ''}
                        inputProps={{ readOnly: true }}
                        variant="outlined"
                        sx={{ mb: 1 }}
                        // onChange={(event: ChangeEvent<HTMLInputElement>) =>{setCategoryName(event.target.value)}}
                    />
                
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('action.Close')}</Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default DetailDialog;