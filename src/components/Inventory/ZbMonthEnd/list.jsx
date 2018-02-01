import React, { PropTypes } from 'react'
import { Table, Popconfirm, Pagination,Alert } from 'antd'

function list({
                menuData,
                loading,
                shopId,
                scmOutList,
                scmCheckList,
                scmInList,
                scmTransferList,
              }){

  const columns = [{
    title: '单据号',
    dataIndex: 'billNo',
    key: 'billNo',
  }, {
    title: '仓库名称',
    dataIndex: 'depotName',
    key: 'depotName',
  }];
  const columns2 = [{
    title: '单据号',
    dataIndex: 'billNo',
    key: 'billNo',
  }, {
    title: '调出仓库名称',
    dataIndex: 'outDepotName',
    key: 'outDepotName',
  },{
    title: '调入仓库名称',
    dataIndex: 'inDepotName',
    key: 'inDepotName',
  }];
  return (
    <div className="components-list" style={{ marginTop: 50 }}>
      {shopId &&
      <div>
        <Alert message="待处理的“暂存”入库单" type="info" className="scm-month-end-alert-top" />
        <br />
        {scmInList && scmInList.length > 0 ?
          <Table dataSource={scmInList} columns={columns} size="small" /> :
          <Alert message="暂无数据" description=" " type="warning" showIcon className="scm-month-end-alert-bottom" />
        }
        <br />
        <Alert message="待处理的“暂存”出库单" type="info" className="scm-month-end-alert-top" />
        <br />
        { scmTransferList && scmOutList.length > 0 ?
          <Table dataSource={scmOutList} columns={columns} size="small" /> :
          <Alert message="暂无数据" description=" " type="warning" showIcon className="scm-month-end-alert-bottom" />
        }
        <br />
        <Alert message="待处理的“暂存”调拨单" type="info" className="scm-month-end-alert-top" />
        <br />
        {scmTransferList && scmTransferList.length > 0 ?
          <Table dataSource={scmTransferList} columns={columns2} size="small" /> :
          <Alert message="暂无数据" description=" " type="warning" showIcon className="scm-month-end-alert-bottom" />
        }
        <br />
        <Alert message="待处理的“暂存”盘点单" type="info" className="scm-month-end-alert-top" />
        <br />
        {scmCheckList && scmCheckList.length > 0 ?
          <Table dataSource={scmCheckList} columns={columns} size="small" /> :
          <Alert message="暂无数据" description=" " type="warning" showIcon className="scm-month-end-alert-bottom" />
        }

      </div>
      }
      {!shopId && <div className="page-no-shop icon-mg-t"></div>}

    </div>
  )
}

list.propTypes={
  loading: PropTypes.bool,
  shopId: PropTypes.string,
}
export default list
