import React, { FC, ChangeEvent, useState, useEffect, useRef } from 'react';
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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    styled,
    DialogActions,
    Stack,
    TextField,
    FormControl,
    FormHelperText,
} from '@mui/material';

import { filterSpecialInput, formatPrice, toastSuccess, toastWarning } from '../../../../untils/Logic';
import { change_is_loading } from '../../../../reducers/Actions';
import { useStore } from 'react-redux';
import { GetApi, PostApi } from '../../../../untils/Api';
import { useTranslation } from 'react-i18next';
import CheckIcon from '@mui/icons-material/Check';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ClearIcon from '@mui/icons-material/Clear';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import SearchIcon from '@mui/icons-material/Search';
import { HOST_BE } from '../../../../common/Common';

const Input = styled('input')({
    display: 'none',
});

interface AlertDeleteDialogProps {
    onClose: () => void;
    open: boolean;
    reportOrderId?: string;
    shopId?: string;
    onUpdate: () => void;
}
const AlertBanDialog: React.FC<AlertDeleteDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, reportOrderId, onUpdate, shopId } = props;
    const store = useStore();
    const handleClose = () => {
        onClose();
    };
    const handleDelete = async () => {
        onClose();
        store.dispatch(change_is_loading(true));
        try {
            const res_refund = await GetApi(
                `/admin/update/refund-report-order/${reportOrderId}`,
                localStorage.getItem('token'),
            );
            if (res_refund.data.message == 'Success') {
                const res = await PostApi(`/admin/ban-shop/${shopId}`, localStorage.getItem('token'), {});

                if (res.data.message === 'Success') {
                    toastSuccess(t('toast.Success'));
                    onUpdate();
                }
            }
        } catch (error) {
            console.error('Failed to delete category:', error);
            // Xử lý lỗi nếu cần
        }
        store.dispatch(change_is_loading(false));
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
            >
                <DialogTitle sx={{ textTransform: 'capitalize' }} id="dialog-title"></DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        {t('reportOrder.ConfirmToAcceptRefundOrderAndBanShop')} ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('action.Cancel')}</Button>
                    <Button onClick={handleDelete} autoFocus>
                        {t('action.Confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};
interface AlertInfoDialogProps {
    onClose: () => void;
    open: boolean;
    reportOrder?: any;
}

const AlertInfoDialog: React.FC<AlertInfoDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, reportOrder } = props;
    const store = useStore();
    const handleClose = () => {
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
                    {t('reportOrder.Info')}
                </DialogTitle>
                <DialogContent>
                    <Stack>
                        <TextField
                            margin="dense"
                            id="name"
                            name="name"
                            label="ID"
                            type="text"
                            fullWidth
                            value={reportOrder?.report?.id}
                            variant="outlined"
                            sx={{ mb: 1 }}
                        />
                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                            <TextField
                                margin="dense"
                                id="name"
                                name="name"
                                label={t('shop.Id')}
                                type="tex"
                                fullWidth
                                value={reportOrder?.shopId}
                                variant="outlined"
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                margin="dense"
                                id="name"
                                name="name"
                                label={t('shop.Name')}
                                type="tex"
                                fullWidth
                                value={reportOrder?.shopName}
                                variant="outlined"
                                sx={{ mb: 1 }}
                            />
                        </Stack>
                        <TextField
                            margin="dense"
                            id="name"
                            name="name"
                            label={t('reportOrder.Describe')}
                            type="name"
                            fullWidth
                            value={reportOrder?.report?.describe}
                            variant="outlined"
                            multiline
                            sx={{ mb: 1 }}
                        />
                        <FormControl variant="outlined">
                            <FormHelperText>{t('reportOrder.Image')}</FormHelperText>
                            {reportOrder?.report?.image ? (
                                <Avatar
                                    variant="square"
                                    sx={{ height: 200, width: 200, contain: 'cover' }}
                                    src={
                                        reportOrder?.report?.image
                                            ? reportOrder?.report?.image.startsWith('uploads')
                                                ? `${HOST_BE}/${reportOrder?.report?.image}`
                                                : reportOrder?.report?.image
                                            : ''
                                    }
                                ></Avatar>
                            ) : (
                                '...'
                            )}
                        </FormControl>
                    </Stack>
                    <Divider sx={{ mt: 1 }}></Divider>
                    <Stack>
                        <TextField
                            margin="dense"
                            id="name"
                            name="name"
                            label={t('reportOrder.ShopReason')}
                            type="name"
                            fullWidth
                            value={reportOrder?.report?.shopReason}
                            variant="outlined"
                            multiline
                            sx={{ mb: 1 }}
                        />
                        <FormControl variant="outlined">
                            <FormHelperText>{t('reportOrder.ShopImage')}</FormHelperText>
                            <Avatar
                                variant="square"
                                sx={{ height: 200, width: 200, contain: 'cover' }}
                                src={
                                    reportOrder?.report?.shopImage
                                        ? reportOrder?.report?.shopImage.startsWith('uploads')
                                            ? `${HOST_BE}/${reportOrder?.report?.shopImage}`
                                            : reportOrder?.report?.shopImage
                                        : ''
                                }
                            ></Avatar>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('action.Close')}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};
