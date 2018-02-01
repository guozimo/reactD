import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { isEmptyObject } from '../../../utils';

import { Form, Input, Select, Upload, Button, Icon, message, Modal,  Radio, Row, Col } from 'antd';
import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class CompletionForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    form: PropTypes.object,
    provinceList: PropTypes.array,
    initData: PropTypes.object,
    cityList: PropTypes.array,
    areaList: PropTypes.array,
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

  onChange = (e) => {
    console.log('radio1 checked', e.target.value);
    this.props.YeTaiList.map((data) => {
      if(data.dictCode === e.target.value){
        this.setState({
          remarks: data.remarks,
        });
      }
    })
  }

  handleUpload = (info) => {
    console.log(info.file.lastModified);
    const list = info.fileList.slice(-1);

    let fileId = '';

    if ( list && list.length ) {
      list[0].url = list[0].thumbUrl;
      const { response } = list[0];
      // console.log(response);
      if (response && response.success && response.code === '200') {
        fileId = response.data;
      }

      /*
      // TODO session失效，跳转登陆
      if (response && response.stat && response.stat === 'deny') {
        Modal.error({
          title: '登录超时，需要立刻跳转到登录页吗？',
          content: <a href={location.href} target="_blank">点此跳转登录页</a>,
        });

        this.setState({ fileList: [] });
        this.props.form.setFieldsValue({
          'barLogo': '',
        });

        return;
      } */
    }

    this.props.dispatch({
      type: 'merchantCompletion/setFileList',
      fileList: list,
    });

    this.props.form.setFieldsValue({
      'braLogo': fileId,
    });
  };

  beforeUpload (file) {
    const isTooLarge = file.size > 2 * 1024 * 1024;
    const arr = ['image/jpeg', 'image/bmp', 'image/png', 'image/gif'];
    const isImg = arr.indexOf(file.type) !== -1;

    if (isTooLarge) {
      message.error('图片不能超过2M');
    }

    if (!isImg) {
      message.error('请上传 bmp, png, jpg, gif 格式的文件');
    }

    return !isTooLarge && isImg;
  }

  checkPhone (rule, value, callback) {
    if (value && !(/^1[34578]\d{9}$/.test(value))) {
      callback('请输入正确的手机格式!');
    } else {
      callback();
    }
  }

  checkEmail (rule, value, callback) {
    if (value && (/[A-Z]/.test(value))) {
      callback('(请用小写字母)');
    } else {
      callback();
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.tenType = '132';
        values.ident = this.state.mobile;
        console.log('Received values of form: ', values);
        this.props.dispatch({
          type: 'merchantCompletion/submit',
          isUpdate: !isEmptyObject(this.props.initData),
          values,
        });
      }
    });
  };

  provinceChange = (value) => {
    this.props.dispatch({
      type: 'merchantCompletion/getDistrict',
      provinceId: value,
      getType: 'city'
    });

    this.props.form.setFieldsValue({'tenCity' : '' });
    this.props.form.setFieldsValue({'tenDistrict': ''});
  };

  cityChange = (value) => {
    this.props.dispatch({
      type: 'merchantCompletion/getDistrict',
      provinceId: value,
      getType: 'area'
    });

    this.props.form.setFieldsValue({'tenDistrict': ''});
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
  }

  render() {
    const { getFieldDecorator, getFieldError } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 8},
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6,
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select className="icp-selector" style={{ width: 60 }}>
        <Option value="86">+86</Option>
      </Select>
    );

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

    const { initData, provinceList, cityList, areaList, YeTaiList, showYeTaiImg } = this.props;

    return (
      <div>
        <Row>
          <Col span={17} push={3}>
            <Form onSubmit={this.handleSubmit} className="form-size" style={{ marginTop: 50 }}>
              <FormItem
                {...formItemLayout}
                label=""
              >
                {getFieldDecorator('tenantId', {
                  initialValue: initData.id,
                })(
                  <Input type="hidden" />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="商户名称"
                hasFeedback
              >
                {getFieldDecorator('tenAlias', {
                  initialValue: initData.tenName,
                  rules: [{ required: true, message: '请输入商户名称!' }],
                })(
                  <Input placeholder="最多30个字" maxLength="30"  />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="品牌名称"
                hasFeedback
              >
                {getFieldDecorator('braName', {
                  initialValue: initData.braName,
                  rules: [{ required: true, message: '请输入品牌名称!' }],
                })(
                  <Input placeholder="最多20个字" maxLength="20" />
                )}
              </FormItem>

              {/*<FormItem
                {...formItemLayout}
                label="品牌logo"
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

                {getFieldDecorator('braLogo', {
                  initialValue: initData.braLogo,
                  rules: [{ required: true, message: '请上传品牌logo!' }],
                })(
                  <Input type="hidden" />
                )}
              </FormItem>*/}
              {/*<FormItem
                {...formItemLayout}
                label="业态选择"
              >
                {getFieldDecorator('format', {
                  initialValue: initData.format,
                  rules: [{ required: true, message: '请选择业态!' }],
                })(
                  <RadioGroup disabled={ showYeTaiImg } name="YeTaiList" onChange={this.onChange}>
                    {
                      YeTaiList && YeTaiList.map((data) => {
                        return <Radio key={data.dictCode} value={data.dictCode}>{data.dictName}</Radio>;})
                    }
                  </RadioGroup>
                )}
              </FormItem>*/}
              <FormItem
                {...formItemLayout}
                help={getFieldError('tenProvince') || getFieldError('tenCity') || getFieldError('tenDistrict')}
                validateStatus={
                  classnames({
                    error: !!getFieldError('tenProvince') || !!getFieldError('tenCity') || !!getFieldError('tenDistrict'),
                  })}
                label="商户地址"
              >
                { getFieldDecorator('tenProvince', {
                  initialValue: initData.tenProvince || '',
                  rules: [
                    { required: true, message: '请选择省份!' },
                  ],
                  onChange: this.provinceChange,
                })(
                  <Select placeholder="请选择"
                          style={{ width: '35%' }}>
                    <Option key="province" value="">请选择</Option>
                    {
                      provinceList.map((data) => {
                        return <Option key={data.id} value={data.id}>{data.areaName}</Option>;
                      })
                    }
                  </Select>
                )}
                {getFieldDecorator('tenCity', {
                  initialValue: initData.tenCity || '',
                  rules: [
                    { required: true, message: '请选择城市!' },
                  ],
                  onChange: this.cityChange,
                })(
                  <Select placeholder="请选择" style={{ width: '30%', marginLeft: '2%' }} >
                    <Option key="city" value="">请选择</Option>
                    {
                      cityList.map((data) => {
                        return <Option key={data.id} value={data.id}>{data.areaName}</Option>;
                      })
                    }
                  </Select>
                )}
                {getFieldDecorator('tenDistrict', {
                  initialValue: initData.tenDistrict || '',
                  rules: [
                    { required: true, message: '请选择区域!' },
                  ],
                })(
                  <Select placeholder="请选择" style={{ width: '30%', marginLeft: '2%' }} >
                    <Option key="district" value="">请选择</Option>
                    {
                      areaList.map((data) => {
                        return <Option key={data.id} value={data.id}>{data.areaName}</Option>;
                      })
                    }
                  </Select>
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                {getFieldDecorator('tenAddress', {
                  initialValue: initData.tenAddress,
                  rules: [{ required: true, message: '请输入详细地址!' }],
                })  (
                  <Input type="textarea" placeholder="详细地址" maxLength="120"  style={{ width: '57%' }} />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="联系人"
                hasFeedback
              >
                {getFieldDecorator('tenLinkman', {
                  initialValue: initData.tenLinkman,
                  rules: [{ required: true, message: '请输入联系人!' }],
                })(
                  <Input placeholder="请输入联系人" maxLength="10" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="联系方式"
              >
                {getFieldDecorator('tenTel', {
                  initialValue: initData.tenTel,
                  validateTrigger: 'onBlur',
                  rules: [{ required: true, message: '请输入联系方式!'
                  }, {
                    validator: this.checkPhone,
                  }],

                },)(
                  <Input addonBefore={prefixSelector} maxLength="11" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="电子邮箱"
                hasFeedback
              >
                {getFieldDecorator('tenMail', {
                  initialValue: initData.tenMail,
                  rules: [{
                    type: 'email', message: '输入的电子邮件地址无效',
                  },{
                    required: true, message: '请输入你的邮箱!',
                  },{
                    validator: this.checkEmail,
                  }],
                })(
                  <Input maxLength="64" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label=""
              >
                {getFieldDecorator('tenType', {
                  initialValue: '132',
                })(
                  <Input type="hidden" />
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" size="large" loading={this.props.submitBtnLoading}>保存</Button>
              </FormItem>
            </Form>
          </Col>
          <Col span={7} pull={2}>
            <img style={{ marginTop: 50 }} src={this.state.remarks} />
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { provinceList, cityList, areaList, initData, fileList, submitBtnLoading, YeTaiList, showYeTaiImg } = state.merchantCompletion;

  return {
    provinceList,
    cityList,
    areaList,
    fileList,
    initData,
    submitBtnLoading,
    YeTaiList,
    showYeTaiImg,
  };
}

export default connect(mapStateToProps)(Form.create()(CompletionForm));


