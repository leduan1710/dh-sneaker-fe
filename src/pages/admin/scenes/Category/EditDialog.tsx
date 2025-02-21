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
    const [selectImage, setSelectImage] = useState<File | null>(null);
    const [categoryName, setCategoryName] = useState('');
    const [parentCateId, setParentCateId] = useState('');
    const [categoryLv1, setCategoryLv1] = useState('');
    const [categoryLv2, setCategoryLv2] = useState('');
    const [categoryLv3, setCategoryLv3] = useState('');
    const categoryLvl1s = categories.filter((cate) => !cate.previousId);

    // All category Level 2
    const allCategoryLvl2s = categories.filter((cate) => categoryLvl1s.some((lvl1) => lvl1.id === cate.previousId));
    // All category Level 2
    const allCategoryLvl3s = categories.filter((cate) => allCategoryLvl2s.some((lvl2) => lvl2.id === cate.previousId));
    // Category Level 2 for selection
    const categoryLvl2s = categories.filter((cate) => (categoryLv1 ? cate.previousId === categoryLv1 : false));

    // Category Level 3
    const categoryLvl3s = categories.filter((cate) => (categoryLv2 ? cate.previousId === categoryLv2 : false));
    useEffect(() => {
        if (category) {
            if (categoryLvl1s.some((cate) => cate.id === category.previousId)) {
                setCategoryLv1(category.previousId);
                setCategoryLv2(''); // Reset level 2
                setCategoryLv3(''); // Reset level 3
            } else if (allCategoryLvl2s.some((cate) => cate.id === category.previousId)) {
                const cateLv1 = allCategoryLvl2s.filter((cate) => cate.id === category.previousId)[0].previousId;
                setCategoryLv1(cateLv1);
                setCategoryLv2(category.previousId);
                setCategoryLv3(''); // Reset level 3
            } else if (allCategoryLvl3s.some((cate) => cate.id === category.previousId)) {
                const cateLv2 = allCategoryLvl3s.filter((cate) => cate.id === category.previousId)[0].previousId;
                const cateLv1 = allCategoryLvl2s.filter((cate) => cate.id === cateLv2)[0].previousId;
                setCategoryLv1(cateLv1);
                setCategoryLv2(cateLv2);
                setCategoryLv3(category.previousId);
            }
        }
    }, [category]);
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
    };

    const handleEditCategory = async (name: string, image: File, previousId: string) => {
        const formData = new FormData();
        formData.append('id', category ? category.id : '');
        formData.append('name', name);
        formData.append('previousId', parentCateId);
        if (image) {
            const uniqueFilename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const imageBlob = await fetch(URL.createObjectURL(image)).then((response) => response.blob());
            formData.append('file', imageBlob, uniqueFilename);
        }
        if (category) console.log(category.id, categoryName, parentCateId, selectImage);
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

                        console.log(name, image);
                        await handleEditCategory(name, image, parentCateId);
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
                        // onChange={(event: ChangeEvent<HTMLInputElement>) =>{setCategoryName(event.target.value)}}
                    />
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                            <Select
                                id="select-parent-cate-lvl1"
                                value={categoryLv1}
                                onChange={handleChange1}
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
                                label="ParentCateLvl2"
                                disabled={!categoryLv1}
                                displayEmpty={!categoryLv2}
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
                                label="ParentCateLvl3"
                                disabled={!categoryLv2}
                                displayEmpty={!categoryLv3}
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
                            src={
                                selectImage
                                    ? URL.createObjectURL(selectImage)
                                    : category
                                    ? category.image.startsWith('uploads')
                                        ? `${HOST_BE}/${category.image}`
                                        : category.image
                                    : undefined
                            }
                        />
                        <label htmlFor="image" style={{ position: 'absolute', bottom: '8px', right: '8px' }}>
                            <IconButton component="span" color="primary">
                                <UploadTwoToneIcon />
                            </IconButton>
                        </label>
                        <Input
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
                    <Button onClick={handleClose}>{t('action.Cancel')}</Button>
                    <Button type="submit">{t('action.Confirm')}</Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default EditCateDialog;