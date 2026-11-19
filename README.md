# CryptoChart

CryptoChart — веб-дашборд для мониторинга рынка криптовалют. Он показывает цены, изменение котировок, капитализацию и объём торгов на основе данных CoinGecko.

- **Обзор рынка** — трендовые монеты, категории и каталог криптовалют.
- **Страница монеты** — периодическое обновление котировки, свечной график с выбором периода, рыночные показатели и конвертер валют.
- **Рыночный терминал** (`/earth`) —карта монет по капитализации и изменению цены за 24 часа и интерактивный 3D-глобус.

## Стек

- **Next.js 16 (App Router), React 19 и TypeScript** — маршрутизация, серверные компоненты и типизация.
- **Tailwind CSS 4, shadcn/ui и Radix UI** — интерфейс.
- **CoinGecko API** — котировки и рыночные данные.
- **Lightweight Charts, react-globe.gl и Three.js** — графики и 3D-визуализация.
- **RainbowKit, wagmi, viem и TanStack Query** — подключение кошельков и работа с Web3.

## Подключение кошелька

RainbowKit открывает окно выбора кошелька, например MetaMask или Coinbase Wallet, и поддерживает подключение через WalletConnect. После подключения в шапке отображаются сокращённый адрес, баланс и значок сети. Поддерживаются Ethereum, Polygon, Optimism, Arbitrum и Base.

## Оптимизация

- **Lazy loading через `next/dynamic`** выносит свечной график, 3D-глобус и кнопку подключения кошелька в отдельные клиентские чанки.
- **`useMemo`** сохраняет результаты расчёта тепловой карты и подготовки данных для глобуса между рендерами, пока их зависимости не изменятся.
- **`Suspense`** позволяет секциям главной страницы отображаться по мере готовности. Пока загружаются данные, видны заглушки.
- **Кеширование с `revalidate`** сокращает число повторных запросов к CoinGecko. Интервал обновления кеша зависит от типа данных.

## Локальный запуск

Добавьте в `.env.local` ключ CoinGecko Demo и ID проекта WalletConnect:

```dotenv
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
COINGECKO_API_KEY=your_coingecko_demo_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

```bash
npm ci
npm run dev
```

Откройте `http://localhost:3000`.

## CI/CD

GitHub Actions запускает `npm ci`, линтер, проверку типов и production-сборку при push в `main` и pull request в эту ветку. Workflow также можно запустить вручную во вкладке Actions.

Для сборки добавьте `COINGECKO_API_KEY` и `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` в GitHub → Settings → Secrets and variables → Actions → New repository secret. Pull request из внешнего форка потребует этих значений в отдельном доверенном запуске, обычный запуск из форка остановится после проверки типов.

CD подготовлен в `.github/workflows/cd.yml` для будущего проекта Vercel. Он запускается вручную через Actions → CD (Vercel) → Run workflow на ветке `main`. Флажок `deploy` по умолчанию выключен. Для текущей работы подключать хостинг не требуется.

При включённом `deploy` workflow загружает production-настройки Vercel, выполняет линтер, проверку типов и сборку через `vercel build`, затем публикует полученный результат через `vercel deploy --prebuilt`. Публикация выполняется после успешной сборки.

Для будущего подключения создайте проект Vercel с Node.js 24.x, добавьте три переменные из раздела локального запуска в его Production Environment Variables, а в GitHub Secrets сохраните `VERCEL_TOKEN`, `VERCEL_ORG_ID` и `VERCEL_PROJECT_ID`.

В `vercel.json` отключён автоматический деплой через Git-интеграцию Vercel. Публикацией управляет ручной workflow.

[GitHub Actions](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs) · [Vercel с GitHub Actions](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel)
