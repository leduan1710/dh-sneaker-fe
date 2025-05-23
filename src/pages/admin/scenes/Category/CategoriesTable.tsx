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
    styled,
    InputAdornment,
    TextField,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import AddIcon from '@mui/icons-material/Add';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
import DeleteDialog from './DeleteDialog';
import CreateCateDialog from './CreateDialog';

const Input = styled('input')({
    display: 'none',
});

interface CategoriesTableProps {
    className?: string;
    initialCategories: any[];
}

const applyPagination = (categories: any[], page: number, limit: number): any[] => {
    return categories.slice(page * limit, page * limit + limit);
};

const CategoriesTable: FC<CategoriesTableProps> = ({ initialCategories }) => {
    const { t } = useTranslation();
    const store = useStore();
    const [openCreate, setOpenCreate] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [categories, setCategories] = useState<any[]>(initialCategories);
    const [selectedCategory, setSelectedCategory] = useState<any>();
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

    const handleClickOpenCreate = () => {
        setOpenCreate(true);
    };
    const handleCloseCreate = () => {
        setOpenCreate(false);
    };
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
            <CardHeader sx={{ minHeight: '50px' }} action={<Box width={150}></Box>} />
            <div className="absolute top-2 right-5 flex items-center">
                <TextField
                    value={filterId}
                    variant="outlined"
                    className="border-gray-300"
                    style={{
                        width: 280, // Kích thước chiều rộng
                        borderRadius: '30px', // Độ tròn hơn
                        padding: '0 10px', // Thêm padding
                    }}
                    placeholder={t('action.EnterID')}
                    onChange={(e) => {
                        filterSpecialInput(e.target.value, setFilterId);
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        sx: {
                            height: '35px', // Chiều cao của thanh tìm kiếm
                        },
                    }}
                />
                <IconButton
                    sx={{
                        backgroundColor: '#fff9c4',
                        borderRadius: '50%',
                        width: 36,
                        height: 36,
                        marginLeft: 1,
                        '&:hover': {
                            backgroundColor: '#fff59d',
                        },
                    }}
                    onClick={handleClickOpenCreate}
                >
                    <AddIcon fontSize="small" />
                </IconButton>
                <CreateCateDialog
                    open={openCreate}
                    onClose={handleCloseCreate}
                    categories={categories}
                    onUpdate={getDataCategory}
                />
            </div>
            <Divider />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>{t('category.CategoryName')}</TableCell>
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
            <DeleteDialog
                open={openDelete}
                onClose={handleCloseDeleteDialog}
                categoryId={selectedCategory?.id}
                onUpdate={getDataCategory}
            />
            <Box p={2}>
                <TablePagination
                    component="div"
                    labelRowsPerPage="Số hãng mỗi trang"
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
