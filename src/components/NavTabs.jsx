import { useAppContext } from '../context/AppContext';

export default function NavTabs() {
  const { activeTab, setActiveTab } = useAppContext();

  return (
    <div className="nav-tabs">
      <button
        className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
        onClick={() => setActiveTab('schedule')}
      >
        Расписание
      </button>
      <button
        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
        onClick={() => setActiveTab('history')}
      >
        История
      </button>
    </div>
  );
}