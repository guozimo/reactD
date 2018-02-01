import React, { PropTypes } from 'react';
import { Form, Input, Modal, Row, Col, Tree, Card, Table, Button, message } from 'antd';
import { codeToString, codeToArray } from '../../../utils';

const Search = Input.Search;
const TreeNode = Tree.TreeNode;

message.config({
  top: 300,
  duration: 2,
});
const modal = ({
     loading,
     visible,
     onOk,
     onCancel,
     title,
     dataTree,
     onSelectMenu,
     onCheck,
     dataSource,
     onPageChange,
     chooseGoodsCode,
     cacheGoodsCodes,
     detailList,
     onDeleteGoods,
     onSelectGoods,
     onGoodsSearch,
     paginationGoods,
     form: {
       validateFields,
     },
   }) => {
  // 求chooseGoodsCode跟cacheGoodsCodes的差值，如果差值数组的长度大于1，那么表示物资选择有变化
  const differenceCodes = chooseGoodsCode.concat(cacheGoodsCodes).filter(v => !chooseGoodsCode.includes(v) || !cacheGoodsCodes.includes(v));
  function handleOk() {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      onOk();
    });
  }

  const footerHtml = (<span><Button key="back" size="large" onClick={onCancel}>取消</Button>
    <Button key="submit" type="primary" size="large" disabled={differenceCodes.length === 0} onClick={handleOk}>选定</Button></span>);

  const modalOpts = {
    width: 1000,
    title,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading,
    footer: footerHtml,
  }
  const loop = data => data.map((item) => {
    if (item.children && item.children.length) {
      return <TreeNode key={item.id} title={item.name}>{loop(item.children)}</TreeNode>;
    }
    return <TreeNode key={item.id} title={item.name}/>;
  });


  const columns = [
    {
      title: '物资编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
    }, {
      title: '物资名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
    }, {
      title: '规格型号',
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
    }, {
      title: '标准单位',
      dataIndex: 'unitName',
      key: 'unitName',
    }, {
      title: '辅助单位',
      dataIndex: 'dualUnitName',
      key: 'dualUnitName',
    }, {
      title: '订货单位',
      dataIndex: 'purcUnitName',
      key: 'purcUnitName',
    }, {
      title: '库存数量',
      dataIndex: 'wareQty',
      key: 'wareQty',
    },
  ];
  // rowSelection object indicates the need for row selection

  // detailList抽取物资代码数组
  const detailGoodsCodesArray = [];
  const tempDetailList = detailList.filter((item) => {
    let returnFlag = false;
    if (item && item.goodsCode) {
      returnFlag = true;
    }
    return returnFlag;
  });
  tempDetailList.map((item) => {
    detailGoodsCodesArray.push(item.goodsCode);
    return false;
  });
  const rowSelection = {
    selectedRowKeys: chooseGoodsCode,
    type: 'checkbox',
    onSelect: (record, selected, selectedRows) => {
      if (!selected) {
        onDeleteGoods(record.id);
      } else {
        const dataArray = [];
        dataArray.push(record);
        const goodsSearch = {
          selectedCodes: codeToArray(dataArray, 'id'),
          selectedGoods: dataArray,
        };
        onSelectGoods(goodsSearch);
      }
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      if (!selected) {
        onDeleteGoods(codeToString(changeRows, 'id'));
      } else {
        const goodsSearch = {
          selectedCodes: codeToArray(changeRows, 'id'),
          selectedGoods: changeRows,
        };
        onSelectGoods(goodsSearch);
      }
    },
    getCheckboxProps: record => ({
      disabled: detailGoodsCodesArray.indexOf(record.goodsCode) >= 0,
    }),
  };

  return (
    <Modal {...modalOpts}
     className="choose-goods-modal">
      <Search
        placeholder="请填写物资名称或编码"
        className="goods-search"
        onSearch={onGoodsSearch}
      />
      <div className="components-modal">
        <Row gutter={16}>
          <Col span={6}>
            <Card title="物资类别">
              <Tree
                onSelect={onSelectMenu}
                onCheck={onCheck}
              >
                {loop(dataTree)}
              </Tree>
            </Card>
          </Col>
          <Col span={18}>
            <div>
              <Table
                size="small"
                className="table"
                rowSelection={rowSelection}
                bordered
                type="radio"
                columns={columns}
                dataSource={dataSource}
                pagination={paginationGoods}
                onChange={onPageChange}
                rowKey={record => record.id}
              />
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  )
}

modal.propTypes = {
  visible: PropTypes.bool,
  form: PropTypes.object,
  item: PropTypes.object,
  goodsChoose: PropTypes.object,
  dataSource: PropTypes.array,
  title: PropTypes.string,
  dataTree: PropTypes.array,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  onSelectMenu: PropTypes.func,
  onCheck: PropTypes.func,
  onPageChange: PropTypes.func,
  loading: PropTypes.bool,
  paginationGoods: PropTypes.object,
}

export default Form.create()(modal)
