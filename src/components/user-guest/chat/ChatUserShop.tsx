import React, { useEffect, useRef, useState } from 'react';
import 'react-chat-elements/dist/main.css';
import { Button, Input, MessageBox } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import SendIcon from '@mui/icons-material/Send';
import { GetApi, GetGuestApi, PostApi } from '../../../untils/Api';
import { socket_IO_Client } from '../../../routes/MainRoutes';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
    change_is_loading,
    change_is_open_chat,
    change_list_opposite_current,
    change_opposite_current,
} from '../../../reducers/Actions';
import ChatIcon from '@mui/icons-material/Chat';
import NavLef from './NavLeft';
import ListMessageDetailCurrent from './ListMessageDetailCurrent';
import { filterSpecialInput, toastWarning } from '../../../untils/Logic';
import PhotoIcon from '@mui/icons-material/Photo';
import { Button as Btn } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { HOST_BE } from '../../../common/Common';

interface ChatUserShopProps {}
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
const ChatUserShop: React.FC<ChatUserShopProps> = (props) => {
    const user = useSelector((state: ReducerProps) => state.user);
    const isOpenChat = useSelector((state: ReducerProps) => state.isOpenChat);
    const store = useStore();
    const [isReq, setIsReq] = useState<boolean>(false);
    const [listMessage, setListMessage] = useState<any>([]);
    const [listMessageDetailCurrent, setListMessageDetailCurrent] = useState<any>([]);
    const oppositeCurrent = useSelector((state: ReducerProps) => state.oppositeCurrent);
    const listOppositeCurrent = useSelector((state: ReducerProps) => state.listOppositeCurrent);
    const [value, setValue] = useState<any>('');
    const inputRef = useRef<any>();
    const getMessage = async () => {
        const res = await GetApi(`/user/get-message`, localStorage.getItem('token'));
        if (res.data.message == 'Success') {
            setListMessage(res.data.messages);
        }
        const shopIdList = res.data.messages.map((item: any) => item.shopId);
        const resOpposites = await PostApi('/user/get-opposite', localStorage.getItem('token'), {
            shopIdList: shopIdList,
        });
        if (resOpposites.data.message == 'Success') {
            const listOpposite = res.data.messages.map((item: any) => {
                const index = resOpposites.data.opposites.findIndex(
                    (itemOpposite: any) => itemOpposite.id == item.shopId,
                );
                if (index != -1) {
                    return resOpposites.data.opposites[index];
                }
            });
            store.dispatch(change_list_opposite_current(listOpposite));
        }

        setIsReq(false);
    };
    const getDataListMessageDetailCurrent = async () => {
        const index = listMessage.findIndex((item: any) => item.shopId == oppositeCurrent.id);
        if (index != -1) {
            const messageId = listMessage[index].id;
            const res = await GetApi(`/user/get-message-detail/${messageId}`, localStorage.getItem('token'));
            if (res.data.message == 'Success') {
                setListMessageDetailCurrent(res.data.messageDetails);
                setIsReq(false);
            }
        } else {
            setListMessageDetailCurrent([]);
        }
    };
    const createMessage = async () => {
        const res = await PostApi('/user/create-message', localStorage.getItem('token'), {
            shopId: oppositeCurrent.id,
        });
        if (res.data.message == 'Success') {
            setListMessage((prev: any) => [...prev, res.data.createMes.message]);
            setListMessageDetailCurrent((prev: any) => [...prev, res.data.createMes.messageDetail]);
        }
    };
    const handleAddMessage = async () => {
        if (value != '') {
            const index = listMessage.findIndex((item: any) => item.shopId == oppositeCurrent.id);
            if (index != -1) {
                const res = await PostApi('/user/add-message', localStorage.getItem('token'), {
                    messageId: listMessage[index].id,
                    content: value,
                    type: 'text',
                    isUserSent: true,
                });
                if (res.data.message == 'Success') {
                    setIsReq(true);
                }
                setValue('');
                inputRef.current.value = '';
            }
        }
    };
    const handleSelectImage = async (file: any) => {
        change_is_loading(true);
        //

        const uniqueFilename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const formData = new FormData();
        if (file) {
            const imageBlob = await fetch(URL.createObjectURL(file)).then((response) => response.blob());
            formData.append('file', imageBlob, uniqueFilename);
        }
        const res = await axios.post(`${HOST_BE}/user/upload-image-chat`, formData, {
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        if (res.data.message == 'Success') {
            const index = listMessage.findIndex((item: any) => item.shopId == oppositeCurrent.id);
            if (index != -1) {
                const res_add = await PostApi('/user/add-message', localStorage.getItem('token'), {
                    messageId: listMessage[index].id,
                    content: res.data.path,
                    type: 'photo',
                    isUserSent: true,
                });
                if (res_add.data.message == 'Success') {
                    setIsReq(true);
                }
            }
        }
        //
        change_is_loading(false);
    };
    useEffect(() => {
        if (oppositeCurrent) {
            getDataListMessageDetailCurrent();
            if (
                !listOppositeCurrent.some(
                    (item: any) => item.id === oppositeCurrent.id && item.name == oppositeCurrent.name,
                )
            ) {
                store.dispatch(change_list_opposite_current([oppositeCurrent, ...listOppositeCurrent]));
            }
        }
    }, [oppositeCurrent]);
    useEffect(() => {
        if (isReq) {
            getMessage();
        }
        if (oppositeCurrent) {
            getDataListMessageDetailCurrent();
            if (
                !listOppositeCurrent.some(
                    (item: any) => item.id === oppositeCurrent.id && item.name == oppositeCurrent.name,
                )
            ) {
                store.dispatch(change_list_opposite_current([oppositeCurrent, ...listOppositeCurrent]));
            }
        }
    }, [isReq]);
    useEffect(() => {
        socket_IO_Client.on('reqMessageNew', (data) => {
            setIsReq(true);
        });
        getMessage();
    }, []);
    return (
        <>
            {user ? (
                <>
                    <div className={`chat-box rounded-xl relative  ${isOpenChat ? 'show' : 'opacity-0 z-0'}`}>
                        <div className="col-span-2 text-white bg-general text-lg box-shadow pt-3 pb-3 rounded-tl-xl rounded-tr-xl pl-6 relative">
                            <div className="font-bold text-lg">CHAT</div>
                            <div
                                onClick={() => store.dispatch(change_is_open_chat(false))}
                                className="absolute top-2 right-2 cursor-pointer hover:opacity-80"
                            >
                                <HighlightOffIcon />
                            </div>
                        </div>
                        <div className="grid grid-cols-3">
                            <div className="col-span-1">
                                <NavLef />
                            </div>
                            <div className="col-span-2 relative">
                                <ListMessageDetailCurrent listMessageDetailCurrent={listMessageDetailCurrent} />
                                {oppositeCurrent ? (
                                    listMessageDetailCurrent.length > 0 ? (
                                        <>
                                            <div className="absolute left-0 bottom-1 right-auto w-full rounded-bl-xl rounded-br-xl box-shadow pl-7">
                                                <Input
                                                    referance={inputRef}
                                                    value={value}
                                                    placeholder="Type here..."
                                                    multiline={true}
                                                    maxHeight={100}
                                                    type="text"
                                                    onChange={(e: any) => filterSpecialInput(e.target.value, setValue)}
                                                    onKeyPress={(e: any) => {
                                                        if (e.shiftKey) {
                                                            return;
                                                        }
                                                        if (e.key == 'Enter') {
                                                            e.preventDefault();
                                                            handleAddMessage();
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div style={{ bottom: 9, left: -16 }} className="absolute cursor-pointer">
                                                <Btn
                                                    sx={{
                                                        '&:hover': {
                                                            backgroundColor: 'inherit',
                                                            boxShadow: 'none',
                                                        },
                                                    }}
                                                    style={{ padding: 0 }}
                                                    component="label"
                                                >
                                                    <PhotoIcon />
                                                    <VisuallyHiddenInput
                                                        style={{ width: 20 }}
                                                        type="file"
                                                        accept=".png, .jpg, .jpeg"
                                                        onChange={(e: any) => {
                                                            const file = e.target.files[0];
                                                            if (
                                                                file &&
                                                                (file.type === 'image/png' ||
                                                                    file.type === 'image/jpeg')
                                                            ) {
                                                                handleSelectImage(file);
                                                            } else {
                                                                toastWarning('');
                                                            }
                                                        }}
                                                    />
                                                </Btn>
                                            </div>
                                            <div style={{ bottom: 5 }} className="absolute cursor-pointer right-1">
                                                <Button text={'Send'} onClick={handleAddMessage} title="Send" />
                                            </div>
                                        </>
                                    ) : (
                                        <div
                                            onClick={createMessage}
                                            className="absolute text-center bottom-0 p-3 w-full cursor-pointer bg-blue-300 hover:opacity-80 transition-all duration-500"
                                        >
                                            GET START
                                        </div>
                                    )
                                ) : null}
                            </div>
                        </div>
                    </div>
                    {!isOpenChat && (
                        <div
                            style={{}}
                            onClick={() => store.dispatch(change_is_open_chat(true))}
                            className="fixed bottom-0 right-4 pt-3 pl-6 pr-6 rounded-tl-xl rounded-tr-xl z-1000 bg-blue-100 cursor-pointer "
                        >
                            CHAT &nbsp; <ChatIcon />
                        </div>
                    )}
                </>
            ) : null}
        </>
    );
};

export default ChatUserShop;
