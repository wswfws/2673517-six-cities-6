Plan: Добавление в избранное

Кратко: реализовать сетевой вызов для изменения статуса избранного, создать/вызвать async-thunk в сторе, обновить соответствующие части состояния (список объявлений, detail, соседи) и сделать кнопку/шапку реактивными — чтобы после успешной операции кнопка меняла вид и счётчик в шапке обновлялся.

Steps
~~1. Добавить API-обёртку `changeFavoriteStatus(api, offerId, status)` в `src/api/` (новый файл `favorite-api.ts`) для запроса на сервер (см. `createAPI` в `src/api/index.ts` и схожие fetchers).~~
~~2. Создать async-thunk `postFavoriteAction` в `src/store/api-actions.ts`, который вызывает `changeFavoriteStatus`, получает обновлённые данные и диспатчит обновления (см. `fetchOfferAction`, `fetchOffersAction`).~~
~~3. Добавить редьюсер/экшены в `src/store/reducer.ts` для актуализации `offers.places`, `offers.offerDetail` и `offers.neighbors` (например, `updatePlace` или `setPlaces` с переработкой одного элемента).~~
~~4. Подключить обработчик клика на кнопки «избранное`:~~
   - В `src/components/widgets/city-place-card.tsx` и `src/components/widgets/city-place-card-favorites.tsx` — добавить `onClick` для кнопки, который:
     - проверяет `useAuthorizationStatus()`; если не авторизован — перенаправляет на логин (`ROUTE_CONFIG.LOGIN`),
     - иначе диспатчит `postFavoriteAction(offerId, newStatus)`.
   - В `src/pages/offer/offer.tsx` (страница объявления) — аналогично добавить обработчик для большой кнопки закладки.
5. Сделать шапку динамической: в `src/components/widgets/header.tsx` заменить статический email и счётчик на данные из стора (`useAppSelector` — `state.user.userData.email` и count = number of `state.offers.places` где `isFavorite === true`), отображать 0 когда нет.
6. UI/UX: при отправке запроса временно дизейблить кнопку (или добавлять CSS-класс `button--loading`) и показывать уведомление об ошибке при неуспехе (реиспользовать перехватчик ошибок в `createAPI`).

Further Considerations
1. API route: неизвестен формат endpoint для изменения избранного — вариант A: `/favorite/:offerId/:status` (0/1), вариант B: `POST /favorites` с телом {offerId, status}. Нужно подтвердить бекенд или проверить документацию/напр. devs; предложаю использовать путь в стиле HTMLAcademy `/favorite/{id}/{status}` и сделать легко заменяемым.
2. Обновление состояния: Option A — получать от сервера обновлённый объект объявления и заменять его в сторе; Option B — локально переключать `isFavorite` после успешного ответа (без полной замены). Рекомендую Option A (более надёжно).
3. Поведение для страницы `favorites`: если с сервера возвращаются только избранные и пользователь удалил из избранного, обеспечить удаление карточки из `favorites` через общее состояние `offers.places` или отдельный фильтр (см. `src/pages/favorites/favorites.tsx`).

Assumptions
- Имя файла использует camelCase: `addToFavorites`.
- Endpoint для изменения статуса избранного будет `/favorite/{id}/{status}` (можно изменить позже).

Next steps
- По запросу пользователя — реализовать изменения в коде: добавить `src/api/favorite-api.ts`, обновить `src/store/api-actions.ts`, внести редьюсер-экшены, и подключить обработчики клика в компонентах и шапке. " as is" план сохранён для дальнейшей доработки.

