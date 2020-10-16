import { Alert } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { StateType } from '@/models/login';
import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';
import cookies from '@/utils/cookie';
import { checkRedirect } from '@/utils/utils';
import LoginForm from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Submit } = LoginForm;
interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin, submitting, dispatch } = props;
  const { status } = userLogin;
  const [type, setType] = useState<string>('account');

  const handleSubmit = (values: LoginParamsType) => {
    dispatch({
      type: 'login/login',
      payload: { ...values },
    });
  };

  useEffect(() => {
    const { tokenKey } = process['CONFIG'];
    const token = cookies.get(tokenKey);

    if (token) {
      dispatch({
        type: 'login/getRole',
        payload: token,
        callback: () => {
          checkRedirect();
        },
      });
    }
  }, []);

  return (
    <div className={styles.main}>
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account" tab="账户密码登录">
          {status === 'error' && !submitting && <LoginMessage content="账户或密码错误" />}
          <UserName
            name="name"
            placeholder="请输入用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </Tab>
        <Submit loading={submitting}>登录</Submit>
      </LoginForm>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
