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
import NoCrashIcon from '@mui/icons-material/NoCrash';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { change_is_loading } from '../../../../reducers/Actions';
import { GetApi, PostApi } from '../../../../untils/Api';
import { OrderDetail, OrderModel } from '../../../../models/order';
import { ProductDetail } from '../../../../models/product';
import { HOST_BE } from '../../../../common/Common';
import * as XLSX from 'xlsx';
import {
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Tooltip,
    useTheme,
    CircularProgress,
    Input,
    Button,
} from '@mui/material';
import { filterSpecialInput, formatPrice, shortedString } from '../../../../untils/Logic';
import TablePagination from '@mui/material/TablePagination';
import StatusUpdateDialog from './StatusUpdateDialog';
import AddressDialog from './AddressDialog';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

interface RowProps {
    order: OrderModel;
    orderDetails: OrderDetail[];
    productDetails: ProductDetail[];
    onUpdateOrder: () => void;
}

function Row(props: RowProps) {
    const theme = useTheme();
    const { t } = useTranslation();
    const { order, orderDetails, productDetails, onUpdateOrder } = props;
    const [open, setOpen] = useState(false);
    const [openUpdateStatus, setOpenUpdateStatus] = useState(false);
    const [openAddressDialog, setOpenAddressDialog] = useState(false);

    const handleClickOpenUpdateStatusDialog = () => {
        setOpenUpdateStatus(true);
    };
    const handleCloseUpdateStatusDialog = () => {
        setOpenUpdateStatus(false);
    };
    const handleClickOpenAddressDialog = () => {
        setOpenAddressDialog(true);
    };
    const handleCloseAddressDialog = () => {
        setOpenAddressDialog(false);
    };
    const handleUpdateOrderList = () => {
        onUpdateOrder();
    };

    const total =
        orderDetails.reduce((sum, detail) => {
            return sum + (detail.price - detail.discountPrice) * detail.quantity;
        }, 0) +
        order.priceShip -
        order.priceMember -
        order.priceVoucher;

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PROCESSING':
                return { backgroundColor: '#2196F3', color: 'white' };
            case 'CONFIRMED':
                return { backgroundColor: '#009999', color: 'white' };
            case 'DELIVERING':
                return { backgroundColor: '#FFEB3B', color: 'black' };
            case 'PROCESSED':
                return { backgroundColor: '#4CAF50', color: 'white' };
            case 'CANCEL':
                return { backgroundColor: '#F44336', color: 'white' };

            default:
                return {};
        }
    };

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                    {productDetails.length > 0
                        ? productDetails.map((detail, index) => <div key={index}>{shortedString(detail.name, 40)}</div>)
                        : ''}
                </TableCell>
                <TableCell>
                    <Box
                        sx={{
                            ...getStatusStyle(order.status),
                            padding: '4px 8px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            width: 150
                        }}
                    >
                        {t(`order.${order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}`)}
                    </Box>
                </TableCell>
                <TableCell>
                    <IconButton>
                        {order.paid ? <CheckIcon sx={{ color: 'green' }} /> : <CloseIcon sx={{ color: 'red' }} />}
                    </IconButton>
                </TableCell>
                <TableCell>{formatPrice(total)}</TableCell>
                <TableCell align="right">
                    {order.status === 'DELIVERING' ? (
                        <Tooltip title={t('order.Processed')} arrow>
                            <IconButton
                                sx={{
                                    '&:hover': { background: theme.colors.success.lighter },
                                    color: theme.palette.success.main,
                                }}
                                color="inherit"
                                size="small"
                                onClick={handleClickOpenUpdateStatusDialog}
                            >
                                <NoCrashIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ) : order.status === 'PROCESSING' ? (
                        <Tooltip title={t('order.ConfirmAction')} arrow>
                            <IconButton
                                sx={{
                                    '&:hover': {
                                        background: theme.colors.primary.lighter,
                                    },
                                    color: theme.palette.primary.main,
                                }}
                                color="inherit"
                                size="small"
                                onClick={handleClickOpenUpdateStatusDialog}
                            >
                                <CheckCircleIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ) : order.status === 'CONFIRMED' ? (
                        <Tooltip title={t('order.Delivering')} arrow>
                            <IconButton
                                sx={{
                                    '&:hover': {
                                        background: theme.colors.primary.lighter,
                                    },
                                    color: theme.palette.primary.main,
                                }}
                                color="inherit"
                                size="small"
                                onClick={handleClickOpenUpdateStatusDialog}
                            >
                                <TimeToLeaveIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ) : null}
                    <Tooltip title={t('order.DeliveryAddress')} arrow>
                        <IconButton
                            sx={{
                                '&:hover': {
                                    background: theme.colors.primary.lighter,
                                },
                                color: theme.palette.primary.main,
                            }}
                            color="inherit"
                            size="small"
                            onClick={handleClickOpenAddressDialog}
                        >
                            <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, padding: 2, bgcolor: '#f9f9f9', borderRadius: '4px' }}>
                            <Typography variant="h6" gutterBottom component="div">
                                {t('order.Detail')}
                            </Typography>
                            <Table size="small" aria-label="product details">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('product.Id')}</TableCell>
                                        <TableCell>{t('product.Name')}</TableCell>
                                        <TableCell>{t('product.Size')}</TableCell>
                                        <TableCell>{t('product.Color')}</TableCell>
                                        <TableCell>{t('product.QuantityProduct')}</TableCell>
                                        <TableCell>{t('product.Image')}</TableCell>
                                        <TableCell>{t('order.TotalAmount')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orderDetails.map((detail) => {
                                        const totalAmount = (detail.price - detail.discountPrice) * detail.quantity;
                                        const product = productDetails
                                            .flat()
                                            .find((pd) => pd.id === detail.productDetailId);
                                        return (
                                            <TableRow key={detail.id}>
                                                <TableCell>{detail.productDetailId}</TableCell>
                                                <TableCell>{product?.name}</TableCell>
                                                <TableCell>{product?.option1}</TableCell>
                                                <TableCell>{product?.option2}</TableCell>
                                                <TableCell>{detail?.quantity}</TableCell>
                                                <TableCell>
                                                    {product?.images && (
                                                        <Avatar
                                                            variant="rounded"
                                                            src={
                                                                product.images[0].startsWith('uploads')
                                                                    ? `${HOST_BE}/${product.images[0]}`
                                                                    : product.images[0]
                                                            }
                                                            alt={product.name}
                                                            sx={{
                                                                width: 80,
                                                                height: 80,
                                                                border: '4px solid transparent',
                                                                borderRadius: 1,
                                                                background:
                                                                    'linear-gradient(white, white), linear-gradient(to right, #3f51b5, #000)',
                                                                backgroundClip: 'content-box, border-box',
                                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                                            }}
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell>{formatPrice(totalAmount)}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <StatusUpdateDialog
                open={openUpdateStatus}
                onClose={handleCloseUpdateStatusDialog}
                order={order}
                onUpdate={handleUpdateOrderList}
            />
            <AddressDialog open={openAddressDialog} onClose={handleCloseAddressDialog} order={order}></AddressDialog>
        </React.Fragment>
    );
}
interface ExportOrderData {
    'Mã đơn hàng': string;
    'Sản phẩm': string;
    'Kích thước': string;
    'Màu sắc': string;
    'Số lượng': number;
    'Thành tiền': string;
    'Trạng thái': string;
    'Thanh toán': string;
    'Tổng tiền': string;
}
export default function OrderTable() {
    const { t } = useTranslation();
    const store = useStore();
    const location = useLocation();
    const { status } = location.state ? location.state : 'all';
    const user = useSelector((state: ReducerProps) => state.user);
    const [orders, setOrders] = useState<OrderModel[]>([]);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);

    // Pagination state
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const getDataOrder = async () => {
        if (user.shopId) {
            if (filterId.length == 24) {
                store.dispatch(change_is_loading(true));
                const res = await GetApi(`/shop/get/order/${filterId}`, localStorage.getItem('token'));

                if (res.data.message == 'Success') {
                    setOrders(res.data.order);
                    await getOrderDetails(res.data.order);
                    setPage(0);
                }
                store.dispatch(change_is_loading(false));
            } else {
                store.dispatch(change_is_loading(true));
                const resOrders = await GetApi(`/shop/get/order-by-shop/${user.shopId}`, localStorage.getItem('token'));
                if (resOrders.data.message === 'Success') {
                    setOrders(resOrders.data.orders);
                    await getOrderDetails(resOrders.data.orders);
                }
                store.dispatch(change_is_loading(false));
            }
        }
    };

    const getOrderDetails = async (orders: OrderModel[]) => {
        const fetchedOrderDetails: OrderDetail[] = [];
        const fetchedProductDetails: ProductDetail[] = [];
        const orderDetailIdList: string[] = [];
        const productDetailIdList: string[] = [];

        for (const order of orders) {
            orderDetailIdList.push(...order.orderDetailIdList);
        }

        const res = await PostApi(`/shop/post/orderDetail-by-order`, localStorage.getItem('token'), {
            orderDetailIdList: orderDetailIdList,
        });

        if (res?.data?.message === 'Success') {
            fetchedOrderDetails.push(...res.data.orderDetails);
        }

        for (const detail of res.data.orderDetails) {
            productDetailIdList.push(detail.productDetailId);
        }

        const resProduct = await PostApi(`/shop/post/productDetail-many`, localStorage.getItem('token'), {
            productDetailIdList: productDetailIdList,
        });

        if (resProduct?.data?.message === 'Success') {
            setProductDetails(resProduct.data.productDetails);
        }
        setOrderDetails(fetchedOrderDetails);
    };

    useEffect(() => {
        if (user) getDataOrder();
    }, [user]);

    useEffect(() => {
        if (status) {
            getDataOrder();
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
        setPage(0); // Reset to first page when changing limit
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setStatusFilter(event.target.value as string);
        setPage(0); // Reset to first page when changing filter
    };

    const filteredOrders = statusFilter === 'all' ? orders : orders.filter((order) => order.status === statusFilter);

    const paginatedOrders = filteredOrders.slice(page * limit, page * limit + limit);
    // filter Id
    const [filterId, setFilterId] = useState<string>('');
    const typingTimeoutRef = useRef<any>(null);
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }
    const filterById = async (id: string) => {
        if (id != '') {
            store.dispatch(change_is_loading(true));
            const res = await GetApi(`/shop/get/order/${id}`, localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setOrders(res.data.order);
                await getOrderDetails(res.data.order);
                setPage(0);
            }
            store.dispatch(change_is_loading(false));
        } else {
            store.dispatch(change_is_loading(true));
            const resOrders = await GetApi(`/shop/get/order-by-shop/${user.shopId}`, localStorage.getItem('token'));
            if (resOrders.data.message === 'Success') {
                setOrders(resOrders.data.orders);
                await getOrderDetails(resOrders.data.orders);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    const exportToCSV = (orders: OrderModel[], orderDetails: OrderDetail[], productDetails: ProductDetail[]) => {
        const csvRows = [];
        // Thêm tiêu đề
        csvRows.push([
            'Mã đơn hàng',
            'Sản phẩm',
            'Kích thước',
            'Màu sắc',
            'Số lượng',
            'Thành tiền',
            'Trạng thái',
            'Thanh toán',
            'Tổng tiền',
        ]);

        orders.forEach((order) => {
            const orderDet = orderDetails.filter((od) => od.orderId === order.id);
            const totalOrderAmount = orderDet.reduce((sum, detail) => {
                const product = productDetails.find((pd) => pd.id === detail.productDetailId);
                return sum + (detail.price - detail.discountPrice) * detail.quantity;
            }, 0);

            orderDet.forEach((detail, index) => {
                const product = productDetails.find((pd) => pd.id === detail.productDetailId);
                const totalAmount = (detail.price - detail.discountPrice) * detail.quantity;

                csvRows.push([
                    index === 0 ? order.id : '', // Gộp ô mã đơn hàng
                    product?.name || '',
                    product?.option1 || '', // Kích thước
                    product?.option2 || '', // Màu sắc
                    detail.quantity,
                    formatPrice(totalAmount), // Thành tiền
                    order.status,
                    order.paid ? 'Đã thanh toán' : 'Chưa thanh toán',
                    index === 0
                        ? formatPrice(totalOrderAmount + order.priceShip - order.priceMember - order.priceVoucher)
                        : '', // Gộp ô tổng tiền
                ]);
            });
        });

        const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'orders.csv');
        document.body.appendChild(link);
        link.click();
    };
    const exportToExcel = (orders: OrderModel[], orderDetails: OrderDetail[], productDetails: ProductDetail[]) => {
        const exportData: ExportOrderData[] = [];

        orders.forEach((order) => {
            const orderDet = orderDetails.filter((od) => od.orderId === order.id);
            const totalOrderAmount = orderDet.reduce((sum, detail) => {
                const product = productDetails.find((pd) => pd.id === detail.productDetailId);
                return sum + (detail.price - detail.discountPrice) * detail.quantity;
            }, 0);

            orderDet.forEach((detail, index) => {
                const product = productDetails.find((pd) => pd.id === detail.productDetailId);
                const totalAmount = (detail.price - detail.discountPrice) * detail.quantity;

                exportData.push({
                    'Mã đơn hàng': index === 0 ? order.id : '', // Gộp ô mã đơn hàng
                    'Sản phẩm': product?.name || '',
                    'Kích thước': product?.option1 || '',
                    'Màu sắc': product?.option2 || '',
                    'Số lượng': detail.quantity,
                    'Thành tiền': formatPrice(totalAmount),
                    'Trạng thái': order.status,
                    'Thanh toán': order.paid ? 'Đã thanh toán' : 'Chưa thanh toán',
                    'Tổng tiền':
                        index === 0
                            ? formatPrice(totalOrderAmount + order.priceShip - order.priceMember - order.priceVoucher)
                            : '', // Gộp ô tổng tiền
                });
            });
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
        XLSX.writeFile(workbook, 'orders.xlsx');
    };
    const handleExport = () => {
        exportToCSV(orders, orderDetails, productDetails);
    };

    useEffect(() => {
        typingTimeoutRef.current = setTimeout(() => {
            filterById(filterId);
        }, 500);
    }, [filterId]);
    return (
        <>
            <TableContainer className="relative" component={Paper}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                        <InputLabel>{t('order.Status')}</InputLabel>
                        <Select value={statusFilter} onChange={handleStatusChange} label="Status">
                            <MenuItem value="all">{t('orther.All')}</MenuItem>
                            <MenuItem value="PROCESSING">{t('order.Processing')}</MenuItem>
                            <MenuItem value="CONFIRMED">{t('order.Confirmed')}</MenuItem>
                            <MenuItem value="DELIVERING">{t('order.Delivering')}</MenuItem>
                            <MenuItem value="PROCESSED">{t('order.Processed')}</MenuItem>
                            <MenuItem value="CANCEL">{t('order.Cancel')}</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Input
                            value={filterId}
                            className="border border-gray-300 rounded-lg p-1"
                            sx={{ display: 'block', width: 300, marginRight: 2 }} // Khoảng cách giữa input và biểu tượng tìm kiếm
                            placeholder={t('action.EnterID')}
                            onChange={(e) => {
                                filterSpecialInput(e.target.value, setFilterId);
                            }}
                        />
                        <IconButton
                            color="primary"
                        >
                            <SearchIcon />
                        </IconButton>
                        <Button variant="contained" color="primary" onClick={handleExport} sx={{ marginLeft: 2 }}>
                            Xuất Đơn Hàng
                        </Button>
                    </Box>
                </Box>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>{t('order.Code')}</TableCell>
                            <TableCell>{t('order.Product')}</TableCell>
                            <TableCell>{t('order.Status')}</TableCell>
                            <TableCell>{t('order.Checkout')}</TableCell>
                            <TableCell>{t('order.Total')}</TableCell>
                            <TableCell align="right">{t('action.Actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedOrders.map((order) => {
                            const orderDet = orderDetails.filter((od) => od.orderId === order.id);
                            const productDetailsForOrder: ProductDetail[] = orderDet
                                .map((detail) => productDetails.flat().find((pd) => pd.id === detail.productDetailId))
                                .filter((pd): pd is ProductDetail => pd !== undefined);

                            return (
                                <Row
                                    key={order.id}
                                    order={order}
                                    orderDetails={orderDet}
                                    productDetails={productDetailsForOrder}
                                    onUpdateOrder={getDataOrder}
                                />
                            );
                        })}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredOrders.length}
                    rowsPerPage={limit}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                />
            </TableContainer>
        </>
    );
}
