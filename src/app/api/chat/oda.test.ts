import { describe, it, expect } from '@jest/globals';
import { getCart } from './odaApi';

describe('oda api', () => {
    it('handlekurv', async () => {
        const response = await getCart();
        expect(response.display_price).toBe('52.00');
    });
});