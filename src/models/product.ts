export interface ProductOptions {
    size: string[];
    color: string[];
}

export interface ProductModel{
        id: string,
        name: string,
        active: boolean,
        activeByShop: boolean,
        materialId: string,
        originId: string,
        styleId: string,
        brandId: string,
        describe: string,
        createDate: Date,
        updateDate: Date,
        price: number,
        image: string,
        percentDiscountTop: number ,
        reportIdList: string[],
        userFavoriteIdList: string[],
        productCIdList: string[],
        reviewIdList: [],
        options: ProductOptions,
        categoryId: string,
        shopId: string,
}

export interface ProductDetail {
    id: string;
    name: string;
    price: number;
    option1: string;
    activeByShop: boolean,
    active: boolean,
    option2: string;
    images: string[];
    productId: string;
    quantity: number;
    discountId: string;
    numberSold: number;
}