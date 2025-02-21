import React, { useCallback, useEffect, useRef, useState } from 'react';
import QuillNoSSRWrapper, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Dialog from '@mui/material/Dialog';
import Rating from '@mui/material/Rating';
import { useTranslation } from 'react-i18next';
import { Divider } from '@mui/material';
import ReactQuill from 'react-quill';
import axios from 'axios';
import { HOST_BE } from '../../../common/Common';
import { Button } from '../../ComponentsLogin';
import SaveIcon from '@mui/icons-material/Save';
import { PostApi } from '../../../untils/Api';
import { useStore } from 'react-redux';
import { change_is_loading, change_user } from '../../../reducers/Actions';
import { toastSuccess, toastWarning } from '../../../untils/Logic';
interface OrderReviewProps {
    orderDetail: any;
    productDetail: any;
    open: any;
    setOpen: any;
    setIsReview: any;
}

const OrderReview: React.FC<OrderReviewProps> = (props) => {
    const { orderDetail, productDetail, open, setOpen, setIsReview } = props;
    const { t } = useTranslation();
    const [valueQuill, setValueQuill] = useState<any>('');
    const [valueRating, setValueRating] = React.useState<number | null>(0);
    const reactQuillRef = useRef<ReactQuill>(null);
    const store = useStore();

    const handleClose = async () => {
        setOpen(false);
    };
    const upload = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${HOST_BE}/user/review-video-tempo`, formData, {
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.data.message == 'Success') {
            return `${HOST_BE}/${response.data.path}`;
        }

        return '';
    };
    const videoHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'video/*');
        input.click();
        input.onchange = async () => {
            if (input !== null && input.files !== null) {
                const file = input.files[0];
                const url = await upload(file);
                const quill = reactQuillRef.current;
                if (quill) {
                    const range = quill.getEditorSelection();
                    range && quill.getEditor().insertEmbed(range.index, 'video', url);
                }
            }
        };
    }, []);
    const imageHandler = useCallback(async () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
            if (input !== null && input.files !== null) {
                const file = input.files[0];
                const blobUrl = URL.createObjectURL(file);
                var ImageBlot = Quill.import('formats/image');
                ImageBlot.sanitize = function (url: any) {
                    return url;
                };
                const quill = reactQuillRef.current;
                if (quill) {
                    const range = quill.getEditorSelection();
                    range && quill.getEditor().insertEmbed(range.index, 'image', blobUrl);
                }
            }
        };
    }, []);
    const modules = {
        toolbar: {
            container: [
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ size: [] }],
                [{ font: [] }],
                ['image', 'video'],
                ['clean'],
            ],
            handlers: {
                video: videoHandler,
                image: imageHandler,
            },
        },
        clipboard: {
            matchVisual: false,
        },
    };

    const formats = [
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'image',
        'video',
    ];
    const handleSave = async () => {
        if (valueQuill == '' || valueRating == 0) {
            toastWarning(t('auth.Please enter complete information'));
        } else {
            setOpen(false);
            store.dispatch(change_is_loading(true));
            const uploadImagesAndGetPaths = async (blobUrls: any) => {
                const paths = [];

                for (const blobUrl of blobUrls) {
                    console.log('here');
                    // Tạo tên tệp duy nhất
                    const uniqueFilename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    const blob = await fetch(blobUrl).then((res) => res.blob());
                    const formData = new FormData();
                    formData.append('file', blob, uniqueFilename);

                    const res = await axios.post(`${HOST_BE}/user/upload-image-review`, formData, {
                        headers: {
                            Authorization: `Bearer ${window.localStorage.getItem('token')}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    if (res.data.message == 'Success') {
                        paths.push(`${HOST_BE}/${res.data.path}`);
                    }
                }

                return paths;
            };
            const updateHtmlWithPaths = (htmlContent: any, paths: any) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, 'text/html');
                const images = doc.querySelectorAll('img');

                images.forEach((img, index) => {
                    if (paths[index]) {
                        img.src = paths[index];
                    }
                });

                return doc.body.innerHTML;
            };
            const saveHtmlWithUpdatedImages = async () => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(valueQuill, 'text/html');
                const images = doc.querySelectorAll('img');

                const blobUrls = Array.from(images).map((img) => img.src);

                const paths = await uploadImagesAndGetPaths(blobUrls);

                const updatedHtmlContent = updateHtmlWithPaths(valueQuill, paths);

                return updatedHtmlContent;
            };
            const newContent = await saveHtmlWithUpdatedImages();
            console.log(newContent);
            if (newContent) {
                const res = await PostApi('/user/create-review', localStorage.getItem('token'), {
                    productId: productDetail.productId,
                    rate: valueRating,
                    content: newContent,
                    orderDetailId: orderDetail.id,
                });
                if (res.data.message == 'Success') {
                    toastSuccess(t('auth.Success'));
                    setOpen(false);
                    setIsReview(true);
                    // store.dispatch(change_user(res.data.user));
                }
            }
            store.dispatch(change_is_loading(false));
        }
    };
    const handlePaste = async (e: ClipboardEvent) => {
        const text = e.clipboardData?.getData('text/plain');
        if (text) {
            return;
        }

        e.preventDefault();
        const items = e.clipboardData?.items;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    if (file) {
                        // const url = await upload(file, 'img');
                        const blobUrl = URL.createObjectURL(file);
                        var ImageBlot = Quill.import('formats/image');
                        ImageBlot.sanitize = function (url: any) {
                            return url; // No sanitization
                        };
                        const length = reactQuillRef.current?.getEditor().getLength();
                        length && reactQuillRef.current?.getEditor().insertEmbed(length - 1, 'image', blobUrl);
                    }
                }
            }
        }
    };
    useEffect(() => {
        const quill = reactQuillRef.current?.getEditor();
        if (quill) {
            quill.root.addEventListener('paste', handlePaste);
        }
        return () => {
            if (quill) {
                quill.root.removeEventListener('paste', handlePaste);
            }
        };
    }, [reactQuillRef.current]);
    return (
        <React.Fragment>
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                PaperProps={{
                    style: {
                        padding: '30px',
                        height: 630,
                    },
                }}
            >
                <div className="grid grid-cols-2 flex items-center">
                    <div>
                        {t('order.SendReview')}
                        <div>
                            <Rating
                                className="mt-6 mb-6"
                                name="simple-controlled"
                                value={valueRating}
                                onChange={(event, newValue) => {
                                    setValueRating(newValue);
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleSave}>
                            <SaveIcon />
                        </Button>
                    </div>
                </div>

                <div className="mb-6 pl-6 pr-6">
                    <Divider />
                </div>
                <div>
                    <QuillNoSSRWrapper
                        ref={reactQuillRef}
                        style={{ maxHeight: 400, height: 400 }}
                        theme="snow"
                        value={valueQuill}
                        onChange={setValueQuill}
                        modules={modules}
                        formats={formats}
                    />
                </div>
            </Dialog>
        </React.Fragment>
    );
};

export default OrderReview;
