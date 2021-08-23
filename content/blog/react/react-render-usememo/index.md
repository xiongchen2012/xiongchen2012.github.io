---
title: React Rendering教程（3） - useMemo
date: "2021-08-23T20:10:28.128Z"
description: 子组件用memo包裹时，即使它的props没有变化，父组件渲染时为什么仍然会重新渲染？

---

> [原文地址](https://alexsidorenko.com/blog/react-render-usememo/)

快速示例：

子组件被 `memo`包裹，传递一个`options`给它用于控制是否显示一个侧边栏（当用户的角色更新为"Admin"时，`showSidebar=true`否则为`false`）。但从下图的效果来看，即使只是改变了用户名，子组件依然发生了重新渲染。如何防止这种情况的发生？

 <img src="https://alexsidorenko.com/3438d0c4aa87e131614b1d4d23b59fca/quiz.gif" alt="" style="zoom:50%;" />

是不是应该在计算 `showSidebar` 外面使用 `useMemo` ？且往下看

### 这是一个陷阱！

对不起，上面是一个蓄意误导的示例，简化一下来看为什么。

 <img src="https://alexsidorenko.com/c711ed4324d7331fbd87ccdf351fe7c9/simple.gif" style="zoom:50%;" />

即使直接将 `showSidebar`的值写死为`true`，子组件仍旧会重新渲染。这是因为 `options prop` 是一个对象，从之前一篇Blog可知memo比较的是对象的引用而不是值。因此子组件会无视我们如何计算`showSidebar`的值，且始终会触发重新渲染，因为 `options !== options`。有两种方法可以防止这种情况的发生。



### 1. 拍平props

用`boolean`类型的变量 `showSidebar` 来存储原始值，当把 `showSidebar` 替代`optoins`直接传递给子组件时, 只有当这个`boolean`值发生变化时子组件才会触发重新渲染。

 <img src="https://alexsidorenko.com/0aee4f7e706de204f105d2a699db8f47/flatten.gif" alt="Two components Parent and Child. Parent holds a state {name: 'Alex', role: 'Default'}. Child receives a prop 'showSidebar'. Parent passes showSidebar = true when user.role is 'Admin'. Child doesn't re-render when 'user.name' updates" style="zoom:50%;" />

但有的时候你确实需要传入一个`object prop`，可能是因为架构要求这样做，也可能是在使用一个第三方的组件，当你别无选择的时候，应该怎么做？



### 2. useMemo

记住，能够提供完全相同引用的最简单方法，就是在React组件名部定义一个非原始类型的变量（在上一篇Blog中有提到）

但是在我们的这个示例中，我们没办法在React组件外部去定义 `options` ，因为它依赖于组件的`state`。这种情况下，我们可以利用 `useMemo`。 `useMemo`会缓存它的计算结果而不是每次render时都返回一个新的值, 它会返回旧的缓存的值，对于非原始类型来说总是会返回相同的对象引用。

 <img src="https://alexsidorenko.com/03698883921ebc06cc1ddafe682b8792/no-dependencies.gif" alt="Two components Parent and Child. Parent holds a state {name: 'Alex', role: 'Default'}. Child receives an object prop 'options' with a property 'showSidebar' in it. Parent memoizes result of 'options' with useMemo with no dependencies. Parent passes showSidebar = true when user.role is 'Admin'. Child never re-renders" style="zoom:50%;" />

`options prop`接受使用`useMemo`缓存下来的值，所以子组件不会再重新渲染。新的问题出现了，现在 `options` prop即使更新用户`role`的值也不会发生变化。这是因为我们给`useMemo` 的第2个参数提供一个空的依赖列表（数组）



### 依赖列表

> useMemo仅在依赖列表中的任意一个发生变化时，重新计算并更新缓存的值。这项优化帮助我们避免每次render时都进行一次高开销的计算。
>
> [React docs - useMemo](https://zh-hans.reactjs.org/docs/hooks-reference.html#usememo)

因为我们提供了一个空的依赖列表，所以`useMemo` 不会在父组件重新渲染时重新计算`showSidebar`的值。可以通过将`user`对象添加到依赖列表中来修复这个问题，如下图所示：

 <img src="https://alexsidorenko.com/0d2c1a3c9b5dcd562a0c04bb9835e27f/user-dependency.gif" alt="" style="zoom:50%;" />

现在一切又回到了原点。当和子组件毫无关联的属性 `user.name` 更新时子组件也触发重新渲染。为了解决这个问题，需要清楚 `useMemo` 的依赖是如何工作的。

每一次render `useMemo` 都会对依赖列表中的值进行浅比较(`prevDependency === dependency`)。如果任何一个依赖改变了，`useMemo`重新计算并更新缓存中的值。在之前的Blog中，简单介绍了 `memo`对原始类型和非原始类型值的浅比较机制，这一套机制对于 `useMemo`依然适用。

 <img src="https://alexsidorenko.com/static/3ec74161aaa95ab8357540790cecb86d/f058b/usememo-dependencies.png" alt="test" style="zoom:80%;" />

示例中每一次状态的更新都是`immutable`的，意味着每次更新user对象的`role`或`name`属性，实际上是重新创建了一个新的对象。`useMemo`检测到 `prevUser !== user` ，所以进行了重新计算。

```javascript
const updateName = (name) => setUser({...user, name: name});
```

请注意 `user.role`保存的是原始类型（string），就这意味着可以直接把它放到依赖列表中并且不用担心引用类型的比较。只有当`user.role` 的值更新了， `useMemo` 才会重新计算，如下图所示：

 <img src="https://alexsidorenko.com/694971deef85399732c5cbf583c4f779/final.gif" style="zoom:50%;" />



### 性能

这篇Blog中，我们探索了 `useMemo` 作为一种提供稳定的非原始类型`props`的工具。 有极少数场景下， React可能会选择性遗忘缓存的值即使依赖列表中的值没有发生变化。但是只要你因为性能优化的原因使用它，就不会有什么问题，即使 `useMemo` 重新计算缓存的值你的代码也能正常工作。在上面的示例中，即使React选择重新计算和缓存 `useMemo`，唯一无心发生的事也只是子组件重新渲染。

> **你可以把 `useMemo` 作为性能优化的手段，但不要把它当成语义上的保证。**将来，React 可能会选择“遗忘”以前的一些 memoized 值，并在下次渲染时重新计算它们，比如为离屏组件释放内存。先编写在没有 `useMemo` 的情况下也可以执行的代码 —— 之后再在你的代码中添加 `useMemo`，以达到优化性能的目的。
>
> [React docs - useMemo](https://zh-hans.reactjs.org/docs/hooks-reference.html#usememo)

另外，请记住你不需要修复每一处不必要的重新渲染。有时候`useMemo`的性能损耗会超过它带来的收益。可以参考这篇文章： [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback) （ Kent C. Dodds.）