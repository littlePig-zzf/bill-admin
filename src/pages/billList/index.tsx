import { Table, Button } from 'antd';
import { useEffect, useState } from 'react';
import { getBill, getBillCategory } from './services';
import moment from 'moment';
import SearchForm from './components/searchForm';
import AddBill from './components/AddBill';
import _ from 'lodash';
import styles from './index.less';

export default function BillList() {
  const [list, setList] = useState<any[]>([]);
  const [category, setCategory] = useState([])
  const [originList, setOriginList] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getList = async () => {
    let res = await getBill();
    res = res.map((item: Record<string, any>) => {
      const month = moment(parseInt(item.time)).format('YYYY/MM');
      item.month = month;
      item.id = month + item.category;
      return item;
    })
    setList(res);
    setOriginList(res);
  };

  const columns = [
    {
      title: '账单类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: any, obj: Record<string, any>) => {
        return obj?.type == 1 ? '收入' : '支出'
      }
    },
    {
      title: '账单时间',
      dataIndex: 'time',
      key: 'time',
      render: (text: any, obj: Record<string, any>) => {
        return moment(parseInt(obj.time)).toISOString()
      }
    },
    {
      title: '账单分类',
      key: 'category',
      dataIndex: 'category',
      render: (text: any, obj: Record<string, any>) => {
        const res: Record<string, any> = category.filter((item: Record<string, any>) => item?.id === obj?.category);
        return res?.[0]?.name;
      }
    },
    {
      title: '账单金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: any, obj: Record<string, any>) => {
        return parseInt(obj?.amount)?.toFixed(2)
      }
    },
  ];

  const onSearch = (params: Record<string, any>) => {
    if (Object.keys(params).length) {
      const res = originList.filter((item) => {
        for (var key in params) {
          if (item[key] === undefined || item[key] != params[key]
          ) {
            return false;
          }
        }
        return true;
      })
      setList(res)
    } else {
      setList(originList)
    }
  }
  const fetchBillCategory = async () => {
    const res = await getBillCategory()
    setCategory(res)
  }

  const handleOk = (values: Record<string, any>) => {
    const date = moment(new Date());
    const time = date.valueOf();
    const month = date.format('YYYY/MM');
    const params = {
      ...values,
      time,
      month,
      id: month + values?.category,
    }
    saveList(list, setList, params)
    saveList(originList, setOriginList, params)
    setIsModalVisible(false)
  }

  const saveList = (data: any[], setListhandle: Function, params: Record<string, any>) => {
    const _list = _.cloneDeep(data);
    _list.unshift(params)
    setListhandle([..._list])
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  useEffect(() => {
    getList()
    fetchBillCategory()
  }, [])

  return (
    <div>
      <SearchForm
        list={list}
        category={category}
        setList={setList}
        onSearch={onSearch}></SearchForm>
      <div className={styles['button-group']}>
        <Button type='primary' onClick={() => setIsModalVisible(true)}>新增</Button>
      </div>
      <Table
        columns={columns}
        dataSource={list}
        rowKey='id'
        scroll={{ x: 'auto', y: 650 }}
      />
      <AddBill
        isModalVisible={isModalVisible}
        category={category}
        handleOk={handleOk}
        handleCancel={handleCancel}
      ></AddBill>
    </div>
  );
}
