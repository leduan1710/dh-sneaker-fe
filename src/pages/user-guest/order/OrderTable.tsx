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
    height: ${theme.spacing(5.0)};
    width: ${theme.spacing(5.0)};
    background: ${
        theme.palette.mode === 'dark' ? theme.colors.alpha.trueWhite[30] : alpha(theme.colors.alpha.black[100], 0.07)
    };
  
    img {
      background: ${theme.colors.alpha.trueWhite[100]};
      padding: ${theme.spacing(0.5)};
      display: block;
      border-radius: inherit;
      height: ${theme.spacing(4.0)};
      width: ${theme.spacing(4.0)};
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

    const [revenue, setRevenue] = useState(0);
    const [commission, setCommission] = useState(0);
    const [bonus, setBonus] = useState(0);
    const [quantity, setQuantity] = useState(0);

    // Pagination state
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [count, setCount] = useState(0);
    const [step, setStep] = useState<number>(1);

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [selectedMonth, setSetlectedMonth] = useState(currentMonth);
    const [selectedYear, setSetlectedYear] = useState(currentYear);

    const getDataOrder = async () => {
        store.dispatch(change_is_loading(true));
        const res = await GetApi(
            `/user/get-orders-by-ctv/${user.id}/${selectedMonth}/${selectedYear}`,
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
    const getDataRevenueCommissionAndBonus = async () => {
        const res = await GetApi(
            `/admin/get/revenue-commission-by-ctvName/${user.name}/${selectedMonth}/${selectedYear}`,
            localStorage.getItem('token'),
        );
        if (res.data.message === 'Success') {
            setRevenue(res.data.data.revenue);
            setCommission(res.data.data.commission);
            setBonus(res.data.data.bonus);
            setQuantity(res.data.data.quantity);
        }
    };
    useEffect(() => {
        if (user.id && selectedMonth) {
            getDataOrder();
            getDataRevenueCommissionAndBonus();
        }
    }, [selectedMonth, user, selectedYear]);

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

    const paginatedOrders = filteredOrders.slice(page * limit, page * limit + limit);

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Grid container spacing={1} sx={{ p: 1 }}>
                <Grid xs={6} sm={6} md={3} item>
                    <Card>
                        <CardContent
                            sx={{
                                paddingTop: '8px',
                                ':last-child': {
                                    paddingBottom: '8px',
                                },
                            }}
                        >
                            <Grid container spacing={1}>
                                <Grid xs={4} sm={4} item display="flex" justifyContent="center" alignItems="center">
                                    <AvatarWrapper>
                                        <img alt="commission" src={require('../../../static/order-commission.png')} />
                                    </AvatarWrapper>
                                </Grid>
                                <Grid xs={8} sm={8} item display="flex" alignItems="center">
                                    <Box>
                                        <Typography variant="h5" sx={{ fontSize: 16 }} noWrap>
                                            Hoa hồng
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontSize: 14 }} noWrap>
                                            {formatPrice(commission)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={6} sm={6} md={3} item>
                    <Card>
                        <CardContent
                            sx={{
                                paddingTop: '8px',
                                ':last-child': {
                                    paddingBottom: '8px',
                                },
                            }}
                        >
                            <Grid container spacing={1}>
                                <Grid xs={4} sm={4} item display="flex" justifyContent="center" alignItems="center">
                                    <AvatarWrapper>
                                        <img alt="order-count" src={require('../../../static/order-count.png')} />
                                    </AvatarWrapper>
                                </Grid>
                                <Grid xs={8} sm={8} item display="flex" alignItems="center">
                                    <Box>
                                        <Typography variant="h5" sx={{ fontSize: 16 }} gutterBottom noWrap>
                                            Số lượng
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontSize: 14 }} noWrap>
                                            {quantity || 0}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={6} sm={6} md={3} item>
                    <Card>
                        <CardContent
                            sx={{
                                paddingTop: '8px',
                                ':last-child': {
                                    paddingBottom: '8px',
                                },
                            }}
                        >
                            <Grid container spacing={1}>
                                <Grid xs={4} sm={4} item display="flex" justifyContent="center" alignItems="center">
                                    <AvatarWrapper>
                                        <img alt="revenue" src={require('../../../static/bonus.png')} />
                                    </AvatarWrapper>
                                </Grid>
                                <Grid xs={8} sm={8} item display="flex" alignItems="center">
                                    <Box>
                                        <Typography variant="h5" sx={{ fontSize: 16 }} gutterBottom noWrap>
                                            Thưởng
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontSize: 14 }} noWrap>
                                            {formatPrice(bonus)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={6} sm={6} md={3} item>
                    <Card>
                        <CardContent
                            sx={{
                                paddingTop: '8px',
                                ':last-child': {
                                    paddingBottom: '8px',
                                },
                            }}
                        >
                            <Grid container spacing={1}>
                                <Grid xs={4} sm={4} item display="flex" justifyContent="center" alignItems="center">
                                    <AvatarWrapper>
                                        <img alt="revenue" src={require('../../../static/budget.png')} />
                                    </AvatarWrapper>
                                </Grid>
                                <Grid xs={8} sm={8} item display="flex" alignItems="center">
                                    <Box>
                                        <Typography variant="h5" sx={{ fontSize: 16 }} gutterBottom noWrap>
                                            Tổng
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontSize: 14 }} noWrap>
                                            {formatPrice(commission + bonus)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
                <Box>
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
                    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                        <InputLabel>Năm</InputLabel>
                        <Select
                            value={selectedYear}
                            onChange={(e) => setSetlectedYear(Number(e.target.value))}
                            label={'Năm'}
                        >
                            {Array.from({ length: currentYear - 2024 }, (_, index) => (
                                <MenuItem key={2025 + index} value={2025 + index}>
                                    {2025 + index}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

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
            <TableContainer sx={{ height: 400 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {[
                                'Mã đơn hàng',
                                'Ngày tạo đơn',
                                'Tên khách',
                                'SĐT',
                                'Hình thức ship',
                                'Mã vận đơn',
                                'Tiền Cod',
                                'Giá CTV',
                                'Phí ship',
                                'Hoa hồng',
                                'Số lượng',
                                'Trạng thái đơn',
                            ].map((header, index) => (
                                <TableCell
                                    key={index}
                                    sx={{ backgroundColor: 'rgb(12, 89, 96)', fontWeight: 'bold', color: '#FFFFFF' }}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedOrders.map((order: any, index: number) => {
                            const orderDet = orderDetails.filter((od) => od.orderId === order.id);
                            const totalCtvPrice = orderDet.reduce((total, detail) => {
                                return total + detail.ctvPrice * detail.quantity;
                            }, 0);

                            const backgroundColor =
                                index % 2 === 0 ? 'rgba(195, 241, 246, 0.63)' : 'rgba(211, 249, 229, 0.63)';

                            return (
                                <TableRow
                                    hover
                                    key={order.id}
                                    onClick={() => {
                                        navigate(`/user/order/${order.id}`);
                                    }}
                                    sx={{
                                        backgroundColor,

                                        '&:hover': {
                                            backgroundColor: 'rgba(13, 131, 29, 0.93)',
                                        },
                                    }}
                                >
                                    {[
                                        order.orderCode,
                                        new Date(order.createDate).toLocaleDateString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false,
                                        }),
                                        order.customerName,
                                        order.customerPhone,
                                        order.shipMethod === 'GRAB'
                                            ? 'Grab/Kho khác'
                                            : order.shipMethod === 'VIETTELPOST'
                                            ? 'Viettelpost'
                                            : order.shipMethod === 'GGDH'
                                            ? 'Đổi hàng'
                                            : 'Offline',
                                        order.deliveryCode,
                                        formatPrice(order.CODPrice),
                                        formatPrice(totalCtvPrice),
                                        formatPrice(order.shipFee),
                                        order.commission,
                                        order.status === 'SUCCESS' && order.shipMethod !== 'GGDH'
                                            ? orderDetails
                                                  .filter((detail) => detail.orderId === order.id)
                                                  .reduce(
                                                      (total, detail) =>
                                                          detail.isJibbitz ? total : total + detail.quantity,
                                                      0,
                                                  )
                                            : 0,
                                        order.status === 'PROCESSING'
                                            ? 'Đang chờ'
                                            : order.status === 'SUCCESS'
                                            ? 'Thành công'
                                            : order.status === 'CANCEL'
                                            ? 'Đã hủy'
                                            : order.status === 'BOOM'
                                            ? 'Boom'
                                            : '',
                                    ].map((cell, cellIndex) => (
                                        <TableCell
                                            key={cellIndex}
                                            sx={{
                                                padding: '16px',
                                                borderBottom: '1px solid #e0e0e0',
                                            }}
                                        >
                                            {cell}
                                        </TableCell>
                                    ))}
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
