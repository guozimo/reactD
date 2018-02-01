import React, { PropTypes, Component } from 'react';
import { Modal, Form, Upload, Button, Icon, message } from 'antd';

const FormItem = Form.Item;

class MemberDetailsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileList:[]
    };
  }
  handleCancel = (e) => {
    this.setState({ fileList:[] });
    this.props.form.setFieldsValue({
      'file': '',
    });
    this.props.hideModal();
  }
  beforeUpload  = (file) => {
    const arr = ['', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const isExcel= arr.indexOf(file.type) !== -1;
    if (!isExcel) {
      message.error('请上传 xlsx ,xls 格式的文件');
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('上传文件最大为10兆!');
    }
    return isExcel&&isLt10M;
  }
  onChange= (info) =>{
    const list = info.fileList.slice(-1);
    this.setState({ fileList:info.fileList });
    let fileId = '';
    if (list && list.length) {
      console.log(list[0].status);
      if (list[0].status === 'done') {
        const {response} = list[0];
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
          message.error(response.message);
        }
      }
    }
    this.props.form.setFieldsValue({
      'file': fileId,
    });
  }
  render() {
    const { modalVisible, downloadTemplate } = this.props;
    const { getFieldDecorator } = this.props.form;
    const props = {
      action: '/ipos-chains/member/memberInfo/importMemberInfo',
      headers: {
        authorization: 'authorization-text',
      },
      onChange: this.onChange,
      beforeUpload: this.beforeUpload,
      fileList:this.state.fileList,
      data: (file) => {
        return {
          fileName: file.name,
          fileSize: file.size,
        }
      },
    };
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
    };
    return (
      <div>
        <Modal
          title="导入会员"
          visible={modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          afterClose={this.props.fetchList}
        >
          <div className="template-all">
              <label className="ant-form-item-label temple-left ">模板下载 : </label>
              <Button type="primary" size="large" className="template" onClick={downloadTemplate}>会员</Button>
          </div>
          <Form>
            <FormItem
              {...formItemLayout}
              label="上传文件"
            >
              <Upload {...props}>
                <Button>
                  <Icon type="upload" /> 请上传excel文件
                </Button>
              </Upload>
              {getFieldDecorator('file', {
                rules: [{ required: true, message: '请上传文件' }],
              })(
                <textarea type="text" disabled="disabled"  className="text-name" />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(MemberDetailsModal);
