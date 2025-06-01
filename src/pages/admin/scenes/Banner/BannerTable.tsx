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
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    TextField,
    Card,
    CardHeader,
    styled,
} from '@mui/material';
import { filterSpecialInput, formatPrice, toastError, toastSuccess, toastWarning } from '../../../../untils/Logic';
import TablePagination from '@mui/material/TablePagination';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { Delete } from '@mui/icons-material';
import { HOST_BE } from '../../../../common/Common';
import axios from 'axios';
const Input = styled('input')({
    display: 'none',
});
interface DeleteDialogProps {
    onClose: () => void;
    open: boolean;
    banner?: any;
    onUpdate: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = (props) => {
    const { onClose, open, banner, onUpdate } = props;
    const handleClose = () => {
        onClose();
    };
    const handleConfirm = async () => {
        try {
            const res = await GetApi(`/admin/delete/banner/${banner.id}`, localStorage.getItem('token'));

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
                <DialogContentText>Xác nhận muốn xóa banner này không?</DialogContentText>
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
    banner?: any;
    onUpdate: () => void;
}

const CreateUpdateDialog: React.FC<CreateUpdateDialogProps> = (props) => {
    const { t } = useTranslation();
    const store = useStore();
    const { onClose, open, banner, onUpdate } = props;
    const [selectImage, setSelectImage] = useState<File | null>(null);
    const [image, setImage] = useState('');

    const handleClose = () => {
        onClose();
    };

    useEffect(() => {
        if (banner) {
            setImage(banner.image);
        } else {
            setImage('');
        }
    }, [banner, open]);

    const handleAddBanner = async (image: File) => {
        store.dispatch(change_is_loading(true));
        const formData = new FormData();
        if (banner.id) formData.append('id', banner.id);
        if (image) {
            const uniqueFilename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const imageBlob = await fetch(URL.createObjectURL(image)).then((response) => response.blob());
            formData.append('file', imageBlob, uniqueFilename);
        }
        try {
            const res = await axios.post(`${HOST_BE}/admin/add/banner`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.data.message === 'Success') {
                toastSuccess(t('toast.CreateSuccess'));
                onUpdate();
            }
        } catch (error) {
        } finally {
            store.dispatch(change_is_loading(false));
        }
    };

    return (
        <React.Fragment>
            <Dialog
                maxWidth="md"
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        const image = formJson.image;

                        await handleAddBanner(image);
                        handleClose();
                    },
                }}
            >
                <DialogTitle sx={{ textTransform: 'capitalize' }} id="dialog-title">
                    {banner ? 'Thay đổi banner' : 'Tạo banner'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <Avatar
                            variant="square"
                            sx={{ minWidth: 300, height: 'auto'}}
                            src={selectImage ? URL.createObjectURL(selectImage) : image ? image.startsWith('uploads') ? `${HOST_BE}/${image}` : image : undefined}
                        />
                        <label htmlFor="image" style={{ position: 'absolute', bottom: '8px', right: '8px' }}>
                            <IconButton component="span" color="primary">
                                <UploadTwoToneIcon />
                            </IconButton>
                        </label>
                        <Input
                            required
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }} // Ẩn input file
                            onChange={(e: any) => {
                                const file = e.target.files[0];
                                if (
                                    file &&
                                    (file.type === 'image/png' ||
                                        file.type === 'image/jpeg' ||
                                        file.type === 'image/webp')
                                ) {
                                    setSelectImage(file);
                                } else {
                                    toastWarning('File type is not allowed');
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button type="submit" autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default function BannerTable() {
    const theme = useTheme();

    const { t } = useTranslation();
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const [banners, setBanners] = useState<any[]>([]);
    const [selectedBanner, setSelectedBanner] = useState<any>();
    const [openCreate, setOpenCreate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    // Pagination state
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);

    const handleClickOpenDelete = () => {
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setSelectedBanner(null);
        setOpenDelete(false);
    };
    const handleClickOpenCreate = () => {
        setOpenCreate(true);
    };
    const handleCloseCreate = () => {
        setSelectedBanner(null);
        setOpenCreate(false);
    };

    const getDataBanners = async () => {
        store.dispatch(change_is_loading(true));
        const res = await GetGuestApi(`/api/banners`);

        if (res.data.message == 'Success') {
            setBanners(res.data.banners);
            setPage(0);
        }
        store.dispatch(change_is_loading(false));
    };

    useEffect(() => {
        getDataBanners();
    }, []);

    const handlePageChange = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(0);
    };
    const paginatedBanners = banners.slice(page * limit, page * limit + limit);

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
                                <TableCell>Ảnh</TableCell>
                                <TableCell align='center'>Vị trí</TableCell>
                                <TableCell align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedBanners.map((banner: any, index: number) => {
                                return (
                                    <TableRow hover key={banner.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Avatar
                                                variant="square"
                                                alt=""
                                                sx={{
                                                    width: 150,
                                                    height: 'auto',
                                                    border: '4px solid transparent',
                                                    borderRadius: 1,
                                                    background:
                                                        'linear-gradient(white, white), linear-gradient(to right, #3f51b5, #000)',
                                                    backgroundClip: 'content-box, border-box',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                                }}
                                                src={
                                                    banner.image
                                                        ? banner.image.startsWith('uploads')
                                                            ? `${HOST_BE}/${banner.image}`
                                                            : banner.image
                                                        : banner.image
                                                }
                                            />
                                        </TableCell>
                                        <TableCell align='center'>{banner.position}</TableCell>

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
                                                        setSelectedBanner(banner);
                                                    }}
                                                >
                                                    <EditTwoToneIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            {/* <Tooltip title={'Xóa'} arrow>
                                                <IconButton
                                                    sx={{
                                                        '&:hover': { background: theme.colors.error.lighter },
                                                        color: theme.palette.error.main,
                                                    }}
                                                    color="inherit"
                                                    size="small"
                                                    onClick={() => {
                                                        handleClickOpenDelete();
                                                        setSelectedBanner(banner);
                                                    }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip> */}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <CreateUpdateDialog
                        open={openCreate}
                        onClose={handleCloseCreate}
                        banner={selectedBanner}
                        onUpdate={getDataBanners}
                    />
                    <DeleteDialog
                        open={openDelete}
                        onClose={handleCloseDelete}
                        banner={selectedBanner}
                        onUpdate={getDataBanners}
                    />
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage="Số thông báo mỗi trang"
                        component="div"
                        count={banners.length}
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
