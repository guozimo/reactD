import React from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import ImportModal from './ImportModal';
import './index.less';

function BatchImportTable({ dispatch, stores, list, loading}) {

  const columns = [
    {
      title: '上传文件名称',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
    }
  ];

  return (
    <div>

      <div className="import" >
        <ImportModal title="导入菜类" fileMess="538" dispatch={dispatch} >
          <Button   type="primary"  size="large" className="ant-btn-left" >导入菜类</Button>
        </ImportModal>
        <ImportModal title="导入菜品" fileMess="539" dispatch={dispatch} >
          <Button type="primary"  size="large" className="ant-btn-left" >导入菜品</Button>
        </ImportModal>
        <ImportModal title="导入餐区" fileMess="536" stores={stores} dispatch={dispatch} >
          <Button type="primary"  size="large" className="ant-btn-left" >导入餐区</Button>
        </ImportModal>
        <ImportModal title="导入餐台" fileMess="537" stores={stores} dispatch={dispatch} >
          <Button type="primary"  size="large" className="ant-btn-left" >导入餐台</Button>
        </ImportModal>
      </div>

      <Table
        columns={columns}
        dataSource={list}
        loading={loading}
        //pagination={false}
        bordered
      />
    </div>
  );

};
function mapStateToProps(state) {
  const { stores, list } = state.batchImport;
  return {
    loading: state.loading.models.batchImport,
    stores,
    list,
  };
}

export default connect(mapStateToProps)(BatchImportTable);
