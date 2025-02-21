import React from 'react';

interface HotProps {
    hot: any;
    setSearch: any;
    getDataSearch: any;
}
const Hot: React.FC<HotProps> = (props) => {
    const { hot, setSearch, getDataSearch } = props;
    return (
        <div
            onClick={() => {
                setSearch(hot.keyword);
                getDataSearch(hot.keyword);
            }}
            className="ml-3 mr-3 mt-6 p-2 flex items-center justify-center cursor-pointer hover:opacity-60 transition-all duration-300 text-xs lg:text-lg"
            style={{
                background: '#F1F1F1',
                borderRadius: '50px',
            }}
        >
            {hot.keyword} &nbsp;
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M4.58333 11.5047C2.05608 11.5047 0 9.44866 0 6.92141C0 5.38233 0.689792 4.41937 1.72562 3.44724L2.84763 2.39353L2.48463 3.88908C2.35858 4.40974 2.32558 6.00016 2.99429 6.85037C3.27433 7.20649 3.64421 7.37974 4.125 7.37974C4.63238 7.37974 5.03525 6.97458 5.04167 6.45712C5.04808 5.94516 4.83175 5.5212 4.60258 5.07295C4.36792 4.6137 4.125 4.13933 4.125 3.56274C4.125 2.3202 4.77217 1.19408 4.79967 1.14687L5.17917 0.495117L5.58296 1.13266C5.97208 1.74637 6.49688 2.31837 7.00517 2.87158C8.06804 4.02841 9.16712 5.22558 9.16712 6.92187C9.16712 9.44912 7.11104 11.5052 4.58379 11.5052L4.58333 11.5047Z"
                    fill="#D37171"
                ></path>
            </svg>
        </div>
    );
};
export default Hot;
