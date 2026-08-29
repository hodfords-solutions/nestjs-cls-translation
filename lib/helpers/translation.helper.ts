import { CLS_TRANSLATION_NAMESPACE } from '../constants/cls-translation-namespace.constant.js';
import { IS_FULL_LANGUAGE } from '../constants/language-key.constant.js';
import { TranslationService } from '../services/translation.service.js';
import { RunInLanguageParams, TranslateOptions } from '../types/index.js';

// Path segments that would let a key walk into the prototype chain via nestjs-cls' setValueFromPath.
const dangerousLanguageKeys = new Set(['__proto__', 'constructor', 'prototype']);

export function trans(key: string, options: TranslateOptions = {}): string {
    return TranslationService.instance.translate(key, options);
}

export function currentLanguage(): string {
    return TranslationService.instance.getCurrentLanguage();
}

export function isFullLanguages(): boolean {
    return !!CLS_TRANSLATION_NAMESPACE.get(IS_FULL_LANGUAGE);
}

export function defaultLanguage(): string {
    return TranslationService.instance.getDefaultLanguage();
}

export function getLanguageByKey(key: string): string | undefined {
    return TranslationService.instance.getLanguageByKey(key);
}

export function destroyTranslationNamespace(): void {
    console.warn('This method is no longer supported with nestjs-cls');
}

export function runInLanguage<T>(
    params: RunInLanguageParams,
    callback: (...args: (string | object)[]) => T
): Promise<T> {
    return CLS_TRANSLATION_NAMESPACE.run(async () => {
        if (typeof params === 'string') {
            CLS_TRANSLATION_NAMESPACE.set(TranslationService.instance.getDefaultLanguageKey(), params);
        } else if (params && typeof params === 'object') {
            for (const [key, language] of Object.entries(params)) {
                if (key.split('.').some((segment) => dangerousLanguageKeys.has(segment))) {
                    console.warn('runInLanguage ignored an unsafe language key to prevent prototype pollution:', key);
                    continue;
                }
                CLS_TRANSLATION_NAMESPACE.set(key, language);
            }
        }

        return callback();
    });
}

export function runInFullLanguages<T>(callback: (...args: (string | object)[]) => T): Promise<T> {
    return CLS_TRANSLATION_NAMESPACE.run(async () => {
        CLS_TRANSLATION_NAMESPACE.set(IS_FULL_LANGUAGE, true);

        return callback();
    });
}
