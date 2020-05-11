import React, { forwardRef, useImperativeHandle } from 'react'
import { Form, Input, Checkbox } from 'antd'
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
}
const addEditForm = forwardRef((props, ref) => {
  const { cRef } = props
  const [form] = Form.useForm()
  const { initValues } = props
  useImperativeHandle(cRef, () => ({
    form
  }))
  return (
    <Form
      form={form}
      {...layout}
      name="basic"
      initialValues={{ ...initValues }}
      scrollToFirstError={true}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>
    </Form>
  )
})
export default addEditForm
