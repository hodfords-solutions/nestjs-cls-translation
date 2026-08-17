import 'reflect-metadata';
import { afterEach, describe, expect, it } from 'vitest';
import { runInLanguage } from '../lib/helpers/translation.helper';
import { CLS_TRANSLATION_NAMESPACE } from '../lib/constants';

describe('runInLanguage prototype-pollution guard', () => {
    afterEach(() => {
        // Undo any pollution a failing run may have leaked, so cases stay independent.
        delete (Object.prototype as Record<string, unknown>).polluted;
    });

    it('does not pollute Object.prototype via a __proto__ path key', async () => {
        await runInLanguage({ '__proto__.polluted': 'yes' }, () => undefined);
        expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    });

    it('does not pollute Object.prototype via a constructor.prototype path key', async () => {
        await runInLanguage({ 'constructor.prototype.polluted': 'yes' }, () => undefined);
        expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    });

    it('still stores a normal language key in the CLS context', async () => {
        let stored: unknown;
        await runInLanguage({ lang: 'vi' }, () => {
            stored = CLS_TRANSLATION_NAMESPACE.get('lang');
        });
        expect(stored).toBe('vi');
    });

    it('does not over-block a key that merely contains a dangerous word', async () => {
        let stored: unknown;
        await runInLanguage({ constructorId: 'en' }, () => {
            stored = CLS_TRANSLATION_NAMESPACE.get('constructorId');
        });
        expect(stored).toBe('en');
    });
});
