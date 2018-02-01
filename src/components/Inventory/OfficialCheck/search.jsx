import React, { PropTypes } from 'react';
import { Breadcrumb, Form, Select, Button, Radio, DatePicker, Input, Tooltip } from 'antd';
import moment from 'moment';

const OfficialCheckSearch = ({
  menuData,
  // model state
  orgId,
  storeId,
  reposId,

  selectOrg,
  selectStore,
  selectRepos,

  orgList,
  storeList,
  reposList,

  onCreate,
  form: {
    getFieldDecorator,
    validateFields,
  },
  checkTypes,
  checkStatus,
  filterDataRange,
  filterBillNo,

  // 模型方法
  changeCheckTypes,
  changeCheckStatus,
  changeFilterDataRange,
  changeFilterBillNo,
  filterOfficialCheck,

  // 私有方法
  changeOrg,
  changeStore,
  changeRepos,

  // 私有变量
  pageData,
}) => {
  changeOrg = (value) => { selectOrg(value); };
  changeStore = (value) => { selectStore(value); };
  changeRepos = (value) => { selectRepos(value); };
  const orgOptions = orgList && orgList.map(org => <Select.Option value={org.id} key={org.id}>{org.name}</Select.Option>);
  // const storeOptions = storeList && storeList.map(store => <Select.Option value={store.id} key={store.id}>{store.name}</Select.Option>);
  const storeRepos = reposList && reposList.map(repos => <Select.Option value={repos.id} key={repos.id}>{repos.depotName}</Select.Option>);
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>盘点管理</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form layout="inline" >
          <Form.Item label="机构名称">
            {getFieldDecorator('shopName', { initialValue: orgId || '请选择机构名称' })(
              <Select style={{ width: 160 }} onChange={changeOrg} >
                {orgOptions}
              </Select>
            )}
          </Form.Item>
        </Form>
        {orgId && menuData['list'].hasOwnProperty('61500601') && <div className="right-act">
          <Button type="primary" icon="plus" onClick={onCreate}>新增盘点单</Button></div>}
      </div>
      <Form layout="inline" style={!orgId ? { display: 'none' } : {}}>
        <Form.Item label="仓库">
          <Select onChange={changeRepos} style={{ width: 160 }} value={reposId}>
            <Select.Option value="" key="">请选择</Select.Option>
            {storeRepos}
          </Select>
        </Form.Item>
        <Form.Item label="编号">
          <Input style={{ width: 160 }} value={filterBillNo} onChange={changeFilterBillNo} placeholder="请输入编号" />
        </Form.Item>
        <Form.Item label="盘点日期">
          <DatePicker.RangePicker
            format="YYYY-MM-DD"
            value={filterDataRange}
            onChange={changeFilterDataRange}
            renderExtraFooter={() => <div style={{ textAlign: 'center', color: '#bfbfbf' }}>请点选两个时间以确定一个时间范围</div>}
            ranges={{ // 预设时间范围快捷选择
              '前1月': [moment().subtract(1, 'month'), moment()],
              '前15天': [moment().subtract(15, 'day'), moment()],
              '前7天': [moment().subtract(7, 'day'), moment()],
              '前3天': [moment().subtract(3, 'day'), moment()],
              '今日': [moment(), moment()],
            }}
          />
        </Form.Item>
        <Form.Item label="类型">
          <Radio.Group value={checkTypes} onChange={changeCheckTypes}>
            <Radio.Button value="941">日盘</Radio.Button>
            <Radio.Button value="942">周盘</Radio.Button>
            <Radio.Button value="943">月盘</Radio.Button>
            <Radio.Button value="944">其他</Radio.Button>
            <Radio.Button value="">全部</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="状态">
          <Radio.Group value={checkStatus} onChange={changeCheckStatus}>
            <Radio.Button value="962">已完成</Radio.Button>
            <Radio.Button value="961">未完成</Radio.Button>
            <Radio.Button value="">全部</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={filterOfficialCheck}>搜索</Button>
           &nbsp;&nbsp;&nbsp;&nbsp;
        </Form.Item>
      </Form>
    </div>
  );
};
OfficialCheckSearch.PropTypes = {
  checkTypes: PropTypes.string,
  filterDataRange: PropTypes.array,
  filterBillNo: PropTypes.string,
  onCreate: PropTypes.func,
  storeId: PropTypes.string,
  changeOrg: PropTypes.func,
  selectOrg: PropTypes.func,
  selectStore: PropTypes.func,
  changeCheckTypes: PropTypes.func,
  changeCheckStatus: PropTypes.func,
  changeFilterDataRange: PropTypes.func,
  changeFilterBillNo: PropTypes.func,
  filterOfficialCheck: PropTypes.func,
};
// export default OfficialCheckSearch;
export default Form.create()(OfficialCheckSearch);
