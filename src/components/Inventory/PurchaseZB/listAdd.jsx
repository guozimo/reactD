import React, { PropTypes } from 'react'
import { Table, Icon, Button, Tooltip, Popconfirm, message, Alert } from 'antd'
import EditableCell from '../_components/EditableCellStore.jsx';
import _ from 'lodash';
import moment from 'moment';
const listAdd = ({
  loading,
  storeId,
  pagination,
  onPageChange,
  onPageSizeChange,
  dataList,
  editableMem, // 新增编码数组
  queryCoding, // 修改仓库
  queryGoodsCoding, // 修改数据
  newData,
  dataSource,
  setItem,
  goodsList,
  changeValue, // 修改数量
  renderColumns, // 编辑数据
  focusFieldByField, // 回车跳转新的边框或者新增一行
  openModel,
  openGoodsModel,
  updateEditableMem, // 回车跳转新的边框或者新增一行
  addData, // 新增一行
  onDelete, // 删除一行
  resyncDataSource, // 联动修改数量
  cancel, // 取消
  onSave, // 保存
  bussDate, // 订单日期
  storeAddId, // 收货机构id
  busiId, // 供应商id
  closeUpdate, // 关闭订单
  onClose, // 关闭订单
  goodsVisible, // 打开弹窗
  modalRowIndex, // 编辑框当前条数
  update, // 新增还是编辑
  dataAll, // 编辑时返回全部
  onUpdateAdd,
  updatedataSource, // 合并数据
  dataSourceIndex, // 判断编辑返回的时候有几条数据
  setDisableSource, // 禁用数组
}) => {
// record.dualUnitFlag ?
// onMouseOver={(event) => {event.stopPropagation();}}
// onMouseOut={(event) => {event.stopPropagation();}}
// onHover={(event) => {event.stopPropagation();}}
// onMouseEnter ={(event) => {event.stopPropagation();}}
// onMouseMove={(event) => {event.stopPropagation();}}
// {
//   title: '调整数量',
//   dataIndex: 'ordAdjustNum',
//   key: 'ordAdjustNum',
//   width: 50,
//   className: 'editable-col',
//   render: (text, record, index) => renderColumns(text, record, index, 'ordAdjustNum', {
//     rowIdent: record.key,
//     type: 'inputNumber',
//     hideField:  record.dualUnitFlag == '1' ? false : true,
//     disabled: !busiId || !storeAddId || !bussDate, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
//     updateValue: (value, itemKey) => changeValue(value, itemKey, 'ordAdjustNum'),
//     transValue: record.ordAdjustNum,
//   }),
// },
  const columns = [
    {
      title: '',
      dataIndex: 'key',
      key: 'key',
      width: '40',
      // fixed: 'left',
      render: (text, record, index) => (parseInt(index) + 1),
    }, {
      title: '物资编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
      // fixed: 'left',
      width: 160,
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'goodsCode',
        {
          rowIdent: record.key, //
          type: 'select',
          onChange: queryCoding, // 输入的值
          selectItem: setItem, // 搜索的回车事件
          keyValues: goodsList, // 搜索数据返回值
          disabled: !busiId || !storeAddId || !bussDate, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
          // disabledList: (() => dataSource.map(item => item.goodsCode))(), // 指定下拉列表中已显示的不让其可选，暂时实现只匹配ID
          disabledList: (() => dataSource.map(item => item.id))(), // 禁用值的id
        },
    ),
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
      title: '到货日期',
      dataIndex: 'arrivalDate',
      key: 'arrivalDate',
      width: 140,
      className: 'editable-col',
      render: (text, record, index) => (
        <div
          onMouseLeave={(event) => { event.stopPropagation(); }}
          onMouseIn={(event) => { event.stopPropagation(); }}
        >
          {
            renderColumns(text, record, index, 'arrivalDate', {
              rowIdent: record.key,
              type: 'datepicker',
              updateValue: (value, itemKey) => changeValue(value, itemKey, 'arrivalDate'),
              disabled: !busiId || !storeAddId || !bussDate, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
              disabledDate: current => current && current.valueOf() < moment(bussDate), // .add(1, 'days'), // Can not select days before today and today
              transValue: text ? moment(text).format('YYYY-MM-DD') : '', // 默认值
            })
          }
        </div>
      ),
    },
    {
      title: '采购',
      children: [{
        title: '数量',
        dataIndex: 'ordUnitNum',
        key: 'ordUnitNum',
        width: 70,
        className: 'editable-col',
        render: (text, record, index) => renderColumns(text, record, index, 'ordUnitNum', {
          style: { width: 50 },
          rowIdent: record.key,
          type: 'inputNumber',
          disabled: !busiId || !storeAddId || !bussDate, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
          updateValue: (value, itemKey) => changeValue(value, itemKey, 'ordUnitNum'),
          transValue: record.ordUnitNum,
        }),
      }, {
        title: '单位',
        dataIndex: 'ordUnitName',
        key: 'ordUnitName',
      }, {
        title: '单价',
        dataIndex: 'ordPrice',
        key: 'ordPrice',
        width: 50,
        className: 'editable-col',
        render: (text, record, index) => renderColumns(text, record, index, 'ordPrice', {
          rowIdent: record.key,
          type: 'inputNumber',
          style: { width: 50 },
          hideField: record.dualUnitFlag == '1' ? false : true,
          disabled: !busiId || !storeAddId || !bussDate, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
          updateValue: (value, itemKey) => changeValue(value, itemKey, 'ordPrice'),
          transValue: record.ordPrice,
        }),
      }, {
        title: '金额',
        dataIndex: 'goodsAmt',
        key: 'goodsAmt',
        width: 80,
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
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
          width: 70,
          render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
          // render: record => (record.ordUnitNum ? record.ordUnitNum * record.ordUnitRates : 0),
        }, {
          title: '单位',
          dataIndex: 'unitName',
          key: 'unitName',
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
          rowIdent: record.key,
          type: 'inputNumber',
          style: { width: 50 },
          isShow: record.dualUnitFlag == '1' ? false : true,
          disabled: !busiId || !storeAddId || !bussDate, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
          updateValue: (value, itemKey) => changeValue(value, itemKey, 'dualUnitNum'),
          transValue: record.dualUnitNum,
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
        dataIndex: 'ordPriceNotax',
        key: 'ordPriceNotax',
        width: 80,
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }, {
        title: '金额',
        dataIndex: 'goodsAmtNotax',
        key: 'goodsAmtNotax',
        width: 80,
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '备注',
      dataIndex: 'remarks',
      width: 150,
      key: 'remarks',
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'remarks', {
        rowIdent: record.key,
        style: { width: 50 },
        maxLength: 25,
        disabled: !busiId || !storeAddId || !bussDate, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
        updateValue: (value, itemKey) => changeValue(value, itemKey, 'remarks'),
        transValue: record.remarks, // (record.goodsQty?record.goodsQty*record.goodsPrice:0),
      }),
    }, {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (text, record, index) => (busiId && storeAddId && bussDate) ?
        <div>
          <Tooltip placement="top" title="新增一行" onClick={() => addData(index)}>
            <a>
              <Icon type="plus" style={{ fontSize: 20, color: '#08c', cursor: 'pointer' }} />
            </a>
          </Tooltip>
          {
            dataSource.length > 1
            ? record.goodsCode ? <Popconfirm
              title={<div><span style={{color:'#f04134'}}>危险操作！</span><br/><span>删除后可能无法恢复，确定继续删除吗？</span></div>}
                okText="确认删除"
                onConfirm={() => onDelete(index, record.id)}>
              <Icon type="minus" style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} />
            </Popconfirm> : <Icon type="minus" onClick={() => onDelete(index, record.id)} style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} />
            : null
          }
        </div> : '',
    }];
  const updateColumns = [
    {
      title: '',
      dataIndex: 'key',
      key: 'key',
      width: '40',
      // fixed: 'left',
      render: (text, record, index) => (parseInt(index) + 1),
    }, {
      title: '物资编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
      // fixed: 'left',
      width: 160,
    //   className: 'editable-col',
    //   render: (text, record, index) => renderColumns(text, record, index, 'goodsCode',
    //     {
    //       rowIdent: record.key,
    //       type: 'select',
    //       onChange: queryCoding,
    //       selectItem: setItem,
    //       keyValues: goodsList,
    //       disabled: !busiId || !storeAddId || !bussDate, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
    //       disabledList: (() => dataSource.map(item => item.id))()
    //     },
    // ),
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
      title: '到货日期',
      dataIndex: 'arrivalDate',
      key: 'arrivalDate',
      width: 140,
      className: 'editable-col',
      render: (text, record, index) => (
        <div
          onMouseLeave={(event) => { event.stopPropagation(); }}
          onMouseIn={(event) => { event.stopPropagation(); }}
        >
          {
            renderColumns(text, record, index, 'arrivalDate', {
              rowIdent: record.key,
              type: 'datepicker',
              updateValue: (value, itemKey) => changeValue(value, itemKey, 'arrivalDate'),
              disabled: !busiId || !storeAddId || !bussDate, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
              disabledDate: current => current && current.valueOf() < moment(bussDate), // .add(1, 'days'), // Can not select days before today and today
              transValue: text ? moment(text).format('YYYY-MM-DD') : '', // 默认值
            })
          }
        </div>
      ),
    }, {
      title: '订货',
      children: [{
        title: '数量',
        dataIndex: 'purcUnitNum',
        key: 'purcUnitNum',
      }, {
        title: '单位',
        dataIndex: 'purcUnitName',
        key: 'purcUnitName',
      }],
      dataIndex: 'stock3',
      key: 'stock3',
    }, {
      title: '采购',
      children: [{
        title: '数量',
        dataIndex: 'ordUnitNum',
        key: 'ordUnitNum',
        width: 70,
        className: 'editable-col',
        render: (text, record, index) => renderColumns(text, record, index, 'ordUnitNum', {
          style: { width: 50 },
          rowIdent: record.key,
          type: 'inputNumber',
          disabled: !busiId || !storeAddId || !bussDate, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
          updateValue: (value, itemKey) => changeValue(value, itemKey, 'ordUnitNum'),
          transValue: record.ordUnitNum,
        }),
      }, {
        title: '单位',
        dataIndex: 'ordUnitName',
        key: 'ordUnitName',
      }, {
        title: '单价',
        dataIndex: 'ordPrice',
        key: 'ordPrice',
        width: 50,
        className: 'editable-col',
        render: (text, record, index) => renderColumns(text, record, index, 'ordPrice', {
          rowIdent: record.key,
          type: 'inputNumber',
          updateValue: (value, itemKey) => changeValue(value, itemKey, 'ordPrice'),
          hideField: record.dualUnitFlag == '1' ? false : true,
          disabled: !busiId || !storeAddId || !bussDate, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
          transValue: record.ordPrice,
        }),
      }, {
        title: '金额',
        dataIndex: 'goodsAmt',
        key: 'goodsAmt',
        width: 70,
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }],
      dataIndex: 'stock',
      key: '3',
    }, {
      title: '标准',
      children: [{
        title: '数量',
        dataIndex: 'unitNum',
        key: 'unitNum',
        width: 70,
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }, {
        title: '单位',
        dataIndex: 'unitName',
        key: 'unitName',
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
          rowIdent: record.key,
          type: 'inputNumber',
          updateValue: (value, itemKey) => changeValue(value, itemKey, 'dualUnitNum'),
          disabled: !busiId || !storeAddId || !bussDate, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
          transValue: record.dualUnitNum,
          isShow:  record.dualUnitFlag == '1' ? false : true,
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
      dataIndex: 'taxRatio',
      key: 'taxRatio',
      width: 50,
    }, {
      title: '不含税',
      children: [{
        title: '单价',
        dataIndex: 'ordPriceNotax',
        key: 'ordPriceNotax',
        width: 50,
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }, {
        title: '金额',
        dataIndex: 'goodsAmtNotax',
        key: 'goodsAmtNotax',
        width: 70,
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 150,
      className: 'editable-col',
      render: (text, record, index) => renderColumns(text, record, index, 'remarks', {
        rowIdent: record.key,
        maxLength: 25,
        updateValue: (value, itemKey) => changeValue(value, itemKey, 'remarks'),
        disabled: !busiId || !storeAddId || !bussDate, // 根据条件判断是否能够搜索 true 不能搜索 false 能够搜索
        transValue: record.remarks, // (record.goodsQty?record.goodsQty*record.goodsPrice:0),
      }),
    // }, {
    //   title: '设置',
    //   key: 'action',
    //   fixed: 'right',
    //   width: 80,
    //   render: (text, record, index) => (busiId && storeAddId && bussDate && dataAll.billSource && dataAll.billSource === 2) ?
    //     <div>
    //       <Tooltip placement="top" title="新增一行" onClick={() => addData(index)}>
    //         <a>
    //           <Icon type="plus" style={{ fontSize: 20, color: '#08c', cursor: 'pointer' }} />
    //         </a>
    //       </Tooltip>
    //       {
    //         dataSource.length > 1
    //         ? record.goodsCode ? <Popconfirm
    //           title={<div><span style={{color:'#f04134'}}>危险操作！</span><br/><span>删除后可能无法恢复，确定继续删除吗？</span></div>}
    //           okText="确认删除"
    //           onConfirm={() => onDelete(index, record.id)}>
    //           <Icon type="minus" style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} />
    //         </Popconfirm> : <Icon type="minus" onClick={() => onDelete(index, record.id)} style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} />
    //         : null
    //       }
    //     </div> : '',
    }];
  focusFieldByField = (targetField, index) => { // 回车跳转新的边框或者新增一行
    // console.log("11111111111111targetField",targetField, "index", index);
    updateEditableMem(targetField, index);
  // currEditStatus[targetField]=true;
  // this.forceUpdate();
  };
  changeValue = (value, itemKey, fieldName) => {
    if (fieldName === 'arrivalDate') {
      // console.log("修改数量----","value",value,"itemKey",itemKey,fieldName,"修改数量fieldName");
      const fields = Object.keys(editableMem[itemKey - 1]);
      const currFieldIndex = _.findIndex(fields, item => item === 'arrivalDate');
      const targetField = fields[currFieldIndex + 1];
      updateEditableMem(targetField, itemKey - 1);
      // console.log("fields------------",fields,"currFieldIndex",currFieldIndex,"editableMem",editableMem[itemKey - 1]);
      // let currFieldIndex = _.findIndex(fields, item => item === currField);
      // console.log("2222222222targetField",targetField, "index", itemKey - 1);
    }
  // 更新文本框
    const rowItem = _.find(dataSource, item => item.key === itemKey);
    // fields = Object.keys(this.state.inEditStatus);
    rowItem[fieldName] = value;
    // console.log("修改数量rowItem[fieldName]",rowItem[fieldName],"rowItem",rowItem);
    // 联动更新
    if (fieldName === 'ordUnitNum') { // ordUnitNum 采购数量
      // console.log("---------------------采购单价rowItem.ordPrice",rowItem.ordPrice);
      // if (!update) {  // 调整数量隐藏不用了
        // ordAdjustNum 调整数量 公式：调整数量 = 采购数量
      rowItem.ordAdjustNum = value;
      // }
      // if (update && dataAll.billSource && dataAll.billSource === 1) {
      //
      // }
      // unitNum 标准数量 公式：标准数量 = 采购数量(ordUnitNum)/采购转换率(ordUnitRates)
      rowItem.unitNum = (value ? (value / (rowItem.ordUnitRates || 1)) : 0);
      // console.log("rowItem.ordUnitRates", (rowItem.ordUnitRates || 1));
      // goodsAmt 采购金额 公式：采购金额 = 采购数量(ordUnitNum)*采购单价(ordPrice)
      // 判断采购单价初始化取值
      // const newOrdPrice = rowItem.ordPrice ? rowItem.ordPrice : (rowItem.lastPrice ? rowItem.lastPrice : rowItem.goodsPrice);
      rowItem.goodsAmt = (value ? value * (rowItem.ordPrice || 0) : 0);
      // goodsAmtNotax 不含税金额 公式：不含税金额 = 不含税单价(ordPriceNotax)*采购数量(ordUnitNum)

      // console.log("----ordPriceNotax",ordPriceNotax);
      rowItem.ordPriceNotax = rowItem.ordPrice ? rowItem.ordPrice / (1 + Number(rowItem.taxRatio)) : 0;
      rowItem.goodsAmtNotax = (value ? (value * rowItem.ordPriceNotax) : 0);
      // console.log(
      //   "ordAdjustNum 调整数量 ",rowItem.ordAdjustNum,
      //   "unitNum 标准数量",rowItem.unitNum,
      //   "goodsAmt 采购金额 ",rowItem.goodsAmt,
      //   "goodsAmtNotax 不含税金额 ",rowItem.goodsAmtNotax
      // );
    }
    // else if (fieldName === 'ordAdjustNum') { // ordAdjustNum 调整数量  // 调整数量隐藏不用了
    //   // console.log("---------------------采购单价rowItem.ordPrice",rowItem.ordPrice);
    //   // 当是编辑的时候，并且是手工创建的不要订单 billSource订单来源 1 生成 2 手工创建
    //   if (update && dataAll.billSource && dataAll.billSource === 1) {
    //     // unitNum 标准数量 公式：标准数量 = 调整数量(ordAdjustNum)/采购转换率(ordUnitRates)
    //     rowItem.unitNum = (value ? (value / (rowItem.ordUnitRates || 1)) : 0);
    //     // console.log("rowItem.ordUnitRates", (rowItem.ordUnitRates || 1));
    //     // goodsAmt 采购金额 公式：采购金额 = 调整数量(ordAdjustNum)*采购单价(ordPrice)
    //     // 判断采购单价初始化取值
    //     // const newOrdPrice = rowItem.ordPrice ? rowItem.ordPrice : (rowItem.lastPrice ? rowItem.lastPrice : rowItem.goodsPrice);
    //     rowItem.goodsAmt = (value ? value * (rowItem.ordPrice || 0) : 0);
    //     // goodsAmtNotax 不含税金额 公式：不含税金额 = 不含税单价(ordPriceNotax)*调整数量(ordAdjustNum)
    //     rowItem.goodsAmtNotax = (value ? (value * rowItem.ordPriceNotax) : 0);
    //     // console.log(
    //     //   "ordAdjustNum 调整数量 ",rowItem.ordAdjustNum,
    //     //   "unitNum 标准数量",rowItem.unitNum,
    //     //   "goodsAmt 采购金额 ",rowItem.goodsAmt,
    //     //   "goodsAmtNotax 不含税金额 ",rowItem.goodsAmtNotax
    //     // );
    //   }
    // }
    else if (fieldName === 'ordPrice') { // ordPrice 采购单价
      // 当是编辑的时候，并且是手工创建的不要订单 billSource订单来源 1 生成 2 手工创建
      if (update && dataAll.billSource && dataAll.billSource === 1) {
        // goodsAmt 采购金额 公式：采购金额 = 调整数量(ordAdjustNum)*采购单价(ordPrice)
        // 采购数据

        rowItem.goodsAmt = (value ? value * (rowItem.ordAdjustNum || 0) : 0);
        // ordPriceNotax 不含税单价 公式：不含税单价 = 采购单价(ordPrice)/(1+税率(taxRatio))
        rowItem.ordPriceNotax = (value ? (value / (1 + Number(rowItem.taxRatio))) : 0);
        // rowItem.ordPriceNotax = (value ? (value / (1 + Number(rowItem.taxRatio))) : 0);
        // goodsAmtNotax 不含税金额 公式：不含税金额 = 不含税单价(ordPriceNotax)*调整数量(ordAdjustNum)
        rowItem.goodsAmtNotax = (value ? (rowItem.ordPriceNotax * (rowItem.ordAdjustNum || 0)) : 0);
        // rowItem.goodsAmtNotax = (value ? rowItem.ordPriceNotax * rowItem.ordUnitNum : 0);
        // console.log(
        //   "goodsAmt 采购金额 ",rowItem.goodsAmt,
        //   "ordPriceNotax 不含税单价",rowItem.ordPriceNotax,
        //   "goodsAmtNotax 不含税金额 ",rowItem.goodsAmtNotax
        // );
      } else {

        // goodsAmt 采购金额 公式：采购金额 = 采购数量(ordUnitNum)*采购单价(ordPrice)
        rowItem.goodsAmt = (value ? value * (rowItem.ordUnitNum || 0) : 0);
        // ordPriceNotax 不含税单价 公式：不含税单价 = 采购单价(ordPrice)/(1+税率(taxRatio))
        rowItem.ordPriceNotax = (value ? (value / (1 + Number(rowItem.taxRatio))) : 0);
        // console.log("rowItem.ordPriceNotax",rowItem.ordPriceNotax,"taxRatio",rowItem.taxRatio);
        // rowItem.ordPriceNotax = (value ? (value / (1 + Number(rowItem.taxRatio))) : 0);
        // goodsAmtNotax 不含税金额 公式：不含税金额 = 不含税单价(ordPriceNotax)*采购数量(ordUnitNum)
        rowItem.goodsAmtNotax = (value ? (rowItem.ordPriceNotax * (rowItem.ordUnitNum || 0)) : 0);
        // rowItem.goodsAmtNotax = (value ? rowItem.ordPriceNotax * rowItem.ordUnitNum : 0);
        // console.log(
        //   "goodsAmt 采购金额 ",rowItem.goodsAmt,
        //   "ordPriceNotax 不含税单价",rowItem.ordPriceNotax,
        //   "goodsAmtNotax 不含税金额 ",rowItem.goodsAmtNotax
        // );
        // console.log("rowItem.ordPrice",rowItem.ordPrice, 'rowItem.lastPrice',rowItem.lastPrice,"rowItem.goodsPrice",rowItem.goodsPrice);
        // console.log("rowItem.goodsAmt",rowItem.goodsAmt,"rowItem.ordUnitNum",value,"rowItem.ordUnitRates",rowItem.ordUnitRates);

      }
    }
    Object.assign(rowItem, {a : 1 });
    // console.log("after dataSource",dataSource);
    dataSource = _.cloneDeep(dataSource);
    resyncDataSource(dataSource);
  };

  queryCoding = (value) => { // 编辑table搜索编码
    // console.log("bussDate",bussDate,"storeAddId",storeAddId,"busiId",busiId);
    if (busiId && storeAddId && bussDate) {
      queryGoodsCoding(value);
    } else {
      message.info('订单日期，收货机构，供应商不能为空！');
    }

  };
  setItem = (itemValue, itemKey) => { // 选择编码后赋值
    const selectedItem = _.find(goodsList, item => item.goodsCode === itemValue);
    const rowItem = _.cloneDeep(_.find(dataSource, item => item.key === itemKey));
    // console.log("rowItem", rowItem,"selectedItem", selectedItem);
    const newData = Object.assign(rowItem, selectedItem);
    // console.log("newData", newData);
    updatedataSource(newData, itemKey);
  };
// 打开物资弹窗
  openModel = (value) => {
    if (busiId && storeAddId && busiId) {
      openGoodsModel(value);
    } else {
      message.info('订单日期，收货机构，供应商不能为空！');
    }
  };
  renderColumns = (text, record, index, field, configurations) => {
   // const { editable, status } = data[index][field];
   // console.warn("22222222222222222222renderColumns_index",index,JSON.stringify(editableMem));
  // console.log("record.dualUnitFlag",record.dualUnitFlag,field);
    let editable="", status = false, currEditStatus= editableMem[index];
    // console.log("currEditStatus", currEditStatus,"idnex", index);
    let fields = Object.keys(currEditStatus);
    // console.log("3333333333333field",JSON.stringify(field));
    // if (field === 'goodsCode') {
    //   const newDisableSource = _.find(dataSource, item => item.id === record.id)
    //   // const newDisableSource = dataSource.map(item => item.goodsCode);
    //   console.warn("newDisableSource",field);
    //   setDisableSource(newDisableSource);
    // }
  // fields = fields.concat('dualUnitNum');
  // console.warn("editableMem",editableMem.length);
  // console.warn("editableMem-a----",index,"fields",fields);
 // console.log("editableMem-b----",index,"if",(!_.has(editableMem[index],field)),(index==editableMem.length-1&&field==fields[0]) );
    let newdataSourceIndex = 1;
    dataSourceIndex && dataSourceIndex.length ? (newdataSourceIndex = dataSourceIndex.length) : newdataSourceIndex;
    if (!_.has(editableMem[index], field)) {
      if (index == editableMem.length-1 && (field==fields[0] || fields.length==0) && editableMem.length !== newdataSourceIndex) { // 第一条不能是自动选中状态
       // console.log('fixed field is configurations.hideField', configurations.hideField);
        currEditStatus[field] = true;
      } else {
        // console.log("4444444444444444444444444444currEditStatus[field]",editableMem[index],JSON.stringify(currEditStatus),field);
        currEditStatus[field] = false; // 默认不在编辑状态
        // console.log("555555555555555555555555555555555555currEditStatus[field]",JSON.stringify(currEditStatus),currEditStatus[field]);
      }
    }

   // resetEditableMem(editableMem);

    if (typeof editable === 'undefined') {
      return text;
    }
   // console.log("11111111111111111111currEditStatus",currEditStatus);
   return (<EditableCell
     configurations={configurations}
     inEditStatus={currEditStatus}
     field={field}
     inValue={text}
     onChange={value => this.handleChange(field, index, value)}
     status={status}
     openModel={openModel}
     isBillSourceAdd={update && dataAll.billSource && dataAll.billSource === 1 && (index + 1) >= dataSourceIndex.length}
     goodsList={goodsList}
     focusField={focusFieldByField}
     rowIndex={index}
     clickToEdit={()=>{
       // console.log("22222currEditStatus",currEditStatus);
       currEditStatus[field]=!currEditStatus[field];
     }}
   />);
 };
 // 当是编辑的时候，并且是手工创建的不要订单 billSource订单来源 1 生成 2 手工创建
// console.log("--------------dataSource",dataSource);
  return (
    <div className="components-listAdd">
      <br />
      <div>
        <Table
          bordered
          size="small"
          columns={update && dataAll.billSource && dataAll.billSource === 1 ? updateColumns : columns}
          loading={loading}
          dataSource={dataSource}
          onRowClick={onUpdateAdd}
          pagination={false}
          scroll={update && dataAll.billSource && dataAll.billSource === 1 ? { x: '1540' } : { x: '1400' }}
          rowClassName={() => 'editable-row'}
        />
        <br />
        <span>
          <Button onClick={() => onSave(1)}>暂存</Button>
          <Button type="primary" style={{ marginLeft: 16 }} onClick={() => onSave(0)}>采购</Button>
          <Button onClick={cancel} style={{ marginLeft: 16 }}>返回</Button>
        </span>
      </div>
    </div>
  );
};

listAdd.propTypes = {
  loading: PropTypes.bool,
  storeId: PropTypes.string,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  openModel: PropTypes.func,
  updateEditableMem: PropTypes.func,
};
export default listAdd;
