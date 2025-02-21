import React, { FC, ChangeEvent, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Tooltip,
    Divider,
    Box,
    Card,
    Checkbox,
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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Avatar,
    TextField,
    styled,
    FormControl,
    FormHelperText,
} from '@mui/material';

import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CloseIcon from '@mui/icons-material/Close';
import { toastError, toastSuccess, toastWarning } from '../../../../untils/Logic';
import { change_is_loading } from '../../../../reducers/Actions';
import { useSelector, useStore } from 'react-redux';
import { GetApi, PostApi } from '../../../../untils/Api';
import { useTranslation } from 'react-i18next';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { HOST_BE } from '../../../../common/Common';
import { ReportOrderModel } from '../../../../models/report_order';
import axios from 'axios';

const Input = styled('input')({
    display: 'none',
});


interface AlertCancelDialogProps {
    onClose: () => void;
    open: boolean;
    reportOrder?: any;
    onUpdate: () => void;
}

const AlertCancelDialog: React.FC<AlertCancelDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, reportOrder, onUpdate } = props;
    const [selectImage, setSelectImage] = useState<File | null>(null);

    const handleClose = () => {
        onClose();
    };
    const handleUpdateReport = async (reason: string, image: File) => {
        const formData = new FormData();
        formData.append('id', reportOrder.id ? reportOrder.id : '');
        formData.append('shopReason', reason);
        if (image) {
            const uniqueFilename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const imageBlob = await fetch(URL.createObjectURL(image)).then((response) => response.blob());
            formData.append('file', imageBlob, uniqueFilename);
        }
        try {
            const res = await axios.post(`${HOST_BE}/shop/update/status-reportOrder`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Nếu cần token
                },
            });

            if (res.data.message === 'Success') {
                toastSuccess(t('toast.Success'));
                handleClose();
            }
        } catch (error) {
        }
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
                PaperProps={{
                    component: 'form',
                    onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        const reason = formJson.reason;
                        const image = formJson.image;

                        await handleUpdateReport(reason, image);
                        handleClose();
                    },
                }}
            >
                <DialogTitle sx={{ textTransform: 'capitalize' }} id="dialog-title">
                    {t('reportOrder.RejectReportOrder')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        {t('reportOrder.WarningRejectRefund')} ?
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="reason"
                        name="reason"
                        label={t('reportOrder.ShopReason')}
                        type="name"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 1 }}
                    />
                    <FormControl variant="outlined">
                    <FormHelperText>{t('reportOrder.ShopImage')}</FormHelperText>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <Avatar
                            variant="square"
                            sx={{ minWidth: 200, minHeight: 200 }}
                            src={
                                selectImage
                                    ? URL.createObjectURL(selectImage)
                                    : undefined
                            }
                        />
                        <label htmlFor="image" style={{ position: 'absolute', bottom: '8px', right: '8px' }}>
                            <IconButton component="span" color="primary">
                                <UploadTwoToneIcon />
                            </IconButton>
                        </label>
                        <Input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }} // Ẩn input file
                            onChange={(e: any) => {
                                const file = e.target.files[0];
                                console.log(file);
                                if (
                                    file &&
                                    (file.type === 'image/png' ||
                                        file.type === 'image/jpeg' ||
                                        file.type === 'image/webp')
                                ) {
                                    setSelectImage(file);
                                } else {
                                    toastWarning('File type is not allowed');
                                }
                            }}
                        />
                    </Box>
                    </FormControl>
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('action.Cancel')}</Button>
                    <Button type="submit" >
                        {t('action.Confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

interface AcceptRefundDialogProps {
    onClose: () => void;
    open: boolean;
    reportOrderId?: string;
    onUpdate: () => void;
}

const AcceptRefundDialog: React.FC<AcceptRefundDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, reportOrderId, onUpdate } = props;
    const store = useStore();

    const handleClose = () => {
        onClose();
    };
    const handleAcceptRefund = async () => {
        onClose();
        store.dispatch(change_is_loading(true));
        try {
            const res = await GetApi(
                `/shop/update/refund-report-order/${reportOrderId}`,
                localStorage.getItem('token'),
                {},
            );

            if (res.data.message === 'Not enough money') {
                toastWarning(t('toast.NotEnoughMoneyInWallet'));
            }
            if (res.data.message === 'Success') {
                toastSuccess(t('toast.Success'));
                onUpdate();
            }
        } catch (error) {
            console.error('Thất bại', error);
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
                <DialogTitle sx={{ textTransform: 'capitalize' }} id="dialog-title">
                    {t('reportOrder.RefundOrder')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        {t('reportOrder.ConfirmToAcceptRefundOrder')} ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('action.Cancel')}</Button>
                    <Button onClick={handleAcceptRefund} autoFocus>
                        {t('action.Confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

interface ReportOrderDetailTableProps {
    className?: string;
    initialReports: ReportOrderModel[];
}

const applyPagination = (reportOrders: ReportOrderModel[], page: number, limit: number): ReportOrderModel[] => {
    return reportOrders.slice(page * limit, page * limit + limit);
};

const ReportOrderDetailTable: FC<ReportOrderDetailTableProps> = ({ initialReports }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const lng = useSelector((state: ReducerProps) => state.lng);
    const [openCancel, setOpenCancel] = useState(false);
    const [openAccept, setOpenAccept] = useState(false);
    const [reportOrders, setReportOrders] = useState<ReportOrderModel[]>(initialReports);
    const [selectedReportOrder, setSelectedReportOrder] = useState<ReportOrderModel | undefined>();
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);

    const getDataReportOrder = async () => {
        if (user) {
            store.dispatch(change_is_loading(true));
            const res = await GetApi(`/shop/get/report-order`, localStorage.getItem('token'));
            if (res.data.message === 'Success') {
                setReportOrders(res.data.reportOrders);
            }
            store.dispatch(change_is_loading(false));
        }
    };

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };

    const paginatedReportOrders = applyPagination(reportOrders, page, limit);

    const handleClickOpenCancelDialog = () => {
        setOpenCancel(true);
    };
    const handleCloseCancelDialog = () => {
        setSelectedReportOrder(undefined);
        setOpenCancel(false);
    };
    const handleClickOpenAcceptRefundDialog = () => {
        setOpenAccept(true);
    };
    const handleCloseAcceptRefundDialog = () => {
        setSelectedReportOrder(undefined);
        setOpenAccept(false);
    };

    useEffect(() => {
        if (initialReports) setReportOrders(initialReports);
    }, [initialReports]);

    return (
        <Card>
            <CardHeader
                sx={{ textTransform: 'capitalize' }}
                action={<Box width={150}></Box>}
                title={t('reportOrder.ReportOrderList')}
            />
            <Divider />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('order.Code')}</TableCell>
                            <TableCell>{t('product.Id')}</TableCell>
                            <TableCell>{t('reportOrder.Image')}</TableCell>
                            <TableCell>{t('reportOrder.Describe')}</TableCell>
                            <TableCell>{t('reportOrder.Check')}</TableCell>
                            <TableCell align="center">{t('action.Actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedReportOrders.map((report) => {
                            return (
                                <TableRow hover key={report.id}>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {report.orderId}
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
                                            {report.productDetailId}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {report.image ? (
                                            <Avatar
                                                variant="rounded"
                                                src={
                                                    report.image
                                                        ? report.image.startsWith('uploads')
                                                            ? `${HOST_BE}/${report.image}`
                                                            : report.image
                                                        : ''
                                                }
                                                alt="report image"
                                                sx={{
                                                    width: 160,
                                                    height: 80,
                                                    border: '2px solid transparent',
                                                    borderRadius: 0.5,
                                                    background:
                                                        'linear-gradient(white, white), linear-gradient(to right, #3f51b5, #000)',
                                                    backgroundClip: 'content-box, border-box',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                                }}
                                            />
                                        ) : (
                                            <Typography
                                                variant="body1"
                                                fontWeight="bold"
                                                color="text.primary"
                                                gutterBottom
                                                noWrap
                                            >
                                                {t('reportOrder.NoImage')}
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {report.describe}
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
                                            {report.check ? t('orther.Processed') : t('orther.Unprocessed')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={t('action.Accept')}arrow>
                                            <IconButton
                                                sx={{
                                                    '&:hover': {
                                                        background: theme.colors.primary.lighter,
                                                    },
                                                    color: theme.palette.primary.main,
                                                }}
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                    handleClickOpenAcceptRefundDialog();
                                                    setSelectedReportOrder(report);
                                                }}
                                            >
                                                <TaskAltIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('action.Cancel')} arrow>
                                            <IconButton
                                                sx={{
                                                    '&:hover': {
                                                        background: theme.colors.error.lighter,
                                                    },
                                                    color: theme.palette.error.main,
                                                }}
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                    handleClickOpenCancelDialog();
                                                    setSelectedReportOrder(report);
                                                }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <AlertCancelDialog
                open={openCancel}
                onClose={handleCloseCancelDialog}
                reportOrder={selectedReportOrder? selectedReportOrder : undefined}
                onUpdate={getDataReportOrder}
            />
            <AcceptRefundDialog
                open={openAccept}
                onClose={handleCloseAcceptRefundDialog}
                reportOrderId={selectedReportOrder?.id}
                onUpdate={getDataReportOrder}
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

ReportOrderDetailTable.propTypes = {
    initialReports: PropTypes.array.isRequired,
};

ReportOrderDetailTable.defaultProps = {
    initialReports: [],
};

export default ReportOrderDetailTable;
