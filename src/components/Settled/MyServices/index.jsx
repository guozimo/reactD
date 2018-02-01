import React, { PropTypes } from 'react';
import { Table, } from 'antd';
import { connect } from 'dva';

class MyServicesTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const columns = [
      {
        title: '门店名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '激活日期',
        dataIndex: 'activeTime',
        key: 'activeTime',
      }, {
        title: '激活POS数量',
        dataIndex: 'posNum',
        key: 'posNum',
      }, {
        title: '服务到期时间',
        dataIndex: 'expiredTime',
        key: 'expiredTime',
      },
    ];

    const { list } = this.props;
    console.log(list);
    return (
      <div>
        <Table
          columns={columns}
          dataSource={list}
          bordered
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { list } = state.myServices;
  return {
    list,
  };
}

export default connect(mapStateToProps)(MyServicesTable);

