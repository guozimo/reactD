import React, { PropTypes } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Table, Icon, Button, Tooltip, Popconfirm, Modal } from 'antd';
import EditableCell from '../../_components/EditableCell';

const OrderLibDetailsList = ({
  // module state
  opType,
  loadingList,
  pageDetail,
  editableMem,
  goodsList,
  pageStatus,
  pageInfo,
  billInfo,
  prosessingStatus,
  processData,
  processStatus,

  // module 方法
  switchType,
  resyncDataSource,
  getGoodsListByTyping,
  syncMem,
  openGoodsModel,
  syncSeletedItemIntoRow,
  insertNewRowAfterIndex,
  removeRowAtIndex,
  doProgress,
  cancelDetailPage,
  confirmProcess,
  hideModal,
  // 私有方法
  renderColumns,
  refreshList,
  selectedAGoods,
  openModel,
  focusFieldByField,
  showGoodsListByTyping,
  startProgress,
  findBillNoInfo,
}) => {
  // 序号 物资编码 物资名称 规格型号 订货单位 订货数量 标准单位 标准数量 备注 操作
  let columnsConfig = [];
  let listData = pageDetail;
  // pageDetail = pageDetail.results ? pageDetail.results : {};
  // console.log('pageDetail', pageDetail);
  // if (Object.keys(pageDetail).length) {
  //   listData = pageDetail.detailList;
  // }
  if (opType === 'view') {
    if (billInfo.status === 965) { // 门店的已提交在总部是待处理，待处理状态不显示前几列数据
      columnsConfig = [
        {
          title: '',
          dataIndex: 'index',
          width: '40',
          key: 'index',
          render: (text, record, index) => (parseInt(index, 10) + 1),
        }, {
          title: '物资',
          children: [
            {
              title: '编码',
              dataIndex: 'goodsCode',
              key: 'goodsCode',
              width: '70',
            }, {
              title: '名称',
              dataIndex: 'goodsName',
              key: 'goodsName',
              width: '80',
            }, {
              title: '规格',
              dataIndex: 'goodsSpec',
              key: 'goodsSpec',
              width: '50',
            },
          ],
        }, {
          title: '请购', // 订货单位
          children: [
            {
              title: '数量',
              dataIndex: 'purcUnitNum',
              key: 'purcUnitNum',
              width: '50',
            }, {
              title: '单位', // 订货单位
              dataIndex: 'purcUnitName',
              key: 'purcUnitName',
              width: '50',
            },
          ],
        }, {
          title: '标准', // 标准单位
          children: [
            {
              title: '数量',
              dataIndex: 'unitNum',
              key: 'unitNum',
              width: '50',
            }, {
              title: '单位', // 标准单位
              dataIndex: 'unitName',
              key: 'unitName',
              width: '50',
            },
          ],
        }, {
          title: '辅助', // 辅助单位
          children: [
            {
              title: '数量',
              dataIndex: 'dualUnitNum',
              key: 'dualUnitNum',
              width: '50',
            }, {
              title: '单位', // 辅助单位
              dataIndex: 'dualUnitName',
              key: 'dualUnitName',
              width: '50',
            },
          ],
        }, {
          title: '到货日期',
          dataIndex: 'arrivalDate',
          key: 'arrivalDate',
          render: text => text && moment(text).format('YYYY-MM-DD'),
          width: '80',
        }, {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: '100',
          render: text => <Tooltip placement="leftTop" title={text}>
            <div className="ellipsed-line width-100">{text}</div>
          </Tooltip>,
        },
      ];
    } else {
      columnsConfig = [
        {
          title: '',
          dataIndex: 'index',
          width: '40',
          key: 'index',
          render: (text, record, index) => (parseInt(index, 10) + 1),
        }, {
          title: '类型', // 方向:1 是供应商直运，2 是物流中心配送
          dataIndex: 'directionType',
          key: 'directionType',
          width: '100',
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
          width: '100',
        }, {
          title: '供应商',
          dataIndex: 'busiName',
          key: 'busiName',
          width: '100',
        }, {
          title: '采购单号',
          dataIndex: 'billNo',
          key: 'billNo',
          width: '120',
          render: (text, record) => <a onClick={() => findBillNoInfo(record.id, record.directionType)}>{text}</a>
        }, {
          title: '物资',
          children: [
            {
              title: '编码',
              dataIndex: 'goodsCode',
              key: 'goodsCode',
              width: '70',
            }, {
              title: '名称',
              dataIndex: 'goodsName',
              key: 'goodsName',
              width: '80',
            }, {
              title: '规格',
              dataIndex: 'goodsSpec',
              key: 'goodsSpec',
              width: '50',
            },
          ],
        }, {
          title: '请购', // 订货单位
          children: [
            {
              title: '数量',
              dataIndex: 'purcUnitNum',
              key: 'purcUnitNum',
              width: '50',
            }, {
              title: '单位', // 订货单位
              dataIndex: 'purcUnitName',
              key: 'purcUnitName',
              width: '50',
            },
          ],
        }, {
          title: '标准', // 标准单位
          children: [
            {
              title: '数量',
              dataIndex: 'unitNum',
              key: 'unitNum',
              width: '50',
            }, {
              title: '单位', // 标准单位
              dataIndex: 'unitName',
              key: 'unitName',
              width: '50',
            },
          ],
        }, {
          title: '辅助', // 辅助单位
          children: [
            {
              title: '数量',
              dataIndex: 'dualUnitNum',
              key: 'dualUnitNum',
              width: '50',
            }, {
              title: '单位', // 辅助单位
              dataIndex: 'dualUnitName',
              key: 'dualUnitName',
              width: '50',
            },
          ],
        }, {
          title: '到货日期',
          dataIndex: 'arrivalDate',
          key: 'arrivalDate',
          render: text => text && moment(text).format('YYYY-MM-DD'),
          width: '80',
        }, {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: '100',
          render: text => <Tooltip placement="leftTop" title={text}>
            <div className="ellipsed-line width-100">{text}</div>
          </Tooltip>,
        },
      ];
    }
  } else {
    columnsConfig = [
      {
        title: '',
        dataIndex: 'index',
        width: '40',
        key: 'index',
        render: (text, record, index) => (parseInt(index, 10) + 1),
      }, {
        title: '机构名称',
        dataIndex: 'storeName',
        key: 'storeName',
        width: 100,
      }, {
        title: '请购单',
        dataIndex: 'billNo',
        key: 'billNo',
        width: 100,
      }, {
        title: '物资',
        children: [{
          title: '编码',
          dataIndex: 'goodsCode',
          key: 'goodsCode',
          width: '80',
        }, {
          title: '名称',
          dataIndex: 'goodsName',
          key: 'goodsName',
          width: '80',
        }, {
          title: '规格',
          dataIndex: 'goodsSpec',
          key: 'goodsSpec',
          width: '50',
        }],
      }, {
        title: '请购',
        children: [{
          title: '数量',
          dataIndex: 'purcUnitNum',
          key: 'purcUnitNum',
          width: '50',
        }, {
          title: '单位',
          dataIndex: 'purcUnitName',
          key: 'purcUnitName',
          width: '50',
        }],
      }, {
        title: '标准',
        children: [{
          title: '数量',
          dataIndex: 'unitNum',
          key: 'unitNum',
          width: '50',
        }, {
          title: '单位',
          dataIndex: 'unitName',
          key: 'unitName',
          width: '50',
        }],
      }, {
        title: '辅助',
        children: [{
          title: '数量',
          dataIndex: 'dualUnitNum',
          key: 'dualUnitNum',
          width: '50',
        }, {
          title: '单位',
          dataIndex: 'dualUnitName',
          key: 'dualUnitName',
          width: '50',
        }],
      }, {
        title: '到货日期',
        dataIndex: 'arrivalDate',
        key: 'arrivalDate',
        render: text => text && moment(text).format('YYYY-MM-DD'),
        width: '80',
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: '100',
        render: text => <Tooltip placement="leftTop" title={text}>
          <div className="ellipsed-line width-100">{text}</div>
        </Tooltip>,
      },
    ];
  }
  refreshList = (value, itemKey, fieldName) => {
    // 更新文本框
    const rowItem = _.find(listData, item => item.key === itemKey);
    rowItem[fieldName] = value;
    // 联动更新
    if (fieldName === 'purc_unit_num') {
      rowItem.goodsQty = value; // 暂时先跟订货数量一个
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
    syncSeletedItemIntoRow(selectedItem, index);
    // Object.assign(rowItem, selectedItem);
  };
  startProgress = (status) => {
    doProgress(status);
  };
  renderColumns = (text, record, index, field, configurations) => {
    const editable = '';
    const status = false;
    const currEditStatus = editableMem[index];
    if (!currEditStatus) {
      syncMem(field); // 生成编辑内容行列信息
      return false;
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
        dataSource={listData}
        columns={columnsConfig}
        loading={loadingList}
        pagination={false}
        scroll={{ x: '1200' }}
        rowKey={record => record.id + '' + record.goodsId}
      />
      <br />
      {(opType === 'generate')
        && <span><Popconfirm
          okText='确认拆分'
          title={<div>
            <span style={{ color: 'red', fontWeight: 'bold' }}>
              重要操作！
            </span>
            <br />
            请再次确认上方生成订单正确，否则拆分成功后将引起数据异常或错误！
            <br />请慎重操作，是否继续拆分？
          </div>}
          onConfirm={startProgress}
        ><Button type="primary" disabled={prosessingStatus !== 'failed' && prosessingStatus !== 'prepare'}>拆分</Button></Popconfirm>&nbsp;&nbsp;&nbsp;&nbsp;</span>
      }
      <Button onClick={cancelDetailPage} disabled={prosessingStatus === 'progressing'}>返回</Button>&nbsp;&nbsp;&nbsp;&nbsp;
      <div style={{ display: 'none' }}>{JSON.stringify(editableMem)}</div>

      <Modal
        title="拆分失败！"
        visible={processStatus === 'noRef' || processStatus === 'noPrice'}
        footer={<Button type="primary" onClick={confirmProcess}>知道了</Button>}
        onCancel={hideModal}
      >
        <p style={{ color: 'red', marginBottom: 20 }}>{
          processStatus === 'noRef' ? '以下物资没有对应的供货关系，请完善的供货关系表或仓库配送关系表后拆分订单。' : '以下物资在配送售价单中没有价格信息，请完善的对应物资的价格信息后拆分订单。'
        }</p>
        <Table dataSource={processData} size="small">
          <Table.Column
            title="物资编码"
            dataIndex="goodsCode"
            key="goodsCode"
          />
          <Table.Column
            title="物资名称"
            dataIndex="goodsName"
            key="goodsName"
          />
          <Table.Column
            title="门店名称"
            dataIndex="storeName"
            key="storeName"
          />
        </Table>
      </Modal>
    </div>
  );
};

OrderLibDetailsList.propTypes = {
  opType: PropTypes.string,
  pageStatus: PropTypes.string,
  switchType: PropTypes.func,
  resyncDataSource: PropTypes.func,
  getGoodsListByTyping: PropTypes.func,
  syncSeletedItemIntoRow: PropTypes.func,
  insertNewRowAfterIndex: PropTypes.func,
  doProgress: PropTypes.func,
  removeRowAtIndex: PropTypes.func,
  openGoodsModel: PropTypes.func,
  syncMem: PropTypes.func,
  editableMem: PropTypes.array,
  renderColumns: PropTypes.func,
  refreshList: PropTypes.func,
  cancelDetailPage: PropTypes.func,
  hideModal: PropTypes.func,
};
export default OrderLibDetailsList;
