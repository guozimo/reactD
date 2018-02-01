import React,{ PropTypes } from 'react';
import { connect } from 'dva';
import AuthTable from '../../components/Settled/Authority/list';
import { Breadcrumb } from 'antd';
const Item = Breadcrumb.Item;

function Authorization({ dispatch, dataSource, checked, halfChecked, location, searchData, loading, pagination, visible, isNew, expandedKeys, scmList, selectValue, postName, editId }) {
  const AuthProps = {
    dataSource,
    searchData,
    loading,
    pagination,
    visible,
    dispatch,
    location,
    isNew,
    expandedKeys,
    scmList,
    selectValue,
    postName,
    editId,
    checked,
    halfChecked,
  };
  return (
    <div className="infos-layout right">
      <div className="header">
        <div className="bread-nav">
          <Breadcrumb separator=">">
            <Item className="item">营业资料</Item>
            <Item className="item">组织机构</Item>
            <Item className="item">岗位权限</Item>
          </Breadcrumb>
        </div>
      </div>
      <AuthTable { ...AuthProps } />
    </div>
  );
}

function mapStateToProps(state) {
  const { editId, checked, halfChecked, dataSource, loading, searchData, pagination, visible, isNew, expandedKeys, scmList, autoExpandParent, selectValue, postName } = state.postAuthority;
  return {
    dataSource,
    loading,
    searchData,
    pagination,
    visible,
    isNew,
    expandedKeys,
    scmList,
    autoExpandParent,
    selectValue,
    postName,
    editId,
    checked,
    halfChecked,
  };
}

export default connect(mapStateToProps)(Authorization);
