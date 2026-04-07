export interface ErrorResponse {
  error: string;
  code?: 'PROFILE_NOT_FOUND' | 'NO_TRANSCRIPT' | 'AUTH_REQUIRED' | 'USAGE_LIMIT_REACHED' | 'USAGE_RESTRICTED';
}

export interface AudioHealthResponse {
  status: string;
}

export interface AudiobookResponse {
  url: string;
  expires_in: number;
}

export interface BillingAccountResponse {
  plan: string;
  expiration: string;
  canceled: boolean;
}

export interface BillingAccountUsageResponse {
  natural_tts_usage: number;
  max_natural_tts_usage: number;
  premium_stt_usage: number;
  max_premium_stt_usage: number;
  premium_audiobooks_usage: number;
  max_premium_audiobooks_usage: number;
}

export interface CancelIndividualSubscriptionResponse {
  success: boolean;
  canceled_plan: string;
  current_expiration: string;
}

export interface CancelSubscriptionResponse {
  success: boolean;
  canceled_plan: string;
  current_expiration: string;
}

export interface ClassroomContentItem {
  id: string;
  title: string;
  preview_text: string;
  content_type: string;
  language: string;
  cefr_level: string;
  topic: string;
  pages: number;
  date_created: string;
  created_at: string;
  audiobook_tier: string;
}

export interface ClassroomListItem {
  classroom_id: string;
  name: string;
  students_count?: number;
}

export interface CreateCheckoutSessionResponse {
  redirect_url: string;
}

export interface CreateIndividualCheckoutSessionResponse {
  redirect_url: string;
}

export interface CreateClassroomRequest {
  name: string;
  students_count?: number;
}

export interface CreateClassroomResponse {
  classroom_id: string;
}

export interface CreateOrganizationResponse {
  organization_id: string;
  teacher_id: string;
}

export interface DeleteClassroomRequest {
  classroom_id: string;
}

export interface DeleteClassroomResponse {
  message: string;
}

export interface EvaluateAnswerRequest {
  question: string;
  answer: string;
  content: string;
  cefr: string;
}

export interface EvaluateAnswerResponse {
  evaluation: string;
  explanation: string;
}

export interface GetClassroomListResponse {
  classrooms: ClassroomListItem[];
}

export interface Dictionary {
  translations?: {
    words?: Record<string, string>;
    sentences?: Record<string, string>;
  };
}

export interface Source {
  title?: string;
  url?: string;
  content?: string;
  score?: number;
}

export interface GetNewsResponse {
  title: string;
  content: string;
  content_type: string;
  language: string;
  cefr_level: string;
  topic: string;
  date_created: string;
  preview_text: string;
  dictionary: Dictionary;
  sources: Source[];
}

export interface GetProfileResponse {
  username: string;
  learning_language: string;
  skill_level: string;
  interested_topics: string[];
  daily_questions_goal?: number;
}

export interface GetQuestionRequest {
  id: string;
  content_type: string;
  cefr_level: string;
  question_type: 'vocab' | 'understanding';
}

export interface GetQuestionResponse {
  question: string;
}

export interface GetStoryPageResponse {
  title: string;
  content: string;
  content_type: string;
  language: string;
  cefr_level: string;
  topic: string;
  date_created: string;
  preview_text: string;
  pages: number;
}

export interface GetStoryQNAContextResponse {
  context: string;
}

export interface GetStudentClassroomResponse {
  teacher_id: string;
  students_count?: number;
}

export interface IncrementProgressResponse {
  user_id: string;
  date: string;
  questions_completed?: number;
  goal_met: boolean;
}

export interface JoinClassroomResponse {
  message: string;
}

export interface JoinOrganizationResponse {
  teacher_id: string;
}

export interface NewsItem {
  id: string;
  title: string;
  preview_text: string;
  language: string;
  cefr_level: string;
  topic: string;
  date_created: string;
  created_at: string;
  audiobook_tier: string;
}

export interface OrganizationResponse {
  organization_id: string;
  teacher_id: string;
  plan: string;
  canceled?: boolean;
  expiration_date?: string;
}

export interface PaymentsResponse {
  success: boolean;
}

export interface AcceptContentRequest {
  classroom_id: string;
  content_id?: number;
  content_type: string;
}

export interface AcceptContentResponse {
  message: string;
}

export interface RejectContentRequest {
  classroom_id: string;
  content_id?: number;
  content_type: string;
}

export interface RejectContentResponse {
  message: string;
}

export interface SpeechToTextRequest {
  audio_content: string;
  language_code: string;
  premium?: boolean;
}

export interface SpeechToTextResponse {
  transcript: string;
}

export interface StoryItem {
  id: string;
  title: string;
  preview_text: string;
  language: string;
  cefr_level: string;
  topic: string;
  date_created: string;
  created_at: string;
  audiobook_tier: string;
}

export interface StreakResponse {
  streak?: number;
  completed_today: boolean;
}

export interface StudentStatusResponse {
  student_id: string;
  classroom_id: string;
  plan?: string;
}

export interface TeacherStatusResponse {
  exists: boolean;
  plan?: string;
}

export interface TextToSpeechRequest {
  text: string;
  language_code: string;
  voice_name: string;
  natural?: boolean;
}

export interface TextToSpeechResponse {
  audio_content: string;
}

export interface TodayProgressResponse {
  user_id: string;
  date: string;
  questions_completed?: number;
  goal_met: boolean;
}

export interface TranslateRequest {
  sentence: string;
  source: string;
  target: string;
}

export interface TranslateResponse {
  sentence?: string;
}

export interface UpdateClassroomRequest {
  classroom_id: string;
  name: string;
}

export interface UpdateClassroomResponse {
  message: string;
}

export interface UpsertProfileRequest {
  username: string;
  learning_language: string;
  skill_level: string;
  interested_topics: string[];
  daily_questions_goal?: number;
}

export interface UpsertProfileResponse {
  message: string;
  id?: number;
}

export interface WebhookResponse {
  received?: boolean;
  type?: string;
}
