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
import Paper from '@mui/material/Paper';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import { useSelector, useStore } from 'react-redux';
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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { GetApi, PostApi } from '../../../untils/Api';
import { filterSpecialInput, formatPrice, toastError, toastSuccess } from '../../../untils/Logic';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { change_is_loading } from '../../../reducers/Actions';

export default function OrderTable() {
    const theme = useTheme();

    const { t } = useTranslation();
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const [orders, setOrders] = useState<any[]>([]);
    const [orderDetails, setOrderDetails] = useState<any[]>([]);

    // Pagination state
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [selectedMonth, setSetlectedMonth] = useState(currentMonth);
    const [selectedYear, setSetlectedYear] = useState(currentYear);

    const getDataOrder = async () => {
        store.dispatch(change_is_loading(true));
        const res = await GetApi(
            `/user/get-orders-by-ctv/${selectedMonth}/${selectedYear}`,
            localStorage.getItem('token'),
        );

        if (res.data.message == 'Success') {
            setOrders(res.data.orders);
            getOrderDetails(res.data.orders);
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

        const res = await PostApi(`/user/post/orderDetail-by-order`, localStorage.getItem('token'), {
            orderDetailIdList: orderDetailIdList,
        });

        if (res?.data?.message === 'Success') {
            fetchedOrderDetails.push(...res.data.orderDetails);
        }
        setOrderDetails(fetchedOrderDetails);
    };

    useEffect(() => {
        if (user) getDataOrder();
    }, [user, selectedMonth]);

    const handlePageChange = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(0);
    };
    const paginatedOrders = orders.slice(page * limit, page * limit + limit);
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
                setPage(0);
            }
            store.dispatch(change_is_loading(false));
        } else {
            store.dispatch(change_is_loading(true));
            const res = await GetApi(`/shop/get/order-by-shop/${user.shopId}`, localStorage.getItem('token'));
            if (res.data.message === 'Success') {
                setOrders(res.data.orders);
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
                    <FormControl variant="outlined" sx={{ minWidth: 120, marginRight: 2 }}>
                        <InputLabel>Chọn tháng</InputLabel>
                        <Select
                            value={selectedMonth}
                            onChange={(e) => setSetlectedMonth(Number(e.target.value))}
                            label={t('order.Month')}
                        >
                            {Array.from({ length: 12 }, (_, index) => (
                                <MenuItem key={index + 1} value={index + 1}>
                                    {`Tháng ${index + 1}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Input
                            value={filterId}
                            className="border border-gray-300 rounded-lg p-1"
                            sx={{ display: 'block', width: 300, marginRight: 2 }}
                            placeholder={t('action.EnterID')}
                            onChange={(e) => {
                                filterSpecialInput(e.target.value, setFilterId);
                            }}
                        />
                        <IconButton color="primary">
                            <SearchIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã đơn hàng</TableCell>
                            <TableCell>Ngày tạo đơn</TableCell>
                            <TableCell>Tên khách</TableCell>
                            <TableCell>SĐT</TableCell>
                            <TableCell>Địa chỉ</TableCell>
                            <TableCell>Hình thức ship</TableCell>
                            <TableCell>Mã vận đơn</TableCell>
                            <TableCell>Giá CTV</TableCell>
                            <TableCell>Giá bán</TableCell>
                            <TableCell>Phí ship</TableCell>
                            <TableCell>Hoa hồng</TableCell>
                            <TableCell>Số lượng</TableCell>
                            <TableCell>Trạng thái đơn</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedOrders.map((order: any, index: number) => {
                            const orderDet = orderDetails.filter((od) => od.orderId === order.id);
                            const totalCtvPrice = orderDet.reduce((total, detail) => {
                                return total + detail.ctvPrice * detail.quantity;
                            }, 0);
                            return (
                                <TableRow hover key={order.id}>
                                    <TableCell>{order.orderCode}</TableCell>
                                    <TableCell>
                                        {' '}
                                        {new Date(order.updateDate).toLocaleDateString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })}
                                    </TableCell>
                                    <TableCell>{order.customerName}</TableCell>
                                    <TableCell>{order.customerPhone}</TableCell>
                                    <TableCell>{order.addressDetail}</TableCell>
                                    <TableCell>
                                        {order.shipMethod === 'GRAB'
                                            ? 'Grab/Kho khác'
                                            : order.shipMethod === 'VIETTELPOST'
                                            ? 'Viettelpost'
                                            : 'Offline'}
                                    </TableCell>
                                    <TableCell>{order.deliveryCode}</TableCell>

                                    <TableCell>{formatPrice(totalCtvPrice)}</TableCell>
                                    <TableCell>
                                        {formatPrice(
                                            orderDet.reduce((total, detail) => {
                                                return total + detail.sellPrice * detail.quantity;
                                            }, 0),
                                        )}
                                    </TableCell>
                                    <TableCell>{formatPrice(order.shipFee)}</TableCell>
                                    <TableCell>
                                        {order.status === 'PROCESSING' || order.status === 'CANCEL'
                                            ? formatPrice(0)
                                            : order.status === 'BOOM'
                                            ? formatPrice(-60000)
                                            : formatPrice(order.CODPrice - order.shipFee - totalCtvPrice)}
                                    </TableCell>
                                    <TableCell align="center">
                                        {order.status === 'SUCCESS'
                                            ? orderDetails.reduce((total, detail) => {
                                                  return total + detail.quantity;
                                              }, 0)
                                            : 0}
                                    </TableCell>
                                    <TableCell>
                                        {order.status === 'PROCESSING' && 'Đang chờ'}
                                        {order.status === 'SUCCESS' && 'Thành công'}
                                        {order.status === 'CANCEL' && 'Đã hủy'}
                                        {order.status === 'BOOM' && 'Boom'}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Số đơn mỗi trang"
                    component="div"
                    count={orders.length}
                    rowsPerPage={limit}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                />
            </TableContainer>
        </>
    );
}
