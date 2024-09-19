import { ExecutionContext } from '@nestjs/common';
import { LanguageKeyMap } from '../types';

export interface ClsResolver {
    resolve(context: ExecutionContext): LanguageKeyMap;
}
