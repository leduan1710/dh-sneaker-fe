import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { useTranslation } from 'react-i18next';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
interface DrawMoreProps {
    setCategoryIdCurrent: any;
    listCategoryChild: any;
    handleReq: any;
    categoryPId: any;
    setPageCurrent: any;
}
const ListCategoryChild: React.FC<any> = (props) => {
    const { category, handleClickRadio, categoryCurrentId, currentId } = props;

    return (
        <>
            {category.children.map((categoryC: any) => (
                <div key={categoryC.id} className="ml-8">
                    <FormControlLabel
                        className="pl-6 pr-6"
                        value={categoryC.id}
                        control={<Radio />}
                        label={categoryC.name}
                        checked={categoryC.id == currentId}
                        onClick={(e: any) => handleClickRadio(e)}
                    />
                </div>
            ))}
        </>
    );
};
const CategoryParent: React.FC<any> = (props) => {
    const { categoryP, handleClickRadio, currentId } = props;
    const [isOpenChild, setIsOpenChild] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const childRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (isOpenChild) {
            setShow(true);
        } else {
            const timer = setTimeout(() => setShow(false), 500); // Thời gian phải khớp với transition
            return () => clearTimeout(timer);
        }
    }, [isOpenChild]);
    return (
        <>
            <div key={categoryP.parent.id} className="relative">
                <FormControlLabel
                    className="pl-6 pr-6"
                    value={categoryP.parent.id}
                    control={<Radio />}
                    label={categoryP.parent.name}
                    checked={categoryP.parent.id == currentId}
                    onClick={(e: any) => handleClickRadio(e)}
                />
                <div ref={childRef} className={`fade-in ${show ? 'show' : ''}`}>
                    {isOpenChild && (
                        <ListCategoryChild
                            category={categoryP}
                            handleClickRadio={handleClickRadio}
                            currentId={currentId}
                        />
                    )}
                </div>
                <div className="absolute top-0 right-4">
                    {isOpenChild ? (
                        <ExpandLessIcon className="cursor-pointer" onClick={() => setIsOpenChild(false)} />
                    ) : (
                        <ExpandMoreIcon className="cursor-pointer" onClick={() => setIsOpenChild(true)} />
                    )}
                </div>
            </div>
        </>
    );
};
const DrawMore: React.FC<DrawMoreProps> = (props) => {
    const { setCategoryIdCurrent, listCategoryChild, handleReq, categoryPId, setPageCurrent } = props;
    const { t } = useTranslation();
    const [state, setState] = useState<boolean>(false);
    const [valueRadio, setValueRadio] = useState<any>('');
    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        console.log('here');
        setState(open);
    };
    const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCategoryIdCurrent((event.target as HTMLInputElement).value);
        setValueRadio((event.target as HTMLInputElement).value);
        handleReq();
        setPageCurrent(1);
        // setState(false);
    };
    const handleClickRadio = (e: any) => {
        if (valueRadio == e.target.value) {
            setCategoryIdCurrent(categoryPId);
            handleReq();
            setValueRadio('');
            setPageCurrent(1);
        }
    };
    const list = () => (
        <Box sx={{ width: '100%' }} role="presentation">
            {/* <div className="mt-3 ml-3 mb-3 flex justify-start items-center ">
                <KeyboardBackspaceIcon className="cursor-pointer" onClick={toggleDrawer(false)} />
                <span className="cursor-pointer pl-3" onClick={toggleDrawer(false)}>
                    {t('homepage.Exit')}
                </span>
            </div> */}
            <RadioGroup onChange={handleChangeRadio} value={valueRadio}>
                {listCategoryChild.map((categoryP: any) => (
                    <CategoryParent categoryP={categoryP} handleClickRadio={handleClickRadio} currentId={categoryPId} />
                ))}
            </RadioGroup>
        </Box>
    );

    return (
        <div>
            {/* <div
                style={{ width: 50, height: 50, top: -22 }}
                className="absolute flex justify-center items-center right-0 top-0 hover:opacity-70 cursor-pointer p-3 rounded-full border border-blue-500 transition-all duration-500"
                onClick={toggleDrawer(true)}
            >
                <PlaylistAddIcon sx={{ width: 24, height: 24 }} />
            </div> */}
            {/* <Drawer anchor={'right'} open={state} onClose={toggleDrawer(false)}> */}
            <div> {list()} </div>
            {/* </Drawer> */}
        </div>
    );
};

export default DrawMore;
