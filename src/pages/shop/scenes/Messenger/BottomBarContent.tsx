import { Avatar, Tooltip, IconButton, Box, Button, styled, InputBase, useTheme } from '@mui/material';
import AttachFileTwoToneIcon from '@mui/icons-material/AttachFileTwoTone';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import React, { useState } from 'react';
import { filterSpecialInput, toastWarning } from '../../../../untils/Logic';
import { PostApi } from '../../../../untils/Api';
import { useSelector, useStore } from 'react-redux';
import { change_is_loading, set_list_message_detail_shop } from '../../../../reducers/Actions';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import axios from 'axios';
import { HOST_BE } from '../../../../common/Common';
import { useTranslation } from 'react-i18next';

const MessageInputWrapper = styled(InputBase)(
    ({ theme }) => `
    font-size: ${theme.typography.pxToRem(18)};
    padding: ${theme.spacing(1)};
    width: 100%;
`,
);

const Input = styled('input')({
    display: 'none',
});
interface BottomBarContentProps {
    oppositeCurrent: any;
}
const BottomBarContent: React.FC<BottomBarContentProps> = (props) => {
    const { oppositeCurrent } = props;
    const theme = useTheme();
    const {t} = useTranslation();
    const [value, setValue] = useState<string>('');
    const listMessageDetail_Shop = useSelector((state: ReducerProps) => state.listMessageDetail_Shop);
    const store = useStore();
    const handleSend = async () => {
        if (value != '') {
            const res = await PostApi('/shop/add-message', localStorage.getItem('token'), {
                content: value,
                type: 'text',
                userId: oppositeCurrent.id,
            });
            if (res.data.message == 'Success') {
                const listCurrent = listMessageDetail_Shop;
                store.dispatch(set_list_message_detail_shop([...listCurrent, res.data.addMes.messageDetail]));
            }
            setValue('');
        }
    };
    const handleSendImage = async (file: any) => {
        change_is_loading(true);
        //

        const uniqueFilename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const formData = new FormData();
        if (file) {
            const imageBlob = await fetch(URL.createObjectURL(file)).then((response) => response.blob());
            formData.append('file', imageBlob, uniqueFilename);
        }
        const resUpload = await axios.post(`${HOST_BE}/shop/upload-image-chat`, formData, {
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        if (resUpload.data.message == 'Success') {
            const res = await PostApi('/shop/add-message', localStorage.getItem('token'), {
                content: resUpload.data.path,
                type: 'photo',
                userId: oppositeCurrent.id,
            });
            if (res.data.message == 'Success') {
                const listCurrent = listMessageDetail_Shop;
                store.dispatch(set_list_message_detail_shop([...listCurrent, res.data.addMes.messageDetail]));
            }
        }
        //
        change_is_loading(false);
    };
    return (
        <Box
            sx={{
                background: theme.colors.alpha.white[50],
                display: 'flex',
                alignItems: 'center',
                p: 2,
            }}
        >
            {oppositeCurrent ? (
                <>
                    <Box flexGrow={1} display="flex" alignItems="center">
                        <MessageInputWrapper
                            onKeyPress={(e: any) => {
                                if (e.shiftKey) {
                                    return;
                                }
                                if (e.key == 'Enter') {
                                    handleSend();
                                }
                            }}
                            value={value}
                            onChange={(e) => filterSpecialInput(e.target.value, setValue)}
                            autoFocus
                            placeholder="Write your message here..."
                            fullWidth
                        />
                    </Box>
                    <Box>
                        <Input
                            accept="image/*"
                            id="messenger-upload-file"
                            type="file"
                            onChange={(e: any) => {
                                const file = e.target.files[0];
                                if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
                                    handleSendImage(file);
                                } else {
                                    toastWarning('Incorrect file type');
                                }
                            }}
                        />
                        <Tooltip arrow placement="top" title="Attach a file">
                            <label htmlFor="messenger-upload-file">
                                <IconButton sx={{ mx: 1 }} color="primary" component="span">
                                    <AttachFileTwoToneIcon fontSize="small" />
                                </IconButton>
                            </label>
                        </Tooltip>
                        <Button onClick={handleSend} startIcon={<SendTwoToneIcon />} variant="contained">
                            {t('action.Send')}
                        </Button>
                    </Box>
                </>
            ) : null}
        </Box>
    );
};

export default BottomBarContent;
