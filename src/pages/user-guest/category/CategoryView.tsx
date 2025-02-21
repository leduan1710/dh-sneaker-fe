import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GetGuestApi, PostGuestApi } from '../../../untils/Api';
import Header from '../../../components/user-guest/header/Header';
import { useTranslation } from 'react-i18next';
import ListProduct from '../../../components/user-guest/product/ListProduct';
import { useStore } from 'react-redux';
import { change_is_loading } from '../../../reducers/Actions';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClearIcon from '@mui/icons-material/Clear';
import MultiCaroselProductJV from '../../../components/user-guest/product/MultiCaroselProductJV';
import DrawMore from '../../../components/user-guest/category/DrawMore';
import { HOST_BE } from '../../../common/Common';
import { ca } from 'date-fns/locale';
interface optionsFilterProps {
    sort: any;
    materialId: any;
    brandId: any;
    styleId: any;
    originId: any;
}
const options = ['Option 1', 'Option 2'];

const CategoryView: React.FC<any> = (props) => {
    const [value, setValue] = React.useState<string | null>(options[0]);
    const [inputValue, setInputValue] = React.useState('');
    const { categoryId } = useParams();
    const [category, setCategory] = useState<any>(undefined);
    const [categoryIdCurrent, setCategoryIdCurrent] = useState<any>(categoryId);
    const { t } = useTranslation();
    //
    const optionSort = [t('category.LowToHight'), t('category.HightToLow'), t('category.Sale')];
    const [optionMaterial, setOptionMaterial] = useState<any>(undefined);
    const [optionStyle, setOptionStyle] = useState<any>(undefined);
    const [optionBrand, setOptionBrand] = useState<any>(undefined);
    const [optionOrigin, setOptionOrigin] = useState<any>(undefined);
    const [optionMaterialCurrent, setOptionMaterialCurent] = useState<any>('');
    const [optionBrandCurrent, setOptionBrandCurent] = useState<any>('');
    const [optionStylesCurrent, setOptionStylesCurent] = useState<any>('');
    const [optionOriginCurrent, setOptionOriginCurent] = useState<any>('');
    const [optionSortCurrent, setOptionSortCurrent] = useState<any>('');
    const [listCategoryChild, setListCategoryChild] = useState<any>(undefined);
    const [listCategoryChildWomen, setListCategoryChildWomen] = useState<any>(undefined);

    //
    const [limit, setLimit] = useState<number>(60); //default get 120 product
    const [step, setStep] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [listProduct, setListProduct] = useState<any>([]);
    const [listProductCurrent, setListProductCurrent] = useState<any>(undefined);
    const [req, setReq] = useState<boolean>(true);
    const [optionsFilter, setOptionsFilter] = useState<optionsFilterProps>({
        sort: null,
        materialId: null,
        brandId: null,
        styleId: null,
        originId: null,
    });
    const store = useStore();
    //
    const [pageCurrent, setPageCurrent] = useState<number>(1);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageCurrent(value);
        window.location.href = '#product-list-category-view';
    };
    useEffect(() => {
        setListProductCurrent(listProduct.slice(pageCurrent == 1 ? 0 : (pageCurrent - 1) * 24, 24 * pageCurrent));
    }, [pageCurrent]);
    //
    const handleChangeOptionBrand = (event: SelectChangeEvent) => {
        setOptionBrandCurent(event.target.value as string);
        setOptionsFilter((prev: any) => ({
            ...prev,
            brandId: event.target.value,
        }));
        handleReq();
    };
    const handleChangeOptionMaterial = (event: SelectChangeEvent) => {
        setOptionMaterialCurent(event.target.value as string);
        setOptionsFilter((prev: any) => ({
            ...prev,
            materialId: event.target.value,
        }));
        handleReq();
    };
    const handleChangeOptionStyles = (event: SelectChangeEvent) => {
        setOptionStylesCurent(event.target.value as string);
        setOptionsFilter((prev: any) => ({
            ...prev,
            styleId: event.target.value,
        }));
        handleReq();
    };
    const handleChangeOptionOrigin = (event: SelectChangeEvent) => {
        setOptionOriginCurent(event.target.value as string);
        setOptionsFilter((prev: any) => ({
            ...prev,
            originId: event.target.value,
        }));
        handleReq();
    };
    // data
    const getDataCategory = async () => {
        const resCategory = await GetGuestApi(`/api/category/${categoryId}`);
        if (resCategory.data.message == 'Success') {
            setCategory(resCategory.data.category);
            if (resCategory.data.category.categoryIdClIST.length > 0) {
                //
                const resCheckTypeCategory = await PostGuestApi(`/api/category/checktype`, { categoryId: categoryId });
                if (resCheckTypeCategory.data.message == 'Success') {
                    if (resCheckTypeCategory.data.type == 'Men') {
                        const categoryChilds = await PostGuestApi(`/api/category-many`, {
                            // listCategoryId: resCategory.data.category.categoryIdClIST,
                            categoryPId: '66eac5c7f7adcbed07e215bd',
                        });
                        if (categoryChilds.data.message == 'Success') {
                            const categoryMap: any = {};
                            categoryChilds.data.categories.forEach((category: any) => {
                                categoryMap[category.id] = category;
                            });

                            // Bước 2: Tạo mảng kết quả
                            const result: any = [];
                            categoryChilds.data.categories.forEach((category: any) => {
                                if (category.categoryIdClIST.length > 0) {
                                    result.push({
                                        parent: category,
                                        children: category.categoryIdClIST.map((childId: any) => categoryMap[childId]),
                                    });
                                }
                            });

                            setListCategoryChild(result);
                        }
                    }
                    if (resCheckTypeCategory.data.type == 'Women') {
                        //
                        const categoryChildsWomen = await PostGuestApi(`/api/category-many`, {
                            // listCategoryId: resCategory.data.category.categoryIdClIST,
                            categoryPId: '66eac608a9606d68cd102d21',
                        });
                        if (categoryChildsWomen.data.message == 'Success') {
                            const categoryMap: any = {};
                            categoryChildsWomen.data.categories.forEach((category: any) => {
                                categoryMap[category.id] = category;
                            });

                            // Bước 2: Tạo mảng kết quả
                            const result: any = [];
                            categoryChildsWomen.data.categories.forEach((category: any) => {
                                if (category.categoryIdClIST.length > 0) {
                                    result.push({
                                        parent: category,
                                        children: category.categoryIdClIST.map((childId: any) => categoryMap[childId]),
                                    });
                                }
                            });

                            setListCategoryChildWomen(result);
                        }
                    }
                }
            }
        }
    };
    const getDataFilter = async () => {
        const resMaterials = await GetGuestApi('/api/all-material');
        if (resMaterials.data.message == 'Success') {
            setOptionMaterial(resMaterials.data.materials);
        }
        const resOrigins = await GetGuestApi('/api/all-origin');
        if (resOrigins.data.message == 'Success') {
            setOptionOrigin(resOrigins.data.origins);
        }
        const resStyles = await GetGuestApi('/api/all-style');
        if (resStyles.data.message == 'Success') {
            setOptionStyle(resStyles.data.styles);
        }
        const resBrands = await GetGuestApi('/api/all-brand');
        if (resBrands.data.message == 'Success') {
            setOptionBrand(resBrands.data.brands);
        }
    };
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
    const getProductByCategory = async () => {
        if (categoryIdCurrent) {
            store.dispatch(change_is_loading(true));
            const resProducts = await PostGuestApi(
                `/api/get-product-by-category/${categoryIdCurrent}/${limit}/${step}`,
                {
                    options: optionsFilter,
                },
            );
            if (resProducts.data.message == 'Success') {
                const filterProduct = resProducts.data.products.filter((product: any) => product != null);
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
        getDataCategory();
        getDataFilter();
    }, []);
    useEffect(() => {
        setListProductCurrent(listProduct.slice(0 + (pageCurrent - 1) * 24, 24 + (pageCurrent - 1) * 24));
    }, [listProduct]);
    useEffect(() => {
        if (req) {
            getProductByCategory();
        }
    }, [req]);
    // useEffect(() => {
    //     if (req) {
    //         getProductByCategory();
    //     }
    // }, [categoryIdCurrent]);
    // useEffect(() => {
    //     if (optionSortCurrent == 1) {
    //     }
    //     if (optionSortCurrent == 2) {
    //     }
    // }, [optionSortCurrent]);
    return (
        <div>
            <div style={{ marginTop: 120 }}>
                {category ? (
                    <div className="font-bold text-xl m-3">
                        <div>
                            <img
                                className="rounded-xl"
                                style={{
                                    width: '100%',
                                    height: 600,
                                    objectFit: 'contain',
                                }}
                                src={
                                    category.image
                                        ? category.image.startsWith('uploads')
                                            ? `${HOST_BE}/${category.image}`
                                            : category.image
                                        : ''
                                }
                            />
                        </div>
                        <div className="container">
                            <div className="p-3 mt-6 font-bold text-center text-3xl">{category.name}</div>
                            <div
                                style={{
                                    borderBottomWidth: 3,
                                }}
                                className="font-bold text-2xl border-b border-solid  border-red-500 mt-12 relative"
                            >
                                {t('product.Product')}
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <div id="product-list-category-view" className="mt-12">
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
                                                    ...prev,
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
                                <MenuItem value={3}>{optionSort[2]}</MenuItem>
                            </Select>
                        </div>
                        <div className="col-span-4 lg:col-span-3 grid grid-cols-4">
                            <div className="col-span-2 xl:col-span-1">
                                <div className="font-bold pl-3">{t('product.Material')}</div>
                                <Select
                                    className="relative"
                                    style={{ width: 240 }}
                                    value={optionMaterialCurrent}
                                    onChange={handleChangeOptionMaterial}
                                    IconComponent={() =>
                                        optionMaterialCurrent ? (
                                            <div
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    setOptionMaterialCurent('');
                                                    setOptionsFilter((prev: any) => ({
                                                        ...prev,
                                                        materialId: 0,
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
                                    {optionMaterial
                                        ? optionMaterial.map((material: any, index: number) => (
                                              <MenuItem value={material.id}>{material.name}</MenuItem>
                                          ))
                                        : null}
                                </Select>
                            </div>
                            <div className="col-span-2 xl:col-span-1">
                                <div className="font-bold pl-3">{t('product.Origin')}</div>
                                <Select
                                    style={{ width: 240 }}
                                    value={optionOriginCurrent}
                                    onChange={handleChangeOptionOrigin}
                                    IconComponent={() =>
                                        optionOriginCurrent ? (
                                            <div
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    setOptionOriginCurent('');
                                                    setOptionsFilter((prev: any) => ({
                                                        ...prev,
                                                        originId: 0,
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
                                    {optionOrigin
                                        ? optionOrigin.map((origin: any, index: number) => (
                                              <MenuItem value={origin.id}>{origin.name}</MenuItem>
                                          ))
                                        : null}
                                </Select>
                            </div>
                            <div className="col-span-2 xl:col-span-1">
                                <div className="font-bold pl-3">{t('product.Styles')}</div>
                                <Select
                                    style={{ width: 240 }}
                                    value={optionStylesCurrent}
                                    onChange={handleChangeOptionStyles}
                                    IconComponent={() =>
                                        optionStylesCurrent ? (
                                            <div
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    setOptionStylesCurent('');
                                                    setOptionsFilter((prev: any) => ({
                                                        ...prev,
                                                        styleId: 0,
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
                                    {optionStyle
                                        ? optionStyle.map((style: any, index: number) => (
                                              <MenuItem value={style.id}>{style.name}</MenuItem>
                                          ))
                                        : null}
                                </Select>
                            </div>
                            <div className="col-span-2 xl:col-span-1">
                                <div className="font-bold pl-3">{t('product.Brand')}</div>
                                <Select
                                    style={{ width: 240 }}
                                    value={optionBrandCurrent}
                                    onChange={handleChangeOptionBrand}
                                    IconComponent={() =>
                                        optionBrandCurrent ? (
                                            <div
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    setOptionBrandCurent('');
                                                    setOptionsFilter((prev: any) => ({
                                                        ...prev,
                                                        brandId: 0,
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
                                    {optionBrand
                                        ? optionBrand.map((brand: any, index: number) => (
                                              <MenuItem value={brand.id}>{brand.name}</MenuItem>
                                          ))
                                        : null}
                                </Select>
                            </div>
                        </div>
                    </div>
                    {listProduct.length > 0 ? (
                        <>
                            <div className="mt-12 grid grid-cols-5">
                                <div className="col-span-1 p-1 box-shadow rounded-xl mt-1">
                                    {listCategoryChild ? (
                                        <div>
                                            <div className="font-bold p-3">{t('homepage.Men Fashion')}</div>
                                            <DrawMore
                                                setCategoryIdCurrent={setCategoryIdCurrent}
                                                listCategoryChild={listCategoryChild}
                                                handleReq={handleReq}
                                                categoryPId={categoryIdCurrent}
                                                setPageCurrent={setPageCurrent}
                                            />
                                        </div>
                                    ) : null}
                                    {listCategoryChildWomen ? (
                                        <div>
                                            <div className="font-bold p-3">{t('homepage.Women Fashion')}</div>
                                            <DrawMore
                                                setCategoryIdCurrent={setCategoryIdCurrent}
                                                listCategoryChild={listCategoryChildWomen}
                                                handleReq={handleReq}
                                                categoryPId={categoryIdCurrent}
                                                setPageCurrent={setPageCurrent}
                                            />
                                        </div>
                                    ) : null}
                                </div>
                                <div className="col-span-4">
                                    {listProductCurrent ? <ListProduct listProduct={listProductCurrent} /> : null}
                                </div>
                            </div>
                            <div className="w-full flex justify-center mt-12 mb-12 grid">
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
                <MultiCaroselProductJV />
            </div>
        </div>
    );
};

export default CategoryView;
