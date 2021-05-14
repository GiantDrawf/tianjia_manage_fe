/*
 * @Author: zhujian1995@outlook.com
 * @Date: 2021-04-25 22:31:51
 * @LastEditors: zhujian
 * @LastEditTime: 2021-05-14 18:06:54
 * @Description: 你 kin 你擦
 */
import React, { Fragment, useState, useCallback } from 'react';
import { Table, message, Tooltip, Button, Tag, Row } from 'antd';
import { downloadVideosOffline, getAllBillboard, useDouyinVideoList } from '@/services/douyin';
import { GetDouyinVideoParams, DouyinVideoItem, ItemDouyinVideoStatistics } from '@/types/apiTypes';
import { billboardTypesMap, douyinVideoSearchFormItems } from '@/utils/const';
import QueryList, { OnSearch } from '@/components/QueryList';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CheckOutlined, CloseOutlined, CopyOutlined } from '@ant-design/icons';
import { formatDuration } from '@/utils/utils';
import moment from 'moment';
import { Line } from '@ant-design/charts';
import { Link } from 'umi';
import { FormItem } from '@/components/FormRender';

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
    if (searchParam?.create_time?.length) {
      searchParam.create_time = [
        Number(
          moment(searchParam.create_time[0]).startOf('day').valueOf().toString().substr(0, 10),
        ),
        Number(moment(searchParam.create_time[1]).endOf('day').valueOf().toString().substr(0, 10)),
      ];
    }
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
        tag
          .filter((item) => item)
          .map((itemTag, index) => (
            <Tag color="#108ee9" key={index}>
              {itemTag}
            </Tag>
          )),
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
      render: (author: string, record: DouyinVideoItem) => (
        <Link to={{ pathname: '/douyin/users', state: { uid: record.uid } }}>{author}</Link>
      ),
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
      title: '清晰度',
      dataIndex: 'ratio',
      key: 'ratio',
      render: (ratio: string) => ratio || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (create_time: number) => moment(create_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
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
        message.success(res.msg || '离线抓取已开始，请耐心等待...');
      } else {
        message.error(res.msg);
      }
    });
  }, []);

  const handleDownLoadAllData = useCallback(() => {
    downloadVideosOffline()
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
          formItem: douyinVideoSearchFormItems as FormItem[],
          formItemLayout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
          total,
          onSearch,
          plusAction: (
            <Row>
              <Button style={{ marginRight: 10 }} onClick={handleClickGrap}>
                抓取榜单视频及账号
              </Button>
              <Button type="primary" onClick={handleDownLoadAllData}>
                离线下载视频数据
              </Button>
            </Row>
          ),
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
