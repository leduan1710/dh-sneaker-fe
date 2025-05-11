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
    Grid,
    Card,
    CardContent,
    Typography,
    alpha,
    styled,
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { GetApi, PostApi } from '../../../untils/Api';
import { filterSpecialInput, formatPrice, toastError, toastSuccess } from '../../../untils/Logic';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { change_is_loading } from '../../../reducers/Actions';

const AvatarWrapper = styled(Avatar)(
    ({ theme }) => `
    margin: ${theme.spacing(2, 0, 1, -0.5)};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing(1)};
    padding: ${theme.spacing(0.5)};
    border-radius: 10px;
    height: ${theme.spacing(5.5)};
    width: ${theme.spacing(5.5)};
    background: ${
        theme.palette.mode === 'dark' ? theme.colors.alpha.trueWhite[30] : alpha(theme.colors.alpha.black[100], 0.07)
    };
  
    img {
      background: ${theme.colors.alpha.trueWhite[100]};
      padding: ${theme.spacing(0.5)};
      display: block;
      border-radius: inherit;
      height: ${theme.spacing(4.5)};
      width: ${theme.spacing(4.5)};
    }
`,
);
export default function OrderTable() {
    const theme = useTheme();
    const navigate = useNavigate();
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
            setFilteredOrders(res.data.orders);
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
    }, [selectedMonth]);

    const handlePageChange = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(0);
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOrders, setFilteredOrders] = useState(orders);

    useEffect(() => {
        if (orders && searchTerm) {
            const results = orders.filter((order: any) => {
                const phoneMatch = order.customerPhone?.toLowerCase().includes(searchTerm.toLowerCase());
                const deliveryCodeMatch = order.deliveryCode?.toLowerCase().includes(searchTerm.toLowerCase());
                return phoneMatch || deliveryCodeMatch;
            });
            setFilteredOrders(results);
        }
    }, [searchTerm, orders]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const typingTimeoutRef = useRef<any>(null);
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }

    const totalCommission = orders.reduce((total, order) => {
        return total + order.commission;
    }, 0);
    const totalQuantity = orders
        .filter((order) => order.status === 'SUCCESS' && order.isJibbitz == false)
        .reduce((total, order) => {
            const orderDetailsForOrder = orderDetails.filter((detail) => detail.orderId === order.id);
            return total + orderDetailsForOrder.reduce((sum, detail) => sum + detail.quantity, 0);
        }, 0);
    const calculateBonus = (totalQuantity: number) => {
        if (totalQuantity >= 300) return 700000;
        if (totalQuantity >= 200) return 400000;
        if (totalQuantity >= 150) return 250000;
        if (totalQuantity >= 100) return 150000;
        if (totalQuantity >= 50) return 60000;
        if (totalQuantity >= 30) return 300000;
        return 0; // Không có thưởng
    };
    const bonus = calculateBonus(totalQuantity);
    const paginatedOrders = filteredOrders.slice(page * limit, page * limit + limit);

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Grid container spacing={3} sx={{ p: 2 }}>
                <Grid xs={12} sm={6} md={3} item>
                    <Card>
                        <CardContent>
                            <Grid container spacing={0}>
                                <Grid
                                    xs={12}
                                    sm={4}
                                    md={3}
                                    item
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <AvatarWrapper>
                                        <img alt="commission" src={require('../../../static/order-commission.png')} />
                                    </AvatarWrapper>
                                </Grid>
                                <Grid xs={12} sm={8} md={6} item display="flex" alignItems="center">
                                    <Box
                                        sx={{
                                            pt: 2,
                                        }}
                                    >
                                        <Typography variant="h6" gutterBottom noWrap>
                                            Hoa hồng
                                        </Typography>
                                        <Typography variant="body2" noWrap>
                                            {formatPrice(totalCommission)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={3} item>
                    <Card>
                        <CardContent>
                            <Grid container spacing={0}>
                                <Grid xs={12} sm={4} item display="flex" justifyContent="center" alignItems="center">
                                    <AvatarWrapper>
                                        <img alt="order-count" src={require('../../../static/order-count.png')} />
                                    </AvatarWrapper>
                                </Grid>
                                <Grid xs={12} sm={8} item display="flex" alignItems="center">
                                    <Box
                                        sx={{
                                            pt: 2,
                                        }}
                                    >
                                        <Typography variant="h6" gutterBottom noWrap>
                                            Số lượng
                                        </Typography>
                                        <Typography variant="body2" noWrap>
                                            {totalQuantity || 0}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={3} item>
                    <Card>
                        <CardContent>
                            <Grid container spacing={0}>
                                <Grid xs={12} sm={4} item display="flex" justifyContent="center" alignItems="center">
                                    <AvatarWrapper>
                                        <img alt="revenue" src={require('../../../static/bonus.png')} />
                                    </AvatarWrapper>
                                </Grid>
                                <Grid xs={12} sm={8} item display="flex" alignItems="center">
                                    <Box
                                        sx={{
                                            pt: 2,
                                        }}
                                    >
                                        <Typography variant="h6" gutterBottom noWrap>
                                            Thưởng
                                        </Typography>
                                        <Typography variant="body2" noWrap>
                                            {formatPrice(bonus)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={3} item>
                    <Card>
                        <CardContent>
                            <Grid container spacing={0}>
                                <Grid xs={12} sm={4} item display="flex" justifyContent="center" alignItems="center">
                                    <AvatarWrapper>
                                        <img alt="revenue" src={require('../../../static/budget.png')} />
                                    </AvatarWrapper>
                                </Grid>
                                <Grid xs={12} sm={8} item display="flex" alignItems="center">
                                    <Box
                                        sx={{
                                            pt: 2,
                                        }}
                                    >
                                        <Typography variant="h6" gutterBottom noWrap>
                                            Tổng
                                        </Typography>
                                        <Typography variant="body2" noWrap>
                                            {formatPrice(totalCommission + bonus)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <TableContainer>
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
                            value={searchTerm}
                            className="border border-gray-300 rounded-lg p-1"
                            sx={{ display: 'block', width: 300, marginRight: 2 }}
                            placeholder={'Nhập vào SDT hoặc mã vận đơn'}
                            onChange={handleChange}
                        />
                        <IconButton color="primary">
                            <SearchIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã đơn hàng</TableCell>
                            <TableCell>Ngày tạo đơn</TableCell>
                            <TableCell>Tên khách</TableCell>
                            <TableCell>SĐT</TableCell>
                            <TableCell sx={{ minWidth: 120 }}>Địa chỉ</TableCell>
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
                                <TableRow
                                    hover
                                    key={order.id}
                                    onClick={() => {
                                        navigate(`/user/order/${order.id}`);
                                    }}
                                >
                                    <TableCell>{order.orderCode}</TableCell>
                                    <TableCell>
                                        {' '}
                                        {new Date(order.createDate).toLocaleDateString('vi-VN', {
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
                                        {order.status === 'SUCCESS' && order.isJibbitz == false
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
            </TableContainer>
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
        </Paper>
    );
}
