import getYouTubeID from 'get-youtube-id';

export const createFormData = <T extends object>(data: T) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((e) => formData.append(key, e));
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};

export const getThumbnailYoutube = (url?: string) => {
  if (url) {
    const youtubeId = getYouTubeID(url);
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }
  return '';
};

export const isVideoFileType = (type: string) => type.includes('video');
export const isImageFileType = (type: string) => type.includes('image');
