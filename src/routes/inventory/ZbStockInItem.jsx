import React, { PropTypes } from 'react';
import { connect } from 'dva';
import ZbStockInItemForm from '../../components/Inventory/ZbStockIn/item';
import ZbStockInItemModal from '../../components/Inventory/_components/chooseGoodsModal';
import { deleteArray, deleteCodes } from '../../utils';

const ZbStockInItem = ({ stockInItemData, dispatch }) => {
  const {
    loading,
    loadingSave,
    loadingStock,
    pageType,
    goodsList,
    id,
    storeId,
    baseInfo,
    bussDate,
    monthDate,
    billType,
    depotId,
    busiId,
    busiName,
    depotName,
    remarks,
    detailList,
    eidtGoodsId,
    // 弹窗选择物资
    modalVisible,
    searchTree,
    listGoods,
    selectedRowKeys,
    paginationGoods,
    modalKey,
    cateId,
    selectedGoods,
    chooseGoodsCode,
    cacheSelectGoods,
    cacheGoodsCodes,
    goodsSearchValue,
    currentRow,
    validateList,
    // 下拉物资选择
    miniGoodsVisible,
    oldGoodsId,
    topMini,
    adaptRowHeight,
    hotTableHeight,
    cellValue,
    activeRow,
    goodsKeywords,
    isCodeChanging,
  } = stockInItemData.zbStockInItem;
  // console.warn('selectedGoods');
  // console.warn(selectedGoods);
  // console.warn(chooseGoodsCode);
  const ZbStockInItemFormProps = {
    loadingSave,
    loadingStock,
    pageType,
    goodsList,
    storeId,
    id,
    depotId,
    busiId,
    baseInfo,
    billType,
    busiName,
    bussDate,
    monthDate,
    depotName,
    remarks,
    chooseGoodsCode,
    oldGoodsId,
    detailList,
    eidtGoodsId,
    miniGoodsVisible,
    topMini,
    adaptRowHeight,
    hotTableHeight,
    cellValue,
    activeRow,
    goodsKeywords,
    isCodeChanging,
    validateList,
    onSupplierQuery(keywords) {
      const queryString = keywords || '';
      dispatch({
        type: 'zbStockInItem/querySupplier',
        payload: {
          status: 1,
          queryString,
          limit: 1000,
          rows: 1000,
        },
      });
    },
    onDepotQuery(keywords) {
      const queryString = keywords || '';
      dispatch({
        type: 'zbStockInItem/queryWarehouse',
        payload: {
          storeId,
          queryString,
          limit: 1000,
          rows: 1000,
        },
      });
    },
    onBusiIdSave(param) {
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          busiId: param,
        },
      });
    },
    onDepotIdSave(param) {
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          depotId: param,
        },
      });
    },
    onSaveStockIn(flag, param) {
      dispatch({
        type: 'zbStockInItem/saveStockIn',
        payload: {
          flag,
          param,
        },
      });
    },
    onBack() {
      dispatch({
        type: 'zbStockInItem/back',
        payload: {
          storeId,
        },
      });
    },
    onChooseGoods(row) {
      dispatch({
        type: 'zbStockInItem/showModal',
      });
      dispatch({
        type: 'zbStockInItem/queryGoods',
        payload: {
          rows: 10,
          depotId,
          storeId,
        },
      });
      // 弹窗的时候，清空关键字与类型,清空已选物资，防止产生冗余数据，因为新选的会追加
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          goodsSearchValue: null,
          cateId: null,
          selectedGoods: [],
          cacheSelectGoods: [],
          currentRow: row,
        },
      });
    },
    // 注意：缓存的已选物品编码跟已选物品数组也需要保存
    onSelectGood(data) {
      let codeArray = [];
      if (chooseGoodsCode) {
        codeArray = [...chooseGoodsCode, ...data.selectedCodes];
      } else {
        codeArray = data.selectedCodes;
      }
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          chooseGoodsCode: codeArray,
          cacheGoodsCodes: codeArray,
        },
      });
    },
    // 该删除方法是在下拉选修改了物资后的删除方法，因为新增的记录来不及插入，
    // 删除方法就执行了，所以要把最新的数据传递过来，
    // 注意：缓存的已选物品编码跟已选物品数组也需要保存
    onDeleteGoods(codes, codesArray) {
      const cntCodesArray = deleteCodes(codesArray, codes);
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          chooseGoodsCode: cntCodesArray,
          cacheGoodsCodes: cntCodesArray,
        },
      });
    },
    // 该删除方法是普通的删除方法，具体指点击“减”的按钮后执行的
    // 注意：缓存的已选物品编码跟已选物品数组也需要保存
    onDeleteGood(codes) {
      console.log('codes:', codes);
      const cntCodesArray = deleteCodes(chooseGoodsCode, codes);
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          chooseGoodsCode: cntCodesArray,
          cacheGoodsCodes: cntCodesArray,
        },
      });
    },
    onResizePage(value) {
      dispatch({
        type: 'zbStockInItem/resizePage',
        payload: {
          value,
        },
      });
    },
    // 新增一行
    onAddRow() {
      dispatch({
        type: 'zbStockInItem/addRow',
      });
    },
    // mini下拉选择物资相关方法
    onSelectMini(objArray) {
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          adaptRowHeight: 0,
          topMini: objArray.paramTopMini,
          cellValue: objArray.paramCellValue,
          activeRow: objArray.paramActiveRow,
          rowHeight: objArray.paramRowHeight,
          oldGoodsId: objArray.paramOldGoodsId,
        },
      });
    },
    onChangeRowHeight(value) {
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          adaptRowHeight: 0,
        },
      });
    },
    onChangeTopMini(value) {
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          topMini: value,
        },
      });
    },
    onHideMini() {
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          miniGoodsVisible: false,
        },
      });
    },
    onShowMini() {
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          miniGoodsVisible: true,
        },
      });
    },
    onGoodsCodeChanging(value) {
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          isCodeChanging: value,
        },
      });
    },
    onGoodsListQuery(keywords) {
      const queryString = keywords ? keywords.split('|')[0].trim() : '';
      if (queryString) {
        dispatch({
          type: 'zbStockInItem/queryGoodsMini',
          payload: {
            queryString,
            rows: 10,
            depotId,
            storeId,
          },
        });
        dispatch({
          type: 'zbStockInItem/querySuccess',
          payload: {
            goodsKeywords: queryString,
          },
        });
      } else {
        dispatch({
          type: 'zbStockInItem/querySuccess',
          payload: {
            goodsList: [],
            goodsKeywords: null,
          },
        });
      }
    },
    onMiniSelectInit(dataArray, row) {
      dispatch({
        type: 'zbStockInItem/selectGoodsMini',
        payload: {
          dataArray,
          row,
        },
      });
    },
    onChangeOldGooodsId(param) {
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          oldGoodsId: param || null,
        },
      });
    },
    onValidateListChange(param) { // 验证标识数组
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          validateList: param,
        },
      });
    },
  };
  const ZbStockInItemModalProps = {
    loading,
    title: '请选择物资',
    visible: modalVisible,
    dataTree: searchTree,
    dataSource: listGoods,
    queryRowId: selectedRowKeys,
    paginationGoods,
    key: modalKey,
    cateId,
    detailList,
    selectedGoods,
    chooseGoodsCode,
    cacheGoodsCodes,
    onOk() { // 如果点确定，暂存的门店选择数组跟门店码更新为已经选择的
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          cacheSelectGoods: selectedGoods,
          cacheGoodsCodes: chooseGoodsCode,
        },
      });
      dispatch({
        type: 'zbStockInItem/changeDetailList',
        payload: {
          selectedGoods,
          currentRow,
        },
      });
      dispatch({
        type: 'zbStockInItem/hideModal',
      });
    },
    onCancel() { // 如果点取消，门店选择数组跟门店编码用缓存编码代替
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          selectedGoods: cacheSelectGoods,
          chooseGoodsCode: cacheGoodsCodes,
        },
      });
      dispatch({
        type: 'zbStockInItem/hideModal',
      });
    },
    onSelectGoods(data) {
      let codeArray = [];
      if (chooseGoodsCode) {
        codeArray = [...chooseGoodsCode, ...data.selectedCodes];
      } else {
        codeArray = data.selectedCodes;
      }
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          selectedGoods: [...selectedGoods, ...data.selectedGoods],
          chooseGoodsCode: codeArray,
        },
      });
    },
    onDeleteGoods(codes) {
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          selectedGoods: deleteArray(selectedGoods, codes, 'id'),
          chooseGoodsCode: deleteCodes(chooseGoodsCode, codes),
        },
      });
    },
    onPageChange(page) {
      dispatch({
        type: 'zbStockInItem/queryGoods',
        payload: {
          page: page.current,
          rows: page.pageSize,
          cateId,
          queryString: goodsSearchValue,
          depotId,
          storeId,
        },
      });
    },
    onGoodsSearch(value) {
      dispatch({
        type: 'zbStockInItem/queryGoods',
        payload: {
          cateId,
          rows: 10,
          queryString: value,
          depotId,
          storeId,
        },
      });
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          goodsSearchValue: value,
        },
      });
    },
    onSelectMenu(selectedKeys, info){
      dispatch({
        type: 'zbStockInItem/queryGoods',
        payload: {
          cateId: selectedKeys[0],
          rows: 10,
          queryString: goodsSearchValue,
          depotId,
          storeId,
        },
      });
      dispatch({
        type: 'zbStockInItem/querySuccess',
        payload: {
          cateId: selectedKeys[0],
        },
      });
    },
  };
  return (
    <div className="routes">
      <ZbStockInItemForm {...ZbStockInItemFormProps} />
      <ZbStockInItemModal {...ZbStockInItemModalProps} />
    </div>
  );
};
ZbStockInItem.propTypes = {
  dispatch: PropTypes.func,
};
function mapStateToProps(stockInItemData) {
  return { stockInItemData };
}

export default connect(mapStateToProps)(ZbStockInItem);
