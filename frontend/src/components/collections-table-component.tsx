// noinspection DuplicatedCode

"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import type { InputRef } from "antd";
import {
  Button,
  Form,
  Input,
  notification,
  Popconfirm,
  Select,
  Space,
  Table,
} from "antd";
import type { FormInstance } from "antd/es/form";
import {
  Collection,
  createCollection,
  deleteCollection,
  getCollections,
  updateCollection,
} from "@/api/collections";
import { ColumnType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { FilterConfirmProps } from "antd/es/table/interface";
import { useRouter } from "next/navigation";
import { Author, getAuthors } from "@/api/authors";

const EditableContext = React.createContext<FormInstance | null>(null);
const { Option } = Select;

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

type DataIndex = keyof Collection;

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
    } catch (errInfo) {
      console.error("Save failed:", errInfo);
    }
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

export default function CollectionsTableComponent() {
  const [dataSource, setDataSource] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [authors, setAuthors] = useState<Author[]>([]);
  const searchInput = useRef<InputRef>(null);
  const router = useRouter();

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
      .then((res) => {
        setAuthors(res);
      })
      .catch(() => {
        openNotification("Error while fetching authors.", "Error");
      });
  }, []);

  useEffect(() => {
    getCollections()
      .then((response) => {
        setDataSource(response);
        setLoading(false);
      })
      .catch(() => {
        openNotification("Error while fetching data.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [count, setCount] = useState(2);

  const handleDelete = (key: React.Key) => {
    deleteCollection(parseInt(key.toString()))
      .then(() => {
        openNotification("Collection deleted.");
        const newData = dataSource.filter((item) => item.id !== key);
        setDataSource(newData);
      })
      .catch(() => {
        openNotification("Error occurred while deleting. Try again,", "Error");
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

  const defaultColumns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "10%",
      ...getColumnSearchProps("id"),
      render: (text: number) => (
        <a
          onClick={() => {
            router.push(`/collections/${text}`);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "50%",
      editable: true,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Author",
      dataIndex: "author",
      render: (_: any, record: any) => {
        const handleAuthorChange = (_: any, author: any) => {
          record.author = { id: author.key };
          updateCollection(record)
            .then(() => {
              openNotification("Author updated.");
            })
            .catch(() => {
              openNotification("Error while saving author.", "Error");
            });
        };

        return (
          <Form.Item style={{ margin: 0 }}>
            <Select
              showSearch
              defaultValue={
                record.author
                  ? record.author.f_name + " " + record.author.l_name
                  : null
              }
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.value ?? "")
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={handleAuthorChange}
              style={{ width: "100%" }}
            >
              {authors.map((author) => (
                <Option
                  label={author.id}
                  key={author.id}
                  value={author.f_name + " " + author.l_name}
                >
                  {author.f_name} {author.l_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      },
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

  const handleAdd = () => {
    const newData: Collection = {
      name: `New collection...`,
      books: null,
      author: null,
    };
    createCollection(newData)
      .then((res) => {
        setDataSource([res, ...dataSource]);
        setCount(count + 1);
        openNotification("New empty collection created.");
      })
      .catch(() => {
        openNotification(
          "Error occurred while creating new empty collection.",
          "Error"
        );
      });
  };

  const handleSave = (row: Collection) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    updateCollection(row)
      .then(() => {
        setDataSource(newData);
        openNotification("Data updated.");
      })
      .catch(() =>
        openNotification("Error occurred while saving data.", "Error")
      );
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
