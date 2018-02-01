import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Table, Icon, Button, Tooltip, Popconfirm, message, Modal } from 'antd';
import EditableCell from '../../_components/EditableCell2';

const StockOutDetailsList = ({
  // module state
  storeId,
  sureModal,
  complexModal,
  pageType,
  loading,
  pageDetail,
  editableMem,
  goodsList,
  pageStatus,
  savingStatus,
  // new~
  // findList,
  readyOutDataArray,
  complexDataArray,
  // 方法
  sureModalHandle,
  updateReadyOutDataArraynow,
  updateComplexDataArraynow,
  // module 方法
  resyncDataSource,
  saveDetails,
  cancelDetailPage,
  toNextMem,
  toggleMemStatus,

  // 私有方法
  renderColumns,
  refreshList,
  onUpdateAdd,
  savePageData,
  dataSourceIndex,
  complexModalHandle,
}) => {
  let columnsConfig = [];
  let listData = pageDetail;  // 可编辑表格内的内容
  const complexTablePagination = { pageSizeOptions: '20', hideOnSinglePage: true };
  // let clintHeight = document.body.clientHeight / 3;   ----获取屏幕宽度
  const readyOutDataMessage = readyOutDataArray.length && readyOutDataArray.map(store =>
    <div style={{marginLeft:40,marginTop:20,width:'20%',display:'inline-block'}}>
    <Tooltip title={store.goodsCode} placement="right">
      <span>{store.goodsName}</span>
    </Tooltip></div>);
  const title = {
    nowOutGoodsnumber: (
      <span>
        本次出库数量
      </span>
    )
  }
  if (pageType === 'view') {
    columnsConfig = [{
      title: '',
      dataIndex: 'index',
      key: 'index',
      width: 40,
      render: (text, record, index) => (parseInt(index) + 1),
    },
    //  {
    //   title: '请购单号',
    //   dataIndex: 'applyBillNo',
    //   key: 'applyBillNo',
    // },
    {
      title: '物品编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
      width: 90,
    }, {
      title: '物品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      width: 90,
    }, {
      title: '规格',
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
    }, {
      title: '标准',
      children: [{
        title: '单位',
        dataIndex: 'unitName',
        key: 'unitName',
      }, {
        title: '订单数量',
        dataIndex: 'unitNum',
        key: 'unitNum',
      }, {
        title: '已出库数量',
        dataIndex: 'outNum',
        key: 'outNum',
      }],
    }, {
      title: '辅助',
      children: [{
        title: '出库数',
        dataIndex: 'currOutDualNum',
        key: 'currOutDualNum',
        width: 70,
      }, {
        title: '库存数量',
        dataIndex: 'dualWareNum',
        key: 'dualWareNum',
        width: 70,
      }, {
        title: '单位',
        dataIndex: 'dualUnitName',
        key: 'dualUnitName',
      }],
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
        width: 60,
      }],
    },
    // {
    //   title: '到货日期',
    //   dataIndex: 'arrivalDate',
    //   key: 'arrivalDate',
    //   width: 80,
    // },
    {
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
    },
    // {
    //   title: '请购单号',
    //   dataIndex: 'applyBillNo',
    //   key: 'applyBillNo',
    // },
    {
      title: '物品编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
      width: 150,

    }, {
      title: '物品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
    }, {
      title: '规格',
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
      width: 60,
    }, {
      title: '标准',
      children: [{
        title: '单位',
        dataIndex: 'unitName',
        key: 'unitName',
        width: 60,
      }, {
        title: '订单数量', // 标准数量=订货单位转换率*订货数量
        dataIndex: 'unitNum',
        key: 'unitNum',
        width: 70,
      }, {
        title: '已出库数量', // 标准数量=订货单位转换率*订货数量
        dataIndex: 'outNum',
        key: 'outNum',
        width: 80,
      }, {
        title: '当前库存数 ', // 标准数量=订货单位转换率*订货数量
        dataIndex: 'wareNum',
        key: 'wareNum',
        width: 80,
      }, {
        title: title.nowOutGoodsnumber, // 标准数量=订货单位转换率*订货数量
        dataIndex: 'currOutNum',
        key: 'currOutNum',
        className: 'editable-col',
        width: 120,
        render: (text, record, index) => renderColumns(text, record, index, 'currOutNum', {
          type: 'number',
          rowIdent: record.id,
          // disabled: !storeId || !depotId || !billType,
          updateValue: (value, itemKey) => refreshList(value, itemKey, 'currOutNum', index),
          transValue: record.currOutNum,
          originalProps: {
            style: { width: 50 },
            onPressEnter: () => toNextMem(index, 'currOutNum', (!record.dualUnitName)), // 跳转到下一个编辑状态
            // onFocusInput: () => toggleMemStatus(index, 'currOutNum'), // 修改其他的编辑状态为非编辑状态
          },
        }),
      }],
    }, {
      title: '辅助',
      children: [{
        title: '出库数', // 标准数量=订货单位转换率*订货数量
        dataIndex: 'currOutDualNum',
        key: 'currOutDualNum',
        className: 'editable-col',
        width: 120,
        render: (text, record, index) => renderColumns(text, record, index, 'currOutDualNum', {
          isShow: !record.dualUnitName, // record.dualUnitFlag == '1' 可以修改
          type: 'number',
          rowIdent: record.id,
          // disabled: !storeId || !depotId || !billType,
          updateValue: (value, itemKey) => refreshList(value, itemKey, 'currOutDualNum', index),
          transValue: record.currOutDualNum,
          originalProps: {
            style: { width: 50 },
            onPressEnter: () => toNextMem(index, 'currOutDualNum'), // 跳转到下一个编辑状态
            // onFocusInput: () => toggleMemStatus(index, 'currOutDualNum'), // 修改其他的编辑状态为非编辑状态
          },
        }),
      }, {
        title: '库存数量',
        dataIndex: 'dualWareNum',
        key: 'dualWareNum',
        width: 70,
      }, {
        title: '单位',
        dataIndex: 'dualUnitName',
        key: 'dualUnitName',
      }],
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
    },
    // {
    //   title: '到货日期',
    //   dataIndex: 'arrivalDate',
    //   key: 'arrivalDate',
    //   width: 80,
    // },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 150,
      render: text => <Tooltip placement="leftTop" title={text}>
        <div className="ellipsed-line width-150">{text}</div>
      </Tooltip>,
    },
    // {
    //   title: '操作',
    //   dataIndex: 'options',
    //   fixed: 'right',
    //   key: 'options',
    //   width: 80,
    //   render: (text, record, index) => (storeId) ? <div>
    //     <Tooltip placement="top" title="新增一行">
    //       <Icon
    //         type="plus"
    //         style={{ fontSize: 20, color: '#08c', cursor: 'pointer' }}
    //         onClick={() => insertNewRowAfterIndex(index)}
    //       />
    //     </Tooltip>
    //     {
    //       listData.length > 1
    //       ? <Popconfirm
    //         title={<div><span style={{ color: '#f04134' }}>危险操作！</span><br /><span>删除后可能无法恢复，确定继续删除吗？</span></div>}
    //         okText="确认删除"
    //         onConfirm={() => removeRowAtIndex(record.id, index)}
    //       >
    //         <Icon type="minus" style={{ fontSize: 20, color: 'red', cursor: 'pointer' }} />
    //       </Popconfirm>
    //       : null
    //     }
    //   </div> : '',
    // }
    ];
  }
  const readyOutDatacolumns = [{
    title: '物品编码',
    dataIndex: 'goodsCode',
  }, {
    title: '物品名称',
    dataIndex: 'goodsName',
  }, {
    title: '合计出库数量',
    dataIndex: 'outNum',
  }, {
    title: '库存数量',
    dataIndex: 'hasNum',
  }];
  refreshList = (value, itemKey, fieldName, rowIndex) => {
    // 更新文本框
    const rowItem = _.find(listData, item => item.id === itemKey);
    rowItem[fieldName] = value;
    // 联动更新
    // console.log(rowItem);
    // if (fieldName === 'outDualNum') {
    //   // 修改为非编辑状态
    //   switchEditingStatus(rowIndex, fieldName, false);
    // }

    listData = _.cloneDeep(listData);
    resyncDataSource(listData);
  };
