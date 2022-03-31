import { Select, DatePicker, Form, Row, Col, Button, Space } from 'antd';
import moment from 'moment';
import styles from '../index.less';

type PropsShape = {
  list: any[];
  category: any[];
  setList: Function;
  onSearch: Function;
};

const TableSearchForm = (props: PropsShape) => {
  const [form] = Form.useForm();
  const { category } = props;

  const formItems: {
    name: string;
    label: string;
    entity: any;
    getProps: () => void;
    getEntityProps: () => void;
  }[] = [
      {
        name: 'month',
        label: '选择月份',
        entity: DatePicker,
        getProps() {
          return {};
        },
        getEntityProps() {
          return {
            placeholder: '请选择',
            picker: 'month',
            format: 'YYYY/MM',
          };
        },
      },
      {
        name: 'category',
        label: '账单分类',
        entity: Select,
        getProps() {
          return {};
        },
        getEntityProps() {
          return {
            placeholder: '请选择',
            options: category,
            fieldNames: {
              label: 'name',
              value: 'id'
            },
            allowClear: true,
          };
        },
      },
    ];
  const onSearch = async () => {
    let data = await form.validateFields();
    const month = data?.month && moment(data.month).format('YYYY/MM')
    data = { ...data, month }
    for (let key in data) {
      if (!data[key] || !data[key]?.length) {
        delete data[key];
      }
    }
    props.onSearch(data);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form form={form} name="advanced_search" className={styles['search-form']}>
      <Row gutter={24}>
        <Col span={20}>
          <Row gutter={24}>
            {formItems.map((formItem) => {
              const { name, label, entity: Entity, getProps, getEntityProps } = formItem;
              return (
                <Col key={name} span={8}>
                  <Form.Item name={name} label={label} {...getProps()}>
                    <Entity {...getEntityProps()} />
                  </Form.Item>
                </Col>
              );
            })}
          </Row>
        </Col>
        <Col span={4} className="search-btn">
          <Space>
            <Button onClick={onReset}>重置</Button>
            <Button type="primary" onClick={onSearch}>
              查询
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
};

export default TableSearchForm;
