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

import { HOST_BE } from '../../../../common/Common';
import { useTranslation } from 'react-i18next';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { ProductDetail, ProductModel } from '../../../../models/product';
import { GetApi } from '../../../../untils/Api';
import ReactQuill from 'react-quill';
import QuillNoSSRWrapper, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface DetailProductDialogProps {
    onClose: () => void;
    open: boolean;
    categories: Array<any>;
    materials: Array<any>;
    styles: Array<any>;
    origins: Array<any>;
    brands: Array<any>;
    product?: ProductModel;
}

const DetailProductDialog: React.FC<DetailProductDialogProps> = (props) => {
    const { t } = useTranslation();
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const { onClose, open, categories, materials, styles, origins, brands, product } = props;

    const [productEdit, setProductEdit] = useState<ProductModel | undefined>(product);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productDescribe, setProductDescribe] = useState('');
    const [productImage, setProductImage] = useState('');
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
    const [colorInput, setColorInput] = useState<string>(''); // Trường nhập màu sắc
    const [colors, setColors] = useState<string[]>([]); // Danh sách màu sắc
    const [sizeInput, setSizeInput] = useState<string>(''); // Trường nhập kích thước
    const [sizes, setSizes] = useState<string[]>([]); // Danh sách kích thước
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [prices, setPrices] = useState<{ [key: string]: number }>({});
    const [uploadedImages, setUploadedImages] = useState<{ [key: string]: string[] }>({});

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

    // Reset fields when the dialog opens
    useEffect(() => {
        setQuantities({});
        setPrices({});
        setUploadedImages({});
        getDataProductDetail();
        initFields();
    }, [product]);

    const handleClose = () => {
        onClose();
    };
    const categoryList = categories.filter((category) => !(category.categoryIdClIST.length > 0));
    //product select handle
    const handleChangeSelect = (event: SelectChangeEvent, setter: React.Dispatch<React.SetStateAction<string>>) => {
        setter(event.target.value);
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
    return (
        <React.Fragment>
            <Dialog onClose={handleClose} open={open}>
                <Dialog maxWidth="md" fullWidth={true} open={open} onClose={handleClose}>
                    <DialogTitle>{t('product.ShopManagement.ViewProductDetail')}</DialogTitle>
                    <DialogContent>
                        <Box>
                            <React.Fragment>
                                <Card>
                                    <CardHeader title={t('product.ShopManagement.ProductDetail')}></CardHeader>
                                    <Divider />
                                    <CardContent>
                                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                            <TextField
                                                margin="dense"
                                                id="name"
                                                name="name"
                                                label={t('product.Name')}
                                                fullWidth
                                                variant="outlined"
                                                sx={{ mb: 1 }}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                value={product?.name}
                                            />
                                            <TextField
                                                margin="dense"
                                                id="price"
                                                name="price"
                                                label={t('product.Price')}
                                                type="number"
                                                fullWidth
                                                variant="outlined"
                                                sx={{ mb: 1, maxWidth: 150 }}
                                                value={product?.price}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                        </Stack>
                                        <QuillNoSSRWrapper
                                            ref={reactQuillRef}
                                            style={{ maxHeight: 400, height: 400 }}
                                            theme="snow"
                                            defaultValue={product?.describe}
                                            modules={modules}
                                            formats={formats}
                                            readOnly={true}
                                        />
                                        <Stack direction="row" spacing={1} sx={{ mb: 1, mt: 5 }}>
                                            <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                                                <FormHelperText>{t('product.Category')}</FormHelperText>
                                                <Select id="select-category" value={categoryIdSelect}>
                                                    <MenuItem value="">
                                                        <em>{t('orther.None')}</em>
                                                    </MenuItem>
                                                    {categoryList.map((category) => (
                                                        <MenuItem value={category.id}>{category.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl variant="outlined" sx={{ m: 1, minWidth: 150 }}>
                                                <FormHelperText>{t('product.Material')}</FormHelperText>
                                                <Select id="select-material" value={materialIdSelect}>
                                                    <MenuItem value="">
                                                        <em>{t('orther.None')}</em>
                                                    </MenuItem>
                                                    {materials.map((material) => (
                                                        <MenuItem value={material.id}>{material.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl variant="outlined" sx={{ m: 1, minWidth: 150 }}>
                                                <FormHelperText>{t('product.Styles')}</FormHelperText>
                                                <Select id="select-style" value={styleIdSelect} required>
                                                    <MenuItem value="">
                                                        <em>{t('orther.None')}</em>
                                                    </MenuItem>
                                                    {styles.map((style) => (
                                                        <MenuItem value={style.id}>{style.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl variant="outlined" sx={{ m: 1, minWidth: 150 }}>
                                                <FormHelperText>{t('product.Origin')}</FormHelperText>
                                                <Select id="select-origin" value={originIdSelect}>
                                                    <MenuItem value="">
                                                        <em>{t('orther.None')}</em>
                                                    </MenuItem>
                                                    {origins.map((origin) => (
                                                        <MenuItem value={origin.id}>{origin.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl variant="outlined" sx={{ m: 1, minWidth: 180 }}>
                                                <FormHelperText>{t('product.Brand')}</FormHelperText>
                                                <Select id="select-brand" value={brandIdSelect}>
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

                                        <Typography variant="subtitle1">{t('product.ColorList')}</Typography>
                                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                            {colors.map((color, index) => (
                                                <Chip key={index} label={color} sx={{ margin: '2px' }} />
                                            ))}
                                        </Stack>
                                        <Divider sx={{ mb: 1, mt: 1 }} />

                                        <Typography variant="subtitle1">{t('product.SizeList')}</Typography>
                                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                            {sizes.map((size, index) => (
                                                <Chip key={index} label={size} sx={{ margin: '2px' }} />
                                            ))}
                                        </Stack>
                                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
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
                                        </Box>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>{t('product.Color')}</TableCell>
                                                        <TableCell>{t('product.Size')}</TableCell>
                                                        <TableCell>{t('product.Price')}</TableCell>
                                                        <TableCell>{t('product.QuantityProduct')}</TableCell>
                                                        <TableCell>{t('product.Image')}</TableCell>
                                                        <TableCell></TableCell>
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
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <TextField
                                                                    type="number"
                                                                    value={
                                                                        quantities[`${combo.size}-${combo.color}`] || 0
                                                                    }
                                                                />
                                                            </TableCell>

                                                            <TableCell>
                                                                <Stack
                                                                    direction="row"
                                                                    spacing={1}
                                                                    sx={{ flexWrap: 'wrap' }}
                                                                >
                                                                    {uploadedImages[
                                                                        `${combo.size}-${combo.color}`
                                                                    ]?.map((image, imgIndex) => (
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
                                                                        </div>
                                                                    ))}
                                                                </Stack>
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
                        <Button onClick={handleClose}>{t('action.Close')}</Button>
                    </DialogActions>
                </Dialog>
            </Dialog>
        </React.Fragment>
    );
};
export default DetailProductDialog;
