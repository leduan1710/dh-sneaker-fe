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
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import BlockIcon from '@mui/icons-material/Block';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import SearchIcon from '@mui/icons-material/Search';
import { HOST_BE } from '../../../../common/Common';
import { Tty } from '@mui/icons-material';

const Input = styled('input')({
    display: 'none',
});

interface AlertDeleteDialogProps {
    onClose: () => void;
    open: boolean;
    reportProduct?: any;
    shopId?: string;
    onUpdate: () => void;
}
const AlertBanDialog: React.FC<AlertDeleteDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, reportProduct, onUpdate, shopId } = props;
    const store = useStore();
    const handleClose = () => {
        onClose();
    };
    const handleDelete = async () => {
        onClose();
        store.dispatch(change_is_loading(true));
        try {
            const res = await PostApi(`/admin/ban-product/${reportProduct?.report?.productId}`, localStorage.getItem('token'), {reportProductId: reportProduct?.report?.id});

            if (res.data.message === 'Success') {
                toastSuccess(t('toast.Success'));
                onUpdate();
            }
        } catch (error) {}
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
                    <DialogContentText id="dialog-description">{t('action.BanProduct')} ?</DialogContentText>
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
    reportProduct?: any;
}

const AlertInfoDialog: React.FC<AlertInfoDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, reportProduct } = props;
    const store = useStore();
    const handleClose = () => {
        onClose();
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="xs"
                fullWidth={true}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
            >
                <DialogTitle sx={{ textTransform: 'capitalize' }} id="dialog-title">
                    {t('reportProduct.Detail')}
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
                            value={reportProduct?.report?.id}
                            variant="outlined"
                            sx={{ mb: 1 }}
                        />
                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                            <TextField
                                margin="dense"
                                id="name"
                                name="name"
                                label={t('product.Id')}
                                type="tex"
                                fullWidth
                                value={reportProduct?.productId}
                                variant="outlined"
                                sx={{ mb: 1 }}
                            />
                        </Stack>
                        <TextField
                            margin="dense"
                            id="name"
                            name="name"
                            label={t('product.Name')}
                            type="tex"
                            fullWidth
                            value={reportProduct?.productName}
                            variant="outlined"
                            sx={{ mb: 1 }}
                        />
                        <TextField
                            margin="dense"
                            id="name"
                            name="name"
                            label={t('reportProduct.Describe')}
                            type="name"
                            fullWidth
                            value={reportProduct?.report?.describe}
                            variant="outlined"
                            multiline
                            sx={{ mb: 1 }}
                        />
                    </Stack>
                    <Divider sx={{ mt: 1 }}></Divider>
                    <Stack>
                        <TextField
                            margin="dense"
                            id="name"
                            name="name"
                            label={t('reportProduct.Explanation')}
                            type="name"
                            fullWidth
                            value={reportProduct?.report?.shopReason}
                            variant="outlined"
                            multiline
                            sx={{ mb: 1 }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('action.Close')}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};
const AlertRequestExplanation: React.FC<AlertDeleteDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, reportProduct, onUpdate } = props;
    const store = useStore();
    const handleClose = () => {
        onClose();
    };
    const handleDelete = async () => {
        onClose();
        store.dispatch(change_is_loading(true));
        try {
            const res = await PostApi(`/admin/update/request-explain-reportProduct`, localStorage.getItem('token'), {
                reportProductId: reportProduct?.report?.id,
                productName: reportProduct?.productName,
            });

            if (res.data.message === 'Success') {
                toastSuccess(t('toast.Success'));
                onUpdate();
            }
        } catch (error) {
            toastSuccess(t('toast.Fail'));
        }
        onClose();
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
                    <DialogContentText id="dialog-description" align="center" variant="body1">
                        {t('action.RequestExplaination')} ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button sx={{ width: 100 }} onClick={handleClose}>
                        {t('action.Cancel')}
                    </Button>
                    <Button onClick={handleDelete} autoFocus>
                        {t('action.Confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

interface ReportProductTableProps {
    className?: string;
    initialShops: any[];
}

const applyPagination = (reportOrders: any[], page: number, limit: number): any[] => {
    return reportOrders.slice(page * limit, page * limit + limit);
};

const ReportProductTable: FC<ReportProductTableProps> = ({ initialShops }) => {
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
            store.dispatch(change_is_loading(true));
            const res = await GetApi('/admin/get/report-product', localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setReportOrders(res.data.reportProducts);
            }
            store.dispatch(change_is_loading(false));
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

    return (
        <Card className="relative">
            <CardHeader
                sx={{ textTransform: 'capitalize' }}
                action={<Box width={150}></Box>}
                title={t('reportProduct.ReportList')}
            />
            <Divider />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('product.Id')}</TableCell>
                            <TableCell>{t('product.Name')}</TableCell>
                            <TableCell>{t('reportProduct.Describe')}</TableCell>
                            <TableCell>{t('reportProduct.Explanation')}</TableCell>

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
                                            {reportOrder.productId}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            sx={{ maxWidth: 250 }}
                                            style={{ color: reportOrder.active == false ? 'red' : 'charcoal' }}
                                        >
                                            {reportOrder.productName}
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
                                            sx={{ maxWidth: 250 }}
                                            style={{ color: reportOrder.active == false ? 'red' : 'charcoal' }}
                                        >
                                            {reportOrder?.report?.shopReason
                                                ? t('reportProduct.Explaned')
                                                : t('reportProduct.Unexplaned')}
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
                                        <Tooltip title={t('action.BanProduct')} arrow>
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => {
                                                    handleOpenBan();
                                                    setSelectedReportOrder(reportOrder);
                                                }}
                                            >
                                                <BlockIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('action.RequestExplaination')} arrow>
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                disabled={reportOrder?.report?.shopReason}
                                                onClick={() => {
                                                    handleOpenCancel();
                                                    setSelectedReportOrder(reportOrder);
                                                }}
                                            >
                                                <NotificationsActiveIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <AlertInfoDialog open={openInfo} onClose={handleCloseDecrease} reportProduct={selectedReportOrder} />
            <AlertBanDialog
                open={openBan}
                onClose={handleCloseBan}
                reportProduct={selectedReportOrder}
                shopId={selectedReportOrder?.shopId}
                onUpdate={getDataCategory}
            />
            <AlertRequestExplanation
                open={openCancel}
                onClose={handleCloseCancel}
                reportProduct={selectedReportOrder}
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

ReportProductTable.propTypes = {
    initialShops: PropTypes.array.isRequired,
};

ReportProductTable.defaultProps = {
    initialShops: [],
};

export default ReportProductTable;
