export type TGetHomeworkAssignBody = {
  dateRange: [string, string];
  timezone: string;
};

export type THomeworkAssign = {
  id: string;
  startDate: string;
  endDate: string;
  homeworkId: string;
  homeworkDescription: string;
  homeworkTitle: string;
  homeworkType: string;
};

export type THomeworkAssignData = {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  homeworkAssign: THomeworkAssign[];
};

export type TGetHomeworkAssignResponse = {
  data: THomeworkAssignData[];
};

export type THomeworkDetailItem = {
  id: string;
  type: string;
  title?: string;
  description?: string;
  question?: string;
  questionType?: string;
  options?: any;
  photoTitle?: string;
  photoUri?: string;
  required: boolean;
  index: number;
};

export type THomeworkDetail = {
  id: string;
  homeWorkId: string;
  title: string;
  description: string;
  type: string;
  videoLink?: string;
  items?: THomeworkDetailItem[];
};

export type TGetHomeworkAssignDetailResponse = {
  id: string;
  homeworkId: string;
  startDate: string;
  endDate: string;
  homework: THomeworkDetail;
  isHomeworkDone: boolean;
  isHomeworkAvailableToday: boolean;
};

export type TAnswerQuestion = {
  questionId: string;
  answerChoices: string[];
  answerText: string;
};

export type TClientResponse = {
  responseText: string;
  answerQuestion: TAnswerQuestion[];
};

export type TSubmitHomeworkAssignRequest = {
  isRejected: boolean;
  rejectReason?: string;
  clientResponse?: TClientResponse;
  feedback?: string;
  rate?: number;
  images?: TFileDetailResponse[];
  homeworkDate?: string;
  timezone: string;
};

export type TDoActivityAndWrittenTaskForm = {
  rate?: number;
  response: string;
  comment: string;
};

export type THomeworkFeedbackForm = {
  rate?: number;
  comment: string;
};

export type TFileDetailResponse = {
  id: string;
  url: string;
  fileType: string;
  originalName: string;
};

export type TUploadHomeworkFilesResponse = {
  url: TFileDetailResponse[];
};
