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
}

export interface UploadResData {
  data: { url: string };
}
