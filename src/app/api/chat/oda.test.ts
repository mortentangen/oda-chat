import { describe, it, expect } from '@jest/globals';
import { getCart, searchProducts } from './odaApi';

describe('oda api', () => {
    it.skip('handlekurv', async () => {
        const response = await getCart();
        console.log(JSON.stringify(response, null, 2));
        
        // Test at vi har riktig struktur
        expect(response.items).toBeDefined();
        expect(response.summary).toBeDefined();
        expect(response.fees).toBeDefined();
        
        // Test at vi har riktig vare
        expect(response.items[0].name).toBe('Korn Bakeri Steinovnsbakt Frøbrød');
        expect(response.items[0].price).toBe('52.00');
        
        // Test at totalprisen er riktig
        expect(response.summary.total).toBe('261.90');
    });

    it('search products', async () => {
        const response = await searchProducts('smør');
        console.log(JSON.stringify(response, null, 2));
        // expect(response.results.length).toBeGreaterThan(0);
        // expect(response.results[0].name).toBe('Smør');
    });
});
