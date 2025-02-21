import React from 'react';
import { useTranslation } from 'react-i18next';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Height } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useStore } from 'react-redux';
import { change_user, delete_item_address } from '../../../reducers/Actions';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { useNavigate } from 'react-router-dom';
import { PostApi } from '../../../untils/Api';
interface AddressItemProps {
    address: any;
    index: number;
}

const AddressItem: React.FC<AddressItemProps> = (props) => {
    const { address, index } = props;
    const { t } = useTranslation();
    const store = useStore();
    const nav = useNavigate();
    const listAddress = useSelector((state: ReducerProps) => state.listAddress);
    const user = useSelector((state: ReducerProps) => state.user);
    const handleDelete = async () => {
        //logic be
        const resDelete = await PostApi(`/user/delete-address/${address.id}`, localStorage.getItem('token'), {});
        if (resDelete.data.message == 'Success') {
            store.dispatch(change_user(resDelete.data.user));
        }
        //logic fe
        store.dispatch(delete_item_address(index));
    };
    const handleEditAddress = () => {
        nav(`/user/address/edit/${address.id}`);
    };
    return (
        <div className="relative">
            <div
                onClick={handleEditAddress}
                className="mt-4 border border-gray-300 rounded-xl p-3 hover:bg-gray-300 hover:opacity-90 cursor-pointer"
            >
                <div className="text-xl flex items-center">
                    <h1> {address.name.toUpperCase()}</h1>
                    {user.defaultAddressId != '' ? (
                        user.defaultAddressId == address.id ? (
                            <h1 className=" ml-6 flex items-center text-sm">
                                <CheckCircleOutlineIcon sx={{ height: 16, width: 16, color: 'green' }} /> &nbsp;
                                <h1 className="text-green-700">{t('user.Default')}</h1>
                            </h1>
                        ) : null
                    ) : null}
                </div>
                <div className="mt-3">
                    <div className="block sm:flex items-center">
                        <h1 className="font-thin">{t('user.Address')} :</h1>
                        <h1 className="ml-0 sm:ml-1 font-medium">
                            {address.apartment}, {address.ward.ward_name}, {address.district.district_name},{' '}
                            {address.city.province_name}
                        </h1>
                    </div>
                    <div className="block sm:flex items-center">
                        <h1 className="font-thin">{t('user.Phone')} :</h1>
                        <h1 className="ml-0 sm:ml-1 font-medium">{address.phone}</h1>
                    </div>
                </div>
            </div>
            <div onClick={handleDelete} className="absolute top-2 right-2 hover:text-red-500 cursor-pointer">
                <DeleteIcon sx={{ height: 30, width: 30 }} />
            </div>
        </div>
    );
};

export default AddressItem;
