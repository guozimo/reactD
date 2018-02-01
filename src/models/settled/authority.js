import { message } from 'antd';
import { authorityList, updateAuthStatus, deleteAuthority, getAuthority, addBasPost, editBasPost, updBasPost } from '../../services/settled/authority';
import { transTreeData } from '../../utils';

export default {
  namespace: 'postAuthority',
  state: {
    dataSource: [],
    searchData: '',
    loading: false,
    isNew: true,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 20,
      current: 1,
      total: 0,
      showTotal: total => `共 ${total} 条`,
    },
    visible: false,
    // 树结构参数
    expandedKeys: [], // 展开项
    scmList: [],
    autoExpandParent: true,
    selectValue: [],
    postName: '',
    editId: '',
    checked: [],
    halfChecked: [],
  },

  reducers: {
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    setData(state, { dataSource, total, pageSize, current }) {
      state.pagination.total = total;
      state.pagination.pageSize = pageSize;
      state.pagination.current = current;
      return { ...state, dataSource };
    },
    setSearchData(state, { searchData }) {
      return { ...state, searchData };
    },
    setPagination(state, { pagination }) {
      return { ...state, pagination };
    },
    showModal(state, { isNew }) {
      return { ...state, visible: true, isNew };
    },
    hideModal(state) {
      return { ...state, visible: false, selectValue: [], postName: '', expandedKeys: [], editId: '' };
    },
    onExpand(state, { expandedKeys }) {
      return { ...state, expandedKeys, autoExpandParent: false };
    },
    setAuthority(state, { scmList }) {
      return { ...state, scmList: transTreeData(scmList) };
    },
    storeAuthority(state, { selectValue }) {
      return { ...state, selectValue };
    },
    setPosInfo(state, { postName, selectValue, editId }) {
      return { ...state, postName, selectValue, editId };
    },
  },

  effects: {
    * fetchList({ payload }, { call, put, select }) {
      const postAuthority = yield select(state => state.postAuthority);
      yield put({
        type: 'showLoading',
      });
      const { data } = yield call(authorityList, {
        page: postAuthority.pagination.current,
        rows: postAuthority.pagination.pageSize,
        postName: postAuthority.searchData,
      });
      if (data.success) {
        const dataSource = (data.data && data.data.data) || [];
        yield put({
          type: 'setData',
          dataSource,
          total: data.data && data.data.totalCount, // 总条数
          pageSize: data.data && data.data.limit, // 每页几条
          current: data.data && data.data.page, // 当前页
        });
      }
      yield put({
        type: 'hideLoading',
      });
    },
    * updateAuthStatus({ payload }, { call, put }) {
      // const postAuthority = yield select(state => state.postAuthority);
      const { data } = yield call(updateAuthStatus, {
        ...payload,
      });
      if (data.success) {
        const success = payload.status ? '已启用' : '已停用';
        message.success(success, 1);
        yield put({
          type: 'fetchList',
        });
      } else {
        message.error(data.errorInfo);
      }
    },
    * deleteAuthority({ id }, { call, put }) {
      const { data } = yield call(deleteAuthority, {
        id,
      });
      if (data.success) {
        yield put({
          type: 'fetchList',
        });
      } else {
        message.error(data.errorInfo);
      }
    },
    * getAuthority(payload, { call, put }) {
      const { data } = yield call(getAuthority);
      if (data.success) {
        const scmList = (data.data && data.data.scmList) || [];
        yield put({
          type: 'setAuthority',
          scmList,
        });
      }
    },
    * createAuthority(payload, { call, put }) {
      const { postName, postRoleList } = payload;
      const values = {
        postName,
        postRoleList,
      };
      const { data } = yield call(addBasPost, values);
      if (data.success) {
        message.success('新增岗位成功');
        yield put({
          type: 'hideModal',
        });
        yield put({
          type: 'fetchList',
        });
      } else {
        message.error(data.errorInfo);
      }
    },
    * editBasPost(payload, { call, put }) {
      const { id } = payload;
      const { data } = yield call(editBasPost, {
        id,
      });
      if (data.success) {
        const selectValue = [];
        const postName = data.data && data.data.postName;
        const editId = data.data && data.data.id;
        ((data.data && data.data.postRoleList) || []).map((item) => {
          selectValue.push(item.roleId);
          return item;
        });
        yield put({
          type: 'setPosInfo',
          postName,
          selectValue,
          editId,
        });
      }
    },
    * saveEditAuhtority(payload, { call, put }) {
      const { id, postName, postRoleList } = payload;
      const values = {
        id,
        postRoleList,
        postName,
      };
      const { data } = yield call(updBasPost, values);
      if (data.success) {
        message.success('编辑成功');
      } else {
        message.error(data.errorInfo);
      }
      yield put({
        type: 'fetchList',
      });
      yield put({
        type: 'hideModal',
      });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/merchants/authority') {
          dispatch({
            type: 'setSearchData',
            searchData: '',
          });
          dispatch({
            type: 'fetchList',
          });
          dispatch({
            type: 'getAuthority',
          });
        }
      });
    },
  },
};
