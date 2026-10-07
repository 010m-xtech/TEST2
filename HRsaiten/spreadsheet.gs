/**
 * ハッピーリング採点チャレンジ → スプレッドシート
 *
 * Firebase の private(感想の控え)を読み、新しい記録だけを下に足していきます。
 * 日付・端末・ニックネーム・点数・感想 と、重複を防ぐための ID が入ります。
 * 鍵やパスワードは使いません。Firebase の持ち主の Google アカウントで動かすだけで読めます。
 * (ページを開いたお客さんからは、これまでどおり private は読めません)
 */
const PROJECT_ID = 'happyringnagomu';
const SHEET_NAME = '記録';
const HEADER = ['日付', '端末', 'ニックネーム', '点数', '感想', 'ID'];

/** 最初に1回だけ実行: 見出しを作り、1時間ごとに自動で取り込むようにする */
function setup() {
  sheet_();
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'importRecords')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('importRecords').timeBased().everyHours(1).create();
  importRecords();
}

/** 新しい記録を取り込む(手で実行してもOK) */
function importRecords() {
  const sh = sheet_();
  const last = sh.getLastRow();
  const ids = new Set(last > 1 ? sh.getRange(2, 6, last - 1, 1).getValues().map(r => String(r[0])) : []);
  let since = Number(PropertiesService.getScriptProperties().getProperty('since') || 0);
  let added = 0;

  for (let page = 0; page < 20; page++) {
    const docs = query_(since);
    const rows = [];
    docs.forEach(doc => {
      const id = doc.name.split('/').pop();
      const f = doc.fields || {};
      const at = Number(val_(f.createdAt) || 0);
      if (at > since) since = at;
      if (ids.has(id)) return;
      ids.add(id);
      rows.push([
        at ? new Date(at) : '',
        val_(f.device) || '-',
        val_(f.name) || '',
        Number(val_(f.score) || 0),
        val_(f.memo) || '',
        id,
      ]);
    });
    if (rows.length) {
      sh.getRange(sh.getLastRow() + 1, 1, rows.length, HEADER.length).setValues(rows);
      added += rows.length;
    }
    if (docs.length < 300) break;
  }
  // 同じ瞬間の記録を取りこぼさないよう、少しだけ戻して次回に重ねて読む(ID で重複は防ぐ)
  PropertiesService.getScriptProperties().setProperty('since', String(Math.max(0, since - 60000)));
  console.log(added + ' 件を追加しました');
}

/** はじめから読み直したいとき(シートの2行目以降を消してから実行) */
function resetImport() {
  PropertiesService.getScriptProperties().deleteProperty('since');
}

function query_(since) {
  const url = 'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID +
    '/databases/(default)/documents:runQuery';
  const body = {
    structuredQuery: {
      from: [{ collectionId: 'private' }],
      where: { fieldFilter: { field: { fieldPath: 'createdAt' }, op: 'GREATER_THAN_OR_EQUAL', value: { integerValue: String(since) } } },
      orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'ASCENDING' }],
      limit: 300,
    },
  };
  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(body),
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken(),
      'x-goog-user-project': PROJECT_ID,
    },
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) throw new Error('Firebase の読み込みに失敗: ' + res.getContentText());
  return JSON.parse(res.getContentText()).filter(r => r.document).map(r => r.document);
}

function val_(v) {
  if (!v) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return v.integerValue;
  if ('doubleValue' in v) return v.doubleValue;
  return null;
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADER);
    sh.setFrozenRows(1);
    sh.getRange('A:A').setNumberFormat('yyyy/mm/dd hh:mm');
    sh.setColumnWidth(2, 180);
  }
  return sh;
}
