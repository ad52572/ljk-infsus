// noinspection DuplicatedCode

"use client";
import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Button, DatePicker, Input, notification, Space, Table } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { Author, getAuthors } from "@/api/authors";
import dayjs from "dayjs";

type DataIndex = keyof Author;

const App: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [data, setData] = useState<Author[]>([]);
  const searchInput = useRef<InputRef>(null);

  const openNotification = (description: string, message?: string) => {
    if (message == "Error") {
      notification.error({
        message: message ? message : "Notification",
        description: description,
        placement: "bottomRight",
      });
    } else {
      notification.info({
        message: message ? message : "Notification",
        description: description,
        placement: "bottomRight",
      });
    }
  };

  useEffect(() => {
    getAuthors()
      .then((response) => {
        setData(response);
      })
      .catch(() => openNotification("Error while fetching data."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Author> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<Author> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "10%",
      ...getColumnSearchProps("id"),
    },
    {
      title: "First name",
      dataIndex: "f_name",
      key: "f_name",
      width: "10%",
      ...getColumnSearchProps("f_name"),
    },
    {
      title: "Last name",
      dataIndex: "l_name",
      key: "l_name",
      width: "10%",
      ...getColumnSearchProps("l_name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "10%",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Birthday",
      dataIndex: "b_day",
      key: "b_day",
      ...getColumnSearchProps("b_day"),
      render: (_: any, record: any, __: any) => (
        <DatePicker
          disabled={true}
          allowClear={false}
          defaultValue={dayjs(
            new Date(record.b_day).toISOString().split("T")[0],
            "YYYY-MM-DD"
          )}
        />
      ),
    },
  ];

  return (
    <main>
      <Table rowKey={"id"} columns={columns} dataSource={data} />
    </main>
  );
};

export default App;
