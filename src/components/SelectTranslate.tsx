import React, { useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { initI18n } from '../translate/Translate';
import { typeLng } from '../common/Common';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../reducers/ReducersProps';
import { set_lng } from '../reducers/Actions';
interface SelectTranslateProps {}
const SelectTranslate: React.FC<SelectTranslateProps> = (props) => {
    const [lng, setLng] = useState<number>(sessionStorage.getItem('lng') == 'en' ? 2 : 1);
    const store = useStore();
    const changeLng = (e: any) => {
        setLng(e.target.value);
        if (e.target.value == 1) {
            initI18n(typeLng.VN);
            store.dispatch(set_lng(typeLng.VN));

            sessionStorage.setItem('lng', typeLng.VN);
        }
        if (e.target.value == 2) {
            store.dispatch(set_lng(typeLng.EN));
            initI18n(typeLng.EN);
            sessionStorage.setItem('lng', typeLng.EN);
        }
    };
    return (
        <div className="mt-6 fixed bottom-20 right-1 z-10 bg-white rounded-xl">
            <Select
                id="demo-simple-select"
                value={lng}
                onChange={(e) => changeLng(e)}
                style={{
                    fontSize: '11px',
                    height: '30px',
                    padding: 0,
                    margin: 0,
                }}
            >
                <MenuItem
                    value={1}
                    style={{
                        fontSize: '11px',
                    }}
                >
                    VN
                </MenuItem>
                <MenuItem
                    value={2}
                    style={{
                        fontSize: '11px',
                    }}
                >
                    EN
                </MenuItem>
            </Select>
        </div>
    );
};
export default SelectTranslate;
