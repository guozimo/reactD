import React, { PropTypes } from 'react'
import { Table, Popconfirm, Pagination,Input } from 'antd'

function list({
  menuData,
  loading,
  dataSource,
  pagination,
  onPageChange,
  onPageSizeChange,
  renderColumns,
  handleChange,
  edit,
  editDone,
  shopId,
}) {
  renderColumns = (data, index, key, text) => {
    const{id} = data;
    const { editable, status ,value} = text;
    if (typeof editable === 'undefined') {
      return text;
    }else {
      if( !editable){
        const cacheValue = value;
        data[key].oldValue = cacheValue;
      }
      return (<div>
        {
          editable ?
            <div>
              <Input
                value={value}
                onChange={(e,value) => handleChange(e,data, index, key, text)}
                //onChange={e => handleChange(e)}
              />
            </div>
            :
            <div className="editable-row-text">
              {value.toString() || ' '}
            </div>
        }
      </div>);
    };

  };
  const columns = [
    {
      title: '菜品编码',
      dataIndex: 'dishCode',
      key: 'dishCode',
    }, {
      title: '菜品名称',
      dataIndex: 'dishName',
      key: 'dishName',
    }, {
      title: '销售计划',
      dataIndex: 'cnt',
      key: 'cnt',
    }, {
      title: '销售计划调整值',
      dataIndex: 'cnt2',
      key: 'cnt2',
      render: (text, record, index) => renderColumns(record, index, 'cnt2', text),
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record, index) => {
        const { editable } = text.cnt2;
        return (
          <div className="editable-row-operations">
            {
              editable ?
                <span>
                  <a onClick={() => editDone(record, 'save')} className="edit-span-right">保存</a>
                  <Popconfirm title="确定取消吗?" onConfirm={() => editDone(record, 'cancel')}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                :
                <span>
                  {
                    menuData['list'].hasOwnProperty('61700203') && <a onClick={() => edit(record)}>编辑</a>
                  }
                </span>
            }
          </div>
        );
      },
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
             pagination={pagination}
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
  renderColumns: PropTypes.func,
  handleChange: PropTypes.func,
  edit: PropTypes.func,
  editDone: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  shopId: PropTypes.string,
}

export default list
