import React from 'react';
import { convertToPercentage } from '../../../untils/Logic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
interface DiscountItemProps {
    discount: any;
    shopId: any;
    setDiscountCurrent: any;
}

const DiscountItem: React.FC<DiscountItemProps> = (props) => {
    const { discount, shopId, setDiscountCurrent } = props;
    return (
        <a
            href="#product-shop"
            style={{ maxHeight: 100 }}
            onClick={() => setDiscountCurrent(discount)}
            className=" text-center text-sm text-gray-500 rounded-xl hover:opacity-70 transition-all duration-500 cursor-pointer relative "
        >
            <div className="p-3 text-xs xl:text-sm border border-r-2 rounded-xl bg-gray-200">
                <div>{discount.name}</div>
                <div className="text-red-400 font-bold"> - {convertToPercentage(discount.percent)}</div>
                <div className="absolute bottom-3 right-3">
                    <FontAwesomeIcon icon={faBolt} beatFade style={{ color: '#1291f3' }} />
                </div>
            </div>
        </a>
    );
};

export default DiscountItem;
