import { message } from 'antd';
import {
  getAclStoreListSecond,
  findAclStoreForPage,
  storeUpdateForm,
  getAddress,
  saveEditStore,
  getDcStoreListSecond,
  findDcStoreForPage,
  dcUpdateForm,
  saveEditDc,
  aclDistributionStore,
  assignOrCancelStore,
} from '../../services/settled/chainSet';
import { getUserInfo, compare } from '../../utils';

export default {
  namespace: 'chainSet',
  state: {
    dataSource: [],
    loading: false,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 10,
      current: 1,
      total: 0,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['10', '20', '30', '40'],
    },
    paginationDc: {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 10,
      current: 1,
      total: 0,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['10', '20', '30', '40'],
    },
    paginationModal: {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      current: 1,
      total: 0,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['5', '10', '15', '20'],
    },
    searchDcData: '', // 配送中心搜索
    visible: false,
    menuId: '1', // 1 : 门店 2： 配送中心
    storeList: [], // 门店集合
    storeSource: [], // 门店列表详情
    dcList: [], // 配送中心集合
    dcSource: [], // 配送中心详情
    storeView: null,
    storeEdit: null,
    dcView: null,
    dcEdit: null,
    dcStoreChoose: [],
    storeModal: '1', // '1' 查看 '2' 编辑
    dcModal: '1', // 1: 查看 2 编辑 3 配送中心
    provinceList: [],
    districtList: [],
    cityList: [],
    modalTable: [],
    modalLoading: false,
    tenName: '',
    contactStore: [],
    selectModalList: [],
    distribId: '',
    assignList: [], // 当前默认选中的
    dcId: '',
    storeId: '',
  },

  reducers: {
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    showModal(state, { isNew }) {
      return { ...state, visible: true, isNew };
    },
    hideModal(state) {
      return { ...state, visible: false };
    },
    setStoreList(state, { storeList }) {
      return { ...state, storeList };
    },
    setPagination(state, { pagination }) {
      return { ...state, pagination };
    },
    setData(state, { storeSource, total, pageSize, current }) {
      state.pagination.total = total;
      state.pagination.pageSize = pageSize;
      state.pagination.current = current;
      return { ...state, storeSource };
    },
    setSearchData(state, { searchData }) {
      return { ...state, searchData };
    },
    setStoreInfo(state, { storeView, provinceList, cityList, districtList }) {
      return { ...state, storeView, provinceList, cityList, districtList };
    },
    setStoreModal(state, { storeModal }) {
      return { ...state, storeModal };
    },
    setAddress(state, { cityList, districtList }) {
      return { ...state, cityList, districtList };
    },
    setMenuId(state, { menuId }) {
      return { ...state, menuId };
    },
    // 配送中心
    setDcStoreList(state, { dcList }) {
      return { ...state, dcList };
    },
    setDcData(state, { dcSource, total, pageSize, current }) {
      state.paginationDc.total = total;
      state.paginationDc.pageSize = pageSize;
      state.paginationDc.current = current;
      return { ...state, dcSource };
    },
    setDcPagination(state, { pagination }) {
      return { ...state, paginationDc: pagination };
    },
    setSearchDataDc(state, { searchData }) {
      return { ...state, searchDcData: searchData };
    },
    setDcModal(state, { dcModal }) {
      return { ...state, dcModal };
    },
    setDcInfo(state, { dcView, provinceList, cityList, districtList }) {
      return { ...state, dcView, provinceList, cityList, districtList };
    },
    showModalLoading(state) {
      return { ...state, modalLoading: true };
    },
    hideModalLoading(state) {
      return { ...state, modalLoading: false };
    },
    setModalData(state, { modalTable, total, pageSize, current, tenName }) {
      state.paginationModal.total = total;
      state.paginationModal.pageSize = pageSize;
      state.paginationModal.current = current;
      const contactStore = [];
      const assignList = [];
      modalTable.map((item) => {
        if (item.isChecked) {
          contactStore.push(item.storeId);
          assignList.push(item); // 当前页选中的数据保持不变
        }
        return item;
      });
      return { ...state, modalTable, tenName, contactStore, assignList, selectModalList: assignList };
    },
    setModalPagination(state, { pagination }) {
      return { ...state, paginationModal: pagination };
    },
    setContactStore(state, { contactStore, selectModalList }) {
      return { ...state, contactStore, selectModalList };
    },
    setDistribId(state, { distribId }) {
      // 这里初始化数据modal
      state.paginationModal.pageSize = 5;
      state.paginationModal.current = 1;
      return { ...state, distribId };
    },
    setCancelList(state, { cancelList }) {
      return { ...state, cancelList };
    },
    setAssignList(state, { assignList }) {
      return { ...state, assignList };
    },
    setSelectId(state, { dcId }) {
      return { ...state, dcId };
    },
    setStoreSelectId(state, { storeId }) {
      return { ...state, storeId };
    },
  },

  effects: {
    // 门店
    * getAclStoreListSecond(payload, { call, put }) {
      const { data } = yield call(getAclStoreListSecond);
      if (data.success) {
        const { tenName } = getUserInfo();
        const treeNode = [];
        const children = [];
        if (data.data && data.data.length) {
          data.data.map((item) => {
            children.push({
              key: item.id,
              title: item.name,
            });
            return item;
          });
          treeNode.push({
            title: tenName,
            key: '00000000-0000-0000-0000-000000000000',
            children,
          });
        }
        yield put({
          type: 'setStoreList',
          storeList: treeNode,
        });
        yield put({
          type: 'fetchList',
          id: '',
        });
      } else {
        message.error(data.errorInfo);
      }
    },
    * fetchList(payload, { call, put, select }) {
      let storeId = '';
      if (payload.id) {
        storeId = payload.id;
      } else {
        storeId = '00000000-0000-0000-0000-000000000000';
      }
      yield put({
        type: 'setStoreSelectId',
        storeId,
      });
      const chainSet = yield select(state => state.chainSet);
      const { tenName } = getUserInfo();
      const storeList = chainSet.storeList;
      yield put({
        type: 'showLoading',
      });
      const { data } = yield call(findAclStoreForPage, {
        id: payload.id || '',
        page: chainSet.pagination.current,
        rows: chainSet.pagination.pageSize,
        name: chainSet.searchData || payload.name,
      });
      if (data.success) {
        const dataSource = (data.data && data.data.data) || [];
        dataSource.map((item) => {
          item.treeNode = storeList;
          item.parentName = tenName;
          return item;
        });
        yield put({
          type: 'setData',
          storeSource: dataSource,
          total: data.data && data.data.totalCount, // 总条数
          pageSize: data.data && data.data.limit, // 每页几条
          current: data.data && data.data.page, // 当前页
        });
      }
      yield put({
        type: 'hideLoading',
      });
    },
    * getStoreInfo(payload, { call, put }) {
      const { data } = yield call(storeUpdateForm, {
        id: payload.id,
      });
      const storeView = data.data;
      const { city, district, province } = storeView.storeAllInfo;
      const { provinceList, districtList, cityList } = storeView;
      provinceList.map((item) => {
        if (item.id === province) {
          storeView.storeAllInfo.ppp = item.areaName;
        }
        return item;
      });
      districtList.map((item) => {
        if (item.id === district) {
          storeView.storeAllInfo.ddd = item.areaName;
        }
        return item;
      });
      cityList.map((item) => {
        if (item.id === city) {
          storeView.storeAllInfo.ccc = item.areaName;
        }
        return item;
      });
      yield put({
        type: 'setStoreInfo',
        storeView: storeView.storeAllInfo,
        provinceList,
        districtList,
        cityList,
      });
    },
    * getDistrict(payload, { call, put, select }) {
      const chainSet = yield select(state => state.chainSet);
      const { data } = yield call(getAddress, {
        id: payload.id,
      });
      const { getType } = payload;
      if (getType === 'city') {
        yield put({
          type: 'setAddress',
          cityList: data.data || [],
          districtList: [],
        });
      } else if (getType === 'area') {
        yield put({
          type: 'setAddress',
          cityList: chainSet.cityList,
          districtList: data.data || [],
        });
      }
    },
    * saveEditStore(payload, { call, put }) {
      const { data } = yield call(saveEditStore, payload.values);
      if (data.success) {
        message.success('编辑成功');
        yield put({
          type: 'hideModal',
        });
        yield put({
          type: 'getAclStoreListSecond',
          id: '',
        });
      } else {
        message.error(data.message || data.errorInfo);
      }
    },
    // 配送中心
    * getDcStoreListSecond(payload, { call, put }) {
      const { data } = yield call(getDcStoreListSecond, {
        orgType: 124,
      });
      if (data.success) {
        const { tenName } = getUserInfo();
        const treeNode = [];
        const children = [];
        if (data.data && data.data.length) {
          data.data.map((item) => {
            children.push({
              key: item.id,
              title: item.name,
            });
            return item;
          });
          treeNode.push({
            title: tenName,
            key: '00000000-0000-0000-0000-000000000000',
            children,
          });
        }
        yield put({
          type: 'setDcStoreList',
          dcList: treeNode,
        });
        yield put({
          type: 'fetchDcList',
          id: '',
        });
      } else {
        message.error(data.errorInfo || data.message);
      }
    },
    * fetchDcList(payload, { call, put, select }) {
      let dCId = '';
      if (payload.id) {
        dCId = payload.id;
      } else {
        dCId = '00000000-0000-0000-0000-000000000000';
      }
      yield put({
        type: 'setSelectId',
        dcId: dCId,
      });
      const chainSet = yield select(state => state.chainSet);
      const { tenName } = getUserInfo();
      const dcList = chainSet.dcList;
      yield put({
        type: 'showLoading',
      });
      const { data } = yield call(findDcStoreForPage, {
        id: payload.id || '',
        page: chainSet.paginationDc.current,
        rows: chainSet.paginationDc.pageSize,
        name: chainSet.searchDcData || payload.name,
      });
      if (data.success) {
        const dataSource = (data.data && data.data.data) || [];
        dataSource.map((item) => {
          item.treeNode = dcList;
          item.parentName = tenName;
          return item;
        });
        yield put({
          type: 'setDcData',
          dcSource: dataSource,
          total: data.data && data.data.totalCount, // 总条数
          pageSize: data.data && data.data.limit, // 每页几条
          current: data.data && data.data.page, // 当前页
        });
      }
      yield put({
        type: 'hideLoading',
      });
    },
    * getDcInfo(payload, { call, put }) {
      const { data } = yield call(dcUpdateForm, {
        id: payload.id,
      });
      const storeView = data.data;
      const { city, district, province } = storeView.aclOrgInfo;
      const { provinceList, districtList, cityList } = storeView;
      provinceList.map((item) => {
        if (item.id === province) {
          storeView.aclOrgInfo.ppp = item.areaName;
        }
        return item;
      });
      districtList.map((item) => {
        if (item.id === district) {
          storeView.aclOrgInfo.ddd = item.areaName;
        }
        return item;
      });
      cityList.map((item) => {
        if (item.id === city) {
          storeView.aclOrgInfo.ccc = item.areaName;
        }
        return item;
      });
      yield put({
        type: 'setDcInfo',
        dcView: storeView.aclOrgInfo,
        provinceList,
        districtList,
        cityList,
      });
    },
    * saveEditDc(payload, { call, put }) {
      const { data } = yield call(saveEditDc, payload.values);
      if (data.success) {
        message.success('编辑成功');
        yield put({
          type: 'hideModal',
        });
      } else {
        message.error(data.message || data.errorInfo);
      }
    },
    * assignToStore(payload, { call, put, select }) {
      const chainSet = yield select(state => state.chainSet);
      const { tenName } = getUserInfo();
      yield put({
        type: 'showModalLoading',
      });
      const { data } = yield call(aclDistributionStore, {
        distribId: chainSet.distribId,
        page: chainSet.paginationModal.current,
        rows: chainSet.paginationModal.pageSize,
      });
      if (data.success) {
        yield put({
          type: 'showModal',
        });
        const dataSource = (data.data && data.data.data) || [];
        yield put({
          type: 'setModalData',
          modalTable: dataSource,
          total: data.data && data.data.totalCount, // 总条数
          pageSize: data.data && data.data.limit, // 每页几条
          current: data.data && data.data.page, // 当前页
          tenName,
        });
      } else {
        message.error(data.message || data.errorInfo);
      }
      yield put({
        type: 'hideModalLoading',
      });
    },
    * saveModalData({ distribId }, { call, select, put }) {
      const chainSet = yield select(state => state.chainSet);
      const assignList = compare(chainSet.assignList, chainSet.selectModalList);
      const cancelList = compare(chainSet.selectModalList, chainSet.assignList);
      const { data } = yield call(assignOrCancelStore, {
        assignList, // 新增的
        cancelList, // 删除的
        distribId,
      });
      if (data.success) {
        message.success('保存成功');
        yield put({
          type: 'hideModal',
        });
      } else {
        message.error(data.message || data.errorInfo);
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // console.log('---', app);
      return history.listen(({ pathname }) => {
        if (pathname === '/merchants/chain-set') {
          dispatch({
            type: 'setMenuId',
            menuId: '1',
          });
          dispatch({
            type: 'getAclStoreListSecond',
          });
        }
      });
    },
  },
};
