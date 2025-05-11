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
import NoCrashIcon from '@mui/icons-material/NoCrash';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { change_is_loading } from '../../../../reducers/Actions';
import { GetApi, PostApi } from '../../../../untils/Api';
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
    Input,
    Button,
    Grid,
    Card,
    CardContent,
    Typography,
    alpha,
    styled,
} from '@mui/material';
import { filterSpecialInput, formatPrice, shortedString } from '../../../../untils/Logic';
import TablePagination from '@mui/material/TablePagination';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

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
interface RowProps {
    index: number;
    order: any;
    orderDetails: any[];
}

function Row(props: RowProps) {
    const theme = useTheme();
    const { t } = useTranslation();
    const { index, order, orderDetails } = props;
    const [open, setOpen] = useState(true);

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

    const totalCtvPrice = orderDetails.reduce((total, detail) => {
        return total + detail.ctvPrice * detail.quantity;
    }, 0);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell>{order.orderCode}</TableCell>
                <TableCell>
                    {new Date(order.updateDate).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}
                </TableCell>

                <TableCell>{order.ctvName}</TableCell>

                <TableCell>{formatPrice(totalCtvPrice)}</TableCell>
                <TableCell>
                    {formatPrice(
                        orderDetails.reduce((total, detail) => {
                            return total + detail.sellPrice * detail.quantity;
                        }, 0),
                    )}
                </TableCell>
                <TableCell>
                    {formatPrice(
                        orderDetails.reduce((total, detail) => {
                            return total + detail.importPrice * detail.quantity;
                        }, 0),
                    )}
                </TableCell>
                <TableCell>
                    {order.status === 'PROCESSING' || order.status === 'CANCEL'
                        ? formatPrice(0)
                        : order.status === 'BOOM'
                        ? formatPrice(-60000)
                        : formatPrice(order.CODPrice - order.shipFee - totalCtvPrice)}
                </TableCell>
                <TableCell align='center'>
                    {order.status === 'SUCCESS'  && order.isJibbitz == false
                        ? orderDetails.reduce((total, detail) => {
                              return total + detail.quantity;
                          }, 0)
                        : 0}
                </TableCell>

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
                        {' '}
                        {order.status === 'PROCESSING' && 'ĐANG CHỜ'}
                        {order.status === 'SUCCESS' && 'Thành công'}
                        {order.status === 'CANCEL' && 'Đã hủy'}
                        {order.status === 'BOOM' && 'Boom'}
                    </Box>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
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
        </React.Fragment>
    );
}
export default function DetailCommissionTable() {
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

    const getDataCTVName = async () => {
        const res = await GetApi(`/admin/get/ctvNameList`, localStorage.getItem('token'));

        if (res.data.message == 'Success') {
            // setPage(0);
            const names = res.data.ctvNameList.map((ctv: any) => ctv.name);
            setCtvNames(names);
        }
    };

    const getDataOrder = async (ctvName: string) => {
        store.dispatch(change_is_loading(true));
        const res = await GetApi(`/admin/get-orders-by-ctv/${ctvName}`, localStorage.getItem('token'));

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
        if (user) getDataCTVName();
    }, [user]);

    useEffect(() => {
        if (status) {
            getDataCTVName();
            setStatusFilter(status);
            setShipMethodFilter(status);
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
        setStatusFilter(event.target.value as string);
        setPage(0);
    };

    const handleShipMethodChange = (event: SelectChangeEvent<string>) => {
        setShipMethodFilter(event.target.value as string);
        setPage(0);
    };

    const handleCtvChange = (event: SelectChangeEvent<string>) => {
        setCtvFilter(event.target.value as string);
        getDataOrder(event.target.value as string);
        setPage(0);
    };

    const filteredOrders = orders.filter((order) => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesCtv = order.ctvName === ctvFilter;
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
    const totalCommission = orders.reduce((total, order) => {
        return total + order.commission;
    }, 0);
    const totalQuantity = orders
    .filter((order) => order.status === 'SUCCESS'  && order.isJibbitz == false)
    .reduce((total, order) => {
        const orderDetailsForOrder = orderDetails.filter(
            (detail) => detail.orderId === order.id,
        );
        return (
            total +
            orderDetailsForOrder.reduce(
                (sum, detail) => sum + detail.quantity,
                0,
            )
        );
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

    const totalRevenue = orders
    .filter((order) => order.status === 'SUCCESS')
    .reduce((total, order) => {
        const orderDetailsForOrder = orderDetails.filter(
            (detail) => detail.orderId === order.id,
        );
        return (
            total +
            orderDetailsForOrder.reduce(
                (sum, detail) => sum + (detail.ctvPrice - detail.importPrice)* detail.quantity,
                0,
            )
        );
    }, 0);

    const bonus = calculateBonus(totalQuantity);
    
    return (
        <>
            <TableContainer className="relative" component={Paper}>
                <Grid container spacing={3} sx={{ p: 2 }}>
                    <Grid xs={12} sm={6} md={2.4} item>
                        <Card>
                            <CardContent>
                                <Grid container spacing={0}>
                                    <Grid
                                        xs={12}
                                        sm={4}
                                        item
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <AvatarWrapper>
                                            <img
                                                alt="commission"
                                                src={require('../../../../static/order-commission.png')}
                                            />
                                        </AvatarWrapper>
                                    </Grid>
                                    <Grid xs={12} sm={8} item display="flex" alignItems="center">
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
                    <Grid xs={12} sm={6} md={2.4} item>
                        <Card>
                            <CardContent>
                                <Grid container spacing={0}>
                                    <Grid
                                        xs={12}
                                        sm={4}
                                        item
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <AvatarWrapper>
                                            <img
                                                alt="order-count"
                                                src={require('../../../../static/order-count.png')}
                                            />
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
                    <Grid xs={12} sm={6} md={2.4} item>
                        <Card>
                            <CardContent>
                                <Grid container spacing={0}>
                                    <Grid
                                        xs={12}
                                        sm={4}
                                        item
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <AvatarWrapper>
                                            <img alt="revenue" src={require('../../../../static/bonus.png')} />
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
                    <Grid xs={12} sm={6} md={2.4} item>
                        <Card>
                            <CardContent>
                                <Grid container spacing={0}>
                                    <Grid
                                        xs={12}
                                        sm={4}
                                        item
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <AvatarWrapper>
                                            <img alt="revenue" src={require('../../../../static/budget.png')} />
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
                    <Grid xs={12} sm={6} md={2.4} item>
                        <Card>
                            <CardContent>
                                <Grid container spacing={0}>
                                    <Grid
                                        xs={12}
                                        sm={4}
                                        item
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <AvatarWrapper>
                                            <img alt="revenue" src={require('../../../../static/revenue.png')} />
                                        </AvatarWrapper>
                                    </Grid>
                                    <Grid xs={12} sm={8} item display="flex" alignItems="center">
                                        <Box
                                            sx={{
                                                pt: 2,
                                            }}
                                        >
                                            <Typography variant="h6" gutterBottom noWrap>
                                                Doanh thu
                                            </Typography>
                                            <Typography variant="body2" noWrap>
                                                {formatPrice(totalRevenue)}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                        <InputLabel>Tên CTV</InputLabel>
                        <Select value={ctvFilter} onChange={handleCtvChange} label="Tên CTV">
                            {ctvNames.map((ctvName, index) => (
                                <MenuItem key={index} value={ctvName}>
                                    {ctvName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select value={statusFilter} onChange={handleStatusChange} label="Trạng thái">
                            <MenuItem value="all">{t('orther.All')}</MenuItem>
                            <MenuItem value="PROCESSING">Đang chờ</MenuItem>
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

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Input
                            value={filterId}
                            className="border border-gray-300 rounded-lg p-1"
                            sx={{ display: 'block', width: 350, marginRight: 2 }}
                            placeholder={'Tìm kiếm'}
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
                            <TableCell align="center">STT</TableCell>
                            <TableCell>Mã đơn hàng</TableCell>
                            <TableCell>Ngày tạo đơn</TableCell>
                            <TableCell>CTV</TableCell>
                            <TableCell>Giá CTV</TableCell>
                            <TableCell>Giá bán</TableCell>
                            <TableCell>Giá nhập</TableCell>
                            <TableCell>Hoa hồng</TableCell>
                            <TableCell>Số lượng</TableCell>
                            <TableCell>Trạng thái đơn</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedOrders.map((order: any, index: number) => {
                            const orderDet = orderDetails.filter((od) => od.orderId === order.id);

                            return <Row index={index} key={order.id} order={order} orderDetails={orderDet} />;
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
