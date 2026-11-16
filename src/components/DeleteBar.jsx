import { useAppContext } from '../context/AppContext';

export default function DeleteBar() {
  const {
    canSendData,
    selectedForDeletion,
    historyData,
    sendData,
    showToast,
    showAlert,
    clearSelectedForDeletion,
  } = useAppContext();

  if (selectedForDeletion.size === 0) {
    return <div className="delete-bar hidden" id="delete-bar" />;
  }

  const handleConfirm = () => {
    if (!canSendData) {
      showAlert(
        'Удаление доступно только при открытии через кнопку «Отметить пропуски» в чате бота.'
      );
      return;
    }

    const items = [];
    selectedForDeletion.forEach((id) => {
      const item = historyData.find((h) => h.id === id);
      if (item) {
        items.push({
          id: item.id,
          date: item.date,
          pair_num: item.pair_num,
          subject: item.subject,
        });
      }
    });

    if (items.length === 0) return;

    showToast('Удаление...');
    clearSelectedForDeletion();
    sendData({ deletions: items });
  };

  return (
    <div className="delete-bar" id="delete-bar">
      <span className="delete-count-text">Выбрано: {selectedForDeletion.size}</span>
      <button className="delete-confirm-btn" onClick={handleConfirm}>
        Удалить выбранное 🗑
      </button>
    </div>
  );
}