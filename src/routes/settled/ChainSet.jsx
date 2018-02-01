import React,{ PropTypes } from 'react';
import { connect } from 'dva';
import { Breadcrumb } from 'antd';
import ChainSetTable from '../../components/Settled/ChainSet';
const Item = Breadcrumb.Item;

function ChainSet({ dispatch, location }) {
  return (
    <div className="infos-layout right">
      <div className="header">
        <div className="bread-nav">
          <Breadcrumb separator=">">
            <Item className="item">营业资料</Item>
            <Item className="item">组织机构</Item>
            <Item className="item">机构设置</Item>
          </Breadcrumb>
        </div>
      </div>
      <ChainSetTable />
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

export default connect(mapStateToProps)(ChainSet);
