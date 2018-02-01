import React from 'react';
import { connect } from 'dva';
import DetailsFilter from '../../components/Inventory/DispatchCheck/details/filter';
import DetailListView from '../../components/Inventory/DispatchCheck/details/listView';

// DispatchCheckDetails里的dispatchCheckDetails来自model里的dispatchCheckDetails
const DispatchCheckDetails = ({ dispatchCheckDetails, dispatch }) => {
  const {
    opType, // 验收or查看
    loadingList, // 缓冲
    createTime, // 验收时间
    pageDetail, // 表格数据
    editableMem, // 可编辑表格对象的状态：true/false
    billNo, // 配送单号
    storeName, // 请购门店
    depotName, // 出库仓库
    inDepotName, // 入库仓库
    initialDepotName, // 入库仓库初始值
    dispatchOutNo, // 配送出库单号
    auditStatus, // 验收状态
    distribName, // 配送中心
    orderDate, // 单号创建日期
    depotId, // 入库仓库id
    depotList, // 入库仓库列表
    auditUser, // 验收人
  } = dispatchCheckDetails;
  const SearchData = {
    opType,
    createTime,
    billNo,
    storeName,
    depotName,
    inDepotName, // 入库仓库
    dispatchOutNo,
    auditStatus, // 验收状态
    distribName, // 配送中心
    orderDate, // 单号创建日期
    depotId, // 入库仓库id
    depotList, // 入库仓库列表
    initialDepotName, // 入库仓库初始值
    auditUser, // 验收人
    // 修改入库仓库
    changeDepot(value) {
      dispatch({
        type: 'dispatchCheckDetails/changeDepot',
        payload: {
          depotId: value,
        },
      });
    },
  };
  const ListData = {
    opType,
    loadingList, // 缓冲
    auditStatus,
    pageDetail,
    editableMem,
    // 编辑列表后同步，以在列表中即时显示
    resyncDataSource: ((listData) => {
      dispatch({
        type: 'dispatchCheckDetails/resyncListData',
        payload: {
          listData,
        },
      });
    }),
    // 点击验收，保存验收信息
    saveDetails: ((status) => {
      dispatch({
        type: 'dispatchCheckDetails/saveDirectCheckDetails',
        payload: { status },
      });
    }),
    // 点击返回返回查询页
    cancelDetailPage: (() => {
      dispatch({
        type: 'dispatchCheckDetails/cancelDetailData',
        payload: {},
      });
    }),
    // 点击enter跳转到下一个编辑状态
    toNextMem: ((rowIndex, fieldName, isShow) => {
      dispatch({
        type: 'dispatchCheckDetails/toNextMemByCurr',
        payload: { rowIndex, fieldName, isShow },
      });
    }),
    // 修改其他的编辑状态为非编辑状态
    toggleMemStatus: ((rowIndex, fieldName) => {
      dispatch({
        type: 'dispatchCheckDetails/toggleMemStatus',
        payload: { rowIndex, fieldName },
      });
    }),
  };

  const DetailsFilterData = {
    ...SearchData,
  };

  const DetailsListData = {
    ...ListData,
  };

  return (
    <div className="routes">
      <DetailsFilter {...DetailsFilterData} />
      <DetailListView {...DetailsListData} />
    </div>
  );
};
// mapStateToProps内的参数需与model里的namespace一致
function mapStateToProps({ dispatchCheckDetails }) {
  return { dispatchCheckDetails };
}
export default connect(mapStateToProps)(DispatchCheckDetails);
