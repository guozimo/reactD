import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Table, Button, Tooltip } from 'antd';
import EditableCell from '../../_components/EditableCell2';

const DispatchCheckDetailsList = ({
  opType, // 类型 查看or验收
  loadingList, // 缓冲
  pageDetail, // 表格数据
  editableMem, // 可编辑表格对象的状态：true/false
  auditStatus, // 验收状态
  // module 方法
  resyncDataSource, // 编辑列表后同步，以在列表中即时显示
  cancelDetailPage, // 点击返回返回查询页
  toNextMem, // 辅助数量、验收，点击enter跳转到下一个编辑状态
  toggleMemStatus, // 修改其他的编辑状态为非编辑状态
  saveDetails, // 保存验收信息
  // 私有方法
  renderColumns, // 辅助数量、验收:使单元格处于可编辑状态
  refreshList, // 辅助数量、验收
  savePageData, // 点击验收，保存验收信息
}) => {
  let columnsConfig = [];
  let listData = pageDetail;
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
        title: '标准',
        children: [{
          title: '数量',
          dataIndex: 'unitNum',
          key: 'unitNum',
          render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
        }, {
          title: '单位',
          dataIndex: 'unitName',
          key: 'unitName',
        }, {
          title: '单价',
          dataIndex: 'goodsPrice',
          key: 'goodsPrice',
          render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
        }, {
          title: '金额',
          dataIndex: 'goodsAmt',
          key: 'goodsAmt',
          render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
        }],
      }, {
        title: '本次验收(标准单位)',
        dataIndex: 'auditQty',
        key: 'auditQty',
        width: 75,
        render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
      }, {
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
        }],
      }, {
        title: '辅助',
        children: [{
          title: '数量',
          dataIndex: 'auditDualQty',
          key: 'auditDualQty',
          render: (text, record, index) => record.dualUnitName ? parseFloat(Number(text).toFixed(4)) : '',
        }, {
          title: '单位',
          dataIndex: 'dualUnitName',
          key: 'dualUnitName',
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
        render: (text, record) =>
          parseFloat(Number((record.unitNum * record.goodsPrice) - (record.unitNum * record.goodsPrice * record.taxRatio)).toFixed(4)),
      }, {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
        width: '150',
        render: text =>
          // 文字提示气泡框 placement：气泡框位置
          <Tooltip placement="leftTop" title={text}>
            <div className="ellipsed-line width-150">{text}</div>
          </Tooltip>,
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
          title: '数量', // 订货数量(purcUnitNum)=标准数量(unitNum)*订货转化率(purcUnitRates)
          dataIndex: 'purcUnitNum',
          key: 'purcUnitNum',
          render: (text, record) => parseFloat(Number(record.unitNum * (record.purcUnitRates || 1)).toFixed(4)),
        }, {
          title: '单位',
          dataIndex: 'purcUnitName',
          key: 'purcUnitName',
        }],
      }, {
        title: '标准',
        children: [{
          title: '数量',
          dataIndex: 'unitNum',
          key: 'unitNum',
          width: 60,
          render: text => parseFloat(Number(text).toFixed(4)),
        }, {
          title: '单位',
          dataIndex: 'unitName',
          key: 'unitName',
        }, {
          title: '单价',
          dataIndex: 'goodsPrice',
          key: 'goodsPrice',
          render: text => parseFloat(Number(text).toFixed(4)),
        }, {
          title: '金额',
          dataIndex: 'goodsAmt',
          key: 'goodsAmt',
          render: (text, record) => parseFloat(Number(record.unitNum * record.goodsPrice).toFixed(4)),
        }],
      }, {
        title: '本次验收（标准单位）',
        dataIndex: 'auditQty',
        key: 'auditQty',
        width: 90,
        className: 'editable-col',
        render: (text, record, index) => renderColumns(text, record, index, 'auditQty', {
          type: 'number',
          rowIdent: record.id,
          // 实时更新数据，将输入的数据传到后台
          updateValue: (value, itemKey) => refreshList(value, itemKey, 'auditQty', index),
          transValue: record.auditQty,
          originalProps: {
            style: { width: 40 },
            min: 0,
            // 跳转到下一个编辑状态
            onPressEnter: () => toNextMem(index, 'auditQty', (record.dualUnitName ? false : true)),
            // 修改其他的编辑状态为非编辑状态
            // onFocusInput: () => toggleMemStatus(index, 'auditQty'),
          },
        }),
      }, {
        title: '采购',
        children: [{
          title: '数量', // 采购数量(ordUnitNum)=标准数量(unitNum)*采购转化率(ordUnitRates)
          dataIndex: 'ordUnitNum',
          key: 'ordUnitNum',
          render: (text, record) => parseFloat(Number(record.unitNum * (record.ordUnitRates || 1)).toFixed(4)),
        }, {
          title: '单位',
          dataIndex: 'ordUnitName',
          key: 'ordUnitName',
        }],
      }, {
        title: '辅助',
        children: [{
          title: '数量',
          dataIndex: 'dualUnitNum',
          key: 'dualUnitNum',
          width: 70,
          className: 'editable-col',
          render: (text, record, index) => record.dualUnitName ?
            renderColumns(text, record, index, 'dualUnitNum', {
              type: 'number',
              rowIdent: record.id,
              isShow: record.dualUnitName ? false : true,
              updateValue: (value, itemKey) => refreshList(value, itemKey, 'dualUnitNum', index),
              transValue: record.dualUnitNum,
              originalProps: {
                min: 0,
                // 跳转到下一个编辑状态
                onPressEnter: () => toNextMem(index, 'dualUnitNum'),
                // 修改其他的编辑状态为非编辑状态
                // onFocusInput: () => toggleMemStatus(index, 'dualUnitNum'),
              },
            }) : null,
        }, {
          title: '单位',
          dataIndex: 'dualUnitName',
          key: 'dualUnitName',
        }],
      }, {
        title: '税率',
        dataIndex: 'taxRatio',
        key: 'taxRatio',
        render: text => text && text !== '0' ? parseFloat(Number(text).toFixed(4)) : text,
      }, {
        title: '不含税金额', // 标准数量*单价-标准数量*单价*税率
        dataIndex: 'goodsAmtNotax',
        key: 'goodsAmtNotax',
        render: (text, record) =>
          parseFloat(Number((record.unitNum * record.goodsPrice) - (record.unitNum * record.goodsPrice * record.taxRatio)).toFixed(4)),
      }, {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
        width: '150',
        render: text =>
          <Tooltip placement="leftTop" title={text}>
            <div className="ellipsed-line width-150">{text}</div>
          </Tooltip>,
      },
    ];
  }
  // 验收节点：改变验收数量后相关数据进行更改
  refreshList = (value, itemKey, fieldName, rowIndex) => {
    // 实时更新文本框，listData：表格数据
    const rowItem = _.find(listData, item => item.id === itemKey);
    rowItem[fieldName] = value;
    // 填写本次验收，联动更新
    // if (fieldName === 'auditQty') {
      // 改变验收数量按照下面换算，计算后展示
      // 标准数量（unitNum）= 验收数量（auditQty）
      // const unitNum = rowItem.auditQty;
      // 不含税金额（goodsAmtNotax）= 金额（goodsAmt）- 金额（goodsAmt）* 税率（taxRatio）
      // const goodsAmtNotax = rowItem.goodsAmt - (rowItem.goodsAmt * rowItem.taxRatio);
      // 采购数量（ordUnitNum）= 标准数量（unitNum ）* 采购转化率（ordUnitRates）
      // const ordUnitNum = rowItem.unitNum * (rowItem.ordUnitRates || 1);
      // 订货数量（purcUnitNum）= 标准数量（unitNum ）* 订货转化率（purcUnitRates）
      // const purcUnitNum = rowItem.unitNum * (rowItem.purcUnitRates || 1);
      // 重新赋值
      // rowItem.unitNum = unitNum;
      // rowItem.goodsAmtNotax = goodsAmtNotax;
      // rowItem.ordUnitNum = ordUnitNum;
      // rowItem.purcUnitNum = purcUnitNum;
    // }
    listData = _.cloneDeep(listData);
    resyncDataSource(listData); // 编辑列表后同步，以在列表中即时显示
  };
  // 辅助数量、验收节点：使单元格处于可编辑状态
  renderColumns = (text, record, index, field, configurations) => {
    // field值：auditQty
    const listDataRenderError = _.cloneDeep(listData); // 不合法单元格变红
    const lineItem = listDataRenderError[index];   // 获取这一行数据
    const status = false;
    const currEditStatus = editableMem[index];
    const fields = Object.keys(currEditStatus);// 以数组形式返回对象的所有属性
    if (!_.has(editableMem[index], field)) {
      // 第一条不能是自动选中状态
      if (index === editableMem.length - 1 && (field === fields[0] || fields.length === 0)) {
        // currEditStatus[field] = true;
      } else {
        currEditStatus[field] = false; // 默认不在编辑状态
      }
    }
    return (<EditableCell
      configurations={configurations}
      inEditStatus={currEditStatus} // 是否在编辑状态
      field={field}
      inValue={text} // 页面初始化时验收栏显示的值
      validation={lineItem} // 不合法单元格变红
      onChange={value => this.handleChange(field, index, value)}
      status={status}
      rowIndex={index}
      clickToEdit={() => {
        currEditStatus[field] = !currEditStatus[field];
      }}
    />);
  };
  // 点击验收，保存验收信息, 待修改
  savePageData = (status) => {
    saveDetails(status);
  };
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
      {opType === 'check' && auditStatus !== 1 &&
        <span>
          <Button type="primary" onClick={() => savePageData(1)}>验收</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      }
      <Button onClick={cancelDetailPage}>返回</Button>
    </div>
  );
};

DispatchCheckDetailsList.propTypes = {
  opType: PropTypes.string,
  auditStatus: PropTypes.string,
  resyncDataSource: PropTypes.func,
  saveDetails: PropTypes.func,
  editableMem: PropTypes.array,
  renderColumns: PropTypes.func,
  refreshList: PropTypes.func,
  cancelDetailPage: PropTypes.func,
  toNextMem: PropTypes.func,
  toggleMemStatus: PropTypes.func,
};
export default DispatchCheckDetailsList;
