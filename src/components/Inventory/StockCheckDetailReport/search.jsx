import React, { PropTypes } from 'react';
import { Breadcrumb, Form, Select, Button, TreeSelect, DatePicker, Input } from 'antd';
import moment from 'moment';

const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

const Search = ({
  storeId,  // 门店id
  changeStore, // 改变门店
  storeList, // 机构列表
  exportRequisition, // 导出表格
  filterDataRange, // 起始时间
  changeFilterDataRange, // 修改时间
  goodsName, // 物品名称
  changeGoodsName, // 改变物品名称
  depotId, // 仓库id
  changeDepotId, // 修改仓库
  depotListAll, // 仓库列表
  searchTree, // 类别树
  onTreeChange, // 修改分类
  filterRequisition, // 搜素按钮
  form: {
    getFieldDecorator, // 用于和表单进行双向绑定
  },
}) => {
  // 机构名称列表
  const storeOptions = storeList.length && storeList.map(
    store => <Option value={store.id} key={store.id}>{store.name}</Option>,
  );
  // 仓库列表
  const depotOptions = depotListAll.length && depotListAll.map(
    store => <Option value={store.id} key={store.id}>{store.depotName}</Option>,
  );
  // 类别:递归函数loop：类别里套类别
  const loop = data => data.length && data.map((item) => {
    if (item.children && item.children.length) {
      return <TreeNode key={item.id} value={item.id} title={item.name}>{loop(item.children)}</TreeNode>;
    }
    return <TreeNode key={item.id} value={item.id} title={item.name} />;
  });
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>盘存明细表</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form layout="inline" >
          <FormItem label="机构名称">
            {getFieldDecorator('shopName', {
              initialValue: storeId || '请选择机构名称',
            })(
              <Select
                style={{ width: 160 }}
                onChange={changeStore}
              >
                {storeOptions}
              </Select>)}
          </FormItem>
        </Form>
        {storeId &&
          <div className="right-act">
            <Button type="primary" icon="plus" onClick={exportRequisition}>导出表格</Button>
          </div>
        }
      </div>
      <Form layout="inline" style={!storeId ? { display: 'none' } : {}}>
        <FormItem label="物品名称">
          <Input style={{ width: 160 }} value={goodsName} onChange={changeGoodsName} placeholder="请输入编码或名称" />
        </FormItem>
        <FormItem label="仓库">
          <Select style={{ width: 160 }} value={depotId} onChange={changeDepotId} placeholder="请选择仓库">
            <Option value="" key="">请选择仓库</Option>
            {depotOptions}
          </Select>
        </FormItem>
        <FormItem label="类别">
          <TreeSelect
            style={{ width: 160 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            showCheckedStrategy={TreeSelect.SHOW_ALL} // 定义选中项回填的方式
            defaultValue="请选择类别"
            // allowClear // 显示清除按钮
            treeDefaultExpandAll // 默认展开所有树节点
            onChange={onTreeChange}
          >
            <TreeNode value="" key="" title="请选择类别" />
            {loop(searchTree)}
          </TreeSelect>
        </FormItem>
        <FormItem label="盘点日期">
          <RangePicker
            format="YYYY-MM-DD"
            value={filterDataRange}
            allowClear={false}
            onChange={changeFilterDataRange}
            renderExtraFooter={() => // 在面板中添加额外的页脚
              <div style={{ textAlign: 'center', color: '#bfbfbf' }}>
                请点选两个时间以确定一个时间范围
              </div>
            }
            // ranges={{ // 预设时间范围快捷选择
            //   '今日': [moment(), moment()],
            //   '前三天': [moment().subtract(3, 'day'), moment()],
            //   '后三天': [moment(), moment().add(3, 'day')],
            //
            //   '本周前': [moment().startOf('week'), moment()],
            //   '本周后': [moment(), moment().endOf('week')],
            //   '本周内': [moment().startOf('week'), moment().endOf('week')],
            //   '近一周': [moment().subtract(1, 'week'), moment()],
            //   '后一周': [moment(), moment().add(1, 'week')],
            //
            //   '本月前': [moment().startOf('month'), moment()],
            //   '本月后': [moment(), moment().endOf('month')],
            //   '本月内': [moment().startOf('month'), moment().endOf('month')],
            //   '近一月': [moment().subtract(1, 'month'), moment()],
            //   '后一月': [moment(), moment().endOf('month')],
            //
            //   '本年前': [moment().startOf('year'), moment()],
            //   '本年后': [moment(), moment().endOf('year')],
            //   '今年内': [moment().startOf('year'), moment().endOf('year')],
            //   '近一年': [moment().subtract(1, 'year'), moment()],
            //   '后一年': [moment(), moment().endOf('year')],
            //
            //   '过去年内': [moment().subtract(6, 'month'), moment()],
            //   '未来年内': [moment(), moment().endOf('year')],
            // }}
          />
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={filterRequisition}>
            搜索
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};
Search.PropTypes = {
  filterDataRange: PropTypes.array,
  storeId: PropTypes.string,
  changeStore: PropTypes.func,
  changeFilterDataRange: PropTypes.func,
  goodsName: PropTypes.string,
  changeGoodsName: PropTypes.func,
  onTreeChange: PropTypes.func,
  filterRequisition: PropTypes.func,
};
// export default RequisitionSearch;
export default Form.create()(Search);
