import React, { useEffect, useRef, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    Typography,
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
    Card,
    CardHeader,
    Divider,
    CardContent,
    Chip,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    InputLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    ListItemIcon,
    Grid,
} from '@mui/material';

import { useSelector, useStore } from 'react-redux';
import { change_is_loading } from '../../../../reducers/Actions';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { HOST_BE } from '../../../../common/Common';
import axios from 'axios';
import { toastError, toastSuccess, toastWarning } from '../../../../untils/Logic';
import { useTranslation } from 'react-i18next';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { GetApi } from '../../../../untils/Api';

const Input = styled('input')({
    display: 'none',
});

interface CreateProductDialogProps {
    onClose: () => void;
    open: boolean;
    categories: Array<any>;
    onUpdate: () => void;
}

const CreateProductDialog: React.FC<CreateProductDialogProps> = (props) => {
    const { t } = useTranslation();
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const { onClose, open, categories, onUpdate } = props;

    const [productName, setProductName] = useState('');
    const [importPrice, setImportPrice] = useState<number | string>('');
    const [ctvPrice, setCtvPrice] = useState<number | string>('');
    const [sellPrice, setSellPrice] = useState<number | string>('');
    const [virtualPrice, setVirtualPrice] = useState<number | string>('');

    const [selectImage, setSelectImage] = useState<File | null>(null);
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);

    const [typeByCategories, setTypeByCategory] = useState<any>([]);
    const [sizeByCategory, setSizeByCategory] = useState<any>([]);
    const [colorByCategory, setColorByCategory] = useState<any>([]);
    const [styleByCategory, setStyleByCategory] = useState<any>([]);

    //select
    const [categoryNameSelect, setCategoryNameSelected] = useState('');

    const [categoryIdSelect, setCategoryIdSelected] = useState('');
    const [sizeIdSelect, setSizeIdSelected] = useState('');
    const [styleIdSelect, setStyleIdSelected] = useState('');
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

    const [colorIdSelect, setColorIdSelected] = useState('');
    const [typeIdSelect, setTypeIdSelected] = useState('');

    const [selectedSizes, setSelectedSizes] = useState<{ sizeId: string; quantity: number }[]>([]);
    const [otherSizeName, setOtherSizeName] = useState('');
    const [otherColorName, setOtherColorName] = useState('');
    const [otherTypeName, setOtherTypeName] = useState('');
    const [otherStyleName, setOtherStyleName] = useState('');

    const [currentSize, setCurrentSize] = useState<string>('');
    const [currentQuantity, setCurrentQuantity] = useState<string>('');
    const [sizeError, setSizeError] = useState<string | null>(null);
    const [colorError, setColorError] = useState<string | null>(null);
    const [typeError, setTypeError] = useState<string | null>(null);
    const [styleError, setStyleError] = useState<string | null>(null);

    const [quantityError, setQuantityError] = useState<string | null>(null);

    const handleClose = () => {
        onClose();
    };
    const handleChangeSelect = (event: SelectChangeEvent, setter: React.Dispatch<React.SetStateAction<string>>) => {
        setter(event.target.value);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setUploadedImages((prevImages) => [...prevImages, ...newFiles]);
        }
    };

    const handleImageRemove = (index: number) => {
        setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleAddSize = () => {
        const quantity = parseInt(currentQuantity);
        let hasError = false;

        if (!currentSize) {
            setSizeError('Vui lòng chọn kích cỡ.');
            hasError = true;
        } else {
            setSizeError(null);
        }

        if (quantity <= 0) {
            setQuantityError('Số lượng phải lớn hơn 0.');
            hasError = true;
        } else {
            setQuantityError(null);
        }

        if (!hasError) {
            const isDuplicate = selectedSizes.some((item) => item.sizeId === currentSize);
            if (!isDuplicate) {
                setSelectedSizes((prev) => [...prev, { sizeId: currentSize, quantity }]);
                setCurrentSize('');
                setCurrentQuantity('');
            } else {
                setSizeError('Kích cỡ đã được chọn. Vui lòng chọn kích cỡ khác.');
            }
        }
    };

    const handleDeleteSize = (sizeId: string) => {
        setSelectedSizes((prev) => prev.filter((item) => item.sizeId !== sizeId));
    };

    const handleOtherSizeNameChange = (e: any) => {
        setOtherSizeName(e.target.value);
    };

    const handleQuantityChange = (sizeId: string, quantity: number) => {
        if (quantity > 0) {
            setSelectedSizes((prev) => prev.map((item) => (item.sizeId === sizeId ? { ...item, quantity } : item)));
            setQuantityError(null);
        } else {
            setQuantityError('Số lượng không được bé hơn 1.');
        }
    };
    const handleStyleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const styleId: string = event.target.value;
        setSelectedStyles((prev) => {
            if (prev.includes(styleId)) {
                return prev.filter((id) => id !== styleId);
            } else {
                return [...prev, styleId];
            }
        });
    };
    const handleAddNewSize = async () => {
        if (!otherSizeName) {
            setSizeError('Vui lòng nhập tên kích cỡ');
            return;
        }
        if (!categoryIdSelect) {
            toastWarning('Vui lòng chọn hãng sản phẩm');
            return;
        }
        try {
            const res = await axios.post(
                `${HOST_BE}/admin/add/size`,
                {
                    otherSizeName,
                    categoryIdSelect,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );

            if (res.data.message === 'Success') {
                toastSuccess('Thêm thành công');
                getSizeByCategory(categoryIdSelect);
                setCurrentSize(res.data.size.id);
                setOtherSizeName('');
            } else {
                toastError('Thêm thất bại');
            }
        } catch (error: any) {
            toastError('Thêm thất bại');
        }
    };
    const handleAddNewStyle = async () => {
        if (!otherStyleName) {
            setStyleError('Vui lòng nhập tên kiểu dáng');
            return;
        }
        if (!categoryIdSelect) {
            toastWarning('Vui lòng chọn hãng sản phẩm');
            return;
        }
        try {
            const res = await axios.post(
                `${HOST_BE}/admin/add/style`,
                {
                    otherStyleName,
                    categoryIdSelect,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );

            if (res.data.message === 'Success') {
                toastSuccess('Thêm thành công');
                getStyleByCategory(categoryIdSelect);
                setSelectedStyles((prevStyles) =>
                    prevStyles.map((style) => (style === 'other' ? res.data.style.id : style)),
                );
                setOtherSizeName('');
            } else {
                toastError('Thêm thất bại');
            }
        } catch (error: any) {
            toastError('Thêm thất bại');
        }
    };
    const handleAddNewColor = async () => {
        if (!otherColorName) {
            setColorError('Vui lòng nhập tên màu sắc');
            return;
        }
        if (!categoryIdSelect) {
            toastWarning('Vui lòng chọn hãng sản phẩm');
            return;
        }
        try {
            const res = await axios.post(
                `${HOST_BE}/admin/add/color`,
                {
                    otherColorName,
                    categoryIdSelect,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );

            if (res.data.message === 'Success') {
                toastSuccess('Thêm thành công');
                getColorByCategory(categoryIdSelect);
                setColorIdSelected(res.data.color.id);
                setOtherColorName('');
            } else {
                toastError('Thêm thất bại');
            }
        } catch (error: any) {
            toastError('Thêm thất bại');
        }
    };
    const handleAddNewType = async () => {
        if (!otherTypeName) {
            setTypeError('Vui lòng nhập tên loại');
            return;
        }
        if (!categoryIdSelect) {
            toastWarning('Vui lòng chọn hãng sản phẩm');
            return;
        }
        try {
            const res = await axios.post(
                `${HOST_BE}/admin/add/type`,
                {
                    otherTypeName,
                    categoryIdSelect,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );

            if (res.data.message === 'Success') {
                toastSuccess('Thêm thành công');
                getTypeByCategory(categoryIdSelect);
                setTypeIdSelected(res.data.type.id);
                setOtherTypeName('');
            } else {
                toastError('Thêm thất bại');
            }
        } catch (error: any) {
            toastError('Thêm thất bại');
        }
    };
    const handleCreateProduct = async () => {
        store.dispatch(change_is_loading(true));
        const formData = new FormData();
        formData.append('name', productName);
        formData.append('sellPrice', sellPrice.toString());
        formData.append('virtualPrice', virtualPrice.toString());
        formData.append('ctvPrice', ctvPrice.toString());
        formData.append('importPrice', importPrice.toString());

        formData.append('categoryId', categoryIdSelect);
        formData.append('sizeId', sizeIdSelect);
        formData.append('styleIds', JSON.stringify(selectedStyles));
        formData.append('selectedSizes', JSON.stringify(selectedSizes));

        formData.append('colorId', colorIdSelect);
        formData.append('typeId', typeIdSelect);

        // Upload images
        const images = uploadedImages || [];
        for (const image of images) {
            const uniqueFilename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const imageBlob = await fetch(URL.createObjectURL(image)).then((response) => response.blob());
            formData.append('files', imageBlob, uniqueFilename);
        }
        try {
            const res = await axios.post(`${HOST_BE}/admin/add/product`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.data.message === 'Success') {
                toastSuccess(t('toast.CreateSuccess'));
                onUpdate();
                store.dispatch(change_is_loading(false));
            } else {
                store.dispatch(change_is_loading(false));
            }
        } catch (error) {
            console.error('Failed to add product:', error);
            store.dispatch(change_is_loading(false));
        } finally {
            handleClose();
        }
    };

    const resetFields = () => {
        setSelectImage(null);
        setUploadedImages([]);
        setCategoryIdSelected('');
        setCategoryNameSelected('');
        setSizeIdSelected('');
        setCurrentQuantity('');
        setStyleIdSelected('');
        setColorIdSelected('');
        setTypeIdSelected('');
        setVirtualPrice('');
        setImportPrice('');
        setCtvPrice('');
        setSellPrice('');
        setProductName('');
        setSelectedSizes([]);
        setSelectedStyles([]);
        setSizeByCategory([]);
        setColorByCategory([]);
        setTypeByCategory([]);
        setStyleByCategory([]);
        setTypeError('');
        setColorError('');
        setSizeError('');
        setStyleError('');
    };
    const getColorByCategory = async (categoryId: string) => {
        try {
            const resColor = await GetApi(`/api/color-by-category/${categoryId}`, null);
            if (resColor.data.message == 'Success') {
                setColorByCategory(resColor.data.colors);
            }
        } catch (error) {
            console.error('Error', error);
        }
    };
    const getStyleByCategory = async (categoryId: string) => {
        try {
            const resStyles = await GetApi(`/api/style-by-category/${categoryId}`, null);
            if (resStyles.data.message == 'Success') {
                setStyleByCategory(resStyles.data.styles);
            }
        } catch (error) {
            console.error('Error', error);
        }
    };
    const getTypeByCategory = async (categoryId: string) => {
        try {
            const resTypes = await GetApi(`/api/type-by-category/${categoryId}`, null);
            if (resTypes.data.message == 'Success') {
                setTypeByCategory(resTypes.data.types);
            }
        } catch (error) {
            console.error('Error', error);
        }
    };
    const getSizeByCategory = async (categoryId: string) => {
        try {
            const resTypes = await GetApi(`/api/size-by-category/${categoryId}`, null);
            if (resTypes.data.message == 'Success') {
                setSizeByCategory(resTypes.data.sizes);
            }
        } catch (error) {
            console.error('Error', error);
        }
    };

    useEffect(() => {
        if (categoryIdSelect) {
            getSizeByCategory(categoryIdSelect);
            getStyleByCategory(categoryIdSelect);
            getColorByCategory(categoryIdSelect);
            getTypeByCategory(categoryIdSelect);
        }
    }, [categoryIdSelect]);

    useEffect(() => {
        if (!open) {
            resetFields();
        }
    }, [open]);
    console.log(selectedStyles);
    return (
        <React.Fragment>
            <Dialog onClose={handleClose} open={open}>
                <Dialog
                    maxWidth="md"
                    fullWidth={true}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);

                            if (currentSize === 'other' && !otherSizeName) {
                                setSizeError('Vui lòng nhập tên kích cỡ');
                                return;
                            }
                            if (uploadedImages.length < 1) {
                                toastWarning('Cần thêm ít nhất 1 ảnh');
                                return;
                            }
                            if (selectedSizes.length < 1) {
                                toastWarning('Vui lòng thêm kích cỡ và số lượng');
                                return;
                            }
                            if (!(importPrice && sellPrice && ctvPrice)) {
                                toastWarning('Giá nhập, giá ctv, giá bán chưa đầy đủ');
                                return;
                            }
                            if (!colorIdSelect) {
                                toastWarning('Chưa chọn màu');
                                return;
                            }
                            await handleCreateProduct();
                        },
                    }}
                >
                    <DialogTitle>Tạo sản phẩm mới</DialogTitle>
                    <DialogContent>
                        <Box>
                            <React.Fragment>
                                <Card>
                                    <CardHeader title={'Thông tin sản phẩm'}></CardHeader>
                                    <Divider />
                                    <CardContent>
                                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                            <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                                                <InputLabel id="select-category-label">Chọn hãng</InputLabel>
                                                <Select
                                                    id="select-parent-cate-lvl1"
                                                    label="Chọn hãng"
                                                    value={categoryIdSelect}
                                                    onChange={(e) => {
                                                        const selectedCategory = categories.find(
                                                            (category) => category.id === e.target.value,
                                                        );
                                                        if (selectedCategory) {
                                                            setCategoryNameSelected(selectedCategory.name);
                                                        }
                                                        handleChangeSelect(e, setCategoryIdSelected);
                                                    }}
                                                    required
                                                >
                                                    {categories.map((category) => (
                                                        <MenuItem value={category.id}>{category.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <TextField
                                                required
                                                margin="dense"
                                                id="name"
                                                name="name"
                                                label={'Tên sản phẩm'}
                                                fullWidth
                                                variant="outlined"
                                                sx={{ mb: 1 }}
                                                value={productName}
                                                onChange={(e) => {
                                                    setProductName(e.target.value);
                                                }}
                                            />
                                        </Stack>
                                        <Typography variant="h5">{t('product.Image')}</Typography>
                                        <Stack direction="row" spacing={2} sx={{ mb: 2, mt: 2 }}>
                                            {uploadedImages.map((file, index) => (
                                                <Box key={index} sx={{ position: 'relative' }}>
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`uploaded-${index}`}
                                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                    />
                                                    <IconButton
                                                        onClick={() => handleImageRemove(index)}
                                                        sx={{ position: 'absolute', top: 0, right: 0 }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                            <label htmlFor="upload-button">
                                                <input
                                                    accept="image/*"
                                                    id="upload-button"
                                                    type="file"
                                                    multiple
                                                    onChange={handleImageUpload}
                                                    style={{ display: 'none' }}
                                                />
                                                <IconButton
                                                    component="span"
                                                    sx={{ width: '100px', height: '100px', border: '1px dashed grey' }}
                                                >
                                                    <AddPhotoAlternateIcon fontSize="large" />
                                                </IconButton>
                                            </label>
                                        </Stack>
                                        <Stack spacing={2} sx={{ mb: 0 }}>
                                            <Typography variant="h5">Chọn kích cỡ và số lượng</Typography>
                                            <Stack direction="row" spacing={2}>
                                                <FormControl error={!!sizeError} sx={{ width: '223px' }}>
                                                    <InputLabel id="select-size-label">Chọn kích cỡ</InputLabel>
                                                    <Select
                                                        label="Chọn kích cỡ"
                                                        id="select-size"
                                                        value={currentSize}
                                                        onChange={(e) => setCurrentSize(e.target.value)}
                                                    >
                                                        {sizeByCategory
                                                            .filter(
                                                                (size: any) =>
                                                                    !selectedSizes.some(
                                                                        (item) => item.sizeId === size.id,
                                                                    ),
                                                            )
                                                            .map((size: any) => (
                                                                <MenuItem key={size.id} value={size.id}>
                                                                    {size.name}
                                                                </MenuItem>
                                                            ))}
                                                        {categoryNameSelect && <MenuItem value="other">Khác</MenuItem>}
                                                    </Select>
                                                    {sizeError && <FormHelperText>{sizeError}</FormHelperText>}
                                                </FormControl>
                                                {currentSize === 'other' && (
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            marginTop: '10px',
                                                        }}
                                                    >
                                                        <TextField
                                                            label="Nhập tên kích cỡ mới"
                                                            value={otherSizeName}
                                                            onChange={handleOtherSizeNameChange}
                                                            error={!!sizeError}
                                                            helperText={sizeError}
                                                            sx={{ width: '150px', marginRight: '10px' }}
                                                        />
                                                        <Button variant="contained" onClick={handleAddNewSize}>
                                                            Thêm
                                                        </Button>
                                                    </Box>
                                                )}
                                                <FormControl error={!!quantityError} sx={{ width: '100px' }}>
                                                    <TextField
                                                        type="number"
                                                        value={currentQuantity}
                                                        onChange={(e) => setCurrentQuantity(e.target.value)}
                                                        label="Số lượng"
                                                        inputProps={{ min: 1 }}
                                                    />
                                                    {quantityError && <FormHelperText>{quantityError}</FormHelperText>}
                                                </FormControl>
                                                <IconButton color="primary" onClick={handleAddSize}>
                                                    <AddIcon />
                                                </IconButton>
                                            </Stack>
                                            <Stack spacing={1}>
                                                {selectedSizes.map((item) => (
                                                    <Stack
                                                        key={item.sizeId}
                                                        direction="row"
                                                        spacing={1}
                                                        alignItems="center"
                                                        sx={{
                                                            border: '1px solid #ccc',
                                                            padding: '8px',
                                                            borderRadius: '4px',
                                                            width: 400,
                                                        }}
                                                    >
                                                        <Typography sx={{ flexGrow: 1, width: 100 }}>
                                                            Kích cỡ:{' '}
                                                            <strong>
                                                                {
                                                                    sizeByCategory.find(
                                                                        (size: any) => size.id === item.sizeId,
                                                                    )?.name
                                                                }
                                                            </strong>
                                                        </Typography>
                                                        <Typography sx={{ flexGrow: 1 }}>Số lượng:</Typography>
                                                        <TextField
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) =>
                                                                handleQuantityChange(
                                                                    item.sizeId,
                                                                    parseInt(e.target.value),
                                                                )
                                                            }
                                                            inputProps={{ min: 1 }} // Ràng buộc số lượng phải lớn hơn 0
                                                            required
                                                            sx={{ width: '100px' }} // Điều chỉnh chiều rộng
                                                        />
                                                        <IconButton
                                                            color="secondary"
                                                            onClick={() => handleDeleteSize(item.sizeId)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Stack>
                                                ))}
                                            </Stack>
                                        </Stack>
                                        <Typography variant="h5" sx={{ mt: 1 }}>
                                            Nhập giá cho sản phẩm
                                        </Typography>

                                        <Stack spacing={1} direction="row" sx={{ mb: 1, mt: 2 }}>
                                            <TextField
                                                label="Giá ảo"
                                                type="number"
                                                value={virtualPrice}
                                                onChange={(e) => setVirtualPrice(e.target.value)}
                                                InputProps={{ inputProps: { min: 0 } }} // Ràng buộc giá không âm
                                            />
                                            <TextField
                                                label="Giá nhập"
                                                type="number"
                                                value={importPrice}
                                                onChange={(e) => setImportPrice(e.target.value)}
                                                InputProps={{ inputProps: { min: 0 } }} // Ràng buộc giá nhập không âm
                                            />
                                            <TextField
                                                label="Giá CTV"
                                                type="number"
                                                value={ctvPrice}
                                                onChange={(e) => setCtvPrice(e.target.value)}
                                                InputProps={{ inputProps: { min: 0 } }} // Ràng buộc giá không âm
                                            />
                                            <TextField
                                                label="Giá bán"
                                                type="number"
                                                value={sellPrice}
                                                onChange={(e) => setSellPrice(e.target.value)}
                                                InputProps={{ inputProps: { min: 0 } }} // Ràng buộc giá không âm
                                            />
                                        </Stack>
                                        {categoryNameSelect === 'Crocs' && (
                                            <>
                                                <FormControl component="fieldset" sx={{ mt: 1 }}>
                                                    <Typography variant="h5">Chọn kiểu dáng cho sản phẩm</Typography>
                                                    <FormGroup>
                                                        {styleByCategory.map((style: any) => (
                                                            <FormControlLabel
                                                                key={style.id}
                                                                control={
                                                                    <Checkbox
                                                                        value={style.id}
                                                                        checked={selectedStyles.includes(style.id)}
                                                                        onChange={handleStyleChange}
                                                                    />
                                                                }
                                                                label={style.name}
                                                            />
                                                        ))}
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    value={'other'}
                                                                    checked={selectedStyles.includes('other')}
                                                                    onChange={(e) => {
                                                                        const isChecked = e.target.checked;
                                                                        if (isChecked) {
                                                                            setOtherStyleName('');
                                                                            handleStyleChange(e);
                                                                        }
                                                                    }}
                                                                />
                                                            }
                                                            label="Khác"
                                                        />
                                                    </FormGroup>
                                                </FormControl>
                                                {selectedStyles.includes('other') && (
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            mt: 1,
                                                        }}
                                                    >
                                                        <TextField
                                                            label="Nhập tên kiểu dáng mới"
                                                            value={otherStyleName}
                                                            onChange={(e) => setOtherStyleName(e.target.value)}
                                                            sx={{ width: '150px', marginRight: '10px' }}
                                                        />
                                                        <Button variant="contained" onClick={handleAddNewStyle}>
                                                            Thêm
                                                        </Button>
                                                    </Box>
                                                )}
                                            </>
                                        )}
                                        <Typography variant="h5">Chọn màu sắc</Typography>

                                        <Stack direction="row" spacing={1} sx={{ mb: 1, mt: 1 }}>
                                            <FormControl variant="outlined" sx={{ m: 1, minWidth: 150 }}>
                                                <Select
                                                    id="select-origin"
                                                    value={colorIdSelect}
                                                    onChange={(e) => handleChangeSelect(e, setColorIdSelected)}
                                                    displayEmpty
                                                    required
                                                >
                                                    {colorByCategory.map((color: any) => (
                                                        <MenuItem value={color.id} key={color.id}>
                                                            <Grid container alignItems="center">
                                                                <Grid item>
                                                                    <Box
                                                                        sx={{
                                                                            width: 20,
                                                                            height: 20,
                                                                            borderRadius: '50%',
                                                                            backgroundColor: color.colorCode,
                                                                            marginRight: 1,
                                                                        }}
                                                                    />
                                                                </Grid>
                                                                <Grid item>{color.name}</Grid>
                                                            </Grid>
                                                        </MenuItem>
                                                    ))}
                                                    <MenuItem value="other">
                                                        <Grid container alignItems="center">
                                                            <Grid item>
                                                                <Box
                                                                    sx={{
                                                                        width: 20,
                                                                        height: 20,
                                                                        borderRadius: '50%',
                                                                        backgroundColor: '#fff',
                                                                        marginRight: 1,
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item>Khác</Grid>
                                                        </Grid>
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                            {colorIdSelect === 'other' && (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <TextField
                                                        label="Nhập tên màu sắc mới"
                                                        value={otherColorName}
                                                        onChange={(e) => setOtherColorName(e.target.value)}
                                                        error={!!colorError}
                                                        helperText={colorError}
                                                        sx={{ width: '150px', marginRight: '10px' }}
                                                    />
                                                    <Button variant="contained" onClick={handleAddNewColor}>
                                                        Thêm
                                                    </Button>
                                                </Box>
                                            )}
                                        </Stack>
                                        {categoryNameSelect === 'Crocs' || categoryNameSelect === 'Jibbitz' ? (
                                            <>
                                                <Typography variant="h5">Chọn loại</Typography>
                                                <Stack direction="row" spacing={1} sx={{ mb: 1, mt: 1 }}>
                                                    <FormControl variant="outlined" sx={{ m: 1, minWidth: 180 }}>
                                                        <Select
                                                            id="select-type"
                                                            value={typeIdSelect}
                                                            onChange={(e) => handleChangeSelect(e, setTypeIdSelected)}
                                                            displayEmpty
                                                        >
                                                            {typeByCategories.map((type: any) => (
                                                                <MenuItem value={type.id} key={type.id}>
                                                                    {type.name}
                                                                </MenuItem>
                                                            ))}
                                                            <MenuItem value="other">
                                                                <em>Khác</em>
                                                            </MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Stack>
                                                {typeIdSelect === 'other' && (
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <TextField
                                                            label="Nhập tên loại mới"
                                                            value={otherTypeName}
                                                            onChange={(e) => setOtherTypeName(e.target.value)}
                                                            error={!!typeError}
                                                            helperText={typeError}
                                                            sx={{ width: '150px', marginRight: '10px' }}
                                                        />
                                                        <Button variant="contained" onClick={handleAddNewType}>
                                                            Thêm
                                                        </Button>
                                                    </Box>
                                                )}
                                            </>
                                        ) : null}
                                    </CardContent>
                                </Card>
                            </React.Fragment>
                        </Box>
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
export default CreateProductDialog;
