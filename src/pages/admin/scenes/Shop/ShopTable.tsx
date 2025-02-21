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
import SwitchAccessShortcutAddIcon from '@mui/icons-material/SwitchAccessShortcutAdd';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { HOST_BE } from '../../../../common/Common';
import { filterSpecialInput, toastSuccess } from '../../../../untils/Logic';
import { change_is_loading } from '../../../../reducers/Actions';
import axios from 'axios';
import { useStore } from 'react-redux';
import { GetApi, PostApi } from '../../../../untils/Api';
import DetailDialog from './DetailDialog';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';

const Input = styled('input')({
    display: 'none',
});

interface AlertDeleteDialogProps {
    onClose: () => void;
    open: boolean;
    shopId?: string;
    onUpdate: () => void;
}

const AlertDeleteDialog: React.FC<AlertDeleteDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, shopId, onUpdate } = props;
    const store = useStore();

    const handleClose = () => {
        onClose();
    };
    const handleDelete = async () => {
        onClose();
        store.dispatch(change_is_loading(true));
        try {
            const res = await PostApi(`/admin/ban-shop/${shopId}`, localStorage.getItem('token'), {});

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
                    {t('category.Admin.BanShop')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        {t('category.Admin.ConfirmToBanShop')} ?
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
const AlertUnBanDialog: React.FC<AlertDeleteDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, shopId, onUpdate } = props;
    const store = useStore();
    const handleClose = () => {
        onClose();
    };
    const handleDelete = async () => {
        onClose();
        store.dispatch(change_is_loading(true));

        try {
            const res = await PostApi(`/admin/unban-shop/${shopId}`, localStorage.getItem('token'), {});

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
                    {t('category.Admin.UnBanShop')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        {t('category.Admin.ConfirmToUnBanShop')} ?
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

interface ShopTableProps {
    className?: string;
    initialShops: any[];
}

const applyPagination = (categories: any[], page: number, limit: number): any[] => {
    return categories.slice(page * limit, page * limit + limit);
};

const ShopTable: FC<ShopTableProps> = ({ initialShops }) => {
    const { t } = useTranslation();
    const store = useStore();
    const [openDetail, setOpenDetail] = useState(false);
    const [openBan, setOpenBan] = useState(false);
    const [openUnBan, setOpenUnBan] = useState(false);
    const [categories, setCategories] = useState<any[]>(initialShops);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const selectedBulkActions = selectedCategories.length > 0;
    const [selectedShop, setSelectedCategory] = useState<any>();
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);

    const handleSelectAllCategories = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedCategories(event.target.checked ? categories.map((category) => category.id) : []);
    };

    const handleSelectOneCategory = (event: ChangeEvent<HTMLInputElement>, categoryId: string): void => {
        if (!selectedCategories.includes(categoryId)) {
            setSelectedCategories((prevSelected) => [...prevSelected, categoryId]);
        } else {
            setSelectedCategories((prevSelected) => prevSelected.filter((id) => id !== categoryId));
        }
    };

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };

    const paginatedCategories = applyPagination(categories, page, limit);
    const selectedSomeCategories = selectedCategories.length > 0 && selectedCategories.length < categories.length;
    const selectedAllCategories = selectedCategories.length === categories.length;
    const theme = useTheme();

    const handleClickOpenDetailDialog = () => {
        setOpenDetail(true);
    };
    const handleCloseDetailDialog = () => {
        setSelectedCategory(undefined);
        setOpenDetail(false);
    };
    const handleCloseUnBanDialog = () => {
        setSelectedCategory(undefined);
        setOpenUnBan(false);
    };

    const handleClickOpenBanDialog = () => {
        setOpenBan(true);
    };
    const handleClickOpenUnBanDialog = () => {
        setOpenUnBan(true);
    };
    const handleCloseBanDialog = () => {
        setSelectedCategory(undefined);
        setOpenBan(false);
    };

    const getDataCategory = async () => {
        if (filterId.length != 24) {
            store.dispatch(change_is_loading(true));
            const res = await GetApi('/admin/get/shops', localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setCategories(res.data.shops);
                setPage(0);
            }
            store.dispatch(change_is_loading(false));
        } else {
            store.dispatch(change_is_loading(true));
            const res = await GetApi(`/admin/get/shop/${filterId}`, localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setCategories(res.data.shop);
                setPage(0);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    // filter Id
    const [filterId, setFilterId] = useState<string>('');
    const typingTimeoutRef = useRef<any>(null);
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }
    const filterById = async (id: string) => {
        if (id != '') {
            store.dispatch(change_is_loading(true));
            const res = await GetApi(`/admin/get/shop/${id}`, localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setCategories(res.data.shop);
            }
            store.dispatch(change_is_loading(false));
        } else {
            store.dispatch(change_is_loading(true));
            const res = await GetApi('/admin/get/shops', localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setCategories(res.data.shops);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    useEffect(() => {
        typingTimeoutRef.current = setTimeout(() => {
            filterById(filterId);
        }, 500);
    }, [filterId]);
    //
    useEffect(() => {
        setCategories(initialShops);
    }, [initialShops]);

    return (
        <Card className="relative">
            <CardHeader
                sx={{ textTransform: 'capitalize' }}
                action={<Box width={150}></Box>}
                title={t('category.Admin.ShopList')}
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
                            <TableCell>{t('shop.Name')}</TableCell>
                            <TableCell>{t('category.CategoryImage')}</TableCell>
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
                                            key={category.active}
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
                                            key={category.active}
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                            style={{ color: category.active == false ? 'red' : 'charcoal' }}
                                        >
                                            {category.name}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Avatar
                                            variant="square"
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                border: '4px solid transparent',
                                                borderRadius: 1,
                                                background:
                                                    'linear-gradient(white, white), linear-gradient(to right, #3f51b5, #000)',
                                                backgroundClip: 'content-box, border-box',
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                            }}
                                            alt=""
                                            src={
                                                category.image
                                                    ? category.image.startsWith('uploads')
                                                        ? `${HOST_BE}/${category.image}`
                                                        : category.image
                                                    : category.image
                                            }
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title={t('action.Detail')} arrow>
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
                                                    handleClickOpenDetailDialog();
                                                    setSelectedCategory(category);
                                                }}
                                            >
                                                <InfoOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        {category.active ? (
                                            <Tooltip title={t('action.Ban')} arrow>
                                                <IconButton
                                                    sx={{
                                                        '&:hover': { background: theme.colors.error.lighter },
                                                        color: theme.palette.error.main,
                                                    }}
                                                    color="inherit"
                                                    size="small"
                                                    onClick={() => {
                                                        handleClickOpenBanDialog();
                                                        setSelectedCategory(category);
                                                    }}
                                                >
                                                    <NotInterestedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title={t('action.UnBan')} arrow>
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => {
                                                        handleClickOpenUnBanDialog();
                                                        setSelectedCategory(category);
                                                    }}
                                                >
                                                    <SwitchAccessShortcutAddIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <DetailDialog
                open={openDetail}
                onClose={handleCloseDetailDialog}
                categories={categories}
                category={selectedShop}
            />
            <AlertDeleteDialog
                open={openBan}
                onClose={handleCloseBanDialog}
                shopId={selectedShop?.id}
                onUpdate={getDataCategory}
            />
            <AlertUnBanDialog
                open={openUnBan}
                onClose={handleCloseUnBanDialog}
                shopId={selectedShop?.id}
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

ShopTable.propTypes = {
    initialShops: PropTypes.array.isRequired,
};

ShopTable.defaultProps = {
    initialShops: [],
};

export default ShopTable;
