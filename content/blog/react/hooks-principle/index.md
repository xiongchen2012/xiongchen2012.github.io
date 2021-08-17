---
title: Hooks的实现原理（1）
date: "2021-08-17T13:48:13.469Z"
description: 当使用 Hook 特性编写组件的时候时候，总能感觉到它的简洁和方便。当然，「天下没有免费的午餐」，它牺牲了可读性并且存在内存泄漏风险。但这并不妨碍探索它的魔力。
---

> [React Hooks: Not MAGIC, Just Arrays](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)

#### useState 的实现原理

先看useState的原型：

```javascript
const [state,setState] = useState(initalState)
```

`useState`的输入是state的初始值，输出是返回一个元组`[state,state的setter函数]`，其中的`state`会被`render函数`引用到，调用`setter函数`会除了会设置新的state之外还会更新UI（通过调用`render()`函数实现）

现实中的UI组件不可能只有一个state变量，useState会被多次调用，所以这些state会被保存到一个容器中，这个容器其实就是朴实无华的数组。具体过程如下：

- 第一次渲染时候，根据 useState 顺序，逐个声明 state 并且将其放入全局 Array 中。每次声明 state，都要将 cursor 增加 1。
- 调用`setter函数`时，会将相应的`state`值更新，同时触发再次渲染的时候。**cursor 被重置为 0**。按照 useState 的声明顺序，依次拿出最新的 state 的值，视图更新，过程如下图所示：

 <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210817154008415.png" alt="image-20210817154008415" style="zoom:45%;" />

最简易的使用数组模拟的useState实现代码如下：

```typescript
const memoizedState:any = []
let cursor:number = 0

function useState<T>(initialState:T): [T, (newState:T) => void]{
  const currentCursor = cursor
  // 第一次render时用初始值，后面都会使用容器中的值
  memoizedState[currentCursor] = memoizedState[currentCursor] || initialState 
  
  // setter，应用了闭包
  function setState(newState:T){
    memoizedState[currentCursor] = newState
    render() //更新UI
  }
  
  ++cursor
  return [memoizedState[currentCursor], setState]
}
```

真实的React实现肯定比上面模拟的复杂多了，但是本质也只是使用了`单向链表`替代`数组`，不需要再使用`cursor`来处理位置，而是使用`next`方法来串联起所有的hooks，如下图所示：

 <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210817153242989.png" alt="image-20210817153242989" style="zoom:45%;" />



##### Dispatcher

`Dispatcher`起到的作用与SpringMVC中的`DispatcherServlet`类似，是Hooks机制下对外统一暴露的控制器，渲染过程中，通过`enableHooks`标志位控制启用`Dispatcher`或`DispatcherWithoutHooks`，它的核心作用是防止hooks在异常的地方被调用了。

##### Hooks queue

Hooks的表现就是按照调用顺序被链接在一起的节点（nodes），React中每一个hook的节点不能再独立去看了，而应该把他们组织到一个`queue`中，如下所示：

```json
{
  memoizedState: 'foo',
  next: {
    memoizedState: 'bar',
    next: {
      memoizedState: 'baz',
      next: null
    }
  }
}
```

根据React源码中Hoos的TS定义，也可以清楚的看到这个Queue的模样：

```typescript
export type Hook = {
  memoizedState: any,
  baseState: any,
  baseUpdate: Update<any> | null,
  queue: UpdateQueue<any> | null,
  next: Hook | null,
};
```

比较有疑问的是`baseState`，`baseUpdate`，`queue`这三个东西是什么，可以看一下`useState`的实现：

```typescript
export function useState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  return useReducer(
    basicStateReducer,
    // useReducer has a special case to support lazy useState initializers
    (initialState: any),
  );
}
```

这里发现`useState`竟然是`useReducer`特定的一种具体实现，难怪官网关于[useReducer的说明](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer) 时说明了它是`useState`的替代方案，当时没理解，现在懂了。

回到Hook的定义，各个参数的意义就明确了。

```typescript
export type Hook = {
  memoizedState: any,  // hook更新后的缓存state
  baseState: any,      // 其实就是initialState
  baseUpdate: Update<any> | null, // 最近一次调用更新state方法的action
  queue: UpdateQueue<any> | null, // 调度操作的队列，等待进入reducer
  next: Hook | null,   // 下一个hook，通过它串联起所有hooks
};
```



#### 参考链接

[React Hooks 底层解析](https://juejin.cn/post/6844904032708853767)

[React Hooks 原理](https://github.com/brickspert/blog/issues/26)

[Under the hood of React’s hooks system](https://medium.com/the-guild/under-the-hood-of-reacts-hooks-system-eb59638c9dba)

[React-ReactFiberHooks源码](https://github.com/facebook/react/blob/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberHooks.js#L336)

