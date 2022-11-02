import { ClsResolver } from '../interfaces';
import { I18nOptions, TranslateOptions as I18nTranslateOptions } from 'nestjs-i18n';

export type TranslationOptions = I18nOptions & {
    defaultLanguageKey?: string;
    clsResolvers: ClsResolver[];
    priorityLanguageGetter?: () => string | null | undefined;
};

export type TranslateOptions = I18nTranslateOptions & {
    usePriorityLanguage?: boolean;
};
