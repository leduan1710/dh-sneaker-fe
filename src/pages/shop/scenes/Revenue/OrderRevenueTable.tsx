import React, { FC, ChangeEvent, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Tooltip,
    Divider,
    Box,
    Card,
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Container,
    Grid,
} from '@mui/material';

import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CloseIcon from '@mui/icons-material/Close';
import { formatPrice, toastError, toastSuccess, toastWarning } from '../../../../untils/Logic';
import { change_is_loading } from '../../../../reducers/Actions';
import { useSelector, useStore } from 'react-redux';
import { GetApi, PostApi } from '../../../../untils/Api';
import { useTranslation } from 'react-i18next';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { HOST_BE } from '../../../../common/Common';
import InfoCard from './InfoCard';

interface RevenueModel {
    orderId: string;
    totalAmount: number;
    voucherReduce: number;
    transactionFee: number;
    revenue: number;
}

interface RevenueTableProps {
    className?: string;
    initialOrderRevenue: RevenueModel[];
}

const applyPagination = (orderRevenue: RevenueModel[], page: number, limit: number): RevenueModel[] => {
    return orderRevenue.slice(page * limit, page * limit + limit);
};

const RevenueTable: FC<RevenueTableProps> = ({ initialOrderRevenue }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const [orderRevenue, setOrderRevenue] = useState<RevenueModel[]>(initialOrderRevenue);
    const [totalRevenueDelivering, setTotalRevenueDelivering] = useState<number>(0);
    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const [totalOrder, setTotalOrder] = useState<number>(0);
    const [totalOrderDelivering, setTotalOrderDelivering] = useState<number>(0);
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);

    const getDataOrderRevenue = async () => {
        store.dispatch(change_is_loading(true));
        const res = await GetApi(`/shop/get/order-revenue/${month}/${year}`, localStorage.getItem('token'));
        if (res.data.message === 'Success') {
            setOrderRevenue(res.data.orderRevenue);
        }
        store.dispatch(change_is_loading(false));
    };
    const getTotalRevenue = async () => {
        if (user) {
            const res = await GetApi(`/shop/get/total-revenue/${month}/${year}`, localStorage.getItem('token'));
            if (res.data.message === 'Success') {
                if (res.data.totalRevenue) setTotalRevenue(res.data.totalRevenue);
                else setTotalRevenue(0);
                setTotalRevenueDelivering(res.data.totalDelivering);
            }
        }
    };
    const getTotalOrderAndProductSold = async () => {
        if (user) {
            const res = await GetApi(
                `/shop/get/total-order-productsold/${month}/${year}`,
                localStorage.getItem('token'),
            );
            if (res.data.message === 'Success') {
                setTotalOrder(res.data.orderCount);
                setTotalOrderDelivering(res.data.deliveringOrderCount);
            }
        }
    };
    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };
    const handleChangeMonth = (event: SelectChangeEvent) => {
        setMonth(Number(event.target.value));
    };
    const handleYearChange = (event: SelectChangeEvent) => {
        setYear(Number(event.target.value));
    };

    const paginatedOrderRevenue = applyPagination(orderRevenue || [], page, limit);

    useEffect(() => {
        if (initialOrderRevenue) setOrderRevenue(initialOrderRevenue);
    }, [initialOrderRevenue]);
    useEffect(() => {
        if (user) {
            getDataOrderRevenue();
            getTotalRevenue();
            getTotalOrderAndProductSold();
        }
    }, [month, year]);
    return (
        <Container maxWidth="lg">
            <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
                <Grid item xs={12}>
                    <InfoCard
                        orderCount={totalOrder}
                        deliveringOrderCount = {totalOrderDelivering}
                        totalRevenue={totalRevenue}
                        totalRevenueDelivering = {totalRevenueDelivering}
                    />{' '}
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <Divider />
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                pr: 1,
                                pt: 1.5,
                                pb: 1,
                            }}
                        >
                            <CardHeader
                                sx={{ textTransform: 'capitalize' }}
                                action={<Box width={150}></Box>}
                                title={t('orderRevenue.OrderRevenueList')}
                            />

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <FormControl fullWidth sx={{ pr: 2 }}>
                                    <InputLabel id="select-month-label">{t('shopDashboard.Month')}</InputLabel>
                                    <Select
                                        labelId="select-month-label"
                                        id="select-month"
                                        label={t('shopDashboard.Month')}
                                        value={month.toString()}
                                        onChange={handleChangeMonth}
                                        sx={{ minWidth: 150 }}
                                    >
                                        {Array.from({ length: 12 }, (_, index) => (
                                            <MenuItem key={index + 1} value={index + 1}>
                                                {t('shopDashboard.Month')} {index + 1}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="select-year-label">{t('shopDashboard.Year')}</InputLabel>
                                    <Select
                                        labelId="select-year-label"
                                        id="select-year"
                                        label={t('shopDashboard.Year')}
                                        value={year.toString()}
                                        onChange={handleYearChange}
                                        sx={{ minWidth: 150 }}
                                    >
                                        {Array.from({ length: 2 }, (_, index) => (
                                            <MenuItem key={currentYear - index} value={currentYear - index}>
                                                {t('shopDashboard.Year')} {currentYear - index}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>{t('orderRevenue.TotalAmount')}</TableCell>
                                        <TableCell>{t('orderRevenue.VoucherReduce')}</TableCell>
                                        <TableCell>{t('orderRevenue.TransactionFee')}</TableCell>
                                        <TableCell>{t('orderRevenue.Revenue')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedOrderRevenue.map((orderRevenue) => {
                                        return (
                                            <TableRow hover key={orderRevenue.orderId}>
                                                <TableCell>
                                                    <Typography
                                                        variant="body1"
                                                        fontWeight="bold"
                                                        color="text.primary"
                                                        gutterBottom
                                                        noWrap
                                                    >
                                                        {orderRevenue.orderId}
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
                                                        {formatPrice(orderRevenue.totalAmount)}
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
                                                        {formatPrice(orderRevenue.voucherReduce)}
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
                                                        {formatPrice(orderRevenue.transactionFee)}
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
                                                        {formatPrice(orderRevenue.revenue)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box p={2}>
                            <TablePagination
                                component="div"
                                count={orderRevenue?.length}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleLimitChange}
                                page={page}
                                rowsPerPage={limit}
                                rowsPerPageOptions={[5, 10, 25, 30]}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

RevenueTable.propTypes = {
    initialOrderRevenue: PropTypes.array.isRequired,
};

RevenueTable.defaultProps = {
    initialOrderRevenue: [],
};
export default RevenueTable;
