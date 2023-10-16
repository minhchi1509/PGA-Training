export const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const MOOD_CHART_HEIGHT = 220;
export const NUMBER_MILISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;
import {
  AngryEmotionImage,
  GreatEmotionImage,
  HappyEmotionImage,
  SadEmotionImage,
  UnHappyEmtionImage,
} from '@src/assets/images';
import { TSelectItem } from '@src/interfaces/common-interfaces';
import { EFeeling } from './enum';

export const GENDER_OPTIONS: TSelectItem[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not to say', value: 'not' },
];

export const INPUT_PHONE_NUMBER_MASK = [
  '+',
  '6',
  '1',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  ' ',
  /\d/,
  /\d/,
  /\d/,
  ' ',
  /\d/,
  /\d/,
  /\d/,
];

export const LIMIT_AVATAR_SIZE_MY_PROFILE = 1 * 1024 * 1024;

export const FEELING_LIST = [
  {
    image: AngryEmotionImage,
    value: EFeeling.ANGRY,
  },
  {
    image: SadEmotionImage,
    value: EFeeling.VERY_SAD,
  },
  {
    image: UnHappyEmtionImage,
    value: EFeeling.SAD,
  },
  {
    image: HappyEmotionImage,
    value: EFeeling.HAPPY,
  },
  {
    image: GreatEmotionImage,
    value: EFeeling.SMILE,
  },
];

export const LIMIT_NUMBER_OF_FILES_HOMEWORK = 5;
export const LIMIT_IMAGE_SIZE_HOME_WORK = 5 * 1024 * 1024;
export const LIMIT_VIDEO_SIZE_HOME_WORK = 20 * 1024 * 1024;
