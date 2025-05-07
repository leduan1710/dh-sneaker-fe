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

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PROCESSING':
                return { backgroundColor: '#2196F3', color: 'white' };
            case 'BOOM':
                return { backgroundColor: '#FFEB3B', color: 'black' };
            case 'SUCCESS':
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
                    <Box
                        sx={{
                            ...getStatusStyle(order.status),
                            padding: '4px 8px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            width: 150,
                        }}
                    >
                        {order.status === 'SUCCESS' && 'Thành công'}
                        {order.status === 'CANCEL' && 'Đã hủy'}
                        {order.status === 'BOOM' && 'Boom'}
                    </Box>
                </TableCell>

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
                        <Box sx={{ padding: 2, bgcolor: '#f9f9f9', borderRadius: '4px' }}>
                            <Table size="small" aria-label="product details">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tên khách hàng</TableCell>
                                        <TableCell>Số điện thoại</TableCell>
                                        <TableCell>Địa chỉ</TableCell>
                                        <TableCell>Hình thức ship</TableCell>
                                        <TableCell>Mã vận đơn</TableCell>
                                        <TableCell>Phí ship</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{order.customerName}</TableCell>
                                        <TableCell>{order?.customerPhone}</TableCell>
                                        <TableCell>{order?.addressDetail}</TableCell>
                                        <TableCell>{order?.shipMethod}</TableCell>
                                        <TableCell>{order?.deliveryCode}</TableCell>

                                        <TableCell>{formatPrice(order.shipFee)}</TableCell>
                                    </TableRow>
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
        </React.Fragment>
    );
}

export default function OrderTable() {
    const { t } = useTranslation();
    const store = useStore();
    const location = useLocation();
    const { status } = location.state ? location.state : 'all';
    const user = useSelector((state: ReducerProps) => state.user);
    const [orders, setOrders] = useState<any[]>([]);
    const [orderDetails, setOrderDetails] = useState<any[]>([]);

    // Pagination state
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [shipMethodFilter, setShipMethodFilter] = useState<string>('all');
    const [ctvFilter, setCtvFilter] = useState('all');
    const [ctvNames, setCtvNames] = useState<string[]>([]);

    const getDataOrder = async () => {
        store.dispatch(change_is_loading(true));
        const res = await GetApi(`/admin/get-orders/${20}/1`, localStorage.getItem('token'));

        if (res.data.message == 'Success') {
            setOrders(res.data.orders);
            await getOrderDetails(res.data.orders);
            setPage(0);
        }
        store.dispatch(change_is_loading(false));
    };

    const getOrderDetails = async (orders: any[]) => {
        const fetchedOrderDetails: any[] = [];
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
            setShipMethodFilter(status);
            setPage(0);
            location.state = null;
        }
    }, [status]);

    useEffect(() => {
        const uniqueCtvNames = orders
            .map((order) => order.ctvName)
            .filter((name, index, self) => name && self.indexOf(name) === index); // Lọc tên CTV duy nhất
        setCtvNames(uniqueCtvNames);
    }, [orders]);
    const handlePageChange = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setStatusFilter(event.target.value as string);
        setPage(0);
    };

    const handleShipMethodChange = (event: SelectChangeEvent<string>) => {
        setShipMethodFilter(event.target.value as string);
        setPage(0);
    };

    const handleCtvChange = (event: SelectChangeEvent<string>) => {
        setCtvFilter(event.target.value as string);
        setPage(0);
    };


    const filteredOrders = orders.filter((order) => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesCtv = ctvFilter === 'all' || order.ctvName === ctvFilter;
        const matchesShipMethod = shipMethodFilter === 'all' || order.shipMethod === shipMethodFilter;
    
        return matchesStatus && matchesCtv && matchesShipMethod;
    });

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
                        <InputLabel>Trạng thái</InputLabel>
                        <Select value={statusFilter} onChange={handleStatusChange} label="Trạng thái">
                            <MenuItem value="all">{t('orther.All')}</MenuItem>
                            <MenuItem value="SUCCESS">Thành công</MenuItem>
                            <MenuItem value="BOOM">Boom</MenuItem>
                            <MenuItem value="CANCEL">Đã hủy</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                        <InputLabel>Hình thức ship</InputLabel>
                        <Select value={shipMethodFilter} onChange={handleShipMethodChange} label="Hình thức ship">
                            <MenuItem value="all">{t('orther.All')}</MenuItem>
                            <MenuItem value="VIETTELPOST">Viettelpost</MenuItem>
                            <MenuItem value="GRAB">Grab/Kho khác</MenuItem>
                            <MenuItem value="OFFLINE">Offline</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                        <InputLabel>Tên CTV</InputLabel>
                        <Select value={ctvFilter} onChange={handleCtvChange} label="Tên CTV">
                            <MenuItem value="all">{t('orther.All')}</MenuItem>
                            {ctvNames.map((ctvName, index) => (
                                <MenuItem key={index} value={ctvName}>
                                    {ctvName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Input
                            value={filterId}
                            className="border border-gray-300 rounded-lg p-1"
                            sx={{ display: 'block', width: 300, marginRight: 2 }}
                            placeholder={'Tìm kiếm'}
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
                            <TableCell>Mã đơn hàng</TableCell>
                            <TableCell>Ngày tạo đơn</TableCell>
                            <TableCell>CTV</TableCell>
                            <TableCell>Trạng thái đơn</TableCell>
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
