import type {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import ProLayout, { ProBreadcrumb } from '@ant-design/pro-layout';
import { DiffOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Link, history } from 'umi';
import RightContent from '@/components/GlobalHeader/RightContent';
import '@/global.less';
import logo from '@/assets/logo.svg';

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: Record<string, MenuDataItem>;
};

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return localItem as MenuDataItem;
  });
const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const [menu, setMenu] = useState<any>([]);
  const {
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  useEffect(() => {
    const arr = menuDataRender(
      (props.route?.routes) || [],
    );
    setMenu(arr);
  }, []);
  return (
    <>
      <ProLayout
        logo={logo}
        title='example'
        onMenuHeaderClick={() => history.push('/')}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || !menuItemProps.path) {
            return defaultDom;
          }
          return <Link to={menuItemProps.path} ><DiffOutlined />{defaultDom}</Link>;
        }}
        headerContentRender={() => <ProBreadcrumb />}
        breadcrumbRender={(routers = []) => {
          return [{
            path: '/',
            breadcrumbName: '首页',
          }, ...routers]
        }}
        menuDataRender={() => menu}
        rightContentRender={() => <RightContent />}
        {...props}
        {...settings}
      >
        {children}
      </ProLayout>
    </>
  );
};
export default BasicLayout