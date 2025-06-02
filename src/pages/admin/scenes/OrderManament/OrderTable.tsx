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
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import StatusUpdateDialog from './StatusUpdateDialog';
import DetailOrder from './DetailDialog';

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
    const [openDetailOrder, setOpenDetailOrder] = useState(false);

    const [newStatus, setNewStatus] = useState('');

    const handleClickOpenUpdateStatusDialog = () => {
        setOpenUpdateStatus(true);
    };
    const handleCloseUpdateStatusDialog = () => {
        setNewStatus('');
        setOpenUpdateStatus(false);
    };
    const handleClickOpenDetailOrder = () => {
        setOpenDetailOrder(true);
    };
    const handleCloseDetailOrder = () => {
        setOpenDetailOrder(false);
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
    useEffect(() => {
        if (newStatus != '') handleClickOpenUpdateStatusDialog();
    }, [newStatus]);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>{order.orderCode}</TableCell>
                <TableCell>
                    {new Date(order.createDate).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
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
                            textAlign: 'center',
                        }}
                    >
                        {order.status === 'SUCCESS' && 'Thành công'}
                        {order.status === 'CANCEL' && 'Đã hủy'}
                        {order.status === 'BOOM' && 'Boom'}
                    </Box>
                </TableCell>

                <TableCell>{formatPrice(order.CODPrice)}</TableCell>

                <TableCell align="center">
                    <Select
                        value={order.status}
                        variant="standard"
                        onChange={(e) => {
                            setNewStatus(e.target.value);
                        }}
                        sx={{
                            width: '150px',
                            height: '30px',
                            padding: '5px',
                            backgroundColor:
                                order.status === 'SUCCESS'
                                    ? 'rgba(76, 175, 80, 0.1)'
                                    : order.status === 'CANCEL'
                                    ? 'rgba(244, 67, 54, 0.1)'
                                    : order.status === 'BOOM'
                                    ? 'rgba(255, 152, 0, 0.1)'
                                    : 'rgba(33, 150, 243, 0.1)',
                            color:
                                order.status === 'SUCCESS'
                                    ? '#43A047'
                                    : order.status === 'CANCEL'
                                    ? '#D32F2F'
                                    : order.status === 'BOOM'
                                    ? '#FF9800'
                                    : '#1976D2',
                            fontSize: 14,
                            '& .MuiSelect-select': {
                                paddingTop: '6px',
                                paddingBottom: '6px',
                            },
                        }}
                    >
                        <MenuItem value="SUCCESS">Thành công</MenuItem>
                        <MenuItem value="CANCEL">Đã hủy</MenuItem>
                        <MenuItem value="BOOM">Boom</MenuItem>
                    </Select>
                </TableCell>
                <TableCell align="right">
                    <Tooltip title={'Thông tin đơn hàng'} arrow>
                        <IconButton
                            sx={{
                                '&:hover': { background: theme.colors.primary.lighter },
                                color: theme.palette.primary.main,
                            }}
                            color="primary"
                            size="small"
                            onClick={handleClickOpenDetailOrder}
                        >
                            <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{
                        paddingBottom: 0,
                        paddingTop: 0,
                        borderBottom: '5px solid transparent',
                        backgroundImage:
                            'linear-gradient(to right, rgba(63, 120, 181, 0.8), rgba(63, 116, 181, 0.4)), linear-gradient(to right, #ccc, #ccc)',
                        backgroundPosition: 'bottom',
                        backgroundSize: '100% 5px',
                        backgroundRepeat: 'no-repeat',
                    }}
                    colSpan={7}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box
                            sx={{
                                marginBottom: 1,
                                padding: 2,
                                bgcolor: 'rgba(199, 232, 255, 0.5)',
                                borderRadius: '4px',
                            }}
                        >
                            {order.adminNote && (
                                <Typography variant="body1" gutterBottom component="div">
                                    <strong>Ghi chú:</strong> {order.adminNote}
                                </Typography>
                            )}

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
                                        <TableCell sx={{ maxWidth: '300px' }}>
                                            {order?.addressDetail}{' '}
                                            {order?.address ? (
                                                <>
                                                    , {order?.address?.ward.WARDS_NAME},{' '}
                                                    {order?.address?.district.DISTRICT_NAME},{' '}
                                                    {order?.address?.province.PROVINCE_NAME}
                                                </>
                                            ) : null}
                                        </TableCell>
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
                status={newStatus}
            />
            <DetailOrder
                open={openDetailOrder}
                onClose={handleCloseDetailOrder}
                order={order}
                orderDetails={orderDetails}
            />
        </React.Fragment>
    );
}

