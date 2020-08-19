import React, { useState } from 'react'
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { routeList } from './config'
import _ from 'lodash'

const length1 = APP_SIZE.width * 0.5
const length2 = APP_SIZE.width * 0.25
// 1。决定布局的代码 数据要先分组
// 2. 决定显示的代码

const list = [1, 2, 3, 4, 5, 6, 7, 8] // 首先切割数组1133长度

const sliceArray = (array) => {
  let result = []
  for (let i = 0; i < array.length; i++) {
    if (i % 8 === 0 || i % 8 === 1) {
      result.push([array[i]])
    }
    if (i % 8 === 2 || i % 8 === 5) {
      result.push([array[i], array[i + 1], array[i + 2]])
    }
  }
  return result
}

const commomBlockStyle = {
  padding: 2,
  borderWidth: 2,
  borderColor: '#ffffff',
}

function HomePage() {
  const navigation = useNavigation()

  const [slicedList, setSlicedList] = useState(() => {
    return sliceArray(routeList)
  })

  const isEven = () => slicedList.length % 2 === 0

  const halfBlock = (item) => {
    return (
      <View
        key={item.path}
        style={{
          width: length1,
          height: length1 * 0.5,
          backgroundColor: '#E55B93',
          ...commomBlockStyle,
        }}
      />
    )
  }

  const quarterBlock = (item) => {
    return (
      <View
        key={item.path}
        style={{
          width: length2,
          height: length2,
          backgroundColor: '#2FA183',
          ...commomBlockStyle,
        }}
      />
    )
  }

  const resolveOneCell = (item) => {
    return (
      <View
        key={item.path}
        style={{
          width: length1,
          height: length1,
          backgroundColor: '#4963A9',
          ...commomBlockStyle,
        }}
      />
    )
  }

  const resolveTwoCell = (item) => {
    return (
      <View
        style={{
          width: length1,
          height: length1,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {item.map((item2) => {
          return halfBlock(item2)
        })}
      </View>
    )
  }

  const resolveThreeCell = (item) => {
    return (
      <View
        style={{
          width: length1,
          height: length1,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {item.map((item2, index) => {
          if (item2) {
            if (index === 0) {
              return halfBlock(item2)
            } else {
              return quarterBlock(item2)
            }
          } else {
            return null
          }
        })}
      </View>
    )
  }
  const resolveFourCell = (item) => {
    return (
      <View
        style={{
          width: length1,
          height: length1,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {item.map((item2) => {
          return quarterBlock(item2)
        })}
      </View>
    )
  }

  const resolveOuterCell = (item, index) => {
    if (item.length === 1) {
      if (isEven() && index === slicedList.length - 1) {
        setSlicedList((currentlist) => {
          let len = currentlist.length
          let newArr = currentlist.slice(0, len - 1)
          newArr[newArr.length - 1] = [
            ...currentlist[len - 1],
            ...currentlist[len - 2],
          ]
          return newArr
        })
      }
      return resolveOneCell(item)
    }

    if (item.length === 2) {
      return resolveTwoCell(item)
    }

    if (item.length === 3) {
      if (!isEven() && index === slicedList.length - 1) {
        let arr = item.filter((v) => v)
        if (arr.length === 1) {
          return resolveOneCell(arr)
        }
        if (arr.length === 2) {
          return resolveTwoCell(arr)
        }
      }

      if (isEven() && index === slicedList.length - 1) {
        let len = slicedList.length
        let arr = item.filter((v) => v)
        if (arr.length === 3) {
          let newList = _.cloneDeep(slicedList)
          newList[len - 1] = [slicedList[len - 1][0], slicedList[len - 1][1]]
          newList.push([slicedList[len - 1][2]])
          setSlicedList(newList)
        }
        if (arr.length === 2) {
          let newList = _.cloneDeep(slicedList)
          newList[len - 1] = [slicedList[len - 1][0]]
          newList.push([slicedList[len - 1][1]])
          setSlicedList(newList)
        }
        if (arr.length === 1) {
          let newList = slicedList.slice(0, len - 1)
          newList[newList.length - 1] = [
            ...slicedList[len - 2],
            slicedList[len - 1][0],
          ]
          setSlicedList(newList)
        }
      }
      return resolveThreeCell(item)
    }

    if (item.length === 4) {
      return resolveFourCell(item)
    }
  }

  return (
    <ScrollView>
      <View style={styles.routesContainer}>
        {resolveOneCell('999999')}
        {slicedList.map((item, index) => {
          return <View key={index}>{resolveOuterCell(item, index)}</View>
        })}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  routesContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})

export default HomePage
