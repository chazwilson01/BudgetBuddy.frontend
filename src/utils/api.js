export const API_URL = "https://localhost:5252";

export const endpoints = {
    auth: {
        login: `${API_URL}/api/Auth/login`,
        register: `${API_URL}/api/Auth/register`,
        logout: `${API_URL}/api/Auth/logout`,
    },
    plaid: {
        check: `${API_URL}/api/Plaid/check`,
        createLinkToken: `${API_URL}/api/Plaid/create-link-token`,
        exchangePublicToken: `${API_URL}/api/Plaid/exchange-public-token`,
    },
    budget: {
        create: `${API_URL}/api/Budget/create`,
        get: `${API_URL}/api/Budget/get`,
        update: `${API_URL}/api/Budget/update`,
        delete: `${API_URL}/api/Budget/delete`,
    },
    categories: {
        get: `${API_URL}/api/Categories/get`,
        create: `${API_URL}/api/Categories/create`,
        update: `${API_URL}/api/Categories/update`,
        delete: `${API_URL}/api/Categories/delete`,
    },
    transactions: {
        get: `${API_URL}/api/Transactions/get`,
        sync: `${API_URL}/api/Transactions/sync`,
        getByCategory: `${API_URL}/api/Transactions/get-by-category`,
    },
    user: {
        get: `${API_URL}/api/User/get`,
        update: `${API_URL}/api/User/update`,
        delete: `${API_URL}/api/User/delete`,
    }
}; 