import React, { PropTypes } from 'react'
import { Table, Popconfirm, Pagination,Badge, Menu, Dropdown, Icon } from 'antd'

function list({
  menuData,
  loading,
  dataSource,
  pagination,
  onPageChange,
  onPageSizeChange,
  shopId,
  onExport,
  onExportData,
}) {
  onExport = (record) =>{
    const id = record.dishId;
    onExportData(id);
  }
  const expandedRowRender = (record, i) => {
    const utilIndex = i+1;
    const columns = [
      {
        title: '编码',
        dataIndex: 'goodsCode',
        key: 'goodsCode'
      }, {
        title: '名称',
        dataIndex: 'goodsName',
        key: 'goodsName'
      }, {
        title: '单位',
        dataIndex: 'goodsUnit',
        key: 'goodsUnit'
      },{
        title: '理论耗用数量',
        dataIndex: 'theoryConsumedNum',
        key: 'theoryConsumedNum'
      }, {
        title: '理论耗用金额',
        dataIndex: 'theoryConsumedAmount',
        key: 'theoryConsumedAmount'
      },{
        title: '实际耗用数量',
        dataIndex: 'realConsumedNum',
        key: 'realConsumedNum'
      }, {
        title: '实际耗用金额',
        dataIndex: 'realConsumedAmount',
        key: 'realConsumedAmount'
      }, {
        title: '出成率',
        dataIndex: 'successRate',
        key: 'successRate'
      },
    ];

    return (
      <div className="components-list">
      {shopId && <Table
        columns={columns}
        dataSource={dataSource[i].scmRealTheoryDiffDtoList}
        pagination={false}
        rowKey={record => record.id}
      />}
      </div>
    );
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'dishName',
      key: 'dishName',
    },{
      title: '单位',
      dataIndex: 'dishUnit',
      key: 'dishUnit',
    },{
      title: '销售数量',
      dataIndex: 'salesNum',
      key: 'salesNum',
    },{
      title: '销售金额',
      dataIndex: 'salesAmount',
      key: 'salesAmount',
    },{
      title: '单菜理论毛利率',
      dataIndex: 'grossProfitRate',
      key: 'grossProfitRate',
    },{
      title: '单菜实际毛利率',
      dataIndex: 'realGrossProfitRate',
      key: 'realGrossProfitRate',
    },{
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return (
          <p>
            {menuData['list'].hasOwnProperty('61600501') && <a onClick={() => onExport(record)} style={{
              marginRight: 4,
            }}>导出</a>}
          </p>
        );
      },
    },
  ]

  return (
    <div className="components-list">
      {shopId && <Table size="small"
                        className="table"
                        bordered
                        columns={columns}
                        dataSource={dataSource}
                        loading={loading}
                        onChange={onPageChange}
                        onShowSizeChange={onPageSizeChange}
                        pagination={pagination}
                        expandedRowRender={(record, i, indent) =>expandedRowRender(record, i, indent)}
                        rowKey={record => record.id}
      />}
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
  onExport: PropTypes.func,
  onExportData: PropTypes.func,
}

export default list