/**
 *  in_array 函数
 * 检测数组中是否有这个字符
 * stringToSearch - 字符
 * arrayToSearch - 数组
 */
  function in_array(stringToSearch, arrayToSearch) {
     for (let s = 0; s < arrayToSearch.length; s++) {
      let thisEntry = arrayToSearch[s];
      if (thisEntry === stringToSearch) {
       return true;
      }
     }
     return false;
}
  // 出库处理
  savePageData = (status) => {
    let flag = 0;
    let readyOutDataArraynow = [];
    if (listData) {
      for (let i = 0, index = listData.length; i < index; i += 1) {
        if (listData[i].currOutNum + listData[i].outNum < listData[i].unitNum) {
          flag = 1;
          readyOutDataArraynow.push({
            goodsName: listData[i].goodsName,
            goodsCode: listData[i].goodsCode
          });
          updateReadyOutDataArraynow(readyOutDataArraynow);
        }
      }
      let complexDataArray = [];
      // 查询重复的,算入一个数组中
      let someArray = [];
      let exArray = [];
      for (let i = 0, index = listData.length; i < index; i += 1) {
        if (in_array(listData[i].goodsCode, exArray)){
          someArray.push(listData[i].goodsCode); // 得到重复的数据
        }
        exArray.push(listData[i].goodsCode);
      }
      for (let i = 0, index = someArray.length; i < index; i += 1) {
        let sumOutNum = 0; // 总计出库数
        let sumUnitNum = 0; // 总计订单数
        let nowWareNum = 0; // 当前库存数
        let nowGoodsName = '';
        let nowGoodsCode = '';
        for (let j = 0, index1 = listData.length; j < index1; j += 1) {
            if (listData[j].goodsCode === someArray[i]) {
              sumOutNum += listData[j].currOutNum;
              sumUnitNum += listData[j].unitNum;
              nowWareNum = listData[j].wareNum;
              nowGoodsName = listData[j].goodsName;
              nowGoodsCode = listData[j].goodsCode;
                // console.log(sumOutNum,listData[j].goodsCode,someArray[j]);
            }
        }
        // 如果违反条件，则填充数组
        if (sumOutNum > nowWareNum) {
          flag = 2;
          complexDataArray.push({
            goodsName: nowGoodsName,
            goodsCode: nowGoodsCode,
            outNum: sumOutNum,
            unitNum: sumUnitNum,
            hasNum: nowWareNum,
          });
          updateComplexDataArraynow(complexDataArray);
        }
      }
      if (flag === 1)sureModalHandle(true);  // 弹出部分出库的窗口
      else if (flag === 2)complexModalHandle(true); // 弹出重复物资过多判断窗口
      else saveDetails(status);
      // console.log(readyOutDataArraynow);
    } else {
      message.error('没有数据！');
    }
  };
  renderColumns = (text, record, index, field, configurations) => {
     // console.log("field",field);''
    const status = false;

    const listDataRenderError = _.cloneDeep(listData);

    const lineItem = listDataRenderError[index];   // 获取这一行数据
    const currEditStatus = editableMem[index];
    let fields = Object.keys(currEditStatus);
    let newdataSourceIndex = 1;
    dataSourceIndex && dataSourceIndex.length ? (newdataSourceIndex = dataSourceIndex.length) : newdataSourceIndex;
    if (!_.has(editableMem[index], field)) {
      if (index == 0 && (field==fields[0] || fields.length==0) && editableMem.length !== newdataSourceIndex) {
         // 自动选中第一条数据
        // currEditStatus[field] = true;
      } else {
        currEditStatus[field] = false; // 默认不在编辑状态
      }
    }
    return (
      <EditableCell
        className="editable-col-red"
        configurations={configurations}
        inEditStatus={currEditStatus}
        validation={lineItem}
        field={field}
        status={status}
        goodsList={goodsList}
        rowIndex={index}
        clickToEdit={() => {
          currEditStatus[field] = !currEditStatus[field];
        }}
      />
// </div>

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
        onRowClick={onUpdateAdd}
        rowKey={record => record.id}
        rowClassName={() => 'editable-row'}
        scroll={{ x: '1400' }}
      />
      <br />
      {((pageType === 'edit') && pageStatus != 970)
        && <span><Button type="primary" onClick={() => savePageData(pageStatus)} disabled={savingStatus}>出库</Button>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
      <Button onClick={cancelDetailPage}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
      <Modal
        title="部分出库提醒"
        visible={sureModal}
        okType="Default"
        onOk={() => saveDetails(pageStatus)}
        onCancel={() => sureModalHandle(false)}
        >
          以下物资的出库操作是部分出库，您确定要部分出库？
          <div style={{overflow:'auto',maxHeight:'40vh'}}>
          {readyOutDataMessage}
          </div>
        {/* <Table
          columns={readyOutDatacolumns}
          size="small"
          dataSource={readyOutDataArray}
          bordered
        /> */}
      </Modal>
      <Modal
        title={<span style={{color:'red'}}>出库数量超出提醒</span>}
        visible={complexModal}
        okType="Default"
        onCancel={() => complexModalHandle(false)}
        destroyOnClose = {true}
        footer = {<Button type="primary" onClick={() => complexModalHandle(false)}> 确定</Button>}
        >
          以下物品库存不足，请修改出库数：
        <Table
          columns={readyOutDatacolumns}
          size="small"
          dataSource={complexDataArray}
          pagination={complexTablePagination}
          bordered
        />
      </Modal>
    </div>
  );
};

StockOutDetailsList.PropTypes = {
  pageType: PropTypes.string,
  pageStatus: PropTypes.string,
  resyncDataSource: PropTypes.func,
  insertNewRowAfterIndex: PropTypes.func,
  saveDetails: PropTypes.func,
  removeRowAtIndex: PropTypes.func,
  switchEditingStatus: PropTypes.func,
  editableMem: PropTypes.array,
  renderColumns: PropTypes.func,
  refreshList: PropTypes.func,
  cancelDetailPage: PropTypes.func,
  toNextMem: PropTypes.func,
  toggleMemStatus: PropTypes.func,
  foundTreeList: PropTypes.array,
};
export default StockOutDetailsList;
