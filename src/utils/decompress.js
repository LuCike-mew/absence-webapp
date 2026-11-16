/**
 * Распаковка gzip + url-safe base64.
 * Портировано из оригинального index.html.
 */

export async function decompressGzipB64(compressedB64) {
  if (!compressedB64) return '';

  // url-safe → стандартный base64
  let base64 = compressedB64.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';

  const binaryString = atob(base64);
  const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));

  const cs = new DecompressionStream('gzip');
  const writer = cs.writable.getWriter();
  writer.write(bytes);
  writer.close();

  const decompressedArrayBuffer = await new Response(cs.readable).arrayBuffer();
  return new TextDecoder().decode(decompressedArrayBuffer);
}

/**
 * Парсинг week с автоопределением формата (сырой JSON или gzip+b64).
 */
export async function parseWeekParam(raw, urlVersion) {
  if (!raw) {
    console.warn('[ScheduleApp] Параметр week отсутствует');
    return [];
  }

  const looksLikeJSON = raw.trim().startsWith('[') || raw.trim().startsWith('{');
  const useCompressed = urlVersion >= 11 || !looksLikeJSON;

  if (useCompressed) {
    try {
      const text = await decompressGzipB64(raw);
      const data = JSON.parse(text);
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (e) {
      console.error('[ScheduleApp] Ошибка gzip-распаковки week:', e.message);
    }
  }

  // fallback: сырой JSON
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('[ScheduleApp] Ошибка парсинга week как JSON:', e.message);
    return [];
  }
}

/**
 * Парсинг сжатой истории пропусков.
 * v12+: ID|date|pair_num|subject
 * v11 fallback: date|pair_num|subject (без id)
 */
export async function parseCompressedHistory(compressedB64) {
  if (!compressedB64) return [];

  try {
    const text = await decompressGzipB64(compressedB64);
    const lines = text.split('\n').filter(Boolean);
    return lines.map((line) => {
      const parts = line.split('|');
      if (parts.length >= 4) {
        return {
          id: parseInt(parts[0]),
          date: parts[1],
          pair_num: parseInt(parts[2]),
          subject: parts[3],
        };
      } else {
        return {
          id: null,
          date: parts[0],
          pair_num: parseInt(parts[1]),
          subject: parts[2],
        };
      }
    });
  } catch (e) {
    console.error('[ScheduleApp] Ошибка распаковки истории:', e.message);
    return [];
  }
}

/**
 * Вспомогательные функции для дат.
 */
export function formatDateDDMMYYYY(isoDate) {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
  return isoDate;
}

export function getWeekdayFromISO(isoDate) {
  // 0=Пн … 6=Вс
  const d = new Date(isoDate + 'T00:00:00');
  return (d.getDay() + 6) % 7;
}

/**
 * Разбивает плоский массив дней на группы по неделям (начинающимся с Пн).
 */
export function buildWeekGroups(weekData) {
  const groups = [];
  let currentGroup = [];
  weekData.forEach((day, index) => {
    const wd = getWeekdayFromISO(day.full_date);
    if (wd === 0 && currentGroup.length > 0) {
      groups.push(currentGroup);
      currentGroup = [];
    }
    currentGroup.push(index);
  });
  if (currentGroup.length > 0) groups.push(currentGroup);
  return groups;
}