export default function OrderTable() {
    const { t } = useTranslation();
    const store = useStore();
    const location = useLocation();
    const { status } = location.state ? location.state : 'ALL';
    const user = useSelector((state: ReducerProps) => state.user);
    const [orders, setOrders] = useState<any[]>([]);
    const [orderDetails, setOrderDetails] = useState<any[]>([]);

    // Pagination state
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [count, setCount] = useState(0);
    const [step, setStep] = useState<number>(1);

    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [shipMethodFilter, setShipMethodFilter] = useState<string>('ALL');
    const [ctvFilter, setCtvFilter] = useState('ALL');
    const [ctvNames, setCtvNames] = useState<string[]>([]);

    const getDataOrder = async () => {
        store.dispatch(change_is_loading(true));
        if (ctvFilter === 'ALL') {
            const res = await PostApi(`/admin/get-orders/${30}/${step}`, localStorage.getItem('token'), {
                status: statusFilter,
                shipMethod: shipMethodFilter,
            });

            if (res.data.message == 'Success') {
                if (step != 1) setOrders((prev) => [...prev, ...res.data.orders.orders]);
                else {
                    setOrders(res.data.orders.orders);
                }
                setCount(res.data.orders.count);
                await getOrderDetails(res.data.orders.orders);
            }
        } else {
            const res = await PostApi(
                `/admin/get-orders-by-ctv/${ctvFilter}/${15}/${step}`,
                localStorage.getItem('token'),
                {
                    status: statusFilter,
                    shipMethod: shipMethodFilter,
                },
            );

            if (res.data.message == 'Success') {
                if (step != 1) setOrders((prev) => [...prev, ...res.data.orders.orders]);
                else {
                    setOrders(res.data.orders.orders);
                }
                setCount(res.data.orders.count);
                await getOrderDetails(res.data.orders.orders);
            }
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
    const getDataCTVName = async () => {
        const res = await GetApi(`/admin/get/ctvNameList`, localStorage.getItem('token'));

        if (res.data.message == 'Success') {
            const names = res.data.ctvNameList.map((ctv: any) => ctv.name);
            setCtvNames(names);
        }
    };

    const resetFilter = () => {
        setCtvFilter('ALL');
        setShipMethodFilter('ALL');
        setStatusFilter('ALL');
    };
    useEffect(() => {
        getDataOrder();
    }, [ctvFilter, statusFilter, shipMethodFilter]);

    useEffect(() => {
        if (step != 1) getDataOrder();
    }, [step]);

    useEffect(() => {
        if (orders.length > 0 && count > 0 && searchTerm === '')
            if (limit * (page + 1) > orders.length && orders.length < count) {
                setStep((prev) => prev + 1);
            }
    }, [orders]);

    useEffect(() => {
        getDataCTVName();
    }, []);

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
        if (limit * (newPage + 1) > orders.length && orders.length < count && searchTerm === '') {
            setStep((prev) => prev + 1);
        }
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value, 10));
        if (parseInt(event.target.value) > orders.length && orders.length < count) {
            setStep((prev) => prev + 1);
        }
        setPage(0);
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setStatusFilter(event.target.value as string);
        setStep(1);
        setPage(0);
    };

    const handleShipMethodChange = (event: SelectChangeEvent<string>) => {
        setShipMethodFilter(event.target.value as string);
        setStep(1);
        setPage(0);
    };

    const handleCtvChange = (event: SelectChangeEvent<string>) => {
        setCtvFilter(event.target.value as string);
        setStep(1);
        setPage(0);
    };

    const paginatedOrders = orders.slice(page * limit, page * limit + limit);
    // filter Id
    const [searchTerm, setSearchTerm] = useState<string>('');
    const typingTimeoutRef = useRef<any>(null);
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }
    const filterByPhoneOrDeliveringCode = async (searchTerm: string) => {
        if (searchTerm != '') {
            store.dispatch(change_is_loading(true));
            const res = await PostApi(
                `/admin/search/order-by-phone-or-delivering-code`,
                localStorage.getItem('token'),
                { searchTerm: searchTerm },
            );
            if (res.data.message == 'Success') {
                resetFilter();
                setOrders(res.data.order);
                await getOrderDetails(res.data.order);
                setPage(0);
            }
            store.dispatch(change_is_loading(false));
        } else {
            getDataOrder();
        }
    };

    useEffect(() => {
        typingTimeoutRef.current = setTimeout(() => {
            filterByPhoneOrDeliveringCode(searchTerm);
        }, 500);
    }, [searchTerm]);
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select value={statusFilter} onChange={handleStatusChange} label="Trạng thái">
                        <MenuItem value="ALL">Tất cả</MenuItem>
                        <MenuItem value="SUCCESS">Thành công</MenuItem>
                        <MenuItem value="BOOM">Boom</MenuItem>
                        <MenuItem value="CANCEL">Đã hủy</MenuItem>
                    </Select>
                </FormControl>

                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                    <InputLabel>Hình thức ship</InputLabel>
                    <Select value={shipMethodFilter} onChange={handleShipMethodChange} label="Hình thức ship">
                        <MenuItem value="ALL">Tất cả</MenuItem>
                        <MenuItem value="VIETTELPOST">Viettelpost</MenuItem>
                        <MenuItem value="GRAB">Grab/Kho khác</MenuItem>
                        <MenuItem value="OFFLINE">Offline</MenuItem>
                        <MenuItem value="GGDH">Đổi hàng</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                    <InputLabel>Tên CTV</InputLabel>
                    <Select value={ctvFilter} onChange={handleCtvChange} label="Tên CTV">
                        <MenuItem value="ALL">Tất cả</MenuItem>
                        {ctvNames.map((ctvName, index) => (
                            <MenuItem key={index} value={ctvName}>
                                {ctvName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Input
                        value={searchTerm}
                        className="border border-gray-300 rounded-lg p-1"
                        sx={{ display: 'block', width: 350, marginRight: 2 }}
                        placeholder={'Tìm kiếm'}
                        onChange={(e) => {
                            filterSpecialInput(e.target.value, setSearchTerm);
                        }}
                    />
                    <IconButton color="primary">
                        <SearchIcon />
                    </IconButton>
                </Box>
            </Box>
            <TableContainer className="relative" component={Paper} sx={{ height: 640 }}>
                <Table stickyHeader aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã đơn hàng</TableCell>
                            <TableCell>Ngày tạo đơn</TableCell>
                            <TableCell>CTV</TableCell>
                            <TableCell>Trạng thái đơn</TableCell>
                            <TableCell>Tiền COD</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                            <TableCell align="right">Chi tiết</TableCell>
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
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Số đơn mỗi trang"
                component="div"
                count={searchTerm === '' ? count : orders.length}
                rowsPerPage={limit}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
            />
        </>
    );
}
