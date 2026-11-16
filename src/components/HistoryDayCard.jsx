import { formatDateDDMMYYYY } from '../utils/decompress';
import { useAppContext } from '../context/AppContext';

/**
 * Карточка одного дня в истории: все пары из расписания + отмеченные пропуски.
 */
export default function HistoryDayCard({ dateKey, absences, scheduleDay }) {
  const { selectedForDeletion, toggleDeletion } = useAppContext();

  const dayName = scheduleDay ? scheduleDay.day_name : '';
  const dateFormatted = formatDateDDMMYYYY(dateKey);
  const headerText = dayName ? `${dateFormatted}, ${dayName}` : dateFormatted;
  const dayHours = absences.length * 2;

  const handleDeleteClick = (e, absenceId) => {
    e.stopPropagation();
    toggleDeletion(absenceId);
  };

  return (
    <div className="day-card">
      <div className="day-card-header">{headerText}</div>

      {scheduleDay && scheduleDay.pairs && scheduleDay.pairs.length > 0 ? (
        // Показываем ВСЕ пары из расписания
        scheduleDay.pairs.map((pair) => {
          const absence = absences.find((a) => a.pair_num === pair.num);
          if (absence) {
            const isSelected = selectedForDeletion.has(absence.id);
            return (
              <div
                key={absence.id}
                className={`day-row pair-absent ${isSelected ? 'row-selected' : ''}`}
                data-absence-id={absence.id}
              >
                <span className="pair-num">{pair.num} п</span>
                <span className="pair-subject">{pair.subject}</span>
                {pair.is_replacement && (
                  <span className="replacement-tag" style={{ marginLeft: 2 }}>
                    Замена
                  </span>
                )}
                <span className="absence-badge">нб — 2 ч.</span>
                <button
                  className="delete-btn"
                  title="Убрать из пропусков"
                  onClick={(e) => handleDeleteClick(e, absence.id)}
                >
                  ✕
                </button>
              </div>
            );
          } else {
            return (
              <div key={`present-${pair.num}`} className="day-row pair-present">
                <span className="pair-num">{pair.num} п</span>
                <span className="pair-subject">{pair.subject}</span>
                {pair.is_replacement && (
                  <span className="replacement-tag" style={{ marginLeft: 2 }}>
                    Замена
                  </span>
                )}
              </div>
            );
          }
        })
      ) : (
        // Расписания нет — только пропуски
        absences.map((absence) => {
          const isSelected = selectedForDeletion.has(absence.id);
          return (
            <div
              key={absence.id}
              className={`day-row pair-absent ${isSelected ? 'row-selected' : ''}`}
              data-absence-id={absence.id}
            >
              <span className="pair-num">{absence.pair_num} п</span>
              <span className="pair-subject">{absence.subject}</span>
              <span className="absence-badge">нб — 2 ч.</span>
              <button
                className="delete-btn"
                title="Убрать из пропусков"
                onClick={(e) => handleDeleteClick(e, absence.id)}
              >
                ✕
              </button>
            </div>
          );
        })
      )}

      <div className="day-card-separator" />
      <div className="day-card-total">
        📋 Пропущено за день: <strong>{dayHours} ч.</strong>
      </div>
    </div>
  );
}