export interface BaseResponse {
  code: number;
  status: string;
  msg: string;
  data: any;
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
