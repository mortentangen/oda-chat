export const getCart = async () => {
    const cookie = process.env.ODA_COOKIE as string;
    const res = await fetch('https://oda.com/tienda-web-api/v1/cart/', {
        method: 'GET',
        headers: new Headers({
            'Cookie': cookie,
            'Accept': 'application/json'
        })
    });
    const fullResponse = await res.json();

    const simplifiedCart = {
        items: fullResponse.groups?.[0]?.items?.map((item: any) => ({
            name: item.product.full_name,
            quantity: item.quantity,
            price: item.display_price_total,
            unit_price: item.product.gross_unit_price,
            unit: item.product.unit_price_quantity_name
        })) || [],
        summary: {
            total_items: fullResponse.product_quantity_count,
            subtotal: fullResponse.display_price,
            total: fullResponse.total_gross_amount,
            currency: fullResponse.currency
        },
        fees: fullResponse.extra_lines?.map((line: any) => ({
            description: line.description,
            amount: line.gross_amount,
            long_description: line.long_description
        })) || [],
        progress: fullResponse.progress_bar ? {
            description: fullResponse.progress_bar.description,
            current_amount: fullResponse.display_price,
            next_threshold: fullResponse.progress_bar.conditions?.description
        } : null
    };

    return simplifiedCart;
};

export const searchProducts = async (query: string) => {
    const cookie = process.env.ODA_COOKIE as string;
    const res = await fetch(`https://oda.com/tienda-web-api/v1/search/mixed/?q=${query}&type=product`, {
        method: 'GET',
        headers: new Headers({
            'Cookie': cookie,
            'Accept': 'application/json'
        })
    });
    const fullResponse = await res.json();

    const simplifiedResults = {
        query: query,
        total_results: fullResponse.items?.length || 0,
        products: fullResponse.items?.map((item: any) => {
            const product = item.attributes;
            return {
                id: product.id,
                name: product.full_name,
                brand: product.brand,
                size: product.name_extra,
                price: product.gross_price,
                unit_price: product.gross_unit_price,
                unit: product.unit_price_quantity_name,
                currency: product.currency,
                availability: {
                    is_available: product.availability?.is_available,
                    description: product.availability?.description
                },
                url: product.front_url,
                badges: product.client_classifiers?.map((badge: any) => ({
                    name: badge.name,
                    is_important: badge.is_important
                })).filter((badge: any) => badge.is_important) || []
            };
        }) || []
    };

    return simplifiedResults;
}

export const addToCart = async (productId: number, quantity: number = 1) => {
    const cookie = process.env.ODA_COOKIE as string;
    const res = await fetch(`https://oda.com/tienda-web-api/v1/cart/items/`, {
        method: 'POST',
        body: JSON.stringify({
            items: [
                { productId, quantity }
            ]
        }),
        headers: new Headers({
            'Cookie': cookie,
            'Accept': 'application/json'
        })
    });
    const fullResponse = await res.json();
    return fullResponse;
}