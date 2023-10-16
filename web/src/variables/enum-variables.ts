export enum EUserType {
  CLINIC_OWNER = 'CLINIC',
  SOLO_PRACTITIONER = 'SOLO',
  OWNER = 'OWNER',
  PRACTITIONER = 'PRACTITIONER',
}

export enum EUserTypeDisplay {
  CLINIC_OWNER = 'clinic-owner',
  SOLO_PRACTITIONER = 'solo-practitioner',
  PRACTITIONER = 'invite-practitioner',
}

export enum EReft {
  SIGN_IN = 'login',
}

export enum EFrequencyType {
  CUSTOM = 'CUSTOM',
  ASSIGN_ONE = 'ASSIGN_ONE',
}

export enum ERepeatDurationType {
  DAY = 'DAY',
  WEEK = 'WEEK',
}

export enum EDayOfWeek {
  MON = 'MON',
  TUE = 'TUE',
  WED = 'WED',
  THU = 'THU',
  FRI = 'FRI',
  SAT = 'SAT',
  SUN = 'SUN',
}

export enum EDisplayDayOfWeek {
  MON = 'Monday',
  TUE = 'Tuesday',
  WED = 'Wednesday',
  THU = 'Thursday',
  FRI = 'Friday',
  SAT = 'Saturday',
  SUN = 'Sunday',
}

export enum ETimePeriod {
  AM = 'AM',
  PM = 'PM',
}

export enum EHomeworkStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  ARCHIVED = 'ARCHIVED',
}

export enum EHomeworkResultStatus {
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  SKIPPED = 'SKIPPED',
}

export enum ESortType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum EClientFileSortBy {
  NAME = 'name',
  CREATED_AT = 'createdAt',
}

export enum EQuestionViewType {
  FORM_HEADER = 'FORM_HEADER',
  QUESTION = 'QUESTION',
  PHOTO = 'PHOTO',
}

export enum EQuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTI_CHOICE = 'MULTI_CHOICE',
  SHORT_ANSWER = 'SHORT_ANSWER',
}

export enum EPaymentStatus {
  CANCELED = 'CANCELED',
  ACTIVE = 'ACTIVE',
  TRIALING = 'TRIALING',
}

export enum ECardBrand {
  AMERICAN_EXPRESS = 'amex',
  JCB = 'jcb',
  VISA = 'visa',
  DISCOVER = 'discover',
  MASTER_CARD = 'mastercard',
  UNIONPAY = 'unionpay',
  DINERS = 'diners',
  EFTPOS_AU = 'eftpos_au',
}

export const ECardBrandName = {
  [ECardBrand.AMERICAN_EXPRESS]: 'American Express',
  [ECardBrand.DISCOVER]: 'Discover',
  [ECardBrand.MASTER_CARD]: 'Master Card',
  [ECardBrand.VISA]: 'Visa',
  [ECardBrand.JCB]: 'JCB',
  [ECardBrand.UNIONPAY]: 'Unionpay',
  [ECardBrand.DINERS]: 'Diners',
  [ECardBrand.EFTPOS_AU]: 'Eftpos Au',
};

export enum ETaskType {
  GENERAL_TASK = 'general',
  OWNER = 'owner',
}

export enum EFileType {
  VIDEO = 'video',
  IMAGE = 'image',
}

export enum EVerifyPractitionerErrorType {
  EXISTED = 'accountExisted',
  DELETED = 'accountDeleted',
}

export enum EChatMemberType {
  OWNER = 'OWNER',
  CLIENT = 'CLIENT',
  SOLO = 'SOLO',
  PRACTITIONER = 'PRACTITIONER',
}

export enum ETimePeriodTracker {
  SEVEN_DAY = 'seven_day',
  MONTH = 'month',
  CUSTOM = 'custom',
}

export enum EDASS_HOMEWORK {
  DASS21 = 'DASS-21',
  DASS42 = 'DASS-42',
}

export enum EAcceptedClientFileType {
  JPG = 'jpg',
  JPEG = 'jpeg',
  DOCX = 'docx',
  DOC = 'doc',
  XLSX = 'xlsx',
  PDF = 'pdf',
  PNG = 'png',
  CSV = 'csv',
  FIREFOX_CSV = 'application/vnd.ms-excel',
}

export enum EAcceptedMessageFileType {
  JPG = 'jpg',
  JPEG = 'jpeg',
  XLSX = 'xlsx',
  PNG = 'png',
  CSV = 'csv',
  FIREFOX_CSV = 'application/vnd.ms-excel',
  XLS = 'xls',
  MOV = 'video/quicktime',
  MP4 = 'mp4',
  EXCEL = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

export enum EAcceptedFileManagementType {
  JPG = 'jpg',
  JPEG = 'jpeg',
  DOCX = 'docx',
  DOC = 'doc',
  XLSX = 'xlsx',
  PDF = 'pdf',
  PNG = 'png',
  CSV = 'csv',
  FIREFOX_CSV = 'application/vnd.ms-excel',
  MOV = 'video/quicktime',
  MP4 = 'mp4',
}

export enum EPsychoeducationType {
  VIDEO = 'VIDEO',
  ARTICLES = 'ARTICLE',
}

export enum FileMode {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
}

export enum FileType {
  FILE = 'FILE',
  FOLDER = 'FOLDER',
}

export enum ENotificationTriggerType {
  NEW_MESSAGE = 'NEW_MESSAGE',
  PRACTITIONER_ACCEPT_INVITE = 'PRACTITIONER_ACCEPT_INVITE',
  CLIENT_ACCEPT_INVITE = 'CLIENT_ACCEPT_INVITE',
  REMIND_DO_HOMEWORK = 'REMIND_DO_HOMEWORK',
  CLIENT_REALLOCATE = 'CLIENT_REALLOCATE',
  HOMEWORK_COMPLETED = 'HOMEWORK_COMPLETED',
  HOMEWORK_REMINDER = 'HOMEWORK_REMINDER',
}

export enum EProfileNotificationSetting {
  NEW_MESSAGE = 'newMessage',
  PRACTITIONER_ACCEPTS_INVITATION = 'pratitionerAcceptInvitation',
  CLIENT_ACCEPTS_INVITATION = 'clientAcceptInvitation',
  CLIENT_COMPLETES_TASK = 'clientCompleteTask',
  CLIENT_RELOCATED = 'clientRelocated',
}

export enum ENotificationSettingStatus {
  TURN_ON = 'TURN_ON',
  TURN_OFF = 'TURN_OFF',
}

export enum EAcceptedContactHelpFileType {
  MSWORD = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  EXCEL = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PDF = 'application/pdf',
  CSV = 'text/csv',
  VIDEO = 'video/mp4',
  MOV = 'video/quicktime',
  JPG = 'image/jpg',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
}

export enum EMessageError {
  CLIENT_NOT_FOUND = 'Client not found',
}
