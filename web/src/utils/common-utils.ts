import { RcFile } from 'antd/es/upload';
import { Buffer } from 'buffer';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import getYouTubeID from 'get-youtube-id';

import { TDownloadClientFileRequest, TDownloadHomeworkHistoryFileRequest } from 'src/interfaces/common-interface';
import { TDownloadFileManagementRequest } from 'src/interfaces/files-interface';
import { AppThunkDispatch } from 'src/stores';
import { downloadClientFileAction, downloadHomeworkFileAction } from 'src/stores/clients';
import { downloadFileManagementAction } from 'src/stores/files';
import { EProfileStatus } from 'src/variables/common';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(objectSupport);

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const capitalizeFirstLetter = (input: string, isShowDischarge?: boolean) => {
  if (!input) return '';
  if (input === EProfileStatus.INACTIVE && isShowDischarge) {
    return 'Discharged';
  }

  input = input.toLowerCase();
  return input.charAt(0).toUpperCase() + input.slice(1);
};

export const decodeTokenInvitePractitioner = (token: string) => {
  const tokenDecoded = Buffer.from(token, 'base64').toString('utf-8');
  const result: { [key: string]: string } = {};
  tokenDecoded.split(',').forEach((item) => {
    const itemDecoded = decodeURI(item);
    const delimiterIdx = itemDecoded.indexOf('=');
    const key = itemDecoded.slice(0, delimiterIdx);
    const value = itemDecoded.slice(delimiterIdx + 1);
    result[key] = value;
  });

  return result;
};

export const asyncDelay = (ms: number | undefined) => new Promise((resole) => setTimeout(resole, ms));

export const getThumbnailYoutube = (url: string) => {
  if (url) {
    const youtubeId = getYouTubeID(url);
    return `http://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }

  return '';
};

export const convertReminderTimeToDate = (time: string) => {
  const [hour, minute] = time.split(':').length < 2 ? [0, 0] : time.split(':');

  return dayjs({ hour, minute });
};

export const getCurrentTimezone = () => {
  return dayjs.tz.guess();
};

export const formatCardNumber = (last4: string) => {
  return `**** **** **** ${last4}`;
};

export const convertHtmlTextToPlain = (text: string) => {
  if (!text) return '';

  return text.replace(/<[^>]+>/g, '');
};

export const getFileFromPath = (path: string): string => {
  if (path) {
    const pathArr = path.split('/');
    return pathArr[pathArr.length - 1];
  }

  return path;
};

export const saveFileAs = (url: string, fileName?: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName ?? '');
  document.body.appendChild(link);
  link.click();
  link?.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadHomeworkFile = async (data: TDownloadHomeworkHistoryFileRequest, dispatch: AppThunkDispatch) => {
  const { fileName, ...payload } = data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await dispatch(downloadHomeworkFileAction(payload));

  const url = window.URL.createObjectURL(new Blob([response.payload]));
  saveFileAs(url, fileName);
};

export const downloadClientFile = async (data: TDownloadClientFileRequest, dispatch: AppThunkDispatch) => {
  const { fileName, fileExtension, ...payload } = data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await dispatch(downloadClientFileAction(payload));
  const url = window.URL.createObjectURL(new Blob([response.payload]));
  saveFileAs(url, `${fileName}.${fileExtension}`);
};

export const downloadFileManagement = async (data: TDownloadFileManagementRequest, dispatch: AppThunkDispatch) => {
  const { fileName, fileExtension, ...payload } = data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await dispatch(downloadFileManagementAction(payload));
  const url = window.URL.createObjectURL(new Blob([response.payload]));
  saveFileAs(url, `${fileName}.${fileExtension}`);
};

export const truncateString = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;

  return value.substring(0, maxLength) + '...';
};

export const getDayName = (date: string): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const index = dayjs(date).day();
  return days[index];
};

export const formatConversationTime = (time: string) => {
  if (dayjs().isSame(dayjs(time), 'day')) {
    return dayjs(time).format('hh:mm A');
  }

  if (dayjs().isSame(dayjs(time), 'week')) {
    return getDayName(time);
  }

  if (dayjs().isSame(dayjs(time), 'year')) {
    return dayjs(time).format('MMM DD');
  }

  return dayjs(time).format('MMM DD YYYY');
};

export const formatMessageTimeLine = (time: string) => {
  if (dayjs().isSame(dayjs(time), 'day')) {
    return `${dayjs(time).format('hh:mm A')}, today`;
  }

  if (dayjs().isSame(dayjs(time), 'week')) {
    return `${getDayName(time)} ${dayjs(time).format('hh:mm A')}`;
  }

  return dayjs(time).format('HH:mm, DD/MM/YYYY');
};

export const formatDistanceToNow = (from: string) => {
  const diffSeconds = dayjs(new Date()).diff(from, 'seconds');
  const diffMinutes = dayjs(new Date()).diff(from, 'minutes');
  const diffHours = dayjs(new Date()).diff(from, 'hours');
  const diffDays = dayjs(new Date()).diff(from, 'days');

  if (diffSeconds < 60) {
    return `${diffSeconds}s`;
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }
  if (diffHours < 24) {
    return `${diffHours}h`;
  }
  if (diffDays < 7) {
    return `${diffDays}d`;
  }
  if (diffDays > 7) {
    return dayjs(from).format('MMM DD');
  }
  return '';
};

export const validateFileType = (fileType: string, acceptedFileType: { [key: number | string]: string }): boolean => {
  const acceptedFileTypeArr = Object.values(acceptedFileType);
  return acceptedFileTypeArr.some((type) => fileType.includes(type));
};

export const validateSizeImage = (fileSize: number, maxSize = 1): boolean => {
  // unit is MB, default maxSize is 1MB
  const formattedFileSize = fileSize / 1024 / 1024;
  const isValidFileSize = formattedFileSize < maxSize;
  return isValidFileSize;
};

export const formatFileSize = (fileSizeInBytes: number): string => {
  if (fileSizeInBytes < 1024) {
    return fileSizeInBytes + ' B';
  } else if (fileSizeInBytes < 1024 * 1024) {
    return (fileSizeInBytes / 1024).toFixed(1) + ' KB';
  } else if (fileSizeInBytes < 1024 * 1024 * 1024) {
    return (fileSizeInBytes / (1024 * 1024)).toFixed(1) + ' MB';
  } else {
    return (fileSizeInBytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }
};

export const getTimeToDay = (date: string) => {
  let getTime = dayjs(date).tz().format('MMM D');
  const today = dayjs();
  const yesterday = dayjs().set('date', today.get('date') - 1);
  const beforeYesterday = dayjs().set('date', today.get('date') - 2);

  if (today.isSame(date, 'day')) {
    getTime = dayjs(date).tz().format('HH:mm');
  }
  if (yesterday.isSame(date, 'day') || beforeYesterday.isSame(date, 'day')) {
    getTime = getDayName(date);
  }

  return getTime;
};

export const randomColor = () => {
  return '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0');
};
