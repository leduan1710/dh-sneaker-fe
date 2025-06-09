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
    Stack,
} from '@mui/material';
import { filterSpecialInput, formatPrice, shortedString } from '../../../../untils/Logic';
import TablePagination from '@mui/material/TablePagination';
import StatusUpdateDialog from './StatusUpdateDialog';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import DeliveryCodeDialog from './DeliveryCodeDialog';

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
    const [showImage, setShowImage] = useState(true);
    const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
    const [deliveryCode, setDeliveryCode] = useState('');

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
                    {order.shipMethod === 'GRAB'
                        ? 'Grab/Kho khác'
                        : order.shipMethod === 'VIETTELPOST'
                        ? 'Viettelpost'
                        : order.shipMethod === 'GGDH'
                        ? 'Đổi hàng'
                        : 'Offline'}
                </TableCell>
                <TableCell>{formatPrice(order.shipFee)}</TableCell>
                <TableCell>{formatPrice(order.CODPrice)}</TableCell>
                <TableCell align="right">
                    {order.status === 'PROCESSING' ? (
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
                    colSpan={8}
                >
                    <Box
                        sx={{
                            marginBottom: 1,
                            width: '100%',
                            padding: 2,
                            bgcolor: 'rgba(199, 232, 255, 0.5)',
                            borderRadius: '4px',
                        }}
                    >
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
                                    <strong>Địa chỉ:</strong> {order.addressDetail}, {order.address.ward.WARDS_NAME},{' '}
                                    {order.address.district.DISTRICT_NAME}, {order.address.province.PROVINCE_NAME}
                                </Typography>
                            )}

                            <Typography variant="body1" gutterBottom component="div">
                                <strong>Ghi chú:</strong>{' '}
                                <span style={{ fontWeight: 'bold', color: '#C0392B' }}>{order.ctvNote}</span>
                                {order.noteImageList.length > 0 && (
                                    <span
                                        style={{ cursor: 'pointer', color: 'blue', marginLeft: '10px' }}
                                        onClick={handleToggleImage}
                                    >
                                        {showImage ? 'Ẩn ảnh ghi chú' : 'Ảnh ghi chú'}
                                    </span>
                                )}
                            </Typography>

                            {showImage && order.noteImageList.length > 0 && (
                                <Stack direction="row" spacing={1}>
                                    {order.noteImageList.map((image: string, index: number) => (
                                        <Avatar
                                            variant="square"
                                            src={image.startsWith('uploads') ? `${HOST_BE}/${image}` : image}
                                            alt="Ghi chú"
                                            style={{ maxWidth: '100%', height: 'auto', minWidth: '150px' }}
                                        />
                                    ))}
                                </Stack>
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
                                    const totalAmount = detail.sellPrice * detail.quantity;
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
            <DeliveryCodeDialog
                open={showDeliveryDialog}
                onClose={() => {
                    handleUpdateOrderList();
                    setShowDeliveryDialog(false);
                }}
                deliveryCode={deliveryCode}
            />
            <StatusUpdateDialog
                open={openUpdateStatus}
                onClose={handleCloseUpdateStatusDialog}
                order={order}
                onUpdate={(deliveryCode) => {
                    setDeliveryCode(deliveryCode);
                    setShowDeliveryDialog(true);
                }}
                selection={selection}
            />
        </React.Fragment>
    );
}

export default function NewOrderTable() {
    const { t } = useTranslation();
    const store = useStore();
    const location = useLocation();
    const { status } = location.state ? location.state : 'ALL';
    const user = useSelector((state: ReducerProps) => state.user);
    const [orders, setOrders] = useState<any[]>([]);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [shipMethodFilter, setShipMethodFilter] = useState<string>('ALL');
    const [ctvFilter, setCtvFilter] = useState('ALL');
    const [ctvNames, setCtvNames] = useState<string[]>([]);
    // Pagination state
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [count, setCount] = useState(0);
    const [step, setStep] = useState<number>(1);

    const getDataOrder = async () => {
        store.dispatch(change_is_loading(true));
        if (ctvFilter === 'ALL') {
            const res = await PostApi(`/admin/get-new-orders/${15}/${step}`, localStorage.getItem('token'), {
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
                `/admin/get-new-orders-by-ctv/${ctvFilter}/${15}/${step}`,
                localStorage.getItem('token'),
                {
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
    const getDataCTVName = async () => {
        const res = await GetApi(`/admin/get/ctvNameList`, localStorage.getItem('token'));

        if (res.data.message == 'Success') {
            const names = res.data.ctvNameList.map((ctv: any) => ctv.name);
            setCtvNames(names);
        }
    };

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
        getDataOrder();
    }, [ctvFilter, shipMethodFilter]);
    useEffect(() => {
        getDataCTVName();
    }, []);
    useEffect(() => {
        if (status) {
            getDataOrder();
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

    const paginatedOrders = orders.slice(page * limit, page * limit + limit);

    const typingTimeoutRef = useRef<any>(null);
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }
    const filterById = async (searchTerm: string) => {
        if (searchTerm != '') {
            store.dispatch(change_is_loading(true));
            const res = await PostApi(`/admin/search/new-order-by-phone`, localStorage.getItem('token'), {
                searchTerm: searchTerm,
            });
            if (res.data.message == 'Success') {
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
            filterById(searchTerm);
        }, 500);
    }, [searchTerm]);
    return (
        <>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
                    <Box>
                        <FormControl variant="outlined" sx={{ minWidth: 200, marginRight: 2 }}>
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
                    </Box>
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
                <TableContainer sx={{ height: 640 }}>
                    <Table stickyHeader>
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
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Số đơn mỗi trang"
                    component="div"
                    count={count}
                    rowsPerPage={limit}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                />
            </Paper>
        </>
    );
}
