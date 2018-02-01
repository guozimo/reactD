import React, { PropTypes } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Tag, Table, Icon, Button, Tooltip, Popconfirm, Modal } from 'antd';
import EditableCell from '../../_components/EditableCell2';

const PriceListDetailsList = ({
  // module state
  opType,
  loadingList,
  pageDetail,
  editableMem,
  goodsList,
  pageStatus,
  savingStatus,
  bussDate,
  billStatus,
  confilictionRows,

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
  deleteAGoods,

  getGoodsListdata,
  onPopupPageChange,
  onPopupPageSizeChange,
  onSelectedTreeItem,
  selectModalSearch,
  confirmConfiliction,

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
}) => {
  // 序号 物资编码 物资名称 规格型号 订货单位 订货数量 标准单位 标准数量 备注 操作
  let columnsConfig = [];
  let listData = pageDetail;
  // pageDetail = pageDetail.results ? pageDetail.results : {};
  // console.log('foundTreeList', foundTreeList);
  // if (Object.keys(pageDetail).length) {
  //   listData = pageDetail.detailList;
  // console.log('listData', listData);
  // }
  // console.log("test moment",moment("2017-09-30T11:55:50.450Z").format('YYYY-MM-DD'))
  if (opType === 'view') {
    columnsConfig = [{
      title: '',
      dataIndex: 'index',
      key: 'index',
      width: 40,
      render: (text, record, index) => (parseInt(index) + 1),
    }, {
      title: '门店编码',
      dataIndex: 'storeCode',
      key: 'storeCode',
    }, {
      title: '门店名称',
      dataIndex: 'storeName',
      key: 'storeName',
    }, {
      title: '物品编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
    }, {
      title: '物品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
    }, {
      title: '规格型号',
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
    }, {
      title: '执行价格',
      dataIndex: 'goodsPrice',
      key: 'goodsPrice',
    }, {
      title: '标准单位', // 暂时先跟订货数量一个
      dataIndex: 'unitName',
      key: 'unitName',
      render: text => text || '',
    }, {
      title: '执行时间段',
      dataIndex: 'lunchInRange', // 'lunchInRange'record.startDate,
      key: 'lunchInRange',
      render: (text, record) => `${record.startDate} ~ ${record.endDate}`,
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '50',
      render: text => (<Tag color={{ '960': 'gray', '962': 'green', '961': 'orange' }[text]}>{billStatus[text]}</Tag>),
    }];
  } else {
    columnsConfig = [{
      title: '',
      dataIndex: 'index',
      key: 'index',
      width: 40,
      render: (text, record, index) => (parseInt(index) + 1),
    }, {
      title: '物品编码',
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
          onFocusInput: () => toggleMemStatus(index, 'goodsCode'), // 修改其他的编辑状态为非编辑状态
        },
      }),
    }, {
      title: '物品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
    }, {
      title: '规格型号',
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
    }, {
      title: '执行价格',
      dataIndex: 'goodsPrice',
      key: 'goodsPrice',
      width: '90',
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'goodsPrice', {
        type: 'number',
        rowIdent: record.id,
        updateValue: (value, itemKey) => refreshList(value, itemKey, 'goodsPrice', index),
        transValue: record.goodsPrice,
        originalProps: {
          style: { width: 50 },
          min: 0.0001,
          onPressEnter: () => toNextMem(index, 'goodsPrice'), // 跳转到下一个编辑状态
          onFocusInput: () => toggleMemStatus(index, 'goodsPrice'), // 修改其他的编辑状态为非编辑状态
        },
      }),
    }, {
      title: '标准单位',
      dataIndex: 'unitName',
      key: 'unitName',
    }, {
      title: '执行时间段',
      dataIndex: 'lunchInRange',
      width: 210,
      key: 'lunchInRange',
      // render: text => (text && <span>{moment(text).format('YYYY-MM-DD')}</span>),
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'lunchInRange', {
        type: 'rangepicker',
        rowIdent: record.id,
        updateValue: (itemId, date, value) => {
          refreshList(value, itemId, 'lunchInRange', index);
          setTimeout(() => {
            toNextMem(index, 'lunchInRange');
          }, 100)
        },
        transValue: record.startDate && record.endDate ? [moment(record.startDate), moment(record.endDate)] : null, // 默认值
        disabledDate: current => current && current.valueOf() < moment(bussDate),  // Can not select days before today and today
        shortRanges: {
            '今天': [moment(), moment()],
            '后3天': [moment(), moment().add(3, 'day')],
            '后7天': [moment(), moment().add(7, 'day')],
            '后15天': [moment(), moment().add(15, 'day')],
            '后1月': [moment(), moment().add(1, 'month')],
        },
        originalProps: {
          style: { width: 200 },
          onFocusInput: () => toggleMemStatus(index, 'lunchInRange'), // 修改其他的编辑状态为非编辑状态
        },
        // selectItem: (itemValue, itemId) => selectedAGoods(itemValue, itemId, index),
        // keyValues: goodsList,
        // disabledList: (() => listData.map(item => item.id))(), // 指定下拉列表中已显示的不让其可选
      }),
    }, {
      title: '操作',
      dataIndex: 'options',
      key: 'options',
      width: 60,
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
    const fakeItem = _.cloneDeep(rowItem);
    rowItem[fieldName] = value;
    // 联动更新
    // console.log('rowItem', rowItem);
    // console.log("value, rowItem.purcUnitRates", value, rowItem.purcUnitRates,value * (rowItem.purcUnitRates || 1))
    // if (fieldName === 'goodsPrice') {
    //   // rowItem.goodsQty = value; // 暂时先跟订货数量一个
    //   rowItem.unitNum = Math.round(((value || 1) / (rowItem.purcUnitRates || 1)) * 10000) / 10000; // 四舍五入
    // }
    if (fieldName === 'lunchInRange') {
      // 修改为非编辑状态
      // console.log("fakeItem, value", fakeItem, value);
      // switchEditingStatus(rowIndex, fieldName, false);
      if ((fakeItem.startDate !== value[0] || fakeItem.endDate !== value[1]) && !!fakeItem.createUser) { // 修改的时间与之前保存的时间不同的话，需要把之前的数据放到已删除列表中
        // console.log("deleteAGoods!");
        deleteAGoods(fakeItem);
      }
      rowItem.startDate = value[0];
      rowItem.endDate = value[1];
    }

    listData = _.cloneDeep(listData);
    // console.log('listData', listData);
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
    // console.log("currEditStatus",currEditStatus);
    if (!currEditStatus) {
      return false;
    }
    const fields = Object.keys(currEditStatus);
    // console.log("dataSourceIndex",dataSourceIndex);
    // if (!currEditStatus || (currEditStatus && !(currEditStatus.hasOwnProperty(field)))) {
      // syncMem(field); // 生成编辑内容行列信息
      // return false;
    // }
    let newdataSourceIndex = 1;
    dataSourceIndex && dataSourceIndex.length ? (newdataSourceIndex = dataSourceIndex.length) : newdataSourceIndex;
    if (!_.has(editableMem[index], field)) {
      if (index === editableMem.length - 1 && (field === fields[0] || fields.length === 0) && editableMem.length !== newdataSourceIndex) { // 第一条不能是自动选中状态
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
  960(pin): "已作废"
  962(pin): "已审核"
  961(pin): "待审核"
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
        rowKey={record => record.id}
        rowClassName={() => 'editable-row'}
      />
      <br />
      {(opType === 'edit' || opType === 'create')
        && <span><Button onClick={() => savePageData(961)} disabled={savingStatus}>暂存</Button>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
      {(opType === 'edit' || opType === 'create')
        && <span><Button type="primary" onClick={() => savePageData(962)} disabled={savingStatus}>审核</Button>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
      <Button onClick={cancelDetailPage}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
      {opType === 'view' && pageStatus === 962 && <a href="javacript:void(0);" style={{ display: 'none' }} onClick={() => switchType('edit')}>启用编辑</a>}
      <div style={{ display: 'none' }}>{JSON.stringify(editableMem)}</div>

      <Modal
        title="数据冲突！"
        visible={confilictionRows.length}
        footer={<Button type="primary" onClick={confirmConfiliction}>知道了</Button>}
        closable={false}
        width="700"
      >
        <p style={{ color: 'red', marginBottom: 20 }}>
          以下物品新设时间段与已生效时间段存在重复或交叉，请检查！
        </p>
        <Table dataSource={confilictionRows} size="small" pagination={false}>
          <Table.Column
            title="物品编码"
            dataIndex="goodsCode"
            key="goodsCode"
          />
          <Table.Column
            title="物品名称"
            dataIndex="goodsName"
            key="goodsName"
          />
          <Table.Column
            title="已生效时间"
            dataIndex="startDate"
            key="startDate"
            render={(text, record) => `${record.startDate} ~ ${record.endDate}`}
          />
          <Table.Column
            title="新设置时间"
            dataIndex="conflictStartDate"
            key="conflictStartDate"
            render={(text, record) => `${record.conflictStartDate} ~ ${record.conflictEndDate}`}
          />
          <Table.Column
            title="所属单号"
            dataIndex="billNo"
            key="billNo"
          />
        </Table>
      </Modal>
    </div>
  );
};

PriceListDetailsList.propTypes = {
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
export default PriceListDetailsList;
