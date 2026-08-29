import { ExecutionContext } from '@nestjs/common';
import { ClsResolver } from '../interfaces/index.js';
import { I18nResolver } from 'nestjs-i18n';

export class CustomI18nResolver implements I18nResolver {
    constructor(private clsResolver: ClsResolver) {}

    resolve(context: ExecutionContext): string | string[] | undefined {
        const params = this.clsResolver.resolve(context);
        const values = Object.values(params);

        return values.length ? values[0] : undefined;
    }
}
