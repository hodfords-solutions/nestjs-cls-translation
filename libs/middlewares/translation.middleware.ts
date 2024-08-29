import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TranslationService } from '../services/translation.service';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class TranslationMiddleware implements NestMiddleware {
    constructor(
        private translationService: TranslationService,
        private clsService: ClsService
    ) {}

    use(req: Request, res: Response, next: NextFunction) {
        const params = this.translationService.resolverLanguageFromRequest(req);
        for (const key of Object.keys(params)) {
            this.clsService.set(key, params[key]);
        }
        return next();
    }
}
