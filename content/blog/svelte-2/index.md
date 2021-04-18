---
title: Svelte学习笔记（2）
date: "2021-04-18T21:33:32.169Z"
description: 自学Svelte时的学习笔记第2篇，方便自己以后快速复习
---


#### 响应式系统

> Svelte's reactivity is based on assignments
>
> Svelte的响应式系统是基于赋值的，只要给声明的变量、对象、数组重新赋值，就可以触发re-render



- 事件绑定

  用`on:`前缀绑定事件处理函数，如下代码所示：

  ```html
  <button on:click={handleClick}>
    Click
  <button>
  ```

- 响应式声明（reactive declarations）

  用`$:`前缀声明**响应式变量**，如下代码所示：

  ```html
  <script>
    const count = 0;
    $: doubled = count * 2  
  </script>
  ```

  响应式变量可以不用声明，因为svelte会自动加上`let`，如上面例子中的`doubled`可以不用声明直接使用

  
  
  除了声明响应式变量之外，还可以**运行任意语句**。语句中的变量值变了，就会自动运行这些语句，如下：
  
  ```javascript
  $: {
  console.log(`the count is ${count}`); // 只要count值变了，就会在控制台打印日志
    alert(`I SAID THE COUNT IS ${count}`);
}
  ```
  
  甚至还可以用在`if`语句前面
  
  ```html
  $: if (count >= 10) {
	alert(`count is dangerously high!`);
  	count = 9;
  }
  ```
  
  数组和对象的变化不能用`$:`来实现。

**参考**

`$:`是javascript label语法，[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/label)

