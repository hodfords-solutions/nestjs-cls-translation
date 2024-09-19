import cls from '@hodfords/cls-hooked';
import {
    CLS_TRANSLATION_NAMESPACE,
    CLS_TRANSLATION_NAMESPACE_NAME
} from '../constants/cls-translation-namespace.constant';
import { IS_FULL_LANGUAGE } from '../constants/language-key.constant';
import { TranslationService } from '../services/translation.service';
import { RunInLanguageParams, TranslateOptions } from '../types';

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

export function getLanguageByKey(key: string): string {
    return TranslationService.instance.getLanguageByKey(key);
}

export function destroyTranslationNamespace(): void {
    return cls.destroyNamespace(CLS_TRANSLATION_NAMESPACE_NAME);
}

export function runInLanguage<T>(
    params: RunInLanguageParams,
    callback: (...args: (string | object)[]) => T
): Promise<T> {
    return CLS_TRANSLATION_NAMESPACE.runAndReturn(async () => {
        if (typeof params === 'string') {
            CLS_TRANSLATION_NAMESPACE.set(TranslationService.instance.getDefaultLanguageKey(), params);
        } else if (params && typeof params === 'object') {
            for (const [key, language] of Object.entries(params)) {
                CLS_TRANSLATION_NAMESPACE.set(key, language);
            }
        }

        return callback();
    });
}

export function runInFullLanguages<T>(callback: (...args: (string | object)[]) => T): Promise<T> {
    return CLS_TRANSLATION_NAMESPACE.runAndReturn(async () => {
        CLS_TRANSLATION_NAMESPACE.set(IS_FULL_LANGUAGE, true);

        return callback();
    });
}
