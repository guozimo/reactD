import React, { PropTypes } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import AllotManageAddNewSearch from '../../components/Inventory/AllotManage/searchAdd';
import AllotManageAddNewList from '../../components/Inventory/AllotManage/listAdd';

const AllotManageAddNew = ({ allotManageData, dispatch }) => {
  const {
    loading,
    storeId, // 机构id
    pagination, // 首页分页
    dataList,
    typeList,
    status,
    editableMem,
    newData,
    dataSource,
    goodsList,
    findTreeList, // 编辑弹框物资类别
    scmInGoodsList, // 编辑弹框物资全部
    paginationGoods, // 物资分类分页
    cateId, // 编辑弹框搜索id
    aclStoreListAll, // 新增仓库列表
    outDepotId, // 新增调出仓库ID
    inDepotId, // 新增调入仓库ID
    bussDate, // 新增业务日期
    remarks, // 新增备注
    update, // 新增还是编辑
    depotList, // 出入库
    dataSourceNew, // 新增返回时修改的数据
    allotTime, // 调拨时间
    goodsVisible,
    dataAll,
    dataSourceIndex,
  } = allotManageData.allotManage;
// console.log("aclStoreListAll",aclStoreListAll);
  const AllotManageAddNewSearchProps = { // 新增搜索
  storeList: aclStoreListAll, // 全部机构
  storeId, // 机构id
  bussDate, // 订单日期
  inDepotId, // 调出仓库ID
  outDepotId, // 调入仓库ID
  remarks, // 备注
  depotList, // 出入库
  allotTime, // 调拨时间
  changeStore(value) { // 选择机构id
    dispatch({
      type: 'allotManage/querySuccess',
      payload: {
        storeId: value,
      },
    });
  },
  upadateOutDepot(value) { // 调出仓库：
    dispatch({
      type: 'allotManage/querySuccess',
      payload: {
        outDepotId: value,
      },
    });
  },
  upadateInDepot(value) { // 调入仓库：
    dispatch({
      type: 'allotManage/querySuccess',
      payload: {
        inDepotId: value,
      },
    });
  },
  upadateTime(value) { // 调拨日期：
    if (value) {
      const bussDateValue = value.format('YYYY-MM-DD');
      dispatch({
        type: 'allotManage/querySuccess',
        payload: { bussDate: bussDateValue },
      });
    }
    // dispatch({
    //   type: 'allotManage/querySuccess',
    //   payload: {
    //     bussDate: value,
    //   },
    // });
  },
  upadateRemarks(value) { // 选择机构id
    const newValue = value.target.value;
    dispatch({
      type: 'allotManage/querySuccess',
      payload: {
        remarks: newValue,
      },
    });
  },
  queryAll(value) { // 搜索全部
    console.log(value);
  },
  onAdd() { // 新增采购订单
    dispatch({
      type: 'allotManage/addNewList',
    });
  },
  updateAudit() { // 弃审
    // dispatch({
    //   type: 'allotManage/querySuccess',
    //   payload: {
    //     storeId: value,
    //   },
    // });
  },
};
  const AllotManageAddNewListProps = { // 新增列表
    loading,
    storeId,
    pagination, // 首页分页
    dataList,
    typeList,
    status,
    editableMem,
    newData,
    outDepotId, // 新增调出仓库ID
    inDepotId, // 新增调入仓库ID
    dataSource,
    goodsList,
    findTreeList, // 编辑弹框物资类别
    scmInGoodsList, // 编辑弹框物资全部
    paginationGoods, // 物资分类分页
    cateId, // 编辑弹框搜索id
    update, // 新增还是编辑
    goodsVisible,
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
    updateEditableMem(targetField, index) { // 回车跳转新的边框或者新增一行
      // console.log('targetField in updateEditableMem', targetField, index+1);
      dispatch({
        type: 'allotManage/updateEditableMem',
        payload: { targetField, index },
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
    queryGoodsCoding(queryString) { // 查找编码
      dispatch({
        type: 'allotManage/queryGoodsCoding',
        payload: { limit: 20, status: 1, storeId, queryString, depotId: outDepotId},
      });
    },
    addData(index) { // 新增一行
      dispatch({
        type: 'allotManage/addTable',
        payload: {
          rowindex: index,
        },
      });
      dispatch({ // 初始化编辑table
        type: 'allotManage/editableMem',
        payload: { dataSource: [] },
      });
    },
    onDelete(index) { // 删除一行
      const newDataSource = [...dataSource];
      newDataSource.splice(index, 1);
      dispatch({
        type: 'allotManage/deleteTable',
        payload: {
          dataSource: newDataSource,
        },
      });
    },
    resyncDataSource(value) { // 联动修改数量
      dispatch({
        type: 'allotManage/querySuccess',
        payload: {
          dataSource: value,
        },
      });
    },
    openGoodsModel(value) { // 打开弹窗时，请求数据
      dispatch({
        type: 'allotManage/querySuccess',
        payload: {
          goodsVisible: true,
          modalRowIndex: value,
        },
      });
      dispatch({ // 查找物资类别
        type: 'allotManage/findTreeList',
        payload: { type: 0 },
      });
      dispatch({
        type: 'allotManage/findScmInGoods',
        payload: {
          limit: '20',
          status: '1',
          queryString: '',
          storeId,
          depotId: outDepotId,
        },
      });
    },
    onPageChange(page) { // 切换modal分页
      if (cateId) {
        dispatch({
          type: 'allotManage/findScmInGoods',
          payload: {
            page: page.current,
            rows: page.pageSize,
            storeId,
            limit: '20',
            status: '1',
            cateId,
          },
        });
      } else {
        dispatch({
          type: 'allotManage/findScmInGoods',
          payload: {
            page: page.current,
            rows: page.pageSize,
            storeId,
            limit: '20',
            status: '1',
          },
        });
      }
    },
    onSelectMenu(selectedKeys) { // 根据类别跳转
      dispatch({
        type: 'allotManage/findScmInGoods',
        payload: {
          cateId: selectedKeys[0],
          storeId,
          limit: '20',
          status: '1',
          rows: 10,
          page: 1,
        },
      });
      dispatch({
        type: 'allotManage/querySuccess',
        payload: {
          cateId: selectedKeys[0],
        },
      });
    },
    okHideModal(value) { // 提交全部数据
      dispatch({
        type: 'allotManage/exportModalListAll',
        payload: { newValue: value }
      });
    },
    cancel() { // 取消
      dispatch({
        type: 'allotManage/cancelAll',
        payload: {},
      });
      // console.log('dataSourceUpdate', dataSourceNew);
      dispatch({
        type: 'allotManage/querySuccess',
        payload: {
          dataSourceIndex: 1,
          dataSource: _.cloneDeep(dataSourceNew),
          outDepotId: '', // 调出仓库ID
          inDepotId: '', // 调入仓库ID
          bussDate: '', // 业务日期
          remarks: '', // 备注
        },
      });
    },
    onSave(value) {
      // console.log("---------------数据----",dataSource,"value",value);
      let newDataSource=[]

      dataSource.map((item, index)=>{
        let newsId = '';
        let newsGoodsId = '';
        (update && (index + 1) <= dataSourceIndex) ? (newsId = item.id) : newsId;
        (update && (index + 1) <= dataSourceIndex) ? (newsGoodsId = item.goodsId) : (newsGoodsId = item.id);
        newDataSource.push({
          id: newsId,
          goodsId: newsGoodsId,
          taxRatio: item.taxRatio,
          unitPriceNotax: item.unitPriceNotax,
          wareQty: item.wareQty,
          goodsQty: item.goodsQty,
          totalAmt: item.totalAmt,
          goodsAmtNotax: item.goodsAmtNotax,
          goodsCode: item.goodsCode,
          goodsName: item.goodsName,
          goodsSpec: item.goodsSpec,
          unitId: item.unitId,
          unitName: item.unitName,
          unitNum: item.unitNum,
          unitPrice: item.unitPrice,
          goodsAmt: item.goodsAmt,
          remarks: item.remarks,
        })
      })
      // console.log('newDataSource', newDataSource, 'dataAll', dataAll, 'dataAll.storeName', dataAll.id);
      const outDepotIdAll = _.find(depotList, item => item.id === outDepotId)
      const inDepotIdAll = _.find(depotList, item => item.id === inDepotId)
      // return false;
      if (update) { // 编辑
        dispatch({
          type: 'allotManage/addScmDirectManual',
          payload: {
            id: dataAll.id,
            outDepotId, // 新增调出仓库ID
            inDepotId, // 新增调入仓库ID
            outDepotName: outDepotIdAll.depotName,
            inDepotName: inDepotIdAll.depotName,
            bussDate, // 新增业务日期
            remarks, // 新增备注
            storeId,
            delIdsList: [],
            status: value ? '961' : '962', // 订单状态
            detailList: newDataSource,
          }
        })
      } else { // 新增
        // aclStoreListAll.map()
        // console.log('outDepotIdAll', outDepotIdAll);
        // console.log('bussDate', bussDate);
        dispatch({
          type: 'allotManage/addScmDirectManual',
          payload: {
            id: '',
            outDepotId, // 新增调出仓库ID
            inDepotId, // 新增调入仓库ID
            bussDate, // 新增业务日期
            remarks, // 新增备注
            outDepotName: outDepotIdAll.depotName,
            inDepotName: inDepotIdAll.depotName,
            delIdsList: [],
            detailList: newDataSource,
            depotId: storeId,
            storeId,
            status: value ? '961' : '962', // 订单状态
          }
        })
      }
    },
  };
  return (
    <div className="routes">
      <AllotManageAddNewSearch {...AllotManageAddNewSearchProps} />
      <AllotManageAddNewList {...AllotManageAddNewListProps} />
    </div>
  );
};
AllotManageAddNew.propTypes = {
  dispatch: PropTypes.func,
};
function mapStateToProps(allotManageData) {
  return { allotManageData };
}

export default connect(mapStateToProps)(AllotManageAddNew);
