const { google } = require('googleapis');
const fs = require('fs');
const CONFIG = require('../config');

// ─── 認證初始化 ────────────────────────────────────────────
function getAuth() {
  let credentials;

  if (process.env.GOOGLE_SERVICE_ACCOUNT_PATH) {
    credentials = JSON.parse(fs.readFileSync(process.env.GOOGLE_SERVICE_ACCOUNT_PATH, 'utf8'));
  } else if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  } else {
    throw new Error('缺少 Google Service Account 設定');
  }

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });
}

const sheets = google.sheets({ version: 'v4', auth: getAuth() });

// ─── 快取 ───────────────────────────────────────────────────
let cache = { data: null, timestamp: 0 };

// ─── 核心讀取邏輯 ───────────────────────────────────────────
async function getSheetDataByGid(spreadsheetId, gid, scanLimit) {
  // 1. 取得試算表 metadata，找出 GID 對應的工作表名稱
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sheet = meta.data.sheets.find(s => s.properties.sheetId === gid);
  if (!sheet) throw new Error(`找不到 GID ${gid} 的工作表`);

  const sheetTitle = sheet.properties.title;

  // 2. 讀取資料
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${sheetTitle}'!A1:ZZ${scanLimit + 1}`
  });

  const rows = res.data.values;
  if (!rows || rows.length < 2) return { headers: [], data: [] };

  return { headers: rows[0], data: rows.slice(1) };
}

// ─── 篩選最新日期 ───────────────────────────────────────────
function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
}

function normalizeDateStr(value) {
  if (!value) return '';
  const d = parseDate(value);
  if (d) return formatDate(d);
  return String(value).substring(0, 10).replace(/-/g, '/');
}

function filterByLatestDate(headers, data, dateColName, outputCols) {
  const dateColIdx = headers.indexOf(dateColName);
  if (dateColIdx === -1) return { date: `欄位找不到: ${dateColName}`, data: [], count: 0 };
  if (!data.length) return { date: '區間無資料', data: [], count: 0 };

  // 找最新日期
  let latestTs = 0, latestDateStr = '';
  for (const row of data) {
    const d = parseDate(row[dateColIdx]);
    if (d && d.getTime() > latestTs) {
      latestTs = d.getTime();
      latestDateStr = formatDate(d);
    }
  }
  if (!latestDateStr) return { date: '區間無日期', data: [], count: 0 };

  // 篩選並格式化
  const outputIndices = outputCols.map(name => headers.indexOf(name));
  const filtered = [];

  for (const row of data) {
    if (normalizeDateStr(row[dateColIdx]) !== latestDateStr) continue;
    const item = {};
    outputCols.forEach((col, k) => {
      let val = outputIndices[k] !== -1 ? row[outputIndices[k]] ?? '' : '';
      if (col === '未交數量' && val === '') val = 0;
      item[col] = val;
    });
    filtered.push(item);
  }

  return { date: latestDateStr, data: filtered, count: filtered.length };
}

// ─── 對外接口 ───────────────────────────────────────────────
async function getDashboardData() {
  const now = Date.now();
  if (cache.data && now - cache.timestamp < CONFIG.CACHE.DURATION) {
    return cache.data;
  }

  const result = {
    leftCard: { date: '無資料', data: [], count: 0 },
    rightCard: { date: '無資料', data: [], count: 0 }
  };

  try {
    const left = await getSheetDataByGid(
      CONFIG.LEFT_CARD.SPREADSHEET_ID, CONFIG.LEFT_CARD.GID, CONFIG.SYSTEM.SCAN_LIMIT
    );
    result.leftCard = filterByLatestDate(left.headers, left.data, CONFIG.LEFT_CARD.DATE_COL, CONFIG.LEFT_CARD.OUTPUT_COLS);
  } catch (e) {
    result.leftCard.error = `讀取錯誤: ${e.message}`;
  }

  try {
    const right = await getSheetDataByGid(
      CONFIG.RIGHT_CARD.SPREADSHEET_ID, CONFIG.RIGHT_CARD.GID, CONFIG.SYSTEM.SCAN_LIMIT
    );
    result.rightCard = filterByLatestDate(right.headers, right.data, CONFIG.RIGHT_CARD.DATE_COL, CONFIG.RIGHT_CARD.OUTPUT_COLS);
  } catch (e) {
    result.rightCard.error = `讀取錯誤: ${e.message}`;
  }

  cache = { data: result, timestamp: now };
  return result;
}

module.exports = { getDashboardData };
