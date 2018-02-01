import React, { PropTypes } from 'react'
import { Table, Popconfirm, Pagination,Badge, Menu, Dropdown, Icon } from 'antd'

function list({
  menuData,
  loading,
  dataSource,
  listUtil,
  onPageChange,
  onPageSizeChange,
  onDeleteItem,
  onEditItem,
  onDetailItem,
  shopId,
}) {
  //构建子表数据
  const waterData = [];
  const gasData = [];
  const electricData = [];
  const loopItemData = (data) => {
    if (data.utilitiesType === 1) {
      waterData.push(data);
    }else if(data.utilitiesType === 2){
      electricData.push(data);

    }else if(data.utilitiesType === 3){
      gasData.push(data);
    }
  };

  if(listUtil.data){
    for( let i = 0; i< listUtil.data.length; i+=1){
      loopItemData(listUtil.data[i]);
    }
  }

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: '项目编号',
        dataIndex: 'utilitiesCode',
        key: 'utilitiesCode'
      }, {
        title: '项目名称',
        dataIndex: 'utilitiesName',
        key: 'utilitiesName'
      }, {
        title: '期初',
        dataIndex: 'startCnt',
        key: 'startCnt'
      }, {
        title: '用量',
        dataIndex: 'totalCnt',
        key: 'totalCnt'
      }, {
        title: '金额',
        dataIndex: 'totalAmt',
        key: 'totalAmt'
      }, {
        title: '操作',
        key: 'operation',
        width: 100,
        render: (text, record) => (
          <p>
            {
              menuData['list'].hasOwnProperty('61600102') && <a onClick={() => onDetailItem(record)} style={{
              marginRight: 4,
            }}>详情</a>
            } 
            {
              menuData['list'].hasOwnProperty('61600103') && <a onClick={() => onEditItem(record)} style={{
              marginRight: 4,
            }}>编辑</a>
            }
            {
              menuData['list'].hasOwnProperty('61600104') && <Popconfirm title="确定要删除吗？" onConfirm={() => onDeleteItem(record)}>
              <a>删除</a>
            </Popconfirm>
            }
          </p>
        ),
      },
    ];

    //判断字表数组
    let data = [];
    if(record.utilitiesType === 1){
      data = waterData;
    }else if(record.utilitiesType === 2){
      data = electricData;
    } else if(record.utilitiesType === 3){
      data = gasData;
    }

    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey={record => record.id}
      />
    );
  };

  const columns = [
    {
      title: '类别名称',
      dataIndex: 'typName',
      key: 'typName',
    }, {
      title: '总量',
      dataIndex: 'totalCnt',
      key: 'totalCnt',
    },
  ]

  return (
    <div>
      {shopId && <Table size="small"
             className="table"
             bordered
             columns={columns}
             dataSource={dataSource}
             loading={loading}
             onChange={onPageChange}
             onShowSizeChange={onPageSizeChange}
             defaultExpandAllRows
             pagination={false}
             expandedRowRender={(record, i, indent) =>expandedRowRender(record, i, indent)}
             rowKey={record => record.id}
      />}
      {!shopId && <div className="page-no-shop icon-mg-t"></div>}
    </div>
  )
}

list.propTypes = {
  onPageChange: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  dataSource: PropTypes.array,
  loading: PropTypes.bool,
  listUtil: PropTypes.any,
  onPageSizeChange: PropTypes.func,
  onDetailItem: PropTypes.func,
  shopId: PropTypes.string,
}

export default list
