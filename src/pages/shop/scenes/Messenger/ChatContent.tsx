import React, { useEffect, useRef, useState } from 'react';
import { Box, Avatar, Typography, Card, styled, Divider, Modal } from '@mui/material';

import { formatDistance, format, subDays, subHours, subMinutes } from 'date-fns';
import ScheduleTwoToneIcon from '@mui/icons-material/ScheduleTwoTone';
import { GetApi } from '../../../../untils/Api';
import { MessageBox } from 'react-chat-elements';
import { HOST_BE } from '../../../../common/Common';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import { socket_IO_Client } from '../../../../routes/MainRoutes';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { set_list_message_detail_shop } from '../../../../reducers/Actions';
import { useTranslation } from 'react-i18next';

// const DividerWrapper = styled(Divider)(
//     ({ theme }) => `
//       .MuiDivider-wrapper {
//         border-radius: ${theme.general.borderRadiusSm};
//         text-transform: none;
//         background: ${theme.palette.background.default};
//         font-size: ${theme.typography.pxToRem(13)};
//         color: ${theme.colors.alpha.black[50]};
//       }
// `,
// );

// const CardWrapperPrimary = styled(Card)(
//     ({ theme }) => `
//       background: ${theme.colors.primary.main};
//       color: ${theme.palette.primary.contrastText};
//       padding: ${theme.spacing(2)};
//       border-radius: ${theme.general.borderRadiusXl};
//       border-top-right-radius: ${theme.general.borderRadius};
//       max-width: 380px;
//       display: inline-flex;
// `,
// );

// const CardWrapperSecondary = styled(Card)(
//     ({ theme }) => `
//       background: ${theme.colors.alpha.black[10]};
//       color: ${theme.colors.alpha.black[100]};
//       padding: ${theme.spacing(2)};
//       border-radius: ${theme.general.borderRadiusXl};
//       border-top-left-radius: ${theme.general.borderRadius};
//       max-width: 380px;
//       display: inline-flex;
// `,
// );
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};
interface ChatContentProps {
    oppositeCurrent: any;
}
const ChatContent: React.FC<ChatContentProps> = (props) => {
    const { oppositeCurrent } = props;
    const listMessageDetail_Shop = useSelector((state: ReducerProps) => state.listMessageDetail_Shop);
    const store = useStore();
    // const [messageDetails, setMessageDetails] = useState<any>(undefined);
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [imgCurrent, setImgCurrent] = useState<any>(undefined);
    const [isReq, setIsReq] = useState<boolean>(false);
    const openModal = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };
    const messagesEndRef = useRef<any>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [listMessageDetail_Shop]);
    const getMessageDetails = async () => {
        const res = await GetApi(`/shop/get-message-detail/${oppositeCurrent.id}`, localStorage.getItem('token'));
        if (res.data.message == 'Success') {
            if (listMessageDetail_Shop) {
                if (
                    listMessageDetail_Shop[listMessageDetail_Shop.length - 1].id ==
                    res.data.message[res.data.message.length - 1].id
                ) {
                } else {
                    store.dispatch(set_list_message_detail_shop(res.data.messageDetails));
                }
            } else {
                store.dispatch(set_list_message_detail_shop(res.data.messageDetails));
            }
        }
    };
    useEffect(() => {
        if (oppositeCurrent) {
            getMessageDetails();
        }
    }, [oppositeCurrent]);
    useEffect(() => {
        if (isReq) {
            if (oppositeCurrent) {
                getMessageDetails();
            }
            setIsReq(false);
        }
    }, [isReq]);
    useEffect(() => {
        socket_IO_Client.on('reqMessageNew', (data) => {
            setIsReq(true);
        });
    }, []);
    return (
        <Box p={3}>
            {/* <Box display="flex" alignItems="flex-start" justifyContent="flex-end" py={3}>
                <Box display="flex" alignItems="flex-end" flexDirection="column" justifyContent="flex-end" mr={2}>
                    <CardWrapperPrimary>
                        Hello, I just got my Amazon order shipped and I’m very happy about that.
                    </CardWrapperPrimary>
                    <CardWrapperPrimary
                        sx={{
                            mt: 1,
                        }}
                    >
                        Can you confirm?
                    </CardWrapperPrimary>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            pt: 1,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <ScheduleTwoToneIcon
                            sx={{
                                mr: 0.5,
                            }}
                            fontSize="small"
                        />
                        {formatDistance(subMinutes(new Date(), 8), new Date(), {
                            addSuffix: true,
                        })}
                    </Typography>
                </Box>
                <Avatar
                    variant="rounded"
                    sx={{
                        width: 50,
                        height: 50,
                    }}
                    alt={user.name}
                    src={user.avatar}
                />
            </Box> */}
            <div className="mt-3 overflow-y-scroll">
                {listMessageDetail_Shop && oppositeCurrent ? (
                    <>
                        {listMessageDetail_Shop.map((messageDetail: any) =>
                            messageDetail.type == 'photo' ? (
                                <MessageBox
                                    styles={{
                                        whiteSpace: 'pre-wrap',
                                        cursor: 'pointer',
                                    }}
                                    key={messageDetail.id}
                                    className="mt-2"
                                    id={messageDetail.id} //
                                    title={messageDetail.isUserSent ? oppositeCurrent.email : 'YOU'} //
                                    date={messageDetail.createDate} //
                                    focus={false}
                                    titleColor="black"
                                    forwarded={false}
                                    replyButton={false}
                                    removeButton={true}
                                    retracted={false}
                                    status={messageDetail.status} //
                                    notch={false}
                                    position={messageDetail.isUserSent ? 'left' : 'right'} //
                                    type={messageDetail.type}
                                    text={''}
                                    data={{
                                        uri: `${HOST_BE}/${messageDetail.content}`,
                                    }}
                                    onClick={() => {
                                        setImgCurrent(`${HOST_BE}/${messageDetail.content}`);
                                        openModal();
                                    }}
                                />
                            ) : (
                                <MessageBox
                                    width={3}
                                    styles={{
                                        whiteSpace: 'pre-wrap',
                                        minWidth: 300,
                                        borderRadius: 20,
                                    }}
                                    key={messageDetail.id}
                                    className="mt-2"
                                    id={messageDetail.id} //
                                    title={messageDetail.isUserSent ? oppositeCurrent.email : 'YOU'} //
                                    date={messageDetail.createDate} //
                                    focus={false}
                                    titleColor="black"
                                    forwarded={false}
                                    replyButton={false}
                                    removeButton={true}
                                    retracted={false}
                                    status={messageDetail.status} //
                                    notch={false}
                                    position={messageDetail.isUserSent ? 'left' : 'right'} //
                                    type={messageDetail.type}
                                    text={messageDetail.content}
                                />
                            ),
                        )}
                        <div ref={messagesEndRef} />
                    </>
                ) : !oppositeCurrent ? (
                    <div className="flex justify-center mt-12 items-center font-normal select-none">
                        <SelectAllIcon sx={{ width: 24, height: 24 }} /> <div>{t('action.SelectOneToStartMesage')}</div>
                    </div>
                ) : null}
            </div>
            <Modal open={isOpen} onClose={handleClose}>
                <Box sx={{ ...style, width: 600 }}>
                    <img src={imgCurrent} style={{ width: 550, objectFit: 'cover' }} />
                </Box>
            </Modal>
        </Box>
    );
};

export default ChatContent;
