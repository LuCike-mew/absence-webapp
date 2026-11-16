import { useAppContext } from '../context/AppContext';

export default function ViewModeBanner() {
  const { canSendData } = useAppContext();

  if (canSendData) return null;

  return (
    <div className="view-mode-banner show">
      <span className="banner-icon">⚠️</span>
      <span>
        Режим просмотра. Чтобы отметить пропуски, закройте приложение и откройте его
        кнопкой <b>«Отметить пропуски»</b> в чате с ботом.
      </span>
    </div>
  );
}