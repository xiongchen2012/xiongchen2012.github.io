---
title: React Rendering教程（2） - Props
date: "2021-08-23T20:10:28.128Z"
description: 子组件用memo包裹时，即使它的props没有变化，父组件渲染时为什么仍然会重新渲染？
---

> [原文地址](https://alexsidorenko.com/blog/react-render-props/)

子组件用memo包裹时，即使它的props没有变化，父组件重新渲染时为什么它仍然会重新渲染？

 <img src="https://alexsidorenko.com/67c82a4a531348fbb48e85e55c68d3f0/non-primitive-prop-rerenders.gif" style="zoom: 50%;" />



JS中有两种类型的值，理解它们的差异可以帮助我们更好的理解组件rendering

### 原始类型（Primitives）

第一种类型是将原始类型（`number`，`string`，`boolean`，`undefined`，`null`，`symbol`，`bigint`）作为props

 <img src="https://alexsidorenko.com/30b6cd5ed4c37a6e7c30ed85a761a95d/primitive-value.gif" style="zoom:50%;" />

如果子组件被`memo`包裹，意味着只有当它的`props`变化时才会重新渲染。`memo`判断`prpos`是否变化的方法是对props进行一次浅比较（ `prevProp === nextProp`）因为 `"Alex"`是一个原始类型（字符串）所以这个判断返回值是`true`（即props没有发生变化），所以组件不会重新渲染。



### 非原始类型（Non-primitives）

第2种类型就是非原始类型，现在给`props`传递一个对象（非原始类型），为什么非原始类型就会使得子组件重新渲染呢？

 <img src="https://alexsidorenko.com/67c82a4a531348fbb48e85e55c68d3f0/non-primitive-prop-rerenders.gif" alt="Two components Parent and Child. Parent passes a prop {display: 'flex'} to the Child. Child re-renders every time parent renders" style="zoom:50%;" />

记住，`memo`能过进行浅比较来判定props是否改变。当比较两个非原始类型，例如： `{display: "flex"} === {display: "flex"}`, 结果是`false`。

> 在JavaScript中，对象是引用类型。两个不同的对象永远不会相等，即使他们有完全相同的属性和值。只有比较两个相同引用的对象，结果才会是true。具体如何比较对象，可以参考：[MDN - Comparing Objects](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Working_with_Objects#%E6%AF%94%E8%BE%83%E5%AF%B9%E8%B1%A1)



### 引用

引用类型的变量是内存中的某个值的指针。如下图所示：

 ![reference](https://alexsidorenko.com/static/feeeef14e54a1741e7b174f4450a5cf1/f058b/references.png)

尽管`a` 和 `b`看起来完全一样，但是它两指向了内存中不同的值。 所以a===b返回`false`，关于引用类型，可以参考 [You Don’t Know JS (Values vs References)](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/get-started/apA.md#values-vs-references) 

知道了这些，我们该怎么防止子组件重新渲染？最简单的方法是在**组件树之外**定义一个变量，然后将它作为props传递下去，如下图所示：

 <img src="https://alexsidorenko.com/7b43e505df87cd93f22e52e66c0d63c2/declare-var.gif" alt="Two components Parent and Child. A variable declared outside of component: const style = {display: 'flex'}. Parent passes a prop style to the Child. Child doesn't re-render when parent renders" style="zoom:50%;" />

用上面这种方法，当 `memo`比较props时，进行的比较是 `style === style // true` ，而不是 `{display: "flex"} === {display: "flex"} // false`

注意：如果你是在父组件中定义的变量，上面的方法就会失效，如下所示：

 <img src="https://alexsidorenko.com/8133a865396d0d650813f405d7dc8424/declare-var-inside.gif" alt="Two components Parent and Child. A variable declared inside Parent component: const style = {display: 'flex'}. Parent passes a prop style to the Child. Child re-renders every time parent renders" style="zoom:50%;" />

这是因为每一次父组件渲染后， `style` 变量又被重新声明了（变成了一个新的对象引用）



### 匿名函数

函数和组件也是经常在React中用到的非原始类型。React中经常会传递匿名函数作为事件处理函数，如下所示：

 <img src="https://alexsidorenko.com/a624fc3a4f84c2fe60f11e6f9c4459e8/anonymous-function.gif" alt="Two components Parent and Child. Parent passes an anonymous function to the Child. Child re-renders every time parent renders" style="zoom:50%;" />

函数也是非原始类型，因而会采用上节提到的相同的比较规则。如果想防止子组件重新渲染，则需要为`props`提供同一个引用对象，如下图所示：

 <img src="https://alexsidorenko.com/dc031efeaf503ae46dd0eabb68c3c8a6/anonymous-function-reference.gif" alt="gif" style="zoom:50%;" />



### Memoization

实际的应用中，把非原始类型值其作为`props`传递时，可能会依赖于组件的`state`和其它`props`

 <img src="https://alexsidorenko.com/a898d7ece088f82cf8a98542aad49040/memoization.gif" alt="Two components Parent and Child. Parent passes an anonymous function as a prop the Child. This function updates Parent's state. Child re-renders every time parent renders" style="zoom:50%;" />

在这个示例中，不能将这个函数在React组件外部定义，而是必须在Parent组件内部定义（因为子组件想把某些值传给父组件）。但如何防止在每一次父组件re-render之后，子组件因为`onClick`重新声明并赋值而导致的重新渲染呢？这就是为什么React要提供 `useMemo` 和 `useCallback` 两个Hook来**记忆**这些`props`的值，且听下回分解。

