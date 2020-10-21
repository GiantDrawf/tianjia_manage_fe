import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect, ConnectProps, Dispatch } from 'umi';
import { stringify } from 'querystring';
import cookies from '@/utils/cookie';
import { ConnectState } from '@/models/connect';

interface SecurityLayoutProps extends ConnectProps {
  username: string;
  dispatch: Dispatch;
}

interface SecurityLayoutState {
  isReady: boolean;
}

const { tokenKey } = process['CONFIG'];

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    const { dispatch, username } = this.props;

    // 请求用户角色，填充用户信息
    if (cookies.get(tokenKey) && !username) {
      dispatch({
        type: 'login/getRole',
        payload: cookies.get(tokenKey),
      });
    }
    this.setState({
      isReady: true,
    });
  }

  render() {
    const { isReady } = this.state;
    const { children } = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    const isLogin = cookies.get(tokenKey);
    const queryString = stringify({
      redirect: window.location.href,
    });

    if (!isReady) {
      return <PageLoading />;
    }
    if (!isLogin && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`} />;
    }
    return children;
  }
}

export default connect(({ login }: ConnectState) => ({ username: login.name }))(SecurityLayout);
