We are using package https://www.npmjs.com/package/nestjs-i18n. So check out the info here.

# Module
```
TranslationModule.forRoot({
    fallbackLanguage: 'en',
    parser: I18nJsonParser,
    parserOptions: {
        path: path.join(env.ROOT_PATH, 'i18n/'),
        watch: true
    },
    resolvers: [new HeaderResolver(['language'])]
});

```

# Translate
```
await trans('error.an_error_occurred')
```

# Get current language
```
currentLanguage()
```

# Get default language
```
defaultLanguage()
```

# Run with a language
```
await runInLanguage('en', () => ...);
```
