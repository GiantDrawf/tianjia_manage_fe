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
