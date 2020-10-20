export interface StateType {
  list: [];
}

export interface UserModalType {
  namespace: string;
  state: StateType;
  effects: {};
  reducers: {};
}

const userModel: UserModalType = {
  namespace: 'user',
  state: {
    list: [],
  },
  effects: {},
  reducers: {},
};

export default userModel;
