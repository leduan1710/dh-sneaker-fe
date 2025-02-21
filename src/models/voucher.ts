export interface VoucherModel {
    id: string;
    createDate: string;
    updateDate: string;
    code: string;
    quantity: number;
    name: string;
    reduce: number;
    condition: number;
    expired: string;
    shopId: string;
}