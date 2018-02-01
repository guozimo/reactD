import React, { PropTypes } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Table, Icon, Button, Tooltip, Popconfirm, message } from 'antd';
import EditableCell from '../../_components/EditableCell2';

const StockOutDetailsList = ({
  // module state
  storeId,
  depotId,
  billType,
  pageType,
  loading,
  pageDetail,
  editableMem,
  goodsList,
  pageStatus,
  savingStatus,
  bussDate,

  goodsPopListModel, // 弹窗数据
  popupListPagination,
  foundTreeList,

  // module 方法
  switchType,
  resyncDataSource,
  getGoodsListByTyping,
  syncMem,
  openGoodsModel,
  syncSeletedItemIntoRow,
  insertNewRowAfterIndex,
  removeRowAtIndex,
  saveDetails,
  cancelDetailPage,
  switchEditingStatus,
  toNextMem,
  toggleMemStatus,

  getGoodsListdata,
  onPopupPageChange,
  onPopupPageSizeChange,
  onSelectedTreeItem,
  selectModalSearch,

  // 私有方法
  renderColumns,
  refreshList,
  selectedAGoods,
  onUpdateAdd,
  selectedListGoods,
  openModel,
  showGoodsListByTyping,
  savePageData,
  dataSourceIndex,
  onCloseModel,
}) => {
  // 序号，物资编码，物资名称，规格型号，（标准/单位，数量），剩余库存，（辅助/单位，数量），出库单价，出库金额，备注，操作
  let columnsConfig = [];
  let listData = pageDetail;
  // console.log('StockOutDetailsList listData',listData);
  if (pageType === 'view') {
    columnsConfig = [{
      title: '',
      dataIndex: 'index',
      key: 'index',
      width: 40,
      render: (text, record, index) => (parseInt(index) + 1),
    }, {
      title: '物资编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
    }, {
      title: '物资名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
    }, {
      title: '规格型号',
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
    }, {
      title: '标准',
      children: [{
        title: '数量', // 标准数量=订货单位转换率*订货数量
        dataIndex: 'goodsQty',
        key: 'goodsQty',
      }, {
        title: '单位',
        dataIndex: 'unitName',
        key: 'unitName',
      }],
    }, {
      title: '剩余库存',
      dataIndex: 'wareQty',
      key: 'wareQty',
    }, {
      title: '辅助',
      children: [{
        title: '数量', // 标准数量=订货单位转换率*订货数量
        dataIndex: 'dualGoodsQty',
        key: 'dualGoodsQty',
        width: 70,
      }, {
        title: '单位',
        dataIndex: 'dualUnitName',
        key: 'dualUnitName',
      }, {
        title: '库存',
        dataIndex: 'dualWareQty',
        key: 'dualWareQty',
        width: 60,
      }],
    }, {
      title: '出库单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 80,
    }, {
      title: '出库金额',
      dataIndex: 'goodsAmt',
      key: 'goodsAmt',
      width: 80,
    }, {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 150,
      render: text => <Tooltip placement="leftTop" title={text}>
        <div className="ellipsed-line width-150">{text}</div>
      </Tooltip>,
    }];
  } else {
    columnsConfig = [{
      title: '',
      dataIndex: 'index',
      key: 'index',
      width: 40,
      render: (text, record, index) => (parseInt(index) + 1),
    }, {
      title: '物资编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
      width: 120,
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'goodsCode', {
        rowIdent: record.id,
        type: 'select',
        onKeyEnter: () => toNextMem(index, 'goodsCode'),
        disabled: !storeId || !depotId || !billType,

        onChange: showGoodsListByTyping, // 手动输入的回调
        selectItem: (itemValue, itemId) => { toNextMem(index, 'goodsCode'); selectedAGoods(itemValue, itemId, index, 'goodsCode'); }, // 选择手动输入后列表的一个项目
        keyValues: goodsList, // 显示响应手动输入的列表数据

        getPopListData: getGoodsListdata, // 第一次显示列表时触发获取数据的方法
        disabledList: (() => listData.map(item => item.goodsCode))(), // 指定下拉列表中已显示的不让其可选，暂时实现只匹配ID
        popListData: goodsPopListModel, // getPopListData 获取的 table 里的数据
        cbReceiveChoose: (data) => { // 选择的几条数据
          const selectedList = _.cloneDeep(data);
          selectedListGoods(selectedList, index, 'goodsCode', true);
        },

        foundTreeList, // tree 数据
        onSelectTreeItem: value => onSelectedTreeItem(value), // 选择tree的类别节点
        onModalSearch: value => selectModalSearch(value), // modal的模糊搜索
        onCloseModel: value => onCloseModel(value), // modal的关闭触发
        popListPagination: popupListPagination, // 翻页配置
        onPopPageChange: onPopupPageChange, // 翻页方法
        onPopPageSizeChange: onPopupPageSizeChange, // 修改页尺寸
        originalProps: {
          // onFocusInput: () => toggleMemStatus(index, 'goodsCode'), // 修改其他的编辑状态为非编辑状态
        },
      }),
    }, {
      title: '物资名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
    }, {
      title: '规格型号',
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
    }, {
      title: '标准',
      children: [{
        title: '数量', // 标准数量=订货单位转换率*订货数量
        dataIndex: 'goodsQty',
        className: 'editable-col',
        width: 70,
        key: 'goodsQty',
        render: (text, record, index) => renderColumns(text, record, index, 'goodsQty', {
          type: 'number',
          rowIdent: record.id,
          disabled: !storeId || !depotId || !billType,
          updateValue: (value, itemKey) => refreshList(value, itemKey, 'goodsQty', index),
          transValue: record.goodsQty,
          originalProps: {
            style: { width: 50 },
            onPressEnter: () => toNextMem(index, 'goodsQty', (!record.dualUnitName)), // 跳转到下一个编辑状态
            // onFocusInput: () => toggleMemStatus(index, 'goodsQty'), // 修改其他的编辑状态为非编辑状态
          },
        }),
      }, {
        title: '单位',
        dataIndex: 'unitName',
        key: 'unitName',
        width: 50,
      }],
    }, {
      title: '剩余库存',
      dataIndex: 'wareQty',
      key: 'wareQty',
      width: 70,
    }, {
      title: '辅助',
      children: [{
        title: '数量',
        dataIndex: 'dualGoodsQty',
        key: 'dualGoodsQty',
        width: 70,
        className: 'editable-col', // 单元格变色，可编辑
        render: (text, record, index) => renderColumns(text, record, index, 'dualGoodsQty', {
          type: 'number',
          rowIdent: record.id,
          disabled: !storeId || !depotId || !billType,
          isShow: !record.dualUnitName, // record.dualUnitFlag == '1' 可以修改
          updateValue: (value, itemKey) => refreshList(value, itemKey, 'dualGoodsQty', index),
          transValue: record.dualGoodsQty,
          originalProps: {
            style: { width: 50 },
            onPressEnter: () => toNextMem(index, 'dualGoodsQty'), // 跳转到下一个编辑状态
            // onFocusInput: () => toggleMemStatus(index, 'dualGoodsQty'), // 修改其他的编辑状态为非编辑状态
          },
        }),
      }, {
        title: '单位',
        dataIndex: 'dualUnitName',
        key: 'dualUnitName',
        width: 50,
      }, {
        title: '库存',
        dataIndex: 'dualWareQty',
        key: 'dualWareQty',
        width: 60,
      }],
    }, {
      title: '出库单价',
      dataIndex: pageType === 'edit' ? 'unitPrice' : 'goodsPrice',
      key: pageType === 'edit' ? 'unitPrice' : 'goodsPrice',
      render: (text, record) => record.unitPrice ? record.unitPrice : record.goodsPrice,
    }, {
      title: '出库金额',
      dataIndex: 'goodsAmt',
      key: 'goodsAmt',
    }, {
      title: '备注',
      dataIndex: 'remarks',
      width: 100,
      key: 'remarks',
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'remarks', {
        rowIdent: record.id,
        updateValue: (value, itemKey) => refreshList(value, itemKey, 'remarks', index),
        transValue: record.remarks,
        disabled: !storeId || !depotId || !billType,
        maxLength: 25,
        originalProps: {
          style: { width: 80 },
          onPressEnter: () => toNextMem(index, 'remarks'), // 跳转到下一个编辑状态
          // onFocusInput: () => toggleMemStatus(index, 'remarks'), // 修改其他的编辑状态为非编辑状态
        },
      }),
    }, {
      title: '操作',
      dataIndex: 'options',
      key: 'options',
      width: 60,
      render: (text, record, index) => (storeId && depotId && billType) ? <div>
        <Tooltip placement="top" title="新增一行">
          <Icon
            type="plus"
            style={{ fontSize: 20, color: '#08c', cursor: 'pointer' }}
            onClick={() => insertNewRowAfterIndex(index)}
          />
        </Tooltip>
        {
          listData.length > 1
          ? <Popconfirm
            title={<div><span style={{ color: '#f04134' }}>危险操作！</span><br /><span>删除后可能无法恢复，确定继续删除吗？</span></div>}
            okText="确认删除"
            onConfirm={() => removeRowAtIndex(record.id, index)}
          >
            <Icon type="minus" style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
          : null
        }
      </div> : '',
    }];
  }
  refreshList = (value, itemKey, fieldName, rowIndex) => {
    // 更新文本框
    const rowItem = _.find(listData, item => item.id === itemKey);
    rowItem[fieldName] = value;
    // 联动更新
    // console.log("value, rowItem.purcUnitRates", value, rowItem.purcUnitRates,value * (rowItem.purcUnitRates || 1))
    if (rowItem.unitPrice) {
      rowItem.goodsPrice = rowItem.unitPrice;
    } else {
      rowItem.unitPrice = rowItem.goodsPrice;
    }
    const price = rowItem.unitPrice || rowItem.goodsPrice;
    if (pageType === 'add' && rowItem.goodsCode && rowItem.goodsQty) {
      rowItem.goodsAmt = Math.round((rowItem.goodsQty * price) * 10000) / 10000;
    } else if (pageType === 'edit' && rowItem.goodsCode && rowItem.goodsQty) {
      rowItem.goodsAmt = Math.round((rowItem.goodsQty * price) * 10000) / 10000;
    }
    if (fieldName === 'arrivalDate') {
      // 修改为非编辑状态
      switchEditingStatus(rowIndex, fieldName, false);
    }

    listData = _.cloneDeep(listData);
    resyncDataSource(listData);
  };

  openModel = (value) => { // 打开物资弹窗
    openGoodsModel(value);
  };

  selectedAGoods = (itemValue, itemId, index, fieldName) => {
    const selectedItem = _.find(goodsList, item => item.goodsCode === itemValue);
    // const rowItem = _.find(listData, item => item.id === itemId);
    // console.log('selectedItem', selectedItem, itemValue, itemId, index);
    syncSeletedItemIntoRow([selectedItem], index, fieldName);
    // Object.assign(rowItem, selectedItem);
  };
  selectedListGoods = (selectedList, index, fieldName, isModal) => {
    // console.log('selectedList', selectedList);
    syncSeletedItemIntoRow(selectedList, index, fieldName, isModal);
  };
  savePageData = (status) => {
    saveDetails(status);
  };
  renderColumns = (text, record, index, field, configurations) => {
    const editable = '';
    const status = false;
    const currEditStatus = editableMem[index];
    const listDataRenderError = _.cloneDeep(listData);
    const lineItem = listDataRenderError[index];


    const fields = Object.keys(currEditStatus);
    // console.log("currEditStatus",currEditStatus);
    // if (!currEditStatus || (currEditStatus && !(currEditStatus.hasOwnProperty(field)))) {
      // syncMem(field); // 生成编辑内容行列信息
      // return false;
    // }
    let newdataSourceIndex = 1;
    dataSourceIndex && dataSourceIndex.length ? (newdataSourceIndex = dataSourceIndex.length) : newdataSourceIndex;
    if (!_.has(editableMem[index], field)) {
      if (index == editableMem.length - 1 && (field == fields[0] || fields.length == 0) && editableMem.length !== newdataSourceIndex) { // 第一条不能是自动选中状态
      //  console.log('fixed field is configurations.hideField', configurations.hideField);
        currEditStatus[field] = true;
      } else {
        currEditStatus[field] = false; // 默认不在编辑状态
      }
    }
    if (typeof editable === 'undefined') {
      return text;
    }
    return (<EditableCell
      configurations={configurations}
      inEditStatus={currEditStatus}
      field={field}
      inValue={text}
      onChange={value => this.handleChange(field, index, value)}
      status={status}
      openModel={openModel}
      goodsList={goodsList}
      validation={lineItem}
      rowIndex={index}
      clickToEdit={() => {
        currEditStatus[field] = !currEditStatus[field];
      }}
    />);
  };
  showGoodsListByTyping = (value) => {
    getGoodsListByTyping(value);
  };
  return (
    <div>
      <br />
      <Table
        bordered
        size="small"
        columns={columnsConfig}
        loading={loading}
        dataSource={listData}
        pagination={false}
        onRowClick={onUpdateAdd}
        rowKey={record => record.id}
        rowClassName={() => 'editable-row'}
      />
      <br />
      {(pageType === 'edit' || pageType === 'add') && pageStatus !== 961 && pageStatus !== 962
        && <span><Button onClick={() => savePageData(961)} disabled={savingStatus}>暂存</Button>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
      {(pageType === 'edit' || pageType === 'add') && pageStatus !== 962
        && <span><Button type="primary" onClick={() => savePageData(962)} disabled={savingStatus}>出库</Button>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
      <Button onClick={cancelDetailPage}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
      {pageType === 'view' && pageStatus === 961 && <a href="javacript:void(0);" style={{ display: 'none' }} onClick={() => switchType('edit')}>启用编辑</a>}
      <div style={{ display: 'none' }}>{JSON.stringify(editableMem)}</div>
    </div>
  );
};

StockOutDetailsList.PropTypes = {
  pageType: PropTypes.string,
  pageStatus: PropTypes.string,
  switchType: PropTypes.func,
  resyncDataSource: PropTypes.func,
  getGoodsListByTyping: PropTypes.func,
  syncSeletedItemIntoRow: PropTypes.func,
  insertNewRowAfterIndex: PropTypes.func,
  saveDetails: PropTypes.func,
  removeRowAtIndex: PropTypes.func,
  openGoodsModel: PropTypes.func,
  switchEditingStatus: PropTypes.func,
  syncMem: PropTypes.func,
  editableMem: PropTypes.array,
  renderColumns: PropTypes.func,
  refreshList: PropTypes.func,
  cancelDetailPage: PropTypes.func,
  toNextMem: PropTypes.func,
  toggleMemStatus: PropTypes.func,

  getGoodsListdata: PropTypes.func,
  goodsPopListModel: PropTypes.object,
  onPopupPageChange: PropTypes.func,
  onPopupPageSizeChange: PropTypes.func,

  foundTreeList: PropTypes.array,
  onSelectedTreeItem: PropTypes.func,
};
export default StockOutDetailsList;
