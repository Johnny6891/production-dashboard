import { useState, useEffect } from 'react';
import { getDashboard, getConfig, getTodos } from './api';
import Navbar from './components/Navbar';
import DataCard from './components/DataCard';
import TodoList from './components/TodoList';

export default function App() {
  const [config, setConfig] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getConfig().then(setConfig);
    getDashboard().then(setDashboard);
    getTodos().then(setTodos);

    const dashboardTimer = setInterval(() => {
      getDashboard().then(setDashboard);
    }, 5 * 60 * 1000); // 每 5 分鐘

    const todosTimer = setInterval(() => {
      getTodos().then(setTodos);
    }, 2 * 60 * 1000); // 每 2 分鐘

    return () => {
      clearInterval(dashboardTimer);
      clearInterval(todosTimer);
    };
  }, []);

  return (
    <>
      <Navbar todos={todos} links={config?.links ?? []} />

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

      {/* 待辦事項備忘 */}
      <div className="section-width">
        <div className="glass-panel">
          <TodoList todos={todos} setTodos={setTodos} />
        </div>
      </div>
    </>
  );
}
