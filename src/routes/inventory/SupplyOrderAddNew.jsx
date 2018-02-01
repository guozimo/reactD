import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { message } from 'antd'
import _ from 'lodash';
import moment from 'moment';
import SupplyOrderAddNewSearch from '../../components/Inventory/SupplyOrder/searchAdd';
import SupplyOrderAddNewList from '../../components/Inventory/SupplyOrder/listAdd';
import SupplyOrderAddNewModal from '../../components/Inventory/SupplyOrder/modal';

const supplyOrderAddNew = ({ supplyData, dispatch }) => {
  const {
    loading,
    storeId, // 机构id
    aclStoreListAll, // 全部机构
    pagination, // 首页分页
    dataList,
    typeList,
    status,
    editableMem,
    newData,
    dataSource,
    goodsList,
    bussDate, // 订单日期
    storeAddId, // 收货机构id
    busiId, // 供应商id
    remarks, // 备注
    findList, // 查看数组的数据
    goodsVisible, // 打开弹窗
    modalRowIndex, // 编辑框当前条数
    cateId, // 编辑弹框搜索id
    findTreeList, // 编辑弹框物资类别
    scmInGoodsList, // 编辑弹框物资全部
    paginationGoods, // 物资分类分页
    selectedRowKeysModal, // 物资弹窗选中
    dataAll, // 编辑时返回全部
    update, // 新增还是编辑
    dataSourceNew, // 新增返回时修改的数据
    billNo, // 采购订单
    distribId,
    supplierList, // 供应商数组
    addDepotIdList, // 门店仓库数组
    dataSourceIndex, // 判断编辑返回的时候有几条数据
    modalSelectValue,
    exportModalList,
    delIdsList, // 删除全部
    arrivalDate,
  } = supplyData.supplyOrder;
// console.log("aclStoreListAll",aclStoreListAll);
  const supplyOrderAddNewListProps = { // 新增列表
    loading,
    storeId,
    pagination, // 首页分页
    dataList,
    typeList,
    status,
    editableMem,
    newData,
    dataSource,
    goodsList,
    bussDate, // 新增订单日期
    storeAddId, // 新增收货机构
    busiId, // 供应商id
    remarks, // 备注id
    update, // 新增还是编辑
    dataAll, // 编辑时返回全部
    dataSourceIndex, // 判断编辑返回的时候有几条数据
    onPageChange(page) { // 修改分页
      dispatch({
        type: 'supplyOrder/findScmInGoods',
        payload: {
          page: page.current,
          rows: page.pageSize,
          limit: '20',
          status: '1',
        },
      });
    },
    updateEditableMem(targetField,index) { // 回车跳转新的边框或者新增一行
      // console.log("BBB");
      // console.log("targetField in updateEditableMem",targetField,index+1);
      dispatch({
        type: 'supplyOrder/updateEditableMem',
        payload: { targetField, index },
      });
    },
    onPageSizeChange(current, pageSize) { // 修改页条数
      dispatch({
        type: 'supplyOrder/query',
        payload: {
          page: 1,
          rows: pageSize,
        },
      });
    },
    queryGoodsCoding(queryString) { // 查找编码
      dispatch({
        type: 'supplyOrder/queryGoodsCoding',
        payload: { limit: 20, status: 1, storeId, queryString },
      });
    },
    onUpdateAdd() {  // busiId || !storeAddId || !busiId
      if (!storeAddId) {
        message.error('门店名称不能为空！');
        return false;
      } else if (!busiId) {
        message.error('供应商不能为空！');
        return false;
      } else if (!bussDate) {
        message.error('订单日期不能为空！');
        return false;
      }
      return null;
    },
    updatedataSource(rowItem, itemKey) { // 修改
      // console.log("----------rowItem",rowItem);
      let ordAdjustNum = '',
        unitNum = '',
        ordPrice = '',
        goodsAmt = '',
        ordPriceNotax = '',
        goodsAmtNotax = '';
      // 当是编辑的时候，并且是手工创建的不要订单 billSource订单来源 1 生成 2 手工创建
      // if (update && dataAll.billSource && dataAll.billSource === 1) {
      //   // ordAdjustNum 调整数量 公式：调整数量 = 采购数量
      //   // ordAdjustNum = rowItem.ordUnitNum ? rowItem.ordUnitNum : rowItem.ordAdjustNum;
      //   // unitNum 标准数量 公式：标准数量 = 调整数量(ordAdjustNum)/采购转换率(ordUnitRates)
      //   unitNum = (rowItem.ordAdjustNum ? (rowItem.ordAdjustNum / (rowItem.ordUnitRates || 1)) : 0);
      //   // 判断采购单价(ordPrice)初始化取值
      //   ordPrice = rowItem.ordPrice ? rowItem.ordPrice : (rowItem.lastPrice ? rowItem.lastPrice : rowItem.goodsPrice);
      //   // goodsAmt 采购金额 公式：采购金额 = 调整数量(ordAdjustNum)*采购单价(ordPrice)
      //   goodsAmt = rowItem.ordAdjustNum ? rowItem.ordAdjustNum * (rowItem.ordUnitRates || 1) : 0;
      //     // ordPriceNotax 不含税单价 公式：不含税单价 = 采购单价(ordPrice)/(1+税率(taxRatio))
      //   ordPriceNotax  = (ordPrice ? (ordPrice / (1 + Number(rowItem.taxRatio))) : 0);
      //   // const ordPriceNotax = (ordPrice ? (ordPrice / (1 + Number(rowItem.taxRatio))) : 0);
      //   // goodsAmtNotax 不含税金额 公式：不含税金额 = 不含税单价(ordPriceNotax)*调整数量(ordAdjustNum)
      //   goodsAmtNotax = (rowItem.ordAdjustNum ? (rowItem.ordAdjustNum * ordPriceNotax) : 0);
      // //   console.log(
      // //     " ordUnitNum 采购数量 ", rowItem.ordUnitNum,
      // //     " ordAdjustNum 调整数量 ordUnitNum",ordAdjustNum,
      // //     " rowItem.ordUnitRates 采购转换率",rowItem.ordUnitRates,
      // //     " unitNum 标准数量 ",unitNum,
      // //     " 判断采购单价(ordPrice)初始化取值",ordPrice,
      // //     " goodsAmt 采购金额 ",goodsAmt,
      // //     " ordPriceNotax 不含税单价 ",ordAdjustNum,
      // //     " goodsAmtNotax 不含税金额 ",goodsAmtNotax,
      // // )
      // } else {
        // ordAdjustNum 调整数量 公式：调整数量 = 采购数量
      ordAdjustNum = rowItem.ordUnitNum ? rowItem.ordUnitNum : rowItem.ordAdjustNum;
      // unitNum 标准数量 公式：标准数量 = 采购数量(ordUnitNum)/采购转换率(ordUnitRates)
      unitNum = (rowItem.ordUnitNum ? (rowItem.ordUnitNum / (rowItem.ordUnitRates || 1)) : 0);
      // 判断采购单价(ordPrice)初始化取值
      ordPrice = rowItem.ordPrice ? rowItem.ordPrice : (rowItem.lastPrice ? rowItem.lastPrice : (rowItem.goodsPrice || 0));
      // goodsAmt 采购金额 公式：采购金额 = 采购数量(ordUnitNum)*采购单价(ordPrice)
      goodsAmt = rowItem.ordUnitNum ? rowItem.ordUnitNum * (rowItem.ordUnitRates || 1) : 0;
        // ordPriceNotax 不含税单价 公式：不含税单价 = 采购单价(ordPrice)/(1+税率(taxRatio))
      ordPriceNotax  = (ordPrice ? (ordPrice / (1 + Number(rowItem.taxRatio))) : 0);
      // const ordPriceNotax = (ordPrice ? (ordPrice / (1 + Number(rowItem.taxRatio))) : 0);
      // goodsAmtNotax 不含税金额 公式：不含税金额 = 不含税单价(ordPriceNotax)*采购数量(ordUnitNum)
      goodsAmtNotax = (rowItem.ordUnitNum ? (rowItem.ordUnitNum * ordPriceNotax) : 0);
      //   console.log(
      //     " ordUnitNum 采购数量 ", rowItem.ordUnitNum,
      //     " ordAdjustNum 调整数量 ordUnitNum",ordAdjustNum,
      //     " rowItem.ordUnitRates 采购转换率",rowItem.ordUnitRates,
      //     " unitNum 标准数量 ",unitNum,
      //     " 判断采购单价(ordPrice)初始化取值",ordPrice,
      //     " goodsAmt 采购金额 ",goodsAmt,
      //     " ordPriceNotax 不含税单价 ",ordAdjustNum,
      //     " goodsAmtNotax 不含税金额 ",goodsAmtNotax,
      // )
      // }
      const updateDataSource = Object.assign({}, rowItem, { ordAdjustNum, unitNum, ordPrice, goodsAmt, ordPriceNotax, goodsAmtNotax });
      // console.log("----------updateDataSource",updateDataSource);
      // const dataSourceAll = Object.assign( dataSource, updateDataSource);

      const newDataSource = _.cloneDeep(dataSource);
      newDataSource.map((item, i) => { // 查找出来
        if (item.key === itemKey)
          newDataSource.splice(i, 1);
      })
      // console.log("000000000000000000000dataSource",newDataSource,dataSource)
      newDataSource.push(updateDataSource);
        // console.log("-------------------newDataSource",newDataSource);
      // return false;
      dispatch({
        type: 'supplyOrder/querySuccess',
        payload: { dataSource: newDataSource },
      });
    },
    addData(index) { // 新增一行
      dispatch({
        type: 'supplyOrder/addTable',
        payload: {
          rowindex: index,
        },
      });
      dispatch({ // 初始化编辑table
        type: 'supplyOrder/editableMem',
        payload: { dataSource: [] },
      });
    },
    onDelete(index, deltId) { // 删除一行
      const newDataSource = [...dataSource];
      const newPageData = _.cloneDeep(dataSource); // 使用新对象
      newDataSource.splice(index, 1);
      dispatch({
        type: 'supplyOrder/deleteTable',
        payload: {
          dataSource: newDataSource,
        },
      });
      if (update) {
        const isRemove = _.find(dataSourceIndex, newDate => newDate.id === newPageData[index].id);
        if (isRemove) {
          delIdsList.push(deltId);
          dispatch({
            type: 'supplyOrder/querySuccess',
            payload: { delIdsList },
          });
          // yield put({ type: 'querySuccess', payload: { delIdsList } });
        }
        // delIdsList.push(deltId);
        // dispatch({
        //   type: 'supplyOrder/querySuccess',
        //   payload: { delIdsList },
        // });
      }
    },
    resyncDataSource(value) { // 联动修改数量
      dispatch({
        type: 'supplyOrder/querySuccess',
        payload: {
          dataSource: value,
        },
      });
    },
    cancel() { // 取消
      dispatch({  // 判断是否要取消
        type: 'supplyOrder/cancelAll',
        payload: {},
      });
      // console.log("dataSourceUpdate",dataSourceNew);
      dispatch({
        type: 'supplyOrder/querySuccess',
        payload: {
          dataSource: _.cloneDeep(dataSourceNew),
          bussDate: moment(new Date()).format('YYYY-MM-DD'),
          arrivalDate: moment(new Date()).format('YYYY-MM-DD'),
          storeAddId: '',
          busiId: '',
          remarks: '',
          billNo: '',
          dataSourceIndex: [],
          delIdsList: [],
          newDisableSource: [],
        },
      });
    },
    setDisableSource(value) { // 取消
      // console.log("dataSourceUpdate",dataSourceNew);
      dispatch({
        type: 'supplyOrder/querySuccess',
        payload: {
          newDisableSource: value,
        },
      });
    },
    onSave(value) {
      // console.log("---------------数据----",dataSource,"value",value);
      const newDataSource = [];
      let isValid = true;
      const dataNewSource = dataSource.filter(item => item.goodsCode);
      if (!dataNewSource.length) {
        message.error('第一行物资编码不能为空');
        isValid = false;
        return false;
      }
      const invalidiGoodsCode = _.findIndex(dataNewSource, item => !item.goodsCode);
      if (invalidiGoodsCode >= 0) {
        message.error(`第${invalidiGoodsCode + 1}行“物品编码”数据无效，请检查！`, 5);
        isValid = false;
        return null;
      }
      const invalidiOrdPrice = _.findIndex(dataNewSource, item => !item.ordPrice);
      if (invalidiOrdPrice >= 0) {
        message.error(`第${invalidiOrdPrice + 1}行“采购单价”数据无效，请检查！`, 5);
        isValid = false;
        return null;
      }
      dataNewSource.map((item, index) => {
        // if (!item.goodsCode) {
        //   message.error(`第${index + 1}行物资编码不能为空`);
        //   isValid = false;
        //   return false;
        // }
        // if (!item.ordPrice) {
        //   message.error(`第${index + 1}行采购单价不能为空`);
        //   isValid = false;
        //   return false;
        // }
        // console.warn("update", update, "dataAll.billSource", dataAll.billSource, "item.billSource === 1", dataAll.billSource === 1 ,"!item.ordAdjustNum" ,(!item.ordAdjustNum));
        // if (update && dataAll.billSource && dataAll.billSource === 1 && (!item.ordAdjustNum)) {
        //   message.error(`第${index + 1}行调整数量不能为空`);
        //   isValid = false;
        //   return false;
        // }
        let newsId = '';
        let newsGoodsId = '';
        const isRemove = _.find(dataSourceIndex, newDate => newDate.id === item.id);

        (update && isRemove) ? (newsId = item.id) : newsId;
        (update && isRemove) ? (newsGoodsId = item.goodsId) : (newsGoodsId = item.id);
        newDataSource.push({
          id: newsId,
          // storeId: storeAddId,
          goodsId: newsGoodsId,
          goodsCode: item.goodsCode,
          goodsName: item.goodsName,
          goodsSpec: item.goodsSpec,
          unitId: item.unitId,
          // arrivalDate: moment(item.arrivalDate).format('YYYY-MM-DD'),
          unitName: item.unitName,
          unitNum: item.unitNum,
          ordUnitId: item.ordUnitId,
          ordUnitName: item.ordUnitName,
          ordUnitNum: item.ordUnitNum,
          ordAdjustNum: item.ordAdjustNum,
          dualUnitId: item.dualUnitId,
          dualUnitName: item.dualUnitName,
          dualUnitNum: item.dualUnitNum,
          ordPrice: item.ordPrice,
          ordPriceNotax: item.ordPriceNotax,
          taxRatio: item.taxRatio,
          goodsAmt: item.goodsAmt,
          goodsAmtNotax: item.goodsAmtNotax,
          purcUnitId: item.purcUnitId,
          purcUnitName: item.purcUnitName,
          purcUnitRates: item.purcUnitRates,
          ordUnitRates: item.ordUnitRates,
          remarks: item.remarks,
        });
      });
      if (!isValid) {
        return false;
      }
      // console.log("newDataSource",newDataSource,"dataAll", dataAll,"dataAll.storeName", dataAll.id);
      // return false;
      if (update) { // 编辑
        dispatch({
          type: 'supplyOrder/addScmDirectManual',
          payload: {
            id: dataAll.id,
            bussDate, // 订单日期
            arrivalDate,
            storeId: dataAll.storeId, // 收货机构id
            storeName: dataAll.storeName, // 收货机构id
            billType: dataAll.billType, // 订单类型
            billSource: dataAll.billSource, // 订单来源
            status: value ? '964' : '962', // 订单状态
            busiId: dataAll.busiId, // 供应商id
            busiName: dataAll.busiName, // 供应商id
            delIdsList,
            remarks, // 备注
            distribId,
            scmDirectDetailList: newDataSource,
          }
        })
      } else { // 新增
        // aclStoreListAll.map()
        const aclStoreAll = _.find(addDepotIdList, item => item.id === storeAddId)
        const busiListAll = _.find(supplierList, item => item.id === busiId)
        dispatch({
          type: 'supplyOrder/addScmDirectManual',
          payload: {
            id: '',
            bussDate, // 订单日期
            arrivalDate,
            storeId: storeAddId, // 收货机构id
            storeName: aclStoreAll.name, // 收货机构id
            billType: '934', // 订单类型
            billSource: '2', // 订单来源
            status: value ? '964' : '962', // 订单状态
            busiId, // 供应商id
            distribId,
            busiName: busiListAll.suppName, // 供应商id
            scmDirectDetailList: newDataSource,
            remarks,
          }
        })
      }
    },
    openGoodsModel(value) { // 打开弹窗
      dispatch({
        type: 'supplyOrder/querySuccess',
        payload: {
          goodsVisible: true,
          modalRowIndex: value,
          cateId: '',
        },
      });
      dispatch({ // 查找物资类别
        type: 'supplyOrder/findTreeList',
        payload: { type: 0 },
      });
      // console.log("000000000000000000");
      dispatch({
        type: 'supplyOrder/findScmInGoods',
        payload: {
          limit: '20',
          status: '1',
          queryString: '',
        },
      });
    },
  };
  const supplyOrderAddNewSearchProps = { // 新增搜索
    storeList: addDepotIdList, // 全部机构
    storeAddId, // 机构id
    busiId, // 供应商id
    billNo, // 采购订单
    dataAll, // 编辑时返回全部
    update, // 新增还是编辑
    remarks, // 备注
    supplierList, // 供应商数组
    bussDate,
    arrivalDate,
    queryAll(value) { // 搜索全部
      console.log(value);
    },
    onAdd() { // 新增采购订单
      dispatch({
        type: 'supplyOrder/addNewList',
      });
    },
    updateAudit() { // 弃审
      // dispatch({
      //   type: 'supplyOrder/querySuccess',
      //   payload: {
      //     storeId: value,
      //   },
      // });
    },
    // upadateTime(rule, value, cb) { // 修改时间
    upadateTime(value) { // 修改时间
      if (moment(arrivalDate).isBefore(moment(value))) {
        message.error('到货日期不允许超出您要设置的请购日期，请修改！', 3);
        // console.log("11111111111111111111111111");
      } else {
        // console.log("2222222222222222222");
        const bussDateValue = value.format('YYYY-MM-DD');
        dispatch({
          type: 'supplyOrder/querySuccess',
          payload: { bussDate: bussDateValue },
        });
      }
    },
    selectedBussDate(value) { // 修改时间
      // if (moment(bussDate).isBefore(moment(value))) {
      //   message.info('到货日期不允许超出您要设置的请购日期，请修改！', 5);
      // } else {
      if (value) {
        const bussDateValue = value.format('YYYY-MM-DD');
        dispatch({
          type: 'supplyOrder/querySuccess',
          payload: { arrivalDate: bussDateValue },
        });
      }
    },
    upadateStore(value) { // 收货机构
      if (value) {
        dispatch({
          type: 'supplyOrder/querySuccess',
          payload: { storeAddId: value },
        });
      }
    },
    upadateBusi(value) { // 供应商
      if (value) {
        dispatch({
          type: 'supplyOrder/querySuccess',
          payload: { busiId: value },
        });
      }
    },
    upadateRemarks(value) { // 供应商
      if (value) {
        dispatch({
          type: 'supplyOrder/querySuccess',
          payload: { remarks: value.target.value },
        });
      }
    },
  };
  const supplyOrderAddNewModalProps = {
    visible: goodsVisible,
    dataTree: findTreeList,
    paginationGoods,
    modalRowIndex,
    cateId,
    exportModalList,
    selectedRowKeys: selectedRowKeysModal,
    scmInGoodsList,
    dataSource,
    modalSelectValue,
    onCancel() {
      dispatch({
        type: 'supplyOrder/querySuccess',
        payload: {
          goodsVisible: false,
          scmInGoodsList: [],
          dataTree: [],
          cateId: '',
          selectedRowKeysModal: [],
          modalSelectValue: '',
          exportModalList: [],
        },
      });
      // dispatch({
      //   type: 'supplyOrder/querySuccess',
      //   payload: {
      //
      //   },
      // });
    },
    onModalChange(value) {
      // console.log("物资名称",value.target.value);
      dispatch({
        type: 'supplyOrder/querySuccess',
        payload: {
          modalSelectValue: value.target.value,
        },
      });
    },
    onModalSearch(value) {
      if (cateId) {
        dispatch({
          type: 'supplyOrder/findScmInGoods',
          payload: {
            cateId,
            limit: '20',
            status: '1',
            rows: 10,
            page: 1,
            queryString: value,
          },
        });
      } else {
        dispatch({
          type: 'supplyOrder/findScmInGoods',
          payload: {
            limit: '20',
            status: '1',
            rows: 10,
            page: 1,
            queryString: value,
          },
        });
      }
    },
    goodsModalExport(keys, value) {
      // console.log("value111",keys,"要插入的",value,"现在",dataSource,modalRowIndex);
      const oldData = exportModalList || [];
      const newData = value;
      let allData = [];
      allData = oldData.concat(newData);
      allData = _.uniqBy(allData, 'id');
      dispatch({
        type: 'supplyOrder/querySuccess',
        payload: {
          selectedRowKeysModal: keys,
        },
      });
      dispatch({
        type: 'supplyOrder/querySuccess',
        payload: {
          exportModalList: allData,
        },
      });
    },
    removeGoodsExport(record, selected, selectedRows) {  // 删除的数据
      // console.log("11111selected----------",selected ,record.id);
      if (selected === false) { // 取消选择
        const goodsRowConcatListClone = _.cloneDeep(exportModalList);
        _.remove(goodsRowConcatListClone, (item) => {
            //  console.log("item.id",item.id);
          return item.id === record.id;
        });
        // console.warn("goodsRowConcatListClone",goodsRowConcatListClone);
        dispatch({
          type: 'supplyOrder/querySuccess',
          payload: {
            exportModalList: goodsRowConcatListClone,
          },
        });
      }
      // console.log("我是删除的-----", priorityRowList, newPriorityRowList);
    },
    storeExportAll(selected, selectedRows, changeRows) {  // 删除的数据
      // console.log("2222selected----------",selected,selectedRows,changeRows);
      if (selected === false) { // 取消选择
        const goodsRowConcatListClone = _.cloneDeep(exportModalList);
        scmInGoodsList.map((item) => {
          _.remove(goodsRowConcatListClone, data => {
              // console.log("item.id",item.id);
            return data.id === item.id;
          });
        });
        // console.log("你好删除的数据",goodsRowConcatListClone);
        dispatch({
          type: 'supplyOrder/querySuccess',
          payload: {
            exportModalList: goodsRowConcatListClone,
          },
        });
      }
      // console.log("我是删除的-----", priorityRowList, newPriorityRowList);
    },
    onPageChange(page) {
      if (cateId) {
        dispatch({
          type: 'supplyOrder/findScmInGoods',
          payload: {
            page: page.current,
            rows: page.pageSize,
            storeId,
            limit: '20',
            status: '1',
            cateId,
            queryString: modalSelectValue,
          },
        });
      } else {
        dispatch({
          type: 'supplyOrder/findScmInGoods',
          payload: {
            page: page.current,
            rows: page.pageSize,
            storeId,
            limit: '20',
            status: '1',
            queryString: modalSelectValue,
          },
        });
      }
    },
    onSelectMenu(selectedKeys, info){
      dispatch({
        type: 'supplyOrder/findScmInGoods',
        payload: {
          cateId: selectedKeys[0],
          storeId,
          limit: '20',
          status: '1',
          rows: 10,
          page: 1,
          queryString: modalSelectValue,
        },
      });
      dispatch({
        type: 'supplyOrder/querySuccess',
        payload: {
          cateId: selectedKeys[0],
        },
      });
    },
    okHideModal() {
      dispatch({
        type: 'supplyOrder/querySuccess',
        payload: {
          goodsVisible: false,
          modalSelectValue: '',
          selectedRowKeysModal: [],
          cateId: '',
        },
      });
      dispatch({
        type: 'supplyOrder/exportModalListAll',
        payload: {},
      });
    },
  };
  return (
    <div className="routes">
      <SupplyOrderAddNewSearch {...supplyOrderAddNewSearchProps} />
      <SupplyOrderAddNewList {...supplyOrderAddNewListProps} />
      <SupplyOrderAddNewModal {...supplyOrderAddNewModalProps} />
    </div>
  );
};
supplyOrderAddNew.propTypes = {
  dispatch: PropTypes.func,
};
function mapStateToProps(supplyData) {
  return { supplyData };
}

export default connect(mapStateToProps)(supplyOrderAddNew);
