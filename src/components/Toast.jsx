import { useAppContext } from '../context/AppContext';

export default function Toast() {
  const { toastText } = useAppContext();

  return (
    <div id="toast" className={`toast ${toastText ? 'show' : ''}`}>
      {toastText}
    </div>
  );
}