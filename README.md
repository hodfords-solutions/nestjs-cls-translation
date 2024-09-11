<p align="center">
  <a href="http://opensource.hodfords.uk" target="blank"><img src="https://opensource.hodfords.uk/img/logo.svg" width="320" alt="Hodfords Logo" /></a>
</p>

<p align="center"> <b>nestjs-cls-translation</b> provides context-aware translations in NestJS applications using <b>Context-Local Storage</b> (CLS), making it easier to manage and access locale-specific data across different parts of your application.</p>

## Installation 🤖

Install the `nestjs-cls-translation` package with:

```bash
npm install @hodfords/nestjs-cls-translation --save
```

You'll need to configure the translation module by adding it to your NestJS app's module setup. Here’s how you can configure it:

```typescript
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

## Usage 🚀

#### Translation Functions

To translate a specific key, use the trans function, passing the key for the translation string you wish to fetch:

```typescript
const translatedText = trans('error.an_error_occurred')
```

This will return the translated string based on the user's current language, or the fallback language if no specific translation exists for the user's language.

#### Get Current Language

To retrieve the language currently being used in the context of a request, use the `currentLanguage()` function:

```typescript
const currentLang = currentLanguage()
```

#### Get Default Language

If you need to access the application's default or fallback language (set in the module configuration), use the `defaultLanguage()` function:

```typescript
const defaultLang = defaultLanguage()
```

#### Run with a Specific Language Context

You may want to execute certain parts of your code in a specific language context. The runInLanguage() function allows you to run a block of code under a designated language context, overriding the current language:

```typescript
await runInLanguage('en', () => {...});
```

## License 📝

This project is licensed under the MIT License
