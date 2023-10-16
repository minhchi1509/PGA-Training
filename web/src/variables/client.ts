import { EHomeworkType } from 'src/interfaces/clients-interface';

export const HOMEWORK_TOPICS_TYPES = [
  EHomeworkType.ACTIVITIES,
  EHomeworkType.QUESTIONNAIRES,
  EHomeworkType.WRITTEN_TASKS,
  EHomeworkType.VIDEOS,
];

export const HOMEWORK_TYPE_LABEL = {
  [EHomeworkType.ACTIVITIES]: 'Activities',
  [EHomeworkType.QUESTIONNAIRES]: 'Questionnaires',
  [EHomeworkType.WRITTEN_TASKS]: 'Written Tasks',
  [EHomeworkType.VIDEOS]: 'Videos',
};

export const SEPARATE_TYPE_HOMEWORK = [EHomeworkType.ACTIVITIES, EHomeworkType.WRITTEN_TASKS];
