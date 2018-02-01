import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import _ from 'lodash';
import AllotManageSearch from '../../components/Inventory/AllotManage/search';
import AllotManageList from '../../components/Inventory/AllotManage/list';

const AllotManage = ({ allotManageData, dispatch }) => {
  const {
    loading,
    storeId, // 机构id
    aclStoreListAll, // 全部机构
    pagination, // 首页分页
    dataList,
    typeList,
    status,
    depotList, // 出入库
    outNewDepotId, // 调出仓库ID
    inNewDepotId, // 调入仓库ID
  } = allotManageData.allotManage;
  const AllotManageSearchProps = { // 首页搜索
    storeList: aclStoreListAll, // 全部机构
    storeId, // 机构id
    depotList, // 出入库
    outNewDepotId, // 调出仓库ID
    inNewDepotId, // 调入仓库ID
    onAdd() { // 新增采购订单
      dispatch({
        type: 'allotManage/addNewList',
      });
      dispatch({
        type: 'allotManage/querySuccess',
        payload: {
          update: false,
        },
      });
      dispatch({
        type: 'allotManage/onAddSelect',
        payload: {
          storeId,
        },
      });
    },
    changeStore(value) { // 选择机构id
      dispatch({
        type: 'allotManage/querySuccess',
        payload: {
          storeId: value,
        },
      });
      dispatch({
        type: 'allotManage/query',
        payload: {
          rows: 10,
          storeId: value,
        },
      });
      dispatch({
        type: 'allotManage/queryDepot',
        payload: {
          rows: 11,
          storeId: value,
        },
      });
    },
    queryAll(value) { // 搜索全部
      dispatch({
        type: 'allotManage/query',
        payload: {
          rows: 10,
          ...value,
          storeId,
        },
      });
    },
    updateBillNo(value) { // 搜索全部
      const billNoValue = value.target.value;

      if (billNoValue > 30) {
        message.error('不能超过30个字符')
        return false;
      }
      dispatch({
        type: 'allotManage/querySuccess',
        payload: {
          billNo: value.target.value,
        },
      });
    },
    upadateOutDepot(value) { // 弃审
      // _.remove(dataList, item => {
      //     item.id === value
      // })
      dispatch({
        type: 'allotManage/querySuccess',
        payload: {
          outNewDepotId: value,
        },
      });
    },
    upadateInDepot(value) { // 弃审
      dispatch({
        type: 'allotManage/querySuccess',
        payload: {
          inNewDepotId: value,
        },
      });
    },
  };
  const AllotManageListProps = { // 首页列表
    loading,
    storeId,
    pagination, // 首页分页
    dataList,
    typeList,
    status,
    onDetails(id, type) { // 判断编辑还是查看
      // console.log("--------------------id",id,"type",type);
      if (type) { // 编辑
        dispatch({
          type: 'allotManage/update',
          payload: {
            id,
            storeId,
          },
        });
        dispatch({
          type: 'allotManage/querySuccess',
          payload: {
            update: true,
          },
        });
      } else { // 查看
        dispatch({
          type: 'allotManage/queryfind',
          payload: {
            id,
          },
        });
      }
    },
    onDelete(id) { // 修改分页
      dispatch({
        type: 'allotManage/onDelete',
        payload: {
          id,
          storeId,
        },
      });
    },
    onPageChange(page) { // 修改分页
      dispatch({
        type: 'allotManage/findScmInGoods',
        payload: {
          page: page.current,
          rows: page.pageSize,
          limit: '20',
          status: '1',
        },
      });
    },
    updateAllot(page) { // 修改全部
      dispatch({
        type: 'allotManage/updata',
        payload: {
          page: page.current,
          rows: page.pageSize,
          limit: '20',
          status: '1',
        },
      });
    },
    onPageSizeChange(current, pageSize) { // 修改页条数
      dispatch({
        type: 'allotManage/query',
        payload: {
          page: 1,
          rows: pageSize,
        },
      });
    },
  };

  return (
    <div className="routes">
      <AllotManageSearch {...AllotManageSearchProps} />
      <AllotManageList {...AllotManageListProps} />
    </div>
  );
};
AllotManage.propTypes = {
  dispatch: PropTypes.func,
};
function mapStateToProps(allotManageData) {
  return { allotManageData };
}

export default connect(mapStateToProps)(AllotManage);
