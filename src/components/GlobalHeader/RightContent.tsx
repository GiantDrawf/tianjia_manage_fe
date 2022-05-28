/*
 * @Author: zhujian1995@outlook.com
 * @Date: 2021-10-29 22:56:15
 * @LastEditors: zhujian
 * @LastEditTime: 2022-05-27 16:40:55
 * @Description: 你 kin 你擦
 */
import { Settings as ProSettings } from '@ant-design/pro-layout';
import React from 'react';
import { connect, ConnectProps, SelectLang, Link, useLocation } from 'umi';
import { ConnectState } from '@/models/connect';
import { EditOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import Notice from './Notice';

export interface GlobalHeaderRightProps extends Partial<ConnectProps>, Partial<ProSettings> {
  theme?: ProSettings['navTheme'] | 'realDark';
  currentAuthority?: string;
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = (props) => {
  const { theme, layout, currentAuthority } = props;
  let className = styles.right;

  const { pathname } = useLocation();
  const inEditArticlePage = pathname.indexOf('/article/edit') >= 0;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      {!inEditArticlePage && currentAuthority && ['admin', 'tianjia'].includes(currentAuthority) ? (
        <Link to="/article/edit">
          <Tooltip title="新建文章">
            <EditOutlined style={{ margin: '0px 10px' }} />
          </Tooltip>
        </Link>
      ) : null}
      {currentAuthority && ['admin', 'tianjia'].includes(currentAuthority) && <Notice />}
      <Avatar />
      <SelectLang className={styles.action} />
    </div>
  );
};

export default connect(({ settings, login }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  currentAuthority: login.currentAuthority,
}))(GlobalHeaderRight);
