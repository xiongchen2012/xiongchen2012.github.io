---
title: React Rendering教程（6） - Refs
date: "2021-12-01T19:35:28.128Z"
description: 不必要的渲染并不总是坏的，但是当你需要优化时，请借助refs来实现你的目的吧。
---

> [原文地址](https://alexsidorenko.com/blog/react-render-refs/) https://alexsidorenko.com/blog/react-render-refs

先抛出一个问题：如何在按钮点击3次之后禁用它？（同时前两点击时不能触发re-render）

<video src="https://alexsidorenko.com/7722fd8845a91058ff5310d5811d76ad/initial.mp4" autoplay="autoplay"></video>

```jsx
<button disabled={count === 3}>Button</button>
```

## 使用refs保存数据

> 当你想让组件『记住』某些信息，又不想这些信息[触发新的渲染](https://beta.reactjs.org/learn/render-and-commit)的话，你可以使用`ref` — 它就像一个神秘的『口袋』，你可以把组件的信息存放其中。
>
> [React Docs - Referencing Values with Refs](https://beta.reactjs.org/learn/referencing-values-with-refs)

下面的示例用`refs`取代`state`来保存点击次数：

<video src="https://alexsidorenko.com/2d83e932382e8667de76c2e939c6f4b1/refs.mp4" autoplay="autoplay"></video>

```jsx
<button disabled={count.current === 3}>Button</button>
```

噗，`refs`的值更新了，但是按钮仍然可以点击，为啥呢？

## 组件渲染和DOM更新

要想禁用按钮，则必须更新DOM。React只有当`render`函数输出不同的内容时才更新DOM； React不会更新任何DOM，直到React组件渲染。而且，由于改变`refs`值不会导致组件重新渲染，所以按钮一直处于可点击状态。

为了进一步演示效果，我们给它添加一个父组件，如下：

<video src="https://alexsidorenko.com/043414bb36580b69ab5313bbe54ecda6/parent.mp4" autoplay="autoplay"></video>

默认情下，当渲染React组件时会递归的重新渲染其子组件。这就是为什么当更新`Parent` 组件的`state`时，会同时渲染 `Parent` 和 `Component`。所以当 `Component` 更新时，React根据条件禁用了按钮。

```jsx
<button disabled={count.current === 3}>Button</button>
```

很明显我们不能依赖父组件的更新来禁用按钮，接下来我们直接在`Component`中实现同样的行为。

## 更新`state`触发组件的重渲染

我们可以通过再次引入`state`来触发组件的重新渲染。但是我们又不能让组件在前两次点击时重新渲染，所以我们把点击次数`count`悄咪咪的保存在`refs`中。我们将新增一个`butttonStatus`变量，专门负责更新按钮的状态。 我们只在点击第3次时，将 `butttonStatus` 的值更新为disabled

```jsx
const [buttonStatus, setButtonStatus] = useState(null);
<button
  disabled={buttonStatus === 'disabled'}
  onClick={() => {
    count.current++
    if (count.current === 3) {
      setButtonStatus('disabled')
    }
  }}
>
```

<video src="https://alexsidorenko.com/ca5a768e0862635aef1ce77ee3ea00a3/state.mp4" autoplay="autoplay"></video>

文中的例子是为了演示`refs`的机制。 谨记：不必要的渲染并不总是坏的，没有必要纠结于消除每一次不必要的渲染。实际上，在实际的场景中，为了简单起见，仅仅依赖`state`而使得渲染3次组件反而更有意义（为啥？简单呗）。当然，在你的应用中可能会遇到不同的场景，这时候你应该已经知道可以通过`refs`的强大功能来优化你的组件行为了~



全文完

