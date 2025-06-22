export const getCart = async () => {
    const cookie = process.env.ODA_COOKIE as string;
    const res = await fetch('https://oda.com/tienda-web-api/v1/cart/', {
        method: 'GET',
        headers: new Headers({
            'Cookie': cookie,
            'Accept': 'application/json'
        })
    });
    return res.json();
};