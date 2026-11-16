import { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { useTelegram } from './hooks/useTelegram';
import { parseWeekParam, parseCompressedHistory } from './utils/decompress';
import NavTabs from './components/NavTabs';
import ViewModeBanner from './components/ViewModeBanner';
import ScheduleTab from './components/ScheduleTab';
import HistoryTab from './components/HistoryTab';
import BottomBar from './components/BottomBar';
import DeleteBar from './components/DeleteBar';
import Toast from './components/Toast';

function AppContent() {
  const { activeTab, weekData } = useAppContext();

  if (!weekData) {
    return (
      <div className="empty-state" style={{ padding: 40, textAlign: 'center' }}>
        Загрузка...
      </div>
    );
  }

  return (
    <>
      <Toast />
      <NavTabs />
      <ViewModeBanner />

      {activeTab === 'schedule' ? <ScheduleTab /> : <HistoryTab />}

      {activeTab === 'schedule' && <BottomBar />}
      <DeleteBar />
    </>
  );
}

export default function App() {
  const { tg, canSendData, showAlert, sendData } = useTelegram();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weekData, setWeekData] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    async function init() {
      try {
        // Чтение параметров из URL
        const urlParams = new URLSearchParams(window.location.search);
        const rawWeek = urlParams.get('week');
        const rawHistoryCompressed = urlParams.get('h');
        const urlVersion = parseInt(urlParams.get('v')) || 10;
        const rawMonthStart = urlParams.get('ms');

        console.log('[ScheduleApp] === Инициализация ===');
        console.log('[ScheduleApp] Версия URL:', urlVersion);
        console.log('[ScheduleApp] week length:', rawWeek ? rawWeek.length : 0);
        console.log('[ScheduleApp] h length:', rawHistoryCompressed ? rawHistoryCompressed.length : 0);
        console.log('[ScheduleApp] ms (month start):', rawMonthStart);

        const parsed = await parseWeekParam(rawWeek, urlVersion);
        console.log('[ScheduleApp] weekData загружено, элементов:', parsed.length);
        setWeekData(parsed);

        if (rawHistoryCompressed) {
          const hist = await parseCompressedHistory(rawHistoryCompressed);
          setHistoryData(hist);
        }

        console.log('[ScheduleApp] === Готово ===');
      } catch (e) {
        console.error('[ScheduleApp] Ошибка инициализации:', e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  if (loading || !tg) {
    return (
      <div className="empty-state" style={{ padding: 40, textAlign: 'center' }}>
        Загрузка расписания…
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state" style={{ padding: 40, textAlign: 'center' }}>
        ⚠️ Не удалось загрузить расписание.
        <br />
        {error}
      </div>
    );
  }

  return (
    <AppProvider
      initialState={{
        weekData,
        historyData,
        canSendData,
        showAlert,
        sendData,
      }}
    >
      <AppContent />
    </AppProvider>
  );
}