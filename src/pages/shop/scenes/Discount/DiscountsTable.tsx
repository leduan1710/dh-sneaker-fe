import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useTranslation } from 'react-i18next';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { change_is_loading } from '../../../../reducers/Actions';
import { GetApi, PostApi } from '../../../../untils/Api';
import { ProductDetail, ProductModel } from '../../../../models/product';
import { HOST_BE } from '../../../../common/Common';
import {
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Tooltip,
    useTheme,
    Input,
    LinearProgress,
} from '@mui/material';
import { filterSpecialInput, formatPrice, shortedString } from '../../../../untils/Logic';
import TablePagination from '@mui/material/TablePagination';
import { useLocation } from 'react-router-dom';
import EditDiscountDialog from './EditDialog';
import { Discount } from '../../../../models/discount';
import DeleteDialog from './DeleteDialog';
import { formatDistanceToNow } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import SearchIcon from '@mui/icons-material/Search';

interface RowProps {
    product: ProductModel;
    productDetails: ProductDetail[];
    onUpdate: () => void;
    discounts: Discount[];
}

function Row(props: RowProps) {
    const theme = useTheme();
    const { t } = useTranslation();
    const { product, productDetails, onUpdate, discounts } = props;
    const [productDetail, setProductDetail] = useState<any>();
    const [discount, setDiscount] = useState<any>();

    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEditDialog] = useState(false);
    const [applyAll, setApplyAll] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const discountPercentMap = new Map(discounts.map((discount) => [discount.id, discount.percent]));
    const handleOpenEditDialog = () => {
        setOpenEditDialog(true);
    };
    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setDiscount(null);
        setProductDetail(null);
        setApplyAll(false);
    };
    const handleOpenDeleteDialog = () => {
        setOpenDelete(true);
    };
    const handleCloseDeleteDialog = () => {
        setOpenDelete(false);
        setDiscount(null);
        setProductDetail(null);
    };
    const handleUpdate = () => {
        onUpdate();
    };

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>{product.percentDiscountTop * 100}</TableCell>
                <TableCell>
                    <Avatar
                        variant="rounded"
                        src={product.image.startsWith('uploads') ? `${HOST_BE}/${product.image}` : product.image}
                        alt={product.name}
                        sx={{
                            width: 80,
                            height: 80,
                            border: '4px solid transparent',
                            borderRadius: 1,
                            background: 'linear-gradient(white, white), linear-gradient(to right, #3f51b5, #000)',
                            backgroundClip: 'content-box, border-box',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        }}
                    />
                </TableCell>
                <TableCell>
                    <Tooltip title={t('action.ApplyAll')} arrow>
                        <IconButton
                            sx={{
                                '&:hover': {
                                    background: theme.colors.primary.lighter,
                                },
                                color: theme.palette.primary.main,
                            }}
                            color="inherit"
                            size="small"
                            onClick={() => {
                                handleOpenEditDialog();
                                setApplyAll(true);
                            }}
                        >
                            <EditNoteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('action.DeleteAll')} arrow>
                        <IconButton
                            sx={{
                                '&:hover': { background: theme.colors.error.lighter },
                                color: theme.palette.error.main,
                            }}
                            color="inherit"
                            size="small"
                            onClick={() => {
                                handleOpenDeleteDialog();
                                setApplyAll(true);
                            }}
                        >
                            <DeleteTwoToneIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, padding: 2, bgcolor: '#f9f9f9', borderRadius: '4px' }}>
                            <Typography variant="h6" gutterBottom component="div">
                                {t('product.ProductDetail')}
                            </Typography>
                            {productDetails.length > 0 ? (
                                <Table size="small" aria-label="product details">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{t('product.Id')}</TableCell>
                                            <TableCell>{t('product.Name')}</TableCell>
                                            <TableCell>{t('product.Size')}</TableCell>
                                            <TableCell>{t('product.Color')}</TableCell>
                                            <TableCell>{t('product.PercentDisCount')}</TableCell>
                                            <TableCell>{t('action.Actions')}</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {productDetails.map((detail) => {
                                            const discountPercent = discountPercentMap.get(detail.discountId) || null;
                                            return (
                                                <TableRow key={detail.id}>
                                                    <TableCell>{detail.id}</TableCell>
                                                    <TableCell>{detail?.name}</TableCell>
                                                    <TableCell>{detail?.option1}</TableCell>
                                                    <TableCell>{detail?.option2}</TableCell>
                                                    <TableCell>
                                                        {discountPercent ? discountPercent * 100 + ' %' : '0'}{' '}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Tooltip title={t('action.Edit')} arrow>
                                                            <IconButton
                                                                sx={{
                                                                    '&:hover': {
                                                                        background: theme.colors.primary.lighter,
                                                                    },
                                                                    color: theme.palette.primary.main,
                                                                }}
                                                                color="inherit"
                                                                size="small"
                                                                onClick={() => {
                                                                    handleOpenEditDialog();
                                                                    setProductDetail(detail);
                                                                    if (detail.discountId)
                                                                        setDiscount(
                                                                            discounts.find(
                                                                                (ds) => ds.id === detail.discountId,
                                                                            ),
                                                                        );
                                                                }}
                                                            >
                                                                <EditTwoToneIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title={t('action.Delete')} arrow>
                                                            <IconButton
                                                                sx={{
                                                                    '&:hover': {
                                                                        background: theme.colors.error.lighter,
                                                                    },
                                                                    color: theme.palette.error.main,
                                                                }}
                                                                color="inherit"
                                                                size="small"
                                                                onClick={() => {
                                                                    handleOpenDeleteDialog();
                                                                    setProductDetail(detail);
                                                                    if (detail.discountId)
                                                                        setDiscount(
                                                                            discounts.find(
                                                                                (ds) => ds.id === detail.discountId,
                                                                            ),
                                                                        );
                                                                }}
                                                            >
                                                                <DeleteTwoToneIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            ) : (
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress />
                                </Box>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <EditDiscountDialog
                open={openEdit}
                onClose={handleCloseEditDialog}
                productDetail={productDetail}
                discount={discount}
                product={product}
                all={applyAll}
                onUpdate={onUpdate}
            />
            <DeleteDialog
                onClose={handleCloseDeleteDialog}
                onUpdate={onUpdate}
                open={openDelete}
                discountId={discount?.id}
                product={(applyAll && product) || undefined}
                productDetailId={productDetail?.id}
            />
        </React.Fragment>
    );
}

export default function DiscountsTable() {
    const { t } = useTranslation();
    const store = useStore();
    const location = useLocation();
    const { status } = location.state ? location.state : 'all';
    const user = useSelector((state: ReducerProps) => state.user);
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [openEdit, setOpenEditDialog] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const handleOpenEditDialog = () => {
        setOpenEditDialog(true);
    };
    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };
    const handleOpenDeleteDialog = () => {
        setOpenDelete(true);
    };
    const handleCloseDeleteDialog = () => {
        setOpenDelete(false);
    };

    const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);

    // Pagination state
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [statusFilter, setStatusFilter] = useState<boolean>(true);

    const getDataProduct = async () => {
        if (user.shopId) {
            if (filterId.length == 24) {
                store.dispatch(change_is_loading(true));
                const res = await GetApi(`/shop/get/product/${filterId}`, localStorage.getItem('token'));

                if (res.data.message == 'Success') {
                    setProducts(res.data.product);
                    await getProductDetail(res.data.product);
                    setPage(0);
                }
                store.dispatch(change_is_loading(false));
            } else {
                store.dispatch(change_is_loading(true));
                const resProducts = await GetApi(
                    `/shop/get/product-by-shop/${user.shopId}`,
                    localStorage.getItem('token'),
                );
                if (resProducts.data.message === 'Success') {
                    setProducts(resProducts.data.products);
                    await getProductDetail(resProducts.data.products);
                }
                store.dispatch(change_is_loading(false));
            }
        }
    };

    const getDataDiscount = async () => {
        if (user.shopId) {
            store.dispatch(change_is_loading(true));
            const resDiscounts = await GetApi(
                `/shop/get/discount-by-shop/${user.shopId}`,
                localStorage.getItem('token'),
            );
            if (resDiscounts.data.message === 'Success') {
                setDiscounts(resDiscounts.data.discounts);
            }
            store.dispatch(change_is_loading(false));
        }
    };

    const getProductDetail = async (products: ProductModel[]) => {
        const productIdList: string[] = [];
        const productDetailIdList: string[] = [];

        // Collecting all product
        for (const product of products) {
            productIdList.push(product.id);
            productDetailIdList.push(...product.productCIdList);
        }
        const res = await PostApi(`/shop/post/productDetail-many`, localStorage.getItem('token'), {
            productDetailIdList: productDetailIdList,
        });
        setProductDetails(res.data.productDetails);
    };

    const getData = async () => {
        getDataProduct();
        getDataDiscount();
    };
    useEffect(() => {
        if (user) {
            getData();
        }
    }, [user]);

    useEffect(() => {
        if (status) {
            setStatusFilter(status);
            setPage(0);
            location.state = null;
        }
    }, [status]);
    const handlePageChange = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setStatusFilter(false);
        setPage(0);
    };

    const filteredProduct =
        statusFilter === true ? products : products.filter((product) => product.active === statusFilter);

    const paginatedProducts = filteredProduct.slice(page * limit, page * limit + limit);
    // filter Id
    const [filterId, setFilterId] = useState<string>('');
    const typingTimeoutRef = useRef<any>(null);
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }
    const filterById = async (id: string) => {
        if (id != '') {
            store.dispatch(change_is_loading(true));
            const res = await GetApi(`/shop/get/product/${id}`, localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setProducts(res.data.product);
                await getProductDetail(res.data.product);
                setPage(0);
            }
            store.dispatch(change_is_loading(false));
        } else {
            store.dispatch(change_is_loading(true));
            const resProducts = await GetApi(`/shop/get/product-by-shop/${user.shopId}`, localStorage.getItem('token'));
            if (resProducts.data.message === 'Success') {
                setProducts(resProducts.data.products);
                await getProductDetail(resProducts.data.products);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    useEffect(() => {
        typingTimeoutRef.current = setTimeout(() => {
            filterById(filterId);
        }, 500);
    }, [filterId]);
    return (
        <>
            <TableContainer className="relative" component={Paper}>
                <div className="absolute top-2 right-5">
                    <Input
                        value={filterId}
                        className="border border-gray-300 rounded-lg p-1"
                        style={{ display: 'block', width: 300 }}
                        placeholder={t('action.EnterID')}
                        onChange={(e) => {
                            filterSpecialInput(e.target.value, setFilterId);
                        }}
                    />
                </div>
                <div className="absolute top-3 right-6">
                    <SearchIcon />
                </div>
                <Box sx={{ padding: 2, maxWidth: 200 }}></Box>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>{t('product.Id')}</TableCell>
                            <TableCell>{t('product.Name')}</TableCell>
                            <TableCell>{t('product.Price')}</TableCell>
                            <TableCell>{t('product.PercentDisCountTop')}</TableCell>
                            <TableCell>{t('product.Image')}</TableCell>
                            <TableCell align="right">{t('action.Actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedProducts.map((product) => {
                            const productDetailsOfProduct = productDetails.filter(
                                (ptd) => ptd.productId === product.id,
                            );
                            return (
                                <Row
                                    key={product.id}
                                    product={product}
                                    productDetails={productDetailsOfProduct}
                                    discounts={discounts}
                                    onUpdate={getData}
                                />
                            );
                        })}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredProduct.length}
                    rowsPerPage={limit}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                />
            </TableContainer>
        </>
    );
}
