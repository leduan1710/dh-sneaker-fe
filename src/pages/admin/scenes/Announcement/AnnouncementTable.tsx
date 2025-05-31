import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { useTranslation } from 'react-i18next';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { change_is_loading } from '../../../../reducers/Actions';
import { GetApi, GetGuestApi, PostApi } from '../../../../untils/Api';
import {
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Tooltip,
    useTheme,
    Input,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    TextField,
    Card,
    CardHeader,
} from '@mui/material';
import { filterSpecialInput, formatPrice, toastError, toastSuccess } from '../../../../untils/Logic';
import TablePagination from '@mui/material/TablePagination';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { Delete } from '@mui/icons-material';

interface DeleteDialogProps {
    onClose: () => void;
    open: boolean;
    announcement?: any;
    onUpdate: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = (props) => {
    const { onClose, open, announcement, onUpdate } = props;
    const handleClose = () => {
        onClose();
    };
    const handleConfirm = async () => {
        try {
            const res = await GetApi(`/admin/delete/announcement/${announcement.id}`, localStorage.getItem('token'));

            if (res.data.message === 'Success') {
                toastSuccess('Thành công');
                onUpdate();
            } else toastError('Thất bại');
        } catch (error) {
            console.error('Failed to delete :', error);
        }
        onClose();
    };
    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="delete-dialog-title">
            <DialogTitle id="delete-dialog-title">Xác nhận xóa</DialogTitle>
            <DialogContent>
                <DialogContentText>Xác nhận muốn xóa thông báo này không?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button onClick={handleConfirm} color="error">
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    );
};

interface CreateUpdateDialogProps {
    onClose: () => void;
    open: boolean;
    announcement?: any;
    onUpdate: () => void;
}

const CreateUpdateDialog: React.FC<CreateUpdateDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, announcement, onUpdate } = props;
    const [content, setContent] = useState('');
    const [position, setPosition] = useState('LEFT');

    const handleClose = () => {
        onClose();
    };

    useEffect(() => {
        if (announcement) {
            setContent(announcement.content);
            setPosition(announcement.position);
        } else {
            setContent('');
            setPosition('LEFT');
        }
    }, [announcement, open]);

    const handleConfirm = async () => {
        try {
            const updatedAnnouncement = { ...announcement, content, position };

            const res = await PostApi(`/admin/update/announcement`, localStorage.getItem('token'), {
                announcement: updatedAnnouncement,
            });

            if (res.data.message === 'Success') {
                toastSuccess('Thành công');
                onUpdate();
            } else toastError('Thất bại');
        } catch (error) {
            console.error('Failed to delete :', error);
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
                maxWidth={'xs'}
                fullWidth={true}
            >
                <DialogTitle sx={{ textTransform: 'capitalize' }} id="dialog-title">
                    {announcement ? 'Thay đổi thông báo' : 'Tạo thông báo'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="note"
                        label="Nhập nội dung thông báo"
                        type="text"
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                        }}
                        fullWidth
                        variant="standard"
                    />
                    <FormControl sx={{ mt: 2 }} fullWidth margin="dense">
                        <InputLabel>Vị trí</InputLabel>
                        <Select label="Vị trí" value={position} onChange={(e) => setPosition(e.target.value)}>
                            <MenuItem value="LEFT">LEFT</MenuItem>
                            <MenuItem value="CENTER">CENTER</MenuItem>
                            <MenuItem value="RIGHT">RIGHT</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleConfirm} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default function AnnouncementTable() {
    const theme = useTheme();

    const { t } = useTranslation();
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>();
    const [openCreate, setOpenCreate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    // Pagination state
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);

    const handleClickOpenDelete = () => {
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setSelectedAnnouncement(null);
        setOpenDelete(false);
    };
    const handleClickOpenCreate = () => {
        setOpenCreate(true);
    };
    const handleCloseCreate = () => {
        setSelectedAnnouncement(null);
        setOpenCreate(false);
    };

    const getDataAnnouncement = async () => {
        store.dispatch(change_is_loading(true));
        const res = await GetGuestApi(`/api/announcements`);

        if (res.data.message == 'Success') {
            setAnnouncements(res.data.announcements);
            setPage(0);
        }
        store.dispatch(change_is_loading(false));
    };

    useEffect(() => {
        getDataAnnouncement();
    }, []);

    const handlePageChange = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(0);
    };
    const paginatedAnnouncements = announcements.slice(page * limit, page * limit + limit);

    return (
        <>
            <Card className="relative">
                <CardHeader sx={{ minHeight: '50px' }} action={<Box width={150}></Box>} />
                <div className="absolute top-2 right-5 flex items-center">
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
                </div>
                <TableContainer className="relative" component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Nội dung</TableCell>
                                <TableCell>Vị trí</TableCell>
                                <TableCell align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedAnnouncements.map((announcement: any, index: number) => {
                                return (
                                    <TableRow hover key={announcement.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{announcement.content}</TableCell>
                                        <TableCell>{announcement.position}</TableCell>

                                        <TableCell align="right">
                                            <Tooltip title={'Chỉnh sửa'} arrow>
                                                <IconButton
                                                    sx={{
                                                        '&:hover': { background: theme.colors.primary.lighter },
                                                        color: theme.palette.primary.main,
                                                    }}
                                                    color="inherit"
                                                    size="small"
                                                    onClick={() => {
                                                        handleClickOpenCreate();
                                                        setSelectedAnnouncement(announcement);
                                                    }}
                                                >
                                                    <EditTwoToneIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={'Xóa'} arrow>
                                                <IconButton
                                                    sx={{
                                                        '&:hover': { background: theme.colors.error.lighter },
                                                        color: theme.palette.error.main,
                                                    }}
                                                    color="inherit"
                                                    size="small"
                                                    onClick={() => {
                                                        handleClickOpenDelete();
                                                        setSelectedAnnouncement(announcement);
                                                    }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <CreateUpdateDialog
                        open={openCreate}
                        onClose={handleCloseCreate}
                        announcement={selectedAnnouncement}
                        onUpdate={getDataAnnouncement}
                    />
                    <DeleteDialog
                        open={openDelete}
                        onClose={handleCloseDelete}
                        announcement={selectedAnnouncement}
                        onUpdate={getDataAnnouncement}
                    />
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage="Số thông báo mỗi trang"
                        component="div"
                        count={announcements.length}
                        rowsPerPage={limit}
                        page={page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleLimitChange}
                    />
                </TableContainer>
            </Card>
        </>
    );
}
