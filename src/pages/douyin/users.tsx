/*
 * @Author: zhujian1995@outlook.com
 * @Date: 2021-04-25 22:31:51
 * @LastEditors: zhujian
 * @LastEditTime: 2021-04-27 14:56:43
 * @Description: 你 kin 你擦
 */
import React, { Fragment, useState, useCallback } from 'react';
import { Table, message } from 'antd';
import { useDouyinUserList } from '@/services/douyin';
import { GetDouyinUserParams, ItemDouyinVideoStatistics, DouyinUserItem } from '@/types/apiTypes';
import { douyinUserSearchFormItems } from '@/utils/const';
import QueryList, { OnSearch } from '@/components/QueryList';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Line } from '@ant-design/charts';

/**
 * 抖音热门账号列表
 */
function DouyinVideoManagement() {
  const [queryParams, setQueryParams] = useState<GetDouyinUserParams>({
    query: {},
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
      title: 'id',
      dataIndex: 'sec_uid',
      key: 'sec_uid',
      width: 50,
      render: (sec_uid: string) => (
        <CopyToClipboard
          text={sec_uid}
          style={{ color: '#1890ff' }}
          onCopy={() => {
            message.success('id已复制到粘贴板');
          }}
        >
          <CopyOutlined title={`sec_uid ${sec_uid}，点击可复制`} />
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
      title: '账号名',
      dataIndex: 'author_name',
      key: 'author_name',
    },
    {
      title: '简介',
      dataIndex: 'signature',
      key: 'signature',
    },
    {
      title: '国籍',
      dataIndex: 'region',
      key: 'region',
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
              itemQuota === 'follower_count'
            ) {
              lineData.push({
                name:
                  itemQuota === 'favoriting_count'
                    ? '喜欢作品数'
                    : itemQuota === 'aweme_count'
                    ? '作品数'
                    : itemQuota === 'following_count'
                    ? '关注数'
                    : itemQuota === 'total_favorited'
                    ? '赞'
                    : '粉丝数',
                date,
                value: Number(
                  (itemStatistics[itemDate] && itemStatistics[itemDate][itemQuota]) || 0,
                ),
              });
            } else if (itemQuota === 'original_musician') {
              lineData.push({
                name: '原创音乐数',
                date,
                value:
                  (itemStatistics['original_musician'] &&
                    itemStatistics['original_musician']['music_count']) ||
                  0,
              });
              lineData.push({
                name: '原创音乐被引用数',
                date,
                value:
                  (itemStatistics['original_musician'] &&
                    itemStatistics['original_musician']['music_used_count']) ||
                  0,
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

  return (
    <Fragment>
      <QueryList
        {...{
          formItem: douyinUserSearchFormItems,
          total,
          onSearch,
        }}
      >
        <Table
          columns={douyinVideoColumns}
          loading={loading}
          dataSource={dataSource}
          rowKey="vid"
          pagination={false}
          expandedRowRender={renderExpandRow}
        />
      </QueryList>
    </Fragment>
  );
}

export default DouyinVideoManagement;
