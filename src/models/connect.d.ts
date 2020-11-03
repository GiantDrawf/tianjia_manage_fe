import { MenuDataItem, Settings as ProSettings } from '@ant-design/pro-layout';
import { NoticeStateType } from '@/types/pageTypes';
import { GlobalModelState } from './global';
import { StateType } from './login';

export { GlobalModelState, UserModelState };

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: ProSettings;
  login: StateType;
  notice: NoticeStateType;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}
