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
      title: '仓位名称',
      dataIndex: 'depotName',
      key: 'depotName',
    }, {
      title: '名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
    },{
      title: '编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
    }, {
      title: '规格',
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
    }, {
      title: '单位',
      dataIndex: 'unitName',
      key: 'unitName',
    },{
      title: '期初',
      children: [{
      title: '数量',
      dataIndex: 'begNum',
      key: 'begNum',
    },{
      title: '金额',
      dataIndex: 'begAmt',
      key: 'begAmt',
    }
    ]},{
      title: '入库',
      children: [{
      title: '数量',
      dataIndex: 'inNum',
      key: 'inNum',
    },{
      title: '金额',
      dataIndex: 'inAmt',
      key: 'inAmt',
    }
    ]},{
      title: '实际耗用',
      children: [{
      title: '数量',
      dataIndex: 'realConsumedNum',
      key: 'realConsumedNum',
    },{
      title: '金额',
      dataIndex: 'realConsumedAmt',
      key: 'realConsumedAmt',
    }
    ]},{
      title: '调拨出库',
      children: [{
      title: '数量',
      dataIndex: 'tranOutNum',
      key: 'tranOutNum',
    },{
      title: '金额',
      dataIndex: 'tranOutAmt',
      key: 'tranOutAmt',
    }
    ]},{
      title: '结存',
      children: [
        {
        title: '数量',
        dataIndex: 'endNum',
        key: 'endNum',
      },{
        title: '金额',
        dataIndex: 'endAmt',
        key: 'endAmt',
      }
    ]},{
      title: '理论耗用',
      children: [{
      title: '数量',
      dataIndex: 'theoryConsumedNum',
      key: 'theoryConsumedNum',
    },{
      title: '金额',
      dataIndex: 'theoryConsumedAmt',
      key: 'theoryConsumedAmt',
    }
    ]},
    {
      title: '差异',
      children: [{
      title: '数量',
      dataIndex: 'diffNum',
      key: 'diffNum',
    },{
      title: '金额',
      dataIndex: 'diffAmt',
      key: 'diffAmt',
    },{
      title: '差异率',
      dataIndex: 'diffRate',
      key: 'diffRate',
    }
    ]},
  ]
//{shopId && <Pagination {...pagination} style={{float:'right'}} onChange={onPageChange} onShowSizeChange={onPageSizeChange} pageSize={10} />}
  return (
  <div className="components-list">
    {shopId && <div className="table-responsive">
      <Table size="small"
             style={{width:1200}}
             bordered
             columns={columns}
             dataSource={dataSource}
             loading={loading}
             rowKey={record => record.id}
             onChange={onPageChange}
             onShowSizeChange={onPageSizeChange}
             pagination={pagination}
      />
    </div>}

    {!shopId && <div className="page-no-shop icon-mg-t"></div>}
  </div>
  )
}

list.propTypes = {
  onPageChange: PropTypes.func,
  dataSource: PropTypes.array,
  loading: PropTypes.bool,
  pagination: PropTypes.object,
  onPageSizeChange: PropTypes.func,
  shopId: PropTypes.string,
}

export default list
