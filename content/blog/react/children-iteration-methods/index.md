---
title: React Children Utilities
date: "2021-08-31T23:05:13.469Z"
description: 这篇博客，我们将会讨论和学习如何对React children进行遍历。特别是我们会深入研究一下React提供的React.Children.toArray方法，它可以确保遍历children时的性能和准确性。
---

> [原文地址](https://www.smashingmagazine.com/2021/08/react-children-iteration-methods/)，下面是我的翻译

**摘要** 这篇博客，我们将会讨论和学习如何对`React children`进行遍历。特别是我们会深入研究一下React提供的`React.Children.toArray`方法，它可以确保遍历`children`时的性能和准确性。

### 前言

React开发者用的最明显最多的`prop`可能就是`children`了，大部分情况下，其实不需要知道和理解`children`长啥样。但有时候我们可能会用另外的`element/component`封装`children`，或者对它们进行排序，或者获取部分切片（slice），这些情况下，就必须要知道`children`长啥样了。

这篇博客主要是学习一下React工具方法 `React.Children.toArray` ，它可以让我们观察和遍历 `children` , 同时也会介绍它的一些缺点以及如何克服这些缺点。如果你了解React的基础知识并且知道一点点`children`，那这篇博客就是为你准备的。



### 遍历子组件

在使用React时，大多数时候我们不会接触`children prop`，而只是会直接在React组件中使用它，如下：

```jsx
function Parent({ children }) {
  return <div className="mt-10">{children}</div>;
}
```

但有时候却必须遍历`children`，这样我们就可以增强或更改子组件，而不必让子组自己去搞事情。 一共典型的场景是在父组件在遍历的过程中把索引（数组下标）信息传递给子组件，如下面代码所示：

```jsx
import { Children, cloneElement } from "react";

function Breadcrumbs({ children }) {
  const arrayChildren = Children.toArray(children);

  return (
    <ul
      style={{
        listStyle: "none",
        display: "flex",
      }}
    >
      {Children.map(arrayChildren, (child, index) => {
        const isLast = index === arrayChildren.length - 1;

        if (!isLast && !child.props.link ) {
          throw new Error(
            `BreadcrumbItem child no. ${index + 1}
            should be passed a 'link' prop`
          )
        } 

        return (
          <>
            {child.props.link ? (
              <a
                href={child.props.link}
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                }}
              >
                <div style={{ marginRight: "5px" }}>
                  {cloneElement(child, {
                    isLast,
                  })}
                </div>
              </a>
            ) : (
              <div style={{ marginRight: "5px" }}>
                {cloneElement(child, {
                  isLast,
                })}
              </div>
            )}
            {!isLast && (
              <div style={{ marginRight: "5px" }}>
                >
              </div>
            )}
          </>
        );
      })}
    </ul>
  );
}

function BreadcrumbItem({ isLast, children }) {
  return (
    <li
      style={{
        color: isLast ? "black" : "blue",
      }}
    >
      {children}
    </li>
  );
}

export default function App() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem link="https://goibibo.com/">
        Goibibo
      </BreadcrumbItem>

      <BreadcrumbItem link="https://goibibo.com/hotels/">
        Hotels
      </BreadcrumbItem>

      <BreadcrumbItem>
       A Fancy Hotel Name
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
```

可以通过 [Codesandbox](https://codesandbox.io/embed/sm-article-21-lt6le?fontsize=14&hidenavigation=1&theme=dark) 来体验一下上面的代码，我们做了以下几件事情：

1. 调用 `React.Children.toArray` 方法确保 `children prop` 始终是一个数组。如果我们不这么做的话，在获取 `children.length` 时可能会崩掉，因为 `children` 可能是对象，也可能是数组，甚至可能是函数。此外，如果在`children`上调用数组的 `.map` 方法也可能会崩。
2. 在父组件 `Breadcrumbs` 中通过调用`React.Children.map`方法来遍历它的子组件。
3. 我们在迭代器（遍历函数）中使用了 `index`  (`React.Children.map`的第二个参数) ，因此，我们可以判断`child`是不是最后一个。
4. 如果是最后一个子组件，我们会克隆这个子组件并将`isLast`传给它，这样它就可以基于`isLast`应用一些样式。
5. 如果不是最后一个子组件，我们则必须确保这些子组件必须有`link`这个属性，否则会抛出一个错误。我们同样像第4步一样克隆一个子组件，并把`isLast`传给它，此外还会把它包裹在`<a>`标签里。

 `Breadcrumbs` 和 `BreadcrumbItem` 的使用者不需要关心哪一个子组件需要传`link`，也不需要关心如何应用样式， `Breadcrumbs` 组件内部会自动处理这些事情。

这种隐式传递`props`的模式**和/或**在父组件中将  `state`及`state` 更新函数作为`props`传递给子组件的模式叫作 [复合组件模式](https://kentcdodds.com/blog/compound-components-with-react-hooks/)。 你可能对React Router的`Switch`组件中的这种模式比较熟悉，它把`Route`组件作为子组件：

```jsx
// react-router文档中的示例（https://reactrouter.com/web/api/Switch）

import { Route, Switch } from "react-router";

let routes = (
  <Switch>
    <Route exact path="/">
      <Home />
    </Route>
    <Route path="/about">
      <About />
    </Route>
    <Route path="/:user">
      <User />
    </Route>
    <Route>
      <NoMatch />
    </Route>
  </Switch>
);
```

现在已经确定的是，有时候需要调用`React.Children.map` 和 `React.Children.toArray`方法遍历它的 `children props` , 我们先回顾一下其中之一：`React.Children.toArray`.

### React.Children.toArray

先看一个例子，看看它能做什么，它在哪里可能有用

```jsx
import { Children } from 'react'

function Debugger({children}) {
  console.log(children);
  console.log(
    Children.toArray(children)
  )
  return children;
}

const fruits = [
  {name: "apple", id: 1},
  {name: "orange", id: 2},
  {name: "mango", id: 3}
]

export default function App() {
  return (
    <Debugger>
        <a
          href="https://css-tricks.com/"
          style={{padding: '0 10px'}}
        >
          CSS Tricks
        </a>

        <a
          href="https://smashingmagazine.com/"
          style={{padding: '0 10px'}}
        >
          Smashing Magazine
        </a>

        {
          fruits.map(fruit => {
            return (
              <div key={fruit.id} style={{margin: '10px'}}>
                {fruit.name}
              </div>
            )
          })
        }
    </Debugger>
  )
}
```

可以通过 [Codesandbox ](https://codesandbox.io/embed/sm-article-22-hhuws?fontsize=14&hidenavigation=1&theme=dark)来体验上面的代码。示例中的 `Debugger` 组件在渲染方面除了原样返回`children`组件以外什么都没做。 渲染之外则打印了 `children` 和`React.Children.toArray(children)`的值。

如果你打开浏览器的开发者控制台，你就可以看到两者的不同之处：

 <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210831165816562.png" alt="image-20210831165816562" style="zoom:50%;" />

- 第一个 `children` 的结构和值如下：

```javascript
[
  Object1, ----> 第一个<a>标签：CSS Tricks
  Object2, ----> 第二个<a>标签：Smashing Magazine
  [
    Object3, ----> fruits第1个元素：apple
    Object4, ----> fruits第2个元素：orange
    Object5  ----> fruits第3个元素：mango
  ]
]
```

- 第二个 `React.Children.toArray(children)` 的结构和值如下：

```javascript
[
  Object1, ----> 第一个<a>标签：CSS Tricks
  Object2, ----> 第二个<a>标签：Smashing Magazine
  Object3, ----> fruits第1个元素：apple
  Object4, ----> fruits第2个元素：orange
  Object5, ----> fruits第3个元素：mango
]
```

通过[React的文档](https://zh-hans.reactjs.org/docs/react-api.html#reactchildrentoarray)来理解发生的事情：

> `React.Children.toArray` 将 `children` 这个复杂的数据结构以数组的方式扁平展开并返回，并为每个子节点分配一个 key。当你想要在渲染函数中操作子节点的集合时，它会非常实用，特别是当你想要在向下传递 `this.props.children` 之前对内容重新排序或获取子集时。

分解一下：

1. **以数组形式扁平化并返回`children` 复杂的数据结构**

正如上面示例所看到的，`React.Children.toArray`会把 `children` （复杂的数组结构，前面提到过它可能是对象，数组甚至是函数）转化成一个扁平的数组并返回。此外有个 [Issue](https://github.com/facebook/react/issues/6889#issuecomment-221858162) 解释了它的行为：

> 它 (`React.Children.toArray`) 并不会把子组件取出来并扁平化他们，这没有任何意义。它会扁平化嵌套的数组或对象，例如 `[['a', 'b'],['c', ['d']]]` 会被扁平化成`['a', 'b', 'c', 'd']`.

```javascript
React.Children.toArray(
  [
    ["a", "b"],
    ["c", ["d"]]
  ]
).length === 4;
```

2. **为每个元素分配一个key**

还是以上面的为例，下面是`console.log(children)` 展开一个元素后的内容：

```javascript
{
  $$typeof: Symbol(react.element),
  key: null,
  props: {
    href: "https://smashingmagazine.com",
    children: "Smashing Magazine",
    style: {padding: "0 10px"}
  },
  ref: null,
  type: "a",
  // … 
}
```

下面是`console.log(React.Children.toArray(children))` 展开一个元素后的内容

```javascript
{
  $$typeof: Symbol(react.element),
  key: ".0",
  props: {
    href: "https://smashingmagazine.com",
    children: "Smashing Magazine",
    style: {padding: "0 10px"}
  },
  ref: null,
  type: "a",
  // … 
}
```

正如你看到的，除了扁平化 `children` 以外，会为每一个子元素添加一个唯一的`key`属性，React文档如下：

> `React.Children.toArray()` 在拉平展开子节点列表时，更改 key 值以保留嵌套数组的语义。也就是说，`toArray` 会为返回数组中的每个 key 添加前缀，以使得每个元素 key 的范围都限定在此函数入参数组的对象内。

因为 `.toArray` 方法可能会改变`children`的顺序和位置，所以必须为每个元素分配一个唯一的`key`，以便React在协调（一致性比较）和渲染时进行优化。（参考 [reconciliation and rendering optimization](https://reactjs.org/docs/reconciliation.html#recursing-on-children)）

重点关注一下 *`使得每个元素 key 的范围都限定在此函数入参数组的对象内`*，请看第2个数组中的每个元素的`key` (对应 `console.log(React.Children.toArray(children))`)

```javascript
.0  ----> first link
.1  ----> second link
.2:$1 ----> first fruit
.2:$2 ----> second fruit
.2:$3 ----> third fruit
```

`fruits`是原始`children`中的一个嵌套数组，它们的`key`都以 `.2`作为前缀。 `.2`对应的事实是他们也是数组的一部分。后缀 `:$1` ,`:$2`, `:$3`对应`fruits` 产生的`<div>`元素，如果我们用数组索引作为`key`，相应的我们会分配到 `:0`, `:1`, `:2` 这样的后缀。

假设`children`中有三层嵌套，如下所示：

```jsx
import { Children } from 'react'

function Debugger({children}) {
  const retVal = Children.toArray(children)
  console.log(
    Children.map(retVal, child => {
      return child.key
    }).join('\n')
  )
  return retVal
}

export default function App() {
  const arrayOfReactElements = [
    <div key="1">First</div>,
    [
      <div key="2">Second</div>,
      [
        <div key="3">Third</div>
      ]
    ]
  ];
  return (
    <Debugger>
      {arrayOfReactElements}
    </Debugger>
  )
}
```

分配的`key`如下：

```javascript
.$1
.1:$2
.1:1:$3
```

可以通过 [Codesandbox ](https://codesandbox.io/embed/sm-article-23-5fwrd?fontsize=14&hidenavigation=1&theme=dark)来体验上面的代码， `$1`, `$2`, `$3` 后缀是因为我们给React组件显式地指定了`key` 否则React 会报怨缺少`key`

从上面的内容中，我们可以得出`React.Children.toArray`的两个用例。

1. 如果业务中需要 `children` 必须是一个数组，可以用`React.Children.toArray(children)` 替代，哪怕`children`是对象或者函数，它也能完美的工作。
2. 如果你必须对`children`进行排序、过滤、切片等，你可以信赖 `React.Children.toArray` 可以始终为所有的子组件生成唯一的`key`。



### 问题

`React.Children.toArray`也有一些问题，代码如下：

```jsx
import { Children } from 'react'

function List({children}) {
  return (
    <ul>
      {
        Children
          .toArray(children)
          .map((child, index) => <li key={child.key}>{child}</li>)
      }
    </ul>
  )
}

export default function App() {
  return (
    <List>
      <a
        href="https://css-tricks.com"
        style={{padding: '0 10px'}}
      >
        Google
      </a>
      <>
        <a
          href="https://smashingmagazine.com"
          style={{padding: '0 10px'}}
        >
          Smashing Magazine
        </a>
        <a
          href="https://arihantverma.com"
          style={{padding: '0 10px'}}
        >
          {"Arihant’s Website"}
        </a>
      </>
    </List>
  )
}
```

可以通过 [Codesandbox](https://codesandbox.io/embed/sm-article-24-dqld3?fontsize=14&hidenavigation=1&theme=dark)体验上述代码。 如果观察`React.Fragment(<>...</>)`的子节点，你就会发现 `li` 标签中一下子渲染出两个`<a>`标签。如下图所示：

 <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210831204750481.png" alt="image-20210831204750481" style="zoom:50%;" />

这是因为 `React.Children.toArray`不会遍历`React.Fragment`（ [参考这个Issue](https://github.com/facebook/react/issues/6889) ）。那我们可以做些什么呢？幸运的是啥也不用做。因为有一个开源的库 [`react-keyed-flatten-children`](https://github.com/grrowl/react-keyed-flatten-children)替我们做了这些事情。

用伪代码（实际的代码用注释来对应到下面6点）说明一下这个库做了什么：

1. 这是一个函数，它只需要一个`children`作为必要的参数；
2. 遍历 `React.Children.toArray(children)` 并将子元素收集到累加器数组中；
3. 遍历的过程中，如果子节点是`string`或`number`，直接把值存入累加器数组中；
4. 如果子节点是有效的React组件，则先克隆一份，并分配一个适合的key，然后存入累加器数组中；
5. 如果子节点是`React.Fragment`，函数把`<></>`的`children`作为参数来调用自身 (递归调用) ，然后将递归调用的结果存入累加器数组中；
6. 在进行上述步骤时，会记录遍历的深度，所以`React.Fragment`的子节点会分配正确的`key`。嵌套数组的`key`也会进行相同的处理。

```javascript
import {
  Children,
  isValidElement,
  cloneElement
} from "react";

import { isFragment } from "react-is";

import type {
  ReactNode,
  ReactChild,
} from 'react'

/*************** 1. ***************/
export default function flattenChildren(
  // 唯一必须的参数
  children: ReactNode,
  // only used for debugging
  depth: number = 0,
  // is not required, start with default = []
  keys: (string | number)[] = [] 
): ReactChild[] {
  /*************** 2. ***************/
  return Children.toArray(children).reduce(
    (acc: ReactChild[], node, nodeIndex) => {
      if (isFragment(node)) {
        /*************** 5. ***************/
        acc.push.apply(
          acc,
          flattenChildren(
            node.props.children,
            depth + 1,
            /*************** 6. ***************/
            keys.concat(node.key || nodeIndex)
          )
        );
      } else {
        /*************** 4. ***************/
        if (isValidElement(node)) {
          acc.push(
            cloneElement(node, {
              /*************** 6. ***************/
              key: keys.concat(String(node.key)).join('.')
            })
          );
        } else if (
          /*************** 3. ***************/
          typeof node === "string"
          || typeof node === "number"
        ) {
          acc.push(node);
        }
      }
      return acc; 
    },
    /*************** Acculumator Array ***************/
    []
  );
}
```

对同样的示例，我们通过这个函数来解决之前的问题，代码如下：

```jsx
import flattenChildren from 'react-keyed-flatten-children'
import { Fragment } from 'react'

function List({children}) {
  return (
    <ul>
      {
        flattenChildren(
          children
        ).map((child, index) => {
          return <li key={child.key}>{child}</li>
        })
      }
    </ul>
  )
}
export default function App() {
  return (
    <List>
      <a
        href="https://css-tricks.com"
        style={{padding: '0 10px'}}
      >
        Google
      </a>
      <Fragment>
        <a
          href="https://smashingmagazine.com"
          style={{padding: '0 10px'}}>
          Smashing Magazine
        </a>
        
        <a
          href="https://arihantverma.com"
          style={{padding: '0 10px'}}
        >
          {"Arihant’s Website"}
        </a>
      </Fragment>
    </List>
  )
}
```

可以通过 [Codesandbox](https://codesandbox.io/embed/sm-article-25-b76gn?fontsize=14&hidenavigation=1&theme=dark) 查看最终的结果，**It works！**

这个函数的github仓库里有 [7 个测试用例](https://github.com/grrowl/react-keyed-flatten-children/blob/master/index.spec.tsx) ，通过阅读这些测试用例来推导这个函数的功能也是很有意思的。



###  `Children` 工具类长期存在的问题 

> `React.Children` 是一个有缺陷的抽象，并且处理维护模式。
>
> — [丹大师](https://github.com/reactjs/rfcs/pull/61#issuecomment-431247764)

使用`Children`工具类的方法改变 `children` 行为的问题是：它在组件只有1层嵌套时才能工作。如果当我们把 `children` 包裹在另外一个组件时，就会失去可组合性。还是以第1个面包屑的示例来解释我在说啥：

```jsx
import { Children, cloneElement } from "react";

function Breadcrumbs({ children }) {
  return (
    <ul
      style={{
        listStyle: "none",
        display: "flex",
      }}
    >
      {Children.map(children, (child, index) => {
        const isLast = index === children.length - 1;
        // if (! isLast && ! child.props.link ) {
        //   throw new Error(`
        //     BreadcrumbItem child no.
        //     ${index + 1} should be passed a 'link' prop`
        //   )
        // } 
        return (
          <>
            {child.props.link ? (
              <a
                href={child.props.link}
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                }}
              >
                <div style={{ marginRight: "5px" }}>
                  {cloneElement(child, {
                    isLast,
                  })}
                </div>
              </a>
            ) : (
              <div style={{ marginRight: "5px" }}>
                {cloneElement(child, {
                  isLast,
                })}
              </div>
            )}
            {!isLast && (
              <div style={{ marginRight: "5px" }}>></div>
            )}
          </>
        );
      })}
    </ul>
  );
}

function BreadcrumbItem({ isLast, children }) {
  return (
    <li
      style={{
        color: isLast ? "black" : "blue",
      }}
    >
      {children}
    </li>
  );

}
const BreadcrumbItemCreator = () =>
  <BreadcrumbItem link="https://smashingmagazine.com">
    Smashing Magazine
  </BreadcrumbItem>

export default function App() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem link="https://goibibo.com/">
        Goibibo
      </BreadcrumbItem>

      <BreadcrumbItem link="https://goibibo.com/hotels/">
        Goibibo Hotels
      </BreadcrumbItem>

      <!-- 再包裹一层 -->
      <BreadcrumbItemCreator />

      <BreadcrumbItem>
        A Fancy Hotel Name
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
```

通过 [Codesandbox ](https://codesandbox.io/embed/sm-article-26-7067h?fontsize=14&hidenavigation=1&theme=dark) 看一下效果吧。尽管新的组件 `<BreadcrumbItemCreator />` 正常渲染了，但是是因为`Breadcrumb` 组件没有办法获取到`link`属性，所以没办法以`<a>`形式来包裹`child`。

为了解决这个问题，React团队亲自下场推出了一个实验性的API： [react-call-return](https://www.npmjs.com/package/react-call-return)（**现在已经失效了**）

[Ryan Florence的视频](https://www.youtube.com/watch?v=60MfXWyQhRE) 解释了问题的细节以及 `react-call-return` 是如何解决这个问题的。因为这个npm包从未在任何版本的React中发布过，所以他们计划从这个包中汲取灵感，开发出可用于生产环境的解决方案。 [可以参考丹大师的这个Comment](https://github.com/reactjs/rfcs/pull/61#issuecomment-584402735)



### 总结

最后总结一下，我们学到了：

1. `React.Children` 的两个工具类 ：如何使用 `React.Children.map` 方法来构建复合组件，并深入学习了另一个方法`React.Children.toArray` ；
2. 学习了 `React.Children.toArray` 是如何把 `children` （可能是对象，数组或函数）转换成扁平化数组的方式。这样就可以按需操作，如排序、过滤，切片等；
3. 学习了 `React.Children.toArray` 不会遍历`React Fragments`内的子组件
4. 学习了一个开源npm包 `react-keyed-flatten-children` ，并且学习了它是如何解决第3点问题的方法。
5. 了解到 `Children` 工具类处于维护模式，因为他们不能很好的组合。



### 参考资料

- [Compound components with react hooks](https://kentcdodds.com/blog/compound-components-with-react-hooks/)
- [React.Children.toArray array flattening github issue explanation](https://github.com/facebook/react/issues/6889#issuecomment-221858162)
- [React reconciliation: Recursing on children](https://reactjs.org/docs/reconciliation.html#recursing-on-children)
- [`React.Children.toArray` doesn’t traverse into fragments](https://github.com/facebook/react/issues/6889)
- [`react-keyed-flatten-children`](https://github.com/grrowl/react-keyed-flatten-children)
- [`react-keyed-flatten-children`](https://github.com/grrowl/react-keyed-flatten-children/blob/master/index.spec.tsx) [tests](https://github.com/grrowl/react-keyed-flatten-children/blob/master/index.spec.tsx)
- [react-call-return](https://www.npmjs.com/package/react-call-return)
- [Ryan Florence’s Video explaining react-call-return](https://www.youtube.com/watch?v=60MfXWyQhRE)
- [React team’s plan to replace `Children` utilities with something more composable](https://github.com/reactjs/rfcs/pull/61#issuecomment-584402735)
- [Max Stoiber’s `React Children` Deep Dive](https://mxstbr.blog/2017/02/react-children-deepdive/)
- [`React.Children` is a leaky abstraction, and is in maintenance mode](https://github.com/reactjs/rfcs/pull/61#issuecomment-431247764)

