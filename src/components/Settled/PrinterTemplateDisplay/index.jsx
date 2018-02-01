import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Select, Form, } from 'antd'
import './index.less';
import { Link } from 'dva/router';

const FormItem = Form.Item;
const Option = Select.Option;

class PrinterTemplateDisplay extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    initData: PropTypes.object,
    loading: PropTypes.bool,
  };
  handleChange = (value) => {
    window.localStorage.setItem('storeId',value);
    this.props.dispatch({
      type: 'PrinterTemplateDisplay/getData',
    });
  };

  render() {
    const { initData, storeList, storeId, } = this.props;
    return (
      <div className="display-form">
        <Row>
          <Col span={6} className="col-left" >门店名称：</Col>
          <Col span={8} >
            <Select value={storeId} placeholder="请选择" onChange={this.handleChange}    style={{width:150}}>
              {
                storeList.map((data) => {
                    return <Option value={data.id} key={data.id} >{data.name}</Option>;
                  })
                }
            </Select>
          </Col>
        </Row>

        <Row>
          <Col span={6} className="col-left" >小票尾图片：</Col>
          <Col span={8} >
            {initData.printImage && <img src={initData.printImage}  className="brandLogo"/>}
            {!initData.printImage && <div className="brandLogoDiv">暂无图片</div>}
          </Col>
        </Row>

        <Row style={{marginTop: 10}}>
          <Col span={6} className="col-left" >小票尾说明：</Col>
          {initData.printExplain  &&<Col span={10} >
            {initData.printExplain}
          </Col>}
          {!initData.printExplain  &&<Col span={10} >暂无说明</Col>}
        </Row>

        <Row>
          <Col span={6} className="col-left" />
          <Col span={8} >
            <Button type="primary" htmlType="submit" size="large" >
              <Link to="/merchants/PrinterTemplate">修改</Link>
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { initData, storeName, storeList, storeId, } = state.PrinterTemplateDisplay;
  return {
    loading: state.loading.models.PrinterTemplateDisplay,
    initData,
    storeName,
    storeList,
    storeId,
  };
}

export default connect(mapStateToProps)(PrinterTemplateDisplay);


