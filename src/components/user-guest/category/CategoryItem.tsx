import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HOST_BE } from '../../../common/Common';
interface CategoryItemProps {
    category: any;
}
const CategoryItem: React.FC<CategoryItemProps> = (props) => {
    const { category } = props;
    const nav = useNavigate();
    return (
        <div
            onClick={() => nav(`/category-view/${category.id}`)}
            style={{
                height: 140,
            }}
            className="border border-gray-200 m-1 select-none hover:bg-gray-300 rounded p-1 transition-all duration-500 cursor-pointer"
        >
            <div className="flex justify-center">
                <img
                    className="rounded"
                    style={{
                        objectFit: 'cover',
                        width: '90%',
                        height: 80,
                    }}
                    src={category.image.startsWith('uploads') ? `${HOST_BE}/${category.image}` : category.image}
                />
            </div>
            <div className="text-center font-thin">{category.name}</div>
        </div>
    );
};
export default CategoryItem;
