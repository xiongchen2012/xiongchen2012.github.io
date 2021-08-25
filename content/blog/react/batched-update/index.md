---
title: 如何获取正确的setState之后的值
date: "2021-08-25T21:43:13.469Z"
description: 从React源码角度看如何正确的获取setState之后的值
---



### 两种方法

- 在`setState`的回调函数中，可以获取到更新后的`state`值
- 把`setState`放在`setTimeout`中调用，可以立马获取到更新的`state`值

重点讲第二种，因为在当前的React版本中还是可以的，未来可能会有问题。



### React的三种渲染模式

- legacy模式：`ReactDOM.render(<App/>, rootNode)`，当前React使用的模式
- blocking模式：`ReactDOM.createBlockingRoot(rootNode).render(<App />)`，过渡到`ConcurrentMode`的一步，可以忽略
- concurrent模式：`ReactDOM.createRoot(rootNode).render(<App />)`，未来稳定之后，是 React 的默认开发模式。



### 源码

```javascript
// 源码路径：react-reconciler/src/ReactFiberWorkLoop.old.js

export function batchedUpdates<A, R>(fn: A => R, a: A): R {
  const prevExecutionContext = executionContext;
  executionContext |= BatchedContext;
  try {
    return fn(a);  // 这里的fn就是调用了setState的函数
  } finally {
    executionContext = prevExecutionContext;
    if (
      executionContext === NoContext &&
      !(__DEV__ && ReactCurrentActQueue.isBatchingLegacy)
    ) {
      resetRenderTimer();
      flushSyncCallbacksOnlyInLegacyMode(); 
    }
  }
}

export function scheduleUpdateOnFiber() {
  // ....省略无关代码
  if (
    lane === SyncLane &&  // legacy模式的时候，泳道是同步的！
    executionContext === NoContext &&  // 如果放在setTimeout中执行setState,条件为true
    (fiber.mode & ConcurrentMode) === NoMode &&
    !(__DEV__ && ReactCurrentActQueue.isBatchingLegacy)
  ) {
    resetRenderTimer();
    // 同步更新state值
    flushSyncCallbacksOnlyInLegacyMode(); 
  }

  return root;
}
```



### 结论

- Legacy模式：`setState`是异步执行的，但如果放在`setTimeout`中执行，`setState`是**同步执行**的；
- Concurrent：`setState`始终是异步执行的，所以第二种方法可能会失效了



### 演示地址

[codesandbox](https://codesandbox.io/s/young-thunder-be5p9?file=/src/index.js)

