import { ExecutionContext } from '@nestjs/common';
import { LanguageKeyMap } from '../types/index.js';

export interface ClsResolver {
    resolve(context: ExecutionContext): LanguageKeyMap;
}
