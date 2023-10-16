import ResponseError from 'src/interfaces/error-response-interface';
import {
  TGetPsychoeducationListByTopicParams,
  TGetPsychoeducationListByTopicResponse,
} from 'src/interfaces/psychoeducation-interface';

export type TGetPsychoeducationListByTopicAction = TGetPsychoeducationListByTopicParams & {
  onSuccess?: (res: TGetPsychoeducationListByTopicResponse) => void;
  onError?: (error: ResponseError) => void;
};
