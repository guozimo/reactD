import React, { PropTypes } from 'react'
import { Table, Popconfirm, Pagination } from 'antd'

function list({
  loading,
  dataSource,
  pagination,
  onPageChange,
  onPageSizeChange,
  shopId,
}) {
  const columns = [
    {
      title: '日期',
      dataIndex: 'showDate',
      width: 90,
      key: 'showDate',
    }, {
      title: '物资编码',
      dataIndex: 'goodsCode',
      width: 70,
      key: 'goodsCode',
    }, {
      title: '物资名称',
      dataIndex: 'goodsName',
      width: 100,
      key: 'goodsName',
    }, {
      title: '规格',
      dataIndex: 'goodsSpec',
      width: 50,
      key: 'goodsSpec',
    }, {
      title: '出库单号',
      dataIndex: 'billNo',
      width: 100,
      key: 'billNo',
    }, {
      title: '核减',
      children: [
        {
          title: '标准',
          children: [
            {
              title: '单价',
              width: 50,
              dataIndex: 'unitPrice',
              key: 'unitPrice',
            }, {
              title: '金额',
              dataIndex: 'goodsAmt',
              width: 50,
              key: 'goodsAmt',
            }, {
              title: '单位',
              dataIndex: 'unitName',
              width: 50,
              key: 'unitName',
            }, {
              title: '数量',
              dataIndex: 'goodsQty',
              width: 50,
              key: 'goodsQty',
              render: text => text || 0,
            }],
        }, {
          title: '辅助',
          children: [{
            title: '单位',
            dataIndex: 'dualUnitName',
            width: 50,
            key: 'dualUnitName',
          }, {
            title: '数量',
            dataIndex: 'dualGoodsQty',
            width: 50,
            key: 'dualGoodsQty',
          }],
        }],
    }, {
      title: '销售菜品',
      children: [
        {
          title: '名称',
          dataIndex: 'dishName',
          width: 70,
          key: 'dishName',
        }, {
          title: '数量',
          dataIndex: 'dishCnt',
          width: 50,
          key: 'dishCnt',
        }, {
          title: '单位',
          dataIndex: 'dishUnit',
          width: 50,
          key: 'dishUnit',
        }, {
          title: '总价',
          dataIndex: 'dishAmt',
          width: 70,
          key: 'dishAmt',
        },
      ],
    },
  ];

  return (
    <div className="components-list">
      {shopId &&  <Table size="small"
             className="table"
             bordered
             columns={columns}
             dataSource={dataSource}
             loading={loading}
             onChange={onPageChange}
             onShowSizeChange={onPageSizeChange}
             pagination={pagination}
             rowKey={record => record.id}
      />}
      {!shopId && <div className="page-no-shop icon-mg-t"></div>}
    </div>
  )
}

list.propTypes = {
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  dataSource: PropTypes.array,
  loading: PropTypes.bool,
  pagination: PropTypes.object,
  shopId: PropTypes.string,
}

export default list
