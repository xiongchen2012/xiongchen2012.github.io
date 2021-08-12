---
title: Svelte学习笔记（3）
date: "2021-04-18T21:41:32.169Z"
description: 自学Svelte时的学习笔记第3篇，方便自己以后快速复习
---

#### Props

和react等框架一样，svelte也是通过`props`向子组件传值。不一样的是，在svelte中，子组件需要用`export`来标记接收props的变量。这里的`export`和js模块里面的export用法完全不一样，看起来很怪异，但是在Svelte中暂时需要去习惯它

父组件传值和react等无异：

```javascript
<ChildComponent answer={42} />
```

子组件需要用`export`标记props：

```html
<script>
  export let answer = 'some_defalut_value'; // 标记props，同时可以指定默认值
</script>

<p>The answer is {answer}</p>  // The answer is 42
```



注意：如果`export`标记的是`const`,`function`,`class`，对父组件来说这些props就是只读的，传什么都不会改变子组件props的值。例：

```html
<!-- App.svelte -->
<script>
  import Nested from "./Nested.svelte";
</script>

<!-- 这里不管传什么到Nested，都显示readOnly，点击按钮还是会alert出消息，而不是在控制台打印消息 -->
<Nested thisIs="abcdefg" greet={ name => {console.log(name)} } />  
```

```html
<!-- Nested.svelte -->
<script>
  export const thisIs = "readOnly";
  export function greet(name) {
    alert(`hello ${name}!`);
  }
</script>

<h3>{thisIs}</h3>
<button on:click={() => greet("abcd")}>Click</button>
```



可以使用保留字来作为props名，比如`class`

```html
<script>
	let className;
  export { className as class } // creates a `class` property,
</script>
```



