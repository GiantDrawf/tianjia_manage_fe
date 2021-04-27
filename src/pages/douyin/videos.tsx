/*
 * @Author: zhujian1995@outlook.com
 * @Date: 2021-04-25 22:31:51
 * @LastEditors: zhujian
 * @LastEditTime: 2021-04-27 17:36:55
 * @Description: 你 kin 你擦
 */
import React, { Fragment, useState, useCallback } from 'react';
import { Table, message, Tooltip, Button, Tag } from 'antd';
import { getAllBillboard, useDouyinVideoList } from '@/services/douyin';
import { GetDouyinVideoParams, DouyinVideoItem, ItemDouyinVideoStatistics } from '@/types/apiTypes';
import { billboardTypesMap, douyinVideoSearchFormItems } from '@/utils/const';
import QueryList, { OnSearch } from '@/components/QueryList';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';
import { formatDuration } from '@/utils/utils';
import moment from 'moment';
import { Line } from '@ant-design/charts';

/**
 * 抖音热门视频列表
 */
function DouyinVideoManagement() {
  const [queryParams, setQueryParams] = useState<GetDouyinVideoParams>({
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
  const { isValidating: loading, data: listData } = useDouyinVideoList(queryParams);
  const dataSource = listData?.data?.list || [];
  const total = listData?.data?.pagination?.total || 0;

  const douyinVideoColumns = [
    {
      title: 'id',
      dataIndex: 'vid',
      key: 'vid',
      width: 50,
      render: (vid: string) => (
        <CopyToClipboard
          text={vid}
          style={{ color: '#1890ff' }}
          onCopy={() => {
            message.success('id已复制到粘贴板');
          }}
        >
          <CopyOutlined title={`id ${vid}，点击可复制`} />
        </CopyToClipboard>
      ),
    },
    {
      title: '封面',
      dataIndex: 'img_url',
      key: 'img_url',
      render: (img_url: string) => <img src={img_url} height={100} />,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: DouyinVideoItem) => (
        <Tooltip title={title}>
          <a href={record.link} target="_blank">
            {title || `无标题 ${record.vid}`}
          </a>
        </Tooltip>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tag',
      key: 'tag',
      render: (tag: string[]) =>
        tag.filter((item) => item).map((itemTag) => <Tag color="#108ee9">{itemTag}</Tag>),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: number) => <Tag>{billboardTypesMap[`${category}`]}</Tag>,
    },
    {
      title: '视频作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '背景音乐作者',
      dataIndex: 'music_author',
      key: 'music_author',
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      render: formatDuration,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (create_time: number) => moment(create_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  function renderExpandRow(record: DouyinVideoItem) {
    // 打平统计数据
    const lineData: { name: string; date: string; value: number }[] = [];
    record.statistics.forEach((itemStatistics: ItemDouyinVideoStatistics) => {
      Object.keys(itemStatistics).forEach((itemDate: string) => {
        Object.keys(itemStatistics[itemDate]).forEach((itemQuota: string) => {
          if (
            itemQuota === 'comment_count' ||
            itemQuota === 'digg_count' ||
            itemQuota === 'share_count'
          ) {
            lineData.push({
              name:
                itemQuota === 'comment_count'
                  ? '评论数'
                  : itemQuota === 'digg_count'
                  ? '点赞数'
                  : '分享数',
              date: moment(itemDate.replace('_', ' ')).format('YYYY-MM-DD HH:mm:ss'),
              value: itemStatistics[itemDate][itemQuota],
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

  const handleClickGrap = useCallback(() => {
    getAllBillboard().then((res) => {
      if (res && res.code === 200) {
        message.success(res.data);
      } else {
        message.error(res.msg);
      }
    });
  }, []);

  return (
    <Fragment>
      <QueryList
        {...{
          formItem: douyinVideoSearchFormItems,
          total,
          onSearch,
          plusAction: <Button onClick={handleClickGrap}>抓取</Button>,
        }}
      >
        <Table
          columns={douyinVideoColumns}
          loading={loading}
          dataSource={dataSource}
          rowKey="vid"
          pagination={false}
          expandedRowRender={renderExpandRow}
          expandRowByClick
        />
      </QueryList>
    </Fragment>
  );
}

export default DouyinVideoManagement;