import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useTranslation } from 'react-i18next';
import { Divider, Skeleton } from '@mui/material';
import { TextField } from '@mui/material';
import { filterSpecialInput } from '../../../untils/Logic';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { async } from '@firebase/util';
import Hot from './Hot';
import Suggestion from './Suggestion';
import { GetGuestApi, PostGuestApi } from '../../../untils/Api';
import ProductItemSearch from '../product/ProductItemSearch';
import { useStore } from 'react-redux';
import { change_is_loading } from '../../../reducers/Actions';
interface DrawerSearchProps {
    open: boolean;
    toggleDrawer: any;
}
const DrawerSearch: React.FC<DrawerSearchProps> = (props) => {
    const { open, toggleDrawer } = props;
    const { t } = useTranslation();
    const [search, setSearch] = useState<string>('');
    const [listHot, setListHot] = useState<Array<any>>([]);
    const [listSuggestion, setListSuggestion] = useState<Array<any>>([]);
    const [listProduct, setListProduct] = useState<any>(undefined);
    const store = useStore();

    //
    const typingTimeoutRef = useRef<any>(null);
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }
    //
    const getDataSearch = useCallback(async (search: any) => {
        const resSearch = await PostGuestApi('/api/search-product-by-name', { name: search, take: 10 });
        if (resSearch.data.message == 'Success') {
            setListProduct(resSearch.data.product);
        }
    }, []);
    const getDataSuggestion = async () => {
        store.dispatch(change_is_loading(true));
        const resProductSuggestion = await PostGuestApi('/api/product-many', { take: 4 });
        if (resProductSuggestion.data.message == 'Success') {
            setListSuggestion(resProductSuggestion.data.products);
        }
        store.dispatch(change_is_loading(false));
    };
    const getDataListHot = async () => {
        store.dispatch(change_is_loading(true));
        const resHot = await GetGuestApi('/api/keyword-hot');
        if (resHot.data.message == 'Success') {
            setListHot(resHot.data.keywords);
        }
        store.dispatch(change_is_loading(false));
    };
    useEffect(() => {
        typingTimeoutRef.current = setTimeout(() => {
            if (search != '') {
                getDataSearch(search);
            } else {
                setListProduct(undefined);
            }
        }, 500);
    }, [search]);
    useEffect(() => {
        if (open) {
            if (listSuggestion.length == 0) getDataSuggestion();
            if (listHot.length == 0) getDataListHot();
        }
    }, [open]);
    const DrawerList = (
        <Box sx={{ maxWidth: '900px', minWidth: '500px' }} role="presentation">
            <div className="pt-3 pl-3 pb-3 flex justify-start items-center bg-general">
                <KeyboardBackspaceIcon className="cursor-pointer" onClick={toggleDrawer(false)} />{' '}
                <span className="cursor-pointer pl-3" onClick={toggleDrawer(false)}>
                    {t('homepage.Exit')}
                </span>
            </div>
            <Divider />
            <div className="mt-6 mb-6 ml-12 mr-12 relative">
                <span className="absolute top-1 left-2">
                    <SearchIcon />
                </span>

                <TextField
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
                        filterSpecialInput(e.target.value, setSearch);
                    }}
                />
                {search ? (
                    <span className="absolute top-1 right-2 cursor-pointer">
                        <HighlightOffIcon
                            onClick={() => {
                                setSearch('');
                                setListProduct(undefined);
                            }}
                        />
                    </span>
                ) : null}
            </div>
            {listProduct ? (
                listProduct.map((product: any, index: number) => <ProductItemSearch key={index} product={product} />)
            ) : (
                <>
                    <div className="mt-6 ml-12 mr-12">
                        <div className="font-bold">{t('homepage.Hot key')}</div>

                        <div className="flex mt-3 grid grid-cols-4">
                            {listHot.length > 0 ? (
                                listHot.map((hot, index) => (
                                    <Hot key={index} hot={hot} setSearch={setSearch} getDataSearch={getDataSearch} />
                                ))
                            ) : (
                                <div className="col-span-4 grid grid-cols-4 w-full">
                                    <div>
                                        <Skeleton variant="rectangular" className=" m-3 rounded-full" height={50} />
                                    </div>
                                    <div>
                                        <Skeleton variant="rectangular" className=" m-3 rounded-full" height={50} />
                                    </div>
                                    <div>
                                        <Skeleton
                                            variant="rectangular"
                                            className=" mt-3 m-3 rounded-full"
                                            height={50}
                                        />
                                    </div>
                                    <div>
                                        <Skeleton
                                            variant="rectangular"
                                            className=" mt-3 m-3 rounded-full"
                                            height={50}
                                        />
                                    </div>
                                    <div>
                                        <Skeleton
                                            variant="rectangular"
                                            className=" mt-3 m-3 rounded-full"
                                            height={50}
                                        />
                                    </div>
                                    <div>
                                        <Skeleton
                                            variant="rectangular"
                                            className=" mt-3 m-3 rounded-full"
                                            height={50}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 ml-12 mr-12">
                        <div className="font-bold">{t('homepage.Product suggestions')}</div>
                        {listSuggestion.length > 0 ? (
                            <div className="flex mt-3 grid grid-cols-2">
                                {listSuggestion.map((suggestion, index) => (
                                    <Suggestion productId={suggestion.productId} key={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2">
                                <div>
                                    <Skeleton variant="rectangular" className=" m-3" height={129} />
                                </div>
                                <div>
                                    <Skeleton variant="rectangular" className=" m-3" height={129} />
                                </div>
                                <div>
                                    <Skeleton variant="rectangular" className="mt-3 m-3" height={129} />
                                </div>
                                <div>
                                    <Skeleton variant="rectangular" className="mt-3 m-3" height={129} />
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </Box>
    );
    return (
        <div>
            <Drawer className="" anchor="right" open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
};
export default DrawerSearch;
