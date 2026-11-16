import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import FilterBox from './FilterBox';
import HistoryDayCard from './HistoryDayCard';

export default function HistoryTab() {
  const { weekData, historyData } = useAppContext();

  const now = new Date();
  const firstOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

  const [dateFrom, setDateFrom] = useState(firstOfMonth);
  const [dateTo, setDateTo] = useState('');

  const filtered = useMemo(() => {
    let result = historyData || [];
    if (dateFrom) result = result.filter((item) => item.date >= dateFrom);
    if (dateTo) result = result.filter((item) => item.date <= dateTo);
    result = [...result].sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return a.pair_num - b.pair_num;
    });
    return result;
  }, [historyData, dateFrom, dateTo]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((item) => {
      if (!map[item.date]) map[item.date] = [];
      map[item.date].push(item);
    });
    return Object.keys(map)
      .sort()
      .map((dateKey) => ({
        dateKey,
        absences: map[dateKey],
        scheduleDay: (weekData || []).find((d) => d.full_date === dateKey),
      }));
  }, [filtered, weekData]);

  const totalHours = filtered.length * 2;

  return (
    <div id="tab-history" className="tab-content active">
      <FilterBox
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />
      <div className="section-title">
        <span>Сохраненные пропуски</span>
        <span className="hours-total">Всего {totalHours} ч.</span>
      </div>
      <div className="cards-container">
        {(!historyData || historyData.length === 0) ? (
          <div className="empty-state">Пропуски не найдены</div>
        ) : grouped.length === 0 ? (
          <div className="empty-state">Пропуски не найдены за выбранный период</div>
        ) : (
          grouped.map(({ dateKey, absences, scheduleDay }) => (
            <HistoryDayCard
              key={dateKey}
              dateKey={dateKey}
              absences={absences}
              scheduleDay={scheduleDay}
            />
          ))
        )}
      </div>
    </div>
  );
}