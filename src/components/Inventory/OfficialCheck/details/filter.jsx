import React, { PropTypes } from 'react';
import { Breadcrumb, Select, Input, DatePicker, Form, Radio } from 'antd';
import moment from 'moment';

const OfficialCheckDetailsFilter = ({
  opType,
  user,
  bussDate,
  billInfo,
  checkTypes,
  reposId,
  reposList,
  currRemarks,
  form: {
    getFieldDecorator,
  },

  // module methods
  selectedBussDate,
  selectTypes,
  selectRepos,
  setCurrRemarks,

  // private vars and methods
  disabledDate,
  changeCheckTypes,
  changeRepos,
  setRemarks,
}) => {
  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current.valueOf() < moment().add(-1, 'days');
  }
  changeCheckTypes = (value) => { selectTypes(value, { goodsCode: false, checkQty: false, dualGoodsQty: false, remarks: false }); };
  changeRepos = (value) => { selectRepos(value, { goodsCode: false, checkQty: false, dualGoodsQty: false, remarks: false }); };
  setRemarks = (e) => { setCurrRemarks(e.target.value); };
  const storeRepos = reposList && reposList.map(repos => <Select.Option value={repos.id} key={repos.id}>{repos.depotName}</Select.Option>);
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>盘点管理</Breadcrumb.Item>
        <Breadcrumb.Item>{{ view: '查看盘点单', edit: '编辑盘点单', create: '新增盘点单' }[opType]}</Breadcrumb.Item>
      </Breadcrumb>
      <Form layout="inline">
        <Form.Item label="盘点仓库">
          {getFieldDecorator('reposName', {
            initialValue: reposId || '请选择',
            rules: [
              { required: true, message: '请选择仓库!' },
            ],
          })(
            <Select disabled={opType === 'view' || opType === 'edit'} onChange={changeRepos} style={{ width: 160 }}>
              {storeRepos}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="盘点类型">
          {getFieldDecorator('checkTypes', {
            initialValue: checkTypes && checkTypes.toString(),
            rules: [
              { required: true, message: '请选择盘点类型!' },
            ],
          })(
            <Radio.Group disabled={opType === 'view' || opType === 'edit' || !reposId} onChange={changeCheckTypes}>
              <Radio.Button value="941">日盘</Radio.Button>
              <Radio.Button value="942">周盘</Radio.Button>
              <Radio.Button value="943">月盘</Radio.Button>
              <Radio.Button value="944">其他</Radio.Button>
              {
                opType === 'view' ? <Radio.Button value="">未知</Radio.Button> : null
              }
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="盘点日期">
          {getFieldDecorator('bussDate', {
            initialValue: moment(bussDate),
            rules: [
              { required: true, message: '请选择调拨日期!' },
            ],
          })(
            <DatePicker allowClear={false} disabled disabledDate={disabledDate} onChange={selectedBussDate} />
          )}
        </Form.Item>
        <Form.Item label="备注内容">
          <Input style={{ width: 704 }} disabled={opType === 'view'} value={currRemarks} onChange={setRemarks} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Form.create()(OfficialCheckDetailsFilter);
