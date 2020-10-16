import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect, ConnectProps, Dispatch } from 'umi';
import { stringify } from 'querystring';
import { ConnectState } from '@/models/connect';
import cookies from '@/utils/cookie';

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
  dispatch: Dispatch;
}

interface SecurityLayoutState {
  isReady: boolean;
}

const { tokenKey } = process['CONFIG'];
const token = cookies.get(tokenKey);

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    if (cookies.get(tokenKey)) {
      dispatch({
        type: 'login/getRole',
        payload: cookies.get(tokenKey),
        callback: () => {
          this.setState({
            isReady: true,
          });
        },
      });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading } = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    const isLogin = token;
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!isLogin && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`} />;
    }
    return children;
  }
}

export default connect(({ loading }: ConnectState) => ({
  loading: loading.models.user,
}))(SecurityLayout);
