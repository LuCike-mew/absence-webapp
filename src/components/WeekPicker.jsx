import DayPill from './DayPill';

export default function WeekPicker({
  weekData,
  weekGroups,
  currentWeekIndex,
  activeDayIndex,
  onSelectDay,
  onNavWeek,
}) {
  if (!weekData || weekData.length === 0 || !weekGroups || weekGroups.length === 0) {
    return (
      <div className="week-nav">
        <button className="nav-arrow" disabled>◀</button>
        <div className="days-picker" />
        <button className="nav-arrow" disabled>▶</button>
      </div>
    );
  }

  const group = weekGroups[currentWeekIndex] || [];

  return (
    <div className="week-nav">
      <button
        className="nav-arrow"
        disabled={currentWeekIndex <= 0}
        onClick={() => onNavWeek(-1)}
        title="Предыдущая неделя"
      >
        ◀
      </button>
      <div className="days-picker">
        {group.map((dayIndex) => (
          <DayPill
            key={dayIndex}
            day={weekData[dayIndex]}
            isActive={dayIndex === activeDayIndex}
            onClick={() => onSelectDay(dayIndex)}
          />
        ))}
      </div>
      <button
        className="nav-arrow"
        disabled={currentWeekIndex >= weekGroups.length - 1}
        onClick={() => onNavWeek(1)}
        title="Следующая неделя"
      >
        ▶
      </button>
    </div>
  );
}