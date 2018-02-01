import React from 'react';
import { Breadcrumb, Select, Input, DatePicker, Form } from 'antd';
import SelectorStore from '../../_components/SelectorStore';
import moment from 'moment';

const PriceListDetailsFilter = ({
  opType,
  billInfo,
  selectedReposes,
  selectedStore,
  selectedOrg,
  storeListOfOrg,

  // module methods
  updateSelectedStoreList,

  // private vars and methods
  changedReposes,
}) => {
  changedReposes = (storeList) => {
    updateSelectedStoreList(storeList);
  }
  /*

    <SelectorStore
      listData={[{ reposCode: 'abcd', reposName: 'test' }, { reposCode: 'abcde', reposName: 'test1' }]}
      initialValue={[{ reposCode: 'abcd', reposName: 'test' }]}
      value={selectedReposes}
      onChange={changedReposes}
      maxSize={10}
      disabled={(opType === 'create' || opType === 'edit') ? !!false : !!true}
    />
    */
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>配送售价单</Breadcrumb.Item>
        <Breadcrumb.Item>{{ view: '查看售价单', edit: '编辑售价单', create: '新增售价单' }[opType]}</Breadcrumb.Item>
      </Breadcrumb>

      <Form layout="inline" style={{ display: (opType === 'create') ? 'none' : '' }}>
        <Form.Item label="单据编号">
          {billInfo.billNo}
        </Form.Item>
        <Form.Item label="创建人">
          {billInfo.createUserName}
        </Form.Item>
        <Form.Item label="创建时间">
          {billInfo.createTime}
        </Form.Item>
        <Form.Item label="审核人" style={{ display: (opType === 'edit') ? 'none' : '' }}>
          {billInfo.updateUserName}
        </Form.Item>
        <Form.Item label="审核时间" style={{ display: (opType === 'edit') ? 'none' : '' }}>
          {billInfo.updateTime}
        </Form.Item>
      </Form>

      <Form layout="inline">
        <Form.Item label="配送中心">
          <span>{selectedOrg.name}</span>
        </Form.Item>
        <Form.Item label="适用门店">
          <SelectorStore
            listData={storeListOfOrg.map(item => ({ reposCode: item.code, reposName: item.name }))}
            initialValue={selectedStore}
            value={selectedReposes}
            onChange={changedReposes}
            maxSize={10}
            disabled={(opType === 'create' || opType === 'edit') ? !!false : !!true}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default PriceListDetailsFilter;
