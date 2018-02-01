import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Upload, Button, Icon, message, Modal, Row, Col } from 'antd';
import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

class PrinterTemplateForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    form: PropTypes.object,
    initData: PropTypes.object,
    fileList: PropTypes.array,
    submitBtnLoading: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      previewImgUrl: null,
      previewVisible: false,
      mobile: '',
      remarks: null,
    };
  }


  handleUpload = (info) => {
    const list = info.fileList.slice(-1);
    let fileId = '';
    if ( list && list.length ) {
      list[0].url = list[0].thumbUrl;
      const { response } = list[0];
      if (response && response.success && response.code === '200') {
        fileId = response.data;
      }
    }
    this.props.dispatch({
      type: 'printerTemplate/setFileList',
      fileList: list,
    });
    this.props.form.setFieldsValue({
      'printImage': fileId,
    });
  };

  beforeUpload (file) {
    const isTooLarge = file.size > 10 * 1024 * 1024;
    const arr = ['image/jpeg', 'image/bmp', 'image/png', 'image/gif'];
    const isImg = arr.indexOf(file.type) !== -1;

    if (isTooLarge) {
      message.error('图片不能超过10M');
    }

    if (!isImg) {
      message.error('请上传 bmp, png, jpg, gif 格式的文件');
    }

    return !isTooLarge && isImg;
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(!values.printImage){
          values.printImage = '';
        }
        if(!values.printExplain){
          values.printExplain = '';
        }
        this.props.dispatch({
          type: 'printerTemplate/submit',
          values,
        });
      }
    });
  };


  onPreview = (file) => {
    this.setState({
      previewImgUrl: file.url,
      previewVisible: true,
    });
  };
  handle = (file) => {
    file.mobile = file.lastModified.toString() + file.size;
    this.setState({
      mobile: file.mobile,
    });
    return{
      ...file,
    };
  };
  handleChange = (value) => {
    window.localStorage.setItem('storeId',value);
    this.props.dispatch({
      type: 'printerTemplate/getData',
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const storeFormItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 8},
    };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 8},
    };
    const tailFormItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: {
        span: 14,
        offset: 8,
      },
    };

    const uploadProps = {
      name: 'upload',
      action: '/ipos-chains/aclTenant/uploadBraLogo',
      listType: 'picture-card',
      fileList: this.props.fileList,
      beforeUpload: this.beforeUpload,
      onPreview: this.onPreview,
      onChange: this.handleUpload,
      onRemove: this.onRemove,
      accept: 'image/jpeg, image/bmp, image/png, image/gif',
      data: this.handle,
    };

    const { initData, storeList, storeId } = this.props;
    console.log(storeId);

    return (
      <div>
        <Row>
          <Col span={17} push={3}>
            <Form onSubmit={this.handleSubmit} className="form-size" style={{ marginTop: 50 }}>

              <FormItem
                {...storeFormItemLayout}
                label="门店"
              >
                {getFieldDecorator('storeId', {
                  initialValue: storeId,
                  rules: [{ required: true, message: '请选择门店!' }],
                })(
                  <Select disabled placeholder="请选择" onChange={this.handleChange}>
                    {
                      storeList.map((data) => {
                        return <Option key={data.id} value={data.id}>{data.name}</Option>;
                      })
                    }
                  </Select>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="小票尾图片"
              >
                <Upload
                  {...uploadProps}
                >
                {
                    this.props.fileList.length < 1 && [
                      <Icon type="plus" style={{fontSize: 20}} key="icon"/>,
                      <div key="upload" className="ant-upload-text">上传图片</div>,
                    ]
                  }
                </Upload>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={() => {
                  this.setState({
                    previewVisible: false,
                  })}} >
                  <img style={{ width: '100%', paddingTop: 20 }} src={this.state.previewImgUrl} />
                </Modal>

                {getFieldDecorator('printImage', {
                  initialValue: initData.printImage,
                })(
                  <Input type="hidden" />
                )}
              </FormItem>
              <div className="ant-form-extra" style={{ width: 495, marginBottom: 20, marginTop: -24, paddingLeft: 167}}>建议图片像素范围：150-500</div>
              <FormItem
              {...formItemLayout}
              label="小票尾说明"
              extra="换行请以“/”隔开"
            >
              {getFieldDecorator('printExplain', {
                initialValue: initData.printExplain,
              })  (
                <Input type="textarea" placeholder="请输入结账单小票尾说明" maxLength="300" />
              )}
            </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" size="large" loading={this.props.submitBtnLoading}>保存</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { initData, fileList, submitBtnLoading, storeList, storeId } = state.printerTemplate;

  return {
    fileList,
    initData,
    submitBtnLoading,
    storeList,
    storeId,
  };
}

export default connect(mapStateToProps)(Form.create()(PrinterTemplateForm));


