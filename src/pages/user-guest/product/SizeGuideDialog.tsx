import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

interface SizeGuideDialogProps {
    open: boolean;
    onClose: () => void;
}

const SizeGuideDialog: React.FC<SizeGuideDialogProps> = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Hướng Dẫn Chọn Kích Thước</DialogTitle>
            <DialogContent>
                <div>
                    <p>Để chọn kích thước phù hợp, bạn nên:</p>
                    <ul>
                        <li>Xem bảng kích thước trên trang sản phẩm.</li>
                        <li>Đo kích thước của bản thân hoặc sản phẩm để so sánh.</li>
                        <li>Nếu bạn vẫn không chắc chắn, hãy liên hệ với chúng tôi để được tư vấn.</li>
                    </ul>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SizeGuideDialog;