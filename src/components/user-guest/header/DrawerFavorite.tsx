import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { useTranslation } from 'react-i18next';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { GetGuestApi } from '../../../untils/Api';
import FavoriteItem from '../favorite/FavoriteItem';
import { motion, AnimatePresence } from 'framer-motion';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceFrownOpen } from '@fortawesome/free-solid-svg-icons';
import { Divider } from '@mui/material';
import { set_number_favorite } from '../../../reducers/Actions';
interface DrawerFavoriteProps {
    open: boolean;
    toggleDrawer: any;
}

const DrawerFavorite: React.FC<DrawerFavoriteProps> = (props) => {
    const { open, toggleDrawer } = props;
    const { t } = useTranslation();
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const [listFavorite, setListFavorite] = useState<any>([]);
    const getListFavorite = async () => {
        setListFavorite([]);
        user.productFavoriteIdList.map(async (productId: any, index: any) => {
            const productFavorite = await GetGuestApi(`/api/product/${productId}`);
            if (productFavorite.status == 200) {
                setListFavorite((prev: any) => [...prev, productFavorite.data.product]);
            }
        });
    };
    useEffect(() => {
        if (user.id && listFavorite.length != user.productFavoriteIdList.length) {
            getListFavorite();
        }
    }, [user]);
    
    const DrawerList = (
        <Box sx={{ width: '100%', minWidth: 400, maxWidth: 550 }} role="presentation">
            <div className="pt-3 pl-3 pb-3 flex justify-start items-center bg-general sticky top-0 right-0 left-0 z-10">
                <KeyboardBackspaceIcon className="cursor-pointer" onClick={toggleDrawer(false)} />{' '}
                <span className="cursor-pointer pl-3" onClick={toggleDrawer(false)}>
                    {t('homepage.Exit')}
                </span>
            </div>
            <AnimatePresence>
                {listFavorite.length > 0 ? (
                    <div className="p-2">
                        {listFavorite.map((product: any, index: number) => {
                            if (product && product.id) {
                                return (
                                    <motion.li
                                        style={{ listStyleType: 'none' }}
                                        key={index}
                                        initial={{ opacity: 1, height: 'auto' }}
                                        exit={{
                                            opacity: 0,
                                            height: 0,
                                            transition: { duration: 0.2 },
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FavoriteItem key={product.id} product={product} />
                                    </motion.li>
                                );
                            }
                        })}
                    </div>
                ) : (
                    <div>
                        <div className="w-full text-center mt-3">
                            <FontAwesomeIcon icon={faFaceFrownOpen} size="2xl" style={{ color: '#74C0FC' }} />
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </Box>
    );
    return (
        <div>
            <Drawer className="relative" anchor="right" open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
};
export default DrawerFavorite;
