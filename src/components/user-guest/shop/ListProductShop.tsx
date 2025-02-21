import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClearIcon from '@mui/icons-material/Clear';
import { GetGuestApi, PostGuestApi } from '../../../untils/Api';
import { change_is_loading } from '../../../reducers/Actions';
import ListProduct from '../product/ListProduct';
interface optionsFilterProps {
    sort: any;
}
const options = ['Option 1', 'Option 2'];
interface ListProductShopProps {
    shopId: String | undefined;
    discountCurrent: any;
    setDiscountCurrent: any;
}
const ListProductShop: React.FC<ListProductShopProps> = (props) => {
    const { shopId, discountCurrent, setDiscountCurrent } = props;
    const { t } = useTranslation();
    //
    const optionSort = [t('category.LowToHight'), t('category.HightToLow'), t('category.Sale')];
    const [optionSortCurrent, setOptionSortCurrent] = useState<any>('');
    //
    const [limit, setLimit] = useState<number>(72); //default get 120 product
    const [step, setStep] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [listProduct, setListProduct] = useState<any>([]);
    const [listProductCurrent, setListProductCurrent] = useState<any>(undefined);
    const [req, setReq] = useState<boolean>(true);
    const [optionsFilter, setOptionsFilter] = useState<optionsFilterProps>({
        sort: null,
    });
    const store = useStore();
    //
    const [pageCurrent, setPageCurrent] = useState<number>(1);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageCurrent(value);
    };
    useEffect(() => {
        setListProductCurrent(listProduct.slice(pageCurrent == 1 ? 0 : (pageCurrent - 1) * 24, 24 * pageCurrent));
    }, [pageCurrent]);
    //

    const handleChangeSort = (event: SelectChangeEvent) => {
        setOptionSortCurrent(event.target.value as string);
        if (event.target.value == '1') {
            setOptionsFilter((prev: any) => ({
                ...prev,
                sort: 'asc',
            }));
        } else if (event.target.value == '2') {
            setOptionsFilter((prev: any) => ({
                ...prev,
                sort: 'desc',
            }));
        } else if (event.target.value == '3') {
            setOptionsFilter((prev: any) => ({
                ...prev,
                sort: 'discount',
            }));
        }
        handleReq();
    };
    const handleClickMore = () => {
        setStep((prev: number) => (prev += 1));
        setReq(true);
    };
    const handleReq = () => {
        setLimit(60);
        setStep(1);
        if (optionsFilter.sort == 'desc' || optionsFilter.sort == 'asc') {
            setPageCurrent(1);
        }
        setReq(true);
    };
    const getProductByShop = async () => {
        if (shopId) {
            store.dispatch(change_is_loading(true));
            const resProducts = await PostGuestApi(`/api/get-product-by-shop/${shopId}/${limit}/${step}`, {
                options: optionsFilter,
                discount: discountCurrent,
            });
            if (resProducts.data.message == 'Success') {
                const filterProduct = resProducts.data.products.filter((products: any) => products != null);
                if (filterProduct.length < limit || optionsFilter.sort == 'desc' || optionsFilter.sort == 'asc') {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
                if (step == 1) {
                    setListProduct(filterProduct);
                } else {
                    setListProduct((prev: any) => prev.concat(filterProduct));
                }
                setReq(false);
            }
            store.dispatch(change_is_loading(false));
        }
    };

    useEffect(() => {
        getProductByShop();
    }, []);
    useEffect(() => {
        setListProductCurrent(listProduct.slice(0 + (pageCurrent - 1) * 24, 24 + (pageCurrent - 1) * 24));
    }, [listProduct]);
    useEffect(() => {
        if (req) {
            getProductByShop();
        }
    }, [req]);
    useEffect(() => {
        if (discountCurrent) {
            setOptionSortCurrent('');
            setOptionsFilter((prev: any) => ({
                sort: null,
            }));
            handleReq();
        }
    }, [discountCurrent]);
    // useEffect(() => {
    //     if (optionSortCurrent == 1) {
    //     }
    //     if (optionSortCurrent == 2) {
    //     }
    // }, [optionSortCurrent]);
    return (
        <div>
            <div>
                <div className="mt-8 border-b border-gray-300 flex relative">
                    <div
                        style={{
                            borderBottomWidth: 3,
                        }}
                        className="font-bold text-2xl border-b border-solid  border-blue-500"
                    >
                        {t('product.Product')}
                    </div>
                    {discountCurrent ? (
                        <div className="absolute top-0 right-12 t text-blue-400 text-xl font-normal flex">
                            {discountCurrent.name}
                            <div
                                onClick={() => {
                                    setDiscountCurrent(undefined);
                                    setOptionSortCurrent('');
                                    setOptionsFilter((prev: any) => ({
                                        sort: null,
                                    }));
                                    handleReq();
                                }}
                                style={{ width: 30, height: 30 }}
                                className="hover:opacity-70 hover:bg-gray-200 transition-all duration-500 cursor-pointer ml-3 border border-gray-300 flex justify-center items-center rounded-full"
                            >
                                <ClearIcon />
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
            <div className="mt-6">
                <div className="relative container">
                    <div className="w-full grid grid-cols-4 p-3 relative flex items-center">
                        <div className="col-span-1 lg:col-span-1">
                            <div className="font-bold pl-3">{t('category.Sort')}</div>

                            <Select
                                style={{ width: 240 }}
                                value={optionSortCurrent}
                                onChange={handleChangeSort}
                                IconComponent={() =>
                                    optionSortCurrent ? (
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setOptionSortCurrent('');
                                                setOptionsFilter((prev: any) => ({
                                                    sort: null,
                                                }));
                                                handleReq();
                                            }}
                                        >
                                            <ClearIcon />
                                        </div>
                                    ) : (
                                        <ArrowDropDownIcon />
                                    )
                                }
                            >
                                <MenuItem value={1}>{optionSort[0]}</MenuItem>
                                <MenuItem value={2}>{optionSort[1]}</MenuItem>
                                {!discountCurrent ? <MenuItem value={3}>{optionSort[2]}</MenuItem> : null}
                            </Select>
                        </div>
                    </div>
                    {listProduct.length > 0 ? (
                        <>
                            <div className="mt-6">
                                {listProductCurrent ? <ListProduct listProduct={listProductCurrent} /> : null}
                            </div>
                            <div className="w-full flex justify-center mt-12 mb-12">
                                <Stack spacing={2}>
                                    <Pagination
                                        count={Math.ceil(listProduct.length / 24)}
                                        defaultPage={listProduct.length / 48}
                                        siblingCount={0}
                                        page={pageCurrent}
                                        onChange={handleChange}
                                    />
                                </Stack>
                            </div>
                            {hasMore && pageCurrent == Math.ceil(listProduct.length / 24) ? (
                                <div className="flex justify-end absolute bottom-2 right-12 cursor-pointer hover:opacity-80">
                                    <div className="text-blue-400" onClick={handleClickMore}>
                                        <ArrowCircleDownIcon sx={{ height: 40, width: 40 }} />
                                    </div>
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListProductShop;
