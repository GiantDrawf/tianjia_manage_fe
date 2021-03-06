/*
 * @Author: zhujian1995@outlook.com
 * @Date: 2021-04-25 22:31:51
 * @LastEditors: zhujian
 * @LastEditTime: 2021-05-14 11:46:56
 * @Description: 你 kin 你擦
 */
import React, { Fragment, useState, useCallback } from 'react';
import { Table, message, Tooltip, Tag, Button } from 'antd';
import { downloadUsersOffline, useDouyinUserList } from '@/services/douyin';
import { GetDouyinUserParams, ItemDouyinVideoStatistics, DouyinUserItem } from '@/types/apiTypes';
import { billboardTypesMap, douyinUserSearchFormItems } from '@/utils/const';
import QueryList, { OnSearch } from '@/components/QueryList';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CheckOutlined, CloseOutlined, CopyOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Line } from '@ant-design/charts';
import { FormItem } from '@/components/FormRender';

/**
 * 抖音热门账号列表
 */
function DouyinUserManagement(props: any) {
  const {
    location: { state = {} },
  } = props;
  const [queryParams, setQueryParams] = useState<GetDouyinUserParams>({
    query: state.uid ? { uid: state.uid } : {},
    pagination: {
      page: 1,
      pageSize: 10,
    },
  });
  const onSearch = useCallback(({ searchParam, pageInfo }: OnSearch) => {
    setQueryParams({
      query: { ...searchParam },
      pagination: {
        page: pageInfo.pageNo,
        pageSize: pageInfo.pageSize || 10,
      },
    });
  }, []);
  const { isValidating: loading, data: listData } = useDouyinUserList(queryParams);
  const dataSource = listData?.data?.list || [];
  const total = listData?.data?.pagination?.total || 0;

  const douyinVideoColumns = [
    {
      title: 'uid',
      dataIndex: 'uid',
      key: 'uid',
      width: 50,
      render: (uid: string) => (
        <CopyToClipboard
          text={uid}
          style={{ color: '#1890ff' }}
          onCopy={() => {
            message.success(`uid ${uid} 已复制到粘贴板`);
          }}
        >
          <CopyOutlined title={`uid ${uid}，点击可复制`} />
        </CopyToClipboard>
      ),
    },
    {
      title: '头像',
      dataIndex: 'author_thumb',
      key: 'author_thumb',
      render: (author_thumb: string) => (
        <img src={author_thumb} style={{ width: 50, height: 50, borderRadius: '50%' }} />
      ),
    },
    {
      title: '昵称',
      dataIndex: 'author_name',
      key: 'author_name',
      render: (author_name: string, record: DouyinUserItem) => (
        <Tooltip title={author_name}>
          <a href={record.link} target="_blank">
            {author_name}
          </a>
        </Tooltip>
      ),
    },
    {
      title: '简介',
      dataIndex: 'signature',
      key: 'signature',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: number) => <Tag>{billboardTypesMap[`${category}`]}</Tag>,
    },
    {
      title: '国籍',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: '跟踪',
      dataIndex: 'isTrack',
      key: 'isTrack',
      render: (isTrack: boolean) =>
        isTrack ? (
          <CheckOutlined style={{ color: 'green' }} />
        ) : (
          <CloseOutlined style={{ color: 'red' }} />
        ),
    },
  ];

  function renderExpandRow(record: DouyinUserItem) {
    // 打平统计数据
    const lineData: { name: string; date: string; value: number }[] = [];
    record.statistics
      .filter((item) => !!item)
      .forEach((itemStatistics: ItemDouyinVideoStatistics) => {
        Object.keys(itemStatistics).forEach((itemDate: string) => {
          Object.keys(itemStatistics[itemDate]).forEach((itemQuota: string) => {
            const date = moment(itemDate.replace('_', ' ')).format('YYYY-MM-DD HH:mm:ss');
            if (
              itemQuota === 'favoriting_count' ||
              itemQuota === 'aweme_count' ||
              itemQuota === 'following_count' ||
              itemQuota === 'total_favorited' ||
              itemQuota === 'follower_count' ||
              itemQuota === 'original_music_count' ||
              itemQuota === 'original_music_used_count'
            ) {
              let name = '粉丝数';
              switch (itemQuota) {
                case 'favoriting_count':
                  name = '喜欢作品数';
                  break;
                case 'aweme_count':
                  name = '作品数';
                  break;
                case 'following_count':
                  name = '关注数';
                  break;
                case 'total_favorited':
                  name = '赞';
                  break;
                case 'original_music_count':
                  name = '原创BGM数';
                  break;
                case 'original_music_used_count':
                  name = '原创BGM使用数';
                  break;
                default:
                  break;
              }
              lineData.push({
                name,
                date,
                value: Number(
                  (itemStatistics[itemDate] && itemStatistics[itemDate][itemQuota]) || 0,
                ),
              });
            }
          });
        });
      });
    const lineConfig = {
      data: lineData,
      xField: 'date',
      yField: 'value',
      seriesField: 'name',
      smooth: true,
      height: 300,
      animation: {
        appear: {
          animation: 'path-in',
          duration: 2000,
        },
      },
    };
    return (
      <div style={{ width: '60%', margin: '0px auto' }}>
        <Line {...lineConfig} />
      </div>
    );
  }

  const handleDownLoadAllData = useCallback(() => {
    downloadUsersOffline()
      .then((res) => {
        if (res && res.code === 200) {
          message.success(res.msg || '离线下载已开始，请耐心等待...');
        } else {
          message.error('下载失败');
        }
      })
      .catch(() => message.error('下载失败'));
  }, []);

  return (
    <Fragment>
      <QueryList
        {...{
          formItem: douyinUserSearchFormItems as FormItem[],
          formItemLayout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
          total,
          onSearch,
          plusAction: (
            <Button type="primary" onClick={handleDownLoadAllData}>
              离线下载账号数据
            </Button>
          ),
        }}
      >
        <Table
          columns={douyinVideoColumns}
          loading={loading}
          dataSource={dataSource}
          rowKey="sec_uid"
          pagination={false}
          expandedRowRender={renderExpandRow}
          expandRowByClick
        />
      </QueryList>
    </Fragment>
  );
}

export default DouyinUserManagement;
