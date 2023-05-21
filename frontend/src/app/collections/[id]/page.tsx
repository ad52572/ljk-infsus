"use client";
import CollectionBooksTableComponent from "@/components/collection-books-table-component";
import React, { useEffect, useState } from "react";
import {
  Collection,
  deleteCollection,
  getCollection,
  updateCollection,
} from "@/api/collections";
import { Button, Form, Input, notification, Popconfirm, Select } from "antd";
import { Author, getAuthors } from "@/api/authors";
import { updateBook } from "@/api/books";
import { useRouter } from "next/navigation";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

// noinspection JSUnusedGlobalSymbols
export default function Collection({ params }: any) {
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [form] = Form.useForm();
  const [authors, setAuthors] = useState<Author[]>([]);
  const router = useRouter();

  const openNotification = (description: string, message?: string) => {
    notification.open({
      message: message ? message : "Notification",
      description: description,
      placement: "bottomRight",
    });
  };

  useEffect(() => {
    getAuthors()
      .then((res) => {
        setAuthors(res);
      })
      .catch(() => {
        openNotification("Error while fetching authors.", "Error");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = (values: any) => {
    let authorNew = authors.find(
      (obj) => `${obj.id} ${obj.f_name} ${obj.l_name}` == values.author
    );
    values.author = { id: authorNew?.id };
    updateCollection(values)
      .then(() => {
        openNotification("Collection updated.");
        collection?.books?.forEach((book) => {
          book.authorId = authorNew!.id;
          updateBook(book).then(() => {});
        });
      })
      .catch(() => {
        openNotification("Error while saving book.", "Error");
      })
      .catch(() => {
        openNotification("Error while saving collection.", "Error");
      });
  };

  const confirmDelete = () => {
    deleteCollection(params.id)
      .then(() => {
        router.push("/collections");
      })
      .catch(() => {
        openNotification("Error while deleting.", "Error");
      });
  };

  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    getCollection(params.id)
      .then((response: any) => {
        setCollection(response);
        setLoading(false);
      })
      .catch(() => {
        openNotification("Error while fetching data.");
      });
  }, [params.id]);

  useEffect(() => {
    form.resetFields();
  }, [collection]);

  return (
    <main>
      <Form
        {...layout}
        layout={"vertical"}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        initialValues={{
          author: collection?.author
            ? collection.author.id +
              " " +
              collection.author.f_name +
              " " +
              collection.author.l_name
            : null,
          id: collection?.id,
          name: collection?.name,
        }}
      >
        <Form.Item name="id" label="Id" rules={[{ required: true }]}>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="author" label="Author" rules={[{ required: true }]}>
          <Select
            placeholder="Select author"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.value ?? "")
                .toString()
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            style={{ width: "100%" }}
          >
            {authors.map((author) => (
              <Option
                label={author.id}
                key={author.id}
                value={author.id + " " + author.f_name + " " + author.l_name}
              >
                {author.id} {author.f_name} {author.l_name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.gender !== currentValues.gender
          }
        >
          {({ getFieldValue }) =>
            getFieldValue("gender") === "other" ? (
              <Form.Item
                name="customizeGender"
                label="Customize Gender"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            ) : null
          }
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
      <Popconfirm
        title="Delete the task"
        description="Are you sure to delete this task?"
        onConfirm={confirmDelete}
        okText="Yes"
        cancelText="No"
      >
        <Button style={{ marginBottom: 10 }} danger={true}>
          Delete
        </Button>
      </Popconfirm>
      <CollectionBooksTableComponent
        setCollection={setCollection}
        loading={loading}
        collectionId={params.id}
        authorId={0}
        books={collection?.books}
        collection={collection}
      />
    </main>
  );
}
