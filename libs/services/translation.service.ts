import { ExecutionContext, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { I18nOptions, I18nService, I18N_OPTIONS } from 'nestjs-i18n';
import { CLS_RESOLVERS, DEFAULT_LANGUAGE_KEY, PRIORITY_LANGUAGE_GETTER } from '../constants';
import { ClsResolver } from '../interfaces';
import { LanguageKeyMap, TranslateOptions } from '../types';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class TranslationService {
    // Refactor later
    static instance: TranslationService;
    private clsResolvers: ClsResolver[] = [];
    private i18nOptions: I18nOptions;
    private defaultLanguageKey: string;
    private priorityLanguageGetter: () => string;

    constructor(
        private i18nService: I18nService<Record<string, string>>,
        private moduleRef: ModuleRef,
        private clsService: ClsService
    ) {
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

        return this.i18nService.translate(key, options);
    }

    getDefaultLanguageKey() {
        return this.defaultLanguageKey;
    }

    getCurrentLanguage() {
        const defaultLanguage = this.clsService.get(this.defaultLanguageKey);
        return typeof defaultLanguage === 'string' && defaultLanguage !== ''
            ? defaultLanguage
            : this.i18nOptions.fallbackLanguage;
    }

    getDefaultLanguage() {
        return this.i18nOptions.fallbackLanguage;
    }

    getLanguageByKey(key: string) {
        const language = this.clsService.get(key);
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
