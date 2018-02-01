import React, { PropTypes } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Table, Icon, Button, Tooltip, Popconfirm, message } from 'antd';
import EditableCell from '../../_components/EditableCell2';
import INVENTORY_PERMISSION from '../../../common/Permission/inventoryPermission';
import Permission from '../../../common/Permission/Permission.jsx';

const DispatchOrdersListView = ({
  // module state
  pageType,
  loading,
  pageDetail,
  editableMem,
  goodsList,
  savingStatus,

  // module 方法
  switchType,
  resyncDataSource,
  saveDetails,
  cancelDetailPage,
  switchEditingStatus,
  toNextMem,
  toggleMemStatus,

  // 私有方法
  renderColumns,
  refreshList,
  openModel,
  savePageData,
  dataSourceIndex,
}) => {
  // 序号，物资编码，物资名称，规格型号，（标准/单位，数量），剩余库存，（辅助/单位，数量），出库单价，出库金额，备注，操作
  let columnsConfig = [];
  let listData = pageDetail;
  if (pageType === 'view') {
    columnsConfig = [{
      title: '',
      dataIndex: 'key',
      key: 'key',
      width: 40,
      fixed: 'left',
      render: (text, record, index) => (parseInt(index) + 1),
    }, {
      title: '物资编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
      width: 80,
      fixed: 'left',
    }, {
      title: '物资名称',
      width: 80,
      dataIndex: 'goodsName',
      key: 'goodsName',
      fixed: 'left',
    }, {
      title: '规格',
      width: 60,
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
    }, {
      title: '订货',
      children: [{
        title: '数量',
        dataIndex: 'purcUnitNum',
        key: 'purcUnitNum',
        width: 60,
      }, {
        title: '单位',
        dataIndex: 'purcUnitName',
        key: 'purcUnitName',
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '标准',
      children: [
        {
          title: '数量',
          dataIndex: 'unitNum',
          key: 'unitNum',
        }, {
          title: '单位',
          dataIndex: 'unitName',
          key: 'unitName',
        }, {
          title: '单价',
          dataIndex: 'unitPrice',
          key: 'unitPrice',
          render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text
        }, {
          title: '金额',
          dataIndex: 'goodsAmt',
          key: 'goodsAmt',
          width: 70,
          render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text
        }, {
          title: '已出库数量',
          dataIndex: 'outNum',
          key: 'outNum',
          width: 60,
        }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '采购',
      children: [{
        title: '数量',
        dataIndex: 'ordUnitNum',
        key: 'ordUnitNum',
        width: 60,
      }, {
        title: '单位',
        dataIndex: 'ordUnitName',
        key: 'ordUnitName',
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '辅助',
      children: [{
        title: '数量',
        dataIndex: 'dualUnitNum',
        width: 60,
        key: 'dualUnitNum',
      }, {
        title: '单位',
        dataIndex: 'dualUnitName',
        width: 60,
        key: 'dualUnitName',
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '税率',
      dataIndex: 'taxRatio',
      width: 50,
      key: 'taxRatio',
    }, {
      title: '不含税',
      children: [{
        title: '单价',
        dataIndex: 'unitPriceNotax',
        width: 60,
        key: 'unitPriceNotax',
        render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
      }, {
        title: '金额',
        dataIndex: 'goodsAmtNotax',
        width: 80,
        key: 'goodsAmtNotax',
        render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '到货日期',
      dataIndex: 'arrivalDate',
      width: 80,
      key: 'arrivalDate',
      render: text =>  text ? moment(text).format('YYYY-MM-DD') : '',
    }, {
      title: '备注',
      dataIndex: 'remarks',
      width: 100,
      key: 'remarks',
      render: text => <Tooltip placement="leftTop" title={text}>
        <div className="ellipsed-line width-150">{text}</div>
      </Tooltip>
    }];
  } else {
    columnsConfig = [{
      title: '',
      dataIndex: 'key',
      key: 'key',
      width: 40,
      render: (text, record, index) => (parseInt(index) + 1),
    }, {
      title: '物资编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
      width: 160,
    }, {
      title: '物资名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      // fixed: 'left',
    }, {
      title: '规格',
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
    }, {
      title: '订货',
      children: [{
        title: '数量',
        dataIndex: 'purcUnitNum',
        key: 'purcUnitNum',
        width: 60,
      }, {
        title: '单位',
        dataIndex: 'purcUnitName',
        key: 'purcUnitName',
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '标准',
      children: [
        {
          title: '配送数量',
          dataIndex: 'unitNum',
          key: 'unitNum',
          className: 'editable-col',
          render: (text, record, index) => renderColumns(text, record, index, 'unitNum', {
            type: 'number',
            rowIdent: record.id,
            updateValue: (value, itemKey) => refreshList(value, itemKey, 'unitNum', index),
            transValue: record.unitNum,
            originalProps: {
              style: { width: 50 },
              onPressEnter: () => toNextMem(index, 'unitNum', (record.dualUnitName ? false : true)), // 跳转到下一个编辑状态
              onFocusInput: () => toggleMemStatus(index, 'unitNum'), // 修改其他的编辑状态为非编辑状态
            },
          }),
        }, {
          title: '单位',
          dataIndex: 'unitName',
          key: 'unitName',
        }, {
          title: '单价',
          dataIndex: 'unitPrice',
          key: 'unitPrice',
          render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text
        }, {
          title: '金额',
          dataIndex: 'goodsAmt',
          key: 'goodsAmt',
          render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text
        }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '采购',
      children: [{
        title: '数量',
        dataIndex: 'ordUnitNum',
        key: 'ordUnitNum',
        width: 60,
      }, {
        title: '单位',
        dataIndex: 'ordUnitName',
        key: 'ordUnitName',
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '辅助',
      children: [{
        title: '数量',
        dataIndex: 'dualUnitNum',
        key: 'dualUnitNum',
        width: 70,
        className: 'editable-col',
        render: (text, record, index) => renderColumns(text, record, index, 'dualUnitNum', {
          type: 'number',
          rowIdent: record.id,
          isShow: record.dualUnitName ? false : true, // record.dualUnitFlag == '1' 可以修改
          updateValue: (value, itemKey) => refreshList(value, itemKey, 'dualUnitNum', index),
          transValue: record.dualGoodsQty,
          originalProps: {
            style: { width: 50 },
            onPressEnter: () => toNextMem(index, 'dualUnitNum'), // 跳转到下一个编辑状态
            onFocusInput: () => toggleMemStatus(index, 'dualUnitNum'), // 修改其他的编辑状态为非编辑状态
          },
        }),
      }, {
        title: '单位',
        dataIndex: 'dualUnitName',
        key: 'dualUnitName',
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '税率',
      width: 50,
      dataIndex: 'taxRatio',
      key: 'taxRatio',
    }, {
      title: '不含税',
      children: [{
        title: '单价',
        dataIndex: 'unitPriceNotax',
        key: 'unitPriceNotax',
        width: 60,
        render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
      }, {
        title: '金额',
        dataIndex: 'goodsAmtNotax',
        key: 'goodsAmtNotax',
        width: 80,
        render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '到货日期',
      dataIndex: 'arrivalDate',
      key: 'arrivalDate',
      width: 80,
      render: text =>  text ? moment(text).format('YYYY-MM-DD') : '',
    }, {
      title: '备注',
      dataIndex: 'remarks',
      width: 100,
      key: 'remarks',
    }];
  }
  refreshList = (value, itemKey, fieldName, rowIndex) => {
    // 更新文本框
    const rowItem = _.find(listData, item => item.id === itemKey);
    rowItem[fieldName] = value;
    // 联动更新
    // unitNum 标准数量 公式：标准数量 = 采购数量(ordUnitNum)/采购转换率(ordUnitRates)
    // ordUnitNum 采购数量 公式： 采购数量 = 标准数量(unitNum)*采购转换率(ordUnitRates)
    rowItem.ordUnitNum = (rowItem.unitNum ? (rowItem.unitNum * (rowItem.ordUnitRates || 1)) : 0);
    // goodsAmt 标准金额 公式： 标准金额 = 标准数量(unitNum)*标准单价(unitPrice)
    rowItem.goodsAmt = (rowItem.unitNum && rowItem.unitPrice ? (Math.round((rowItem.unitNum * rowItem.unitPrice) * 10000) / 10000) : 0);
    // unitPriceNotax  不含税单价 公式： 不含税单价 = 标准单价(unitPrice)/(1+税率(taxRatio))
    rowItem.unitPriceNotax = (rowItem.unitPrice ? (rowItem.unitPrice / (1 + rowItem.taxRatio || 1)) : 0);
    // goodsAmtNotax 不含税金额 公式： 不含税金额 = 不含税单价(unitPriceNotax)*标准数量(unitNum)
    rowItem.goodsAmtNotax = (rowItem.unitPriceNotax && rowItem.unitNum ? (rowItem.unitPriceNotax * rowItem.unitNum) : 0);
    if (fieldName === 'arrivalDate') {
      // 修改为非编辑状态
      switchEditingStatus(rowIndex, fieldName, false);
    }

    listData = _.cloneDeep(listData);
    resyncDataSource(listData);
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
    // console.log('currEditStatus', currEditStatus);
    // if (!currEditStatus || (currEditStatus && !(currEditStatus.hasOwnProperty(field)))) {
      // syncMem(field); // 生成编辑内容行列信息
      // return false;
    // }
    let newdataSourceIndex = 1;
    dataSourceIndex && dataSourceIndex.length ? (newdataSourceIndex = dataSourceIndex.length) : newdataSourceIndex;
    if (!_.has(editableMem[index], field)) {
      // console.log('fixed field is configurations.hideField', index == editableMem.length-1);
      if (index == editableMem.length-1 && (field==fields[0] || fields.length==0) && editableMem.length !== newdataSourceIndex) { // 第一条不能是自动选中状态
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
    />
    );
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
        rowKey={record => record.id + '' + record.goodsId}
        rowClassName={() => 'editable-row'}
        scroll={pageType === 'view' ? { x: '1280' } : { x: '1320' }}
      />
      <br />
      {(pageType === 'edit') &&
        <span><Button onClick={() => savePageData(964)} disabled={savingStatus}>暂存</Button>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
      {(pageType === 'edit')
        && <Permission path={INVENTORY_PERMISSION.DISPATCH_ORDERS.SUBMIT}>
            <Button type="primary" onClick={() => savePageData(968)} disabled={savingStatus}>提交</Button>&nbsp;&nbsp;&nbsp;&nbsp;
          </Permission>}
      {(pageType === 'edit') && <span><Button onClick={cancelDetailPage}>取消</Button>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
      {(pageType === 'view') && <span><Button onClick={cancelDetailPage}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
      {pageType === 'view' && <a href="javacript:void(0);" style={{ display: 'none' }} onClick={() => switchType('edit')}>启用编辑</a>}
      <div style={{ display: 'none' }}>{JSON.stringify(editableMem)}</div>
    </div>
  );
};

DispatchOrdersListView.PropTypes = {
  pageType: PropTypes.string,
  pageStatus: PropTypes.string,
  switchType: PropTypes.func,
  resyncDataSource: PropTypes.func,
  saveDetails: PropTypes.func,
  switchEditingStatus: PropTypes.func,
  editableMem: PropTypes.array,
  renderColumns: PropTypes.func,
  refreshList: PropTypes.func,
  cancelDetailPage: PropTypes.func,
  toNextMem: PropTypes.func,
  toggleMemStatus: PropTypes.func,
};
export default DispatchOrdersListView;
