# andrey maier — цифровые продукты для бизнеса

статический сайт разработчика и наставника: https://dev.mrmaier.com

html, css и javascript без сборки, серверной части и базы данных.

## структура

- `public/index.html` — страницы и содержимое разделов.
- `public/styles.css` — оформление, адаптивная компоновка и анимации.
- `public/script.js` — раскрытие услуг, меню, эффекты прокрутки и контакты.
- `public/config.js` — публичные контакты владельца.
- `public/assets/` — портрет, favicon и изображение для публикации ссылки.
- `public/_headers` — заголовки для cloudflare pages.
- `public/404.html` — страница для несуществующих адресов.
- `public/robots.txt`, `public/sitemap.xml` — индексация.

## публикация

cloudflare pages, проект `andrey-maier-digital`, git integration с этим репозиторием. каждый push в `main` публикуется автоматически.

| параметр | значение |
|---|---|
| production branch | `main` |
| build command | `exit 0` |
| build output directory | `public` |
| custom domain | `dev.mrmaier.com` |

## проверка кода

```sh
node --check public/script.js
node --check public/config.js
```

при изменении содержимого обновите `lastmod` в `public/sitemap.xml`.
