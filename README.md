# andrey maier — цифровые продукты для бизнеса

статический сайт разработчика и наставника. html, css и javascript без сборки, серверной части и базы данных.

актуальная версия перенесена из openai sites 12 ноября 2026 года. исходная версия в sites: `e431f68a99db5ab7dfa9aa9578e12bdecd3d9f48`.

## структура

- `public/index.html` — страницы и содержимое разделов.
- `public/styles.css` — оформление, адаптивная компоновка и анимации.
- `public/script.js` — раскрытие услуг, меню, эффекты прокрутки и контакты.
- `public/config.js` — публичные контакты владельца.
- `public/assets/` — портрет, favicon и изображение для публикации ссылки.
- `public/_headers` — заголовки для cloudflare pages.
- `public/robots.txt` — разрешение индексации.
- [CLOUDFLARE_HANDOFF.md](CLOUDFLARE_HANDOFF.md) — инструкция по публикации и передаче другому агенту.

## cloudflare pages

| параметр | значение |
|---|---|
| repository | `Dronnn/andrey-maier-digital` |
| production branch | `main` |
| framework preset | `None` |
| root directory | корень репозитория, поле можно оставить пустым |
| build command | `exit 0` |
| build output directory | `public` |
| environment variables | не требуются |

используйте подключение github, чтобы изменения в `main` автоматически публиковались в cloudflare pages.

## проверка кода

```sh
node --check public/script.js
node --check public/config.js
```

сайт использует внешние шрифты google fonts. остальные ресурсы находятся в репозитории. контакты работают через обычные ссылки `mailto:`, `tel:` и ссылки на профили; сервер для них не требуется.

## примечания к публичной версии

в экспортной версии снят запрет индексации из html, `_headers` и `robots.txt`. устаревший `og:url`, указывавший на другой сайт, удалён. после выбора и проверки конечного домена можно добавить правильные абсолютные `og:url`, `og:image` и canonical.

настройки и история приватного проекта openai sites сюда не перенесены. рабочие файлы сайта сохранены, включая портрет и все последние изменения.
