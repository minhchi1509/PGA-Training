import { EHomeworkType } from './clients-interface';
import { TCommonGetListParams, TCommonGetListResponse } from './common-interface';

export type TGetHomeworkTopicsParams = TCommonGetListParams & {
  homeworkType?: EHomeworkType;
};

export type THomeworkTopic = {
  id: string;
  createdAt: string;
  updateAt: string;
  name: string;
  homeworkType: EHomeworkType;
};

export type TGetHomeworkTopicsResponse = TCommonGetListResponse<THomeworkTopic[]>;
