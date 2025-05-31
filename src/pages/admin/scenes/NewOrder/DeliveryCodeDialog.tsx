import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface DeliveryCodeDialogProps {
    open: boolean;
    onClose: () => void;
    deliveryCode: string;
}

const DeliveryCodeDialog: React.FC<DeliveryCodeDialogProps> = ({ open, onClose, deliveryCode }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Mã Vận Đơn</DialogTitle>
            <DialogContent>
                <Typography variant="body1" align="center" style={{ fontWeight: 'bold' }}>
                    Mã vận đơn: {deliveryCode}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeliveryCodeDialog;