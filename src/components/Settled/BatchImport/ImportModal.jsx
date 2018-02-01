import React, { PropTypes, Component } from 'react';
import { Form, Select, Upload, Button, Icon, message, Modal } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class ImportModal extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    title: PropTypes.string,
    form: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      allowSubmit: false,
      Newkey: false,
    };
  }

  showModelHandler = (e) => {if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,

    });
  };

  downloadCategory = () => {
    this.props.dispatch({
      type: 'batchImport/downloadCategory',
    });
  };

  downloadDish = () => {
    this.props.dispatch({
      type: 'batchImport/downloadDish',
    });
  };

  downloadTableQu = () => {
    this.props.dispatch({
      type: 'batchImport/downloadTableQu',
    });
  };

  downloadTable = () => {
    this.props.dispatch({
      type: 'batchImport/downloadTable',
    });
  };

  handleUpload = (info) => {
    console.log(info);
    const list = info.fileList.slice(-1);
    let fileId = '';
    if ( list && list.length ) {
      console.log(list[0].status);
      if (list[0].status === 'done') {
        const {response} = list[0];
        if(response.success) {
          if (response && response.success && response.code === '200') {
            fileId = response.data.listMessage.errorList;
          }
          if (response && response.success && response.code === '200' && response.data.listMessage.uploadStatus === 1) {
            message.success('文件上传成功');
          }
          if (response.data.listMessage.uploadStatus === 0) {
            message.error('文件上传失败，请重新上传！');
          }
        }else{
          console.log(response.message);
          message.error(response.message);
        }
      }
    }
   this.props.form.setFieldsValue({
      'file': fileId,
    });
  };

  doRedirect = () => {
    this.props.dispatch({
      type: 'batchImport/fetch',
    })
    this.state.Newkey = !this.state.Newkey;
    this.state.allowSubmit = !this.state.allowSubmit;


  };

  onChangeStoreId = (value) => {
    if(value){
      this.setState({
        allowSubmit: true,
      });
    }
  };

  beforeUpload (file) {
    const arr = ['', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const isImg = arr.indexOf(file.type) !== -1;
    if (!isImg) {
      message.error('请上传 xlsx ,xls 格式的文件');
    }
    return isImg;
  }

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;

    const props = {
      action: '/ipos-chains/acl/uploadFile/addImport',
      headers: {
        authorization: 'authorization-text',
      },
      onChange: this.handleUpload,
      beforeUpload: this.beforeUpload,
      data: (file) => {
        return {
          storeId: this.props.form.getFieldValue('storeId')?this.props.form.getFieldValue('storeId'):"",
          fileName: file.name,
          fileSize: file.size,
          fileMess: this.props.fileMess,
        }
      },
    };

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
    };

    return (
      <div>
        <span onClick={this.showModelHandler}>
          {children}
        </span>
        <Modal title={this.props.title}
               // okText="导入"
               visible={this.state.visible}
               onCancel={this.hideModelHandler}
               footer={null}
               key={this.state.Newkey}
               afterClose={this.doRedirect}
        >
          <div className="template-all">
            <label className="ant-form-item-label temple-left ">模板下载 : </label>
            <Button type="primary" onClick={this.downloadCategory} size="large" className="template">菜类</Button>
            <Button type="primary" onClick={this.downloadDish} size="large" className="template"  >菜品</Button>
            <Button type="primary" onClick={this.downloadTableQu} size="large" className="template" >餐区</Button>
            <Button type="primary" onClick={this.downloadTable} size="large" className="template" >餐台</Button>
          </div>

          <Form>
            { (this.props.title == '导入餐区' || this.props.title == '导入餐台') &&
            <FormItem
              {...formItemLayout}
              label="选择门店"
            >
              {getFieldDecorator('storeId', {
                rules: [{ required: true, message: '请选择门店!' }],
              })(
                <Select placeholder="请选择" style={{ width:200 }} onChange={this.onChangeStoreId} >
                  {
                    this.props.stores.map((data) => {
                      return <Option key={data.id} value={data.id}>{data.name}</Option>;
                    })
                  }
                </Select>
              )}
            </FormItem>
            }

            <FormItem
              {...formItemLayout}
              label="上传文件"
            >
              { (this.props.title == '导入餐区' || this.props.title == '导入餐台') &&
              <Upload {...props}>
                <Button disabled={!this.state.allowSubmit}>
                  <Icon type="upload" />请上传excel文件
                </Button>
              </Upload>
              }
              { (this.props.title == '导入菜类' || this.props.title == '导入菜品') &&
              <Upload {...props}>
                <Button >
                  <Icon type="upload" />请上传excel文件
                </Button>
              </Upload>
              }
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

export default Form.create()(ImportModal);

