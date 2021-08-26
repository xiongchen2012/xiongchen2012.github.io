---
title: React Element
date: "2021-08-26T16:07:23.469Z"
description: React 就像一个孩子。在搞清楚这个世界的每一件小事之前，它都要向每一个你所解释的 【X是Y】 询问 【Y是什么】
---

> React 就像一个孩子。在搞清楚这个世界的每一件小事之前，它都要向每一个你所解释的 【X是Y】 询问 【Y是什么】

元素是一个用来**描述**组件实例或 DOM 节点及其需要属性的普通对象

```javascript
{
	type: ""
  props: {}
}
```

**示例：**

```jsx
const element = <h1 className='greeting'>Hello, world</h1>;
```

`React.createElement()`翻译成element就是：

```javascript
const element = {
  type: "h1"
  props: {
    className: "greeting"
    children: "Hello, world"
  }
}
```

React 元素可以分为两类：

- DOM类型的元素

  DOM类型的元素使用像h1、div、p等DOM节点创建React 元素，可以直接渲染的

- 组件类型的元素

  组件类型的元素使用 React 组件创建React元素，需要递归地最终转成DOM类型的元素才能渲染

React元素描述的是React虚拟DOM的结构，React会根据虚拟DOM渲染出页面的真实DOM。所有的元素组成的树就是`element-tree`



[React 组件，元素和实例](https://zh-hans.reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)

