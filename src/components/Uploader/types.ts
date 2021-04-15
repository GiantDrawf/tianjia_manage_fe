/*
 * @Author: zhujian1995@outlook.com
 * @Date: 2020-11-09 14:12:08
 * @LastEditors: zhujian
 * @LastEditTime: 2021-04-15 17:50:27
 * @Description: 你 kin 你擦
 */
import { UploadListType } from 'antd/es/upload/interface';

export interface UploadProps {
  num?: number;
  maxSize?: number;
  ratio?: number;
  listType?: UploadListType;
  accept?: string;
  uploadTxt?: string;
  initFileList?: string;
  onChange?: (files: string) => void;
  onInvalid?: (errString: string) => void;
  clearErrors?: () => void;
}

export interface UploadResData {
  data: { url: string };
}
