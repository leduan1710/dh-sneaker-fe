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
            const res = await PostApi(`/admin/ban-user/${shopId}`, localStorage.getItem('token'), {});

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
                    {t('category.Admin.BanUser')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        {t('category.Admin.ConfirmToBanUser')} ?
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
            const res = await PostApi(`/admin/unban-user/${shopId}`, localStorage.getItem('token'), {});

            if (res.data.message === 'Success') {
                toastSuccess(t('toast.Success'));
                onUpdate();
            }
        } catch (error) {
            toastSuccess(t('toast.Fail'));
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

interface UsersTableProps {
    className?: string;
    initialUsers: any[];
}

const applyPagination = (users: any[], page: number, limit: number): any[] => {
    return users.slice(page * limit, page * limit + limit);
};

const UsersTable: FC<UsersTableProps> = ({ initialUsers }) => {
    const { t } = useTranslation();
    const store = useStore();
    const [openDetail, setOpenDetail] = useState(false);
    const [openBan, setOpenBan] = useState(false);
    const [openUnBan, setOpenUnBan] = useState(false);
    const [users, setUsers] = useState<any[]>(initialUsers);
    const [selectedUser, setSelectedUser] = useState<any>();
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);
    const [email, setEmail] = useState<string>('');

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };

    const paginatedUsers = applyPagination(users, page, limit);
    const theme = useTheme();

    const handleClickOpenDetailDialog = () => {
        setOpenDetail(true);
    };
    const handleCloseDetailDialog = () => {
        setSelectedUser(undefined);
        setOpenDetail(false);
    };
    const handleCloseUnBanDialog = () => {
        setSelectedUser(undefined);
        setOpenUnBan(false);
    };

    const handleClickOpenBanDialog = () => {
        console.log('here');
        setOpenBan(true);
    };
    const handleClickOpenUnBanDialog = () => {
        setOpenUnBan(true);
    };
    const handleCloseBanDialog = () => {
        setSelectedUser(undefined);
        setOpenBan(false);
    };

    const getDatUser = async () => {
        if (email != '') {
            store.dispatch(change_is_loading(true));
            const res = await PostApi(`/admin/get/user-by-email`, localStorage.getItem('token'), { email: email });

            if (res.data.message == 'Success') {
                setUsers(res.data.users);
                setPage(0);
            }
            store.dispatch(change_is_loading(false));
        } else {
            store.dispatch(change_is_loading(true));
            const res = await GetApi('/admin/get/users', localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setUsers(res.data.users);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    const typingTimeoutRef = useRef<any>(null);
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }
    const filterById = async (email: string) => {
        if (email != '') {
            store.dispatch(change_is_loading(true));
            const res = await PostApi(`/admin/get/user-by-email`, localStorage.getItem('token'), { email: email });

            if (res.data.message == 'Success') {
                setUsers(res.data.users);
                setPage(0);
            }
            store.dispatch(change_is_loading(false));
        } else {
            store.dispatch(change_is_loading(true));
            const res = await GetApi('/admin/get/users', localStorage.getItem('token'));

            if (res.data.message == 'Success') {
                setUsers(res.data.users);
                setPage(0);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);
    useEffect(() => {
        typingTimeoutRef.current = setTimeout(() => {
            filterById(email);
        }, 500);
    }, [email]);
    return (
        <Card className="relative">
            <CardHeader
                sx={{ textTransform: 'capitalize' }}
                action={<Box width={150}></Box>}
                title={t('category.Admin.UserList')}
            />
            <div className="absolute top-2 right-5">
                <Input
                    value={email}
                    className="border border-gray-300 rounded-lg p-1"
                    style={{ display: 'block', width: 300 }}
                    placeholder={t('action.EnterEmail')}
                    onChange={(e) => {
                        filterSpecialInput(e.target.value, setEmail);
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
                            <TableCell>Email</TableCell>
                            <TableCell>{t('orther.Role')}</TableCell>
                            <TableCell align="right">{t('category.Admin.Actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedUsers.map((user) => {
                            return (
                                <TableRow hover key={user.id}>
                                    <TableCell>
                                        <Typography
                                            key={user.active}
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                            style={{ color: user.active == true ? 'charcoal' : 'red' }}
                                        >
                                            {user.id}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            key={user.active}
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                            style={{ color: user.active == false ? 'red' : 'charcoal' }}
                                        >
                                            {user.email}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Typography
                                            key={user.active}
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                            style={{ color: user.active == false ? 'red' : 'charcoal' }}
                                        >
                                            {user.role}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        {user.role == 'ADMIN' ? null : (
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
                                                        setSelectedUser(user);
                                                    }}
                                                >
                                                    <InfoOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        {user.role == 'ADMIN' ? null : (
                                            <>
                                                {user.active ? (
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
                                                                setSelectedUser(user);
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
                                                                setSelectedUser(user);
                                                            }}
                                                        >
                                                            <SwitchAccessShortcutAddIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <DetailDialog open={openDetail} onClose={handleCloseDetailDialog} users={users} user={selectedUser} />
            <AlertDeleteDialog
                open={openBan}
                onClose={handleCloseBanDialog}
                shopId={selectedUser?.id}
                onUpdate={getDatUser}
            />
            <AlertUnBanDialog
                open={openUnBan}
                onClose={handleCloseUnBanDialog}
                shopId={selectedUser?.id}
                onUpdate={getDatUser}
            />
            <Box p={2}>
                <TablePagination
                    component="div"
                    count={users.length}
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

UsersTable.propTypes = {
    initialUsers: PropTypes.array.isRequired,
};

UsersTable.defaultProps = {
    initialUsers: [],
};

export default UsersTable;
