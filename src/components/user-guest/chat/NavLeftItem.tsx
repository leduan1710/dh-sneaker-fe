import React, { useEffect, useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { change_opposite_current } from '../../../reducers/Actions';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { Avatar, Badge } from '@mui/material';
import { shortedString } from '../../../untils/Logic';
import { GetApi } from '../../../untils/Api';
import { socket_IO_Client } from '../../../routes/MainRoutes';

interface NavLeftItemProps {
    opposite: any;
}

const NavLeftItem: React.FC<NavLeftItemProps> = (props) => {
    const { opposite } = props;
    const store = useStore();
    const oppositeCurrent = useSelector((state: ReducerProps) => state.oppositeCurrent);
    const [numberUnread, setNumberUnread] = useState<number>(0);
    const [isReq, setIsReq] = useState<boolean>(false);
    const getNumberUnread = async () => {
        const res = await GetApi(`/user/get-unread/${opposite.id}`, localStorage.getItem('token'));
        if (res.data.message == 'Success') {
            setNumberUnread(res.data.numberUnread);
        }
        setIsReq(false);
    };
    useEffect(() => {
        getNumberUnread();
        socket_IO_Client.on('reqMessageNew', (data) => {
            setIsReq(true);
        });
    }, []);
    useEffect(() => {
        getNumberUnread();
    }, [isReq]);
    return (
        <>
            <div
                onClick={() => {
                    setNumberUnread(0);
                    store.dispatch(change_opposite_current(opposite));
                }}
                className={`text-center pt-4 pb-3 ${
                    opposite.id == oppositeCurrent?.id ? 'bg-gray-300' : ''
                } opacity-80  cursor-pointer `}
            >
                <Badge badgeContent={numberUnread} color="error">
                    <div style={{ width: 140 }} className="grid grid-cols-3 flex items-center">
                        <div className="col-span-1">
                            <Avatar
                                className="rounded-full"
                                style={{ width: 40, height: 40, objectFit: 'cover' }}
                                src={opposite.image}
                            />
                        </div>
                        <div className="col-span-2">{shortedString(opposite.name, 8)}</div>
                    </div>
                </Badge>
            </div>
        </>
    );
};

export default NavLeftItem;
