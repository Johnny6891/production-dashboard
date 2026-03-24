import { useState, useEffect } from 'react';
import { getDashboard, getConfig, getTodos } from './api';
import Navbar from './components/Navbar';
import DataCard from './components/DataCard';
import LinksGrid from './components/LinksGrid';
import TodoList from './components/TodoList';

export default function App() {
  const [config, setConfig] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getConfig().then(setConfig);
    getDashboard().then(setDashboard);
    getTodos().then(setTodos);
  }, []);

  return (
    <>
      <Navbar todos={todos} />

      <div className="circle circle-1" />
      <div className="circle circle-2" />
      <div className="circle circle-3" />

      {/* 數據卡片 */}
      <div className="section-width data-container">
        <DataCard
          title={config?.leftCardName ?? '最新完工訂單'}
          icon="📅"
          cardData={dashboard?.leftCard}
          fieldIcons={config?.fieldIcons ?? {}}
          side="left"
        />
        <DataCard
          title={config?.rightCardName ?? '最新完工製程'}
          icon="📄"
          cardData={dashboard?.rightCard}
          fieldIcons={config?.fieldIcons ?? {}}
          side="right"
        />
      </div>

      {/* 常用系統導航 */}
      <div className="section-width">
        <div className="glass-panel">
          <div className="panel-header">
            <span>🔗 常用系統導航</span>
          </div>
          <LinksGrid links={config?.links ?? []} />
        </div>
      </div>

      {/* 待辦事項備忘 */}
      <div className="section-width">
        <div className="glass-panel">
          <TodoList todos={todos} setTodos={setTodos} />
        </div>
      </div>
    </>
  );
}
