interface City {
    province_id: string;
    province_name: string;
}

interface District {
    district_id: string;
    district_name: string;
}

interface Ward {
    ward_id: string;
    ward_name: string;
}

interface Address {
    id: string;
    name: string;
    phone: string;
    city: City;
    district: District;
    ward: Ward;
    apartment: string;
    userId: string;
    status: string;
}


export interface OrderModel {
    id: string;
    paid: boolean;
    address: Address;
    orderDetailIdList: string[];
    priceShip: number;
    priceVoucher: number;
    priceMember: number;
    shipId: string;
    userId: string;
    shopId: string;
    status: string;
}
export interface OrderDetail {
    id: string;
    quantity: number;
    price: number;
    discountPrice: number;
    discountId: string;
    orderId: string;
    productDetailId: string;
    reviewId: string | null;
}