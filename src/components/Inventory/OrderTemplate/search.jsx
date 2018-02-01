import React, { PropTypes } from 'react';
import { message, Breadcrumb, Form, Select, Button, Radio, DatePicker, Input, Icon, Upload } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;

const OrderTemplateSearch = ({
  storeId,
  templateNo,
  // module func
  changeTemplateNo,
  filterTemplates,
  importTemplates,
  useOrNot,
  disabledOrNot, // 启用/停用
  onAdd, // 新增模板
}) => {
  useOrNot = (status) => {
    disabledOrNot(status);
  };
  const defaultFileList = { // 用于批量导入功能 action会默认传到接口 参数upload未带上
    action: '/ipos-chains/scmzb/scmtemplate/upload',
    data: { upload: 'upload' },
    onChange: (info) => {
      const list = info.fileList.slice(-1);
      if (list && list.length) {
        // console.log(list[0].status);
        if (list[0].status === 'done') {
          const { response } = list[0];
          if (response.success) {
            if (response && response.success && response.code === '200') {
              fileId = response.data.listMessage.errorList;
            }
            if (response && response.success && response.code === '200' && response.data.listMessage.uploadStatus === 1) {
              message.success('文件上传成功');
            }
            if (response.data.listMessage.uploadStatus === 0) {
              message.error('文件上传失败，请重新上传！');
            }
          } else {
            message.error(response.errorInfo);
          }
        }
      }
    },
    beforeUpload: (file) => {
      const arr = ['', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      const isExcel = arr.indexOf(file.type) !== -1;
      if (!isExcel) {
        message.error('请上传 xlsx ,xls 格式的文件');
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('上传文件最大为10兆!');
      }
      return isExcel && isLt10M;
    },
  };
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>基础设置</Breadcrumb.Item>
        <Breadcrumb.Item>订货模板</Breadcrumb.Item>
      </Breadcrumb>
      <Form layout="inline" >
        <FormItem>
          <div className="right-act"><Button icon="plus" type="primary" onClick={onAdd}>新增模板</Button></div>
        </FormItem>
        <FormItem>
          <span className="right-act">
            <Upload {...defaultFileList}>
              <Button type="primary"><Icon type="up-circle-o" />批量导入<Icon type="question-circle-o" /></Button>
            </Upload>
          </span>
        </FormItem>
        <FormItem>
          <span className="right-act" style={{ marginLeft: -65 }}><a href="images/helpDownload/template.xlsx">模板下载</a></span>
        </FormItem>
        <FormItem>
          <div className="right-act"><Button type="primary" onClick={() => useOrNot(1)}>启用/停用</Button></div>
        </FormItem>
        <FormItem>
          <Input style={{ width: 200 }} value={templateNo} onChange={changeTemplateNo} placeholder="搜索模板编码或名称" />
          <Button type="default" style={{ marginTop: 1, marginLeft: -3, backgroundColor: '#eee' }} onClick={filterTemplates}>搜索</Button>
        </FormItem>
      </Form>
    </div>
  );
};

OrderTemplateSearch.PropTypes = {
  templateNo: PropTypes.string,
  status: PropTypes.string,
  changeTemplateNo: PropTypes.func,
  filterTemplates: PropTypes.func,
  importTemplates: PropTypes.func,
  useOrNot: PropTypes.func,
  disabledOrNot: PropTypes.func,
  onAdd: PropTypes.func,
};

export default Form.create()(OrderTemplateSearch);
