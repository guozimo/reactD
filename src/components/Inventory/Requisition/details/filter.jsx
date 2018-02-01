import React from 'react';
import { Breadcrumb, Select, Input, DatePicker, Form, Tag } from 'antd';
import moment from 'moment';

const RequisitionDetailsFilter = ({
  opType,
  user,
  bussDate,
  billInfo,
  // module methods
  selectedBussDate,

  // private vars and methods
  disabledDate,
}) => {
  // console.log(billInfo);
  const billStatus = billInfo.status;
  // console.log(bussDate);
  disabledDate = (current) => {
    // Can not select days before today and today .add(-1, 'days')
    return current && current.valueOf() > moment();
  }
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>门店进销存管理</Breadcrumb.Item>
        <Breadcrumb.Item>门店请购</Breadcrumb.Item>
        <Breadcrumb.Item>{{ view: '查看请购单', edit: '编辑请购单', create: '新增请购单' }[opType]}</Breadcrumb.Item>
      </Breadcrumb>

      <Form layout="inline">
        <Form.Item label="请购单" style={{ display: opType === 'create' ? 'none' : '' }}>
          <span>{billInfo.billNo}</span>
        </Form.Item>
        <Form.Item label="操作人">
          <Input style={{ width: 160 }} disabled value={opType === 'create' ? (user && user.message) : (billInfo.createUserName || '')} />
        </Form.Item>
        <Form.Item label="请购日期">
          <DatePicker
            allowClear={false}
            // disabledDate={disabledDate}
            value={billInfo.bussDate != null && opType != 'edit'  ? moment(billInfo.bussDate) : bussDate}
            // value={bussDate}
            disabled={opType === 'view'}
            onChange={selectedBussDate}
          />
        </Form.Item>
        {opType !== 'view' ?
          <Form.Item label="调用模板">
            <Select style={{ width: 160 }} disabled placeholder="请选择调用模板" />
          </Form.Item> : ''
        }
        {opType !== 'create' ? opType !== 'view' ?
        <span>
          <Form.Item label="状态">
            <span><Tag color={{ '962': 'green', '964': 'orange', '965': 'blue' }[billStatus]}>
                {{ '962': '已完成', '964': '待处理', '965': '已提交' }[billStatus]}
            </Tag></span>
          </Form.Item>
          <Form.Item label="操作时间">
            <span>{billInfo.updateTime}</span>
          </Form.Item>
        </span>
   :
        <div>
          <Form.Item label="状态">
            <span><Tag color={{ '962': 'green', '964': 'orange', '965': 'blue' }[billStatus]}>
                {{ '962': '已完成', '964': '待处理', '965': '已提交' }[billStatus]}
            </Tag></span>
          </Form.Item>
          <Form.Item label="请购机构">
            <span>{billInfo.storeName}</span>
          </Form.Item>
          <Form.Item label="创建时间" >
            <span>{billInfo.createTime}</span>
          </Form.Item>
        </div>
      : ''}
      </Form>
    </div>
  );
};

export default RequisitionDetailsFilter;
