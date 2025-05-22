import React, { FC, ChangeEvent, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
    Tooltip,
    Divider,
    Box,
    Card,
    Checkbox,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableContainer,
    Typography,
    useTheme,
    CardHeader,
    Avatar,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    styled,
    DialogActions,
    TextField,
    InputAdornment,
} from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import SwitchAccessShortcutAddIcon from '@mui/icons-material/SwitchAccessShortcutAdd';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import AddIcon from '@mui/icons-material/Add';
import { HOST_BE } from '../../../../common/Common';
import { filterSpecialInput, formatPrice, shortedString, toastError, toastSuccess } from '../../../../untils/Logic';
import { change_is_loading } from '../../../../reducers/Actions';
import axios from 'axios';
import { useSelector, useStore } from 'react-redux';
import { GetApi, PostApi } from '../../../../untils/Api';
import EditCateDialog from './EditDialog';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import DetailDialog from './DetailDialog';
import { useTranslation } from 'react-i18next';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import EditProductDialog from './EditDialog2';
import DetailProductDialog from './DetailDialog';
import SearchIcon from '@mui/icons-material/Search';
import CreateProductDialog from './CreateDialog';

const Input = styled('input')({
    display: 'none',
});

interface AlertDeleteDialogProps {
    onClose: () => void;
    open: boolean;
    productId?: string;
    onUpdate: () => void;
}

