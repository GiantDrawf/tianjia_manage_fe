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
}

export interface ArticleDetail extends BaseResponse {
  data: Article;
}

export interface LocalizationImgRes extends BaseResponse {
  data: {
    [key: string]: string;
  };
}
