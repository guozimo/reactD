import React from 'react';
import { connect } from 'dva';
import { Tree, Col, Row, Table, Button, Input, Popconfirm } from 'antd';
import ImportModal from './ImportModal';
import './index.less';
import { getUserInfo} from '../../../utils';
import {message} from "antd/lib/index";
function memberImportTable({ dispatch, stores, isEdit, list, loading, treeNodes, provinceList ,cityList,areaList,emplCode,postList,showEditor,recordId,emp1,record,rightName,pagination}) {
  /*console.log('list====>', JSON.stringify(list))*/
  if (list.length==0){
    list = [{
      "id": "3d4737cc-6453-46b3-bf4c-086067b59ad3",
      "storeId": "1889d4ec-68ea-4f21-a7b6-88d0c1a03d31",
      "storeName": "",
      "createUser": null,
      "createUserName": null,
      "createTime": "2017-10-20 18:33:49",
      "updateUser": null,
      "updateTime": null,
      "deleteFlag": 1,
      "tenantId": null,
      "tenName": null,
      "queryString": null,
      "isSystem": null,
      "orgType": null,
      "delIds": null,
      "delIdsList": null,
      "page": 0,
      "rows": 0,
      "orderProperty": null,
      "orderDirection": null,
      "storeIds": null,
      "inDepotId": null,
      "outDepotId": null,
      "depotId": null,
      "token": null,
      "realname": "",
      "headImg": null,
      "mobile": null,
      "orgId": null,
      "telephone": null,
      "birthday": null,
      "email": null,
      "gender": null,
      "genderName": null,
      "zipCode": null,
      "country": null,
      "province": null,
      "city": null,
      "district": null,
      "address": null,
      "status": 1,
      "idCard": null,
      "hireDate": null,
      "leaveDate": null,
      "endDate": null,
      "remarks": null,
      "orderNo": null,
      "isPosUser": null,
      "isCloudUser": null,
      "emplType": null,
      "emplCode": null,
      "postId": null,
      "crmEmplId": null,
      "postName": "",
      "posUserAccount": null,
      "posUserPass": null,
      "discountGive": null,
      "discountGiveStr": null,
      "present": null,
      "presentStr": null,
      "posIsCrmUser": null,
      "airCloudUserId": null,
      "posUserId": null,
      "aclUserStoreListStr": null,
      "postType": null,
      "isDisplay": null,
      "isDisplayStr": null,
      "passFlag": null,
      "storeList": null,
      "orgList": null,
      'noHandle':true
    }]
  }
  const Search = Input.Search;
  const TreeNode = Tree.TreeNode;
  let currAclStoreId = ""
  let queryString = ""
  let pageCount = ""
  let currentPage = ""
  const memberProps = {
    onDeleteItem(id) {
     /* console.log("输出Id",id)*/
      dispatch({
        type: 'memberImport/delete',
        payload: id,
      })
    },

    changePrice(){
      this.setState({
        visible:visible||false,
        recordId:recordId||"",
      })
    },
    onEditItem(isEdit, record) {
      dispatch({
        type: 'memberImport/showEditor',
        showEditor:true,
        isEdit: true,
        recordId:record.id,
        record:record,
      })

      dispatch({
        type: 'memberImport/updateForm',
        payload:record.id
       })


    },

    changeStatus(id,status) {
      dispatch({
        type: 'memberImport/updateStatus',
        payload: {
          id:id,
          status: status,
        },
      })
    },
    resetPwd(id){
      dispatch({
        type: 'memberImport/resetPwd',
        payload: {
          id:id,
        },
      })
    },
  }
  const onClick = () => {
    dispatch({
      type: 'memberImport/showEditor',
      showEditor:true,
      isEdit: false,
    });
    dispatch({
      type: 'memberImport/saveEmp1',
      emp1:null
    });
  }
  const treeData = [];
  treeNodes.map(function(item, index) {
    item.orgType?currAclStoreId=item.id+"_"+item.orgType:currAclStoreId=""
    treeData.push(<TreeNode title={ item.name } key={currAclStoreId}></TreeNode>);
  });


  const { tenName} = getUserInfo();
  const columns = [
    {
      title: '组织结构树',
      dataIndex: 'newtree',
      key: 'newtree',
      colSpan: 1,
      width: 150,
      render: (value, row, index) => {
        const onSelect=  (selectedKeys, info) => {
          console.log('selected', selectedKeys, info);
           console.log("selected0",selectedKeys[0])
          dispatch({
            type: 'memberImport/fetch',
            payload :{
              storeId:selectedKeys[0]||'',
              realname:queryString||"",
              rows : pageCount||20,
              page :  currentPage||1
            },
            dispatch,
          });

        }
        const obj = {
          children:  <Tree
            className="storeTree"
            defaultExpandAll={true}
            onSelect={value => onSelect(value)}
            showLine
          >
            <TreeNode title={tenName} key="">
              { treeData }
            </TreeNode>
          </Tree>,
          props: {},
        };
        if (index === 0) {
          obj.props.rowSpan = 100;
        } else {
          obj.props.rowSpan = 0;
        }
        return obj;
      },
    },
    {
      width: 100,
      title: '人员姓名',
      dataIndex: 'realname',
      key: 'realname',
    },
    {
      width: 100,
      title: '隶属机构',
      dataIndex: 'storeName',
      key: 'storeName',
    },
   {
      width: 100,
      title: '人员岗位',
      dataIndex: 'postName',
      key: 'postName',
     },
    {
    title: '操作',
      dataIndex: '',
      key: 'operation',
      width: 150,
      render: (text, record) => (
        !list[0].noHandle&& <p>
          {<a onClick={() => memberProps.resetPwd(record.id)} style={{
            marginRight: 4,
          }}>重置密码</a>}
          {/*{<a onClick={() => memberProps.changeStatus(record.id,record.status == 1 ? 0 : 1)} style={{
            marginRight: 4,color:	'#FF0000',
          }}>{record.status ? '停用' : '启用'}</a>}*/}
          {<a onClick={() => memberProps.onEditItem(true,record)} style={{
            marginRight: 4,
          }}>编辑</a>}
          {<Popconfirm title="确定要删除吗？" onConfirm={() => memberProps.onDeleteItem(record.id)}>
            <a>删除</a>
          </Popconfirm>}
        </p>
      )
     }
  ];
  const searchMember=(value) => {
    dispatch({
      type: 'memberImport/setSearchData',
      searchData: value
    });
    dispatch({
      type:"memberImport/fetch",
    })
  }

  const onPageChange = (page, filters, sorter) => {
    dispatch({
      type: 'memberImport/setPagination',
      pagination: page,
    });
    dispatch({
      type: 'memberImport/fetch',
    });
  };
  return (
    <div  className='orgin_css'>

      <div className="import" >
        <ImportModal title="新增人员" fileMess="538" isEdit={isEdit} dispatch={dispatch} provinceList={provinceList} cityList={cityList} areaList={areaList} treeNodes={treeNodes} emplCode={emplCode} postList={postList} showEditor={showEditor} recordId={recordId} emp1={emp1} record={record} rightName={rightName}>

        </ImportModal>
        <Row>
          <Col span={12}>
            <Button type="primary" size="large" style={{ padding: '0 30px' }} onClick={onClick}>新增人员</Button>
          </Col>
          <Col style={{ float: 'right' }} span={12}>
            <Search
              placeholder="请输入人员名称" className="input_box"
              onSearch={value => searchMember(value)} maxLength={'10'}
            />
          </Col>
        </Row>
      </div>

      <Table
        columns={columns}
        dataSource={list}
        loading={loading} className="table_box"
        bordered
        rowKey={r => r.id}
        pagination = {pagination}
        onChange = {onPageChange}
      />
    </div>
  );

};
function mapStateToProps(state) {
  const { stores, isEdit, list, treeNodes, provinceList, cityList, areaList, emplCode, postList, showEditor, recordId, emp1, record, rightName,pagination} = state.memberImport;
  return {
    loading: state.loading.models.memberImport,
    stores,
    list,
    treeNodes,
    provinceList,
    cityList,
    areaList,
    emplCode,
    postList,
    showEditor,
    recordId,
    emp1,
    record,
    rightName,
    isEdit,
    pagination,
  };
}

export default connect(mapStateToProps)(memberImportTable);
