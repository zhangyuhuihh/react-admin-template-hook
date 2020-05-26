import React, {
  forwardRef,
  useImperativeHandle
} from 'react'
import { Form, Input } from 'antd'


const SearchBar = forwardRef((props, ref) => {
  const [form] = Form.useForm()
  const { submit } = props 

  useImperativeHandle(ref, () => ({
    form
  }))

  return (
    <Form layout="inline" form={form}>
      <Form.Item name="keywords">
        <Input.Search
          placeholder="输入名称搜索"
          style={{ width: 240 }}
          onSearch={submit}
        />
      </Form.Item>
    </Form>
  )
})

export default SearchBar
