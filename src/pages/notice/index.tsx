import React, { useCallback, useState, FC, Fragment } from 'react';
import { connect } from 'umi';
import { message, Table, Divider, Row, Switch, Tooltip, Descriptions } from 'antd';
import QueryList, { OnSearch } from '@/components/QueryList';
import { changeNoticeShow, readMsg, useNoticeList } from '@/services/notice';
import { noticeSearchFormItems } from '@/utils/const';
import { BaseResponse, GetNoticeParams, NoticeItem } from '@/types/apiTypes';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { BulbOutlined, CopyOutlined, EditOutlined } from '@ant-design/icons';
import styles from './index.less';
import ReplayModal from './replayModal';

interface NoticeProps {
  dispatch: Function;
}

/**
 * 消息管理页面
 */
const Notice: FC<NoticeProps> = (props: NoticeProps) => {
  const { dispatch } = props;
  const [queryParams, setQueryParams] = useState<GetNoticeParams>({
    query: {},
    pagination: {
      page: 1,
      pageSize: 10,
    },
  });
  const [replayModalShow, setReplayModalShow] = useState<boolean>(false);
  const [replayNoticeRecord, setReplayNoticeRecord] = useState<NoticeItem | null>(null);
  const onSearch = useCallback(({ searchParam, pageInfo }: OnSearch) => {
    setQueryParams({
      query: { ...searchParam },
      pagination: {
        page: pageInfo.pageNo,
        pageSize: pageInfo.pageSize || 10,
      },
    });
  }, []);
  const { isValidating: loading, data: listData, mutate: refreshList } = useNoticeList(queryParams);
  const dataSource = listData?.data?.list || [];
  const total = listData?.data?.pagination?.total || 0;

  /**
   * 重置消息
   */
  const resetNotices = useCallback(() => {
    // 刷新列表
    refreshList();
    // 重置全局消息
    dispatch({ type: 'notice/getAllNotice' });
  }, []);

  const handleNoticeShow = (isShow: boolean, msgId: string) => {
    changeNoticeShow({ msgId, isShow })
      .then((res: BaseResponse) => {
        if (res.code === 200) {
          message.success('更改成功');
          resetNotices();
        } else {
          message.error('操作失败，请联系系统管理员');
        }
      })
      .catch((err: any) => message.error(err));
  };

  const handleReplayModalShow = (modalShow: boolean, record: NoticeItem | null = null) => {
    setReplayModalShow(modalShow);
    setReplayNoticeRecord(record);
  };

  const handleReadNotice = (msgId: string) => {
    readMsg(msgId).finally(() => resetNotices());
  };

  const noticeColumns = [
    {
      title: 'Id',
      dataIndex: 'msgId',
      key: 'msgId',
      render: (msgId: string) => (
        <CopyToClipboard
          text={msgId}
          style={{ color: '#1890ff' }}
          onCopy={() => {
            message.success('id已复制到粘贴板');
          }}
        >
          <CopyOutlined title={`id ${msgId}，点击可复制`} />
        </CopyToClipboard>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      key: 'content',
      render: (content: string) => (
        <Row className={styles.contentColumn}>
          <Tooltip title={content}>{content}</Tooltip>
        </Row>
      ),
    },
    {
      title: '回复',
      dataIndex: 'replay',
      key: 'replay',
      render: (replay: string) => replay || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '回复时间',
      dataIndex: 'replayTime',
      key: 'replayTime',
      render: (replayTime: string) => replayTime || '-',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, record: NoticeItem) => (
        <Row align="middle">
          <Tooltip title="编辑回复">
            <EditOutlined
              onClick={(e) => {
                e.stopPropagation();
                handleReplayModalShow(true, record);
              }}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="是否展示在官网">
            <Switch
              checkedChildren="显示"
              unCheckedChildren="隐藏"
              checked={record.isShow}
              onChange={(checked: boolean, e) => {
                e.stopPropagation();
                handleNoticeShow(checked, record.msgId);
              }}
            />
          </Tooltip>
          {!record.isRead ? (
            <Fragment>
              <Divider type="vertical" />
              <Tooltip title="设置为已读">
                <BulbOutlined
                  style={{ color: 'green' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReadNotice(record.msgId);
                  }}
                />
              </Tooltip>
            </Fragment>
          ) : null}
        </Row>
      ),
    },
  ];

  return (
    <Fragment>
      <QueryList
        {...{
          formItem: noticeSearchFormItems,
          total,
          onSearch,
        }}
      >
        <Table
          locale={{ emptyText: '暂无消息' }}
          columns={noticeColumns}
          loading={loading}
          dataSource={dataSource}
          rowKey="msgId"
          pagination={false}
          rowClassName={(record: NoticeItem) => (!record.isRead ? styles.noReadLine : '')}
          expandable={{
            expandedRowRender: (record: NoticeItem) => (
              <Descriptions
                title="用户信息"
                bordered
                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
              >
                <Descriptions.Item label="姓名">{record.name}</Descriptions.Item>
                <Descriptions.Item label="联系方式">{record.contact}</Descriptions.Item>
              </Descriptions>
            ),
            rowExpandable: (record: NoticeItem) => !!record.name,
            expandRowByClick: true,
            expandedRowClassName: () => styles.expandedRow,
          }}
        />
      </QueryList>
      {replayModalShow ? (
        <ReplayModal
          visible={replayModalShow}
          onClose={() => handleReplayModalShow(false)}
          refreshList={resetNotices}
          noticeRecord={replayNoticeRecord}
        />
      ) : null}
    </Fragment>
  );
};

export default connect()(Notice);
