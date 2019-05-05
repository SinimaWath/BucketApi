# BucketApi
API для IOS приложения BucketList

## Разработка
Версия NodeJS: v10.15.3

Установить пакеты:
`npm i`

У нас используется JWT, для которого нужен секретный ключ. 
Поэтому сначало нужно его сгенерировать, а потом уже поднимать.
`npm run genereate-jwt-key`

Поднять сервер + сборку со всеми возможными моками: `npm run mocks`

### Конфиг
`config/config.json`

Пока что берется только dev.

### ApiDoc

Генерация: `npm run generate-doc`

Запустить сервер. К примеру: `npm run mocks`

Открыть: `localhost:<port>/apidoc`

