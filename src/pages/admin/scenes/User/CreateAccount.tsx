import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Snackbar } from '@mui/material';
import { toast } from 'react-toastify';
import { checkIsEmail, toastError, toastSuccess } from '../../../../untils/Logic';
import { passwordStrength } from 'check-password-strength';
import { PostGuestApi } from '../../../../untils/Api';
import { useStore } from 'react-redux';

interface CreateSubAdminDialogProps {
    onClose: () => void;
    open: boolean;
    onUpdate: () => void;
}
const CreateSubAdminDialog: React.FC<CreateSubAdminDialogProps> = (props) => {
    const store = useStore();
    const { onClose, open, onUpdate } = props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const handleClose = () => {
        onClose();
    };
    const handleClickRegister = async (e: any) => {
        e.preventDefault();
        if (!checkIsEmail(email)) {
            return toast.warning('Invalid email format');
        }
        if (email && password && rePassword) {
            if (rePassword === password) {
                if (passwordStrength(password).id === 3) {
                    const res = await PostGuestApi('/admin/register-sub-admin', {
                        email,
                        phone,
                        name,
                        password,
                    });
                    if (res.data.message === 'Success') {
                        toastSuccess('Tạo thành công');
                        onUpdate();
                    }
                    else toastError('Số điện thoại hoặc email đã được đăng ký');
                    handleClose();
                } else {
                    toast.warning('Mật khẩu yếu');
                }
            } else {
                toast.warning('Mật khẩu không trùng khớp');
            }
        }
    };

    return (
        <Dialog open={open} maxWidth={'xs'} onClose={handleClose}>
            <DialogTitle>Tạo tài khoản quản lý</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Tên"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Số điện thoại"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Mật khẩu"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Xác nhận mật khẩu"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Hủy
                </Button>
                <Button onClick={handleClickRegister} color="primary">
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateSubAdminDialog;
