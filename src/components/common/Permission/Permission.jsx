
import React, { Component } from 'react'
import { connect } from 'dva';
import { has } from 'lodash';

class Permission extends Component {
  constructor(props) {
    super(props);
    this.isExistType = this.isExistType.bind(this);
  }

  isExistType() {
    const currPermmissionItem = this.props.path;
    const sysPermmission = this.props.userPermissionData;
    return has(sysPermmission.list, currPermmissionItem.code);
  }
  render() {
    const isexist = this.isExistType();
    if (isexist) {
      return (
        <span
          style={Object.assign({
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'inline-block',
          }, this.props.style)}
        >
          {this.props.children}
        </span>
      );
    }
    return (
      <span
        style={{
          borderBottom: '1px solid #f5f5f5',
          display: 'inline-block',
        }}
      >
        {this.props.someElse}
      </span>
    );
  }
}
const propertys = state => ({ userPermissionData: state.merchantApp.menuData });

Permission = connect(propertys)(Permission);

module.exports = Permission;
