import { Avatar, dividerClasses } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { change_opposite_current } from '../../../reducers/Actions';
import { shortedString } from '../../../untils/Logic';
import NavLeftItem from './NavLeftItem';

interface NavLeftProps {}
const NavLef: React.FC<NavLeftProps> = (props) => {
    const store = useStore();
    const oppositeCurrent = useSelector((state: ReducerProps) => state.oppositeCurrent);
    const listOppositeCurrent = useSelector((state: ReducerProps) => state.listOppositeCurrent);

    useEffect(() => {}, []);
    return (
        <div className="bg-gray-100 overflow-y-scroll rounded-bl-xl " style={{ height: 515 }}>
            {listOppositeCurrent.length > 0
                ? listOppositeCurrent.map((opposite: any) => <NavLeftItem key={opposite.id} opposite={opposite} />)
                : // <div className="text-center p-2 bg-blue-400 opacity-80 grid grid-cols-3 flex items-center cursor-pointer">
                  //     <div className="col-span-1 flex justify-center">
                  //         <img
                  //             className="rounded-full"
                  //             style={{ width: 40, height: 40, objectFit: 'cover' }}
                  //             src={oppositeCurrent.image}
                  //             alt=""
                  //         />
                  //     </div>
                  //     <div className="col-span-2">{oppositeCurrent.name}</div>
                  // </div>
                  null}
        </div>
    );
};

export default NavLef;
