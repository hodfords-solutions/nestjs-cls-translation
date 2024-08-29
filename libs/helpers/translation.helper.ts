import { TranslationService } from '../services/translation.service';
import { TranslateOptions } from '../types';

export function trans(key: string, options: TranslateOptions = {}) {
    return TranslationService.instance.translate(key, options);
}

export function currentLanguage() {
    return TranslationService.instance.getCurrentLanguage();
}

export function defaultLanguage() {
    return TranslationService.instance.getDefaultLanguage();
}

export function getLanguageByKey(key: string) {
    return TranslationService.instance.getLanguageByKey(key);
}
