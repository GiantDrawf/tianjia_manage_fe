import { Settings as ProSettings } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { connect, ConnectProps, SelectLang, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
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

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
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
