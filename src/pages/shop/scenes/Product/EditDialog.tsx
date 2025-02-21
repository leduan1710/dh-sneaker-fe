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
} from '@mui/material';

import { useSelector, useStore } from 'react-redux';
import { change_is_loading } from '../../../../reducers/Actions';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { HOST_BE } from '../../../../common/Common';
import axios from 'axios';
import { toastSuccess, toastWarning } from '../../../../untils/Logic';
import { useTranslation } from 'react-i18next';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { ProductDetail, ProductModel } from '../../../../models/product';
import { GetApi } from '../../../../untils/Api';
import ReactQuill from 'react-quill';
import QuillNoSSRWrapper, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const Input = styled('input')({
    display: 'none',
});

interface EditProductDialogProps {
    onClose: () => void;
    open: boolean;
    categories: Array<any>;
    materials: Array<any>;
    styles: Array<any>;
    origins: Array<any>;
    brands: Array<any>;
    onUpdate: () => void;
    product?: ProductModel;
}

const EditProductDialog: React.FC<EditProductDialogProps> = (props) => {
    const { t } = useTranslation();
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const { onClose, open, categories, materials, styles, origins, brands, onUpdate, product } = props;

    const [productEdit, setProductEdit] = useState<ProductModel | undefined>(product);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productDescribe, setProductDescribe] = useState('');
    const [productImage, setProductImage] = useState('');
    const [selectImage, setSelectImage] = useState<File | null>(null);
    const reactQuillRef = useRef<ReactQuill>(null);
    const modules = {
        toolbar: {
            container: [
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ size: [] }],
                [{ font: [] }],
                ['image', 'video'],
                ['clean'],
            ],
        },
        clipboard: {
            matchVisual: false,
        },
    };

    const formats = [
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'image',
        'video',
    ];
    //select
    const [categoryIdSelect, setCategoryIdSelected] = useState('');
    const [materialIdSelect, setMaterialIdSelected] = useState('');
    const [styleIdSelect, setStyleIdSelected] = useState('');
    const [originIdSelect, setOriginIdSelected] = useState('');
    const [brandIdSelect, setBrandIdSelected] = useState('');
    //option
    const [colorInput, setColorInput] = useState<string>('');
    const [colors, setColors] = useState<string[]>([]);
    const [sizeInput, setSizeInput] = useState<string>('');
    const [sizes, setSizes] = useState<string[]>([]);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [prices, setPrices] = useState<{ [key: string]: number }>({});
    const [uploadedImages, setUploadedImages] = useState<{ [key: string]: string[] }>({});
    const [productDetailIds, setProductDetailIds] = useState<{ [key: string]: string }>({});

    const [uploadImages, setUploadImages] = useState<{ [key: string]: File[] }>({});

    const getDataProductDetail = async () => {
        if (product) {
            store.dispatch(change_is_loading(true));
            const resProductDetails = await GetApi(
                `/shop/get/productDetail-by-productId/${product.id}`,
                localStorage.getItem('token'),
            );
            if (resProductDetails.data.message == 'Success') {
                const initialQuantities: { [key: string]: number } = {};
                const initialPrices: { [key: string]: number } = {};
                const initialUploadedImages: { [key: string]: string[] } = {};
                const initialProductDetailIds: { [key: string]: string } = {};

                resProductDetails.data.productDetails.forEach((detail: ProductDetail) => {
                    const key = `${detail.option1}-${detail.option2}`;
                    initialQuantities[key] = detail.quantity;
                    initialPrices[key] = detail.price;
                    initialUploadedImages[key] = detail.images; // Khởi tạo mảng hình ảnh rỗng cho mỗi key
                    initialProductDetailIds[key] = detail.id;
                });

                setQuantities(initialQuantities);
                setPrices(initialPrices);
                setUploadedImages(initialUploadedImages);
                setProductDetailIds(initialProductDetailIds);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    const initFields = () => {
        if (product) {
            setProductEdit(product);
            setProductName(product.name);
            setProductDescribe(product.describe);
            setProductPrice(product.price);
            setProductImage(product.image);
            setCategoryIdSelected(product.categoryId);
            setMaterialIdSelected(product.materialId);
            setStyleIdSelected(product.styleId);
            setOriginIdSelected(product.originId);
            setBrandIdSelected(product.brandId);
            setColors(product.options['color']);
            setSizes(product.options['size']);
        }
    };

    useEffect(() => {
        setQuantities({});
        setPrices({});
        setUploadedImages({});
        setUploadImages({});
        setProductDetailIds({});
        getDataProductDetail();
        initFields();
    }, [product]);

    const handleClose = () => {
        onClose();
    };
    const categoryList = categories.filter((category) => !(category.categoryIdClIST.length > 0));
    const handleChangeSelect = (event: SelectChangeEvent, setter: React.Dispatch<React.SetStateAction<string>>) => {
        setter(event.target.value);
    };

    const handleEditProduct = async () => {
        handleClose();
        store.dispatch(change_is_loading(true));
        const formData = new FormData();
        const productId = product?.id || '';
        formData.append('id', productId);
        formData.append('name', productName);
        formData.append('price', productPrice.toString());
        formData.append('describe', productDescribe);
        formData.append('categoryId', categoryIdSelect);
        formData.append('materialId', materialIdSelect);
        formData.append('styleId', styleIdSelect);
        formData.append('originId', originIdSelect);
        formData.append('brandId', brandIdSelect);
        formData.append('shopId', user.shopId);
        formData.append('options', JSON.stringify({ sizes, colors }));

        if (selectImage) {
            const uniqueFilename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const imageBlob = await fetch(URL.createObjectURL(selectImage)).then((response) => response.blob());
            formData.append('file', imageBlob, uniqueFilename);
        }
        try {
            const res = await axios.post(`${HOST_BE}/shop/update/product`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.data.message === 'Success') {
                await handleEditProductDetail(res.data.product.id);
                toastSuccess(t('toast.EditSuccess'));
            }
        } catch (error) {
            console.error('Failed to add product:', error);
        } finally {
            store.dispatch(change_is_loading(false));
        }
        store.dispatch(change_is_loading(false));
    };
    const handleEditProductDetail = async (productId: string) => {
        store.dispatch(change_is_loading(true));
        const combinations = createCombinations();
        console.log(combinations);
        console.log(prices);
        console.log(quantities);

        combinations.forEach(async (combo) => {
            const formData = new FormData();
            formData.append('name', productName);
            formData.append('price', prices[`${combo.size}-${combo.color}`]?.toString() || productPrice.toString());
            formData.append('quantity', quantities[`${combo.size}-${combo.color}`]?.toString() || '0');
            formData.append('productId', productId);
            formData.append('option1', combo.size);
            formData.append('option2', combo.color);

            const existingImages = uploadedImages[`${combo.size}-${combo.color}`];

            if (existingImages)
                existingImages.forEach((image) => {
                    formData.append('images[]', image); // Thêm hình ảnh cũ vào formData
                });
            // Upload new images
            const images = uploadImages[`${combo.size}-${combo.color}`] || [];

            console.log(uploadedImages);
            console.log(uploadImages);
            console.log(combo.size, combo.color);
            console.log(existingImages, images);
            for (const image of images) {
                const uniqueFilename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const imageBlob = await fetch(URL.createObjectURL(image)).then((response) => response.blob());
                formData.append('files', imageBlob, uniqueFilename);
            }
            console.log('id:', productDetailIds[`${combo.size}-${combo.color}`]);
            if (productDetailIds[`${combo.size}-${combo.color}`]) {
                formData.append('id', productDetailIds[`${combo.size}-${combo.color}`]);
                try {
                    const res = await axios.post(`${HOST_BE}/shop/update/productDetail`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });

                    if (res.data.message === 'Success') {
                        onUpdate();
                    }
                } catch (error) {
                    console.error('Failed to add product detail:', error);
                }
            } else {
                try {
                    const res = await axios.post(`${HOST_BE}/shop/add/productDetail`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });

                    if (res.data.message === 'Success') {
                        onUpdate();
                    }
                } catch (error) {
                    console.error('Failed to add product detail:', error);
                }
            }
        });
        store.dispatch(change_is_loading(false));
    };

    //Add options
    const handleAddColor = () => {
        if (colorInput.trim()) {
            setColors([...colors, colorInput]);
            setColorInput('');
        }
    };

    const handleRemoveColor = (index: number) => {
        const newColors = colors.filter((_, i) => i !== index);
        setColors(newColors);
    };

    const handleAddSize = () => {
        if (sizeInput.trim()) {
            setSizes([...sizes, sizeInput]);
            setSizeInput('');
        }
    };

    const handleRemoveSize = (index: number) => {
        const newSizes = sizes.filter((_, i) => i !== index);
        setSizes(newSizes);
    };

    const createCombinations = (): { size: string; color: string }[] => {
        const combinations: { size: string; color: string }[] = [];
        sizes.forEach((size) => {
            colors.forEach((color) => {
                combinations.push({ size, color });
            });
        });
        return combinations;
    };
    const handleUploadImages = (size: string, color: string, files: FileList | null) => {
        if (files) {
            const uniqueKey = `${size}-${color}`;
            const newImages = Array.from(files);
            setUploadImages((prev) => ({
                ...prev,
                [uniqueKey]: [...(prev[uniqueKey] || []), ...newImages],
            }));
        }
    };
    const handleRemoveImage = (size: string, color: string, imgIndex: number) => {
        const key = `${size}-${color}`;
        setUploadedImages((prev) => {
            const updatedImages = [...(prev[key] || [])];
            updatedImages.splice(imgIndex, 1);
            return {
                ...prev,
                [key]: updatedImages,
            };
        });
    };
    const handleRemoveUpdateImage = (size: string, color: string, imgIndex: number) => {
        const key = `${size}-${color}`;
        setUploadImages((prev) => {
            const updatedImages = [...(prev[key] || [])];
            updatedImages.splice(imgIndex, 1);
            return {
                ...prev,
                [key]: updatedImages,
            };
        });
    };
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
                            const formJson = Object.fromEntries((formData as any).entries());

                            if (colors.length === 0 || sizes.length === 0) {
                                toastWarning(t('toast.NeedAtleastOneColorOneSize'));
                                return;
                            } else {
                                await handleEditProduct();
                            }
                        },
                    }}
                >
                    <DialogTitle>{t('product.ShopManagement.EditProduct')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ mb: 1 }}>
                            {t('product.ShopManagement.FormEditProduct')}
                        </DialogContentText>
                        <Box>
                            <React.Fragment>
                                <Card>
                                    <CardHeader title={t('product.ShopManagement.EditProduct')}></CardHeader>
                                    <Divider />
                                    <CardContent>
                                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                            <TextField
                                                autoFocus
                                                required
                                                margin="dense"
                                                id="name"
                                                name="name"
                                                label={t('product.Name')}
                                                fullWidth
                                                variant="outlined"
                                                sx={{ mb: 1 }}
                                                defaultValue={product?.name}
                                                onChange={(e) => {
                                                    setProductName(e.target.value);
                                                }}
                                            />
                                            <TextField
                                                error={!(productPrice >= 0)}
                                                helperText={productPrice < 0 ? t('product.NonNegativePrice') : ''}
                                                required
                                                margin="dense"
                                                id="price"
                                                name="price"
                                                label={t('product.Price')}
                                                type="number"
                                                fullWidth
                                                variant="outlined"
                                                sx={{ mb: 1, maxWidth: 150 }}
                                                defaultValue={product?.price}
                                                onChange={(e) => {
                                                    setProductPrice(Number(e.target.value));
                                                }}
                                            />
                                        </Stack>
                                        <QuillNoSSRWrapper
                                            ref={reactQuillRef}
                                            style={{ maxHeight: 400, height: 400 }}
                                            theme="snow"
                                            defaultValue={product?.describe}
                                            onChange={(value) => {
                                                setProductDescribe(value);
                                            }}
                                            modules={modules}
                                            formats={formats}
                                        />
                                        <Stack direction="row" spacing={1} sx={{ mb: 1, mt: 5 }}>
                                            <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                                                <FormHelperText>
                                                    {t('product.ShopManagement.CategorySelect')}
                                                </FormHelperText>
                                                <Select
                                                    id="select-category"
                                                    value={categoryIdSelect}
                                                    onChange={(e) => handleChangeSelect(e, setCategoryIdSelected)}
                                                    displayEmpty
                                                    required
                                                >
                                                    <MenuItem value="">
                                                        <em>{t('orther.None')}</em>
                                                    </MenuItem>
                                                    {categoryList.map((category) => (
                                                        <MenuItem value={category.id}>{category.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl variant="outlined" sx={{ m: 1, minWidth: 150 }}>
                                                <FormHelperText>
                                                    {t('product.ShopManagement.MaterialSelect')}
                                                </FormHelperText>
                                                <Select
                                                    id="select-material"
                                                    value={materialIdSelect}
                                                    onChange={(e) => handleChangeSelect(e, setMaterialIdSelected)}
                                                    displayEmpty
                                                    required
                                                >
                                                    <MenuItem value="">
                                                        <em>{t('orther.None')}</em>
                                                    </MenuItem>
                                                    {materials.map((material) => (
                                                        <MenuItem value={material.id}>{material.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl variant="outlined" sx={{ m: 1, minWidth: 150 }}>
                                                <FormHelperText>
                                                    {t('product.ShopManagement.StyleSelect')}
                                                </FormHelperText>
                                                <Select
                                                    id="select-style"
                                                    value={styleIdSelect}
                                                    onChange={(e) => handleChangeSelect(e, setStyleIdSelected)}
                                                    displayEmpty
                                                    required
                                                >
                                                    <MenuItem value="">
                                                        <em>{t('orther.None')}</em>
                                                    </MenuItem>
                                                    {styles.map((style) => (
                                                        <MenuItem value={style.id}>{style.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl variant="outlined" sx={{ m: 1, minWidth: 150 }}>
                                                <FormHelperText>
                                                    {t('product.ShopManagement.OriginSelect')}
                                                </FormHelperText>
                                                <Select
                                                    id="select-origin"
                                                    value={originIdSelect}
                                                    onChange={(e) => handleChangeSelect(e, setOriginIdSelected)}
                                                    displayEmpty
                                                    required
                                                >
                                                    <MenuItem value="">
                                                        <em>{t('orther.None')}</em>
                                                    </MenuItem>
                                                    {origins.map((origin) => (
                                                        <MenuItem value={origin.id}>{origin.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl variant="outlined" sx={{ m: 1, minWidth: 180 }}>
                                                <FormHelperText>
                                                    {t('product.ShopManagement.BrandSelect')}
                                                </FormHelperText>
                                                <Select
                                                    id="select-brand"
                                                    value={brandIdSelect}
                                                    onChange={(e) => handleChangeSelect(e, setBrandIdSelected)}
                                                    displayEmpty
                                                    required
                                                >
                                                    <MenuItem value="">
                                                        <em>{t('orther.None')}</em>
                                                    </MenuItem>
                                                    {brands.map((brand) => (
                                                        <MenuItem value={brand.id}>{brand.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Stack>
                                        <Divider sx={{ mb: 1, mt: 1 }} />
                                        {/* Thêm tùy chọn màu sắc */}
                                        <Typography variant="h6">{t('product.Color')}</Typography>
                                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                            <TextField
                                                margin="dense"
                                                label={t('product.EnterColor')}
                                                variant="outlined"
                                                value={colorInput}
                                                onChange={(e) => setColorInput(e.target.value)}
                                                fullWidth
                                            />
                                            <IconButton color="primary" onClick={handleAddColor}>
                                                <AddRoundedIcon></AddRoundedIcon>
                                            </IconButton>
                                        </Stack>

                                        {/* Hiển thị danh sách màu sắc đã thêm */}
                                        <Typography variant="subtitle1">{t('product.ColorList')}:</Typography>
                                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                            {colors.map((color, index) => (
                                                <Chip
                                                    key={index}
                                                    label={color}
                                                    onDelete={() => handleRemoveColor(index)}
                                                    sx={{ margin: '2px' }}
                                                />
                                            ))}
                                        </Stack>
                                        <Divider sx={{ mb: 1, mt: 1 }} />
                                        {/* Thêm tùy chọn kích thước */}
                                        <Typography variant="h6">{t('product.Size')}</Typography>
                                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                            <TextField
                                                margin="dense"
                                                label={t('product.EnterSize')}
                                                variant="outlined"
                                                value={sizeInput}
                                                onChange={(e) => setSizeInput(e.target.value)}
                                                fullWidth
                                            />
                                            <IconButton color="primary" onClick={handleAddSize}>
                                                <AddRoundedIcon></AddRoundedIcon>
                                            </IconButton>
                                        </Stack>

                                        {/* Hiển thị danh sách kích thước đã thêm */}
                                        <Typography variant="subtitle1">{t('product.SizeList')}:</Typography>
                                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                            {sizes.map((size, index) => (
                                                <Chip
                                                    key={index}
                                                    label={size}
                                                    onDelete={() => handleRemoveSize(index)}
                                                    sx={{ margin: '2px' }}
                                                />
                                            ))}
                                        </Stack>
                                        <Divider sx={{ mb: 1, mt: 1 }} />
                                        <Typography variant="h6">{t('product.Image')}</Typography>
                                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                            {selectImage ? (
                                                <Avatar
                                                    variant="square"
                                                    sx={{ minWidth: 200, minHeight: 200 }}
                                                    src={selectImage ? URL.createObjectURL(selectImage) : undefined}
                                                />
                                            ) : (
                                                <Avatar
                                                    variant="square"
                                                    sx={{ minWidth: 200, minHeight: 200 }}
                                                    src={
                                                        product?.image
                                                            ? product.image.startsWith('uploads')
                                                                ? `${HOST_BE}/${product?.image}`
                                                                : product?.image
                                                            : undefined
                                                    }
                                                />
                                            )}
                                            <label
                                                htmlFor="image"
                                                style={{ position: 'absolute', bottom: '8px', right: '8px' }}
                                            >
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
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader title={t('product.ProductOptionList')}></CardHeader>
                                    <Divider />
                                    <CardContent>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Màu sắc</TableCell>
                                                        <TableCell>Kích thước</TableCell>
                                                        <TableCell>Giá</TableCell>
                                                        <TableCell>Số lượng</TableCell>
                                                        <TableCell>Tải lên Ảnh</TableCell>
                                                        <TableCell>Ảnh đã tải lên</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {createCombinations().map((combo, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{combo.color}</TableCell>
                                                            <TableCell>{combo.size}</TableCell>
                                                            <TableCell>
                                                                <TextField
                                                                    type="number"
                                                                    value={
                                                                        prices[`${combo.size}-${combo.color}`] ||
                                                                        productPrice
                                                                    }
                                                                    onChange={(e) =>
                                                                        setPrices({
                                                                            ...prices,
                                                                            [`${combo.size}-${combo.color}`]: Number(
                                                                                e.target.value,
                                                                            ),
                                                                        })
                                                                    }
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <TextField
                                                                    type="number"
                                                                    value={
                                                                        quantities[`${combo.size}-${combo.color}`] || 0
                                                                    }
                                                                    onChange={(e) =>
                                                                        setQuantities({
                                                                            ...quantities,
                                                                            [`${combo.size}-${combo.color}`]: Number(
                                                                                e.target.value,
                                                                            ),
                                                                        })
                                                                    }
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    style={{ display: 'none' }}
                                                                    id={`upload-${combo.size}-${combo.color}`}
                                                                    onChange={(e) =>
                                                                        handleUploadImages(
                                                                            combo.size,
                                                                            combo.color,
                                                                            e.target.files,
                                                                        )
                                                                    }
                                                                />
                                                                <label htmlFor={`upload-${combo.size}-${combo.color}`}>
                                                                    <IconButton component="span" color="primary">
                                                                        <UploadTwoToneIcon />
                                                                    </IconButton>
                                                                </label>
                                                            </TableCell>
                                                            <TableCell>
                                                                {uploadedImages[`${combo.size}-${combo.color}`]?.map(
                                                                    (image, imgIndex) => (
                                                                        <div
                                                                            key={imgIndex}
                                                                            style={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                            }}
                                                                        >
                                                                            <img
                                                                                src={
                                                                                    image?.startsWith('uploads')
                                                                                        ? `${HOST_BE}/${image}`
                                                                                        : image
                                                                                }
                                                                                alt={`img-${imgIndex}`}
                                                                                style={{
                                                                                    width: '50px',
                                                                                    height: '50px',
                                                                                    marginRight: '10px',
                                                                                }}
                                                                            />
                                                                            <IconButton
                                                                                onClick={() =>
                                                                                    handleRemoveImage(
                                                                                        combo.size,
                                                                                        combo.color,
                                                                                        imgIndex,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <CloseIcon />
                                                                            </IconButton>
                                                                        </div>
                                                                    ),
                                                                )}
                                                                {uploadImages[`${combo.size}-${combo.color}`]?.map(
                                                                    (image, imgIndex) => (
                                                                        <div
                                                                            key={imgIndex}
                                                                            style={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                            }}
                                                                        >
                                                                            <img
                                                                                src={URL.createObjectURL(image)}
                                                                                alt={`img-${imgIndex}`}
                                                                                style={{
                                                                                    width: '50px',
                                                                                    height: '50px',
                                                                                    marginRight: '10px',
                                                                                }}
                                                                            />
                                                                            <IconButton
                                                                                onClick={() =>
                                                                                    handleRemoveUpdateImage(
                                                                                        combo.size,
                                                                                        combo.color,
                                                                                        imgIndex,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <CloseIcon />
                                                                            </IconButton>
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
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
export default EditProductDialog;
