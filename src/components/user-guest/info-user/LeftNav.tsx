import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import { useTranslation } from 'react-i18next';
import DiscountIcon from '@mui/icons-material/Discount';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { useSelector } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { AlertAddShop } from '../../alert/Alert';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import WalletIcon from '@mui/icons-material/Wallet';
interface LeftNavProps {
    index: number;
}

const LeftNav: React.FC<LeftNavProps> = (props) => {
    const { t } = useTranslation();
    const { index } = props;
    const nav = useNavigate();
    const user = useSelector((state: ReducerProps) => state.user);
    const handleClickShop = () => {
        if (user.shopId == null) {
            AlertAddShop(() => {
                nav('/user/register-shop');
            });
        } else {
            // window.location.href = `/shop/${user.shopId}`;
            window.location.href = `/shop`;
        }
    };
    return (
        <div className="p-6 rounded-lg mt-4">
            <div
                className={`transition-transform duration-500 ease-linear transform hover:translate-x-4 rounded p-4 cursor-pointer flex items-center ${
                    index == 0
                        ? 'bg-blue-200 font-bold opacity-70 hover:opacity-50'
                        : 'hover:bg-blue-200 hover:opacity-70'
                }`}
                onClick={() => nav('/user/info-user')}
            >
                <PersonIcon /> &nbsp;<div>{t('user.Profile')}</div>
            </div>
            <div
                onClick={() => nav('/user/order', { state: { indexTabs: 0 } })}
                className={`transition-transform duration-500 ease-linear transform hover:translate-x-4 rounded p-4 cursor-pointer flex items-center mt-6 ${
                    index == 3
                        ? 'bg-blue-200 font-bold opacity-70 hover:opacity-50'
                        : 'hover:bg-blue-200 hover:opacity-70'
                }`}
            >
                <InventoryIcon /> &nbsp;<div>{t('user.Orders')}</div>
            </div>
        </div>
    );
};
export default LeftNav;
