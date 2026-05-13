export const PRODUCT_CATEGORIES = [
    { value: 'mates', label: 'Mates' },
    { value: 'bombillas', label: 'Bombillas' },
    { value: 'yerba', label: 'Yerba' },
    { value: 'accesorios', label: 'Accesorios' },
];
export const ORDER_STATUS_LABELS = {
    pending: 'Pendiente',
    completed: 'Completado',
    cancelled: 'Cancelado',
};
export const ROUTES = {
    HOME: '/',
    SHOP: '/tienda',
    PRODUCT: (id) => `/producto/${id}`,
    CART: '/carrito',
    CHECKOUT: '/checkout',
    CHECKOUT_SUCCESS: '/checkout/exito',
    CHECKOUT_ERROR: '/checkout/error',
    CHECKOUT_PENDING: '/checkout/pendiente',
    LOGIN: '/login',
    REGISTER: '/registro',
    ORDERS: '/pedidos',
    ABOUT: '/acerca',
    ADMIN: '/admin',
    ADMIN_PRODUCTS: '/admin/productos',
    ADMIN_ORDERS: '/admin/pedidos',
};
export const LOCAL_STORAGE_KEYS = {
    CART: 'mateShopCart',
    SESSION: 'mate_local_session',
    USERS: 'mate_local_users',
    PRODUCTS: 'mate_admin_products',
    ORDERS: 'mate_local_orders',
    CHECKOUT_CART: 'checkoutCart',
    CHECKOUT_TOTAL: 'checkoutTotal',
};
export const ITEMS_PER_PAGE = 8;
export const SITE_NAME = 'Mates Aconcagua';
