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

    const [parentCateId, setParentCateId] = useState('');
    const [categoryLv1, setCategoryLv1] = useState('');
    const [categoryLv2, setCategoryLv2] = useState('');
    const [categoryLv3, setCategoryLv3] = useState('');

    const categoryLvl1s = categories.filter((category) => !category.previousId);

    console.log(categories)
    // Category Level 2
    const categoryLvl2s = categories.filter((category) => (categoryLv1 ? category.previousId === categoryLv1 : false));

    // Category Level 3
    const categoryLvl3s = categories.filter((category) => (categoryLv2 ? category.previousId === categoryLv2 : false));

    const handleChange1 = (event: SelectChangeEvent) => {
        setCategoryLv1(event.target.value);
        setParentCateId(event.target.value);
        setCategoryLv2(''); // Reset category level 2 selection
        setCategoryLv3(''); // Reset category level 3 selection
    };
    const handleChange2 = (event: SelectChangeEvent) => {
        setCategoryLv2(event.target.value);
        setParentCateId(event.target.value);
        setCategoryLv3(''); // Reset category level 3 selection
    };
    const handleChange3 = (event: SelectChangeEvent) => {
        setCategoryLv3(event.target.value);
        setParentCateId(event.target.value);
    };

    const handleClose = () => {
        onClose();
        setSelectImage(null);
        setCategoryLv1('')
        setCategoryLv2(''); // Reset category level 2 selection
        setCategoryLv3('');
    };

    const handleAddCategory = async (name: string, image: File, previousId: string) => {
        store.dispatch(change_is_loading(true));
        const formData = new FormData();
        formData.append('name', name);
        formData.append('previousId', previousId);
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
                            await handleAddCategory(name, image, parentCateId);
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
                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                                <Select
                                    id="select-parent-cate-lvl1"
                                    value={categoryLv1}
                                    onChange={handleChange1}
                                    displayEmpty
                                    label="ParentCateLvl1"
                                >
                                    <MenuItem value="">
                                        <em>{t('orther.None')}</em>
                                    </MenuItem>
                                    {categoryLvl1s.map((category) => (
                                        <MenuItem value={category.id}>{category.name}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{t('category.ParentCategoryLv1')}</FormHelperText>
                            </FormControl>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                                <Select
                                    id="select-parent-cate-lvl2"
                                    value={categoryLv2}
                                    onChange={handleChange2}
                                    displayEmpty
                                    label="ParentCateLvl2"
                                    disabled={!categoryLv1}
                                >
                                    <MenuItem value="">
                                        <em>{t('orther.None')}</em>
                                    </MenuItem>
                                    {categoryLvl2s.map((category) => (
                                        <MenuItem value={category.id}>{category.name}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{t('category.ParentCategoryLv2')}</FormHelperText>
                            </FormControl>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                                <Select
                                    id="select-parent-cate-lvl3"
                                    value={categoryLv3}
                                    onChange={handleChange3}
                                    displayEmpty
                                    label="ParentCateLvl3"
                                    disabled={!categoryLv2}
                                >
                                    <MenuItem value="">
                                        <em>{t('orther.None')}</em>
                                    </MenuItem>
                                    {categoryLvl3s.map((category) => (
                                        <MenuItem value={category.id}>{category.name}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{t('category.ParentCategoryLv3')}</FormHelperText>
                            </FormControl>
                        </Stack>
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
