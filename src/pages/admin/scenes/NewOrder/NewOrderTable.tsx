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
import CancelIcon from '@mui/icons-material/Cancel';
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
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

interface RowProps {
    order: any;
    orderDetails: any[];
    onUpdateOrder: () => void;
}

function Row(props: RowProps) {
    const theme = useTheme();
    const { t } = useTranslation();
    const { order, orderDetails, onUpdateOrder } = props;
    const [open, setOpen] = useState(true);
    const [openUpdateStatus, setOpenUpdateStatus] = useState(false);
    const [selection, setSelection] = useState('');
    const [showImage, setShowImage] = useState(false);

    const handleToggleImage = () => {
        setShowImage((prev) => !prev);
    };

    const handleClickOpenUpdateStatusDialog = () => {
        setSelection('SUCCESS');
        setOpenUpdateStatus(true);
    };
    const handleCloseUpdateStatusDialog = () => {
        setOpenUpdateStatus(false);
    };
    const handleClickOpenCancelDialog = () => {
        setSelection('CANCEL');
        setOpenUpdateStatus(true);
    };

    const handleUpdateOrderList = () => {
        onUpdateOrder();
    };

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{order.orderCode}</TableCell>
                <TableCell>
                    {new Date(order.updateDate).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}
                </TableCell>
                <TableCell>{order.ctvName}</TableCell>
                <TableCell>
                    {order.shipMethod === 'GRAB'
                        ? 'Grab/Kho khác'
                        : order.shipMethod === 'VIETTELPOST'
                        ? 'Viettelpost'
                        : 'Offline'}
                </TableCell>
                <TableCell>{formatPrice(order.shipFee)}</TableCell>
                <TableCell>{formatPrice(order.CODPrice)}</TableCell>
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
                    <Tooltip title={'Hủy đơn hàng'} arrow>
                        <IconButton
                            sx={{
                                '&:hover': {
                                    background: theme.colors.error.lighter,
                                },
                                color: theme.palette.error.main,
                            }}
                            color="error"
                            size="small"
                            onClick={handleClickOpenCancelDialog}
                        >
                            <CancelIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Box sx={{ margin: 1, width: '100%', padding: 2, bgcolor: '#f9f9f9', borderRadius: '4px' }}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Typography variant="body1" gutterBottom component="div">
                                <strong>Tên khách:</strong> {order.customerName}
                                {order.customerPhone && (
                                    <>
                                        {' '}
                                        - <strong>Số điện thoại:</strong> {order.customerPhone}
                                    </>
                                )}
                            </Typography>
                            {order.addressDetail && (
                                <Typography variant="body1" gutterBottom component="div">
                                    <strong>Địa chỉ:</strong> {order.addressDetail}
                                </Typography>
                            )}

                            <Typography variant="body1" gutterBottom component="div">
                                <strong>Ghi chú:</strong> {order.ctvNote}
                                {order.noteImage && (
                                    <span
                                        style={{ cursor: 'pointer', color: 'blue', marginLeft: '10px' }}
                                        onClick={handleToggleImage}
                                    >
                                        {showImage ? 'Ẩn ảnh ghi chú' : 'Ảnh ghi chú'}
                                    </span>
                                )}
                            </Typography>

                            {showImage && order.noteImage && (
                                <Avatar
                                    variant='square'
                                    src={
                                        order.noteImage.startsWith('uploads')
                                            ? `${HOST_BE}/${order.noteImage}`
                                            : order.noteImage
                                    }
                                    alt="Ghi chú"
                                    style={{ maxWidth: '100%', height: 'auto', minWidth: '150px' }}
                                />
                            )}
                        </Collapse>
                        <Table size="small" aria-label="product details">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('product.Id')}</TableCell>
                                    <TableCell>{t('product.Image')}</TableCell>
                                    <TableCell>{t('product.Name')}</TableCell>
                                    <TableCell>{t('product.Color')}</TableCell>
                                    <TableCell>{t('product.Size')}</TableCell>
                                    <TableCell>{t('product.QuantityProduct')}</TableCell>
                                    <TableCell>Tổng</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orderDetails.map((detail) => {
                                    const totalAmount = detail.price * detail.quantity;
                                    return (
                                        <TableRow key={detail.id}>
                                            <TableCell>{detail.productDetailId}</TableCell>
                                            <TableCell>
                                                {detail?.image && (
                                                    <Avatar
                                                        variant="rounded"
                                                        src={
                                                            detail.image.startsWith('uploads')
                                                                ? `${HOST_BE}/${detail.image}`
                                                                : detail.image
                                                        }
                                                        alt={detail.productName}
                                                        sx={{
                                                            width: '140px',
                                                            height: 'auto',
                                                            border: '2px solid transparent',
                                                            borderRadius: 1,
                                                            background:
                                                                'linear-gradient(white, white), linear-gradient(to right, #3f51b5, #000)',
                                                            backgroundClip: 'content-box, border-box',
                                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                                        }}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>{detail?.productName}</TableCell>
                                            <TableCell>{detail?.color}</TableCell>
                                            <TableCell>{detail?.size}</TableCell>
                                            <TableCell>{detail?.quantity}</TableCell>

                                            <TableCell>{formatPrice(totalAmount)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Box>
                </TableCell>
            </TableRow>
            <StatusUpdateDialog
                open={openUpdateStatus}
                onClose={handleCloseUpdateStatusDialog}
                order={order}
                onUpdate={handleUpdateOrderList}
                selection={selection}
            />
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
export default function NewOrderTable() {
    const { t } = useTranslation();
    const store = useStore();
    const location = useLocation();
    const { status } = location.state ? location.state : 'all';
    const user = useSelector((state: ReducerProps) => state.user);
    const [orders, setOrders] = useState<OrderModel[]>([]);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);

    // Pagination state
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const getDataOrder = async () => {
        store.dispatch(change_is_loading(true));
        const res = await GetApi(`/admin/get-new-orders/${20}/1`, localStorage.getItem('token'));

        if (res.data.message == 'Success') {
            setOrders(res.data.orders);
            await getOrderDetails(res.data.orders);
            setPage(0);
        }
        store.dispatch(change_is_loading(false));
    };

    const getOrderDetails = async (orders: OrderModel[]) => {
        const fetchedOrderDetails: OrderDetail[] = [];
        const orderDetailIdList: string[] = [];

        for (const order of orders) {
            orderDetailIdList.push(...order.orderDetailIdList);
        }

        const res = await PostApi(`/admin/post/orderDetail-by-order`, localStorage.getItem('token'), {
            orderDetailIdList: orderDetailIdList,
        });

        if (res?.data?.message === 'Success') {
            fetchedOrderDetails.push(...res.data.orderDetails);
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
                        <IconButton color="primary">
                            <SearchIcon />
                        </IconButton>
                        <Button variant="contained" color="primary" onClick={() => {}} sx={{ marginLeft: 2 }}>
                            Xuất Đơn Hàng
                        </Button>
                    </Box>
                </Box>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Mã đơn hàng</TableCell>
                            <TableCell>Ngày tạo đơn</TableCell>
                            <TableCell>CTV</TableCell>
                            <TableCell>Hình thức ship</TableCell>
                            <TableCell>Phí ship</TableCell>
                            <TableCell>Tiền COD</TableCell>
                            <TableCell align="right">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedOrders.map((order) => {
                            const orderDet = orderDetails.filter((od) => od.orderId === order.id);

                            return (
                                <Row
                                    key={order.id}
                                    order={order}
                                    orderDetails={orderDet}
                                    onUpdateOrder={getDataOrder}
                                />
                            );
                        })}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Số đơn mỗi trang"
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
