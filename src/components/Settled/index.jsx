import React, { PropTypes, Component } from 'react';
import { Form, Input, Select, Row, Col,Modal, Checkbox, Button, message } from 'antd';
import Countdown from '../../components/common/CountDown';
import * as merchantSettled from '../../services/settled/settled';
import { hex_md5 } from '../../utils/md5';
const FormItem = Form.Item;


class RegistrationForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    codeBtnStatus: PropTypes.bool,
    submitBtnLoading: PropTypes.bool,
    endTime: PropTypes.number,
    form: PropTypes.object,
  };

  constructor(props){
    super(props);

    this.state = {
      allowSubmit: false,
      confirmDirty: false,
      visible: false
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  clickCode = () => {
    const { getFieldValue, getFieldError } = this.props.form;
    const phoneNum = getFieldValue('mobile');
    const error = getFieldError('mobile');

    if (error) {
      message.warning(error[0]);
      return;
    }

    if (!phoneNum) {
      message.warning('请先输入手机号');
      return;
    }

    this.props.dispatch({
      type: 'merchantSettled/send',
      phoneNum,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values.confirmPass = hex_md5(values.confirmPass);
        values.userPass = hex_md5(values.userPass);
        this.props.dispatch({
          type: 'merchantSettled/submit',
          values,
        });
      }
    });
  };

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('userPass')) {
      callback('您输入的两个密码不一致!');
    } else {
      callback();
    }
  };

  checkPhone = (rule, value, callback) => {
    if (value) {
      if (!(/^1[34578]\d{9}$/.test(value))) {
        callback('请输入正确的手机格式!');
      } else {
        merchantSettled.verify({
          mobile: value,
        }).then(({ data }) => {
          if (!data.success) {
            callback('手机号已被注册');
          } else {
            callback();
          }
        });
      }
    } else {
      callback();
    }
  };

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmPass'], { force: true });
    }
    callback();
  };

  onChangeAgreement = (e) => {
    const { checked } = e.target;

    this.setState({
      allowSubmit: checked
    });
  };

  resetStatus = () => {
    this.props.dispatch({
      type: 'merchantSettled/codeBtnEnable',
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
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

    return (
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 50 }}>
        <FormItem
          {...formItemLayout}
          label="手机号"
        >
          {getFieldDecorator('mobile', {
            rules: [{ required: true, message: '请输入手机号码'
            }, {
                validator: this.checkPhone,
              }],
           })(
            <Input addonBefore={prefixSelector} maxLength="11" placeholder="请输入手机号"  />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="手机验证码"
          extra=""
        >
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('registerCode', {
                rules: [{ required: true, message: '请输入您收到的验证码!' }],
              })(
                <Input size="large" placeholder="请输入验证码" maxLength={'6'}/>
              )}
            </Col>
            <Col span={12}>
              <Button size="large" onClick={this.clickCode} disabled={this.props.codeBtnStatus} >
                 { this.props.codeBtnStatus ?
                  (<Countdown endDate={ this.props.endTime }
                              format={'ss秒'}
                              onFinished={ this.resetStatus }
                  />) : '获取验证码' }
              </Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="登录密码"
          hasFeedback
        >
          {getFieldDecorator('userPass', {
            rules: [{
              required: true, message: '请输入登录密码!',
              pattern: /^[0-9a-zA-Z]{6,16}$/, message: '6到16个字符，大小写字母和数字构成，不能有其他字符'
            }, {
              validator: this.checkConfirm,
            }],
          })(
            <Input type="password" maxLength={'16'} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="密码确认"
          hasFeedback
        >
          {getFieldDecorator('confirmPass', {
            rules: [{
              required: true, message: '请输入确认密码!',
              pattern: /^[0-9a-zA-Z]{6,16}$/, message: '6到16个字符，大小写字母和数字构成，不能有其他字符'
            }, {
              validator: this.checkPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} maxLength={'16'}/>
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
          <Checkbox onChange={this.onChangeAgreement}>我同意诺果云服务</Checkbox>
          <a onClick={this.showModal} style={{marginLeft:-8,paddingRight:10}}>协议</a>
          <Modal title="用户注册协议" style={{fontSize:20}}  visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} >
            <div className="height-anto">
              <p className="title-size" style={{textIndent:20}}>本服务协议是北京辰森世纪科技股份有限公司 (以下简称“辰森”)与您就辰森诺果云餐饮管理系统服务（以下简称“服务”）的相关事项所订立的有效合约。您通过盖章、网络页面点击确认或以其他方式选择接受本服务协议，包括但不限于未点击确认本服务协议而事实上使用了辰森诺果云餐饮管理系统服务，即表示您与辰森已达成协议并同意接受本服务协议的全部约定内容。</p>
              <p className="title-size" style={{textIndent:20}}>关于本服务协议，提示您特别关注限制、免责条款，辰森对您违规、违约行为的认定处理条款，以及管辖法院的选择条款等。限制、免责条款可能以加粗或加下划线形式提示您注意。在接受本服务协议之前，请您仔细阅读本服务协议的全部内容。如果您对本服务协议的条款有疑问的，请通过辰森相关业务部门进行询问，辰森将向您解释条款内容。如果您不同意本服务协议的任意内容，或者无法准确理解辰森对条款的解释，请不要进行后续操作。</p>
              <p className="title-size" >一、总则</p>
              <p>1.1 辰森诺果云餐饮管理系统（以下简称诺果云），系指由辰森通过www.choicesaas.cn 网站提供的供餐饮企业按时长使用的餐饮管理软件及网络技术服务系统，其所有权和运营权归北京辰森世纪科技股份有限公司所有。</p>
              <p>1.2 本协议可由辰森根据最新政策及服务的变化而随时进行更新，用户应当及时关注。本站的通知、公告、声明或其它类似内容是本协议的组成部分。</p>
              <p className="title-size">1.3 在执行本协议过程中如发生纠纷，双方应及时协商解决。协商不成时，任何一方可直接向北京市朝阳区人民法院提起诉讼。</p>
              <p className="title-size">二、用户帐号</p>
              <p>2.1 经本站注册系统完成注册程序并通过身份认证的用户即成为正式用户，可以获得本站规定用户所应享有的一切权限；未经认证仅享有本站规定的部分会员权限。辰森有权对会员的权限设计进行变更。</p>
              <p className="title-size">2.2 用户只能按照注册要求使用合法真实有效证件进行注册。用户有义务保证密码和帐号的安全，用户利用该密码和帐号进行的一切活动所引起的任何损失或损害，由用户自行承担全部责任，本站不承担任何责任。</p>
              <p>2.3 如用户发现帐号遭到未授权的使用或发生其他任何安全问题，应立即修改帐号密码并妥善保管，如有必要，请通知辰森。因黑客行为或用户的保管疏忽等非辰森行为导致的帐号非法使用，辰森不承担任何责任。</p>
              <p className="title-size" >三、服务内容</p>
              <p>3.1 本协议中“服务”指：辰森向您提供的诺果云服务及相关的软件和网络技术服务，该服务同时需要您购买配套设备予以配合使用。</p>
              <p>3.2 配套设备为服务所必须具备的硬件，由您通过辰森指定的渠道购买并经辰森认证激活后方可使用。</p>
              <p>3.3 乙方按照本协议的相关约定向您提供服务，提供的服务以您在签署本协议时确认的服务内容或您与辰森达成的线下协议约定的内容为准。</p>
              <p className="title-size" >四、服务费用</p>
              <p>4.1 服务费用将在您签署的线下服务合同中显示，您应按线下服务合同所列明的价格及付款方式予以支付。若双方没有签署线下协议的，则您应支付的服务费用以您签署协议时确认的线上订单显示的价款为准。</p>
              <p>4.2 服务期满双方愿意继续合作的，您至少应在服务期满前7天内支付续费款项，以使服务得以继续进行。如续费时辰森对产品体系、名称或价格进行调整的，双方同意按照届时有效的新的系统、名称或价格履行。</p>
              <p>4.3 辰森保留在您未按照约定支付全部费用之前不向您提供服务和/或技术支持，或者终止服务和/或技术支持的权利。</p>
              <p className="title-size" >五、权利义务</p>
              <p className="title-size">5.1 您的权利、义务</p>
              <p className="title-size">5.1.1 您同意遵守本服务协议以及服务展示页面的相关管理规范及流程。您了解上述协议及规范等的内容可能会不时发生变更。如本服务协议的任何内容发生变动，辰森应提前30天在www.choicesaas.cn 网站的适当版面公告向您做协议版本修改提示。如您不同意辰森对本服务协议相关条款所做的修改，您有权停止使用服务，此等情况下，辰森应与您进行服务费结算（如有），并且您应将业务数据自行备份。如您继续使用辰森服务，则视为您接受辰森对本服务协议相关条款所做的修改。</p>
              <p>5.1.2 您应按照线下服务合同或本服务协议的约定支付相应服务费用。</p>
              <p>5.1.3 您承诺：</p>
              <p>5.1.3.1 如果您利用辰森提供的服务进行经营或非经营的活动需要获得国家有关部门的许可或批准的，应获得该有关的许可或批准。</p>
              <p>5.1.3.2 除辰森明示许可外，您不得将辰森提供的服务或软件进行出租、出借、销售、转让、非存档目的的拷贝或通过提供分许可、转许可、信息网络等形式供其他任何第三人（包括其关联公司）利用/使用；不得对辰森服务中所包含的软件进行全部或部分地翻译、分解、修改、编译、反编译、汇编、反汇编、反向工程或其他试图从辰森软件导出程序源代码的行为；不破坏、不绕开辰森服务及软件的加密措施或修改其加密信息。</p>
              <p>5.1.3.3 若辰森的服务涉及第三方软件之许可使用的，您同意遵守相关的许可协议的约束；</p>
              <p>5.1.3.4 不利用辰森提供的服务从事反动、暴力、色情、赌博、贩毒等违反法律法规及相关规章制度的行为，不利用辰森提供的服务从事违法犯罪活动或侵害他人合法权益的行为。</p>
              <p>5.1.3.5 不得不合理占用诺果云服务资源，导致诺果云服务中断、宕机或出现其他无法访问的情况；</p>
              <p>5.1.3.6 不进行任何破坏或试图破坏网络安全的行为（包括但不限于钓鱼，黑客，网络诈骗，网站或空间中含有或涉嫌散播：病毒、木马、恶意代码，及通过虚拟服务器对其他网站、服务器进行涉嫌攻击行为如扫描、嗅探、ARP欺骗、DOS等）；</p>
              <p>5.1.3.7 不进行任何改变或试图改变辰森提供的系统配置或破坏系统安全的行为；</p>
              <p>5.1.3.8 如辰森发现您违反上述条款的约定，有权根据情况采取相应的处理措施，包括但不限于立即终止服务、中止服务或删除相应信息等。</p>
              <p className="title-size" >5.1.4 您对自己存放在诺果云系统上的数据以及进入和管理诺果云系统上各类产品与服务的口令、密码的完整性和保密性负责。因您维护不当或保密不当致使上述数据、口令、密码等丢失或泄漏所引起的一切损失和后果均由您自行承担。</p>
              <p>5.1.5 您应向辰森提交执行本服务条款的联系人和管理用户网络及云平台上各类产品与服务的人员名单和联系方式并提供必要的协助。如以上人员发生变动，您应自行将变动后的信息进行在线更新并及时通知辰森。因您提供的人员的信息不真实、不准确、不完整，以及因以上人员的行为或不作为而产生的结果，均由您负责。</p>
              <p>5.1.6 您对您存放在诺果云系统上的数据内容负责，如因上传的公开信息违反法律法规、部门规章或国家政策，由此造成的全部结果及责任由您自行承担。</p>
              <p>5.1.7 为保证购买的服务正常使用，甲方选择通过乙方购买配合辰森诺果云软件系统使用的硬件产品；硬件产品的交付时间应预留充足的备货时间，若因生产厂家延迟导致的交货延误，甲方同意不追究乙方责任。乙方向甲方交付硬件产品的方式包括邮寄、送货上门等方式，具体按照双方在线下《服务合同》约定的交付方式为准。甲方收货后，应向乙方出具收货单并应在收货后2个工作日内验货，超过2个工作日未提出异议的，视为验收合格。</p>
              <p className="title-size">5.1.8 您了解辰森无法保证其所提供的服务毫无瑕疵，但辰森承诺不断提升服务质量及服务水平。所以您同意：即使辰森提供的服务存在瑕疵，但上述瑕疵是当时行业技术水平所无法避免的，其将不被视为辰森违约。您同意和辰森一同合作解决上述瑕疵问题。</p>
              <p className="title-size">5.2 辰森的权利、义务</p>
              <p>5.2.1 辰森应按照服务条款约定提供服务。</p>
              <p>5.2.2 辰森为付费用户提供售后电话咨询服务，解答用户在使用中的问题。</p>
              <p>5.2.3 辰森将消除您非人为操作所出现的故障，但因您原因和/或不可抗力以及非辰森控制范围之内的事项除外。</p>
              <p>5.2.4 设备的产品质量问题，如经检验确认后，由辰森负责协调生产厂商维修或换货。硬件产品的质保期以厂家承诺的为准。</p>
              <p className="title-size" >六、用户数据的保存、销毁与下载</p>
              <p>6.1 您存放在诺果云上的数据，除执行您的服务指令外，不进行任何未获授权的使用及披露，除非：</p>
              <p>6.1.1 根据法律的有关规定、行政或司法等机构的要求，向第三方或者行政、司法等机构披露；</p>
              <p>6.1.2 您和辰森另行协商一致的；</p>
              <p>6.1.3 如果您出现违反中国有关法律法规的情况，需要向第三方披露；</p>
              <p>6.1.4 为提供您所要求的软件或服务，而必须和第三方分享您数据；但前述披露仅在为您提供服务的必要范围内，且辰森要求第三方承诺，第三方应仅为提供服务目的使用其获得的数据且按照不低于本服务条款的标准对其获得的数据承担保密义务。</p>
              <p className="title-size" >七、知识产权</p>
              <p>7.1 您应保证提交辰森的素材、对辰森服务的使用及使用辰森服务所产生的成果未侵犯任何第三方的合法权益。如有第三方基于侵犯版权、侵犯第三人之权益或违反中国法律法规或其他适用的法律等原因而向辰森提起索赔、诉讼或可能向其提起诉讼,则您应赔偿辰森因此承担的费用或损失，并使辰森完全免责。</p>
              <p>7.2 如果第三方机构或个人对您使用辰森服务所涉及的相关素材的知识产权归属提出质疑或投诉，您有责任出具相关知识产权证明材料，并配合辰森相关投诉处理工作。</p>
              <p>7.3 您承认辰森向您提供的任何资料、技术或技术支持、软件、服务等的知识产权均属于辰森或第三方所有。除辰森或第三方明示同意外，您无权复制、传播、转让、许可或提供他人使用上述资源，否则应承担相应的责任。</p>
              <p className="title-size" >八、保密条款</p>
              <p>8.1 保密资料指由一方向另一方披露的所有技术及非技术信息(包括但不限于产品资料，产品计划，价格，财务及营销规划，业务战略，客户信息，客户数据，研发资料，软件硬件，应用数据接口，技术说明，设计，特殊公式，特殊算法等)。</p>
              <p>8.2 本服务协议任何一方同意对获悉的对方之上述保密资料予以保密，并严格限制接触上述保密资料的员工遵守本条之保密义务。除非国家机关依法强制要求或上述保密资料已经进入公有领域外，接受保密资料的一方不得对外披露。</p>
              <p>8.3 本服务条款双方明确认可保密资料是双方的重点保密信息并是各自的重要资产，本服务条款双方同意尽最大的努力保护上述保密资料等不被披露。一旦发现有上述保密资料泄露事件，双方应合作采取一切合理措施避免或者减轻损害后果的产生。</p>
              <p>8.4 本条款不因本服务条款的终止而失效。</p>
              <p className="title-size" >九、期限与终止</p>
              <p>9.1 服务期限自辰森开通服务之日起计算，而非以您获得服务的用户身份（包括获取了登录号和密码）为依据。具体服务期限将根据您实际使用情况计算。</p>
              <p>9.2 发生下列情形，服务期限提前终止：</p>
              <p>9.2.1 双方协商一致提前终止的；</p>
              <p>9.2.2 您严重违反本服务协议（包括但不限于：a.您未按照协议约定履行付款义务，及/或b.您严重违反法律规定等），辰森有权提前终止服务，并不退还您已经支付的费用；</p>
              <p>9.2.3 您理解并充分认可，虽然辰森已经建立（并将根据技术的发展不断完善）必要的技术措施来防御包括计算机病毒、网络入侵和攻击破坏等危害网络安全的事项或行为（以下统称该等行为），但鉴于网络安全技术的局限性、相对性以及该等行为的不可预见性，因此如因您遭遇该等行为而给辰森或者辰森诺果云的其他的网络或服务器（包括但不限于本地及外地和国际的网络、服务器等）带来危害，或影响诺果云与国际互联网或者诺果云与特定网络、服务器及诺果云内部的通畅联系，辰森可决定暂停或终止服务，如果终止服务的，将按照实际提供服务月份计算（不足一个月的按一个月计）服务费用，将剩余款项（如有）返还。</p>
              <p>9.2.4 辰森可提前30天在    www.choicesaas.cn 网站上通告或给您发网站内通知或书面通知的方式终止本服务协议。届时辰森应将您已支付但未消费的款项退还至您的预留账户。</p>
              <p className="title-size" >十、违约责任</p>
              <p>10.1 本服务条款任何一方违约均须依法承担违约责任。</p>
              <p>10.2 您理解，鉴于计算机、互联网的特殊性，下述情况不属于辰森违约：</p>
              <p>10.2.1 辰森在进行服务器配置、维护时，需要短时间中断服务；</p>
              <p>10.2.2 由于Internet上的通路阻塞造成您网站访问速度下降。</p>
              <p>10.3 如因辰森原因，造成您连续72小时不能正常使用服务的，您可以终止服务，但非辰森控制之内的原因引起的除外。</p>
              <p>10.4 在任何情况下，辰森均不对任何间接性、后果性、惩戒性、偶然性、特殊性的损害，包括您使用诺果云服务而遭受的利润损失承担责任（即使您已被告知该等损失的可能性）。</p>
              <p>10.5 在任何情况下，辰森对本服务条款所承担的违约赔偿责任总额不超过违约服务对应之服务费总额。</p>
              <p className="title-size" >十一、不可抗力</p>
              <p>11.1 因不可抗力或者其他意外事件，使得本服务条款的履行不可能、不必要或者无意义的，遭受不可抗力、意外事件的一方不承担责任。</p>
              <p>11.2 不可抗力、意外事件是指不能预见、不能克服并不能避免且对一方或双方当事人造成重大影响的客观事件，包括但不限于自然灾害如洪水、地震、瘟疫流行等以及社会事件如战争、动乱、政府行为、电信主干线路中断、黑客、网路堵塞、电信部门技术调整和政府管制等。</p>
              <p className="title-size" >十二、附则</p>
              <p>12.1 辰森在www.choicesaas.cn 网站相关页面上的服务说明、价格说明是本服务条款不可分割的一部分。如果网站相关页面上的服务说明、价格说明与本服务协议有不一致之处，以本服务协议为准。</p>
              <p>12.2 如果任何条款在性质上或其他方面理应地在此协议终止时继续存在，那么应视为继续存在的条款，这些条款包括但不局限于保证条款、保密条款、知识产权条款、法律适用及争议解决条款。</p>
            </div>
          </Modal>
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" disabled={!this.state.allowSubmit} loading={this.props.submitBtnLoading}>提交</Button>
        </FormItem>

      </Form>
    );
  }
}

export default Form.create()(RegistrationForm);


