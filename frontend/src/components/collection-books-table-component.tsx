// noinspection DuplicatedCode

"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import type { InputRef } from "antd";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  notification,
  Popconfirm,
  Select,
  Space,
  Table,
} from "antd";
import type { FormInstance } from "antd/es/form";
import { ColumnType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { FilterConfirmProps } from "antd/es/table/interface";
import { Book, createBook, deleteBook, updateBook } from "@/api/books";
import { Collection } from "@/api/collections";
import {
  getPublishingCompanies,
  PublishingCompany,
} from "@/api/publishing-companies";
import dayjs from "dayjs";
import { RangePickerProps } from "antd/es/date-picker";

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

type DataIndex = keyof Book;

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Book;
  record: Book;
  handleSave: (record: Book) => void;
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

export default function CollectionBooksTableComponent(props: any) {
  const [dataSource, setDataSource] = useState<Book[]>(props.books);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [publishingCompanies, setPublishingCompanies] = useState<
    PublishingCompany[]
  >([]);
  const [collection, setCollection] = useState<Collection>();

  const [count, setCount] = useState(2);

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
    getPublishingCompanies()
      .then((res) => {
        setPublishingCompanies(res);
      })
      .catch(() => {
        openNotification("Error occurred while fetching companies list");
      });
    setDataSource(props.books);
    setCollection(props.collection);
  }, [props]);

  const handleDelete = (key: React.Key) => {
    deleteBook(parseInt(key.toString()))
      .then(() => openNotification("Book deleted."))
      .catch(() => {
        openNotification("Error while deleting book.", "Error");
      });
    const newData = dataSource.filter((item) => item.id !== key);
    setDataSource(newData);
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

  const onDateChange = (record: Book, date: any) => {
    record.publicationDate = date;
    updateBook(record).catch(() => {
      openNotification("Error on data change.");
    });
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Book> => ({
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
      record[dataIndex]!.toString()
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
      title: "Title",
      dataIndex: "title",
      width: "20%",
      editable: true,
      ...getColumnSearchProps("title"),
    },
    {
      title: "Description",
      dataIndex: "description",
      width: "30%",
      editable: true,
      ...getColumnSearchProps("description"),
    },
    {
      title: "Publishing company",
      dataIndex: "publishingCompany",
      width: "20%",
      render: (_: any, record: any) => {
        const handlePublishingCompanyChange = (_: string, data: any) => {
          record.publishingCompanyId = parseInt(data.key);
          updateBook(record)
            .then(() => openNotification("Book updated."))
            .catch(() => {
              openNotification("Error while updating Book.", "Error");
            });
        };

        return (
          <Form.Item style={{ margin: 0 }}>
            <Select
              showSearch
              defaultValue={
                publishingCompanies.find(
                  (obj) => obj.id == record.publishingCompanyId
                )
                  ? publishingCompanies.find(
                      (obj) => obj.id == record.publishingCompanyId
                    )?.id +
                    " " +
                    publishingCompanies.find(
                      (obj) => obj.id == record.publishingCompanyId
                    )?.name
                  : "Select company"
              }
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.value ?? "")
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={handlePublishingCompanyChange}
              style={{ width: "100%" }}
            >
              {publishingCompanies.map((publishingCompany) => (
                <Option
                  label={publishingCompany.id + " " + publishingCompany.name}
                  key={publishingCompany.id}
                  value={publishingCompany.id + " " + publishingCompany.name}
                >
                  {publishingCompany.id} {publishingCompany.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      },
    },
    {
      title: "Price ($)",
      dataIndex: "price",
      key: "price",
      width: "10%",
      ...getColumnSearchProps("price"),
      render: (_: any, record: any, __: any) => (
        <InputNumber
          required={true}
          min={0}
          prefix={"$"}
          defaultValue={record.price ? record.price : 0}
          onBlur={(element) => {
            record.price = parseFloat(element.target.value);
            updateBook(record)
              .then(() => openNotification("Updated."))
              .catch(() => openNotification("Error while updating.", "Error"));
          }}
        />
      ),
    },
    {
      title: "Publication Date",
      dataIndex: "publicationDate",
      key: "founded",
      width: "15%",
      ...getColumnSearchProps("publicationDate"),
      render: (_: any, record: any, __: any) => (
        <DatePicker
          onChange={(_, value) => onDateChange(record, value)}
          disabledDate={disabledDate}
          allowClear={false}
          defaultValue={dayjs(
            new Date(record.publicationDate).toISOString().split("T")[0],
            "YYYY-MM-DD"
          )}
        />
      ),
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
    const newData: Book = {
      id: count,
      title: `New book...`,
      publicationDate: new Date().toISOString().split("T")[0],
      description: "Description...",
      authorId: collection?.author?.id ? collection?.author?.id : null,
      collectionId: collection?.id ? collection.id : 0,
      publishingCompanyId: null,
      price: 0,
    };
    createBook(newData)
      .then((res) => {
        setDataSource([res, ...dataSource]);
        setCount(count + 1);
        collection!.books = [res, ...dataSource];
        setCollection(collection);
      })
      .catch(() => {
        openNotification("Error while creating book.", "Error");
      });
  };

  const handleSave = (row: Book) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    updateBook(row)
      .then(() => {
        setDataSource(newData);
        openNotification("Book updated.");
      })
      .catch(() => {
        openNotification("Error while saving book.", "Error");
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
      onCell: (record: Book) => ({
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
        loading={props.loading}
        rowKey={"id"}
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
    </div>
  );
}
