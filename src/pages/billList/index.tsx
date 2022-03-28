import { Table, } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';

export default function BillList() {
  const [list, setList] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  const getList = async () => {
  };

  const onSelectChange = (selectedRowKeys: any[], record: any) => {
    setSelectedRowKeys(selectedRowKeys);
  }
  // rowSelection object indicates the need for row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: 'Star',
      key: 'starred',
      dataIndex: 'starred',
      render: (text: string, obj: any) => {
        return ''
      },
    },
    {
      title: 'User',
      key: 'User',
      dataIndex: 'User',
      render: (text: string, obj: any) => '',
    },
    {
      title: 'Property name',
      key: 'Property name',
      dataIndex: 'Property name',
      render: (text: string, obj: any) =>
        <>

        </>
      ,
    },
    {
      title: 'Check-in',
      key: 'dtstart',
      dataIndex: 'dtstart',
    },
    {
      title: 'Check-out',
      key: 'dtend',
      dataIndex: 'dtend',
    },
    {
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
      render: (text: string, obj: Record<string, any>) => {
        return ''
      }
    },
    {
      title: 'Updated',
      key: 'updated_at',
      dataIndex: 'updated_at',
    },
  ];

  useEffect(() => {
    getList()
  }, [])

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={list}
      rowKey='id'
      scroll={{ x: 'auto', y: 650 }}
    />
  );
}
