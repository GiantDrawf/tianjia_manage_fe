import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Button, message } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { upload } from '@/services/upload';
import {
  UploadFile,
  UploadChangeParam,
  RcFile,
  RcCustomRequestOptions,
} from 'antd/lib/upload/interface';
import { checkRatio } from './utils';
import { UploadProps, UploadResData } from './types';
import './index.less';

/**
 *
 * @param props
 */
export default function Uploader(props: UploadProps) {
  const {
    num = 1,
    maxSize,
    ratio,
    listType = 'picture-card',
    accept = 'image/*',
    uploadTxt = '上传',
    initFileList,
    onChange,
    onInvalid,
    clearErrors,
  } = props;

  const [fileList, setFileList] = useState<Array<UploadFile<UploadResData>>>(() => {
    if (initFileList) {
      return initFileList.split(',').map((itemFile: string) => ({
        uid: itemFile,
        name: itemFile,
        status: 'done',
        url: itemFile,
        size: 200,
        type: '',
        response: {
          data: {
            url: itemFile,
          },
        },
      }));
    }

    return [];
  });

  useEffect(() => {
    if (initFileList) {
      setFileList(
        (initFileList.split(',').map((itemFile: string) => ({
          uid: itemFile,
          name: itemFile,
          status: 'done',
          url: itemFile,
          size: 200,
          type: '',
          response: {
            data: {
              url: itemFile,
            },
          },
        })) as unknown) as Array<UploadFile<UploadResData>>,
      );
    }
  }, [initFileList]);

  const getChangeFile = useCallback(
    (files: UploadFile<UploadResData>[]) => {
      if (onChange) {
        const fileArr: string[] = [];
        files.forEach((file: UploadFile<UploadResData>) => {
          if (file.response) {
            fileArr.push(file.response.data.url);
          }
        });
        onChange(fileArr.join(','));
      }
      clearErrors && clearErrors();
    },
    [onChange, clearErrors],
  );

  function handleChange(info: UploadChangeParam) {
    let { fileList: newFileList } = info;
    // 截取num
    newFileList = newFileList.slice(-num);
    newFileList.forEach((file: UploadFile) => {
      const filename = file.name;
      if (filename && file.response?.data?.url) {
        file.url = file.response.data.url;
        file.thumbUrl = file.response.data.url;
      }
    });
    setFileList(newFileList);
    if (info.file.status === 'done') {
      getChangeFile(newFileList);
    }
  }

  const handleRemove = useCallback(
    (file: UploadFile) => {
      const newFileList = [...fileList].filter((item: UploadFile) => item.uid !== file.uid);
      setFileList(newFileList);
      getChangeFile(newFileList);
    },
    [fileList],
  );

  function checkFile(file: RcFile) {
    if (accept === 'image/*') {
      // 验证图片大小
      if (maxSize && maxSize < file.size) {
        onInvalid && onInvalid(`图片超过最大限制: ${maxSize / 1000}KB以内`);
        message.error(`图片超过最大限制: ${maxSize / 1000}KB以内`);
        return Promise.reject();
      }
      // 验证宽高比
      if (ratio) {
        return checkRatio(file, ratio, onInvalid);
      }
    }

    return true;
  }

  const customRequest = async ({ file, onSuccess, onError }: RcCustomRequestOptions) => {
    const formData = new FormData();
    formData.append('file', file);
    upload(formData)
      .then((res) => {
        if (res && res.code === 200) {
          message.success('上传成功');
          onSuccess(res, file);
          return Promise.resolve();
        }

        return Promise.reject(res?.msg || res?.err || '上传失败');
      })
      .catch((err) => {
        onError(err);
        message.error(err);
      });
  };

  return (
    <Upload
      {...props}
      listType={listType}
      fileList={fileList}
      customRequest={customRequest}
      onChange={handleChange}
      onRemove={handleRemove}
      beforeUpload={checkFile}
    >
      {listType === 'picture-card' ? (
        <div>
          <PlusOutlined />
          <div className="antd-upload-text">{uploadTxt}</div>
        </div>
      ) : listType === 'picture' ? (
        <Button icon={<UploadOutlined />}>{uploadTxt}</Button>
      ) : (
        <Button>{uploadTxt}</Button>
      )}
    </Upload>
  );
}
