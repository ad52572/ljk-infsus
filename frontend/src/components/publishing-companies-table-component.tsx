// noinspection DuplicatedCode

"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import type { InputRef } from "antd";
import {
  Button,
  DatePicker,
  Form,
  Input,
  notification,
  Popconfirm,
  Space,
  Table,
} from "antd";
import dayjs from "dayjs";
import type { FormInstance } from "antd/es/form";
import { Collection } from "@/api/collections";
import { ColumnType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { FilterConfirmProps } from "antd/es/table/interface";
import {
  createPublishingCompany,
  deletePublishingCompany,
  getPublishingCompanies,
  PublishingCompany,
  updatePublishingCompany,
} from "@/api/publishing-companies";
import { RangePickerProps } from "antd/es/date-picker";

const EditableContext = React.createContext<FormInstance | null>(null);

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

type DataIndex = keyof PublishingCompany;

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Collection;
  record: Collection;
  handleSave: (record: Collection) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {}
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

export default function PublishingCompaniesTableComponent() {
  const [dataSource, setDataSource] = useState<PublishingCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    getPublishingCompanies()
      .then((response) => {
        setDataSource(response);
        setLoading(false);
      })
      .catch((error) => {
        openNotification(error, "Error");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [count, setCount] = useState(2);

  const handleDelete = (key: React.Key) => {
    deletePublishingCompany(parseInt(key.toString()))
      .then(() => {
        const newData = dataSource.filter((item) => item.id !== key);
        setDataSource(newData);
        openNotification("Row deleted.");
      })
      .catch((error) => {
        openNotification(error, "Error");
      });
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  // @ts-ignore
  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<Collection> => ({
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
      // @ts-ignore
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

  const onDateChange = (record: PublishingCompany, date: any) => {
    record.founded = date;
    updatePublishingCompany(record).catch(() => {
      openNotification("Error on data change.", "Error");
    });
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // Can not select days before today and today
    return current && current > dayjs().endOf("day");
  };

  const defaultColumns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "5%",
      ...getColumnSearchProps("id"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
      editable: true,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "30%",
      editable: true,
      ...getColumnSearchProps("description"),
    },
    {
      title: "Founded",
      dataIndex: "founded",
      key: "founded",
      width: "20%",
      ...getColumnSearchProps("founded"),
      render: (_: any, record: any, __: any) => (
        <DatePicker
          onChange={(_, value) => onDateChange(record, value)}
          disabledDate={disabledDate}
          allowClear={false}
          defaultValue={dayjs(
            new Date(record.founded).toISOString().split("T")[0],
            "YYYY-MM-DD"
          )}
        />
      ),
    },
    {
      title: "OIB",
      dataIndex: "oib",
      key: "oib",
      width: "20%",
      editable: true,
      ...getColumnSearchProps("oib"),
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: any, __: any) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

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

  const handleAdd = () => {
    const newData: PublishingCompany = {
      id: count,
      name: `Publishing company name...`,
      founded: new Date().toISOString().split("T")[0],
      oib: "00604320174",
      description: "Publishing company description...",
    };
    createPublishingCompany(newData)
      .then((data) => {
        setDataSource([data, ...dataSource]);
        setCount(count + 1);
      })
      .catch((error) => {
        openNotification(error, "Error");
      });
  };

  const handleSave = (row: PublishingCompany) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    updatePublishingCompany(row)
      .then(() => {
        setDataSource(newData);
        openNotification("Data updated.");
      })
      .catch((error) => {
        openNotification(error.toString(), "Error");
      });
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    // @ts-ignore
    if (!col.editable) {
      return col;
    }
    // noinspection JSUnusedGlobalSymbols
    return {
      ...col,
      onCell: (record: Collection) => ({
        record,
        // @ts-ignore
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        loading={loading}
        rowKey={"id"}
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
    </div>
  );
}
