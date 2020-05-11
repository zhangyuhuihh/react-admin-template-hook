/**
 * title: Form and Table data binding
 * desc: useFormTable returns a search object after receiving a form instance.
 *
 * title.zh-CN: Form 与 Table 联动
 * desc.zh-CN: useFormTable 接收 form 实例后，会返回 search 对象。
 */
import React, { useState, createRef } from 'react'
import { Button, Form, Input, Table, Select, Modal } from 'antd'
import { useFormTable } from '@umijs/hooks'
import MainForm from './MainForm'
import useModal from '@/components/hooks/useModal'
const { confirm } = Modal
const { Option } = Select
const getTableData = ({ current, pageSize }, formData) => {
  let query = `page=${current}&size=${pageSize}`
  Object.entries(formData).forEach(([key, value]) => {
    if (value) {
      query += `&${key}=${value}`
    }
  })

  return fetch(`https://randomuser.me/api?results=55&${query}`)
    .then((res) => res.json())
    .then((res) => ({
      total: res.info.results,
      list: res.results
    }))
}

function Nav1(props) {
  const [form] = Form.useForm()

  const { tableProps, search } = useFormTable(getTableData, {
    defaultPageSize: 5,
    form
  })
  const [
    { modalTitleName, modalvisible },
    { setModalTitleName, setModalVisible }
  ] = useModal()
  const { submit } = search
  const [initFormValues, setinitFormValues] = useState({})
  const columns = [
    {
      title: 'name',
      dataIndex: 'name.last'
    },
    {
      title: 'email',
      dataIndex: 'email'
    },
    {
      title: 'phone',
      dataIndex: 'phone'
    },
    {
      title: 'gender',
      dataIndex: 'gender'
    },
    {
      width: 350,
      dataIndex: 'action',
      title: '操作',
      align: 'center',
      render: (text, record, index) => {
        return (
          <div>
            <Button onClick={() => handleEdit(record)} type="primary">
              编辑
            </Button>
            <Button onClick={() => handleDelete(record)} type="danger">
              删除
            </Button>
          </div>
        )
      }
    }
  ]
  const [currentFormKey, setcurrentFormKey] = useState('')
  const formRef = createRef()
  const handleAdd = () => {
    setModalTitleName('新增')
    setModalVisible(true)
  }
  const handleEdit = (record) => {
    setModalVisible(true)
    setModalTitleName('编辑')
    setinitFormValues({ ...record })
    setcurrentFormKey(record.id)
  }
  const handleDelete = (record) => {
    confirm({
      title: '提示?',
      content: '确认删除嘛?',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk() {
        handletoDeleteService([record.id])
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }
  const handletoAddService = () => {}
  const handletoEditService = () => {}
  const handletoDeleteService = () => {}
  const doSubmit = () => {
    const formToValidate = formRef.current.form
    console.log(formToValidate)
    formToValidate
      .validateFields()
      .then((values) => {
        console.log(values)
        if (modalTitleName === '新增') {
          const queryParams = {
            ...values
          }
          handletoAddService(queryParams)
          return
        }
        if (modalTitleName === '编辑') {
          const queryParams = {
            ...values
          }
          handletoEditService(queryParams)
          return
        }
      })
      .catch((e) => {
        console.log(111)
      })
  }
  const renderModal = () => {
    return (
      <Modal
        width={700}
        title={modalTitleName}
        visible={modalvisible}
        onOk={doSubmit}
        onCancel={() => {
          setModalVisible(false)
          setcurrentFormKey('')
          setinitFormValues({})
        }}
      >
        <MainForm
          key={currentFormKey}
          initValues={initFormValues}
          cRef={formRef}
        ></MainForm>
      </Modal>
    )
  }
  const rendersearchFrom = () => {
    return (
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <Button
            onClick={handleAdd}
            type="primary"
            style={{ marginRight: '20px' }}
          >
            新增
          </Button>
          <Button type="danger">批量删除</Button>
        </div>
        <div>
          <Form layout="inline" form={form}>
            <Form.Item name="gender">
              <Select
                placeholder="请选择"
                style={{ width: 120, marginRight: 16 }}
                onChange={submit}
              >
                <Option value="">all</Option>
                <Option value="male">male</Option>
                <Option value="female">female</Option>
              </Select>
            </Form.Item>
            <Form.Item name="name">
              <Input.Search
                placeholder="enter name"
                style={{ width: 240 }}
                onSearch={submit}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }

  return (
    <div>
      {rendersearchFrom()}
      <Table columns={columns} rowKey="email" {...tableProps} />
      {renderModal()}
    </div>
  )
}
export default Nav1
