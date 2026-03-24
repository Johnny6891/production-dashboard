import { useState, useEffect } from 'react';

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 18) return '晚安';
  if (h >= 12) return '午安';
  return '早安';
}

function getDateStr() {
  const now = new Date();
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `今天是 ${y}年${m}月${d}日 (星期${days[now.getDay()]})`;
}

export default function Navbar({ todos }) {
  const [dateStr, setDateStr] = useState(getDateStr());

  useEffect(() => {
    const t = setInterval(() => setDateStr(getDateStr()), 60000);
    return () => clearInterval(t);
  }, []);

  const activeTodos = todos.filter(t => !t.done).slice(0, 3);

  return (
    <nav className="glass-nav">
      <div className="nav-greeting">{getGreeting()}，生管專員</div>
      <div className="nav-info">{dateStr}</div>
      <div className="nav-todos-display">
        {activeTodos.length > 0
          ? activeTodos.map(t => (
              <div key={t.id} className="nav-todo-line">🔹 {t.text}</div>
            ))
          : <span style={{ opacity: 0.5 }}>尚無待辦事項，太棒了！</span>
        }
      </div>
    </nav>
  );
}