const AlertDeleteDialog: React.FC<AlertDeleteDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, productId, onUpdate } = props;

    const handleClose = () => {
        onClose();
    };
    const handleDelete = async () => {
        try {
            const res = await PostApi(`/shop/delete/product/${productId}`, localStorage.getItem('token'), {});

            if (res.data.message === 'Success') {
                toastSuccess(t('toast.DeleteSuccess'));
                onUpdate();
            } else toastError(t('toast.DeleteFail'));
        } catch (error) {
            console.error('Failed to delete :', error);
        }
        onClose();
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
            >
                <DialogTitle sx={{ textTransform: 'capitalize' }} id="dialog-title">
                    {t('product.ShopManagement.DeleteProduct')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        {t('product.ShopManagement.ConfirmToDeleteProduct')} ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('action.Cancel')}</Button>
                    <Button onClick={handleDelete} autoFocus>
                        {t('action.Confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

interface ProductsTableProps {
    className?: string;
    initialProducts: any[];
    categories: Array<any>;
    sizes: Array<any>;
    styles: Array<any>;
    colors: Array<any>;
    types: Array<any>;
}

const applyPagination = (products: any[], page: number, limit: number): any[] => {
    return products.slice(page * limit, page * limit + limit);
};

const ProductsTable: FC<ProductsTableProps> = ({ initialProducts, categories, sizes, styles, colors, types }) => {
    const { t } = useTranslation();
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const [openCreate, setOpenCreate] = useState(false);

    const [openDetail, setOpenDetail] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const isLoading = useSelector((state: ReducerProps) => state.isLoading);
    const [products, setProducts] = useState<any[]>(initialProducts);
    const [selectedProduct, setSelectedProduct] = useState<any>();
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };

    const paginatedProducts = applyPagination(products, page, limit);
    const theme = useTheme();

    const handleClickOpenCreate = () => {
        setOpenCreate(true);
    };
    const handleCloseCreate = () => {
        setOpenCreate(false);
    };
    const handleClickOpenDetailDialog = () => {
        setOpenDetail(true);
    };
    const handleCloseDetailDialog = () => {
        setSelectedProduct(undefined);
        setOpenDetail(false);
    };
    const handleClickOpenEditDialog = () => {
        setOpenEdit(true);
    };
    const handleCloseEditDialog = () => {
        setSelectedProduct(undefined);
        setOpenEdit(false);
    };
    const handleClickOpenDeleteDialog = () => {
        setOpenDelete(true);
    };
    const handleCloseDeleteDialog = () => {
        setSelectedProduct(undefined);
        setOpenDelete(false);
    };

    const getDataProduct = async () => {
        if (user.shopId) {
            if (name != '') {
                store.dispatch(change_is_loading(true));
                const res = await PostApi(`/shop/get/product-by-name`, localStorage.getItem('token'), { name: name });

                if (res.data.message == 'Success') {
                    setProducts(res.data.products);
                    setPage(0);
                }
                store.dispatch(change_is_loading(false));
            } else {
                store.dispatch(change_is_loading(true));
                const resProducts = await GetApi(
                    `/shop/get/product-by-shop/${user.shopId}`,
                    localStorage.getItem('token'),
                );
                if (resProducts.data.message == 'Success') {
                    setProducts(resProducts.data.products);
                }
                store.dispatch(change_is_loading(false));
            }
        }
    };

    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);
    // filter Id
    const [name, setFilterId] = useState<string>('');
    const typingTimeoutRef = useRef<any>(null);
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }
    const filterById = async (name: string) => {
        if (name != '') {
            store.dispatch(change_is_loading(true));
            const res = await PostApi(`/shop/get/product-by-name`, localStorage.getItem('token'), { name: name });

            if (res.data.message == 'Success') {
                setProducts(res.data.products);
                setPage(0);
            }
            store.dispatch(change_is_loading(false));
        } else {
            store.dispatch(change_is_loading(true));
            const resProducts = await GetApi(`/shop/get/product-by-shop/${user.shopId}`, localStorage.getItem('token'));
            if (resProducts.data.message == 'Success') {
                setProducts(resProducts.data.products);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    useEffect(() => {
        typingTimeoutRef.current = setTimeout(() => {
            filterById(name);
        }, 500);
    }, [name]);
    return (
        <Card className="relative">
            <CardHeader
                sx={{ textTransform: 'capitalize' }}
                action={<Box width={150}></Box>}
                title={t('product.ShopManagement.ProductList')}
            />

            <div className="absolute top-2 right-5 flex items-center">
                <TextField
                    value={name}
                    variant="outlined"
                    className="border-gray-300"
                    style={{
                        width: 280, // Kích thước chiều rộng
                        borderRadius: '30px', // Độ tròn hơn
                        padding: '0 10px', // Thêm padding
                    }}
                    placeholder={t('action.EnterID')}
                    onChange={(e) => {
                        filterSpecialInput(e.target.value, setFilterId);
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        sx: {
                            height: '35px', // Chiều cao của thanh tìm kiếm
                        },
                    }}
                />
                <IconButton
                    sx={{
                        backgroundColor: '#fff9c4', // Màu vàng nhạt
                        borderRadius: '50%',
                        width: 36,
                        height: 36,
                        marginLeft: 1,
                        '&:hover': {
                            backgroundColor: '#fff59d', // Màu vàng nhạt khi hover
                        },
                    }}
                    onClick={() => {
                        /* Thêm hành động cho biểu tượng Tune */
                    }}
                >
                    <TuneIcon fontSize="small" />
                </IconButton>
                {/* <IconButton
                    sx={{
                        backgroundColor: '#fff9c4',
                        borderRadius: '50%',
                        width: 36,
                        height: 36,
                        marginLeft: 1,
                        '&:hover': {
                            backgroundColor: '#fff59d',
                        },
                    }}
                    onClick={() => {
                    }}
                >
                    <SwapVertIcon fontSize="small" />
                </IconButton> */}
                <IconButton
                    sx={{
                        backgroundColor: '#fff9c4',
                        borderRadius: '50%',
                        width: 36,
                        height: 36,
                        marginLeft: 1,
                        '&:hover': {
                            backgroundColor: '#fff59d',
                        },
                    }}
                    onClick={handleClickOpenCreate}
                >
                    <AddIcon fontSize="small" />
                </IconButton>
                <CreateProductDialog
                    open={openCreate}
                    onClose={handleCloseCreate}
                    categories={categories}
                    styles={styles}
                    colors={colors}
                    types={types}
                    sizes={sizes}
                    onUpdate={getDataProduct}
                />
            </div>
            <Divider />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>{t('product.Name')}</TableCell>
                            <TableCell>Giá nhập</TableCell>
                            <TableCell>Giá bán</TableCell>
                            <TableCell>Giá CTV</TableCell>

                            <TableCell>{t('product.Image')}</TableCell>
                            <TableCell align="center">{t('product.Status')}</TableCell>
                            <TableCell align="right">{t('action.Actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedProducts.map((product) => {
                            return (
                                <TableRow hover key={product.id}>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            style={{
                                                maxWidth: '120px',
                                                whiteSpace: 'normal',
                                                overflowWrap: 'break-word',
                                            }}
                                        >
                                            {product.id}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            style={{
                                                maxWidth: '250px',
                                                whiteSpace: 'normal',
                                                overflowWrap: 'break-word',
                                            }}
                                        >
                                            {shortedString(product.name, 40)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {formatPrice(product.importPrice)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {formatPrice(product.sellPrice)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {formatPrice(product.ctvPrice)}
                                        </Typography>
                                    </TableCell>


                                    <TableCell>
                                        <Avatar
                                            variant="square"
                                            alt=""
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                border: '4px solid transparent',
                                                borderRadius: 1,
                                                background:
                                                    'linear-gradient(white, white), linear-gradient(to right, #3f51b5, #000)',
                                                backgroundClip: 'content-box, border-box',
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                            }}
                                            src={
                                                product.imageList
                                                    ? product.imageList[0].startsWith('uploads')
                                                        ? `${HOST_BE}/${product.imageList[0]}`
                                                        : product.imageList[0]
                                                    : product.imageList[0]
                                            }
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {product.active ? (
                                                <CheckIcon color="success" fontSize="small" />
                                            ) : (
                                                <ClearIcon color="error" fontSize="small" />
                                            )}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title={t('action.Detail')} arrow>
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
                                                    handleClickOpenDetailDialog();
                                                    setSelectedProduct(product);
                                                }}
                                            >
                                                <InfoOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

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
                                                    handleClickOpenEditDialog();
                                                    setSelectedProduct(product);
                                                }}
                                            >
                                                <EditTwoToneIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('action.Delete')} arrow>
                                            <IconButton
                                                sx={{
                                                    '&:hover': { background: theme.colors.error.lighter },
                                                    color: theme.palette.error.main,
                                                }}
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                    handleClickOpenDeleteDialog();
                                                    setSelectedProduct(product);
                                                }}
                                            >
                                                <NotInterestedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <DetailProductDialog
                open={openDetail}
                onClose={handleCloseDetailDialog}
                categories={categories}
                styles={styles}
                colors={colors}
                types={types}
                sizes={sizes}
                product={selectedProduct}
            />
            <EditProductDialog
                open={openEdit}
                onClose={handleCloseEditDialog}
                categories={categories}
                styles={styles}
                colors={colors}
                types={types}
                sizes={sizes}
                product={selectedProduct}
                onUpdate={getDataProduct}
            />
            <AlertDeleteDialog
                open={openDelete}
                onClose={handleCloseDeleteDialog}
                productId={selectedProduct?.id}
                onUpdate={getDataProduct}
            />
            <Box p={2}>
                <TablePagination
                    component="div"
                    count={products.length}
                    labelRowsPerPage="Số sản phẩm mỗi trang"
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[5, 10, 25, 30]}
                />
            </Box>
        </Card>
    );
};

ProductsTable.propTypes = {
    initialProducts: PropTypes.array.isRequired,
};

ProductsTable.defaultProps = {
    initialProducts: [],
};

export default ProductsTable;
