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
    Avatar,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    styled,
    DialogActions,
} from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { CategoryModel } from '../../../../models/category';
import { HOST_BE } from '../../../../common/Common';
import { filterSpecialInput, toastSuccess } from '../../../../untils/Logic';
import { change_is_loading } from '../../../../reducers/Actions';
import axios from 'axios';
import { useStore } from 'react-redux';
import { GetApi, PostApi } from '../../../../untils/Api';
import EditCateDialog from './EditDialog';
import DetailDialog from './DetailDialog';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';

const Input = styled('input')({
    display: 'none',
});

interface AlertDeleteDialogProps {
    onClose: () => void;
    open: boolean;
    categoryId?: string;
    onUpdate: () => void;
}

const AlertDeleteDialog: React.FC<AlertDeleteDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, categoryId, onUpdate } = props;

    const handleClose = () => {
        onClose();
    };
    const handleDelete = async () => {
        try {
            console.log('delete');
            const res = await PostApi(`/admin/delete/category/${categoryId}`, localStorage.getItem('token'), {});

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
                    {t('category.Admin.DeleteCategory')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        {t('category.Admin.ConfirmToDeleteCategory')} ?
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

interface CategoriesTableProps {
    className?: string;
    initialCategories: CategoryModel[];
}

const applyPagination = (categories: CategoryModel[], page: number, limit: number): CategoryModel[] => {
    return categories.slice(page * limit, page * limit + limit);
};

const CategoriesTable: FC<CategoriesTableProps> = ({ initialCategories }) => {
    const { t } = useTranslation();
    const store = useStore();
    const [openDetail, setOpenDetail] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [categories, setCategories] = useState<CategoryModel[]>(initialCategories);
    const [selectedCategory, setSelectedCategory] = useState<CategoryModel>();
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

    const handleClickOpenDetailDialog = () => {
        setOpenDetail(true);
    };
    const handleCloseDetailDialog = () => {
        setSelectedCategory(undefined);
        setOpenDetail(false);
    };
    const handleClickOpenEditDialog = () => {
        setOpenEdit(true);
    };
    const handleCloseEditDialog = () => {
        setSelectedCategory(undefined);
        setOpenEdit(false);
    };
    const handleClickOpenDeleteDialog = () => {
        setOpenDelete(true);
    };
    const handleCloseDeleteDialog = () => {
        setSelectedCategory(undefined);
        setOpenDelete(false);
    };

    const getDataCategory = async () => {
        if (filterId.length != 24) {
            store.dispatch(change_is_loading(true));
            const resCategories = await GetApi('/admin/get/categories', localStorage.getItem('token'));

            if (resCategories.data.message == 'Success') {
                setCategories(resCategories.data.categories);
            }
            store.dispatch(change_is_loading(false));
        } else {
            store.dispatch(change_is_loading(true));
            const res = await GetApi(`/admin/get/category/${filterId}`, localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setCategories(res.data.category);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    const [filterId, setFilterId] = useState<string>('');
    const typingTimeoutRef = useRef<any>(null);
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }
    const filterById = async (id: string) => {
        if (id != '') {
            store.dispatch(change_is_loading(true));
            const res = await GetApi(`/admin/get/category/${id}`, localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setCategories(res.data.category);
                setPage(0);
            }
            store.dispatch(change_is_loading(false));
        } else {
            store.dispatch(change_is_loading(true));
            const resCategories = await GetApi('/admin/get/categories', localStorage.getItem('token'));

            if (resCategories.data.message == 'Success') {
                setCategories(resCategories.data.categories);
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
    useEffect(() => {
        setCategories(initialCategories);
    }, [initialCategories]);

    return (
        <Card className="relative">
            <CardHeader
                sx={{ textTransform: 'capitalize' }}
                action={<Box width={150}></Box>}
                title={t('category.Admin.CategoryList')}
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
                            <TableCell>{t('category.CategoryName')}</TableCell>
                            <TableCell>{t('category.ParentCategoryId')}</TableCell>
                            <TableCell>{t('category.CategoryImage')}</TableCell>
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
                                        >
                                            {category.name}
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
                                            {category.previousId}
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
                                                    setSelectedCategory(category);
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
                                                    setSelectedCategory(category);
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
            <DetailDialog
                open={openDetail}
                onClose={handleCloseDetailDialog}
                categories={categories}
                category={selectedCategory}
            />
            <EditCateDialog
                open={openEdit}
                onClose={handleCloseEditDialog}
                categories={categories}
                category={selectedCategory}
                onUpdate={getDataCategory}
            />
            <AlertDeleteDialog
                open={openDelete}
                onClose={handleCloseDeleteDialog}
                categoryId={selectedCategory?.id}
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

CategoriesTable.propTypes = {
    initialCategories: PropTypes.array.isRequired,
};

CategoriesTable.defaultProps = {
    initialCategories: [],
};

export default CategoriesTable;
