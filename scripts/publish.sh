#! /bin/bash

npm view @hodfords/nestjs-cls-translation@"$(node -p "require('./package.json').version")" version && echo "Package is already published" && exit 0 || true
npm install
npm run build
cp README.md dist
cd dist
npm publish --access public