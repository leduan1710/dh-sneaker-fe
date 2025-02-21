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
} from '@mui/material';

import { filterSpecialInput, formatPrice, toastSuccess, toastWarning } from '../../../../untils/Logic';
import { change_is_loading } from '../../../../reducers/Actions';
import { useStore } from 'react-redux';
import { GetApi, PostApi } from '../../../../untils/Api';
import { useTranslation } from 'react-i18next';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import SearchIcon from '@mui/icons-material/Search';

const Input = styled('input')({
    display: 'none',
});

interface AlertDeleteDialogProps {
    onClose: () => void;
    open: boolean;
    reportShopId?: string;
    shopId?: string;
    onUpdate: () => void;
}
const AlertBanDialog: React.FC<AlertDeleteDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, reportShopId, onUpdate, shopId } = props;
    const store = useStore();
    const handleClose = () => {
        onClose();
    };
    const handleDelete = async () => {
        onClose();
        store.dispatch(change_is_loading(true));
        try {
            const res_cancel = await PostApi(
                `/admin/cancel-report-shop/${reportShopId}`,
                localStorage.getItem('token'),
                {},
            );
            if (res_cancel.data.message == 'Success') {
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
                <DialogTitle sx={{ textTransform: 'capitalize' }} id="dialog-title">
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        {t('category.Admin.ConfirmToBanThisShop')} ?
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
const AlertDecreasetDialog: React.FC<AlertDeleteDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, reportShopId, onUpdate } = props;
    const store = useStore();
    const handleClose = () => {
        onClose();
    };
    const handleDelete = async () => {
        onClose();
        store.dispatch(change_is_loading(true));
        try {
            const res = await PostApi(`/admin/decrease-point-shop/${reportShopId}`, localStorage.getItem('token'), {
                decrease: 5,
            });

            if (res.data.message === 'Success') {
                toastSuccess(t('toast.Success'));
                onUpdate();
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
                <DialogTitle sx={{ textTransform: 'capitalize' }} id="dialog-title">
                    
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        {t('category.Admin.ConfirmToDecreasePoint')} ?
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
const AlertCancelDialog: React.FC<AlertDeleteDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, reportShopId, onUpdate } = props;
    const store = useStore();
    const handleClose = () => {
        onClose();
    };
    const handleDelete = async () => {
        onClose();
        store.dispatch(change_is_loading(true));
        try {
            const res = await PostApi(`/admin/cancel-report-shop/${reportShopId}`, localStorage.getItem('token'), {});

            if (res.data.message === 'Success') {
                toastSuccess(t('toast.Success'));
                onUpdate();
            }
        } catch (error) {
            console.error('Failed to delete category:', error);
            // Xử lý lỗi nếu cần
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

interface ReportShopTableProps {
    className?: string;
    initialShops: any[];
}

const applyPagination = (categories: any[], page: number, limit: number): any[] => {
    return categories.slice(page * limit, page * limit + limit);
};

const ReportShopTable: FC<ReportShopTableProps> = ({ initialShops }) => {
    const { t } = useTranslation();
    const store = useStore();
    const theme = useTheme();
    const [openDecrease, setOpenDecrease] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);
    const [openBan, setOpenBan] = useState(false);

    const [categories, setCategories] = useState<any[]>(initialShops);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedShop, setSelectedCategory] = useState<any>();
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };

    const paginatedCategories = applyPagination(categories, page, limit);

    const getDataCategory = async () => {
        if (filterId.length != 24) {
            store.dispatch(change_is_loading(true));
            const res = await GetApi('/admin/get/report-shop', localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setCategories(res.data.reportShop);
            }
            store.dispatch(change_is_loading(false));
        } else {
            store.dispatch(change_is_loading(true));
            const res = await GetApi(`/admin/get/report-shop/${filterId}`, localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setCategories(res.data.reportShop);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    const handleOpenDescrease = () => {
        setOpenDecrease(true);
    };
    const handleOpenCancel = () => {
        setOpenCancel(true);
    };
    const handleCloseDecrease = () => {
        setOpenDecrease(false);
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
        setCategories(initialShops);
    }, [initialShops]);
    const [filterId, setFilterId] = useState<string>('');
    const typingTimeoutRef = useRef<any>(null);
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }
    const filterById = async (id: string) => {
        if (id != '') {
            store.dispatch(change_is_loading(true));
            const res = await GetApi(`/admin/get/report-shop/${id}`, localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setCategories(res.data.reportShop);
                setPage(0);
            }
            store.dispatch(change_is_loading(false));
        } else {
            store.dispatch(change_is_loading(true));
            const resCategories = await GetApi('/admin/get/report-shop', localStorage.getItem('token'));

            if (resCategories.data.message == 'Success') {
                setCategories(resCategories.data.reportShop);
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

                            <TableCell align="right">{t('category.Admin.Actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedCategories.map((category) => {
                            return (
                                <TableRow hover key={category.id}>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                            style={{ color: category.active == false ? 'red' : 'charcoal' }}
                                        >
                                            {category.id}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                            style={{ color: category.active == false ? 'red' : 'charcoal' }}
                                        >
                                            {category.shopId}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                            style={{ color: category.active == false ? 'red' : 'charcoal' }}
                                        >
                                            {category.describe}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="right">
                                        <Tooltip title={t('category.Admin.Decrease')} arrow>
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => {
                                                    handleOpenDescrease();
                                                    setSelectedCategory(category);
                                                }}
                                            >
                                                <TextDecreaseIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('action.Ban')} arrow>
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => {
                                                    handleOpenBan();
                                                    setSelectedCategory(category);
                                                }}
                                            >
                                                <NotInterestedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('action.Cancel')} arrow>
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={() => {
                                                    handleOpenCancel();
                                                    setSelectedCategory(category);
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

            <AlertDecreasetDialog
                open={openDecrease}
                onClose={handleCloseDecrease}
                reportShopId={selectedShop?.id}
                onUpdate={getDataCategory}
            />
            <AlertBanDialog
                open={openBan}
                onClose={handleCloseBan}
                reportShopId={selectedShop?.id}
                shopId={selectedShop?.shopId}
                onUpdate={getDataCategory}
            />
            <AlertCancelDialog
                open={openCancel}
                onClose={handleCloseCancel}
                reportShopId={selectedShop?.id}
                onUpdate={getDataCategory}
            />
            <Box p={2}>
                <TablePagination
                    component="div"
                    count={categories.length}
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

ReportShopTable.propTypes = {
    initialShops: PropTypes.array.isRequired,
};

ReportShopTable.defaultProps = {
    initialShops: [],
};

export default ReportShopTable;
