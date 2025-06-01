const initialState = {
    numberCart: 0,
    role: '',
    user: {},
    listAddress: [],
    isLoading: false,
    listItemInCart: [],
    colorTheme: 'dark',
    numberFavorite: 0,
    totalItem: 0,
    totalAmount: 0,
    listProductJustView: [],
    socketIdClient: '',
    lng: sessionStorage.getItem('lng') == 'en' ? 'en' : 'vn',
    isOpenChat: false,
    oppositeCurrent: undefined,
    listOppositeCurrent: [],
    listMessageDetail_Shop: undefined,
    voucherUsing: [],
};
const myReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'SET_LNG':
            return {
                ...state,
                lng: action.payload,
            };
        case 'INCREMENT':
            return {
                ...state,
                numberCart: state.numberCart + 1,
            };
        case 'DECREMENT':
            return {
                ...state,
                numberCart: state.numberCart - 1,
            };
        case 'SET_TO_ZERO':
            return {
                ...state,
                numberCart: 0,
            };
        case 'SET_NUMBER_CART':
            return {
                ...state,
                numberCart: state.numberCart + action.payload,
            };
        case 'SET_TOTAL_ITEM':
            return {
                ...state,
                totalItem: action.payload,
            };
        case 'SET_TOTAL_AMOUNT':
            return {
                ...state,
                totalAmount: action.payload,
            };
        case 'SET_NUMBER_CART_FROM_ZERO':
            return {
                ...state,
                numberCart: action.payload,
            };
        case 'SET_NUMBER_FAVOITE':
            return {
                ...state,
                numberFavorite: action.payload,
            };
        case 'INCREASE_NUMBER_FAVOITE':
            return {
                ...state,
                numberFavorite: (state.numberFavorite += 1),
            };
        case 'DECREASE_NUMBER_FAVOITE':
            return {
                ...state,
                numberFavorite: (state.numberFavorite -= 1),
            };
        case 'DECREASE_NUMBER_CART':
            return {
                ...state,
                numberCart: state.numberCart - action.payload,
            };
        case 'CHANGE_ROLE':
            return {
                ...state,
                role: action.payload,
            };
        case 'CHANGE_USER':
            return {
                ...state,
                user: action.payload,
            };
        case 'CHANGE_IS_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        case 'CHANGE_OPPOSITE_CURRENT':
            return {
                ...state,
                oppositeCurrent: action.payload,
            };
        case 'CHANGE_LIST_OPPOSITE_CURRENT':
            return {
                ...state,
                listOppositeCurrent: action.payload,
            };
        case 'CHANGE_IS_OPEN_CHAT':
            return {
                ...state,
                isOpenChat: action.payload,
            };
        case 'DELETE_ITEM_ADDRESS':
            return {
                ...state,
                listAddress: state.listAddress.filter((item: any, index: any) => index !== action.index),
            };
        case 'CHANGE_LIST_ADDRESS':
            return {
                ...state,
                listAddress: action.payload,
            };
        case 'ADD_ITEM_ADDRESS':
            return {
                ...state,
                listAddress: [...state.listAddress, action.payload],
            };
        case 'CHANGE_ITEM_ADDRESS':
            return {
                ...state,
                listAddress: state.listAddress.map((address, i) =>
                    i === action.payload.index ? action.payload.address : address,
                ),
            };
        case 'ADD_LIST_ITEM_IN_CART':
            const productIndex = state.listItemInCart.findIndex(
                (productDetail: any) => action.payload.id == productDetail.id,
            );
            if (productIndex == -1) {
                return {
                    ...state,
                    listItemInCart: [...state.listItemInCart, action.payload],
                };
            } else {
                return {
                    ...state,
                };
            }
        case 'SET_LIST_ITEM_IN_CART':
            return {
                ...state,
                listItemInCart: action.payload,
            };
        case 'REMOVE_ITEM_FROM_CART':
            const newList = state.listItemInCart.filter((productDetail: any) => productDetail.id !== action.payload);
            return {
                ...state,
                listItemInCart: newList,
            };
        case 'SET_ITEM_PRODUCT_JUST_ViEW':
            return {
                ...state,
                listProductJustView: action.payload,
            };
        case 'ADD_ITEM_PRODUCT_JUST_ViEW':
            return {
                ...state,
                listProductJustView: [...state.listProductJustView, action.payload],
            };
        case 'SET_SOCKET_ID_CLIENT':
            return {
                ...state,
                socketIdClient: action.payload,
            };
        case 'SET_LIST_MESSAGE_DETAIL_SHOP':
            return {
                ...state,
                listMessageDetail_Shop: action.payload,
            };
        case 'SET_VOUCHER_USING':
            return {
                ...state,
                voucherUsing: action.payload,
            };
        default:
            return state;
    }
};
export default myReducer;
export { initialState };
