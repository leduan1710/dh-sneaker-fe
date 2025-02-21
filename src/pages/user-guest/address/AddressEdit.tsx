import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useStore } from 'react-redux';
import LeftNav from '../../../components/user-guest/info-user/LeftNav';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { Button, Input } from '../../../components/ComponentsLogin';
import SaveIcon from '@mui/icons-material/Save';
import { GetApi, GetGuestApi, PostApi } from '../../../untils/Api';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import {  change_is_loading, change_item_address, change_user } from '../../../reducers/Actions';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { filterInputNumber, toastSuccess, toastWarning } from '../../../untils/Logic';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Alert } from '../../../components/alert/Alert';
import Checkbox from '@mui/material/Checkbox';
import Footer from '../../../components/user-guest/footer/Footer';

interface CityProps {
    province_id: string;
    province_name: string;
    province_type: string;
}

interface DistrictProps {
    district_id: string;
    district_name: string;
    district_type: string;
}
interface WardProps {
    ward_id: string;
    ward_name: string;
    ward_type: string;
}

interface AddressEditProps {}

const AddressEdit: React.FC<AddressEditProps> = (props) => {
    const location = useLocation();

    const { addressId } = useParams();
    const store = useStore();
    const { t } = useTranslation();
    const nav = useNavigate();
    //
    const [address, setAddress] = useState<any>(null);
    const [isChange, setIsChange] = useState<boolean>(false);
    const listAddress = useSelector((state: ReducerProps) => state.listAddress);
    //
    const [phone, setPhone] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [apartmentNumber, setApartmentNumber] = useState<string>('');
    const [isDefault, setIsDefault] = useState<boolean>(false);

    const [city, setCity] = useState<any>(null);
    const [district, setDistrict] = useState<any>(null);
    const [ward, setWard] = useState<any>(null);
    //
    const [citys, setCitys] = useState<CityProps[]>([]);
    const [districts, setDistricts] = useState<DistrictProps[]>([]);
    const [wards, setWards] = useState<WardProps[]>([]);
    //
    const setDataInput = (address: any) => {
        setPhone(address.phone);
        setName(address.name);
        setCity(address.city);
        setWard(address.ward);
        setApartmentNumber(address.apartment);
        setDistrict(address.district);
        setIsDefault(address.isDefault || false);
    };
    // const getDataAddress = async () => {
    //     const resAddress = await GetApi(`/user/address/get-id/${addressId}`, localStorage.getItem('token'));
    //     if (resAddress.status == 200) {
    //         setAddress(resAddress.data.Address);
    //         setDataInput(resAddress.data.Address);
    //     } else {
    //     }
    // };
    const getDataCity = async () => {
        store.dispatch(change_is_loading(true));
        const resCitys = await GetGuestApi('/province');
        if (resCitys.status == 200) {
            setCitys(resCitys.data.results);
        }
        store.dispatch(change_is_loading(false));
    };
    const getDataDistrict = async () => {
        store.dispatch(change_is_loading(true));
        const resDistricts = await GetGuestApi(`/province/district/${city.province_id}`);
        if (resDistricts.status == 200) {
            setDistricts(resDistricts.data.results);
        }
        store.dispatch(change_is_loading(false));
    };
    const getDataWard = async () => {
        store.dispatch(change_is_loading(true));
        const resWards = await GetGuestApi(`/province/ward/${district.district_id}`);
        if (resWards.status == 200) {
            setWards(resWards.data.results);
        }
        store.dispatch(change_is_loading(false));
    };
    //
    const handleSelectCity = (e: any) => {
        setIsChange(true);
        setCity({
            province_id: e.target.value,
            province_name: citys.find((city) => city.province_id === e.target.value)?.province_name,
        });
        setDistricts([]);
        setWards([]);
    };
    const handleSelectDistrict = (e: any) => {
        setDistrict({
            district_id: e.target.value,
            district_name: districts.find((district) => district.district_id === e.target.value)?.district_name,
        });
        setWards([]);
    };
    const handleSelectWard = (e: any) => {
        setWard({
            ward_id: e.target.value,
            ward_name: wards.find((ward) => ward.ward_id === e.target.value)?.ward_name,
        });
    };
    //
    const handleSaveAddress = async () => {
        if (phone != '' && apartmentNumber != '' && name != '' && city && district && ward) {
            const resSaveAddress = await PostApi(`/user/address/update/${addressId}`, localStorage.getItem('token'), {
                phone: phone,
                name: name,
                apartment: apartmentNumber,
                city: city,
                district: district,
                ward: ward,
            });
            if (resSaveAddress.status == 200) {
                toastSuccess(t('auth.Success'));
                const indexToReplace = listAddress.findIndex((address: any) => address.id === addressId);
                store.dispatch(change_item_address({ address: resSaveAddress.data.Address, index: indexToReplace }));
                if (isDefault) {
                    const resUpdateDefaultAddress = await PostApi(
                        '/user/update-default-address',
                        localStorage.getItem('token'),
                        { addressId: resSaveAddress.data.Address.id },
                    );
                    if (resUpdateDefaultAddress.status == 200) {
                        store.dispatch(change_user(resUpdateDefaultAddress.data.user));
                    }
                }
                if (sessionStorage.getItem('prev') == 'Checkout') {
                    nav('/checkout');
                    sessionStorage.setItem('prev', 'Edit');
                } else {
                    nav('/user/address');
                }
            }
        } else {
            toastWarning(t('auth.Please enter complete information'));
        }
    };
    //
    const handleBackAddress = () => {
        if (isChange) {
            Alert(() => {
                nav('/user/address');
            }, t('user.InfoNotSave'));
        } else {
            nav('/user/address');
        }
    };
    //
    useEffect(() => {
        // getDataCity();
        // getDataAddress();
    }, []);
    // useEffect(() => {
    //     if (city != null) {
    //         getDataDistrict();
    //     }
    // }, [city]);
    // useEffect(() => {
    //     if (district != null) {
    //         getDataWard();
    //     }
    // }, [district]);

    return (
        <div>
            <div style={{ marginTop: 120 }} className="container z-10">
                <div className="grid grid-cols-4  gap-4 container">
                    <div className="hidden lg:block col-span-1 bg-white box-shadow rounded-xl">
                        <LeftNav index={10} />
                    </div>
                    <div className="col-span-4 lg:col-span-3 mt-12 lg:mt-0">
                        <div className="flex items-center">
                            <Button onClick={handleBackAddress}>
                                <ArrowBackIcon />
                            </Button>
                            <h1 className="ml-5 text-2xl font-bold">{t('user.EditAddress')}</h1>
                        </div>
                        <div className="bg-white p-6 rounded-lg box-shadow mt-4 relative">
                            <div className="grid grid-cols-4 flex justify-center items-center">
                                <div className="font-bold">{t('user.Name')} :</div>
                                <div>
                                    <Input
                                        value={name}
                                        onChange={(e) => {
                                            setIsChange(true);
                                            setName(e.target.value);
                                        }}
                                        placeholder={t('user.Name')}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-4 flex justify-center items-center">
                                <div className="font-bold">{t('user.Phone')} :</div>
                                <div>
                                    <Input
                                        value={phone}
                                        onChange={(e) => {
                                            setIsChange(true);
                                            filterInputNumber(e.target.value, setPhone);
                                        }}
                                        placeholder={t('user.Phone')}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 flex justify-center items-center">
                                <div className="font-bold">{t('user.City')} :</div>
                                <div className="mt-2">
                                    <Select
                                        value={city && citys.length > 0 ? city.province_id : ''}
                                        fullWidth
                                        input={<OutlinedInput />}
                                        onChange={(e) => handleSelectCity(e)}
                                    >
                                        {citys.length > 0
                                            ? citys.map((city) => (
                                                  <MenuItem key={city.province_id} value={city.province_id}>
                                                      {city.province_name}
                                                  </MenuItem>
                                              ))
                                            : null}
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 flex justify-center items-center">
                                <div className="font-bold">{t('user.District')} :</div>
                                <div className="mt-2">
                                    <Select
                                        value={district && districts.length > 0 ? district.district_id : ''}
                                        fullWidth
                                        input={<OutlinedInput />}
                                        onChange={(e) => handleSelectDistrict(e)}
                                    >
                                        {districts.length > 0
                                            ? districts.map((district) => (
                                                  <MenuItem key={district.district_id} value={district.district_id}>
                                                      {district.district_name}
                                                  </MenuItem>
                                              ))
                                            : null}
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 flex justify-center items-center">
                                <div className="font-bold">{t('user.Ward')} :</div>
                                <div className="mt-2">
                                    <Select
                                        value={ward && wards.length > 0 ? ward.ward_id : ''}
                                        fullWidth
                                        input={<OutlinedInput />}
                                        onChange={(e) => handleSelectWard(e)}
                                    >
                                        {wards.length > 0
                                            ? wards.map((ward) => (
                                                  <MenuItem key={ward.ward_id} value={ward.ward_id}>
                                                      {ward.ward_name}
                                                  </MenuItem>
                                              ))
                                            : null}
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 flex justify-center items-center">
                                <div className="font-bold">{t('user.ApartmentNumber')} :</div>
                                <div>
                                    <Input
                                        value={apartmentNumber}
                                        onChange={(e) => {
                                            setIsChange(true);
                                            setApartmentNumber(e.target.value);
                                        }}
                                        placeholder={t('user.ApartmentNumber')}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div>{t('user.DefaultAddress')}</div>
                                <Checkbox
                                    defaultChecked
                                    value={isDefault}
                                    checked={isDefault}
                                    onChange={(e) => {
                                        setIsDefault(e.target.checked);
                                    }}
                                />
                            </div>
                            <div className="mt-12 mr-12">
                                <Button onClick={handleSaveAddress} className="flex items-center">
                                    <SaveIcon /> &nbsp; {t('user.Save')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
export default AddressEdit;
