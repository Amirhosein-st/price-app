const API_URL_alanchand = 'https://admin.alanchand.com/api/home';

export const GetPriceData = async () => {
    const response = await fetch(API_URL_alanchand, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "lang": "fa" }),
    });

    return response
};