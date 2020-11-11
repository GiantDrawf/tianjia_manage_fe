import { Settings as ProSettings } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { connect, ConnectProps, SelectLang, Dispatch, Link, useLocation } from 'umi';
import { ConnectState } from '@/models/connect';
import { EditOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import Notice from './Notice';

export interface GlobalHeaderRightProps extends Partial<ConnectProps>, Partial<ProSettings> {
  theme?: ProSettings['navTheme'] | 'realDark';
  dispatch: Dispatch;
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = (props) => {
  const { theme, layout, dispatch } = props;
  let className = styles.right;

  useEffect(() => {
    // 获取所有
    dispatch({ type: 'notice/getAllNotice' });
  }, []);

  const { pathname } = useLocation();
  const inEditArticlePage = pathname.indexOf('/article/edit') >= 0;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      {inEditArticlePage ? null : (
        <Link to="/article/edit">
          <Tooltip title="新建文章">
            <EditOutlined style={{ margin: '0px 10px' }} />
          </Tooltip>
        </Link>
      )}
      <Notice />
      <Avatar />
      <SelectLang className={styles.action} />
    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
