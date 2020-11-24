import React, { useState } from 'react'
import { Button, Tooltip } from 'antd'
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'

const { isValidElement } = React

export function replaceElement(
  element: React.ReactNode,
  replacement: React.ReactNode,
  props: any
): React.ReactNode {
  if (!isValidElement(element)) return replacement

  return React.cloneElement(
    element,
    typeof props === 'function' ? props() : props
  )
}

export function cloneElement(
  element: React.ReactNode,
  props?: any
): React.ReactElement {
  return replaceElement(element, element, props) as React.ReactElement
}

interface Pps {
  children: React.ReactNode
  renderValue?: (v: SimpleEdit) => React.ReactNode | string
  value?: SimpleEdit
  onConfirm?: (v: SimpleEdit) => void
}

function MainComp(props: Pps) {
  const { value, onConfirm } = props
  const [currentValue, setcurrentValue] = useState<SimpleEdit>(value)
  const [editStatus, seteditStatus] = useState('normal')

  const handleClicktime = () => {
    seteditStatus('edit')
    setcurrentValue(value)
  }

  const handleConfirm = async () => {
    try {
      if (onConfirm) {
        onConfirm(currentValue)
        seteditStatus('normal')
      }
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const handleCancel = () => {
    seteditStatus('normal')
  }

  const handleInputChange = (e: any) => {
    // 判断是否是合成事件，如果是，赋值target.value. ps:antd不够统一啊
    if (e !== null && e.constructor.name === 'SyntheticEvent') {
      setcurrentValue(e.target.value)
      return
    }
    setcurrentValue(e)
  }

  const renderValue = () => {
    const { renderValue = (v) => v } = props
    return renderValue(value)
  }

  const renderField = () => {
    const { children } = props
    if (isValidElement(children)) {
      const childProps = { ...children.props }
      childProps.onChange = handleInputChange
      childProps.value = currentValue
      return cloneElement(children, childProps)
    }
  }

  return (
    <div>
      {editStatus === 'normal' ? (
        <>
          <span>{renderValue()}</span>
          <Tooltip title='编辑' color='blue'>
            <EditOutlined onClick={handleClicktime} style={{ marginLeft: 5 }} />
          </Tooltip>
        </>
      ) : (
        <>
          {renderField()}
          <Button
            shape='circle'
            icon={<CheckOutlined />}
            onClick={handleConfirm}
            size='small'
            type='primary'
            style={{ marginLeft: 5 }}
          ></Button>
          <Button
            shape='circle'
            icon={<CloseOutlined />}
            onClick={handleCancel}
            size='small'
            danger
            style={{ marginLeft: 5 }}
          ></Button>
        </>
      )}
    </div>
  )
}

export default MainComp
