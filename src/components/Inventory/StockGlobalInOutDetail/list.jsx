import React, {PropTypes} from 'react';
import {Table, Icon, Pagination, Tag} from 'antd';
import moment from 'moment';

const RequisitionList = ({
  storeId,
  loading,
  dataSourceAll,
  listPagination,
  onPageChange,
  onPageSizeChange,
  typeList
}) => {
  //由tytpe name 换算为 type id
  const changeType = (text) => {
    let typeName = '';
    if (typeList) {
      for (let i = 0, index = typeList.length; i < index; i++) {
        if (typeList[i].dictCode == text)
          typeName = typeList[i].dictName;
        }
      }

    return <div>{typeName}</div>
  }
  const columnsConfig = [
    {
      title: '物品编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode'
    }, {
      title: '物品名称',
      dataIndex: 'goodsName',
      key: 'goodsName'
    }, {
      title: '规格',
      dataIndex: 'goodsSpec',
      key: 'goodsSpec'
    }, {
      title: '单位',
      dataIndex: 'unitName',
      key: 'unitName'
    }, {
      title: '仓库',
      dataIndex: 'depotName',
      key: 'depotName'
    }, {
      title: '类别',
      dataIndex: 'cateName',
      key: 'cateName'
    }, {
      title: '业务类型',
      dataIndex: 'billType',
      key: 'billType',
      render: (text) =>< div > {
        changeType(text)
      }</div>
    }, {
      title: '日期',
      dataIndex: 'bussDate',
      key: 'bussDate'
    }, {
      title: '供应商',
      dataIndex: 'busiName',
      key: 'busiName'
    }, {
      title: '单据号',
      dataIndex: 'billNo',
      key: 'billNo'
    }, {
      title: '入库',
      children: [
        {
          title: '数量',
          dataIndex: 'goodsInQty',
          width: 80,
          key: 'goodsInQty'
        }, {
          title: '金额',
          dataIndex: 'goodsInAmt',
          width: 80,
          key: 'goodsInAmt'
        }
      ],
      dataIndex: 'stock',
      key: '2'
    }, {
      title: '出库',
      children: [
        {
          title: '数量',
          dataIndex: 'goodsOutQty',
          width: 80,
          key: 'goodsOutQty'
        }, {
          title: '金额',
          dataIndex: 'goodsOutAmt',
          width: 80,
          key: 'goodsOutAmt'
        }
      ],
      dataIndex: 'stock',
      key: '2'
    }
  ];
  return (<div>
    {
      storeId &&
      <Table
        bordered="bordered"
        columns={columnsConfig}
        dataSource={dataSourceAll}
        loading={loading}
        scroll={{x: '1300'}}
        pagination={listPagination}
        onChange={onPageChange}
        onShowSizeChange={onPageSizeChange}
      />}
  </div>);
}
RequisitionList.propTypes = {};
export default RequisitionList;
