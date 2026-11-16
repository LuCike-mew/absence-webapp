import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import WeekPicker from './WeekPicker';
import PairCard from './PairCard';
import { buildWeekGroups } from '../utils/decompress';

export default function ScheduleTab() {
  const { weekData } = useAppContext();
  const weekGroups = useMemo(() => buildWeekGroups(weekData), [weekData]);

  // Найти сегодня в weekData для начального выбора
  const initialDayIndex = useMemo(() => {
    if (!weekData || weekData.length === 0) return 0;
    const todayStr = new Date().toISOString().slice(0, 10);
    let idx = weekData.findIndex((d) => d.full_date === todayStr);
    if (idx === -1) idx = weekData.length - 1;
    return idx;
  }, [weekData]);

  const [activeDayIndex, setActiveDayIndex] = useState(initialDayIndex);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(() => {
    if (!weekGroups || weekGroups.length === 0) return 0;
    for (let i = 0; i < weekGroups.length; i++) {
      if (weekGroups[i].includes(initialDayIndex)) return i;
    }
    return 0;
  });

  const handleSelectDay = (dayIndex) => {
    setActiveDayIndex(dayIndex);
    for (let i = 0; i < weekGroups.length; i++) {
      if (weekGroups[i].includes(dayIndex)) {
        setCurrentWeekIndex(i);
        break;
      }
    }
  };

  const handleNavWeek = (dir) => {
    const newIdx = currentWeekIndex + dir;
    if (newIdx < 0 || newIdx >= weekGroups.length) return;
    setCurrentWeekIndex(newIdx);
    setActiveDayIndex(weekGroups[newIdx][0]);
  };

  if (!weekData || weekData.length === 0) {
    return (
      <div id="tab-schedule" className="tab-content active">
        <WeekPicker
          weekData={[]}
          weekGroups={[]}
          currentWeekIndex={0}
          activeDayIndex={0}
          onSelectDay={() => {}}
          onNavWeek={() => {}}
        />
        <div className="empty-state">
          ⚠️ Не удалось загрузить расписание.
          <br />
          Проверьте подключение к интернету и попробуйте снова через /start
        </div>
      </div>
    );
  }

  const currentDay = weekData[activeDayIndex];
  const dayTitle = currentDay
    ? `Занятия — ${currentDay.day_name} (${currentDay.date})`
    : 'Занятия';

  return (
    <div id="tab-schedule" className="tab-content active">
      <WeekPicker
        weekData={weekData}
        weekGroups={weekGroups}
        currentWeekIndex={currentWeekIndex}
        activeDayIndex={activeDayIndex}
        onSelectDay={handleSelectDay}
        onNavWeek={handleNavWeek}
      />
      <div className="section-title" id="selected-day-title">
        {dayTitle}
      </div>
      <div id="pairs-container" className="cards-container">
        {currentDay && currentDay.pairs && currentDay.pairs.length > 0 ? (
          currentDay.pairs.map((pair) => (
            <PairCard
              key={`${activeDayIndex}_${pair.num}`}
              pair={pair}
              dayIndex={activeDayIndex}
              dayFullDate={currentDay.full_date}
            />
          ))
        ) : (
          <div className="empty-state">На этот день пар не найдено</div>
        )}
      </div>
    </div>
  );
}