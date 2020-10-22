import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';
import { message } from 'antd';
import { accountLogin, getRole } from '@/services/login';
import { removeAuthority, setAuthority } from '@/utils/authority';
import { checkRedirect, getPageQuery } from '@/utils/utils';
import cookies from '@/utils/cookie';
import { AccountInfo } from '@/types/apiTypes';

const { tokenKey } = process['CONFIG'];

export interface StateType {
  status?: 'ok' | 'error';
  name: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
    getRole: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    name: '',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response: AccountInfo = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.code === 200) {
        // 记录token
        const token = response.data.token || '';
        cookies.set(tokenKey, token);
        checkRedirect();
      } else {
        message.error(response.msg);
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      // 清空cookie和localstroge
      cookies.remove(tokenKey, {});
      removeAuthority();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
    *getRole({ callback }, { call, put }) {
      const userRole = yield call(getRole);

      if (userRole && userRole.code === 200) {
        yield put({
          type: 'changeLoginStatus',
          payload: userRole,
        });
        setAuthority(userRole?.data?.role || '');
        if (callback) callback();
      } else {
        yield put({
          type: 'logout',
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const role = payload?.data?.role || 'guest';
      const name = payload?.data?.name || '';
      const status = payload?.code === 200 ? 'ok' : 'error';
      setAuthority(role);
      return {
        ...state,
        status,
        name,
        currentAuthority: role,
      };
    },
  },
};

export default Model;
