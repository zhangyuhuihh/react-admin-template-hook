import { useReducer, useEffect } from 'react'
// action type
const DATA_CHANGE = 'DATA_CHANGE'
const STATE_CHANGE = 'STATE_CHANGE'
let id = 0
const DEFAULT_STATE = {
  loading: false,
  current: 1,
  pageSize: 10,
  total: 0,
  order: false,
  field: '',
  listData: [],
  bodyParams: {},
  queryParams: {},
  refreshKey: id
}
// 用作 useReducer 中的 reducer
const reducer = (state, action) => {
  const {
    type,
    data: { listData, ...nextState }
  } = action
  switch (type) {
    case STATE_CHANGE:
      return { ...state, ...nextState }
    case DATA_CHANGE:
      return { ...state, listData, ...nextState }
    default:
      return state
  }
}

function UseTable(api, initState = {}) {
  /**
   * useReducer 的概念和 redux 很像
   * 会返回一个 dispatch 函数，调用的时候传给它一个 action
   * 相应的会有一个 reducer 函数，用于数据处理
   */
  const [
    {
      loading, // 加载态
      current, // 当前页
      pageSize, // 一页多少条
      total, // 总共多少条
      order, // 排序方向
      field, // 排序字段
      listData, // 数据
      bodyParams, // 额外搜索项(body形式)
      queryParams,
      refreshKey // 强制刷新项
    },
    dispatch
  ] = useReducer(reducer, {
    ...DEFAULT_STATE,
    ...initState
  })

  // 获取数据的 hooks
  useEffect(() => {
    let cancel = false
    dispatch({ type: STATE_CHANGE, data: { loading: true } })
    api({ page: current, pageSize, ...queryParams }, { ...bodyParams })
      .then((data) => {
        const _data = data.data
        if (_data) {
          !cancel &&
            dispatch({
              type: DATA_CHANGE,
              data: {
                listData: _data.rows,
                total: _data.total
              }
            })
        }
      })
      .finally(() => dispatch({ type: STATE_CHANGE, data: { loading: false } }))
    // 返回值时页面卸载之后调用的函数
    return () => (cancel = true)
  }, [api, current, pageSize, order, field, bodyParams, queryParams, refreshKey]) // 当这几个状态改变时自动调用函数

  // 搜索事件
  function onSearch({ bodyParams, queryParams }) {
    // 点击搜索按钮 跳到第一页
    !loading &&
      dispatch({ type: STATE_CHANGE, data: { bodyParams, queryParams, current: 1 } })
  }
  // 刷新事件
  function refreshTable() {
    !loading && dispatch({ type: STATE_CHANGE, data: { refreshKey: ++id } })
  }

  // 变更事件
  function onChange(
    { current, pageSize },
    filters,
    { order = false, field = '' }
  ) {
    !loading &&
      dispatch({
        type: STATE_CHANGE,
        data: { current, pageSize, order, field }
      })
  }

  return [
    {
      loading,
      listData,
      pagination: { current, pageSize, total },
    },
    {
      onSearch,
      onChange,
      refreshTable
    }
  ]
}

export default UseTable
