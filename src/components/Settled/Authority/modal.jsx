import React from 'react';
import { Table, Button, Modal, Col, Row, Input, Popconfirm, Form, Tree, Card } from 'antd';
import { getUserInfo } from '../../../utils/';
const confirm = Modal.confirm;
const Search = Input.Search;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
function PosModal({ 
  	dispatch,
    visible,
    isNew,
    expandedKeys,
    scmList,
    form: {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      resetFields,
      getFieldValue,
      setFieldsValue,
    },
    selectValue,
    postName,
    editId,
    checked,
    halfChecked,
  }) {
  const handleCancel = () => {
    dispatch({
      type: 'postAuthority/hideModal'
    });
  };
  const title = isNew ? '新增岗位' : '编辑岗位';
  const onExpand = (expandedKeys) => {
    dispatch({
      type:'postAuthority/onExpand',
      expandedKeys,
    });
  };
  const selectChild = (childrenNodes) => {
    let arr = [];
    childrenNodes.map(function(item) {
      arr.push(item.id);
      if(item.children && item.children.length) {
        arr.concat(selectChild(item.children));
        arr = arr.concat(selectChild(item.children));
      };
    });
    return arr;
  }
  const array_diff = (a, b) => {  
    for(let i = 0; i < b.length; i++) {  
      for(let j = 0; j<a.length; j++)  
      {  
        if (a[j]==b[i]) {  
          a.splice(j,1);  
          j = j-1;  
        }  
      }  
    }   
    return a;  
  };
  const onCheck = (value, info) => {
    let selectNode = [];
    // 自身选中时 父选中 子选中 2 checked === false 时 父不变 子都取消
    
    if(info.checked) {
      //选中时处理函数 父选中 子选中
      const dataRef = info.node.props.dataRef;
      const childrenNodes = dataRef.children;
      const parentNodes = dataRef.parents;
      if(!selectValue.length) {
        selectNode.push(dataRef.id);
        parentNodes.map(function(item) {
          item && selectNode.push(item.id);
        });
        selectNode = selectNode.concat(selectChild(childrenNodes || []));
      } else {
        selectNode.push(dataRef.id);
        parentNodes.map(function(item) {
          item && selectNode.push(item.id);
        });
        selectNode = selectNode.concat(selectChild(childrenNodes || []));
        selectNode = array_diff(selectNode, selectValue);
        selectNode = selectNode.concat(selectValue);
      }
    } else {
      const dataRef = info.node.props.dataRef;
      let childrenNodes = [];
      childrenNodes.push(dataRef.id);
      childrenNodes = childrenNodes.concat(selectChild(dataRef.children || []));
      selectNode = selectNode.concat(array_diff(selectValue, childrenNodes));
    };
    dispatch({
      type: 'postAuthority/storeAuthority',
      selectValue: selectNode,
    });

  }
  const renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
        return <TreeNode {...item} dataRef={item}/>
    });
  };
  const handleOk = () => {
    selectValue.length ? setFieldsValue({ 'postRoleList': selectValue }) : setFieldsValue({ 'postRoleList': '' });
    validateFields((err, values) => {
      if (!err) {
        const arr = [];
        selectValue.map(function(item) {
          arr.push({
            roleId: item,
            roleType: 292,
          });
        });
        if (isNew) {
          dispatch({
            type: 'postAuthority/createAuthority',
            postName: values.postName,
            postRoleList: arr,
          });
        } else {
          dispatch({
            type: 'postAuthority/saveEditAuhtority',
            id: editId,
            postName: values.postName,
            postRoleList: arr,
          })
        }
        
      }
    });
  };
  return (
    <div>
      { visible &&  <Modal title={title}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="岗位名称"
          >
            {getFieldDecorator('postName', {
              initialValue: postName || '',
              rules: [{
                required: true, message: '请输入岗位名称',
                max: 10, message: '最多输入10个字符'
              }],
            })(
              <Input maxLength='10'/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="岗位权限"
          >
            {getFieldDecorator('postRoleList', {
              rules: [{
                required: true, message: '请选择岗位权限',
              }],
            })(
              <div className="posTreeContainer">
                  { scmList.length ?  <Tree
                    checkStrictly = { true }
                    expandedKeys = {expandedKeys}
                    checkable
                    onExpand={onExpand}
                    onCheck = { onCheck }
                    autoExpandParent = { false }
                    className = 'posTree'
                    checkedKeys = { selectValue }
                  >
                    {renderTreeNodes(scmList)}
                  </Tree> : 'loading tree'}
              </div>
            )}
          </FormItem>
        </Form>
      </Modal>}
    </div>
  );
}
export default Form.create()(PosModal);
