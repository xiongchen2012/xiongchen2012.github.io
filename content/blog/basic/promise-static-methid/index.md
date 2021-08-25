---
title: Promise的静态方法
date: "2021-03-21T13:48:13.469Z"
description: 整理Promise所有静态方法
---

### 总结

| 方法               | 一句话总结                                                   |
| ------------------ | ------------------------------------------------------------ |
| Promise.all        | 全部的`promise`全部`resolve`才能resolve，只要有一个`reject`就直接`reject`了 |
| Promise.allSettled | 要等到所有promise都已敲定（settled），即每个promise都要`resolve`或`reject` |
| Promise.any        | 只要promise中任何一个 `promise` 变成`resolve`状态，整个就`resolve`了 |
| Promise.race       | 任何promise中任何一个`resolve`就直接`resolved`，有一个`reject`就直接`rejected` |
| Promise.resolve    | `new Promise((resolve,reject)=>resolve())`的简单写法         |
| Promise.reject     | `new Promise((resolve,reject)=>reject())`的简单写法          |

### Promise.resolve和Promise.reject

这两个比较简单：

- `Promise.resolve()`是`new Promise((resolve,reject)=>resolve())`的简单写法；

- `Promise.reject()`是`new Promise((resolve,reject)=>reject())`的简单写法；



### Promise.all

**语法：**

```javascript
Promise.all(iterable)
```

**运行机制：**

- 如果参数是一个空的可迭代对象，直接返回一个`resolved`的Promise
- 如果参数全部都不是`promise`，异步地返回一个`resolved`的Promise
- 其它情况下返回一个 **pending** 的`promise`，之后当参数中所有的promise都**resolve**之后，这个`promise`就转为`resolved`。但是只有其中有一个 `promise` 失败则转为`rejected`。 
- 返回值会按照参数内的 `promise` 顺序排列，而不是由调用 `promise` 的完成顺序决定。

**一句话概括：**

全部的promise**全部resolve**才能resolve，只要**有一个reject**就整个reject了



### Promise.allSettled

**语法：**

```javascript
Promise.allSettled(iterable)
```

**运行机制：**

- `iterable`里所有的promise每一个都必须`resolve`或`reject`才行
- 每个结果对象都有一个 `status` 字符串。如果它的值为 `fulfilled`，则结果对象上存在一个 `value` 。如果值为 `rejected`，则存在一个 `reason` 。value（或 reason ）反映了每个 promise 的结果。

**一句话概括：**

每个promise都要`resolve`或`reject`



### Promise.race

**语法：**

```javascript
Promise.race(iterable)
```

**运行机制：**

- 如果参数是一个空的可迭代对象，将永远等待

- 如果参数里面有不是`promise`的，或者有已经`resolve/reject`的`promise`，就会直接返回第一个找到。

  ```javascript
  Promsie.race([obj, promise1,promise2,promise3,.......]); // promise.resolve(obj)
  Promsie.race([promise1,promise2.reject(err),promise3,.......]); // promise.reject(err)
  Promsie.race([promise1,promise2,promise3,.......]); // 正常流程
  ```

**一句话概括：**

任何promise中任何一个`resolve`就直接`resolved`，有一个`reject`就直接`rejected`



### Promise.any

**语法：**

```javascript
Promise.any(iterable)
```

**运行机制：**

- 和`Promise.all`正好相反

- 如果参数是一个空的可迭代对象，则返回一个`reject`状态的 Promise

- 如果参数不包含任何 `promise`，则返回一个`resvoled`状态的Promise

  

**一句话概括：**

只要promise中任何一个 `promise` 变成`resolve`状态，整个就`resolve`了。如果全部都不能`resolve`则返回`reject`