import { useState } from 'react'

const useModal = () => {
  const [modalTitleName, setModalTitleName] = useState('新增')
  const [modalvisible, setModalVisible] = useState(false)
  return [
    {
      modalTitleName,
      modalvisible
    },
    {
      setModalTitleName,
      setModalVisible
    }
  ]
}

export default useModal
