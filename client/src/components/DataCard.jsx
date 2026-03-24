const LEFT_COLS = ['預交日期', '訂單單號', '客戶', '產品代號', '產品名稱', '規格', '訂購數量'];
const RIGHT_COLS = ['排程單號', '客戶簡稱', '上階產品編號', '上階產品名稱', '上階產品規格', '加工名稱', '廠商代號', '製令數量', '實際完工數', '未交數量'];

export default function DataCard({ title, icon, cardData, fieldIcons, side }) {
  const cols = side === 'left' ? LEFT_COLS : RIGHT_COLS;

  const renderContent = () => {
    if (!cardData) return <div className="loading-text">資料讀取中...</div>;
    if (cardData.error) return <div style={{ color: 'red', padding: '10px' }}>{cardData.error}</div>;
    if (!cardData.data?.length) return <div style={{ textAlign: 'center', color: '#888', paddingTop: '20px' }}>目前無最新資料</div>;

    return cardData.data.map((item, i) => (
      <div key={i} className="list-card">
        {cols.map(col => {
          const isUndone = col === '未交數量' && item[col] != 0;
          return (
            <div key={col} className="list-row">
              <span className="list-icon">{fieldIcons[col] ?? '📋'}</span>
              <div className="list-content">
                <span className="list-label">{col}:</span>
                <span className={`list-value${isUndone ? ' highlight-red' : ''}`}>
                  {item[col] ?? ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="data-card">
      <div className="data-header">
        <div className="header-title-group">
          <span>{icon} {title}</span>
          <span className="count-badge">
            {cardData ? `(共 ${cardData.count ?? 0} 筆)` : ''}
          </span>
        </div>
        <span className="data-date-badge">
          {cardData?.date ?? 'Loading...'}
        </span>
      </div>
      <div className="list-wrapper">
        {renderContent()}
      </div>
    </div>
  );
}
