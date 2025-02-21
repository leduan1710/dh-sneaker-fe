import React, { FC, ChangeEvent, useState, useEffect } from 'react';
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
    Avatar,
    Link,
} from '@mui/material';

import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

import { toastSuccess } from '../../../../untils/Logic';
import { change_is_loading } from '../../../../reducers/Actions';
import { useSelector, useStore } from 'react-redux';
import { GetApi, PostApi } from '../../../../untils/Api';
import { useTranslation } from 'react-i18next';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { BannerModel } from '../../../../models/banner';
import { HOST_BE } from '../../../../common/Common';
import { formatDistanceToNow } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';

interface CancelDialogProps {
    onClose: () => void;
    open: boolean;
    bannerId?: string;
    onUpdate: () => void;
}

const CancelDialog: React.FC<CancelDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, bannerId, onUpdate } = props;

    const handleClose = () => {
        onClose();
    };
    const handleCancel = async () => {
        try {
            const res = await GetApi(`/shop/cancel-banner/${bannerId}`, localStorage.getItem('token'), {});

            if (res.data.message === 'Success') {
                toastSuccess(t('toast.Success'));
                onUpdate();
            }
        } catch (error) {}
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
                    {t('banner.CancelBanner')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">{t('banner.ConfirmToCancelBanner')} ?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('action.Cancel')}</Button>
                    <Button onClick={handleCancel} autoFocus>
                        {t('action.Confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

interface BannersTableProps {
    className?: string;
    initialBanners: BannerModel[];
}

const applyPagination = (banners: BannerModel[], page: number, limit: number): BannerModel[] => {
    return banners.slice(page * limit, page * limit + limit);
};

const BannersTable: FC<BannersTableProps> = ({ initialBanners }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const lng = useSelector((state: ReducerProps) => state.lng);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [banners, setBanners] = useState<BannerModel[]>(initialBanners);
    const [selectedBanners, setSelectedBanners] = useState<string[]>([]);
    const selectedBulkActions = selectedBanners.length > 0;
    const [selectedBanner, setSelectedBanner] = useState<BannerModel | undefined>();
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);

    const getDataBanner = async () => {
        if (user) {
            store.dispatch(change_is_loading(true));
            const res = await GetApi(`/shop/get/banners`, localStorage.getItem('token'));
            if (res.data.message === 'Success') {
                setBanners(res.data.banners);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    const handleSelectAllBanners = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedBanners(event.target.checked ? banners.map((banner) => banner.id) : []);
    };

    const handleSelectOneBanner = (event: ChangeEvent<HTMLInputElement>, bannerId: string): void => {
        if (!selectedBanners.includes(bannerId)) {
            setSelectedBanners((prevSelected) => [...prevSelected, bannerId]);
        } else {
            setSelectedBanners((prevSelected) => prevSelected.filter((id) => id !== bannerId));
        }
    };

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };

    const paginatedBanners = applyPagination(banners, page, limit);
    const selectedSomeBanners = selectedBanners.length > 0 && selectedBanners.length < banners.length;
    const selectedAllBanners = selectedBanners.length === banners.length;

    const handleClickOpenEditDialog = () => {
        setOpenEdit(true);
    };
    const handleCloseEditDialog = () => {
        setSelectedBanner(undefined);
        setOpenEdit(false);
    };
    const handleClickOpenCancelDialog = () => {
        setOpenDelete(true);
    };
    const handleCloseCancelDialog = () => {
        setSelectedBanner(undefined);
        setOpenDelete(false);
    };

    useEffect(() => {
        if (initialBanners) setBanners(initialBanners);
    }, [initialBanners]);

    return (
        <Card>
            {!selectedBulkActions && (
                <CardHeader
                    sx={{ textTransform: 'capitalize' }}
                    action={<Box width={150}></Box>}
                    title={t('banner.BannerList')}
                />
            )}
            <Divider />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    checked={selectedAllBanners}
                                    indeterminate={selectedSomeBanners}
                                    onChange={handleSelectAllBanners}
                                />
                            </TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>{t('banner.Image')}</TableCell>
                            <TableCell>{t('banner.Level')}</TableCell>
                            <TableCell>{t('banner.Link')}</TableCell>
                            <TableCell>{t('banner.Expired')}</TableCell>
                            <TableCell align="center">{t('action.Actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedBanners.map((banner) => {
                            const isBannerSelected = selectedBanners.includes(banner.id);
                            return (
                                <TableRow hover key={banner.id} selected={isBannerSelected}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isBannerSelected}
                                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                handleSelectOneBanner(event, banner.id)
                                            }
                                            value={isBannerSelected}
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
                                            {banner.id}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Avatar
                                            variant="rounded"
                                            src={
                                                banner.image.startsWith('uploads')
                                                    ? `${HOST_BE}/${banner.image}`
                                                    : banner.image
                                            }
                                            alt="banner image"
                                            sx={{
                                                width: 160,
                                                height: 80,
                                                border: '2px solid transparent',
                                                borderRadius: 0.5,
                                                background:
                                                    'linear-gradient(white, white), linear-gradient(to right, #3f51b5, #000)',
                                                backgroundClip: 'content-box, border-box',
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight="bold" color="text.primary">
                                            {banner.level}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            underline="always"
                                            href={banner.link}
                                            variant="body1"
                                            fontWeight="bold"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {t('orther.Link')}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {banner.expired ? (
                                            <Typography
                                                variant="body1"
                                                fontWeight="bold"
                                                color="text.primary"
                                                gutterBottom
                                                noWrap
                                            >
                                                {new Date(banner.expired) < new Date()
                                                    ? t('voucher.Expired')
                                                    : lng === 'vn'
                                                    ? formatDistanceToNow(new Date(banner.expired), {
                                                          addSuffix: true,
                                                          locale: vi,
                                                      })
                                                    : formatDistanceToNow(new Date(banner.expired), {
                                                          addSuffix: true,
                                                          locale: enUS,
                                                      })}
                                            </Typography>
                                        ) : (
                                            ''
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={t('action.Delete')} arrow>
                                            <IconButton
                                                sx={{
                                                    '&:hover': { background: theme.colors.error.lighter },
                                                    color: theme.palette.error.main,
                                                }}
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                    handleClickOpenCancelDialog();
                                                    setSelectedBanner(banner);
                                                }}
                                            >
                                                <DisabledByDefaultIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <CancelDialog
                open={openDelete}
                onClose={handleCloseCancelDialog}
                bannerId={selectedBanner?.id}
                onUpdate={getDataBanner}
            />
            <Box p={2}>
                <TablePagination
                    component="div"
                    count={banners.length}
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

BannersTable.propTypes = {
    initialBanners: PropTypes.array.isRequired,
};

BannersTable.defaultProps = {
    initialBanners: [],
};

export default BannersTable;
