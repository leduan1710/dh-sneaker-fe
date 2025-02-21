import React, { FC, ChangeEvent, useState, useEffect, useRef } from 'react';
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
    Input,
} from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

import { filterSpecialInput, formatPrice, toastSuccess } from '../../../../untils/Logic';
import { change_is_loading } from '../../../../reducers/Actions';
import { useSelector, useStore } from 'react-redux';
import { GetApi, PostApi } from '../../../../untils/Api';
import EditCateDialog from './EditDialog';
import { useTranslation } from 'react-i18next';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { formatDistanceToNow, set } from 'date-fns';
import { VoucherModel } from '../../../../models/voucher';
import { enUS, se, vi } from 'date-fns/locale';
import SearchIcon from '@mui/icons-material/Search';

interface AlertDeleteDialogProps {
    onClose: () => void;
    open: boolean;
    voucherId?: string;
    onUpdate: () => void;
}

const AlertDeleteDialog: React.FC<AlertDeleteDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, voucherId, onUpdate } = props;

    const handleClose = () => {
        onClose();
    };
    const handleDelete = async () => {
        try {
            const res = await GetApi(`/shop/delete-voucher/${voucherId}`, localStorage.getItem('token'), {});

            if (res.data.message === 'Success') {
                toastSuccess(t('toast.DeleteSuccess'));
                onUpdate();
            }
        } catch (error) {

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
                    {t('voucher.DeleteVoucher')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        {t('voucher.ConfirmToDeleteVoucher')} ?
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

interface VoucherTablesProps {
    className?: string;
    initialVouchers: VoucherModel[];
}

const applyPagination = (vouchers: VoucherModel[], page: number, limit: number): VoucherModel[] => {
    return vouchers.slice(page * limit, page * limit + limit);
};

const VoucherTables: FC<VoucherTablesProps> = ({ initialVouchers }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const lng = useSelector((state: ReducerProps) => state.lng);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [vouchers, setVouchers] = useState<VoucherModel[]>(initialVouchers);
    const [selectedVoucher, setSelectedVoucher] = useState<VoucherModel | undefined>();
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);

    const getDataVoucher = async () => {
        if (user) {
            if (filterId.length == 24) {
                store.dispatch(change_is_loading(true));
                const res = await GetApi(`/shop/get/voucher/${filterId}`, localStorage.getItem('token'));

                if (res.data.message == 'Success') {
                    setVouchers(res.data.voucher);
                    setPage(0);
                }
                store.dispatch(change_is_loading(false));
            } else {
                store.dispatch(change_is_loading(true));
                const resVouchers = await GetApi(`/shop/get/vouchers`, localStorage.getItem('token'));
                if (resVouchers.data.message === 'Success') {
                    setVouchers(resVouchers.data.vouchers);
                }
                store.dispatch(change_is_loading(false));
            }
        }
    };

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };

    const paginatedVouchers = applyPagination(vouchers, page, limit);

    const handleClickOpenEditDialog = () => {
        setOpenEdit(true);
    };
    const handleCloseEditDialog = () => {
        setSelectedVoucher(undefined);
        setOpenEdit(false);
    };
    const handleClickOpenDeleteDialog = () => {
        setOpenDelete(true);
    };
    const handleCloseDeleteDialog = () => {
        setSelectedVoucher(undefined);
        setOpenDelete(false);
    };

    useEffect(() => {
        if (initialVouchers) setVouchers(initialVouchers);
    }, [initialVouchers]);
    // filter Id
    const [filterId, setFilterId] = useState<string>('');
    const typingTimeoutRef = useRef<any>(null);
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }
    const filterById = async (id: string) => {
        if (id != '') {
            store.dispatch(change_is_loading(true));
            const res = await GetApi(`/shop/get/voucher/${id}`, localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setVouchers(res.data.voucher);
                setPage(0);
            }
            store.dispatch(change_is_loading(false));
        } else {
            store.dispatch(change_is_loading(true));
            const resVouchers = await GetApi(`/shop/get/vouchers`, localStorage.getItem('token'));
            if (resVouchers.data.message === 'Success') {
                setVouchers(resVouchers.data.vouchers);
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
                title={t('voucher.VoucherList')}
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
                            <TableCell>{t('voucher.Name')}</TableCell>
                            <TableCell>{t('voucher.Code')}</TableCell>
                            <TableCell>{t('voucher.Reduce')}</TableCell>
                            <TableCell>{t('voucher.Condition')}</TableCell>
                            <TableCell>{t('voucher.ExpireDate')}</TableCell>
                            <TableCell align="right">{t('action.Actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedVouchers.map((voucher) => {
                            return (
                                <TableRow hover key={voucher.id}>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {voucher.id}
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
                                            {voucher.name}
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
                                            {voucher.code}
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
                                            {formatPrice(voucher.reduce)}
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
                                            {formatPrice(voucher.condition)}
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
                                            {new Date(voucher.expired) < new Date()
                                                ? t('voucher.Expired')
                                                : lng === 'vn'
                                                ? formatDistanceToNow(new Date(voucher.expired), {
                                                      addSuffix: true,
                                                      locale: vi,
                                                  })
                                                : formatDistanceToNow(new Date(voucher.expired), {
                                                      addSuffix: true,
                                                      locale: enUS,
                                                  })}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title={t('action.Edit')} arrow>
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
                                                    handleClickOpenEditDialog();
                                                    setSelectedVoucher(voucher);
                                                }}
                                            >
                                                <EditTwoToneIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('action.Delete')} arrow>
                                            <IconButton
                                                sx={{
                                                    '&:hover': { background: theme.colors.error.lighter },
                                                    color: theme.palette.error.main,
                                                }}
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                    handleClickOpenDeleteDialog();
                                                    setSelectedVoucher(voucher);
                                                }}
                                            >
                                                <DeleteTwoToneIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <AlertDeleteDialog
                open={openDelete}
                onClose={handleCloseDeleteDialog}
                voucherId={selectedVoucher?.id}
                onUpdate={getDataVoucher}
            />
            <EditCateDialog
                open={openEdit}
                onClose={handleCloseEditDialog}
                voucher={selectedVoucher}
                onUpdate={getDataVoucher}
            />
            <Box p={2}>
                <TablePagination
                    component="div"
                    count={vouchers.length}
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

VoucherTables.propTypes = {
    initialVouchers: PropTypes.array.isRequired,
};

VoucherTables.defaultProps = {
    initialVouchers: [],
};

export default VoucherTables;
