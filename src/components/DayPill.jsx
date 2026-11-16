const DAY_ABBREV = {
  'Понедельник': 'ПН',
  'Вторник': 'ВТ',
  'Среда': 'СР',
  'Четверг': 'ЧТ',
  'Пятница': 'ПТ',
  'Суббота': 'СБ',
  'Воскресенье': 'ВС',
};

export default function DayPill({ day, isActive, onClick }) {
  const label = DAY_ABBREV[day.day_name] || day.day_name.substring(0, 2);

  return (
    <div
      className={`day-pill ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="day-pill-name">{label}</div>
      <div className="day-pill-date">{day.date}</div>
    </div>
  );
}