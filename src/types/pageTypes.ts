import { NoticeItem } from './apiTypes';

export enum Role {
  'admin',
  'guest',
}

export interface NoticeStateType {
  allNotice: NoticeItem[];
}
