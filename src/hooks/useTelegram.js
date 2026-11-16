import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Хук-обёртка над window.Telegram.WebApp.
 * Предоставляет tg, canSendData (можно ли сохранять), showAlert, showToast.
 */
export function useTelegram() {
  const [tg, setTg] = useState(null);
  const [canSendData, setCanSendData] = useState(true);
  const toastTimer = useRef(null);

  useEffect(() => {
    const app = window.Telegram?.WebApp;
    if (!app) {
      console.warn('[useTelegram] Telegram WebApp SDK не загружен');
      return;
    }

    app.ready();
    app.expand();

    // sendData работает ТОЛЬКО из кнопки клавиатуры («Отметить пропуски»).
    // Из menu button / inline / ссылки initData заполнен — сохранять нельзя.
    const canSend =
      !(app.initDataUnsafe && Object.keys(app.initDataUnsafe).length > 0);
    setCanSendData(canSend);

    console.log(
      '[ScheduleApp] Контекст запуска:',
      canSend ? 'кнопка клавиатуры (сохранение доступно)' : 'menu/inline/ссылка (только просмотр)'
    );

    setTg(app);
  }, []);

  const showAlert = useCallback(
    (text) => {
      if (tg) {
        tg.showAlert(text);
      } else {
        alert(text);
      }
    },
    [tg]
  );

  const sendData = useCallback(
    (data) => {
      if (tg && canSendData) {
        tg.sendData(JSON.stringify(data));
      }
    },
    [tg, canSendData]
  );

  return { tg, canSendData, showAlert, sendData };
}