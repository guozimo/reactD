import { parse } from 'qs';
// import { routerRedux } from 'dva/router';
// import { message } from 'antd';
// import _ from 'lodash';
// import moment from 'moment';
// import { routerRedux } from 'dva/router';
import { queryGoodsID } from '../../../services/inventory/common';
// import { requisitionDetailsItemModel } from '../_common';

export default {
  namespace: 'goodsPopListModule',
  state: {
    goodsListModel: {},
    listPagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      size: 10,
      pageSizeOptions: [10, 20, 50, 100],
    },
  },
  reducers: { // Update above state.
    gotGoodsData(state, action) { // 初始模块值
      return { ...state, goodsListModel: action.goodsListModel };
    },

  },
  effects: {
    * getPopListData({ payload }, { call, put }) {
      const goodsData = yield call(queryGoodsID, parse(payload));
      yield put({ type: 'gotGoodsData', goodsListModel: goodsData.data });
    },
  },
  subscriptions: {

  },
};
