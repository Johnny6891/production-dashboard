const CONFIG = {
  SYSTEM: {
    NAME: '生管系統儀表板',
    VERSION: '2.0.0',
    SCAN_LIMIT: 1500
  },

  CACHE: {
    DURATION: 15 * 60 * 1000 // 15 分鐘（毫秒）
  },

  LEFT_CARD: {
    NAME: '最新完工訂單',
    SPREADSHEET_ID: '1rBcUgfeQLZzTxch6BogtGVXQzPopYxuCTYlabR1XwEA',
    GID: 833350890,
    DATE_COL: '完工日期(V2)',
    OUTPUT_COLS: ['預交日期', '訂單單號', '客戶', '產品代號', '產品名稱', '規格', '訂購數量']
  },

  RIGHT_CARD: {
    NAME: '最新完工製程',
    SPREADSHEET_ID: '1NnXN8DfcyOyp5iephcGV_Jw4vUOGzDXtHpK3rtUzzn8',
    GID: 667630983,
    DATE_COL: '最新結束時間',
    OUTPUT_COLS: ['排程單號', '客戶簡稱', '上階產品編號', '上階產品名稱', '上階產品規格', '加工名稱', '廠商代號', '製令數量', '實際完工數', '未交數量']
  },

  LINKS: [
    { title: '生管常用頁面', url: 'https://gamma.app/docs/-vutkue9x5spnt6e?mode=doc', icon: '📊', className: 'btn-warm' },
    { title: '1F-訂單排程系統', url: 'https://script.google.com/macros/s/AKfycbxl8eblvm3_6eHSqZh9PgmGiEGQ_pi-afT29kkxfVERXnROYbcts1C5NKNSlix1diUB/exec', icon: '🏭', className: 'btn-sage' },
    { title: '2F-訂單排程系統', url: 'https://script.google.com/macros/s/AKfycbztGiR_IdZn5oYjhbaZ0FT5L1aXek7rOSCRcN-LzhFruhgxbq7li_OZaU_tt-m7RIZ4UA/exec', icon: '🏗️', className: 'btn-dusty' },
    { title: '同事需求管理系統', url: 'https://colleague-request-system.vercel.app/', icon: '👥', className: 'btn-slate' },
    {
      title: '2F 生產排程甘特圖',
      icon: '📈',
      className: 'btn-graphite',
      children: [
        { title: 'README', url: 'https://www.notion.so/2F-grmini-32eee389af1a80dd9a9efb433cf131af', icon: '📘', className: 'btn-warm' },
        { title: '連結', url: 'https://script.google.com/a/macros/dgstand.com/s/AKfycbzaL3XAhD9wGKqJO_rFfS7_zTfHzmzdQ_fTlfCSK_s/dev?pli=1&authuser=0', icon: '🔗', className: 'btn-slate' }
      ]
    }
  ],

  FIELD_ICONS: {
    '預交日期': '📅', '訂單單號': '📄', '客戶': '🏢', '產品代號': '🔢',
    '產品名稱': '📦', '規格': '📏', '訂購數量': '🔢', '排程單號': '📄',
    '客戶簡稱': '🏢', '上階產品編號': '🔢', '上階產品名稱': '📦',
    '上階產品規格': '📏', '加工名稱': '🛠️', '廠商代號': '🏭',
    '製令數量': '🔢', '實際完工數': '✔️', '未交數量': '❌'
  }
};

module.exports = CONFIG;
