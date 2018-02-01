import React, { PropTypes } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Table, Icon, Button, Tooltip, Popconfirm } from 'antd';
import EditableCell from '../../_components/EditableCell2';

const DirectCheckDetailsList = ({
  // module state
  opType,
  loadingList,
  pageDetail,
  editableMem,
  goodsList,
  pageStatus,
  savingStatus,

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
  toNextMem,
  toggleMemStatus,

  // 私有方法
  renderColumns,
  refreshList,
  selectedAGoods,
  openModel,
  focusFieldByField,
  showGoodsListByTyping,
  savePageData,
}) => {
  // 序号 物资编码 物资名称 规格型号 订货单位 订货数量 标准单位 标准数量 备注 操作
  let columnsConfig = [];
  let listData = pageDetail;
  // pageDetail = pageDetail.results ? pageDetail.results : {};
  // console.log('pageDetail', pageDetail);
  // if (Object.keys(pageDetail).length) {
  //   listData = pageDetail.detailList;
  //   console.log('listData', listData);
  // }
  // console.log("test moment",moment("2017-09-30T11:55:50.450Z").format('YYYY-MM-DD'))
  if (opType === 'view') {
    columnsConfig = [
      {
        title: '',
        dataIndex: 'index',
        key: 'index',
        width: 40,
        render: (text, record, index) => (parseInt(index) + 1),
      }, {
        title: '物资',
        children: [
          {
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
          },
        ],
      }, {
        title: '订货',
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
        title: '验收数量',
        dataIndex: 'auditNum',
        key: 'auditNum',
        width: 70,
        render: (text, record) => parseFloat(Number((record.auditNum || record.ordAdjustNum || 0)).toFixed(4)),
      }, {
        title: '标准',
        children: [{
          title: '数量', // 标准数量=订货单位转换率*订货数量
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
          render: (text, record, index) => record.dualUnitName ? parseFloat(Number(text).toFixed(4)) : '',
        }, {
          title: '单位',
          dataIndex: 'dualUnitName',
          key: 'dualUnitName',
        }],
      }, {
      //   title: '到货日期',
      //   dataIndex: 'arrivalDate',
      //   key: 'arrivalDate',
      //   render: text => text && moment(text).format('YYYY-MM-DD'),
      // }, {
        title: '采购',
        children: [{
          title: '金额',
          dataIndex: 'goodsAmt',
          key: 'goodsAmt',
          render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
        }, {
          title: '单价',
          dataIndex: 'ordPrice',
          key: 'ordPrice',
        }],
      }, {
        title: '税率',
        dataIndex: 'taxRatio',
        key: 'taxRatio',
        render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
      }, {
        title: '不含税金额',
        dataIndex: 'goodsAmtNotax',
        key: 'goodsAmtNotax',
        render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
      }, {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
        width: '150',
        render: text => <Tooltip placement="leftTop" title={text}>
          <div className="ellipsed-line width-150">{text}</div>
        </Tooltip>
      },
    ];
  } else {
    columnsConfig = [
      {
        title: '',
        dataIndex: 'index',
        key: 'index',
        width: 40,
        render: (text, record, index) => (parseInt(index) + 1),
      }, {
        title: '物资',
        children: [
          {
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
          },
        ],
      }, {
        title: '订货',
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
        title: '验收数量',
        dataIndex: 'auditNum',
        key: 'auditNum',
        width: 100,
        className: 'editable-col',
        render: (text, record, index) => renderColumns(text, record, index, 'auditNum', {
          type: 'number',
          rowIdent: record.id,
          updateValue: (value, itemKey) => refreshList(value, itemKey, 'auditNum', index),
          transValue: (() => {
            // if (record.auditNum === 0 || record.auditNum === '0' || parseInt(record.auditNum) === 0) {
            //   return record.auditNum;
            // } else if (record.purcUnitNum) {
            //   return record.auditNum || record.purcUnitNum;
            // }
            // return (record.auditNum || record.ordAdjustNum || 0);

            // 直运验收，验收数量默认“unitNum*purcUnitRates”
            return Math.round(record.unitNum * record.purcUnitRates * 10000) / 10000;
          })(),
          originalProps: {
            style: { width: 40 },
            min: 0,
            onPressEnter: () => toNextMem(index, 'auditNum', (record.dualUnitName ? false : true)), // 跳转到下一个编辑状态
            onFocusInput: () => toggleMemStatus(index, 'auditNum'), // 修改其他的编辑状态为非编辑状态
          },
        }),
      }, {
        title: '标准',
        children: [{
          title: '数量', // 标准数量=订货单位转换率*订货数量
          dataIndex: 'unitNum',
          key: 'unitNum',
          width: 60,
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
          width: 70,
          className: 'editable-col',
          render: (text, record, index) => record.dualUnitName ? renderColumns(text, record, index, 'dualUnitNum', {
            type: 'number',
            rowIdent: record.id,
            isShow: record.dualUnitName ? false : true, // record.dualUnitFlag == '1' 可以修改
            updateValue: (value, itemKey) => refreshList(value, itemKey, 'dualUnitNum', index),
            transValue: record.dualUnitNum,
            // disabled: parseInt(record.dualUnitFlag, 10) !== 1,
            originalProps: {
              min: 0,
              onPressEnter: () => toNextMem(index, 'dualUnitNum'), // 跳转到下一个编辑状态
              onFocusInput: () => toggleMemStatus(index, 'dualUnitNum'), // 修改其他的编辑状态为非编辑状态
            },
          }):null,
        }, {
          title: '单位',
          dataIndex: 'dualUnitName',
          key: 'dualUnitName',
        }],
      }, {
      //   title: '到货日期',
      //   dataIndex: 'arrivalDate',
      //   key: 'arrivalDate',
      //   render: text => text && moment(text).format('YYYY-MM-DD'),
      // }, {
        title: '采购',
        children: [{
          title: '数量',
          dataIndex: 'ordUnitNum',
          key: 'ordUnitNum',
          render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
        }, {
          title: '单位',
          dataIndex: 'ordUnitName',
          key: 'ordUnitName',
        }, {
          title: '金额',
          dataIndex: 'goodsAmt',
          key: 'goodsAmt',
          render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
        }, {
          title: '单价',
          dataIndex: 'ordPrice',
          key: 'ordPrice',
          render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
        }],
      }, {
        title: '税率',
        dataIndex: 'taxRatio',
        key: 'taxRatio',
        render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
      }, {
        title: '不含税金额',
        dataIndex: 'goodsAmtNotax',
        key: 'goodsAmtNotax',
        render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
      }, {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
        width: '150',
        render: text => <Tooltip placement="leftTop" title={text}>
          <div className="ellipsed-line width-150">{text}</div>
        </Tooltip>
      },
    ];
  }

  refreshList = (value, itemKey, fieldName, rowIndex) => {
    // 更新文本框
    const rowItem = _.find(listData, item => item.id === itemKey);
    rowItem[fieldName] = value;
    // 联动更新
    if (fieldName === 'auditNum') {
      // 改变验收数量按照换算下面换算，计算后展示
      // 提交的时候，需要加上标准数量unitNum(auditNum/purcUnitRates)、
      // 采购数量ordUnitNum(前面标准数量*ordUnitRates)、
      // 金额goodsAmt(前面采购数量*ordPrice)、
      // 税前金额goodsAmtNotax(前面金额-前面金额*taxRatio)属性
      // console.log('refreshList rowItem', rowItem);
      //  标准数量（unitNum ） = 验收数量（auditNum） / 订货转化率 （ purcUnitRates）
      // console.log("订货转化率",rowItem.purcUnitRates);
      const unitNum = rowItem.auditNum / (rowItem.purcUnitRates || 1);
      // 采购数量 （ordUnitNum） =  标准数量（unitNum ） * 采购转化率（ordUnitRates）
      const ordUnitNum = unitNum * (rowItem.ordUnitRates || 1);
      // 含税金额 （goodsAmt） =  采购数量 （ordUnitNum） * 采购单价 （ordPrice）
      const goodsAmt = ordUnitNum * rowItem.ordPrice;
      // 不含税金额 （goodsAmtNotax） = 含税金额（goodsAmt） - 含税金额 （goodsAmt） * 税率 （taxRatio）
      const goodsAmtNotax = goodsAmt - (goodsAmt * rowItem.taxRatio);
      // console.log("unitNum",unitNum,"ordUnitNum, " ,ordUnitNum,"goodsAmt",goodsAmt, "goodsAmtNotax",    goodsAmtNotax);

      rowItem.unitNum = unitNum;
      rowItem.ordUnitNum = ordUnitNum;
      rowItem.goodsAmt = goodsAmt;
      rowItem.goodsAmtNotax = goodsAmtNotax;
      // rowItem.ordAdjustNum = value;
    }

    listData = _.cloneDeep(listData);
    resyncDataSource(listData);
  };

  openModel = (value) => { // 打开物资弹窗
    openGoodsModel(value);
  };

  focusFieldByField=(targetField,index)=>{
    updateEditableMem(targetField, index);
  }

  selectedAGoods = (itemValue, itemId, index) => {
    const selectedItem = _.find(goodsList, item => item.goodsCode === itemValue);
    // const rowItem = _.find(listData, item => item.id === itemId);
    // console.log('selectedItem', selectedItem, itemValue, itemId, index);
    syncSeletedItemIntoRow([selectedItem], index);
    // Object.assign(rowItem, selectedItem);
  };
  savePageData = (status) => {
    saveDetails(status);
  };
  renderColumns = (text, record, index, field, configurations) => {
    const listDataRenderError = _.cloneDeep(listData); // 不合法单元格变红
    const lineItem = listDataRenderError[index];   // 获取这一行数据
    const editable = '';
    const status = false;
    const currEditStatus = editableMem[index];
    let fields = Object.keys(currEditStatus);
    // console.log("currEditStatus",currEditStatus);
    // if (!currEditStatus || (currEditStatus && !(currEditStatus.hasOwnProperty(field)))) {
      // syncMem(field); // 生成编辑内容行列信息
      // return false;
    // }
    // let newdataSourceIndex = 1;
    // dataSourceIndex.length ? (newdataSourceIndex = dataSourceIndex.length) : newdataSourceIndex;
    if (!_.has(editableMem[index], field)) {
      if (index == editableMem.length-1 && (field==fields[0] || fields.length==0)) { // 第一条不能是自动选中状态
      //  console.log('fixed field is configurations.hideField', configurations.hideField);
        // currEditStatus[field] = true;
      } else {
        currEditStatus[field] = false; // 默认不在编辑状态
      }
    }
    // if (!_.has(editableMem[index], field)) {
    //   const fields = Object.keys(currEditStatus);
    //   if (index === editableMem.length - 1 && (field === fields[0] || fields.length === 0)) {
    //     currEditStatus[field] = true;
    //   } else {
    //     currEditStatus[field] = false; // 默认不在编辑状态
    //   }
    // }

    if (typeof editable === 'undefined') {
      return text;
    }
    // console.log("editableMem",editableMem);
    // console.log("currEditStatus",currEditStatus);

    return (<EditableCell
      configurations={configurations}
      inEditStatus={currEditStatus}
      field={field}
      inValue={text}
      validation={lineItem} // 不合法单元格变红
      onChange={value => this.handleChange(field, index, value)}
      status={status}
      openModel={openModel}
      goodsList={goodsList}
      focusField={focusFieldByField}
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
        scroll={{ x: '1440' }}
        rowKey={record => record.id}
        rowClassName={() => 'editable-row'}
      />
      <br />
      {/* {(opType === 'check' || opType === 'create') && pageStatus !== 962
        && <span><Button onClick={() => savePageData(962)} disabled={savingStatus}>暂存</Button>&nbsp;&nbsp;&nbsp;&nbsp;</span>} */}
      {(opType === 'check' || opType === 'create') && pageStatus !== 967
        && <span><Button type="primary" onClick={() => savePageData(967)} disabled={savingStatus}>验收</Button>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
      <Button onClick={cancelDetailPage}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
      {opType === 'view' && pageStatus === 962 && <a href="javacript:void(0);" onClick={() => switchType('check')}>开始验收</a>}
      <div style={{ display: 'none' }}>{JSON.stringify(editableMem)}</div>
    </div>
  );
};

DirectCheckDetailsList.propTypes = {
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
  syncMem: PropTypes.func,
  editableMem: PropTypes.array,
  renderColumns: PropTypes.func,
  refreshList: PropTypes.func,
  cancelDetailPage: PropTypes.func,
  toNextMem: PropTypes.func,
  toggleMemStatus: PropTypes.func,
};
export default DirectCheckDetailsList;
