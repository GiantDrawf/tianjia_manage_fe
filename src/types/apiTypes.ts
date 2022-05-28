export interface BaseResponse {
  code: number;
  status: string;
  msg: string;
  data: any;
  err?: any;
}

export interface AccountInfo extends BaseResponse {
  data: {
    id?: string;
    token?: string;
    name?: string;
    roles?: string;
  };
}

export interface UserItem {
  name: string;
  role: string;
  password?: string;
}

export interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

export interface UserList extends BaseResponse {
  data: {
    list: UserItem[];
    pagination: Pagination;
  };
}

export interface GetUserListParams {
  query: {
    name?: string;
    role?: string;
  };
  pagination: { page: number; pageSize: number };
}

export interface NoticeItem {
  isRead: boolean;
  isShow: boolean;
  createTime: string;
  msgId: string;
  msgFrom: string;
  title: string;
  content: string;
  name: string;
  contact: string;
  replay: string;
  replayTime: string;
}

export interface AllNotice extends BaseResponse {
  data: NoticeItem[];
}

export interface GetNoticeParams {
  query: { title?: string; content?: string; msgId?: string };
  pagination: { page: number; pageSize: number };
}

export interface Thumbnail {
  url: string;
  width?: number;
  height?: number;
}

export interface Article {
  aid: string;
  title: string;
  summary: string;
  type: string;
  thumbnail: string;
  thumbnails: string[] | Thumbnail[];
  content: string;
  createTime: string;
}

export interface ImportArticle extends Article {
  isTop: boolean;
}

export interface UploadApi extends BaseResponse {
  data: {
    url: string;
  };
}

export interface AllArticle extends BaseResponse {
  data: Article[];
}

export interface GetArticleParams {
  query: {
    aid?: string;
    title?: string;
    content?: string;
    summary?: string;
    type?: string;
    creator?: string;
    updater?: string;
    createTime?: string[];
    updateTime?: string[];
  };
  pagination: { page: number; pageSize: number };
  sort?: { [key: string]: any };
}

export interface ArticleDetail extends BaseResponse {
  data: Article;
}

export interface LocalizationImgRes extends BaseResponse {
  data: {
    [key: string]: string;
  };
}

export interface GetModuleParams {
  query: {
    mid?: string;
    moduleName?: string;
  };
  pagination: { page: number; pageSize: number };
  sort?: { [key: string]: any };
}

export interface CreateModuleTypes {
  mid?: string;
  moduleName: string;
  moduleDesc: string;
  moduleContent: ImportArticle[];
}
export interface ModuleTypes extends CreateModuleTypes {
  mid: string;
  creator: string;
  createTime: string;
  updater: string;
  updateTime: string;
}

export interface AllModule extends BaseResponse {
  data: ModuleTypes[];
}

export interface ModuleDetail extends BaseResponse {
  data: ModuleTypes;
}

export interface GetCheckInListParams {
  query: {
    name?: string;
    telephone?: string;
  };
  pagination: { page: number; pageSize: number };
}

export interface GetDouyinVideoParams {
  query: {
    vid?: string;
    title?: string;
  };
  pagination: { page: number; pageSize: number };
}

export interface GetDouyinUserParams {
  query: {
    uid?: string;
    author_name?: string;
    sec_uid?: string;
    category?: number;
  };
  pagination: { page: number; pageSize: number };
}

export interface CheckInItem {
  _id: string;
  name: string;
  telephone: string;
  numOfPeople: number;
  blessing: string;
  createTime: string;
}
export interface CheckInList extends BaseResponse {
  data: {
    list: CheckInItem[];
    pagination: Pagination;
  };
}

export interface PerformanceTypes extends BaseResponse {
  data: {
    cpuCount: number;
    cpuUsed: number;
    driveUsed: number;
    driveTotal: number;
    memUsed: number;
    memTotal: number;
  };
}

export interface VideoStatistics {
  comment_count: number;
  digg_count: number;
  share_count: number;
}

export interface ItemDouyinVideoStatistics {
  [key: string]: VideoStatistics;
}

export interface DouyinVideoItem {
  img_url: string;
  link: string;
  sec_item_id: number;
  title: string;
  vid: string;
  uid: string;
  duration: number;
  create_time: number;
  city: string;
  statistics: ItemDouyinVideoStatistics[];
  isTrack: boolean;
  ratio: string;
}
export interface DouyinVideoItemList extends BaseResponse {
  data: {
    list: DouyinVideoItem[];
    pagination: Pagination;
  };
}

export interface ItemDouyinUserStatistics {
  [key: string]: VideoStatistics;
}

export interface DouyinUserItem {
  author_thumb: string;
  link: string;
  uid: string;
  sec_uid: string;
  author_name: number;
  signature: string;
  region: string;
  statistics: ItemDouyinUserStatistics[];
  isTrack: boolean;
}
export interface DouyinUserItemList extends BaseResponse {
  data: {
    list: DouyinUserItem[];
    pagination: Pagination;
  };
}

export interface TaskItem {
  taskId?: string;
  taskName?: string;
  taskDesc?: string;
  taskTriggerTime?: string;
  creator?: string;
  createTime?: string;
  updater?: string;
  updateTime?: string;
  isCompleted?: boolean;
}

export interface GetTaskParams {
  query: TaskItem;
  pagination: { page: number; pageSize: number };
  sort?: { [key: string]: any };
}

export interface AllTask extends BaseResponse {
  data: TaskItem[];
}
