import React from 'react';
import {
    Dialog,
    Button,
    DialogContent,
    DialogActions,
    Box,
    Card,
    CardHeader,
    Divider,
    CardContent,
    Typography,
} from '@mui/material';
import { useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { HOST_BE } from '../../../../common/Common';
import { formatPrice } from '../../../../untils/Logic';

interface DetailOrderProps {
    onClose: () => void;
    open: boolean;
    order?: any;
    orderDetails: any[];
}

const DetailOrder: React.FC<DetailOrderProps> = (props) => {
    const { t } = useTranslation();
    const store = useStore();
    const { onClose, open, order, orderDetails } = props;

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open} maxWidth="xs" fullWidth>
            <DialogContent>
                <Box>
                    <Card>
                        <CardHeader title={'Thông tin đơn hàng'} />
                        <Divider />
                        <CardContent>
                            {/* Thông tin đơn hàng */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    ID: {order?.id}
                                </Typography>

                                <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>
                                    Mã đơn hàng: {order?.orderCode}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        Ngày tạo đơn: {new Date(order.createDate).toLocaleDateString('vi-VN')}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        Cập nhật gần nhất: {new Date(order.updateDate).toLocaleDateString('vi-VN')}
                                    </Typography>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        Phương thức ship:
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {order?.shipMethod}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        Phí ship:
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {formatPrice(order.shipFee)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        Giá COD:
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {formatPrice(order.CODPrice)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        Trạng thái:
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {order?.status === 'SUCCESS'
                                            ? 'Thành công'
                                            : order?.status === 'CANCEL'
                                            ? 'Đã hủy'
                                            : 'Đang chờ'}
                                    </Typography>
                                </Box>
                                {order?.deliveryCode && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                            Mã vận đơn:
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                            {order.deliveryCode}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            <Divider />

                            {/* Thông tin CTV */}
                            <Box sx={{ mb: 3, mt: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    Tên CTV: {order?.ctvName}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    Ghi chú: {order?.ctvNote}
                                </Typography>
                                {order?.noteImage && (
                                    <img
                                        src={
                                            order.noteImage.startsWith('uploads')
                                                ? `${HOST_BE}/${order.noteImage}`
                                                : order.noteImage
                                        }
                                        alt="Note"
                                        style={{ width: '100%', maxWidth: 200, borderRadius: '4px', marginTop: '8px' }}
                                    />
                                )}
                            </Box>

                            <Divider />

                            {/* Thông tin người mua */}
                            <Box sx={{ mb: 3, mt: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 17 }}>
                                    Thông tin người mua
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    Tên: {order?.customerName}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    Số điện thoại: {order?.customerPhone}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    Địa chỉ: {order?.addressDetail}
                                </Typography>
                            </Box>

                            <Divider />

                            {/* Danh sách sản phẩm */}
                            <Box sx={{ p: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Danh sách sản phẩm
                                </Typography>
                                {orderDetails?.map((item: any, index: number) => (
                                    <Box key={item.id}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                borderRadius: '4px',
                                                boxShadow: 1,
                                                mb: 1,
                                                p: 1,
                                            }}
                                        >
                                            <Box sx={{ position: 'relative', mr: 2 }}>
                                                <img
                                                    src={
                                                        item.image.startsWith('uploads')
                                                            ? `${HOST_BE}/${item.image}`
                                                            : item.image
                                                    }
                                                    alt={item.productName}
                                                    style={{ width: 80, height: 80, borderRadius: '4px' }}
                                                />
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -5,
                                                        right: -5,
                                                        bgcolor: 'rgb(226, 50, 50)',
                                                        color: '#fff',
                                                        borderRadius: '50%',
                                                        padding: '4px',
                                                        width: '24px',
                                                        height: '24px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    {item.quantity}
                                                </Box>
                                            </Box>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        sx={{ fontSize: 16, fontWeight: 'medium' }}
                                                    >
                                                        {item.productName}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ fontSize: 14 }} color="#111">
                                                        {item.sellPrice?.toLocaleString()} VND
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="textSecondary">
                                                    Size: {item.size}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {index < orderDetails.length - 1 && <Divider sx={{ my: 2 }} />}
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{t('action.Close')}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DetailOrder;
