import { DynamicModule, Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { I18nModule } from 'nestjs-i18n';
import { CLS_RESOLVERS, DEFAULT_LANGUAGE_KEY, LANGUAGE_KEY, PRIORITY_LANGUAGE_GETTER } from './constants';
import { TranslationMiddleware } from './middlewares/translation.middleware';
import { CustomI18nResolver } from './resolves';
import { TranslationService } from './services/translation.service';
import { TranslationOptions } from './types';

@Global()
@Module({})
export class TranslationModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(TranslationMiddleware).forRoutes('*');
    }

    static forRoot(config: TranslationOptions): DynamicModule {
        return {
            module: TranslationModule,
            imports: [
                I18nModule.forRoot({
                    ...config,
                    resolvers: config.resolvers || config.clsResolvers.map((item) => new CustomI18nResolver(item))
                })
            ],
            providers: [
                TranslationService,
                {
                    provide: CLS_RESOLVERS,
                    useValue: config.clsResolvers
                },
                {
                    provide: DEFAULT_LANGUAGE_KEY,
                    useValue: config.defaultLanguageKey || LANGUAGE_KEY
                },
                {
                    provide: PRIORITY_LANGUAGE_GETTER,
                    useValue: config.priorityLanguageGetter || null
                }
            ],
            exports: [TranslationService]
        };
    }
}
