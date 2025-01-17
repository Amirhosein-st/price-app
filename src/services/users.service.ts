let currentToken = '4b2d2653aa187a8dd89171333e2fa99c';
const Token_2 = '040d4fb4ee05df971c92a041cc04e07b';

const getAPIUrl = (token: string) => `https://api.sheety.co/${token}/api/users`;

export const fetchUsers = async () => {
    let response = await fetch(getAPIUrl(currentToken));

    if (response.status === 402) {
        currentToken = Token_2;
        response = await fetch(getAPIUrl(currentToken));
    }

    return response;
};

export const addNewUser = async (userData: any) => {
    let response = await fetch(getAPIUrl(currentToken), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (response.status === 402) {
        currentToken = Token_2;
        response = await fetch(getAPIUrl(currentToken), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
    }

    return response;
};

export const loginUser = async () => {
    let response = await fetch(getAPIUrl(currentToken));

    if (response.status === 402) {
        currentToken = Token_2;
        response = await fetch(getAPIUrl(currentToken));
    }

    return response;
};

export const updateUserData = async (userId: string, userData: any) => {
    let response = await fetch(`${getAPIUrl(currentToken)}/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (response.status === 402) {
        currentToken = Token_2;
        response = await fetch(`${getAPIUrl(currentToken)}/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
    }

    return response;
};

export const deleteUser = async (userId: string) => {
    let response = await fetch(`${getAPIUrl(currentToken)}/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.status === 402) {
        currentToken = Token_2;
        response = await fetch(`${getAPIUrl(currentToken)}/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};