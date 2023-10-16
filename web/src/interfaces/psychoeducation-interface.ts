import { EPsychoeducationType } from 'src/variables/enum-variables';
import { TCommonGetListParams, TCommonGetListResponse } from './common-interface';

export type TPsychoEduTopic = {
  id: string;
  name: string;
};

export type TPsychoeducationItemData = {
  id: string;
  title: string;
  type: EPsychoeducationType;
};

export type TGetPsychoeducationTopicsResponse = {
  data: TPsychoEduTopic[];
};

export type TGetPsychoeducationListByTopicParams = TCommonGetListParams & {
  psychoeducationTopicId: string;
};

export type TPsychoeducation = {
  id: string;
  title: string;
  content: string;
  videoLink?: string;
  type: EPsychoeducationType;
  psychoeducationTopicId: string;
  updatedAt: string;
};

export type TGetPsychoeducationListByTopicResponse = TCommonGetListResponse<TPsychoeducation[]>;

export type TGetDetailsPsychoeducationResponse = TPsychoeducation;
