---
title: valtio简介
date: "2021-03-23T22:46:32.169Z"
description: 介绍一种类似于immer但是使用更简单的状态管理库valtio
---

<img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210323224435352.png" alt="image-20210323224435352" style="zoom:67%;" />

又一个状态管理的轮子。查了一下字典`Valtio`在芬兰语里面就是`状态`的意思，名字起的真是简单粗暴（作者却是个日本人）

#### 安装

```shell
npm install valtio
```

#### 使用

##### 1. 基本使用

官方文档宣称`Valtio`可以让对象拥有自我意识（实际上还是基于Proxy进行对原对象进行了代理）

```javascript
import { proxy } from 'valtio'

const state = proxy({ count: 0 })

setInterval(() => {
  ++state.count
}, 1000)
```

然后就可以在任何地方、像普通的js对象一样直接修改值（Mutate from anywhere）。如果需要在React中使用，可以使用valtio提供的`useSnapshot`

```jsx
import { useSnapshot } from 'valtio'

const Counter = () => {
  const snap = useSnapshot(state)  // 这里的state就是上面proxy代理过的对象
  return (
    <div>
      {snap.count}
      <button onClick={() => ++state.count}>+1</button>
    </div>
  )
}
```

官方把`state`包装成`snapshot`快照，快照的本质是一个`immutable`的对象，个人感觉比immer中对草稿进行修改然后得到一个新的state的概念更容易理解，也更贴近函数组件的本质。

上述示例中，每点击一次【+1】按钮，修改一次state的值,得到一个新的快照，React展示的是当前快照的值。

##### 2. Suspense

如果代理的对象某个字段是`Promise`的话，valtio还支持和Suspense一起使用。

```jsx
const state = proxy({ post: fetch(url).then((res) => res.json()) })

function Post() {
  const snap = useSnapshot(state)
  return <div>{snap.post.title}</div>
}

function App() {
  return (
    <Suspense fallback={<span>waiting...</span>}>
      <Post />
    </Suspense>
  )
}
```

##### 3. 订阅变更

Valtio提供了`subscribe`文法用来订阅state的变更。

```javascript
import { subscribe } from 'valtio'
import { subscribeKey } from 'valtio/utils'

// 可以直接订阅整个state的变更
const unsubscribe = subscribe(state, () => {
  console.log('state has changed to', state)
})

// 也可以只订阅state中某个部分的变更
const unsubscribe = subscribe(state.obj, () => {
  console.log('state.obj has changed to', state.obj)
})

// 如果你想订阅的字段是JS原始类型的话，用subscribeKey更合适一点
const unsubscribe = subscribeKey(state, 'count', v => {
  console.log('state.count has changed to', v)
})
```

别忘了在适当的时候调用一下`unsubscribe`方法来取消订阅

##### 4. 同步更新

默认情况下，state的变更在触发re-render之前是异步的，批处理的。如果想要同步触发re-render可以在`useSnapshot`时传入`{sync: true}`来关闭这个特性

```jsx
function TextBox() {
  const snap = useSnapshot(state, { sync: true })
  return <input value={snap.text} 
              onChange={e => state.text = e.target.value)} />
}
```
##### 5. 在vanilla-js中使用

valtio不仅仅是给react使用的，也可以直接在vanilla中使用，用法基本上与react一样

```javascript
import { proxy, subscribe, snapshot } from 'valtio/vanilla'

const state = proxy({ count: 0, text: 'hello' })

subscribe(state, () => {
  console.log('state is mutated')
  const obj = snapshot(state) // A snapshot is an immutable object
})
```



#### 最后

目前项目才创建了4个月左右，目前github上收获了2.1K个星星，源码也很简单，有兴趣的可以clone下来阅读，很容易理解。项目还处理发展期，期待提供更多实用的API或hooks出来。

和`immer`比较类似，又进一步简化了获得新`state`后的写法，直接使用快照中的值就行了。`immer`的话还要自己处理。



[项目地址](https://github.com/pmndrs/valtio)
