import React from 'react';
import { Button, Tag, Modal, Table } from 'antd';
import _ from 'lodash';

class SelectorStore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: {
        visible: false,
      },
      selectedValues: this.props.initialValue,
      selectedRows: this.props.initialValue,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.confirmSelected = this.confirmSelected.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.selectRow = this.selectRow.bind(this);
    this.removeOne = this.removeOne.bind(this);
  }
  componentDidMount() {
    // console.log('componentWillMount! selectable', this.props.selectable);
  }

  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps nextProps', nextProps);
    if (nextProps.value) {
      this.setState({ selectedValues: nextProps.value });
      if (!this.state.selectedRows || this.state.selectedRows.length === 0) {
        this.setState({ selectedRows: nextProps.value });
      }
    }
  }

  confirmSelected() {
    console.log('confirmSelected this.state.selectedRows', this.state.selectedRows);
    const selectedValues = this.state.selectedRows.length
      ? this.state.selectedRows.map(item => ({ reposCode: item.reposCode, reposName: item.reposName }))
      : [];
    console.log('confirmSelected selectedValues', selectedValues);
    setTimeout(() => { // 执行动画效果
      this.props.onChange(selectedValues);
    }, 300);
    this.closeModal();
  }

  handleCancel() {
    this.closeModal();
  }
  removeOne(value) {
    // console.log('removeOne value', value);
    const existsIndex = _.findIndex(this.state.selectedRows, item => item.reposCode === value);
    _.pullAt(this.state.selectedRows, existsIndex);
    this.confirmSelected();
  }
  selectRow(record, index) {
    // console.log('record, index', record, index);
    // if (_.includes(this.props.listData.map(data => data.reposCode), record.reposCode)) {
    //   return false; // 存在的话为不可选行，不作响应
    // }
    const existsIndex = _.findIndex(this.state.selectedRows, item => item.reposCode === record.reposCode);
    if (existsIndex < 0) {
      this.state.selectedRows.push(record); // 不存在，添加
    } else {
      _.pullAt(this.state.selectedRows, existsIndex); // 已存在，删除
    }

    this.forceUpdate();
  }

  openModal() {
    // console.log('openModal this.state.selectedValues', this.state.selectedValues);
    // this.state.selectedValues
    if (this.state.selectedValues) {
      this.setState({ selectedRows: _.cloneDeep(this.state.selectedValues) });
    }
    this.state.modal.visible = true;
    this.forceUpdate();
  }

  closeModal() {
    this.state.modal.visible = false;
    this.forceUpdate();
  }

  render() {
    const columns = [
      {
        title: '机构编码',
        dataIndex: 'reposCode',
        key: 'reposCode',
      }, {
        title: '机构名称',
        dataIndex: 'reposName',
        key: 'reposName',
      },
    ];
    // console.log('this.state.selectedValues', JSON.stringify(this.state.selectedValues));
    // console.log('this.state.selectedRows', JSON.stringify(this.state.selectedRows));
    const rowSelection = {
      selectedRowKeys: this.state.selectedRows && this.state.selectedRows.length ? this.state.selectedRows.map(item => item.reposCode) : [],
      onChange: (selectedRowKeys, selectedRows) => {
        this.state.selectedRows = selectedRows;
        this.forceUpdate();
      },
      // getCheckboxProps: record => ({
      //   disabled: _.includes(this.props.listData.map(data => data.reposCode), record.reposCode),    // Column configuration not to be checked
      // }),
    };
    // console.log('rowSelection.selectedRowKeys',rowSelection.selectedRowKeys);
    return (
      <div>
        {
          !this.props.disabled && <Button icon="plus" type="dashed" size="small" onClick={this.openModal} style={{ marginRight: 10 }}>选择门店</Button>
        }
        {
          this.state.selectedValues && this.state.selectedValues.length
          ? this.state.selectedValues.map((item, index) => {
            if (index === this.props.maxSize - 1) { // 超过设置的最大长度值
              return 'a';
            }
            return <Tag key={item.reposCode} closable={!this.props.disabled} onClose={() => this.removeOne(item.reposCode)}>{ item.reposName }</Tag>;
          })
          : null
        }
        <Modal
          title="请选择您需要的门店"
          visible={this.state.modal.visible}
          onOk={this.confirmSelected}
          onCancel={this.handleCancel}
        ><Table
          scroll={{ y: 350 }}
          className="rows-clickable"
          size="small"
          pagination={false}
          rowKey={record => record.reposCode}
          bordered={false}
          columns={columns}
          dataSource={this.props.listData}
          rowSelection={rowSelection}
          onRowClick={this.selectRow}
        />
        </Modal>
      </div>
    );
  }
}

module.exports = SelectorStore;
