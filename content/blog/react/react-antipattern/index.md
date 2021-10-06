---
title: React的反模式
date: "2021-10-06T10:33:23.169Z"
description: React常见的反模式，如何避免这些反模式
---

> 原文地址：https://isamatov.com/react-antipatterns，以下是我的翻译



### React反模式以及如何避免

以下是React应用中最为常见的反模式，以及修正的方法。如果不能在项目早期识别并避免使用这些反模式的话，它们会让代码库变得如同梦魇一般。



### 反模式1：把所有的东西都放在Redux中

Redux非常赞，它会在幕后进行性能优化，并且让我们在React应用中可以很方便的操作和获取全局状态。问题在于很多初学Redux的开发者，会像使用黑魔法一样使用redux去解决他们所遇到的任何问题。

这种做法存在一些缺陷：

- 代码将失去本意，如果所有的东西都塞到Redux里，基本不可能搞清楚应用到底是局部作用域抑或是全局作用域的。修改代码因此会变得非常棘手，因为不确定修改会不会影响到应用的其它部分。
- 当使用Redux处理频繁发生的事件（如追踪表单输入）时，性能会下降。由于Redux会影响应用的全局状态，这必然会导致更多的重新渲染。

**准则：只在Redux中存放真正需要全局访问的数据，例如用户Session或应用主题。**其它内容可以在应用中特定的部分用`Contxt API`来替代。



### 反模式2：把所有的东西都放在`state`中

新手的另外一个问题是没有充分理解和使用`Derived State`的概念。

应用中有很多变量是可以即时计算出来的。例如，有一个存储`checkbox`项目列表的数组，你是不需要在State中保存 `checkedCount`的值的， 可以通过遍历这个数组并过滤出已选择的项目的方式推导出`checkedCount` 的值

**准则: 在保存变量到State之前，问问自己，我是否能够基于已经存储过的变量，通过某种方式的计算推导出来呢？"**



### 反模式3：到处通过展开运算符传递Props

我经常在React应用中会看到这种技巧。

React应用中可以通过`{...props}`向子组件传递`props`，这种方式看起来很简洁，你甚至会觉得你的代码很精练。但是真相是，随着时间的推移，你的代码将会变得不可预测，难以理解。

当你四处使用展开运算符传递`props`时，无法一目了然地知道子组件实际上需要哪些`props`。 重构变得几乎不可能。即使只是很小的重构，可能也会遇上一堆的麻烦事情。此外追踪组件树上的BUG会变得异常困难。

**准则：一般来说要避免展开运算符传递props。** （例外情况：容器组件或者高阶组件（HOC）可以合理使用展开运算符）



### 反模式4：在组件中定义组件

在组件中定义组件，如下所示：

```jsx
import { useState } from "react"

function OuterComponent() {
  const [count, setCount] = useState(0);
  
  const InnerComponent = () => {
    return <p>Hello world {count} </p>
  }
  
  return (
    <div>
      <InnerComponent />
    </div>
  );
}
```

在组件中定义组件，有以下两个弊端：

- 代码变得紧密耦合。内部组件完全依赖外部组件的闭包环境。
- 性能下降。外部组件每次渲染时，都会重新创建子组件的实例。

**准则：避免在组件中定义组件**



### 反模式5：给组件传递过多的信息

组件除了必要的信息，其它的信息知道的越少越好。在决定传递多少数据的时候，要牢记`Smart`组件（智能组件）和`Presentational`组件（纯展示组件）的差异。

`Presentational`组件是纯展示组件，仅仅是输出`HTML`，它不保存任何`state`，不处理任何业务逻辑。

`Smart`组件通常会处理`state`和业务逻辑，通过请求API、操作Redux等方式给展示组件提供数据。 

对纯展示组件，你只需要传递它渲染所必需的数据即可。`Presentational`组件不需要自己决定渲染哪些内容，这些逻辑应该由`Smart`组件来处理。举个栗子，代码如下：

```jsx
import { useSelector } from 'react-redux';
import { getUsers, getCurrentUser } from './selectors/users';

function PresentationalComponent({users, currentUser}) {
  const userFound = users.find(item => item.id===currentUser.id);
  
  if(!userFound) return null;
  return (
    <div>Welcome {userFound.name}</div>
  )
}

function SmartComponet() {
  const users = useSelector(getUsers);
  const currentUser = useSelector(getCurrentUser);
  
  return (
    <div>
      <PresentationalComponent users={users} currentUser={currentUser} />
    </div>
  )
}
```

当你检查父组件时，不清楚子组件是否包含条件渲染的逻辑。我们可以重新组织一下，让代码看起来更清晰。下面的示例中由`Smart`组件来处理条件渲染的逻辑。

```jsx
import { useSelector } from 'react-redux';
import { getUsers, getCurrentUser } from './selectors/users';

function PresentationalComponent({name}) {
  return <div>Welcome {name}</div>
}

function SmartComponet() {
  const users = useSelector(getUsers);
  const currentUser = useSelector(getCurrentUser);
  
  const userFound = users.find(item => item.id===currentUser.id);
  
  return (
    <div>
      {userFound && <PresentationalComponent name={userFound.name} />}
    </div>
  )
}
```

