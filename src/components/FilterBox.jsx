export default function FilterBox({ dateFrom, dateTo, onDateFromChange, onDateToChange }) {
  return (
    <div className="filter-box">
      <div className="filter-group">
        <label>Дата с</label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
        />
      </div>
      <div className="filter-group">
        <label>Дата по</label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
        />
      </div>
    </div>
  );
}