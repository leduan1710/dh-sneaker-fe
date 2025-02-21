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
import { HOST_BE } from '../../../../common/Common';
import { filterSpecialInput, formatPrice, toastSuccess, toastWarning } from '../../../../untils/Logic';
import { change_is_loading } from '../../../../reducers/Actions';
import axios from 'axios';
import { useStore } from 'react-redux';
import { GetApi, PostApi } from '../../../../untils/Api';
import { useTranslation } from 'react-i18next';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

const Input = styled('input')({
    display: 'none',
});

interface AlertDeleteDialogProps {
    onClose: () => void;
    open: boolean;
    requestWithdrawId?: string;
    onUpdate: () => void;
}

const AlertAcceptDialog: React.FC<AlertDeleteDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, requestWithdrawId, onUpdate } = props;
    const store = useStore();
    const handleClose = () => {
        onClose();
    };
    const handleDelete = async () => {
        onClose();
        store.dispatch(change_is_loading(true));
        try {
            const res_withdraw = await PostApi('/admin/withdraw', localStorage.getItem('token'), {
                requestWithdrawId: requestWithdrawId,
            });
            if (res_withdraw.status == 200) {
                const res = await PostApi(
                    `/admin/accept-withdraw/${requestWithdrawId}`,
                    localStorage.getItem('token'),
                    {},
                );

                if (res.data.message === 'Success') {
                    toastSuccess(t('toast.Success'));
                    onUpdate();
                }
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
                <DialogTitle sx={{ textTransform: 'capitalize' }} id="dialog-title">
                    {t('action.Accept')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        {t('category.Admin.ConfirmToAcceptWithdraw')} ?
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
    const { onClose, open, requestWithdrawId, onUpdate } = props;
    const store = useStore();
    const handleClose = () => {
        onClose();
    };
    const handleDelete = async () => {
        onClose();
        store.dispatch(change_is_loading(true));
        try {
            const res = await PostApi(`/admin/cancel-withdraw/${requestWithdrawId}`, localStorage.getItem('token'), {});

            if (res.data.message === 'Success') {
                toastSuccess(t('toast.Success'));
                onUpdate();
            }
        } catch (error) {
            console.error('Failed to delete category:', error);
            // Xử lý lỗi nếu cần
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
                <DialogTitle sx={{ textTransform: 'capitalize' }} id="dialog-title">
                {t('action.Cancel')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        {t('category.Admin.ConfirmToCancelWithdraw')} ?
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

interface RequestWithDrawTableProps {
    className?: string;
    initialShops: any[];
}

const applyPagination = (categories: any[], page: number, limit: number): any[] => {
    return categories.slice(page * limit, page * limit + limit);
};

const RequestWithDrawTable: FC<RequestWithDrawTableProps> = ({ initialShops }) => {
    const { t } = useTranslation();
    const store = useStore();
    const [openAccpet, setOpenAccept] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);
    const [categories, setCategories] = useState<any[]>(initialShops);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const selectedBulkActions = selectedCategories.length > 0;
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
    const theme = useTheme();

    const getDataRequestWithDraw = async () => {
        if (filterId.length != 24) {
            store.dispatch(change_is_loading(true));
            const res = await GetApi('/admin/get/request-withdraw', localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setCategories(res.data.requestWithdraw);
            }
            store.dispatch(change_is_loading(false));
        } else {
            store.dispatch(change_is_loading(true));
            const res = await GetApi(`/admin/get/request-withdraw/${filterId}`, localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setCategories(res.data.requestWithdraw);
                setPage(0);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    const handleOpenAccept = () => {
        setOpenAccept(true);
    };
    const handleOpenCancel = () => {
        setOpenCancel(true);
    };
    const handleCloseAccept = () => {
        setOpenAccept(false);
    };
    const handleCloseCancel = () => {
        setOpenCancel(false);
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
            const res = await GetApi(`/admin/get/request-withdraw/${id}`, localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setCategories(res.data.requestWithdraw);
                setPage(0);
            }
            store.dispatch(change_is_loading(false));
        } else {
            store.dispatch(change_is_loading(true));
            const res = await GetApi('/admin/get/request-withdraw', localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setCategories(res.data.requestWithdraw);
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
                            <TableCell>User Id</TableCell>
                            <TableCell>Value</TableCell>
                            <TableCell>{t('user.NameBank')}</TableCell>
                            <TableCell>{t('user.NumberAccount')}</TableCell>
                            <TableCell>{t('user.NameAccount')}</TableCell>

                            <TableCell align="right">{t('category.Admin.Actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedCategories.map((category) => {
                            const isCategorySelected = selectedCategories.includes(category.id);
                            return (
                                <TableRow hover key={category.id} selected={isCategorySelected}>
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
                                            {category.userId}
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
                                            {formatPrice(category.value)}
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
                                            {category.nameBank}
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
                                            {category.numberBank}
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
                                            {category.nameUser}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title={t('action.Accept')} arrow>
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
                                                    handleOpenAccept();
                                                    setSelectedCategory(category);
                                                }}
                                            >
                                                <CheckIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('action.Reject')} arrow>
                                            <IconButton
                                                color="error"
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

            <AlertAcceptDialog
                open={openAccpet}
                onClose={handleCloseAccept}
                requestWithdrawId={selectedShop?.id}
                onUpdate={getDataRequestWithDraw}
            />
            <AlertCancelDialog
                open={openCancel}
                onClose={handleCloseCancel}
                requestWithdrawId={selectedShop?.id}
                onUpdate={getDataRequestWithDraw}
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

RequestWithDrawTable.propTypes = {
    initialShops: PropTypes.array.isRequired,
};

RequestWithDrawTable.defaultProps = {
    initialShops: [],
};

export default RequestWithDrawTable;
