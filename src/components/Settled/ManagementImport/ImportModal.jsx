import React, { PropTypes, Component } from 'react';
import { getUserInfo} from '../../../utils';
import { Form, Select, Upload, Button, Icon, message, Modal,Input,Radio,Row, Col ,Tree} from 'antd';
import moment from "moment/moment";
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const OptGroup=Select.OptGroup

const RadioGroup = Radio.Group;
const TreeNode = Tree.TreeNode;
const { tenName} = getUserInfo();
let currAclStoreId = ""
let queryString = ""
let pageCount = ""
let currentPage = ""
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    span: 14,
    offset: 5,
  },
};
/*mock下面*/
function handleChange(value,info) {

}

class ImportModal extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    title: PropTypes.string,
    form: PropTypes.object,
    provinceList:PropTypes.array,
    cityList:PropTypes.array,
    postVal:PropTypes.object,
    emplCode:PropTypes.string,
    postList:PropTypes.array,
    showEditor:PropTypes.bool,
    recordId:PropTypes.string,
    emp1:PropTypes.object,
    record:PropTypes.object,
    rightName:PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      allowSubmit: false,
      Newkey: false,
      cities: [],
      secondCity: [],
      thirdCity:[],
      value:1,
      provinceVal:"",
      isShowMenu1:false,
      isShowMenu2:false,
      subordinateId:"",
      subordinateType:"",
      rightName:"",
      subordinateName:"请选择",
      rightName2:"请选择",
      selectedKeys: [],
      showTip: false,


    };
  }

  handleProvinceChange = (value) => {
    this.props.dispatch({
      type: 'memberImport/getSecondArea',
      payload:{
        provinceId:value
      }
    });
    this.props.form.resetFields(['city']);
    this.props.form.resetFields(['district']);

  }
  onSecondCityChange = (value) => {
    this.props.dispatch({
      type: 'memberImport/getThirdArea',
      payload:{
        provinceId:value
      }
    });
    this.props.form.resetFields(['district']);

  }
  onThirdCityChange = (value) => {
    this.setState({
      thirdCity: value,
    });
  }

  showBox = (mode) => {
    if (mode == 1) {
      this.setState({
        isShowMenu1:true,
        isShowMenu2:false
      })
    } else {
      this.setState({
        isShowMenu1:false,
        isShowMenu2:true
      })
    }
  }

  hideMenu= (mode) => {
    if (mode == 1) {
      this.setState({
        isShowMenu1:false,
        isShowMenu2:false
      })
    } else {
      this.setState({
        isShowMenu1:false,
        isShowMenu2:false
      })
    }
  }

  saveMenu= (mode) => {
    if (mode == 1) {

      this.setState({
        isShowMenu1:false,
        isShowMenu2:false,
        subordinateName2:this.state.subordinateName
      });

      this.props.form.setFieldsValue({
        'emlcode':this.state.subordinateName2
      });
      const newEmp1 = this.props.emp1||{};
      newEmp1.storeName = this.state.subordinateName;
      console.log('newEmp1', newEmp1);
      this.props.dispatch({
        type: 'memberImport/saveEmp1',
        emp1:newEmp1
      })
      this.props.dispatch({
        type: 'memberImport/restStore',
        payload: {
          storeId:this.state.subordinateId || '',
        },
        newEmp1:newEmp1
      })

    } else {
      console.log('selectedKeys', this.state.selectedKeys);
      this.setState({
        isShowMenu1:false,
        isShowMenu2:false,
        rightName2:this.state.rightName
      })

      this.props.dispatch({
        type: 'memberImport/rightName',
        rightName:this.state.rightName2
      })
      const Emp1=this.props.emp1||{};
      console.log('this.state.rightName', this.state.rightName)
      Emp1.rightName=this.state.rightName
      Emp1.selectedKeys=this.state.selectedKeys;
      console.log('newEmp1', Emp1);
      this.props.dispatch({
        type: 'memberImport/saveEmp1',
        emp1:Emp1
      })

    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (values.idCard && !(reg.test(values.idCard))){
       this.setState({
         'showTip': true,
       })
      } else {
        this.setState({
          'showTip': false,
        })
      }
      if (!err) {
        let postType='';
        (this.props.postList||[]).map(function(item){
          if(item&&values.position&&(item.id==values.position)){
            postType=item.postType;
          }
         })
        var stores='';
        if(this.props.emp1&&this.props.emp1.selectedKeys.length>0){
          if(this.props.emp1.selectedKeys.length>1){
            if (this.props.emp1.selectedKeys[this.props.emp1.selectedKeys.length-1]=='0-0'){
              this.props.emp1.selectedKeys.length--;
            }
            stores = this.props.emp1.selectedKeys.join(',');
          }else{
            stores = this.props.emp1.selectedKeys.join('');
          }
        }else if (this.state.selectedKeys.length>0){
          if (this.state.selectedKeys.length>1){
            if (this.state.selectedKeys[this.state.selectedKeys.length-1]=='0-0'){
              this.state.selectedKeys.length--;
            }
            stores = this.state.selectedKeys.join(',');
          } else {
            stores = this.state.selectedKeys.join('');
          }
         } else {
          stores= ''
        }
        console.log('---this.state.subordinateId', this.state.subordinateId);
        const postVal={
          storeId: this.state.subordinateId || this.props.emp1.storeId,
          postId: values.position,
          postType: postType || '',
          stores: stores,
          realname:values.userName,
          address: values.address,
          city: values.city,
          district: values.district,
          emplCode: this.props.emp1.emplCode || '',
          gender:values.sex,
          mobile:values.phone,
          province: values.province,
          tenantId: "",
          isDisplay:"",
          posUserAccount:"",
          present: "",
          discountGive:"",
          idCard: values.idCard,
          id:this.props.recordId||"",
        }

        if (this.props.isEdit){
          this.props.dispatch({
            type: 'memberImport/updateEmployee',
            payload:postVal,
          });
        } else {
          this.props.dispatch({
            type: 'memberImport/addAclEmployee',
            payload:postVal,
          });
        }
      }
    });
  }
  onSelect = (selectedKeys, info) => {
    this.setState({
      subordinateId:selectedKeys[0],
      subordinateType:info.selectedNodes[0].props.info.orgType||'',
      subordinateName:info.selectedNodes[0].props.info.name||'',
    })

  }

  onChecked = (selectedKeys, info) => {
    const oldStr= info.checkedNodes.map(function(item){
      let newAry=[];
      if(item.props.info){
        newAry.push(item.props.info.name);
        return newAry
      }
    });
    if(oldStr.length>1){
      var newStr=oldStr.join("/");
    }else{
       newStr=oldStr.join("");
    }

    this.setState({
      rightName:newStr,
      selectedKeys: selectedKeys,
    })
  }

  /*======================上面是mock数据*/
  showModelHandler = (e,isEdit,id) => {
    if (e) e.stopPropagation();
    this.props.dispatch({
      type: 'memberImport/showEditor',
      showEditor:true,
    });
    if(!isEdit){
      //新增的处理
      this.props.dispatch({
        type: 'memberImport/saveEmp1',
        emp1:null
      });

    }
  };

  hideModelHandler = () => {
    /*this.setState({
      visible: false,
    });*/
    this.setState({
      isShowMenu1:false,
      isShowMenu2:false
    });
    this.props.dispatch({
      type: 'memberImport/showEditor',
      showEditor:false,
    });
  };


  downloadCategory = () => {
    this.props.dispatch({
      type: 'memberImport/downloadCategory',
    });
  };

  downloadDish = () => {
    this.props.dispatch({
      type: 'memberImport/downloadDish',
    });
  };

  downloadTableQu = () => {
    this.props.dispatch({
      type: 'memberImport/downloadTableQu',
    });
  };

  doRedirect = () => {
    this.props.dispatch({
      type: 'memberImport/fetch',
    })
    this.state.Newkey = !this.state.Newkey;
    this.state.allowSubmit = !this.state.allowSubmit;
  };
  checkPhone =(rule, value, callback) =>{
    if (value && !(/^1[34578]\d{9}$/.test(value))&& !(/^[0][0-9]{9,11}$/.test(value))) {
      callback('请输入正确的手机格式!');
    } else {
      callback();
    }
  }

  onChangeStoreId = (value) => {
    if(value){
      this.setState({
        allowSubmit: true,
      });
    }
  };

  render() {
    const { children, treeNodes } = this.props;
    const { getFieldDecorator } = this.props.form;
    let provinceData=[];

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
    };

    provinceData=this.props.provinceList;
    const provinceOptions = provinceData.map(province => <Option key={province.id}>{province.areaName}</Option>);

    const cityOptions = this.props.cityList.map(city => <Option key={city.id}>{city.areaName}</Option>);

    const thirdCityOptions = this.props.areaList.map(city => <Option key={city.id}>{city.areaName}</Option>);
    const treeData = [];

    /*  const positionOptions = this.props.postList.map(item => <OptGroup key={item.postType}><Option key={item.id}>{item.areaName}</Option></OptGroup>);*/
    const zd = [], yd = [], ydZd = [];
    (this.props.postList||[]).map(function(item, index){
      switch (item.postType) {
        case 296:
         /* item.groupName = '终端岗位';
          zd.push(<Option key={index} value={item.id}>{item.postName}</Option>);*/
          break;
        case 297:
         /* item.groupName = '云端岗位';*/
          yd.push(<Option key={index} value={item.id}>{item.postName}</Option>);
          break;
        case 298:
         /* item.groupName = '云端+终端岗位';
          ydZd.push(<Option key={index} value={item.id}>{item.postName}</Option>);*/
          break;
        default:
          /*item.groupName = '云端岗位';*/
          yd.push(<Option key={index} value={item.id}>{item.postName}</Option>);
          break;
         /* item.groupName = '终端岗位';
          zd.push(<Option key={index} value={item.id}>{item.postName}</Option>);*/
      }
    });
