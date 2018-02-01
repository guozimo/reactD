import React, { PropTypes } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Table, Icon, Button, Tooltip, Popconfirm } from 'antd';
import EditableCell from '../../_components/EditableCell2';

const RequisitionDetailsList = ({
  // module state
  opType,
  loadingList,
  pageDetail,
  editableMem,
  goodsList,
  pageStatus,
  savingStatus,
  bussDate,
  storeId,
  outDepotId,
  inDepotId,
  popupListLoading,

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
  dataSourceIndex,
  saveDetails,
  cancelDetailPage,
  switchEditingStatus,
  toNextMem,
  toggleMemStatus,

  getGoodsListdata,
  onPopupPageChange,
  onPopupPageSizeChange,
  onSelectedTreeItem,
  // 私有方法
  renderColumns,
  refreshList,
  selectedAGoods,
  selectedListGoods,
  openModel,
  showGoodsListByTyping,
  savePageData,
  onUpdateAdd,
  selectModalSearch,
  onCloseModel,
}) => {
  // console.warn("popupListPagination",popupListPagination);
  // 序号 物资编码 物资名称 规格型号 订货单位 订货数量 标准单位 标准数量 备注 操作
  let columnsConfig = [];
  let listData = pageDetail;
  // pageDetail = pageDetail.results ? pageDetail.results : {};
  // console.log('pageDetail', pageDetail);
  // if (Object.keys(pageDetail).length) {
  //   listData = pageDetail.detailList;
  // console.log('listData', listData);
  // }
  // console.log("test moment",moment("2017-09-30T11:55:50.450Z").format('YYYY-MM-DD'))
  if (opType === 'view') {
    columnsConfig = [{
      title: '',
      dataIndex: 'index',
      width: 40,
      key: 'index',
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
      title: '单位',
      dataIndex: 'unitName',
      key: 'unitName',
    }, {
      title: '数量',
      dataIndex: 'goodsQty',
      key: 'goodsQty',
      render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
    }, {
      title: '库存数量',
      dataIndex: 'wareQty',
      key: 'wareQty',
      render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
    }, {
      title: '单价',
      dataIndex: 'unitPrice',
      width: 80,
      key: 'unitPrice',
    }, {
      title: '金额',
      dataIndex: 'goodsAmt',
      width: 80,
      key: 'goodsAmt',
      render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
    }, {
      title: '辅助',
      children: [{
        title: '数量',
        dataIndex: 'dualGoodsQty',
        key: 'dualGoodsQty',
        width: 60,
        render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
      }, {
        title: '库存数量',
        dataIndex: 'dualWareQty',
        key: 'dualWareQty',
        render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
      }, {
        title: '单位',
        dataIndex: 'dualUnitName',
        key: 'dualUnitName',
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 150,
      render: text => <Tooltip placement="leftTop" title={text}>
        <div className="ellipsed-line width-150">{text}</div>
      </Tooltip>
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
      width: 160,
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'goodsCode', {
        rowIdent: record.id,
        type: 'select',
        onKeyEnter: () => toNextMem(index, 'goodsCode'),
        disabled: !storeId || !outDepotId || !inDepotId, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索

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
        goodsListLoading: popupListLoading,

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
      width: 70,
    }, {
      title: '规格型号',
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
      width: 70,
    }, {
      title: '单位',
      dataIndex: 'unitName',
      key: 'unitName',
      width: 60,
    }, {
      title: '数量',
      dataIndex: 'goodsQty',
      key: 'goodsQty',
      width: 70,
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'goodsQty', {
        type: 'number',
        rowIdent: record.id,
        updateValue: (value, itemKey) => refreshList(value, itemKey, 'goodsQty', index),
        transValue: record.goodsQty,
        disabled: !storeId || !outDepotId || !inDepotId, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
        originalProps: {
          min: 0,
          onPressEnter: () => toNextMem(index, 'goodsQty', (record.dualUnitName ? false : true)), // 跳转到下一个编辑状态 record.dualUnitFlag == '1'
          // onFocusInput: () => toggleMemStatus(index, 'goodsQty'), // 修改其他的编辑状态为非编辑状态
        },
      }),
    }, {
      title: '库存数量',
      dataIndex: 'wareQty',
      width: 70,
      key: 'wareQty',
    }, {
      title: '单价',
      dataIndex: 'unitPrice',
      width: 70,
      key: 'unitPrice',
    }, {
      title: '金额',
      dataIndex: 'goodsAmt',
      width: 70,
      key: 'goodsAmt',
      render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
    }, {
      title: '辅助',
      children: [{
        title: '数量',
        dataIndex: 'dualGoodsQty',
        key: 'dualGoodsQty',
        width: 70,
        className: 'editable-col',
        render: (text, record, index) => renderColumns(text, record, index, 'dualGoodsQty', {
          type: 'number',
          rowIdent: record.id,
          isShow: record.dualUnitName ? false : true, // record.dualUnitFlag == '1' 可以修改
          updateValue: (value, itemKey) => refreshList(value, itemKey, 'dualGoodsQty', index),
          transValue: record.dualGoodsQty,
          disabled: !storeId || !outDepotId || !inDepotId, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
          originalProps: {
            min: 0,
            onPressEnter: () => toNextMem(index, 'dualGoodsQty'), // 跳转到下一个编辑状态
            // onFocusInput: () => toggleMemStatus(index, 'dualGoodsQty'), // 修改其他的编辑状态为非编辑状态
          },
        }),
      }, {
        title: '库存数量',
        dataIndex: 'dualWareQty',
        key: 'dualWareQty',
        width: 70,
      }, {
        title: '单位',
        dataIndex: 'dualUnitName',
        key: 'dualUnitName',
        width: 60,
      }],
      dataIndex: 'stock',
      key: '2',
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
        disabled: !storeId || !outDepotId || !inDepotId, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
        maxLength: 25,
        originalProps: {
          onPressEnter: () => toNextMem(index, 'remarks'), // 跳转到下一个编辑状态
          // onFocusInput: () => toggleMemStatus(index, 'remarks'), // 修改其他的编辑状态为非编辑状态
        },
      }),
    }, {
      title: '操作',
      dataIndex: 'options',
      key: 'options',
      width: 60,
      render: (text, record, index) => (storeId && outDepotId && inDepotId) ? <div>
        <Tooltip placement="top" title="新增一行" >
          <Icon
            type="plus"
            style={{ fontSize: 20, color: '#08c', cursor: 'pointer' }}
            onClick={() => insertNewRowAfterIndex(index)}
          />
        </Tooltip>
        {
          listData.length > 1
          ? record.goodsCode ? <Popconfirm
            title={<div><span style={{ color: '#f04134' }}>危险操作！</span><br /><span>删除后可能无法恢复，确定继续删除吗？</span></div>}
            okText="确认删除"
            onConfirm={() => removeRowAtIndex(record.id, index)}
          >
            <Icon type="minus" style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} />
          </Popconfirm> : <Icon type="minus" onClick={() => removeRowAtIndex(record.id, index)} style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} />
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
    if (fieldName === 'goodsAmtNotax') {
      // console.log("inot goodsAmtNotax!", fieldName)
      rowItem.goodsQty = (value ? value / rowItem.goodsPrice : 0);
    } else if (fieldName === 'goodsQty') {
      // console.warn("rowItem.goodsPrice",rowItem.goodsPrice,"rowItem.unitPrice",rowItem.unitPrice);
      if (!rowItem.goodsPrice) { // 当没有物资价格时 物资价格 = 含税价（unitPrice）
        rowItem.goodsPrice = rowItem.unitPrice;
      } else { // 不含税价（unitPrice）
        if (rowItem.lastPrice) {
          rowItem.unitPrice = rowItem.lastPrice;
        } else {
          rowItem.unitPrice = rowItem.goodsPrice;
        }
      }
      // 新增时 优选取最终价格（lastPrice） 当最终价格没有去物资价格（goodsPrice）
      // 编辑时 取物资价格 （unitPrice） 编辑时没有 物资价格（goodsPrice）
      // if (opType === 'view') {} else{}
      // console.log("ordPriceNotax",ordPriceNotax,"rowItem",rowItem);
      // 不含税单价（unitPriceNotax） = 含税单价(goodsPrice) / (1 + 税率 )；
      rowItem.unitPriceNotax = rowItem.unitPrice / (1 + Number(rowItem.taxRatio));
      // console.log("333333333333unitPriceNotax",rowItem.unitPriceNotax,"rowItem.unitPrice / (1 + Number(rowItem.taxRatio))",rowItem.unitPrice / (1 + Number(rowItem.taxRatio)));

      // goodsAmtNotax 不含税金额 公式：不含税金额 = 不含税单价(ordPriceNotax)*采购数量(ordUnitNum)
      rowItem.goodsAmtNotax = (value ? value * (rowItem.unitPriceNotax || 0) : 0);
      // console.log(
      //   "rowItem.goodsAmtNotax含税金额",rowItem.goodsAmtNotax,
      //   "rowItem.taxRatio税率",rowItem.taxRatio,
      //   "rowItem.goodsPrice含税价",rowItem.goodsPrice,Number(rowItem.taxRatio),
      //   "总结",rowItem.goodsPrice/(1+rowItem.taxRatio)
      // );
      // rowItem.unitPrice = (value ? (rowItem.goodsPrice / (1 + Number(rowItem.taxRatio))).toFixed(2) : 0); // 不含税价 unitPrice 含税入库价 goodsPrice/1+税率 taxRatio
      rowItem.goodsTaxAmt = (value ? value * rowItem.unitPrice * rowItem.taxRatio : 0); // 税额 goodsTaxAmt 数量*含税入库价*税率 taxRatio
      rowItem.goodsAmt = (value ? (value * rowItem.unitPrice) : 0); // 含税金额 goodsAmt 含税价（unitPrice）*入库数量
    }
    // if (fieldName === 'arrivalDate') {
    //   // 修改为非编辑状态
    //   switchEditingStatus(rowIndex, fieldName, false);
    // }

    listData = _.cloneDeep(listData);
    resyncDataSource(listData);
  };

  openModel = (value) => { // 打开物资弹窗
    openGoodsModel(value);
  };
  // onUpdateAdd = (value) => {
  //   console.warn('我是点击事件');
  // }
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
    // console.log("field",field);
    const editable = '';
    const status = false;
    const currEditStatus = editableMem[index];
    let fields = Object.keys(currEditStatus);
    // console.log("currEditStatus",currEditStatus);
    // if (!currEditStatus || (currEditStatus && !(currEditStatus.hasOwnProperty(field)))) {
      // syncMem(field); // 生成编辑内容行列信息
      // return false;
    // }
    let newdataSourceIndex = 1;
    dataSourceIndex && dataSourceIndex.length ? (newdataSourceIndex = dataSourceIndex.length) : newdataSourceIndex;
    if (!_.has(editableMem[index], field)) {
      if (index == editableMem.length-1 && (field==fields[0] || fields.length==0) && editableMem.length !== newdataSourceIndex) { // 第一条不能是自动选中状态
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
      rowIndex={index}
      clickToEdit={() => {
        currEditStatus[field] = !currEditStatus[field];
      }}
    />);
  };
  showGoodsListByTyping = (value) => {
    getGoodsListByTyping(value);
  };
  /*
  962(pin): "已完成"
  961(pin): "未完成"
  // {opType === 'view' && pageStatus === 964 && <a href="javacript:void(0);" style={{ display: 'none' }} onClick={() => switchType('edit')}>启用编辑</a>}
  */
  return (
    <div>
      <br />
      <Table
        bordered
        size="small"
        columns={columnsConfig}
        loading={loadingList}
        dataSource={listData}
        pagination={false}
        onRowClick={onUpdateAdd}
        rowKey={record => record.id}
        rowClassName={() => 'editable-row'}
      />
      <br />
      {(opType === 'edit' || opType === 'create')
        && <span><Button onClick={() => savePageData(961)} disabled={savingStatus}>暂存</Button>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
      {((opType === 'edit' || opType === 'create'))
        && <span><Button type="primary" onClick={() => savePageData(962)} disabled={savingStatus}>调拨</Button>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
      <Button onClick={cancelDetailPage}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
      <div style={{ display: 'none' }}>{JSON.stringify(editableMem)}</div>
    </div>
  );
};

RequisitionDetailsList.propTypes = {
  opType: PropTypes.string,
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
export default RequisitionDetailsList;
