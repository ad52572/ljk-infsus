"use client";
import React, { useState } from "react";
import {
  BookOutlined,
  PieChartOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import { usePathname, useRouter } from "next/navigation";
// noinspection JSUnusedGlobalSymbols
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export function WrapperComponent({ children }: { children: any }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: {},
  } = theme.useToken();
  const pathname = usePathname();
  const router = useRouter();

  const items: MenuItem[] = [
    getItem(
      <a
        onClick={() => {
          router.push("/");
        }}
      >
        Home
      </a>,
      "/",
      <PieChartOutlined />
    ),
    getItem(
      <a
        onClick={() => {
          router.push("/authors");
        }}
      >
        Authors
      </a>,
      "/authors",
      <UserOutlined />
    ),
    getItem(
      <a
        onClick={() => {
          router.push("/publishing-companies");
        }}
      >
        Publishing companies
      </a>,
      "/books",
      <BookOutlined />
    ),
    getItem(
      <a
        onClick={() => {
          router.push("/collections");
        }}
      >
        Collections
      </a>,
      "/collections",
      <UnorderedListOutlined />
    ),
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={[pathname]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: "16px 16px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