/*    const zdGruop = (<OptGroup label='终端岗位' key={'000'}>{zd}</OptGroup>);
    const ydGruop = (<OptGroup label='云端岗位' key={'001'}>{yd}</OptGroup>);
    const ydZdGroup = (<OptGroup label='云端+终端岗位' key={'002'}>{ydZd}</OptGroup>);
    const positionOptions = [];
    zd.length && positionOptions.push(zdGruop);
   /!* yd.length && positionOptions.push(ydGruop);*!/
    yd.length && positionOptions.push(ydGruop);
    ydZd.length && positionOptions.push(ydZdGroup);*/
    console.log('treeNodes', this.props.treeNodes);
    this.props.treeNodes.map(function(item, index) {
      item.orgType? currAclStoreId=item.id+"_"+item.orgType:currAclStoreId=""
      treeData.push(<TreeNode title={ item.name } key={currAclStoreId} info={item}></TreeNode>);
    });

    if(this.props.emp1){
      let localStoreName = tenName || '';
      var userName = this.props.emp1.storeId == '00000000-0000-0000-0000-000000000000' ?localStoreName:this.props.emp1.storeName;
    }
    const { emp1, isEdit } = this.props;
    return (

      <div>
      {
        this.props.showEditor&& <Modal
          title={isEdit? '编辑人员': '新增人员'}
          visible={this.props.showEditor}
          onCancel={this.hideModelHandler}
          footer={[
            <Button key="back" size="large" onClick={this.hideModelHandler}>返回</Button>,
            <Button key="save" size="large" type="primary" onClick={this.handleSubmit}>保存</Button>,]}
          key={this.state.Newkey}
          className='member_css'
          afterClose={this.doRedirect}
          width={810}
          style={{ width: '810px!important' }}
        >
          <div className="template-all">
            <Form>
              <Row className="margin_btm">
                <Col span={12}>
                  <Col>
                    <FormItem
                      {...formItemLayout}
                      label="人员姓名："
                    >
                      {getFieldDecorator('userName', {
                        initialValue: (emp1 && emp1.realname) || '',
                        rules: [{ required: true, message: '请输入员工姓名!' },{ validator: this.checkPassword, }],
                      })(
                        <Input placeholder="输入员工姓名" maxLength={'20'}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col>
                    <FormItem
                      {...formItemLayout}
                      label="隶属机构："
                    >
                      {getFieldDecorator('jg', {
                        initialValue: (emp1 && emp1.storeName) || '请选择',
                        rules: [{ required: true, message: '请选择结构!' },{ validator: this.checkPassword, }],
                      })(
                        <div>
                          <div className="belong-charge" onClick={() => this.showBox(1)}>
                            {emp1 && emp1.storeName|| '请选择'}
                          </div>
                          {this.state.isShowMenu1 &&
                            <div className='box_warp'>
                          <div className="menuList">
                            <Tree  onSelect={(value,info) => this.onSelect(value,info)}
                                   showLine  defaultExpandAll={true}
                            >
                              <TreeNode title={tenName} key="">
                                { treeData }
                              </TreeNode>
                            </Tree>
                          </div>
                              <div className="bottom-action-wrap group_btn">
                                <button className="btn" onClick={() => this.hideMenu(1)}>取消</button>
                                <button className="btn btn-success btn-save" onClick={() => this.saveMenu(1)}>保存</button>
                              </div>
                            </div>
                          }
                        </div>
                      )}
                    </FormItem>
                  </Col>
                  <Col>
                    <FormItem
                      {...formItemLayout}
                      label="权限机构："
                    >
                      {getFieldDecorator('qx', {
                        initialValue: (emp1 && emp1.rightName) || '请选择',
                      })(<div>
                        <div className="belong-charge" onClick={() => this.showBox(2)}>
                          {emp1 && emp1.rightName|| '请选择'}
                        </div>
                        {this.state.isShowMenu2&&
                        <div className='box_warp'>
                          <div className="menuList">
                            <Tree
                              checkable
                              onExpand={this.onExpand}
                              expandedKeys={this.state.expandedKeys}
                              autoExpandParent={this.state.autoExpandParent}
                              onCheck={(value,info) => this.onChecked(value,info)}
                              defaultExpandAll={true}
                              defaultCheckedKeys = {emp1 && emp1.selectedKeys || []}
                            >
                              <TreeNode title={tenName} key="">
                                { treeData }
                              </TreeNode>
                            </Tree>
                          </div>
                          <div className="bottom-action-wrap group_btn">
                            <button className="btn" onClick={() => this.hideMenu(2)}>取消</button>
                            <button className="btn btn-success btn-save" onClick={() => this.saveMenu(2)}>保存</button>
                          </div>
                        </div>
                        }
                      </div>)
                      }
                    </FormItem>
                  </Col>
                  <Col>
                    <Row style={{ paddingBottom: '10px' }}>
                      <FormItem
                        {...formItemLayout}
                        label="住址："
                        style={{ marginBottom: '10px' }}
                      >
                        { getFieldDecorator('province', {
                          initialValue: (emp1 && emp1.province) || '',
                          rules: [
                            { required: true, message: '请选择省份!' },
                          ],

                        })(
                          <Select placeholder="请选择"
                                  style={{ width: '35%' }}
                                  dropdownMatchSelectWidth = {false}
                                  onChange={this.handleProvinceChange} >
                            <Option key="province" value="">请选择</Option>
                            {provinceOptions}
                            {

                            }
                          </Select>
                        )}
                        {getFieldDecorator('city', {
                          initialValue: (emp1 && emp1.city) || '',
                          rules: [
                            { required: true, message: '请选择城市!' },
                          ],

                        })(
                          <Select placeholder="请选择" style={{ width: '30%', marginLeft: '2%' }} dropdownMatchSelectWidth = {false} onChange={this.onSecondCityChange} >
                            <Option key="city" value="">请选择</Option>
                            {cityOptions}
                          </Select>
                        )}
                        {getFieldDecorator('district', {
                          initialValue: (emp1 && emp1.district) || '',
                          rules: [
                            { required: true, message: '请选择区域!' },
                          ],
                        })(
                          <Select placeholder="请选择" style={{ width: '30%', marginLeft: '2%' }} dropdownMatchSelectWidth = {false} onChange={this.onThirdCityChange} >
                            <Option key="district" value="">请选择</Option>
                            {thirdCityOptions}
                          </Select>
                        )}
                      </FormItem>
                      <FormItem {...tailFormItemLayout}>
                        {getFieldDecorator('address', {
                          initialValue: (emp1 && emp1.address) || '',
                        })  (
                          <TextArea type="textarea" placeholder="详细地址" autosize={{ minRows: 4, maxRows: 6 }} maxLength="50"/>
                        )}
                      </FormItem>
                    </Row>
                  </Col>
                </Col>
                <Col span={12}>
                  <Col>
                    <FormItem
                      {...formItemLayout}
                      label="人员编号："
                    >
                      {getFieldDecorator('emlcode', {
                        initialValue: (emp1 && emp1.emplCode) || '',
                      })(
                        <div className='emplCode'>{emp1 && emp1.emplCode}</div>
                      )}
                    </FormItem>
                  </Col>
                  <Col>
                    <FormItem
                      {...formItemLayout}
                      label="性别：">
                      {getFieldDecorator('sex', {
                        initialValue: (emp1 && emp1.gender+'') || '',
                        rules: [{ required: true, message: '请选择性别!' },{ validator: this.checkPassword, }],
                      })(
                        <RadioGroup onChange={this.onChange} >
                          <Radio value={'111'}>男</Radio>
                          <Radio value={'112'}>女</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                  <Col>
                    <FormItem
                      {...formItemLayout}
                      label="岗位：">
                      {getFieldDecorator('position', {
                        initialValue: (emp1 && emp1.postId) || '请选择',
                        rules: [{ required: true, message: '请选择岗位!' },{ validator: this.checkPassword, }],
                      })(
                        <Select  onChange={handleChange} >
                          <Option value="请选择">请选择</Option>
                          {yd.length&&yd}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col>
                    <FormItem
                      {...formItemLayout}
                      label="联系方式：">
                      {getFieldDecorator('phone', {
                        initialValue: (emp1 && emp1.mobile) || '',
                        rules: [{ required: true, message: '请输入手机号!' },{ validator: this.checkPhone, }],
                      })(
                        <Input placeholder="" maxLength="11"/>
                      )}
                    </FormItem>
                  </Col>
                  <Col>
                    <FormItem
                      {...formItemLayout}
                      label="身份证："
                    >
                      {getFieldDecorator('idCard', {
                        initialValue: (emp1 && emp1.idCard) || '',
                      })(
                        <Input placeholder="" maxLength={'18'}/>
                      )}
                      {
                        this.state.showTip&&
                        <p className='tip'>请输入正确的身份证号码</p>
                      }
                    </FormItem>
                  </Col>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal>
      }

      </div>
    );
  }
}

export default Form.create()(ImportModal);

