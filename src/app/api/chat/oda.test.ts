import { describe, it, expect } from '@jest/globals';
import { getCart, searchProducts, addToCart } from './odaApi';

describe('Oda API', () => {
    it('should fetch cart contents', async () => {
        const response = await getCart();
        expect(response.items).toBeDefined();
        expect(response.summary).toBeDefined();
        expect(response.fees).toBeDefined();
    });

    it('should search for products', async () => {
        const response = await searchProducts('smør');
        
        expect(response).toBeDefined();
        expect(response.query).toBe('smør');
        expect(response.products).toBeDefined();
        expect(Array.isArray(response.products)).toBe(true);
    });

    it.skip('should add product to cart', async () => {
        const response = await addToCart(127);
        
        expect(response).toBeDefined();
    });
});
