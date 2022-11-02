import { ExecutionContext, Injectable } from '@nestjs/common';
import { I18N_OPTIONS, I18nOptions, I18nService } from 'nestjs-i18n';
import { ModuleRef } from '@nestjs/core';
import { CLS_RESOLVERS, CLS_TRANSLATION_NAMESPACE, DEFAULT_LANGUAGE_KEY, PRIORITY_LANGUAGE_GETTER } from '../constants';
import { LanguageKeyMap, TranslateOptions } from '../types';
import { ClsResolver } from '../interfaces';

@Injectable()
export class TranslationService {
    // Refactor later
    static instance: TranslationService;
    private clsResolvers: ClsResolver[] = [];
    private i18nOptions: I18nOptions;
    private defaultLanguageKey: string;
    private priorityLanguageGetter: () => string;

    constructor(private i18nService: I18nService, private moduleRef: ModuleRef) {
        TranslationService.instance = this;
        this.clsResolvers = this.moduleRef.get(CLS_RESOLVERS, { strict: false });
        this.i18nOptions = this.moduleRef.get(I18N_OPTIONS, { strict: false });
        this.defaultLanguageKey = this.moduleRef.get(DEFAULT_LANGUAGE_KEY, { strict: false });
        this.priorityLanguageGetter = this.moduleRef.get(PRIORITY_LANGUAGE_GETTER, { strict: false });
    }

    translate(key: string, options?: TranslateOptions) {
        if (!options) {
            options = {};
        }

        if (options.usePriorityLanguage && this.priorityLanguageGetter) {
            options.lang = this.priorityLanguageGetter();
        }

        if (!options.lang) {
            options.lang = this.getCurrentLanguage();
        }

        return this.i18nService.translate<string>(key, options);
    }

    getDefaultLanguageKey() {
        return this.defaultLanguageKey;
    }

    getCurrentLanguage() {
        const defaultLanguage = CLS_TRANSLATION_NAMESPACE.get(this.defaultLanguageKey);
        return typeof defaultLanguage === 'string' && defaultLanguage !== ''
            ? defaultLanguage
            : this.i18nOptions.fallbackLanguage;
    }

    getDefaultLanguage() {
        return this.i18nOptions.fallbackLanguage;
    }

    getLanguageByKey(key: string) {
        const language = CLS_TRANSLATION_NAMESPACE.get(key);
        return typeof language === 'string' && language !== '' ? language : undefined;
    }

    resolverLanguageFromRequest(request: any): LanguageKeyMap {
        let allParams: LanguageKeyMap = {};

        for (const resolver of this.clsResolvers) {
            let params = resolver.resolve(request as ExecutionContext);
            allParams = { ...allParams, ...params };
        }

        return allParams;
    }
}
