import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TranslationService } from '../services/translation.service';
import { CLS_TRANSLATION_NAMESPACE } from '../constants/cls-translation-namespace.constant';
import { runInLanguage } from '../helpers/translation.helper';

@Injectable()
export class TranslationMiddleware implements NestMiddleware {
    constructor(private translationService: TranslationService) {}

    use(req: Request, res: Response, next: NextFunction) {
        CLS_TRANSLATION_NAMESPACE.bindEmitter(req);
        CLS_TRANSLATION_NAMESPACE.bindEmitter(res);

        CLS_TRANSLATION_NAMESPACE.run(() => {
            const params = this.translationService.resolverLanguageFromRequest(req);
            runInLanguage(params, () => next()).then();
        });
    }
}
