import { useAppContext } from '../context/AppContext';

export default function BottomBar() {
  const { canSendData, selectedPairs, weekData, sendData, showToast, showAlert, clearSelectedPairs } =
    useAppContext();

  const handleSend = () => {
    if (!canSendData) {
      showAlert(
        'Сохранение доступно только при открытии через кнопку «Отметить пропуски» в чате бота. Сейчас приложение открыто в режиме просмотра — закройте его и нажмите эту кнопку.'
      );
      return;
    }

    if (selectedPairs.size === 0) {
      showAlert('Выберите хотя бы одну пару для отметки пропуска');
      return;
    }

    const absences = [];
    selectedPairs.forEach((key) => {
      const [dayIdx, pairNum] = key.split('_').map(Number);
      const day = weekData[dayIdx];
      if (!day) return;
      const pair = day.pairs?.find((p) => p.num === pairNum);
      if (pair) {
        absences.push({
          date: day.full_date,
          pair_number: pair.num,
          subject: pair.subject,
        });
      }
    });

    showToast('Сохранение...');
    clearSelectedPairs();
    sendData({ absences });
  };

  return (
    <div className="bottom-bar" id="bottom-bar">
      <button className="submit-btn" onClick={handleSend}>
        Сохранить пропуски
      </button>
    </div>
  );
}