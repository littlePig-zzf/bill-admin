import { Modal, Select, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import styles from '../index.less';
type PropsShape = {
  category: any[];
  handleOk: Function;
  handleCancel: Function;
  isModalVisible: boolean;
};
// 账单类型
const billType = [
  { label: '支出', value: '0' },
  { label: '收入', value: '1' },
]
export default function AddBill(props: PropsShape) {
  const { category, isModalVisible, handleOk, handleCancel } = props;
  const [categoryGroup, setCategoryGroup] = useState<any>({});
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [form] = Form.useForm();
  const onOk = async () => {
    const data = await form.validateFields();
    handleOk(data);
    form.resetFields()
  };
  const onCancel = () => {
    form.resetFields()
    handleCancel();
  }
  const handleTypeChange = (e) => {
    setCategoryList(categoryGroup[e])
    form.setFieldsValue({
      category: ''
    })
  }
  const formItems: {
    name: string;
    label: string;
    entity: any;
    getProps: () => void;
    getEntityProps: () => void;
  }[] = [
      {
        name: 'type',
        label: '账单类型',
        entity: Select,
        getProps() {
          return {
            rules: [{ required: true, message: '请选择账单类型' }]
          };
        },
        getEntityProps() {
          return {
            placeholder: '请选择',
            options: billType,
            onChange: handleTypeChange,
          };
        },
      },
      {
        name: 'category',
        label: '账单分类',
        entity: Select,
        getProps() {
          return {
            rules: [{ required: true, message: '请选择账单分类' }]
          };
        },
        getEntityProps() {
          return {
            placeholder: '请选择',
            options: categoryList,
            fieldNames: {
              label: 'name',
              value: 'id'
            },
          };
        },
      },
      {
        name: 'amount',
        label: '账单金额',
        entity: Input,
        getProps() {
          return {
            rules: [{ required: true, message: '请输入账单金额' }]
          };
        },
        getEntityProps() {
          return {
            placeholder: '请输入',
            type: 'number',
          };
        },
      },
    ];


  useEffect(() => {
    const res = _.groupBy(category, 'type');
    setCategoryGroup(res);
    setCategoryList(res[0]);
  }, [category])
  return (
    <Modal title="新增账单" visible={isModalVisible} onOk={onOk} onCancel={onCancel}>
      <Form form={form} name="advanced_search" className={styles['search-form']} initialValues={{ type: '0' }}>
        {formItems.map((formItem) => {
          const { name, label, entity: Entity, getProps, getEntityProps } = formItem;
          return (
            <Form.Item key={name} name={name} label={label} {...getProps()}>
              <Entity {...getEntityProps()} />
            </Form.Item>
          );
        })}
      </Form>
    </Modal>
  )
}