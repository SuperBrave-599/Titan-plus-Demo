import { checkType } from '@/utils';
import { formatTime as fmtTime } from '@/utils/time-utils';
import i18n from '@/lang';

export function formatTime(time, format) {
  if (!time) return;

  if (checkType(time) === 'number' && (time + '').length === 10) {
    time = +time * 1000;
  }

  return fmtTime(time, format);
}

export function formatTimeFromNow(time, format) {
  if (!time) return;

  if (checkType(time) === 'number' && (time + '').length === 10) {
    time = +time * 1000;
  }

  const d = new Date(time);
  const now = Date.now();
  const diff = (now - d) / 1000;

  if (diff < 60) {
    return i18n.t('unit["刚刚"]');
  } else if (diff < 3600) {
    // less 1 hour
    return Math.floor(diff / 60) + i18n.t('unit["分钟前"]');
  } else if (diff < 3600 * 24) {
    return Math.floor(diff / 3600) + i18n.t('unit["小时前"]');
  } else if (diff < 3600 * 24 * 7) {
    return Math.floor(diff / (3600 * 24)) + i18n.t('unit["天前"]');
  } else if (diff < 3600 * 24 * 7 * 5) {
    return Math.floor(diff / (3600 * 24 * 7)) + i18n.t('unit["周前"]');
  } else if (diff < 3600 * 24 * 30 * 13) {
    return Math.floor(diff / (3600 * 24 * 30)) + i18n.t('unit["个月前"]');
  }

  return fmtTime(time, format);
}
