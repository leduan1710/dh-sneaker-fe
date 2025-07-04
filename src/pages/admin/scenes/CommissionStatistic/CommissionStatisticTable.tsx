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
import AddIcon from '@mui/icons-material/Add';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { useTranslation } from 'react-i18next';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { change_is_loading } from '../../../../reducers/Actions';
import { GetApi, PostApi } from '../../../../untils/Api';
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
    TextField,
} from '@mui/material';
import { filterSpecialInput, formatPrice, toastError, toastSuccess } from '../../../../untils/Logic';
import TablePagination from '@mui/material/TablePagination';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

interface NoteDialogProps {
    onClose: () => void;
    open: boolean;
    commission?: any;
    onUpdate: () => void;
}

const NoteDialog: React.FC<NoteDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, commission, onUpdate } = props;
    const [commissionNote, setCommissionNote] = useState('');

    useEffect(() => {
        if (commission) setCommissionNote(commission?.note);
    }, [commission]);
    const handleClose = () => {
        onClose();
    };
    const handleConfirm = async () => {
        try {
            const updatedCommission = { ...commission, note: commissionNote };

            const res = await PostApi(`/admin/update/commission-note`, localStorage.getItem('token'), {
                commission: updatedCommission,
            });

            if (res.data.message === 'Success') {
                toastSuccess('Thành công');
                onUpdate();
            } else toastError('Thất bại');
        } catch (error) {
            console.error('Failed to delete :', error);
        }
        onClose();
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
                maxWidth={'xs'}
                fullWidth={true}
            >
                <DialogTitle sx={{ textTransform: 'capitalize' }} id="dialog-title">
                    Ghi chú hoa hồng
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="note"
                        label="Nhập ghi chú"
                        type="text"
                        value={commissionNote}
                        onChange={(e) => {
                            setCommissionNote(e.target.value);
                        }}
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleConfirm} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

interface ConfirmDialogProps {
    onClose: () => void;
    open: boolean;
    commissionId?: string;
    onUpdate: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, commissionId, onUpdate } = props;

    const handleClose = () => {
        onClose();
    };
    const handleConfirm = async () => {
        try {
            const res = await GetApi(
                `/admin/commission-paid-confirm/${commissionId}`,
                localStorage.getItem('token'),
                {},
            );

            if (res.data.message === 'Success') {
                toastSuccess('Xác nhận thành công');
                onUpdate();
            } else toastError('Xác nhận thất bại');
        } catch (error) {
            console.error('Failed to delete :', error);
        }
        onClose();
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
            >
                <DialogTitle sx={{ textTransform: 'capitalize' }} id="dialog-title">
                    Xác nhận thanh toán
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">Xác nhận đã thanh toán cho CTV này ?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleConfirm} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default function CommissionStatisticTable() {
    const theme = useTheme();

    const { t } = useTranslation();
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const [commissions, setCommissions] = useState<any[]>([]);
    const [selectedCommission, setSelectedCommission] = useState<any>();
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    // Pagination state
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [selectedMonth, setSetlectedMonth] = useState(currentMonth);
    const [selectedYear, setSetlectedYear] = useState(currentYear);

    const [openConfirm, setOpenConfirm] = useState(false);

    const handleClickOpenConfirmDialog = () => {
        setOpenConfirm(true);
    };
    const handleCloseConfirmDialog = () => {
        setSelectedCommission(undefined);
        setOpenConfirm(false);
    };

    const handleClickOpenCreate = () => {
        setOpenCreate(true);
    };
    const handleCloseCreate = () => {
        setOpenCreate(false);
    };

    const getDataCommission = async () => {
        store.dispatch(change_is_loading(true));
        const res = await GetApi(
            `/admin/get/commission-by-month-year/${selectedMonth}/${selectedYear}`,
            localStorage.getItem('token'),
        );

        if (res.data.message == 'Success') {
            setCommissions(res.data.commissions);
            setPage(0);
        }
        store.dispatch(change_is_loading(false));
    };

    useEffect(() => {
        if (user) getDataCommission();
    }, [selectedMonth, selectedYear]);

    const handlePageChange = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(0);
    };
    const paginatedCommssions = commissions.slice(page * limit, page * limit + limit);
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
                setCommissions(res.data.order);
                setPage(0);
            }
            store.dispatch(change_is_loading(false));
        } else {
            store.dispatch(change_is_loading(true));
            const res = await GetApi(`/shop/get/order-by-shop/${user.shopId}`, localStorage.getItem('token'));
            if (res.data.message === 'Success') {
                setCommissions(res.data.commissions);
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
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: 2 }}>
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
                    <FormControl variant="outlined" sx={{ minWidth: 120, marginRight: 2 }}>
                        <InputLabel>Chọn năm</InputLabel>
                        <Select
                            value={selectedYear}
                            onChange={(e) => setSetlectedYear(Number(e.target.value))}
                            label={t('order.Month')}
                        >
                            {Array.from({ length: currentYear - 2024 }, (_, index) => (
                                <MenuItem key={2025 + index} value={2025 + index}>
                                    {2025 + index}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên CTV</TableCell>
                            <TableCell>Hoa hồng</TableCell>
                            <TableCell>Thưởng</TableCell>
                            <TableCell>Tổng cộng</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Ghi chú</TableCell>
                            <TableCell align="right">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedCommssions.map((commission: any, index: number) => {
                            return (
                                <TableRow hover key={commission.id}>
                                    <TableCell>{commission.ctvName}</TableCell>
                                    <TableCell>{formatPrice(commission.commission)}</TableCell>
                                    <TableCell>{formatPrice(commission.bonus)}</TableCell>
                                    <TableCell>{formatPrice(commission.commission + commission.bonus)}</TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                backgroundColor: commission.isPaid ? '#2196F3' : '#F44336',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                display: 'inline-block',
                                                width: 150,
                                            }}
                                        >
                                            {commission.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: '300px' }}>{commission.note}</TableCell>

                                    <TableCell align="right">
                                        {commission.isPaid ? (
                                            <></>
                                        ) : (
                                            <Tooltip title={'Xác nhận đã thanh toán'} arrow>
                                                <IconButton
                                                    sx={{
                                                        '&:hover': {
                                                            background: theme.colors.primary.lighter,
                                                        },
                                                        color: theme.palette.success.main,
                                                    }}
                                                    color="inherit"
                                                    size="small"
                                                    onClick={() => {
                                                        handleClickOpenConfirmDialog();
                                                        setSelectedCommission(commission);
                                                    }}
                                                >
                                                    <CheckIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        <Tooltip title={'Ghi chú'} arrow>
                                            <IconButton
                                                sx={{
                                                    '&:hover': { background: theme.colors.primary.lighter },
                                                    color: theme.palette.primary.main,
                                                }}
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                    handleClickOpenCreate();
                                                    setSelectedCommission(commission);
                                                }}
                                            >
                                                <EditTwoToneIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                <ConfirmDialog
                    open={openConfirm}
                    onClose={handleCloseConfirmDialog}
                    commissionId={selectedCommission?.id}
                    onUpdate={getDataCommission}
                />
                <NoteDialog
                    open={openCreate}
                    onClose={handleCloseCreate}
                    commission={selectedCommission}
                    onUpdate={getDataCommission}
                />
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Số hàng mỗi trang"
                    component="div"
                    count={commissions.length}
                    rowsPerPage={limit}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                />
            </TableContainer>
        </>
    );
}
