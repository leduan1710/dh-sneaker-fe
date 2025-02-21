import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useTranslation } from 'react-i18next';
import InventoryIcon from '@mui/icons-material/Inventory';
import { FEMALE_ID, MALE_ID } from '../../../common/Common';
interface DrawerMenuProps {
    open: boolean;
    toggleDrawer: any;
}

const DrawerMenu: React.FC<DrawerMenuProps> = (props) => {
    const { open, toggleDrawer } = props;
    const { t } = useTranslation();
    const DrawerList = (
        <Box sx={{ width: '300px' }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                <ListItem
                    onClick={() => {
                        window.location.href = '/category';
                    }}
                    key={t('homepage.Category')}
                    disablePadding
                >
                    <ListItemButton>
                        <ListItemIcon>
                            <InventoryIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('homepage.Category')} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={t('homepage.New Product')} disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <InventoryIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('homepage.New Product')} />
                    </ListItemButton>
                </ListItem>
                <ListItem
                    onClick={() => (window.location.href = `/category-view/${MALE_ID}`)}
                    key={t('homepage.Men Fashion')}
                    disablePadding
                >
                    <ListItemButton>
                        <ListItemIcon>
                            <InventoryIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('homepage.Men Fashion')} />
                    </ListItemButton>
                </ListItem>
                <ListItem
                    onClick={() => (window.location.href = `/category-view/${FEMALE_ID}`)}
                    key={t('homepage.Women Fashion')}
                    disablePadding
                >
                    <ListItemButton>
                        <ListItemIcon>
                            <InventoryIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('homepage.Women Fashion')} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
    return (
        <div>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
};
export default DrawerMenu;
