import { TPsychoEduTopic, TPsychoeducationItemData } from 'src/interfaces/psychoeducation-interface';
import { EPsychoeducationType } from 'src/variables/enum-variables';

export const mockTopics: TPsychoEduTopic[] = [
  { id: '1', name: 'Anxiety' },
  { id: '2', name: 'Depression' },
  { id: '3', name: 'OCD' },
  { id: '4', name: 'Eating Disorder' },
  { id: '5', name: 'Autism' },
];

export const mockLessons: TPsychoeducationItemData[] = [
  { id: '1', title: 'What is anxiety?', type: EPsychoeducationType.ARTICLES },
  { id: '2', title: 'When might you feel anxious??', type: EPsychoeducationType.ARTICLES },
  { id: '3', title: 'What are the signs and symptoms of anxiety??', type: EPsychoeducationType.ARTICLES },
  { id: '4', title: 'Types of anxiety?', type: EPsychoeducationType.VIDEO },
  { id: '5', title: 'What is an anxiety disorder??', type: EPsychoeducationType.VIDEO },
  {
    id: '6',
    title: 'What to do if you think you’re experiencing an anxiety disorder?',
    type: EPsychoeducationType.ARTICLES,
  },
];
