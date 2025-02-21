import React, { useEffect, useRef, useState } from 'react';
import { GetGuestApi } from '../../../untils/Api';
import Footer from '../../../components/user-guest/footer/Footer';
import MultiCaroselCategory from '../../../components/user-guest/category/MultiCaroselCategory';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import { TextField } from '@mui/material';
import { filterSpecialInput } from '../../../untils/Logic';
import { useNavigate } from 'react-router-dom';
import ProductTop from '../../../components/user-guest/product/ProductTop';
import { useStore } from 'react-redux';
import { change_is_loading } from '../../../reducers/Actions';
import InventoryIcon from '@mui/icons-material/Inventory';
const Category: React.FC<any> = (props) => {
    const [categorys, setCategorys] = useState<any>([]);
    const { t } = useTranslation();
    const [search, setSearch] = useState<string>('');
    const [listSearch, setListSearch] = useState<any>([]);
    const nav = useNavigate();
    const store = useStore();
    //
    const getDataCategory = async () => {
        store.dispatch(change_is_loading(true));
        const resCategorys = await GetGuestApi('/api/get-category');
        if (resCategorys.data.message == 'Success') {
            setCategorys(resCategorys.data.categories);
        }
        store.dispatch(change_is_loading(false));
    };

    //
    const typingTimeoutRef = useRef<any>(null);
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }
    //
    const searchCategorys = (search: any) => {
        if (!search) return [];
        setListSearch(categorys.filter((category: any) => category.name.toLowerCase().includes(search.toLowerCase())));
    };
    useEffect(() => {
        getDataCategory();
    }, []);
    useEffect(() => {
        typingTimeoutRef.current = setTimeout(() => {
            if (search != '') {
                searchCategorys(search);
            } else {
                setListSearch([]);
            }
        }, 500);
    }, [search]);
    return (
        <div>
            <div className="container">
                <div style={{ marginTop: 120 }}>
                    <div className="mt-6 ml-12 mr-12 relative">
                        <span className="absolute top-1 left-2">
                            <SearchIcon />
                        </span>
                        <div className="grid grid-col-1 lg:grid-cols-2">
                            <div className="flex justify-center items-center">
                                <TextField
                                    className="bg-white rounded-2xl"
                                    id="outlined-basic"
                                    variant="outlined"
                                    fullWidth
                                    value={search}
                                    InputProps={{
                                        style: { borderRadius: '100px', height: '37px' },
                                    }}
                                    inputProps={{
                                        style: { paddingLeft: 40, paddingRight: 40 },
                                    }}
                                    onChange={(e) => {
                                        const value = filterSpecialInput(e.target.value, setSearch);
                                    }}
                                />
                                {listSearch.length > 0 ? (
                                    <div
                                        style={{ top: 40, width: '20%', maxHeight: '250px', overflowY: 'auto' }}
                                        className="absolute box-shadow rounded-xl bg-white z-10"
                                    >
                                        {listSearch.map((category: any) => (
                                            <div className="border-b border-gray-300 ml-1 mr-1 bg-white">
                                                <div
                                                    onClick={() => nav(`/category-view/${category.id}`)}
                                                    className="font-thin  m-1 p-1 cursor-pointer hover:bg-gray-300 rounded"
                                                >
                                                    {category.name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                            <div className="hidden lg:flex justify-center items-center font-bold text-xl">
                                <InventoryIcon sx={{ width: 40, height: 40 }} /> &nbsp; {t('product.Category')}
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            marginTop: 50,
                        }}
                        className=" border-b border-gray-300 flex"
                    >
                        <div
                            style={{
                                borderBottomWidth: 3,
                            }}
                            className="font-bold text-2xl border-b border-solid  border-blue-500"
                        >
                            {t('category.Categorys')}
                        </div>
                    </div>
                    {categorys.length > 0 ? (
                        <div className="mt-6">
                            <MultiCaroselCategory listCategory={categorys} />
                        </div>
                    ) : null}
                    <div className=" border-b border-gray-300 flex mt-6">
                        <div
                            style={{
                                borderBottomWidth: 3,
                            }}
                            className="font-bold text-2xl border-b border-solid  border-blue-500"
                        >
                            {t('product.ProductTop')}
                        </div>
                    </div>
                    <div>
                        <ProductTop />
                    </div>
                </div>
            </div>
            {categorys.length > 0 ? <Footer /> : null}
        </div>
    );
};

export default Category;
