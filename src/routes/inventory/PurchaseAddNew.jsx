import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { message } from 'antd'
import PurchaseAddList from '../../components/Inventory/Purchase/addList.jsx';
import PurchaseSearch from '../../components/Inventory/Purchase/searchAdd';
import PurchaseModel from '../../components/Inventory/Purchase/modal';

const Purchase = ({ purchase, dispatch }) => {
  const {storeId,
    dataSource,
    count,
    editableMem,
    selectData,
    supplierList,
    warehouseList,
    loading,
    depotId,
    bussDate,
    remarks,
    goodsId,
    findTreeList,
    scmInGoodsList,
    goodsList,
    goodsVisible,
    paginationGoods,
    cateId,
    modalRowIndex,
    selectedRowKeysModal,
  } = purchase;
    // console.log("goodsVisible",goodsVisible);
  const purchaseAddModel={
    cateId,
    visible:goodsVisible,
    dataTree:findTreeList,
    paginationGoods,
    modalRowIndex,
    selectedRowKeys:selectedRowKeysModal,
    scmInGoodsList,
    onCancel() {
      dispatch({
        type: 'purchase/querySuccess',
        payload: {
          goodsVisible:false,
        },
      });
      dispatch({
        type: 'purchase/querySuccess',
        payload: {
          selectedRowKeysModal:[],
        },
      });
    },
    goodsModalExport(keys,value) {
      // console.log('value111', keys, '要插入的', value, '现在', dataSource, modalRowIndex);
      dispatch({
        type: 'purchase/querySuccess',
        payload: {
          selectedRowKeysModal:keys,
        },
      });
      dispatch({
        type: 'purchase/querySuccess',
        payload: {
          exportModalList:value,
        },
      });
    },
    onPageChange(page) {
      dispatch({
        type: 'purchase/findScmInGoods',
        payload: {
          page: page.current,
          rows:page.pageSize,
          depotId,
          storeId,
          limit:'20',
          status:'1',
          queryString:cateId,
        },
      })
    },
    onSelectMenu(selectedKeys, info){
      dispatch({
        type: 'purchase/findScmInGoods',
        payload: {
            queryString: selectedKeys[0],
            depotId,
            storeId,
            limit:'20',
            status:'1',
            rows: 10,
            page:1,
        },
      });
      dispatch({
        type: 'purchase/querySuccess',
        payload:{
          cateId: selectedKeys[0],
        },
      });
    },
    okHideModal() {
      dispatch({
        type: 'purchase/querySuccess',
        payload: {
          goodsVisible:false,
        },
      });
      dispatch({
        type: 'purchase/exportModalListAll',
        payload:{}
      });
      dispatch({
        type: 'purchase/querySuccess',
        payload: {
          selectedRowKeysModal:[],
        },
      });
    },
  };
  const purchaseAddSearchList = {
    depotId,
    bussDate,
    remarks,
    goodsId,
    loading,
    storeId,
    supplierList,
    warehouseList,
    querySupplier(value) {
      dispatch({
        type: 'purchase/updateSelect',
        payload: { depotId: value }
      })
    },
    queryTime(value){
      dispatch({
        type: 'purchase/updateSelect',
        payload: { bussDate:value }
      })
    },
    queryGoods(value){
      dispatch({
        type: 'purchase/updateSelect',
        payload: { goodsId:value }
      })
    },
    queryCopy(value){
      dispatch({
        type: 'purchase/updateSelect',
        payload: { remarks:value }
      })
    },
  };
  const purchaseAddListDate = {
    depotId,
    goodsId,
    storeId,
    dataSource,
    editableMem,
    selectData,
    findTreeList,
    scmInGoodsList,
    goodsList,
    onUpdateAdd() {
      if (!depotId) {
        message.error('仓库不能为空！');
        return false;
      }
      return null;
    },
    selectHandleValue(selectValue){
      dispatch({
        type: 'purchase/selectHandleValue',
        payload: { selectValue }
      })
    },
    queryGoodsCoding(queryString,depotId){
      dispatch({
        type: 'purchase/queryGoodsCoding',
        payload: { limit:20,status:1,storeId,queryString,depotId }
      })
    },
    updateEditableMem(targetField, index) {
      // console.log("targetField in updateEditableMem",targetField,index+1);
      dispatch({
        type: 'purchase/updateEditableMem',
        payload: { targetField, index },
      });
    },
    addData(index) {
      dispatch({
        type: 'purchase/addTable',
        payload: {
          rowindex: index,
        },
      });
      dispatch({
        type: 'purchase/editableMem',
        payload: { dataSource: [] },
      });
    },
    onDelete(index) {
      const newDataSource = [...dataSource];
      newDataSource.splice(index, 1);
      dispatch({
        type: 'purchase/deleteTable',
        payload: {
          dataSource: newDataSource,
        },
      });
    },
    resyncDataSource(value) {
      dispatch({
        type: 'purchase/querySuccess',
        payload: {
          dataSource: value,
        },
      });
    },
    cancel() {
      dispatch({
        type: 'purchase/cancelAll',
        payload: {},
      });
    },
    openGoodsModel(value) {
      dispatch({
        type: 'purchase/querySuccess',
        payload: {
          goodsVisible: true,
          modalRowIndex: value,
        },
      });
    },
    onSave(value) {
      //{id:'',goodsId:dataSource[0].id}
      // console.log("------------------数据----",dataSource,"value",value);
      let newDataSource=[]
      dataSource.map( item => {
        newDataSource.push({
          id: '',
          goodsId: item.id,
          goodsCode: item.goodsCode,
          goodsName: item.goodsName,
          goodsSpec: item.goodsSpec,
          unitName: item.unitName,
          unitId: item.unitId,
          goodsQty: item.goodsQty,
          unitPriceNotax: item.unitPriceNotax,
          goodsAmtNotax: item.goodsAmtNotax,
          taxRatio: item.taxRatio,
          goodsTaxAmt: item.goodsTaxAmt,
          unitPrice: item.unitPrice,
          goodsAmt: item.goodsAmt,
          remarks: item.remarks,
          dualUnitId: '5b7f0fc6-679a-445a-8fcb-66945584aaec',
          dualUnitName: item.dualUnitName,
          dualGoodsQty: item.dualGoodsQty
        })
      })

      dispatch({
        type: 'purchase/addNewsave',
        payload: {
          storeId:storeId,
          suppId:'ac16eba4-e9cd-4e66-a65e-c3279f9be12a',
          suppName:'1启用供应商',
          depotId:'30189ff6-e439-4308-9eec-b1da87909cf9',
          depotName:'7|6调拨仓库',
          status:value?'961':'962',
          bussDate:bussDate,
          detailList:newDataSource,
        }
      })
    },
  };
  const PurchaseModalGen = () =>
    <PurchaseModel {...purchaseAddModel} />

  return (
    <div className="routes">
    <PurchaseSearch  {...purchaseAddSearchList}/>
    <PurchaseAddList {...purchaseAddListDate} />
    <PurchaseModel {...purchaseAddModel} />
    </div>
  );
};

Purchase.propTypes = {
  purchase: PropTypes.object,
  dispatch: PropTypes.func,
};
function mapStateToProps({ purchase }) {
  return { purchase };
}
export default connect(mapStateToProps)(Purchase);
