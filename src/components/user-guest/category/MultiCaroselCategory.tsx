import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import CategoryItem from './CategoryItem';
interface MultiCaroselCategoryProps {
    listCategory: any;
}
const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 1024 },
        items: 10,
        slidesToSlide: 5 // optional, default to 1.

    },
    desktop: {
        breakpoint: { max: 1280, min: 1024 },
        items: 8,
        slidesToSlide: 4 // optional, default to 1.

    },
    tablet: {
        breakpoint: { max: 1024, min: 500 },
        items: 6,
        slidesToSlide: 3 // optional, default to 1.

    },
    mobile: {
        breakpoint: { max: 500, min: 0 },
        items: 4,
        slidesToSlide: 2 // optional, default to 1.

    },
};
const MultiCaroselCategory: React.FC<MultiCaroselCategoryProps> = (props) => {
    const { listCategory } = props;
    return (
        <Carousel
            swipeable={false}
            draggable={false}
            showDots={false}
            responsive={responsive}
            ssr={true}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={5000}
            keyBoardControl={true}
            customTransition="transform 1000ms ease-in-out"
            containerClass="carousel-container"
            itemClass="carousel-item-padding-40-px"
        >
            {listCategory
                .reduce((acc: any, category: any, index: number) => {
                    if (index % 2 === 0) {
                        // Tạo nhóm mới cho mỗi hai danh mục
                        acc.push([category]);
                    } else {
                        // Thêm danh mục vào nhóm cuối cùng
                        acc[acc.length - 1].push(category);
                    }
                    return acc;
                }, [])
                .map((group: any, idx: number) => (
                    <div key={idx} className="category-group">
                        {group.map((category: any) => (
                            <CategoryItem key={category.id} category={category} />
                        ))}
                    </div>
                ))}
        </Carousel>
    );
};
export default MultiCaroselCategory;
