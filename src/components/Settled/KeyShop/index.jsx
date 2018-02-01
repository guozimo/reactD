import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Button, Radio, Collapse } from 'antd';
import ImgUpload from '../../common/ImgUpload';
import classnames from 'classnames';
import { isEmptyObject } from '../../../utils';
import { delShopImg } from '../../../services/settled/keyShop';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;

const userInfo = window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')) : {};
// const { storeId } = userInfo;
const storeId  = window.localStorage.getItem('storeId');

const uploadProps = {
  name: 'file',
  maxSize: 1024 * 10,
  action: '/ipos-chains/basKbShop/uploadShopImg',
};

class KeyShopForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    form: PropTypes.object,
    provinceList: PropTypes.array,
    kbCategoryList: PropTypes.array,
    secondCategoryList: PropTypes.array,
    cityList: PropTypes.array,
    areaList: PropTypes.array,
    submitBtnLoading: PropTypes.bool,
    storeCode: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  checkPhone (rule, value, callback) {
    if (value && !(/^1[34578]\d{9}$/.test(value))) {
      callback('请输入正确的手机格式!');
    } else {
      callback();
    }
  }

  checkAuditImages (rule, value, callback) {
    if (value.length<2) {
      callback('请上传至少两张内景照!');
    } else {
      callback();
    }
  }

  addressChange (rule, value, callback) {
    if (value && value.length<4) {
      callback('请至少输入4个汉字!');
    } else {
      callback();
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const fields = {...values};

      if (!err) {
        fields.mainImage = fields.mainImage[0].id;
        //fields.auditImages = this.buildImgs(fields.auditImages);
        fields.auditImages = this.mergeImgs(fields.mainImage,fields.auditImages);
        fields.licence = this.buildImgs(fields.licence);
        fields.authLetter = fields.authLetter[0].id;
        fields.businessCertificate = fields.businessCertificate[0].id;

        Object.assign(fields, {
          storeCode: this.props.storeCode,
          storeId,
        });

        console.log('Received values of form: ', fields);

        this.props.dispatch({
          type: 'keyShop/submit',
          values: fields,
        });
      }
    });
  };

  buildImgs = (list) => {
    const imgs = [];
    list.map((item) => {
      imgs.push(item.id);
    });
    return imgs.join(',');
  };

  mergeImgs = (imgSrc,list) => {
    const imgs = [];
    imgs.push(imgSrc);
    list.map((item) => {
      imgs.push(item.id);
    });

    return imgs.join(',');
  };
  provinceChange = (value) => {
    this.props.dispatch({
      type: 'keyShop/getDistrict',
      provinceId: value,
      getType: 'city'
    });

    this.props.form.setFieldsValue({'cityCode': ''});
    this.props.form.setFieldsValue({'districtCode': ''});
  };

  cityChange = (value) => {
    this.props.dispatch({
      type: 'keyShop/getDistrict',
      provinceId: value,
      getType: 'area'
    });

    this.props.form.setFieldsValue({'districtCode': ''});
  };

  secondChange = (value) => {
    this.props.dispatch({
      type: 'keyShop/getSecondCategoryList',
      categoryId: value,
    });
    this.props.form.setFieldsValue({'secondCategoryId': ''});
    this.props.form.setFieldsValue({'categoryId': ''});
  };

  formatImg = (value, ids) => {
    if (!ids) {
      return;
    }
    const img = [];
    const idsArray = ids.split(',');
    value.split(',').map((item, index) => {
      img.push({
        id: idsArray[index],
        uid: index,
        status: 'done',
        url: item
      })
    });

    return img;
  };

  delImage = (params) => {
    return new Promise((resolve, reject) => {
      delShopImg(params).then(({ data }) => {
        if (data.success) {
          resolve();
        } else {
          reject();
        }
      },  () => {
        reject();
      })
    });
  };

  render() {
    const { getFieldDecorator, getFieldError, getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 8},
    };
    const uploadLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12},
    };

    const tailFormItemLayout = {
      wrapperCol: {
        span: 8,
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

    const { provinceList, kbCategoryList, secondCategoryList, cityList, areaList, initData } = this.props;
    // console.log(initData);

    const text1 = <div>
      <FormItem
        {...formItemLayout}
        label="主门店名称"
        hasFeedback
      >
        {getFieldDecorator('mainShopName', {
          initialValue: initData.mainShopName,
          rules: [{ required: true, message: '请输入商户主门店名!' }],
        })(
          <Input placeholder="" maxLength="30" />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="分店名称"
        hasFeedback
      >
        {getFieldDecorator('branchShopName', {
          initialValue: initData.branchShopName,
          rules: [{ required: true, message: '请输入商户主门店名!' }],
        })(
          <Input placeholder="最多30个字" maxLength="30" />
        )}
      </FormItem>

      <FormItem
        {...formItemLayout}
        help={getFieldError('provinceCode') || getFieldError('cityCode') || getFieldError('districtCode')}
        validateStatus={
          classnames({
            error: !!getFieldError('provinceCode') || !!getFieldError('cityCode') || !!getFieldError('districtCode'),
          })}
        label="门店地址"
      >
        { getFieldDecorator('provinceCode', {
          initialValue: initData.provinceCode || '',
          rules: [
            { required: true, message: '请选择省份!' },
          ],
          onChange: this.provinceChange,
        })(
          <Select placeholder="请选择"
                  style={{ width: '35%' }}>
            <Option key="provinceCode" value="">请选择</Option>
            {
              provinceList && provinceList.map((data) => {
                return <Option key={data.areaCode} value={data.areaCode}>{data.areaName}</Option>;
              })
            }
          </Select>
        )}
        {getFieldDecorator('cityCode', {
          initialValue: initData.cityCode || '',
          rules: [
            { required: true, message: '请选择城市!' },
          ],
          onChange: this.cityChange,
        })(
          <Select placeholder="请选择" style={{ width: '30%', marginLeft: '2%' }} onSelect={(value, option)=>{
            this.props.form.setFieldsValue({
              'cityName': option.props.children,
            });
          }}>
            <Option key="cityCode" value="">请选择</Option>
            {
              cityList && cityList.map((data) => {
                return <Option key={data.areaCode} value={data.areaCode}>{data.areaName}</Option>;
              })
            }
          </Select>
        )}

        {getFieldDecorator('cityName', {
          initialValue: initData.cityName,
        })(
          <Input type="hidden" />
        )}

        {getFieldDecorator('districtCode', {
          initialValue: initData.districtCode || '',
          rules: [
            { required: true, message: '请选择区域!' },
          ],
        })(
          <Select placeholder="请选择" style={{ width: '30%', marginLeft: '2%' }} >
            <Option key="district" value="">请选择</Option>
            {
              areaList && areaList.map((data) => {
                return <Option key={data.areaCode} value={data.areaCode}>{data.areaName}</Option>;
              })
            }
          </Select>
        )}
      </FormItem>
      <FormItem {...tailFormItemLayout}>
        {getFieldDecorator('address', {
          initialValue: initData.address,
          validateTrigger: 'onBlur',
          rules: [{ required: true, message: '请输入详细地址!' },{
            validator: this.addressChange,
          }],
        })(
          <Input type="textarea"  maxLength="50" placeholder="详细地址"  />
        )}
      </FormItem>

      <FormItem
        {...formItemLayout}
        help={getFieldError('secondCategoryId') || getFieldError('categoryId')}
        validateStatus={
          classnames({
            error: !!getFieldError('secondCategoryId') || !!getFieldError('categoryId'),
          })}
        label="经营品类"
      >
        <Input placeholder="美食" disabled style={{ width: '26%' }} />

        {getFieldDecorator('secondCategoryId', {
          initialValue: initData.secondCategoryId,
          rules: [
            { required: true, message: '请选择经营品类' },
          ],
          onChange: this.secondChange,
        })(
          <Select placeholder="请选择" style={{ width: '35%', marginLeft: '2%' }} >
            <Option key="city" value="">请选择</Option>
            {
              kbCategoryList && kbCategoryList.map((data) => {
                return <Option key={data.categoryId} value={data.categoryId}>{data.categoryName}</Option>;
              })
            }
          </Select>
        )}

        {getFieldDecorator('categoryId', {
          initialValue: initData.categoryId,
          rules: [
            { required: true, message: '请选择经营品类' },
          ],
        })(
          <Select placeholder="请选择" style={{ width: '35%', marginLeft: '2%' }} >
            <Option key="categoryId" value="">请选择</Option>
            {
              secondCategoryList  && secondCategoryList.map((data) => {
                return <Option key={data.categoryId} value={data.categoryId}>{data.categoryName}</Option>;
              })
            }
          </Select>
        )}
      </FormItem>

      <FormItem
        {...formItemLayout}
        label="门店电话"
        hasFeedback
      >
        {getFieldDecorator('contactNumber', {
          initialValue: initData.contactNumber,
          validateTrigger: 'onBlur',
          rules: [{ required: true, message: '请输入门店电话!' },{
            validator: this.checkPhone,
          }],
        })(
          <Input placeholder="请输入门店电话号码"  maxLength="11" />
        )}
      </FormItem>

      <FormItem
        {...formItemLayout}
        label="门头照"
      >
        <ImgUpload { ...uploadProps } max={1}  data={{'imgFlag': 'main_image', storeId}}
                   {...getFieldProps('mainImage', {
                     initialValue: !isEmptyObject(initData) && this.formatImg(initData.mainImageUrl, initData.mainImage) || [],
                     rules: [{ required: true, message: '请输入门头照!' }]
                   })}/>
      </FormItem>
      <div className="ant-row ant-form-item">
        <span className="ant-col-6 ant-form-item-label"></span>
        <span className="ant-col-12 ant-form-item-control-wrapper">限1张，必须是实景图，不可有水印（如上传装修效果图则将被驳回）
      建议尺寸在2000px*1500px以上图片不超过10M，支持格式：bmp，png，jpeg，gif</span>
      </div>
      <FormItem
        {...uploadLayout}
        label="内景照"
      >
        <ImgUpload { ...uploadProps } max={5} data={{'imgFlag': 'indoor_images', storeId}} onRemove={(file)=> {
          console.log(file);
          return this.delImage({
            storeId,
            imgFlag: 'indoor_images',
            indoorImagesUrl: file.url,
            indoorImages: file.id
          });
        }
        }{...getFieldProps('auditImages', {
          initialValue: !isEmptyObject(initData) && this.formatImg(initData.indoorImagesUrl, initData.auditImages) || [],
          rules: [
            { required: true, message: '请选择内景照' },
            {
              validator: this.checkAuditImages,
            }
          ],
        })}/>
      </FormItem>
      <div className="ant-row ant-form-item">
        <span className="ant-col-6 ant-form-item-label"></span>
        <span className="ant-col-12 ant-form-item-control-wrapper">2张以上，必须是实景图，不可有水印（如上传装修效果图则将被驳回）
建议尺寸在2000px*1500px以上图片不超过10M，支持格式：bmp，png，jpeg，gif</span>
      </div>
    </div>;
    const text2 = <div>
      <FormItem
        {...uploadLayout}
        label="营业执照"
      >
        <ImgUpload { ...uploadProps } max={1} data={{'imgFlag': 'licence', storeId}}
                   {...getFieldProps('licence', {
                     initialValue: !isEmptyObject(initData) && this.formatImg(initData.licenceUrl, initData.licence) || [],
                     rules: [{ required: true, message: '请上传营业执照!' }],
                   })} />

      </FormItem>
      <FormItem
        {...formItemLayout}
        label="营业执照编号"
      >
        {getFieldDecorator('licenceCode', {
          initialValue: initData.licenceCode,
          rules: [{ required: true, message: '请输入营业执照编号!' }],
        })(
          <Input placeholder="请输入商户营业执照编号" maxLength="30" />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="营业执照名称"
      >
        {getFieldDecorator('licenceName', {
          initialValue: initData.licenceName,
          rules: [{ required: true, message: '请输入营业执照名称!' }],
        })(
          <Input placeholder="请输入商户营业执照编号" maxLength="30" />
        )}
      </FormItem>

      <FormItem
        {...formItemLayout}
        label="门店授权函"
      >
        <ImgUpload { ...uploadProps } max={1} data={{'imgFlag': 'auth_letter', storeId}}
                   {...getFieldProps('authLetter', {
                     initialValue: !isEmptyObject(initData) && this.formatImg(initData.authLetterUrl, initData.authLetter) || [],
                     rules: [{ required: true, message: '请输入门店授权函!' }],
                   })}/>
      </FormItem>

      <FormItem
        {...formItemLayout}
        label="许可证"
      >
        <ImgUpload { ...uploadProps } max={1} data={{'imgFlag': 'business_certificate', storeId}}
                   {...getFieldProps('businessCertificate', {
                     initialValue: !isEmptyObject(initData) && this.formatImg(initData.businessCertificateUrl, initData.businessCertificate) || [],
                     rules: [{ required: true, message: '请输入门店许可证!' }],
                   })}/>
      </FormItem>
    </div>;

    const text3 = <div>
      <FormItem
        {...formItemLayout}
        label="品牌名称"
      >
        {getFieldDecorator('brandName', {
          initialValue: initData.brandName,
          rules: [{ required: true, message: '请输入商户品牌名称!' }],
        })(
          <Input placeholder="品牌简称，如金钱豹" maxLength="30" />
        )}
      </FormItem>
      {/* <FormItem
       {...formItemLayout}
       label="默认收款方式"
       hasFeedback
       >
       {getFieldDecorator('storeProp11', {
       initialValue: initData.storeProp11,
       rules: [{ required: true, message: '请输入默认的收款方式!' }],
       })(
       <RadioGroup>
       <Radio value="T">顾客自助买单</Radio>
       <Radio value="F">商家扫码买单</Radio>
       </RadioGroup>
       )}
       </FormItem> */}
      <FormItem
        {...formItemLayout}
        label="门店店长电话号码"
        hasFeedback
      >
        {getFieldDecorator('notifyMobile', {
          initialValue: initData.notifyMobile,
          validateTrigger: 'onBlur',
          rules: [{
            validator: this.checkPhone,
          }],
        })(
          <Input addonBefore={prefixSelector} maxLength="11" />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="人均消费价格"
        hasFeedback
      >
        {getFieldDecorator('avgPrice', {
          initialValue: initData.avgPrice,
        })(
          <Input placeholder="最少1元，最大不超过99999元，单位元，不需要填写" maxLength="30" />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="门店是否支持停车"
      >
        {getFieldDecorator('parking', {
          initialValue: initData.parking
        })(
          <RadioGroup>
            <Radio value="T">是</Radio>
            <Radio value="F">否</Radio>
          </RadioGroup>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="门店是否支持WIFI"
      >
        {getFieldDecorator('wifi', {
          initialValue: initData.wifi
        })(
          <RadioGroup>
            <Radio value="T">是</Radio>
            <Radio value="F">否</Radio>
          </RadioGroup>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="门店是否有包厢"
      >
        {getFieldDecorator('box', {
          initialValue: initData.box
        })(
          <RadioGroup>
            <Radio value="T">是</Radio>
            <Radio value="F">否</Radio>
          </RadioGroup>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="门店是否有无烟区"
      >
        {getFieldDecorator('noSmoking', {
          initialValue: initData.noSmoking
        })(
          <RadioGroup>
            <Radio value="T">是</Radio>
            <Radio value="F">否</Radio>
          </RadioGroup>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="机具号"
        hasFeedback
      >
        {getFieldDecorator('implementId')(
          <Input placeholder="请输入机具号" />
        )}
      </FormItem>
    </div>;

    return (
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 50 }}>
        { (initData.shopStatus == 'AUDITING') &&
        <div style={{fontSize:16,margin:"20px",color:"red"}} >门店正在审核中...</div>
        }
        { (initData.shopStatus == 'AUDIT_SUCCESS') &&
        <div style={{fontSize:16,margin:"20px",color:"red"}} >门店审核成功</div>
        }
        { (initData.shopStatus == 'AUDIT_FAILED') &&
        <div style={{fontSize:16,margin:"20px",color:"red"}} >门店审核未通过...{initData.authResultDesc}</div>
        }
        <Collapse defaultActiveKey={['1']} >
          <Panel header="基本设置" key="1">
            {text1}
          </Panel>
          <Panel header="认证信息" key="2">
            {text2}
          </Panel>
          <Panel header="其他设置" key="3">
            {text3}
          </Panel>
        </Collapse>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" style={{marginTop:20}} loading={this.props.submitBtnLoading}>保存</Button>
        </FormItem>

      </Form>
    );
  }
}

function mapStateToProps(state) {
  const { provinceList, kbCategoryList, secondCategoryList, cityList, initData, areaList, submitBtnLoading } = state.keyShop;

  return {
    provinceList,
    kbCategoryList,
    secondCategoryList,
    cityList,
    areaList,
    submitBtnLoading,
    initData,
  };
}
export default connect(mapStateToProps)(Form.create()(KeyShopForm));