const AlertCancelDialog: React.FC<AlertDeleteDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, reportOrderId, onUpdate } = props;
    const store = useStore();
    const handleClose = () => {
        onClose();
    };
    const handleDelete = async () => {
        onClose();
        store.dispatch(change_is_loading(true));
        try {
            const res = await GetApi(
                `/admin/update/reject-reportOrder/${reportOrderId}`,
                localStorage.getItem('token'),
                {},
            );

            if (res.data.message === 'Success') {
                toastSuccess(t('toast.Success'));
                onUpdate();
            }
        } catch (error) {
            toastSuccess(t('toast.Fail'));
        }
        onClose();
        store.dispatch(change_is_loading(true));
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
                    {t('action.Cancel')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        {t('category.Admin.ConfirmToCancelReportShop')} ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('action.Cancel')}</Button>
                    <Button onClick={handleDelete} autoFocus>
                        {t('action.Confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

interface ComplaintReportTableProps {
    className?: string;
    initialShops: any[];
}

const applyPagination = (reportOrders: any[], page: number, limit: number): any[] => {
    return reportOrders.slice(page * limit, page * limit + limit);
};

const ComplaintReportTable: FC<ComplaintReportTableProps> = ({ initialShops }) => {
    const { t } = useTranslation();
    const store = useStore();
    const theme = useTheme();
    const [openInfo, setOpenInfo] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);
    const [openBan, setOpenBan] = useState(false);

    const [reportOrders, setReportOrders] = useState<any[]>(initialShops);
    const [selectedReportOrder, setSelectedReportOrder] = useState<any>();
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };

    const paginatedReportOrders = applyPagination(reportOrders, page, limit);

    const getDataCategory = async () => {
        if (filterId.length != 24) {
            store.dispatch(change_is_loading(true));
            const res = await GetApi('/admin/get/report-order', localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setReportOrders(res.data.reportOrders);
            }
            store.dispatch(change_is_loading(false));
        } else {
            store.dispatch(change_is_loading(true));
            const res = await GetApi(`/admin/get/report-order/${filterId}`, localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setReportOrders(res.data.reportOrders);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    const handleOpenDescrease = () => {
        setOpenInfo(true);
    };
    const handleOpenCancel = () => {
        setOpenCancel(true);
    };
    const handleCloseDecrease = () => {
        setOpenInfo(false);
    };
    const handleCloseCancel = () => {
        setOpenCancel(false);
    };
    const handleOpenBan = () => {
        setOpenBan(true);
    };
    const handleCloseBan = () => {
        setOpenBan(false);
    };
    useEffect(() => {
        setReportOrders(initialShops);
    }, [initialShops]);
    const [filterId, setFilterId] = useState<string>('');
    const typingTimeoutRef = useRef<any>(null);
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }
    const filterById = async (id: string) => {
        if (id != '') {
            store.dispatch(change_is_loading(true));
            const res = await GetApi(`/admin/get/report-order/${id}`, localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setReportOrders(res.data.reportOrders);
                setPage(0);
            }
            store.dispatch(change_is_loading(false));
        } else {
            store.dispatch(change_is_loading(true));
            const res = await GetApi('/admin/get/report-order', localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setReportOrders(res.data.reportOrders);
                setPage(0);
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
        <Card className="relative">
            <CardHeader
                sx={{ textTransform: 'capitalize' }}
                action={<Box width={150}></Box>}
                title={t('category.Admin.RequestWithdrawList')}
            />

            <div className="absolute top-2 right-5">
                <Input
                    value={filterId}
                    className="border border-gray-300 rounded-lg p-1"
                    style={{ display: 'block', width: 300 }}
                    placeholder={t('action.EnterID')}
                    onChange={(e) => {
                        filterSpecialInput(e.target.value, setFilterId);
                    }}
                />
            </div>
            <div className="absolute top-3 right-6">
                <SearchIcon />
            </div>
            <Divider />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Shop Id</TableCell>
                            <TableCell>{t('user.Describe')}</TableCell>
                            <TableCell>{t('reportOrder.Check')}</TableCell>

                            <TableCell align="right">{t('category.Admin.Actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedReportOrders?.map((reportOrder) => {
                            return (
                                <TableRow hover key={reportOrder.id}>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                            style={{ color: reportOrder.active == false ? 'red' : 'charcoal' }}
                                        >
                                            {reportOrder?.report?.id}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                            style={{ color: reportOrder.active == false ? 'red' : 'charcoal' }}
                                        >
                                            {reportOrder.shopId}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                            style={{ color: reportOrder.active == false ? 'red' : 'charcoal' }}
                                        >
                                            {reportOrder?.report?.describe}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                            style={{ color: reportOrder.active == false ? 'red' : 'charcoal' }}
                                        >
                                            {reportOrder?.report?.status ? t('orther.Processed') : t('orther.Unprocessed')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title={t('reportOrder.Info')} arrow>
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={() => {
                                                    handleOpenDescrease();
                                                    setSelectedReportOrder(reportOrder);
                                                }}
                                            >
                                                <InfoOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('reportOrder.RefundAndBanShop')} arrow>
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={() => {
                                                    handleOpenBan();
                                                    setSelectedReportOrder(reportOrder);
                                                }}
                                            >
                                                <TaskAltIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('action.Accept')} arrow>
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => {
                                                    handleOpenCancel();
                                                    setSelectedReportOrder(reportOrder);
                                                }}
                                            >
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <AlertInfoDialog open={openInfo} onClose={handleCloseDecrease} reportOrder={selectedReportOrder} />
            <AlertBanDialog
                open={openBan}
                onClose={handleCloseBan}
                reportOrderId={selectedReportOrder?.report?.id}
                shopId={selectedReportOrder?.shopId}
                onUpdate={getDataCategory}
            />
            <AlertCancelDialog
                open={openCancel}
                onClose={handleCloseCancel}
                reportOrderId={selectedReportOrder?.report?.id}
                onUpdate={getDataCategory}
            />
            <Box p={2}>
                <TablePagination
                    component="div"
                    count={reportOrders.length}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[5, 10, 25, 30]}
                />
            </Box>
        </Card>
    );
};

ComplaintReportTable.propTypes = {
    initialShops: PropTypes.array.isRequired,
};

ComplaintReportTable.defaultProps = {
    initialShops: [],
};

export default ComplaintReportTable;
