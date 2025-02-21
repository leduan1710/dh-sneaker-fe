import React, { useEffect, useState } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { AnimatePresence, motion } from 'framer-motion';

interface NotiNewProps {
    isShow: boolean;
    setIsShow: any;
}
const NotiNew: React.FC<NotiNewProps> = (props) => {
    const { isShow, setIsShow } = props;

    useEffect(() => {
        if (isShow) {
            setTimeout(() => {
                setIsShow(false);
            }, 5000);
        }
    }, [isShow]);
    return (
        <>
            {isShow && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0 }} // Bắt đầu với độ mờ 0
                        animate={{ opacity: 1 }} // Kết thúc với độ mờ 1
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }} // Thời gian chuyển tiếp
                        className={`fixed bottom-3 right-3 z-100 hidden sm:block`}
                    >
                        <div
                            style={{ width: 350, height: 150 }}
                            className="bg-gray-200 box-shadow hover:bg-gray-300 rounded-xl transition-all duration-500 border-2 border-blue-400 text-blue-400 flex justify-center items-center"
                        >
                            {isShow ? 'Ban co thong bao moi !!' : ''}
                        </div>
                        <div
                            onClick={() => {
                                setIsShow(false);
                            }}
                            className="absolute top-2 right-2 cursor-pointer text-blue-400"
                        >
                            <HighlightOffIcon />
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
        </>
    );
};

export default NotiNew;
