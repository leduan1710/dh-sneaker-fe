import React, { useEffect, useState } from 'react';
import { GetApi } from '../../../../untils/Api';
import { Avatar, ListItemAvatar, ListItemText, ListItemButton, styled } from '@mui/material';
import Label from '../../../../components/admin-shop/label/Label';
import { HOST_BE } from '../../../../common/Common';
import { socket_IO_Client } from '../../../../routes/MainRoutes';

interface OppositeProps {
    opposite: any;
    setOppositeCurrent: any;
    oppositeCurrent: any;
}
const ListItemWrapper = styled(ListItemButton)(
    ({ theme }) => `
        &.MuiButtonBase-root {
            margin: ${theme.spacing(1)} 0;
        }
  `,
);
const Opposite: React.FC<OppositeProps> = (props) => {
    const { opposite, setOppositeCurrent, oppositeCurrent } = props;
    const [numberUnread, setNumberUnRead] = useState<number>(0);
    const [isReq, setIsReq] = useState<boolean>(false);
    const getUnRead = async () => {
        const res = await GetApi(`/shop/get-unread/${opposite.id}`, localStorage.getItem('token'));
        if (res.data.message == 'Success') {
            setNumberUnRead(res.data.numberUnread);
        }
    };
    useEffect(() => {
        getUnRead();
    }, []);
    useEffect(() => {
        if (isReq && opposite.id != oppositeCurrent.id) {
            getUnRead();
            setIsReq(false);
        }
    }, [isReq]);
    useEffect(() => {
        socket_IO_Client.on('reqMessageNew', (data) => {
            setIsReq(true);
        });
    }, []);
    return (
        <div
            onClick={() => {
                setNumberUnRead(0);
                setOppositeCurrent(opposite);
            }}
        >
            <ListItemWrapper selected={oppositeCurrent ? oppositeCurrent.id == opposite.id : false}>
                <ListItemAvatar>
                    <Avatar
                        src={
                            opposite.image != null
                                ? opposite.image.startsWith('uploads')
                                    ? `${HOST_BE}/${opposite.image}`
                                    : opposite.image
                                : ''
                        }
                    />
                </ListItemAvatar>
                <ListItemText
                    sx={{
                        mr: 1,
                    }}
                    primaryTypographyProps={{
                        color: 'textPrimary',
                        variant: 'h5',
                        noWrap: true,
                    }}
                    secondaryTypographyProps={{
                        color: 'textSecondary',
                        noWrap: true,
                    }}
                    primary={opposite.email}
                />
                {numberUnread > 0 ? (
                    <Label color="primary">
                        <b>{numberUnread}</b>
                    </Label>
                ) : null}
            </ListItemWrapper>
        </div>
    );
};

export default Opposite;
