export const incrementNumberCart = () => {
    return {
        type: 'INCREMENT',
    };
};

export const decrementNumberCart = () => {
    return {
        type: 'DECREMENT',
    };
};
export const set_to_zero = () => {
    return {
        type: 'SET_TO_ZERO',
    };
};
export const decrease_more_number_cart = (payload: number) => {
    return {
        type: 'DECREASE_NUMBER_CART',
        payload,
    };
};
export const set_number_cart = (payload: number) => {
    return {
        type: 'SET_NUMBER_CART',
        payload,
    };
};
export const set_total_item = (payload: number) => {
    return {
        type: 'SET_TOTAL_ITEM',
        payload,
    };
};
export const set_total_amount = (payload: number) => {
    return {
        type: 'SET_TOTAL_AMOUNT',
        payload,
    };
};
export const change_role = (payload: any) => {
    return {
        type: 'CHANGE_ROLE',
        payload,
    };
};

export const change_user = (payload: any) => {
    return {
        type: 'CHANGE_USER',
        payload,
    };
};

export const change_is_loading = (payload: any) => {
    return {
        type: 'CHANGE_IS_LOADING',
        payload,
    };
};
export const change_opposite_current = (payload: any) => {
    return {
        type: 'CHANGE_OPPOSITE_CURRENT',
        payload,
    };
};
export const change_list_opposite_current = (payload: any) => {
    return {
        type: 'CHANGE_LIST_OPPOSITE_CURRENT',
        payload,
    };
};
export const change_is_open_chat = (payload: any) => {
    return {
        type: 'CHANGE_IS_OPEN_CHAT',
        payload,
    };
};
export const delete_item_address = (index: any) => {
    return {
        type: 'DELETE_ITEM_ADDRESS',
        index,
    };
};

export const change_list_address = (payload: any) => {
    return {
        type: 'CHANGE_LIST_ADDRESS',
        payload,
    };
};

export const add_item_address = (payload: any) => {
    return {
        type: 'ADD_ITEM_ADDRESS',
        payload,
    };
};

export const change_item_address = (payload: any) => {
    return {
        type: 'CHANGE_ITEM_ADDRESS',
        payload,
    };
};

export const add_list_item_in_cart = (payload: any) => {
    return {
        type: 'ADD_LIST_ITEM_IN_CART',
        payload,
    };
};
export const set_list_item_in_cart = (payload: any) => {
    return {
        type: 'SET_LIST_ITEM_IN_CART',
        payload,
    };
};
export const remove_item_from_cart = (payload: any) => {
    return {
        type: 'REMOVE_ITEM_FROM_CART',
        payload,
    };
};

export const change_color_theme = (payload: any) => {
    return {
        type: 'CHANGE_COLOR_THEME',
        payload,
    };
};

export const set_number_favorite = (payload: any) => {
    return {
        type: 'SET_NUMBER_FAVOITE',
        payload,
    };
};
export const increase_number_favorite = () => {
    return {
        type: 'INCREASE_NUMBER_FAVOITE',
    };
};
export const decrease_number_favorite = () => {
    return {
        type: 'DECREASE_NUMBER_FAVOITE',
    };
};

export const set_list_product_just_view = (payload: any) => {
    return {
        type: 'SET_ITEM_PRODUCT_JUST_ViEW',
        payload,
    };
};

export const add_list_product_just_view = (payload: any) => {
    return {
        type: 'ADD_ITEM_PRODUCT_JUST_ViEW',
        payload,
    };
};

export const set_socket_id_client = (payload: any) => {
    return {
        type: 'SET_SOCKET_ID_CLIENT',
        payload,
    };
};

export const set_lng = (payload: any) => {
    return {
        type: 'SET_LNG',
        payload,
    };
};

export const set_list_message_detail_shop = (payload: any) => {
    return {
        type: 'SET_LIST_MESSAGE_DETAIL_SHOP',
        payload,
    };
};

export const set_voucher_using = (payload: any) => {
    return {
        type: 'SET_VOUCHER_USING',
        payload,
    };
};
export const set_number_cart_from_zero = (payload: any) => {
    return {
        type: 'SET_NUMBER_CART_FROM_ZERO',
        payload,
    };
};
