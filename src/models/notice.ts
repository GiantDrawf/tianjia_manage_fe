import { getAllNoReadMsg } from '@/services/notice';
import { NoticeItem } from '@/types/apiTypes';
import { Effect, Reducer } from 'umi';

export interface StateType {
  allNotice: NoticeItem[];
}

export interface NoticeModalTypes {
  namespace: string;
  state: StateType;
  effects: {
    getAllNotice: Effect;
  };
  reducers: {
    updateNotices: Reducer<StateType>;
  };
}

const Modal: NoticeModalTypes = {
  namespace: 'notice',
  state: {
    allNotice: [],
  },
  effects: {
    *getAllNotice(_, { call, put }) {
      const allMsg = yield call(getAllNoReadMsg);

      if (allMsg && allMsg.code === 200) {
        yield put({
          type: 'updateNotices',
          payload: allMsg.data || [],
        });
      }
    },
  },
  reducers: {
    updateNotices(state, { payload }) {
      return {
        ...state,
        allNotice: payload,
      };
    },
  },
};

export default Modal;
