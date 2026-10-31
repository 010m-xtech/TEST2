/**
 * ハッピーリング採点チャレンジ → スプレッドシート
 *
 * Firebase の private(感想の控え)を読み、新しい記録だけを下に足していきます。
 * 日時・端末・写真・一言(感想)・ニックネーム・点数 と、重複を防ぐための ID が入ります。
 * 写真はセルの中に入れるので、Firebase から消えたあともシートに残ります。
 * シートに書き写した感想の控え(private)は、Firebase から消します(シートには残ります)。
 * あわせて、期限が過ぎた記録と写真(scores・thumbs・photos)を Firebase から消します。
 * 鍵やパスワードは使いません。Firebase プロジェクトのメンバー(オーナー・編集者)の Google アカウントで動かすだけで読めます。
 * (ページを開いたお客さんからは、これまでどおり private は読めません)
 */
const PROJECT_ID = 'nagonomise-happyring'; // Firebase の「プロジェクトの設定」にある「プロジェクト ID」
const SHEET_NAME = '記録';
const HEADER = ['日時', '端末', '写真', '一言', 'ニックネーム', '点数', 'ID'];
const PHOTO_COL = 3, ID_COL = 7;

/** 最初に1回だけ実行: 見出しを作り、1時間ごとに自動で取り込み・お掃除するようにする */
function setup() {
  sheet_();
  ScriptApp.getProjectTriggers()
    .filter(t => ['importRecords', 'hourly'].includes(t.getHandlerFunction()))
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('hourly').timeBased().everyHours(1).create();
  hourly();
}

/** 1時間ごと: 新しい記録を取り込んでから、期限切れの記録と写真を消す */
function hourly() {
  importRecords();
  cleanup();
}

/** 新しい記録を取り込み、シートに入った分を Firebase の private から消す(手で実行してもOK) */
function importRecords() {
  const sh = sheet_();
  const last = sh.getLastRow();
  const ids = new Set(last > 1 ? sh.getRange(2, ID_COL, last - 1, 1).getValues().map(r => String(r[0])) : []);
  const fresh = Date.now() - 2 * 60000; // 写真は記録の数秒あとに届くので、2分たっていない記録は次回に回す
  let since = Number(PropertiesService.getScriptProperties().getProperty('since') || 0);
  let added = 0, removed = 0;

  for (let page = 0; page < 20; page++) {
    const all = query_(since);
    const cut = all.findIndex(doc => Number(val_((doc.fields || {}).createdAt) || 0) > fresh);
    const docs = cut < 0 ? all : all.slice(0, cut);
    const rows = [], photos = [];
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
        '',
        val_(f.memo) || '',
        val_(f.name) || '',
        Number(val_(f.score) || 0),
        id,
      ]);
      photos.push(photo_(id));
    });
    if (rows.length) {
      const top = sh.getLastRow() + 1;
      sh.getRange(top, 1, rows.length, HEADER.length).setValues(rows);
      sh.setRowHeights(top, rows.length, 110);
      // 写真は1枚ずつ入れる(1枚うまくいかなくても、ほかの記録は残す)
      photos.forEach((img, i) => {
        if (!img) { sh.getRange(top + i, PHOTO_COL).setValue('-'); return; }
        try {
          sh.getRange(top + i, PHOTO_COL).setValue(SpreadsheetApp.newCellImage().setSourceUrl(img).setAltTextTitle(rows[i][4] || '写真').build());
        } catch (e) {
          sh.getRange(top + i, PHOTO_COL).setValue('(写真を入れられませんでした)');
        }
      });
      added += rows.length;
    }
    // シートに書けたのを確かめてから、Firebase の控えを消す
    SpreadsheetApp.flush();
    const names = docs.map(doc => doc.name).filter(name => ids.has(name.split('/').pop()));
    if (names.length) {
      request_('documents:commit', { writes: names.map(name => ({ delete: name })) });
      removed += names.length;
    }
    if (cut >= 0 || all.length < 300) break;
  }
  // 同じ瞬間の記録を取りこぼさないよう、少しだけ戻して次回に重ねて読む(ID で重複は防ぐ)
  PropertiesService.getScriptProperties().setProperty('since', String(Math.max(0, since - 60000)));
  console.log(added + ' 件を追加し、' + removed + ' 件を Firebase の private から消しました');
}

/** 期限が過ぎた記録・写真を消す(手で実行してもOK)。シートは消さない */
function cleanup() {
  const now = new Date().toISOString();
  let removed = 0;
  ['thumbs', 'photos', 'scores'].forEach(col => {
    for (let page = 0; page < 20; page++) {
      const names = request_('documents:runQuery', {
        structuredQuery: {
          from: [{ collectionId: col }],
          select: { fields: [{ fieldPath: '__name__' }] }, // 写真の中身は読まない(軽く速く)
          where: { fieldFilter: { field: { fieldPath: 'expireAt' }, op: 'LESS_THAN', value: { timestampValue: now } } },
          limit: 300,
        },
      }).filter(r => r.document).map(r => r.document.name);
      if (!names.length) break;
      request_('documents:commit', { writes: names.map(name => ({ delete: name })) });
      removed += names.length;
      if (names.length < 300) break;
    }
  });
  console.log(removed + ' 件を Firebase から消しました');
}

/** 読み込みの位置を最初に戻す(Firebase に残っている private だけが読み直される。消した分はシートにしか残っていない) */
function resetImport() {
  PropertiesService.getScriptProperties().deleteProperty('since');
}

function query_(since) {
  return request_('documents:runQuery', {
    structuredQuery: {
      from: [{ collectionId: 'private' }],
      where: { fieldFilter: { field: { fieldPath: 'createdAt' }, op: 'GREATER_THAN_OR_EQUAL', value: { integerValue: String(since) } } },
      orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'ASCENDING' }],
      limit: 300,
    },
  }).filter(r => r.document).map(r => r.document);
}

/** お店用の写真(なければランキングの小さい写真)を data URL で返す。どちらもなければ null */
function photo_(id) {
  for (const col of ['photos', 'thumbs']) {
    const res = UrlFetchApp.fetch('https://firestore.googleapis.com/v1/projects/' + PROJECT_ID +
      '/databases/(default)/documents/' + col + '/' + id + '?mask.fieldPaths=img', {
      headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken(), 'x-goog-user-project': PROJECT_ID },
      muteHttpExceptions: true,
    });
    if (res.getResponseCode() !== 200) continue;
    const img = val_((JSON.parse(res.getContentText()).fields || {}).img);
    if (img && /^data:image\/jpeg;base64,/.test(img)) return img;
  }
  return null;
}

function request_(method, body) {
  const url = 'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID +
    '/databases/(default)/' + method;
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
  if (res.getResponseCode() !== 200) throw new Error('Firebase の読み書きに失敗: ' + res.getContentText());
  return JSON.parse(res.getContentText());
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
    sh.setColumnWidth(PHOTO_COL, 110);
    sh.setColumnWidth(4, 200);
  }
  return sh;
}
