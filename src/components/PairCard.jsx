import { useAppContext } from '../context/AppContext';

export default function PairCard({ pair, dayIndex, dayFullDate }) {
  const { selectedPairs, togglePair, historyData } = useAppContext();

  const key = `${dayIndex}_${pair.num}`;
  const alreadySaved = historyData.some(
    (item) => item.date === dayFullDate && item.pair_num === pair.num
  );
  const isSelected = selectedPairs.has(key);
  const hasOriginal = !!(pair.is_replacement && pair.original_subject);

  const handleClick = () => {
    if (alreadySaved) return;
    togglePair(key);
  };

  return (
    <div
      className={`pair-card ${alreadySaved ? 'already-saved' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      style={alreadySaved ? { cursor: 'not-allowed' } : undefined}
      title={alreadySaved ? 'Пропуск уже сохранён' : undefined}
    >
      <div className="pair-info">
        <div className="pair-header">
          <span className="pair-badge">{pair.num} пара</span>
          {pair.is_replacement && <span className="replacement-tag">Замена</span>}
          {alreadySaved && (
            <span
              className="replacement-tag"
              style={{ backgroundColor: 'rgba(255,150,0,0.15)', color: '#e08c00' }}
            >
              Уже отмечено
            </span>
          )}
        </div>
        <span className="pair-title">
          {hasOriginal ? (
            <>
              <span className="pair-original">{pair.original_subject}</span>{' '}
              <span>{pair.subject}</span>
            </>
          ) : (
            pair.subject
          )}
        </span>
        {(pair.room || (hasOriginal && pair.original_room && pair.original_room !== pair.room)) && (
          <span className="pair-room">
            {hasOriginal && pair.original_room && pair.original_room !== pair.room && (
              <span className="pair-original">📍 {pair.original_room}</span>
            )}
            {pair.room && <span> 📍 {pair.room}</span>}
          </span>
        )}
      </div>
      <div className="checkbox" />
    </div>
  );
}