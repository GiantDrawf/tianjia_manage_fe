import { ConnectState } from '@/models/connect';
import { NoticeItem } from '@/types/apiTypes';
import { BellOutlined, CommentOutlined } from '@ant-design/icons';
import { Badge, Button, List, Row, Empty } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, Dispatch, useLocation, history } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface NoticeIconProps extends Partial<ConnectState> {
  dispatch: Dispatch;
  allNotice: NoticeItem[];
}

const GlobalHeaderRight: React.FC<NoticeIconProps> = (props) => {
  const { dispatch, allNotice } = props;
  const [visible, setVisible] = useState(false);
  const count = allNotice.length;

  useEffect(() => {
    // 获取所有未读信息
    dispatch({ type: 'notice/getAllNotice' });
  }, []);

  const { pathname } = useLocation();
  const inNoticePage = pathname.indexOf('/notice') >= 0;

  const goToNoticePage = () => {
    history.push('/notice');
    setVisible(false);
  };

  const renderNoticeItem = () => {
    return (
      <List
        bordered
        locale={{
          emptyText: <Empty description="暂无未读消息~" />,
        }}
        dataSource={allNotice}
        renderItem={(itemNotice: NoticeItem) => (
          <List.Item
            actions={
              inNoticePage
                ? []
                : [
                    <Button onClick={goToNoticePage} type="link">
                      回复
                    </Button>,
                  ]
            }
          >
            <List.Item.Meta
              className={styles.meta}
              avatar={
                <span className={styles.noticeIndex}>
                  <CommentOutlined />
                </span>
              }
              title={itemNotice.title}
              description={
                <div>
                  <div className={styles.description}>{itemNotice.content}</div>
                  <div className={styles.datetime}>{itemNotice.createTime}</div>
                </div>
              }
            />
          </List.Item>
        )}
        footer={
          inNoticePage ? null : (
            <Row justify="center" style={{ marginBottom: 10 }}>
              <Button type="primary" onClick={goToNoticePage}>
                查看全部消息
              </Button>
            </Row>
          )
        }
      />
    );
  };

  return (
    <HeaderDropdown
      placement="bottomRight"
      overlay={renderNoticeItem()}
      overlayClassName={styles.popover}
      trigger={['click']}
      visible={visible}
      onVisibleChange={setVisible}
    >
      <span className={styles.action}>
        <Badge
          count={count}
          style={{
            boxShadow: 'none',
          }}
          className={styles.badge}
        >
          <BellOutlined className={styles.icon} />
        </Badge>
      </span>
    </HeaderDropdown>
  );
};

export default connect(({ notice }: ConnectState) => ({
  allNotice: notice.allNotice,
}))(GlobalHeaderRight);
