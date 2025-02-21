import React from 'react';
import { useSelector } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PersonIcon from '@mui/icons-material/Person';
import MapIcon from '@mui/icons-material/Map';
import { useNavigate } from 'react-router-dom';
import { Edit, Save } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface DialogAddressCheckoutProps {
    open: boolean;
    setAddressCurrent: any;
    onClose: any;
}
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const DialogAddressCheckout: React.FC<DialogAddressCheckoutProps> = (props) => {
    const listAddress = useSelector((state: ReducerProps) => state.listAddress);
    //
    const { onClose, setAddressCurrent, open } = props;

    const handleClose = () => {
        onClose();
    };
    const nav = useNavigate();

    const handleListItemClick = (address: any) => {
        setAddressCurrent(address);
        onClose();
    };
    //
    const handleAddNew = () => {
        nav('/user/address/create');
        sessionStorage.setItem('prev', 'Checkout');
    };
    return (
        <>
            {listAddress.length > 0 ? (
                <Dialog fullScreen onClose={handleClose} open={open} TransitionComponent={Transition}>
                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <List sx={{ pt: 0 }}>
                        {listAddress.map((address: any) => (
                            <ListItem disableGutters key={address.id}>
                                <ListItemButton onClick={() => handleListItemClick(address)}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                            <PersonIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <div className="flex items-center">
                                        <div className="text-xs sm:text-sm flex items-center">{address.name}</div>
                                        <div className="ml-0 sm:ml-6 text-xs sm:text-sm flex items-center">
                                            <div className="text-blue-500 flex items-center">
                                                <LocalPhoneIcon /> &nbsp;
                                            </div>
                                            {address.phone}
                                        </div>
                                        <div className="ml-0 sm:ml-6 text-xs sm:text-sm flex items-center">
                                            <div className="text-blue-500 flex items-center">
                                                <MapIcon /> &nbsp;
                                            </div>
                                            <div>
                                                {address.apartment}, {address.ward.ward_name},{' '}
                                                {address.district.district_name}, {address.city.province_name}
                                            </div>
                                        </div>
                                    </div>
                                </ListItemButton>
                                <div className="ml-3 mr-3 cursor-pointer hover:opacity-70 flex items-center justify-center">
                                    <Edit
                                        onClick={() => {
                                            nav(`/user/address/edit/${address.id}`);
                                            sessionStorage.setItem('prev', 'Checkout');
                                        }}
                                    />
                                </div>
                            </ListItem>
                        ))}
                        <ListItem disableGutters>
                            <ListItemButton autoFocus onClick={() => handleAddNew()}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <AddIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Dialog>
            ) : (
                <>
                    <Dialog fullScreen onClose={handleClose} open={open} TransitionComponent={Transition}>
                        <AppBar sx={{ position: 'relative' }}>
                            <Toolbar>
                                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                    <CloseIcon />
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                        <ListItem disableGutters>
                            <ListItemButton autoFocus onClick={() => handleAddNew()}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <AddIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="" />
                            </ListItemButton>
                        </ListItem>
                    </Dialog>
                </>
            )}
        </>
    );
};

export default DialogAddressCheckout;
