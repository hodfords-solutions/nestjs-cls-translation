import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { IncomingMessage } from 'http';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { LanguageKeyMap, LanguageKeyType } from '../types';
import { ClsResolver } from '../interfaces';

@Injectable()
export class RequestResolver implements ClsResolver {
    constructor(private keys: LanguageKeyType[] = []) {}

    resolve(context: ExecutionContext): LanguageKeyMap {
        let req: any;
        if (context instanceof ExecutionContextHost) {
            switch (context.getType() as string) {
                case 'http':
                    req = context.switchToHttp().getRequest();
                    break;
                case 'graphql':
                    [, , { req }] = context.getArgs();
                    break;
            }
        } else if (context instanceof IncomingMessage) {
            req = context;
        }

        const params: LanguageKeyMap = {};

        if (req) {
            for (const { key, type, alias } of this.keys) {
                if (key === 'accept-language') {
                    console.warn(
                        'RequestResolver does not support RFC4647 Accept-Language header. Please use AcceptLanguageResolver instead.'
                    );
                }
                const resolvedKey = (req[type] || {})[key];
                if (resolvedKey) {
                    params[alias || key] = resolvedKey;
                }
            }
        }

        return params;
    }
}
