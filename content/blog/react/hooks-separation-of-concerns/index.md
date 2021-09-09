---
title: 用Hooks实现关注点分离
date: "2021-09-08T16:56:13.469Z"
description: UI层和业务逻辑分离并不是React独有的：关注点分离是一种70年代就存在的设计原则，例如后端通常会把访问数据库的代码和业务逻辑代码进行分离。
---

> [原文地址](https://felixgerschau.com/react-hooks-separation-of-concerns/)，以下是我的翻译

如果你用过一段时间的React，你一定听说过**容器组件**和**纯展示组件**，或是`smart组件`或`dumb组件`。这些术语描述了一种将React组件的UI层和业务逻辑分离的[模式](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)。

UI层和业务逻辑分离并不是React独有的：关注点分离是一种70年代就存在的设计原则，例如后端通常会把访问数据库的代码和业务逻辑代码进行分离。

所以在React中，我们通过把所有业务逻辑写在容器组件里，然后把数据通过`props`向纯展示组件传递这种方式来实现关注点分离的目的。随着Hooks的引入，现在又有了一种新的方法：*自定义Hooks*



### 为什么要将业务逻辑和组件解耦？

在将业务逻辑和组件解耦之前，我们需要知道为什么要这么做。

以每个函数（或组件）只负责一件事的方式来组织我们的代码，这样做的好处是更容易修改和维护。(Dave和 Andrew在**《程序员修练之道》**这种书里称这种方式为 [『正交性』](https://felixgerschau.com/pragmatic-programmer-20th-anniversary-favorite-topic-summary/#orthogonality))

应用到React中后，我们的组件看起来更简洁，更有条理。比如说：我们在编辑UI之前无需修改任何业务逻辑。

这样组织代码不仅使其看起来更好，而且使修改更新容易，因为Hooks不会影响UI，反之亦然。

测试也更加容易实现：如果有必要的话完全可以撇开UI，只对业务逻辑进行单独的测试。然而，对我来说，最重要的优点还是如何组织我的代码。



### 如何用`Hooks`解耦业务逻辑

为了解耦业务逻辑，首先我们需要创建一个自定义Hooks。以下面这个组件为例，它用来计算指数值，界面如下图所示：

 <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210909092932982.png" alt="image-20210909092932982" style="zoom:40%;" />

可以到这里看源码[Codepen](https://codepen.io/fgerschau/pen/OJmMYoG)，主要的代码如下所示：

```jsx
export const ExponentCalculator = () => {
  const [base, setBase] = useState(2);
  const [exponent, setExponent] = useState(4);
  const result = (base ** exponent).toFixed(2);

  const handleBaseChange = (e) => {
    e.preventDefault();
    setBase(e.target.value);
  };

  const handleExponentChange = (e) => {
    e.preventDefault();
    setExponent(e.target.value);
  };

  return (
    <div className="blue-wrapper">
      <input type="number" onChange={handleBaseChange} value={base} />
      <input type="number" onChange={handleExponentChange} value={exponent} />
      <h1 className="result">{result}</h1>
    </div>
  );
};
```

看起来已经不错了，但为了能继续写下去，你可以*想像* 一下这里还有N多其它复杂的逻辑。

第1步，我们先把业务逻辑移到**自定义Hook**里面，然后在组件中调它。

```javascript
const useExponentCalculator = () => {
  const [base, setBase] = useState(2);
  const [exponent, setExponent] = useState(4);
  const result = (base ** exponent).toFixed(2);

  const handleBaseChange = (e) => {
    e.preventDefault();
    setBase(e.target.value);
  };

  const handleExponentChange = (e) => {
    e.preventDefault();
    setExponent(e.target.value);
  };

  return {
    base,
    exponent,
    result,
    handleBaseChange,
    handleExponentChange,
  };
};

export const ExponentCalculator = () => {
  const {
    base,
    exponent,
    result,
    handleExponentChange,
    handleBaseChange,
  } = useExponentCalculator();

  // ...
};
```

我们可以把这个hook移到单独的文件中，这样看起来更加【关注点分离】

此外，可以进一步把自定义的hook拆分成更细分且可重复使用的函数。这个示例中，把 `calculateExponent`提取出来。

```javascript
// useExponentCalculator.js
const calculateExponent = (base, exponent) => base ** exponent;

const useExponentCalculator = () => {
  const [base, setBase] = useState(2);
  const [exponent, setExponent] = useState(4);
  const result = calculateExponent(base, exponent).toFixed(2);

  // ...
};
```

测试这个函数比测试第1个示例中的整个组件要容易的多。我们可以使用任何nodejs的测试框架来测试它，甚至不支持React都行。

现在我们的组件和自定义Hooks中有了框架特定（React）的代码，而业务逻辑代码则写在稍后会定义的函数中（框架无关） 



### 最佳实践

#### 命名

- 我喜欢用组件的名称来命令自定义Hook，通常是`use`+`组件名`这样的形式 (例如：`useExponentCalculator`)。然后文件名和Hook名相同。

- 你可能想要遵循不同的命名约定，但建议在项目中最好保持一致。

- 如果能复用自定义Hook的部分代码，通常可以将它移动到`src/hooks`目录下另一个文件中。

#### 不要过度拆分

- 务实一些，如果组件只有几行代码，也没有必要分离业务逻辑了。

#### CSS-in-JS

如果你用了 CSS-in-JS 库 (`useStyles`)，你可能还想将此代码移动到另一个文件。

可以将它移动到与钩子相同的文件中。但是，如果文件变得太大，最好把它放在组件之上的同一个文件里（定义在组件代码上面），也可以把它移到它自己的文件中。



### 总结

- 无论你是否认为自定义Hooks改善了你的代码，最终取决于个人喜好。如果你的项目代码并没有包含太多的业务逻辑，也就没必要进行拆分了。
- 自定义Hooks只是代码模块化的一种方法，如果可能的话，我还强烈建议将组件拆分成更小的，可重用的代码块

