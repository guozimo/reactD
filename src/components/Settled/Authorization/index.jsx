import React from 'react';
import { Table, Button, Modal } from 'antd';
import BindModal from './BindModal';
import UnBindModal from './UnBindModal';
import { getUserInfo } from '../../../utils/';
const confirm = Modal.confirm;

const names = {
  Alipay: '口碑',
  Eleme: '饿了么',
  MeiTuan: '美团',
};

function AuthorizationTable({ dispatch, loading, list, elemeShops, stores, showUnBindModal, meiList, meiModal }) {
  const { tenantId } = getUserInfo();


  function setAuthUrl(name) {
    if (name === 'MeiTuan') {
      manageMeiTuan();
    } else {
      const path = name === 'Alipay' ? 'alipayOAuth' : 'elemeOAuth';

      window.open(`${window.location.origin}/ipos-chains/${path}/gotoOAuth`).focus();

      setTimeout(() => {
        confirm({
          title: '是否已经完成授权?',
          onOk() {
            dispatch({
              type: 'authorization/fetchList'
            });
          },
          onCancel() {},
        });
      }, 1000);
    }
  }

  function manageMeiTuan() {
    // Modal.confirm({
    //   title: '美团',
    //   content:
    // });
    toggleMeiTuanModal(true);
    dispatch({
      type: 'authorization/getMeiTuanList'
    });
  }

  function fetchMeiList() {

    setTimeout(() => {
      confirm({
        title: '是否已经完成授权?',
        onOk() {
          dispatch({
            type: 'authorization/getMeiTuanList'
          });
        },
      });
    }, 1000);
  }



  function toggleMeiTuanModal(toggle) {
    dispatch({
      type: 'authorization/toggleMeiTuanModal',
      meiModal: !!toggle,
    });
  }

  function bindStore() {
    dispatch({
      type: 'authorization/getStoreList'
    });

    dispatch({
      type: 'authorization/getElemeList',
      tenantId,
    });
  }
  
  function unbindStore() {
    dispatch({
      type: 'authorization/findElemeShops'
    });
  }

  const columns = [
    {
      title: '应用名称',
      dataIndex: 'name',
      key: 'name',
      render: key => names[key],
    },
    {
      title: '授权状态',
      dataIndex: 'auth',
      key: 'auth',
      render: (status) => {
        return <span>{status ? '已授权' : '未授权'}</span>
      },
    },
    {
      title: '管理',
      key: 'operation',
      render: (text, { auth, name }) => {
        return (
          <div>
            <Button onClick={() => {
              setAuthUrl(name);
            }}>{ name === 'MeiTuan' ? '管理' : (auth ? '重新授权': '授权') }</Button>

            {
              auth && name === 'Eleme' && [
                (<BindModal key="bind" elemeShops={elemeShops} stores={stores} dispatch={dispatch}>
                  <Button onClick={bindStore} style={{marginLeft: 10}}>绑定店铺</Button>
                </BindModal>),
                (<UnBindModal key="unbind" visible={showUnBindModal} stores={stores} dispatch={dispatch}>
                  <Button onClick={unbindStore} style={{marginLeft: 10}}>解绑店铺</Button>
                </UnBindModal>)
              ]
            }
          </div>
        )
      },
    },
  ];

  const columnsMei =[{
    title: '店铺名称',
    dataIndex: 'storeName',
  }, {
    title: '授权状态',
    dataIndex: 'isAuth',
    render: statu => `${statu && '已' || '未'}授权`
  }, {
    title: '管理',
    dataIndex: 'url',
    render: (url, item) => <div>
      <Button onClick={fetchMeiList}><a href={url} target="_blank">{item.isAuth && '重新' || ''}授权</a></Button>
      {item.isAuth && <Button onClick={fetchMeiList} style={{marginLeft: 10}}><a href={item.unUrl} target="_blank">解绑</a></Button>}
    </div>,
  }]
  meiList.map((item, index) => {
    item.key = index;
  });
  return (
    <div>
      <Table
        columns={columns}
        loading={loading}
        dataSource={list}
        bordered
        rowKey={record => record.name}
        pagination={false}
      />
      <Modal
        visible={meiModal}
        title="美团"
        footer=""
        onCancel={() => toggleMeiTuanModal()}

      >
        <Table
          columns={columnsMei}
          dataSource={meiList}
          size="small"
          pagination={false}
        />
      </Modal>
    </div>
  );
}



export default AuthorizationTable;
