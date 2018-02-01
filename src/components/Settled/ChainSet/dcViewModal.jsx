import React, { PropTypes } from 'react'
import { Table, Popconfirm, Menu, Row, Col, Tree, Modal, Button } from 'antd'
const TreeNode = Tree.TreeNode;
function dcViewModal({
  dispatch,
  dcView,
  visible,
  provinceList,
  cityList,
  districtList,
}){
  const onCancel = () => {
    dispatch({
      type: 'chainSet/hideModal',
    });
  }
	return(<div style={{ marginTop: 20 }}>
      <Modal
        title="查看配送中心"
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
                机构名称：
              </Col>
              <Col span={15} offset={1}>
                {dcView && dcView.name}
              </Col>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <Col span={8} style={{ textAlign: 'right' }}>
                机构编号：
              </Col>
              <Col span={15} offset={1}>
                {dcView && dcView.orgCode}
              </Col>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <Col span={8} style={{ textAlign: 'right' }}>
                机构类型：
              </Col>
              <Col span={15} offset={1}>
                配送中心
              </Col>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <Col span={8} style={{ textAlign: 'right' }}>
                上级机构：
              </Col>
              <Col span={15} offset={1}>
                { dcView && dcView.parentName }
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row style={{ paddingBottom: '10px' }}>
              <Col span={8} style={{ textAlign: 'right' }}>
                联系人：
              </Col>
              <Col span={15} offset={1}>
                { dcView && dcView.contactMan }
              </Col>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <Col span={8} style={{ textAlign: 'right' }}>
                联系方式：
              </Col>
              <Col span={15} offset={1}>
                { dcView && dcView.contactNumber }
              </Col>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <Col span={8} style={{ textAlign: 'right' }}>
                投诉电话：
              </Col>
              <Col span={15} offset={1}>
                { dcView && dcView.comptel }
              </Col>
            </Row>
            <Row style={{ paddingBottom: '10px' }}>
              <Col span={8} style={{ textAlign: 'right' }}>
                配送中心地址：
              </Col>
              <Col span={15} offset={1}>
                { dcView && dcView.ppp + ' ' + dcView.ccc + ' ' + dcView.ddd + ' ' +  dcView.address}
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
	</div>)
}
export default dcViewModal;