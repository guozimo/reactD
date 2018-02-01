// import { message } from 'antd';
import { message } from 'antd/lib/index';
import * as memberImport from '../../services/settled/memberImport';
import { checkIfRefed, remove } from '../../services/settled/handle';

export default {
  namespace: 'memberImport',
  state: {
    list: [],
    stores: [],
    loading: false,
    treeNodes: [],
    provinceList: [],
    cityList: [],
    areaList: [],
    postVal: {
      storeId: '',
      postId: '',
      postType: '',
      stores: '',
      realname: '',
      address: '',
      city: '',
      district: '',
      emplCode: '',
      gender: '',
      mobile: '',
      province: '',
      tenantId: '',
      isDisplay: '',
      posUserAccount: '',
      present: '',
      discountGive: '',
      idCard: '',
      postList: [],
      showEditor: false,
      recordId: '',
      emp1: { rightName: '请选择', storeName: '请选择', selectedKeys: [] },
      record: {},
      rightName: '',
    },

    emp1: { rightName: '请选择', storeName: '请选择' },
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 10,
      current: 1,
      total: 0,
      showTotal: total => `共 ${total} 条`,
    },
    isEdit: false,
    searchData: '',
  },
  reducers: {
    save(state, { list, total, pageSize, current }) {
      state.pagination.total = total;
      state.pagination.pageSize = pageSize;
      state.pagination.current = current;
      return {
        ...state,
        list,
      };
    },
    showLoading(state) {
      return { ...state, loading: true };
    },
    saveStoreList(state, { stores }) {
      return {
        ...state,
        stores,
      };
    },
    saveProvince(state, { provinceList }) {
      return {
        ...state,
        provinceList,
      };
    },
    saveTreeNode(state, { treeNodes }) {
      return {
        ...state,
        treeNodes,
      };
    },
    saveCity(state, { cityList }) {
      return {
        ...state,
        cityList,
      };
    },
    saveThirdCity(state, { areaList }) {
      return {
        ...state,
        areaList,
      };
    },
    saveMemCode(state, { emplCode }) {
      return {
        ...state,
        emplCode,
      };
    },
    savePostList(state, { postList }) {
      return {
        ...state,
        postList,
      };
    },
    showEditor(state, { showEditor, recordId, record, isEdit }) {
      return {
        ...state,
        showEditor,
        recordId,
        record,
        isEdit,
      };
    },
    saveEmp1(state, { emp1, rightName }) {
      return {
        ...state,
        emp1,
        rightName,
      };
    },
    rightName(state, { rightName }) {
      return {
        ...state,
        rightName,
      };
    },
    setPagination(state, { pagination }) {
      return { ...state, pagination };
    },
    setSearchData(state, { searchData }) {
      return { ...state, searchData };
    },
  },

  effects: {
    * fetch(payload, { call, put, select }) {
      const memberImportModal = yield select(state => state.memberImport);
      /* yield必须在* 函数 内*/
      yield put({ type: 'showLoading' });
      console.log('payload===>', payload);
      const param = {
        storeId: payload.payload ? payload.payload.storeId : '',
        page: memberImportModal.pagination.current,
        rows: memberImportModal.pagination.pageSize,
        realname: memberImportModal.searchData || payload.realname || '',
      };
      const data = yield call(memberImport.memberInfo, param);
      if (data.data.success) {
      /*  调用上面的方法然后返回新的state*/
        yield put({
          type: 'save',
          list: data.data.data.data,
          total: data.data.data && data.data.data.totalCount, // 总条数
          pageSize: data.data.data && data.data.data.limit, // 每页几条
          current: data.data.data && data.data.data.page, // 当前页
        });
        yield put({
          type: 'saveStoreList',
          stores: data.data.data.aclStoreList,
        });
      }
    },
    * delete({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(remove, payload);
      if (data.data && data.data.success) {
        yield put({ type: 'fetch' });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },

    * prepareEdit({ payload }, { call, put }) {
      // 以引用的税率不允许修改
      const id = payload.currentItem.id;
      const refData = yield call(checkIfRefed, { id });
      if (refData.data.success === true) {
        yield put({ type: 'showModal', payload });
      } else {
        message.error(refData.data.errorInfo, 1);
      }
    },
    * downloadTable(payload, { call }) {
      const data = yield call(memberImport.downloadTable);
      if (data) {
        window.open(data.data.data);
      }
    },

    * downloadTableQu(payload, { call }) {
      const data = yield call(memberImport.downloadTableQu);
      if (data) {
        window.open(data.data.data);
      }
    },

    * downloadDish(payload, { call }) {
      const data = yield call(memberImport.downloadDish);
      if (data) {
        window.open(data.data.data);
      }
    },

    * downloadCategory(payload, { call }) {
      const data = yield call(memberImport.downloadCategory);
      if (data) {
        window.open(data.data.data);
      }
    },
    * showTree(payload, { call, put }) {
      const { data } = yield call(memberImport.showTree);
      if (data) {
        yield put({
          type: 'saveTreeNode',
          treeNodes: data.data,
        });
      }
    },

    * resetPwd(payload, { call }) {
      const { data } = yield call(memberImport.resetPwd, payload.payload.id);
      if (data.success === true) {
        message.success('密码已重置');
      }
    },
    * updateStatus(payload, { call, put }) {
      const { data } = yield call(memberImport.updateStatus, payload.payload);
      if (data.success === true) {
        message.success(payload.status === 1 ? '已启用' : '已停用');
        //  call是用来调取接口的 put是用来拿*的方法的
        yield put({
          type: 'fetch',
          payload: {
            storeId: '',
            realname: '',
            rows: 20,
            page: 1,
          },
        });
      }
    },
    * getArea(payload, { call, put }) {
      const { data } = yield call(memberImport.getArea);
      if (data.success === true) {
        yield put({
          type: 'saveProvince',
          provinceList: data.data.provinceList,
        });
      }
    },
    * getSecondArea(payload, { call, put }) {
      const { data } = yield call(memberImport.getSecondArea, payload.payload.provinceId);
      if (data.success === true) {
        yield put({
          type: 'saveCity',
          cityList: data.data,
        });
      }
    },
    * getThirdArea(payload, { call, put }) {
      const { data } = yield call(memberImport.getSecondArea, payload.payload.provinceId);
      if (data.success === true) {
        yield put({
          type: 'saveThirdCity',
          areaList: data.data,
        });
      }
    },
    * addAclEmployee(payload, { call, put }) {
      const { data } = yield call(memberImport.addAclEmployee, payload.payload);

      if (data.success === true) {
        message.success('添加成功');
        yield put({
          type: 'memberImport/showEditor',
          showEditor: false,
        });
        yield put({
          type: 'fetch',
          payload: {
            storeId: '',
            realname: '',
            rows: 20,
            page: 1,
          },
        });
      } else {
        message.error(data.errorInfo);
      }
    },
    * updateEmployee(payload, { call, put }) {
      const { data } = yield call(memberImport.updateEmployee, payload.payload);

      if (data.success === true) {
        message.success('编辑成功');
        yield put({
          type: 'memberImport/showEditor',
          showEditor: false,
        });
        yield put({
          type: 'fetch',
          payload: {
            storeId: '',
            realname: '',
            rows: 20,
            page: 1,
          },
        });
      } else {
        message.error(data.errorInfo);
      }
    },
    * restStore(payload, { call, put }) {
      const { data } = yield call(memberImport.restStore, payload.payload);
      if (data.success === true) {
        const newEmp1 = payload.newEmp1 || {};
        newEmp1.emplCode = data.data;
        yield put({
          type: 'saveEmp1',
          emp1: newEmp1,
        });
      }
    },
    * postList(payload, { call, put }) {
      const { data } = yield call(memberImport.getArea);
      if (data.success === true) {
        yield put({
          type: 'savePostList',
          postList: data.data.basPostList,
        });
      }
    },
    * updateForm(payload, { call, put }) {
      const { data } = yield call(memberImport.updateForm, payload.payload);
      if (data.success === true) {
        const aclStoreList = data.data.aclStoreList || [];
        aclStoreList.map((subItem) => {
          if (subItem.id === data.data.aclEmployee.storeId) {
            data.data.aclEmployee.storeId = `${data.data.aclEmployee.storeId}_${subItem.orgType}`;
          }
          return subItem;
        });
        console.log('data.data.aclEmployee', data.data.aclEmployee);
        const selectedKey = [];
        const rightName = [];
        (data.data.aclEmployee.storeList || []).map((item) => {
          aclStoreList.map((subItem) => {
            if (subItem.id === item.storeId) {
              selectedKey.push(`${item.storeId}_${subItem.orgType}`);
              rightName.push(item.storeName);
            }
            return subItem;
          });
          return item;
        });
        data.data.aclEmployee.selectedKeys = selectedKey;
        data.data.aclEmployee.rightName = rightName.join('\\');
        yield put({
          type: 'saveEmp1',
          emp1: data.data.aclEmployee,
        });
      }
    },
  },

  subscriptions: {
   /* //进页面切换路由执行*/
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/merchants/memberManagement') {
          dispatch({
            type: 'fetch',
            dispatch,
          });
          dispatch({
            type: 'showTree',
          });
          dispatch({
            type: 'getArea',
          });
          dispatch({
            type: 'postList',
          });
        }
      });
    },
  },
};
