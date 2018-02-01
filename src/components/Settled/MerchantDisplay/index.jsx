import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Spin ,Alert } from 'antd'
import './index.less';
import { Link } from 'dva/router';
class MerchantDisplay extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    initData: PropTypes.object,
    provinceList: PropTypes.array,
    cityList: PropTypes.array,
    areaList: PropTypes.array,
    loading: PropTypes.bool,
  };

  render() {
    const { initData, provinceList, cityList, areaList, loading, authority } = this.props;
    return (
      <Spin spinning={loading}>
      { authority.authority == '2'&&<Alert
        message="【诺果云】您的注册信息已提交至后台,审核通过后会短信通知到您(18点前提交当日审核,18点后提交次日审核),请您注意查收。感谢您使用诺果云服务！"
        type="error"
        showIcon
        style={{fontWeight:"700"}}
      />}

      <div className="display-form">
        <Row>
          <Col span={6} className="col-left" >商户名称：</Col>
          <Col span={8} >{initData.tenAlias}</Col>
        </Row>

        <Row>
          <Col span={6} className="col-left" >品牌名称：</Col>
          <Col span={8} >{initData.braName}</Col>
        </Row>

        {/*<Row>
          <Col span={6} className="col-left" >品牌logo：</Col>
          <Col span={8} >
            <img src={initData.braLogo}  className="brandLogo"/>
          </Col>
        </Row>*/}
        <Row>
          <Col span={6} className="col-left" >门店数量：</Col>
          <Col span={8} >{initData.storeNum}</Col>
        </Row>
        {/*<Row>
          <Col span={6} className="col-left" >业态选择：</Col>
          <Col span={8} >{initData.formatName}</Col>
        </Row>*/}
        <Row>
          <Col span={6} className="col-left" >商户地址：</Col>
          <Col span={8} >
            {
              provinceList && provinceList.map((data) => {
                return data.id === String(initData.tenProvince) ? <span key="province" className="local">{data.areaName}</span> : null
              })
            }
            {
              cityList && cityList.map((data) => {
                return data.id === String(initData.tenCity) ? <span key="city" className="local">{data.areaName}</span> : null
              })
            }
            {
              areaList && areaList.map((data) => {
                return data.id === String(initData.tenDistrict) ? <span key="area" className="local">{data.areaName}</span> : null
              })
            }
          </Col>
        </Row>

        <Row style={{marginTop: 10}}>
          <Col span={6} className="col-left" />
          <Col span={10} >
            {initData.tenAddress}
          </Col>
        </Row>

        <Row>
          <Col span={6} className="col-left" >联系人：</Col>
          <Col span={8} >{initData.tenLinkman}</Col>
        </Row>

        <Row>
          <Col span={6} className="col-left" >联系方式：</Col>
          <Col span={8} >{initData.tenTel}</Col>
        </Row>

        <Row>
          <Col span={6} className="col-left" >电子邮箱：</Col>
          <Col span={8} >{initData.tenMail}</Col>
        </Row>

        <Row>
          <Col span={6} className="col-left" />
          <Col span={8} >
            <Button type="primary" htmlType="submit" size="large" >
              <Link to="/merchants/merchantsInfo/edit">修改</Link>
            </Button>
          </Col>
        </Row>
      </div>
      </Spin>
    );
  }
}

function mapStateToProps(state) {
  const { initData, provinceList, cityList, areaList, authority } = state.MerchantDisplay;
  return {
    loading: state.loading.models.MerchantDisplay,
    initData,
    provinceList,
    cityList,
    areaList,
    authority,
  };
}

export default connect(mapStateToProps)(MerchantDisplay);


