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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Avatar,
    TextField,
} from '@mui/material';

import TaskAltIcon from '@mui/icons-material/TaskAlt';
import EditIcon from '@mui/icons-material/Edit';
import { formatPrice, toastError, toastSuccess } from '../../../../untils/Logic';
import { change_is_loading } from '../../../../reducers/Actions';
import { useSelector, useStore } from 'react-redux';
import { GetApi, PostApi } from '../../../../untils/Api';
import { useTranslation } from 'react-i18next';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { formatDistanceToNow, set } from 'date-fns';
import { enUS, se, vi } from 'date-fns/locale';
import { ReportModel } from '../../../../models/report';
import { HOST_BE } from '../../../../common/Common';
import axios from 'axios';

interface AlertCheckDialogProps {
    onClose: () => void;
    open: boolean;
    reportProduct?: any;
    onUpdate: () => void;
}

const AlertCheckDialog: React.FC<AlertCheckDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, reportProduct, onUpdate } = props;

    const handleClose = () => {
        onClose();
    };
    const handleUpdateReport = async (reason: string) => {
        try {
            const res = await PostApi(
                `/shop/update/status-reportProduct`,
                localStorage.getItem('token'),
                { id: reportProduct.id, shopReason: reason },
            );

            if (res.data.message === 'Success') {
                toastSuccess(t('toast.Success'));
                onUpdate();
            } else toastError(t('toast.Fail'));
        } catch (error) {}
        onClose();
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="dialog-title"
                maxWidth="sm"
                fullWidth={true}
                aria-describedby="dialog-description"
                PaperProps={{
                    component: 'form',
                    onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        const reason = formJson.reason;
                        await handleUpdateReport(reason);
                        handleClose();
                    },
                }}
            >
                <DialogTitle sx={{ textTransform: 'capitalize' }} id="dialog-title">
                    {t('reportProduct.Explanation')}
                </DialogTitle>
                <DialogContent>

                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="reason"
                        name="reason"
                        label={t('reportProduct.ShopReason')}
                        type="name"
                        fullWidth
                        multiline
                        minRows={4}
                        variant="outlined"
                        sx={{ mb: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('action.Cancel')}</Button>
                    <Button type="submit">{t('action.Confirm')}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

interface ReportProductTablesProps {
    className?: string;
    initialReports: ReportModel[];
}

const applyPagination = (reports: ReportModel[], page: number, limit: number): ReportModel[] => {
    return reports.slice(page * limit, page * limit + limit);
};

const ReportProductTables: FC<ReportProductTablesProps> = ({ initialReports }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const lng = useSelector((state: ReducerProps) => state.lng);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [reports, setReports] = useState<ReportModel[]>(initialReports);
    const [selectedReport, setSelectedReport] = useState<ReportModel | undefined>();
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);

    const getDataReport = async () => {
        if (user) {
            store.dispatch(change_is_loading(true));
            const res = await GetApi(`/shop/get/report-product`, localStorage.getItem('token'));
            if (res.data.message === 'Success') {
                setReports(res.data.reports);
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

    const paginatedReports = applyPagination(reports, page, limit);

    const handleClickOpenDeleteDialog = () => {
        setOpenDelete(true);
    };
    const handleCloseDeleteDialog = () => {
        setSelectedReport(undefined);
        setOpenDelete(false);
    };

    useEffect(() => {
        if (initialReports) setReports(initialReports);
    }, [initialReports]);

    return (
        <Card>
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
                            <TableCell>{t('reportProduct.ProductName')}</TableCell>
                            <TableCell>{t('reportProduct.ProductImage')}</TableCell>
                            <TableCell>{t('reportProduct.Describe')}</TableCell>
                            <TableCell>{t('reportProduct.Check')}</TableCell>
                            <TableCell align="center">{t('action.Actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedReports.map((report) => {
                            return (
                                <TableRow hover key={report.id}>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            align="justify"
                                            maxWidth={400}
                                        >
                                            {report.productName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Avatar
                                            variant="rounded"
                                            src={
                                                report.productImage.startsWith('uploads')
                                                    ? `${HOST_BE}/${report.productImage}`
                                                    : report.productImage
                                            }
                                            alt={report.productName}
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                border: '4px solid transparent',
                                                borderRadius: 1,
                                                background:
                                                    'linear-gradient(white, white), linear-gradient(to right, #3f51b5, #000)',
                                                backgroundClip: 'content-box, border-box',
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                            }}
                                        />
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
                                            {report.shopReason ? t('reportProduct.Explaned') : t('reportProduct.Unexplaned')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={t('reportProduct.Explanation')} arrow>
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
                                                    handleClickOpenDeleteDialog();
                                                    setSelectedReport(report);
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <AlertCheckDialog
                open={openDelete}
                onClose={handleCloseDeleteDialog}
                reportProduct={selectedReport}
                onUpdate={getDataReport}
            />
            <Box p={2}>
                <TablePagination
                    component="div"
                    count={reports.length}
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

ReportProductTables.propTypes = {
    initialReports: PropTypes.array.isRequired,
};

ReportProductTables.defaultProps = {
    initialReports: [],
};

export default ReportProductTables;
