import React, { PropTypes } from 'react';
import moment from 'moment';
import { Table, Tag, Popconfirm } from 'antd';
import INVENTORY_PERMISSION from '../../common/Permission/inventoryPermission';
import Permission from '../../common/Permission/Permission.jsx';

const list = ({
  loading,
  storeId,
  dataList,
  monthDate,
  pagination,
  onPageChange,
  onPageSizeChange,
  onView, // 查看
  onEdit, // 调单
  onDelete, // 删除
  onReverse, // 反审核
  onExport, // 导出
}) => {
  const columns = [{
    title: '单据号',
    dataIndex: 'billNo',
    key: 'billNo',
  }, {
    title: '单据类型',
    dataIndex: 'billType',
    key: 'billType',
    render: (text) => {
      let billType = '';
      switch (text) {
        case 911:
          billType = '订货入库单';
          break;
        case 912:
          billType = '采购入库单';
          break;
        case 913:
          billType = '盘盈入库单';
          break;
        case 914:
          billType = '其他入库单';
          break;
        case 921:
          billType = '调拨入库单';
          break;
        case 923:
          billType = '自采入库单';
          break;
        default:
          break;
      }
      return billType;
    },
  }, {
    title: '供应商名称',
    dataIndex: 'busiName',
    key: 'busiName',
  }, {
    title: '仓库名称',
    dataIndex: 'depotName',
    key: 'depotName',
  }, {
    title: '单据日期',
    dataIndex: 'createTime',
    key: 'createTime',
  }, {
    title: '入库日期',
    dataIndex: 'bussDate',
    key: 'bussDate',
  }, {
    title: '税前金额',
    dataIndex: 'totalAmtNotax',
    key: 'totalAmtNotax',
  }, {
    title: '税后金额',
    dataIndex: 'totalAmt',
    key: 'totalAmt',
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      let statusTxt = '';
      if (text === 961) {
        statusTxt = <Tag color="#999">未完成</Tag>;
      } else if (text === 962) {
        statusTxt = <Tag color="green">已完成</Tag>;
      }
      return statusTxt;
    },
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <Permission path={INVENTORY_PERMISSION.OFFICIAL_IN.VIEW}>
          <a onClick={() => onView(record.id)} >查看<span className="ant-divider" /></a>
        </Permission>
        {record.status === 961 && <Permission path={INVENTORY_PERMISSION.OFFICIAL_IN.EDIT}>
          <a  onClick={() => onEdit(record.id)}>编辑<span className="ant-divider" /></a>
        </Permission>}
        {record.status === 961 && <Permission path={INVENTORY_PERMISSION.OFFICIAL_IN.DELETE}>
          <Popconfirm title="确定要删除吗?"
          onConfirm={() => onDelete(record.id)}><a>删除<span className="ant-divider" /></a></Popconfirm>
        </Permission>}
        {record.status === 962 && (record.billType === 911 || record.billType === 912 || record.billType === 914 || record.billType === 923)
          && moment(record.bussDate).isSameOrAfter(moment(monthDate)) && <Permission path={INVENTORY_PERMISSION.OFFICIAL_IN.ANTI_VERIFY}>
          <a onClick={() => onReverse(record.id)}>反审核<span className="ant-divider" /></a>
        </Permission>}
        <Permission path={INVENTORY_PERMISSION.OFFICIAL_IN.EXPORT}><a  onClick={() => onExport(record.id, 1)}>导出</a></Permission>
      </span>
    ),
  }];
  return (
    <div >
      {storeId &&
        <div>
          <Table
            columns={columns}
            loading={loading}
            dataSource={dataList}
            pagination={pagination}
            onChange={onPageChange}
            onShowSizeChange={onPageSizeChange}
            rowKey={record => record.id}
            scroll={{ x: 1200 }}
          />
        </div>
      }
      {!storeId && <div className="page-no-shop icon-mg-t"></div>}
    </div>
  )
}

list.propTypes={
  loading: PropTypes.bool,
  storeId: PropTypes.string,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  onDetails: PropTypes.func,
}
export default list
