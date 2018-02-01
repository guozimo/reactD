import React,{ PropTypes } from 'react';
import { connect } from 'dva';
import AuthTable from '../../components/Settled/Authorization';
import { Breadcrumb } from 'antd';
const Item = Breadcrumb.Item;

function Authorization({ list, dispatch, elemeShops, stores, showUnBindModal, meiList, meiModal }) {
  const AuthProps = {
    list,
    meiList,
    elemeShops,
    stores,
    dispatch,
    showUnBindModal,
    meiModal,
  };

  return (
    <div className="infos-layout right">
      <div className="header">
        <div className="bread-nav">
          <Breadcrumb separator=">">
            <Item className="item">营业资料</Item>
            <Item className="item">其他设置</Item>
            <Item className="item">授权管理</Item>
          </Breadcrumb>
        </div>
      </div>
      <AuthTable {...AuthProps} />
    </div>
  );
}

function mapStateToProps(state) {
  const { list, meiList, elemeShops, stores, showUnBindModal, meiModal } = state.authorization;
  return {
    loading: state.loading.models.authorization,
    list,
    meiList,
    elemeShops,
    stores,
    showUnBindModal,
    meiModal,
  };
}

export default connect(mapStateToProps)(Authorization);
