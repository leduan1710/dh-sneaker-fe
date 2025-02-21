import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { MessageBox } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import { HOST_BE } from '../../../common/Common';
import { Box, Modal } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ListMessageDetailCurrentProps {
    listMessageDetailCurrent: any;
}
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
const ListMessageDetailCurrent: React.FC<ListMessageDetailCurrentProps> = (props) => {
    const { listMessageDetailCurrent } = props;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [imgCurrent, setImgCurrent] = useState<any>(undefined);
    const { t } = useTranslation();
    const openModal = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };
    const oppositeCurrent = useSelector((state: ReducerProps) => state.oppositeCurrent);
    const messagesEndRef = useRef<any>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [listMessageDetailCurrent]);
    return (
        <div className="rounded-br-xl" style={{ height: 515 }}>
            <div className={`box-shadow ${oppositeCurrent ? 'p-1' : ''}`}>
                {oppositeCurrent && oppositeCurrent.name}
            </div>
            <div className="mt-3 overflow-y-scroll" style={{ height: 400 }}>
                {listMessageDetailCurrent.length > 0 && oppositeCurrent ? (
                    <>
                        {listMessageDetailCurrent.map((messageDetail: any) =>
                            messageDetail.type == 'photo' ? (
                                <MessageBox
                                    styles={{
                                        whiteSpace: 'pre-wrap',
                                        cursor: 'pointer',
                                    }}
                                    key={messageDetail.id}
                                    className="mt-2"
                                    id={messageDetail.id} //
                                    title={messageDetail.isUserSent ? 'YOU' : oppositeCurrent.name} //
                                    date={messageDetail.createDate} //
                                    focus={false}
                                    titleColor="black"
                                    forwarded={false}
                                    replyButton={false}
                                    removeButton={true}
                                    retracted={false}
                                    status={messageDetail.status} //
                                    notch={true}
                                    position={messageDetail.isUserSent ? 'right' : 'left'} //
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
                                    styles={{
                                        whiteSpace: 'pre-wrap',
                                    }}
                                    key={messageDetail.id}
                                    className="mt-2"
                                    id={messageDetail.id} //
                                    title={messageDetail.isUserSent ? 'YOU' : oppositeCurrent.name} //
                                    date={messageDetail.createDate} //
                                    focus={false}
                                    titleColor="black"
                                    forwarded={false}
                                    replyButton={false}
                                    removeButton={true}
                                    retracted={false}
                                    status={messageDetail.status} //
                                    notch={true}
                                    position={messageDetail.isUserSent ? 'right' : 'left'} //
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
        </div>
    );
};

export default ListMessageDetailCurrent;
