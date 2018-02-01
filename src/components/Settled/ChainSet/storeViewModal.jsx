import React, { PropTypes } from 'react'
import { Table, Popconfirm, Menu, Row, Col, Tree, Modal, Button } from 'antd'
const TreeNode = Tree.TreeNode;
function storeViewModal({
  dispatch,
  storeView,
  visible,
}){
  const onCancel = () => {
    dispatch({
      type: 'chainSet/hideModal',
    });
  }
	return(<div style={{ marginTop: 20 }}>
      <Modal
        title="查看门店"
        visible = {visible}
        width={810}
        footer={[
          <Button key="back" size="large" type="primary" onClick={onCancel}>返回</Button>,
        ]}
        onCancel={onCancel}
        maskClosable={false}
      >
        <Row style={{ fontSize: '14px', padding:'10px 0' }}>
          <Col span={12} >
            <Row style={{ paddingBottom: '10px' }}>
              <Col span={8} style={{ textAlign: 'right' }}>
                门店名称：
              </Col>
              <Col span={15} offset={1}>
                {storeView && storeView.name}
              </Col>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <Col span={8} style={{ textAlign: 'right' }}>
                门店编号：
              </Col>
              <Col span={15} offset={1}>
                {storeView && storeView.code}
              </Col>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <Col span={8} style={{ textAlign: 'right' }}>
                欢迎语：
              </Col>
              <Col span={15} offset={1}>
                {storeView && storeView.latestNews}
              </Col>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <Col span={8} style={{ textAlign: 'right' }}>
                备注：
              </Col>
              <Col span={15} offset={1}>
                { storeView && storeView.storeIntroduction }
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row style={{ paddingBottom: '10px' }}>
              <Col span={8} style={{ textAlign: 'right' }}>
                联系人：
              </Col>
              <Col span={15} offset={1}>
                { storeView && storeView.contactMan }
              </Col>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <Col span={8} style={{ textAlign: 'right' }}>
                联系方式：
              </Col>
              <Col span={15} offset={1}>
                { storeView && storeView.contactNumber }
              </Col>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <Col span={8} style={{ textAlign: 'right' }}>
                投诉电话：
              </Col>
              <Col span={15} offset={1}>
                { storeView && storeView.comptel }
              </Col>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <Col span={8} style={{ textAlign: 'right' }}>
                门店地址：
              </Col>
              <Col span={15} offset={1}>
                { storeView && storeView.ppp + ' ' + storeView.ccc + ' ' + storeView.ddd + ' ' +  storeView.address}
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
	</div>)
}
export default storeViewModal;