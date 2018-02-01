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

  goodsPopListModel, // 弹窗数据
  popupListPagination,
  foundTreeList,
  popupListLoading,

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
  selectedListGoods,
  openModel,
  showGoodsListByTyping,
  savePageData,
  dataSourceIndex,
  onCloseModel,
  findBillNoInfo,
  billInfo,
}) => {
  // 序号 物资编码 物资名称 规格型号 订货单位 订货数量 标准单位 标准数量 备注 操作
  // console.log(pageStatus);
  let columnsConfig = [];
  let listData = pageDetail;
  // pageDetail = pageDetail.results ? pageDetail.results : {};
  // console.log('foundTreeList', foundTreeList);
  // if (Object.keys(pageDetail).length) {
  //   listData = pageDetail.detailList;
  // console.log('listData', listData);
  // }
  // console.log("test moment",moment("2017-09-30T11:55:50.450Z").format('YYYY-MM-DD'))
  // const directionTypeToName = (text) => {
  //   switch (text) {
  //     case 1:return '供应商直运';
  //     case 2:return '物流中心配送';
  //     default:return null;
  //   }
  // }
  if (opType === 'view') {
    if (billInfo.status !== 962) { // 门店的已提交在总部是待处理，待处理状态不显示前几列数据
      columnsConfig = [{
        title: '',
        dataIndex: 'index',
        key: 'index',
        width: 40,
        render: (text, record, index) => (parseInt(index) + 1),
      }, {
        title: '物资',
        children: [{
          title: '编码',
          dataIndex: 'goodsCode',
          key: 'goodsCode',
        }, {
          title: '名称',
          dataIndex: 'goodsName',
          key: 'goodsName',
        }, {
          title: '规格',
          dataIndex: 'goodsSpec',
          key: 'goodsSpec',
        }],
      }, {
        title: '请购',
        children: [{
          title: '数量',
          dataIndex: 'purcUnitNum',
          key: 'purcUnitNum',
        }, {
          title: '单位',
          dataIndex: 'purcUnitName',
          key: 'purcUnitName',
        }],
      }, {
        title: '标准',
        children: [{
          title: '数量', // 暂时先跟订货数量一个
          dataIndex: 'unitNum',
          key: 'unitNum',
          render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
        }, {
          title: '单位',
          dataIndex: 'unitName',
          key: 'unitName',
        }],
      }, {
        title: '辅助',
        children: [{
          title: '数量',
          dataIndex: 'dualUnitNum',
          key: 'dualUnitNum',
          render: (text, record) => record.dualUnitName ? parseFloat(Number(text).toFixed(4)) : null,
        }, {
          title: '单位',
          dataIndex: 'dualUnitName',
          key: 'dualUnitName',
        }],
      }, {
        title: '到货日期',
        dataIndex: 'arrivalDate',
        key: 'arrivalDate',
        render: text => text && moment(text).format('YYYY-MM-DD'),
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: '150',
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
        title: '类型',
        dataIndex: 'directionType',
        key: 'directionType',
        render: (text) => {
          if (parseInt(text, 10) === 1) {
            return '供应商直运';
          }
          return '物流中心配送';
        },
      }, {
        title: '仓库',
        dataIndex: 'depotName',
        key: 'depotName',
      }, {
        title: '供应商',
        dataIndex: 'busiName',
        key: 'busiName',
      }, {
        title: '采购单号',
        dataIndex: 'billNo',
        key: 'billNo',
        render: (text, record) => <a onClick={() => findBillNoInfo(record.id, record.directionType)}>{text}</a>
      }, {
        title: '物资',
        children: [{
          title: '编码',
          dataIndex: 'goodsCode',
          key: 'goodsCode',
        }, {
          title: '名称',
          dataIndex: 'goodsName',
          key: 'goodsName',
        }, {
          title: '规格',
          dataIndex: 'goodsSpec',
          key: 'goodsSpec',
        }],
      }, {
        title: '请购',
        children: [{
          title: '数量',
          dataIndex: 'purcUnitNum',
          key: 'purcUnitNum',
          render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
        }, {
          title: '单位',
          dataIndex: 'purcUnitName',
          key: 'purcUnitName',
        }],
      }, {
        title: '标准',
        children: [{
          title: '数量', // 暂时先跟订货数量一个
          dataIndex: 'applyUnitNum',
          key: 'applyUnitNum',
          render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
        }, {
          title: '单位',
          dataIndex: 'unitName',
          key: 'unitName',
        }],
      }, {
        title: '辅助',
        children: [{
          title: '数量',
          dataIndex: 'dualUnitNum',
          key: 'dualUnitNum',
          render: (text, record) => record.dualUnitName ? parseFloat(Number(text).toFixed(4)) : null,
        }, {
          title: '单位',
          dataIndex: 'dualUnitName',
          key: 'dualUnitName',
        }],
      }, {
        title: '到货日期',
        dataIndex: 'arrivalDate',
        key: 'arrivalDate',
        render: text => text && moment(text).format('YYYY-MM-DD'),
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: '150',
        render: text => <Tooltip placement="leftTop" title={text}>
          <div className="ellipsed-line width-150">{text}</div>
        </Tooltip>
      }];
    }
  } else {
    columnsConfig = [{
      title: '',
      dataIndex: 'index',
      key: 'index',
      width: 40,
      render: (text, record, index) => (parseInt(index) + 1),
    }, {
      title: '物资',
      children: [
    {
      title: '物资编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
      width: '143',
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'goodsCode', {
        rowIdent: record.id,
        type: 'select',
        onKeyEnter: () => toNextMem(index, 'goodsCode'),

        onChange: showGoodsListByTyping, // 手动输入的回调
        selectItem: (itemValue, itemId) => { toNextMem(index, 'goodsCode'); selectedAGoods(itemValue, itemId, index, 'goodsCode'); }, // 选择手动输入后列表的一个项目
        keyValues: goodsList, // 显示响应手动输入的列表数据
        disabledList: (() => listData.map(item => item.goodsCode))(), // 指定下拉列表中和弹窗列表中已显示的不让其可选，暂时实现只匹配ID

        getPopListData: getGoodsListdata, // 第一次显示列表时触发获取数据的方法
        popListData: goodsPopListModel, // getPopListData 获取的 table 里的数据
        cbReceiveChoose: (data) => { // 选择的几条数据
          const selectedList = _.cloneDeep(data);
          selectedListGoods(selectedList, index, 'goodsCode', true); // 最后一个参数判断是否是弹窗新增
        },
        hideFields: ['wareQty'], // 隐藏库存数量字段

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
    }, {
      title: '规格型号',
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
    }] }, {
      title: '订货',
      children: [{
        title: '数量',
        dataIndex: 'purcUnitNum',
        key: 'purcUnitNum',
        width: '70',
        className: 'editable-col',
        render: (text, record, index) => renderColumns(text, record, index, 'purcUnitNum', {
          type: 'number',
          rowIdent: record.id,
          updateValue: (value, itemKey) => refreshList(value, itemKey, 'purcUnitNum', index),
          transValue: record.purcUnitNum,
          originalProps: {
            style: { width: 50 },
            min: 0,
            onPressEnter: () => toNextMem(index, 'purcUnitNum', (record.dualUnitName ? false : true)), // 跳转到下一个编辑状态
            // onFocusInput: () => toggleMemStatus(index, 'purcUnitNum'), // 修改其他的编辑状态为非编辑状态
          },
        }),
      }, {
        title: '单位',
        dataIndex: 'purcUnitName',
        key: 'purcUnitName',
      }],
    }, {
      title: '标准',
      children: [{
        title: '数量', // 标准数量=订货单位转换率*订货数量
        dataIndex: 'unitNum',
        key: 'unitNum',
        render: text => parseFloat(Number(text).toFixed(4)) || '',
      }, {
        title: '单位',
        dataIndex: 'unitName',
        key: 'unitName',
      }],
    }, {
      title: '辅助',
      children: [{
        title: '数量',
        dataIndex: 'dualUnitNum',
        key: 'dualUnitNum',
        width: '70',
        className: 'editable-col',
        render: (text, record, index) => renderColumns(text, record, index, 'dualUnitNum', {
          type: 'number',
          rowIdent: record.id,
          isShow: record.dualUnitName ? false : true, // record.dualUnitFlag == '1' 可以修改
          updateValue: (value, itemKey) => refreshList(value, itemKey, 'dualUnitNum', index),
          transValue: record.dualUnitNum,
          // disabled: parseInt(record.dualUnitFlag, 10) !== 1, // 双单位不能编辑，根据条件判断是否能够使用， true 不能使用 false 能够使用
          originalProps: {
            style: { width: 50 },
            onPressEnter: () => toNextMem(index, 'dualUnitNum'), // 跳转到下一个编辑状态
            // onFocusInput: () => toggleMemStatus(index, 'dualUnitNum'), // 修改其他的编辑状态为非编辑状态
          },
        }),
      }, {
        title: '单位',
        dataIndex: 'dualUnitName',
        key: 'dualUnitName',
      }],
    }, {
      title: '到货日期',
      dataIndex: 'arrivalDate',
      width: 110,
      key: 'arrivalDate',
      // render: text => (text && <span>{moment(text).format('YYYY-MM-DD')}</span>),
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'arrivalDate', {
        type: 'datepicker',
        rowIdent: record.id,
        updateValue: (itemId, date, dateString) => { toNextMem(index, 'arrivalDate'); refreshList(dateString, itemId, 'arrivalDate', index); },
        transValue: text ? moment(text).format('YYYY-MM-DD') : '', // 默认值
        disabledDate: current => current && moment(current.format('YYYY-MM-DD')).valueOf() < moment(moment(bussDate).format('YYYY-MM-DD')).valueOf(),
        // .add(1, 'days'), // Can not select days before today and today
        originalProps: {
          style: { width: 100 },
          onFocusInput: () => toggleMemStatus(index, 'arrivalDate'), // 修改其他的编辑状态为非编辑状态
        },
        // selectItem: (itemValue, itemId) => selectedAGoods(itemValue, itemId, index),
        // keyValues: goodsList,
        // disabledList: (() => listData.map(item => item.id))(), // 指定下拉列表中已显示的不让其可选
      }),
    }, {
      title: '备注',
      dataIndex: 'remark',
      width: 100,
      key: 'remark',
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'remark', {
        rowIdent: record.id,
        updateValue: (value, itemKey) => refreshList(value, itemKey, 'remark', index),
        transValue: record.remark,
        maxLength: 25,
        originalProps: {
          style: { width: 80 },
          onPressEnter: () => toNextMem(index, 'remark'), // 跳转到下一个编辑状态
          // onFocusInput: () => toggleMemStatus(index, 'remark'), // 修改其他的编辑状态为非编辑状态
        },
      }),
    }, {
      title: '操作',
      dataIndex: 'options',
      key: 'options',
      render: (text, record, index) => <div>
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
            onConfirm={() => removeRowAtIndex(index)}
          >
            <Icon type="minus" style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
          : null
        }
      </div>,
    }];
  }

  refreshList = (value, itemKey, fieldName, rowIndex) => {
    // 更新文本框
    const rowItem = _.find(listData, item => item.id === itemKey);
    rowItem[fieldName] = value;
    // 联动更新
    // console.log("value, rowItem.purcUnitRates", value, rowItem.purcUnitRates,value * (rowItem.purcUnitRates || 1))
    if (fieldName === 'purcUnitNum') {
      // rowItem.goodsQty = value; // 暂时先跟订货数量一个
      rowItem.unitNum = Math.round(((value || 1) / (rowItem.purcUnitRates || 1)) * 10000) / 10000; // 四舍五入
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
    // if (field == 'dualUnitNum') {
      // console.log('dualUnitNum record', field, record);
    // }
    // console.log("renderColumns");
    const editable = '';
    const status = false;
    const currEditStatus = editableMem[index];

    const listDataRenderError = _.cloneDeep(listData);
    const lineItem = listDataRenderError[index];   // 获取这一行数据

    // console.log("currEditStatus",currEditStatus);
    let fields = Object.keys(currEditStatus);
    // console.log("dataSourceIndex",dataSourceIndex);
    // if (!currEditStatus || (currEditStatus && !(currEditStatus.hasOwnProperty(field)))) {
      // syncMem(field); // 生成编辑内容行列信息
      // return false;
    // }
    let newdataSourceIndex = 1;
    dataSourceIndex && dataSourceIndex.length ? (newdataSourceIndex = dataSourceIndex.length) : newdataSourceIndex;
    if (!_.has(editableMem[index], field)) {
      if (index == editableMem.length-1 && (field==fields[0] || fields.length==0) && editableMem.length !== newdataSourceIndex) { // 第一条不能是自动选中状态
       // console.log('fixed field is configurations.hideField', configurations.hideField);
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
      validation={lineItem}
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
  964(pin): "待处理"
  965(pin): "已提交"
  */
  // {(()=>{
  //   console.log('bordered!');
  // })()}
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
        rowKey={record => record.id + '' + record.goodsId}
        rowClassName={() => 'editable-row'}
        scroll={opType === 'view' ? { x: '1300' } : {}}
      />
      <br />
      {((opType === 'edit' && pageStatus === 964) || opType === 'create' )
        && <span><Button onClick={() => savePageData(964)} disabled={savingStatus}>暂存</Button>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
      {((opType === 'edit' && pageStatus === 964) || opType === 'create' )
        && <span><Button type="primary" onClick={() => savePageData(965)} disabled={savingStatus}>请购</Button>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
      <Button onClick={cancelDetailPage}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
      {(opType === 'view' && pageStatus === 964) && <a href="javacript:void(0);" style={{ display: 'none' }} onClick={() => switchType('edit')}>启用编辑</a>}
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