尽可能的传递基本类型的数组给纯展示组件。这样做有益于简化今后的性能优化。下面的示例代码传递了整个`user` 对象：

```jsx
function PresentationalComponent({ user }) {
  return (
    <div>
      <p>
        Welcome {user.firstName} {user.lastName}
      </p>
      <p>Your last login was on {user.date}</p>
    </div>
  );
}
```

如果可以，尽量给`PresentationalComponent`传递基本类型的数据，如`firstName`,` lastName`和`date`

```jsx
function PresentationalComponent({ firstName, lastName, date }) {
  return (
    <div>
      <p>
        Welcome {`${firstName} ${lastName}`}
      </p>
      <p>Your last login was on {date}</p>
    </div>
  );
}
```

这样修改一下，通过`React.memo`的加持，可以显著减少组件重新渲染的次数，从而提高性能。因为React按引用对比对象，按值对比原始类型。（可以查看我翻译的另外一篇博客：https://blog.deathdealer.cn/react/react-render-props/）

总结一下向组件传递过多信息的问题如下：

- 难以区分`Smart`组件和`Presentational`组件。

  主要的业务逻辑应该由`Smart`组件来负责处理，`Presentational`组件只负责输出HTML源码。

- 性能劣化

  当你向组件传递过多的`props`时，每次`props`变化都会重新渲染，这样也会导致很多冗余的渲染。

  

### 反模式6：过度地性能优化

有时候开发者在还没有遇到性能问题时就开始优化性能。这是错误的实践，原因如下：

- 复杂和过度设计的代码

  在问题还没有出现时，就试着去解决问题，代码过于复杂将会是必然结果。

- 浪费时间

  工作不饱和，有这时间还不如去开发新的功能，或者去解决更重要的问题。

根据我的经验，在React应用中正确的区别`Smart`组件和`Presentational`组件可以解决大约`90%`的性能问题。



### 反模式7：巨大的组件树

虽然放在最后一个讲，但绝非最不重要的一个反模式是：巨大的组件树（原作者指的是return后面的jsx部分)

通常地，这个问题会在你没有花费时间去分离业务逻辑代码和界面展示代码时浮现出来。下面是示例：

```jsx
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getUsers, getCurrentUser } from './selectors/users';
import { trackAction } from './tracker';
import { Avatar } from './UserAvatar';

function LargeComponentTree({ user, isAuthenticated, avatar}) {
  const history = useHistory();
  
  return (
    <div>
      {isAuthenticated && avatar && !avatar.isExpired && <Avatar />}
      {isAuthenticated ? (
        <>
        	<p>Welcome! {`${user.first} ${user.last}`}</p>
        	<p>Your last login was on {user.date}</p>
        </>
      ) : null}
      <div>
        <button onClick={()=>{
            history.push('settings');
            trackAction('Click','Settings button clicked.');
        }}>
          Settings
        </button>
        <button onClick={()=>{
            history.push('my_page');
            trackAction('Click','MyPage button clicked.');
        }}>
          My Page
        </button>
        <button onClick={()=>{
            history.push('logout');
            trackAction('Click','Logout button clicked.');
        }}>
          Logout
        </button>
      </div>
    </div>
  )
}
```

很恶心，对吧？ 我们很难读懂这里要干啥，有几个可以改进的地方：

- 将很长的条件语句重构为独立的变量；
- 将整个组件分割为更小的纯展示组件；
- 将几个箭头函数移到组件树外面去；

优化过后的代码如下：

```jsx
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getUsers, getCurrentUser } from './selectors/users';
import { trackAction } from './tracker';
import { Avatar } from './UserAvatar';

// 将整个组件分割为更小的纯展示组件
const Greeting = ({first, last, date}) => {
  return (
    <div>
    	<p>Welcome! {`${first} ${last}`}</p>
    	<p>Your last login was on {date}</p>
    </div>
  )
}

function LargeComponentTree({ user, isAuthenticated, avatar}) {
  const history = useHistory();
  
  // 将很长的条件语句重构为独立的变量；
  const showAvatar = isAuthenticated && avatar && !avatar.isExpired;
  
  // 将几个箭头函数移到组件树外面去
  const handleClick = (route, actionName) =>{
    history.push(route);
    trackAction('Click',actionName);
  }
  
  return (
    <div>
      {showAvatar && <Avatar />}
      {isAuthenticated ? (
        <Greeting first={user.first} last={user.last} date={user.date} />
      ) : null}
      <div>
        <button onClick={handleClick('settings', 'Settings button clicked.')}>
          Settings
        </button>
        <button onClick={handleClick('my_page', 'Settings button clicked.')}>
          My Page
        </button>
        <button onClick={handleClick('logout', 'Logout button clicked.')}>
          Logout
        </button>
      </div>
    </div>
  )
}
```

组件树看起来好多了

**准则：保持组件树的简结清爽，这样更容易看出组件应该渲染什么，以及什么时候渲染。**



### 总结

在这篇博客中，我们了解了React中最常见的反模式，并了解了如何避免它们。在项目初始时就下意识地避免这些反模式，将来可以很轻松的完成重构。关于如何写出整洁的React代码，请参考我的另一篇博客[Tips for writing clean React code ](https://isamatov.com/simple-tips-for-writing-clean-react-components/)

感谢阅读！