import { parse } from 'qs';
import { message } from 'antd';
import moment from 'moment';
import { queryOrg, queryGoodsID } from '../../services/inventory/common';
import { queryList, cancelBills } from '../../services/inventory/deliveryPriceReport';

const dateFormat = 'YYYY-MM-DD';
message.config({
  top: 300,
  duration: 5,
});

export default {
  namespace: 'deliveryPriceReport',
  state: {
    loading: false,
    orgList: [], // 机构列表
    orgInfoId: '', // 机构id
    dataList: [],
    startDate: moment(new Date()).month(moment(new Date()).month() - 1).format(dateFormat),
    endDate: moment(new Date()).format(dateFormat),
    monthDate: 0,
    chooseBills: [],
    chooseBillsList: [],
    baseInfo: { // 基础信息，一些搜索下拉选项之类的
      shopList: [],
      goodsList: [],
    },
    filters: {
      storeId: null, // 门店id
      billNo: null, // 单据号
      goodsId: null, // 物资Id
      status: '', // 状态
    },
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 10,
      pageSizeOptions: ['10', '20', '50', '100'],
    },
  },
  effects: {
    * queryOrg({ payload }, { call, put, select }) {
      message.destroy();
      const data = yield call(queryOrg, parse(payload));
      if (data.data && data.data.success) {
        const dataList = data.data.data.aclStoreList;
        if (payload.orgType === 2) {
          // const dataList = dataList1.slice(3, 4);
          yield put({
            type: 'updateState',
            payload: {
              orgList: dataList,
            },
          });
          // 如果机构列表长度为1，那么默认选的机构
          if (dataList.length === 1) {
            const startDate = yield select(state => state.deliveryPriceReport.startDate);
            const endDate = yield select(state => state.deliveryPriceReport.endDate);
            yield put({ // 存入机构id，顺便把搜索条件清空
              type: 'updateState',
              payload: {
                orgInfoId: dataList[0].id,
                filters: {
                  storeId: null,
                  goodsId: null,
                  billNo: null,
                  status: '',
                },
              },
            });
            yield put({
              type: 'queryList',
              payload: {
                orgInfoId: dataList[0].id,
                storeId: null,
                status: null,
                goodsId: null,
                billNo: null,
                startDate,
                endDate,
                rows: 10,
              },
            });
            yield put({ // 查询机构下的门店
              type: 'queryOrg',
              payload: {
                distribId: dataList[0].id,
                orgType: 1,
              },
            });
            yield put({
              type: 'deliveryPriceReport/queryGoodsMini',
              payload: {
                storeId: dataList[0].id,
                rows: 10,
              },
            });
          }
        } else if (payload.orgType === 1) {
          // const dataList = dataList1.slice(0, 1);
          const baseInfoOld = yield select(state => state.deliveryPriceReport.baseInfo);
          const filters = yield select(state => state.deliveryPriceReport.filters);
          // 如果门店长度为1的话，那么默认选中该门店,此时无需再次请求报表列表信息，
          // 因为如果只有一个门店，那么默认查出的信息也只是这个门店的
          let currStoreId = '';
          if (dataList.length > 1) {
            dataList.unshift({ name: '请选择门店', id: '' });
          } else if (dataList.length === 1) {
            currStoreId = dataList[0].id;
          }
          yield put({
            type: 'updateState',
            payload: {
              filters: { ...filters, storeId: currStoreId },
              baseInfo: { ...baseInfoOld, shopList: dataList },
            },
          });
        }
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryGoodsMini({ payload }, { call, put, select }) {
      const data = yield call(queryGoodsID, parse(payload));
      const baseInfoOld = yield select(state => state.deliveryPriceReport.baseInfo);
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            baseInfo: { ...baseInfoOld, goodsList: data.data.data.data },
          },
        });
      }
    },
    * queryList({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      let orgInfoId = yield select(state => state.deliveryPriceReport.orgInfoId);
      const {
        endDate, startDate, pagination,
      } = yield select(state => state.deliveryPriceReport);
      const {
        storeId, status, goodsId, billNo,
      } = yield select(state => state.deliveryPriceReport.filters);
      orgInfoId = payload.orgInfoId || orgInfoId; // 没有orgInfoId参数的话使用state的
      const pageNo = payload.page || pagination.current;
      const pageSize = payload.rows || pagination.pageSize;
      if (!orgInfoId) {
        yield false;
      }
      const reqParams = {
        orgInfoId,
        storeId,
        status,
        goodsId,
        billNo,
        startDate,
        endDate,
        page: pageNo, // 查看第几页内容 默认1
        rows: pageSize, // 一页展示条数 默认10
      };
      const data = yield call(queryList, parse(reqParams));
      if (data.data && data.data.success) {
        const paginationOld = yield select(state => state.deliveryPriceReport.pagination);
        yield put({
          type: 'querySuccess',
          payload: {
            dataList: data.data.data.page.data,
            monthDate: data.data.data.monthDate,
            loading: false,
            pagination: {
              ...paginationOld,
              total: data.data.data.page.totalCount,
              current: data.data.data.page.page,
              pageSize: data.data.data.page.limit,
            },
          },
        });
        // yield put({ type: 'hideLoading' });
      } else {
        // yield put({
        //   type: 'querySuccess',
        //   payload: {
        //     loading: false,
        //     dataList: [],
        //   },
        // });
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({
          type: 'updateState',
          payload: {
            loading: false,
            dataList: [],
          },
        });
        // yield put({ type: 'hideLoading' });
      }
    },
    * cancel({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(cancelBills, { detailList: payload.chooseBillsList });
      if (data.data && data.data.success) {
        message.success('作废成功！');
        yield put({ type: 'reload' });
        // 批量作废后，应该把已选的单号数组跟作废数组置为空
        yield put({
          type: 'updateState',
          payload: {
            chooseBills: [],
            chooseBillsList: [],
          },
        });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * reload(action, { put, select }) {
      const zbData = yield select(state => state.deliveryPriceReport);
      yield put(
        {
          type: 'queryList',
          payload: {
            orgInfoId: zbData.orgInfoId,
            storeId: zbData.filters.storeId,
            status: zbData.filters.status,
            goodsId: zbData.filters.goodsId,
            billNo: zbData.filters.billNo,
            startDate: zbData.startDate,
            endDate: zbData.endDate,
            page: zbData.pagination.current,
            rows: zbData.pagination.pageSize,
          },
        });
    },
  },
  reducers: {
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    querySuccess(state, action) { return { ...state, ...action.payload }; },
    updateState(state, action) { return { ...state, ...action.payload }; },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/stock/deliveryPriceReport') {
          dispatch({
            type: 'queryOrg',
            payload: { ...location.query, orgType: 2 },
          });
          dispatch({
            type: 'queryList',
            payload: {},
          });
        }
      });
    },
  },
};
