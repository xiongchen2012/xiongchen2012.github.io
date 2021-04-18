---
title: Svelte学习笔记（1）
date: "2021-04-18T 21:25:32.169Z"
description: 自学Svelte时的学习笔记第1篇，方便自己以后快速复习
---

#### Svelte是什么

首先它又是一个做Web开发的轮子，在[State Of JS 2020](https://2020.stateofjs.com/zh-Hans/technologies/front-end-frameworks)调查中Svelte获得前端工程师的一致好评，是2020年满意度第1的前端框架。

> Svelte is a radical new approach to building user interfaces. Whereas traditional frameworks like React and Vue do the bulk of their work in the *browser*, Svelte shifts that work into a *compile step* that happens when you build your app.

和react/vue/angular这些框架不一样的地方在于：会在编译阶段会把自己（svelte runtime）和业务代码打包到一起。因为最终会打包成Vallina JS，所以没有Virtual DOM的开销，运行速度很快，打包出来的产物尺寸也很小。

作者Rich Harris在《Rethinking reactivity》中把Virtual DOM一通怼，认为Virtual DOM是纯开销没有半点是处。[Youtube视频](https://youtu.be/AdNJ3fydeao)



#### 快速认识Svelte

##### Svelte组件

和vue类似，svelte组件也是把HTML/CSS/JS写在一个扩展名为`.svelte`的文件中，VSCode中需按装一个插件（[Svelte for VSCode](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)）才能对`.svelte`文件进行语法高亮和语法提示等。

组件的结构一般如下：

```html
<!-- Svelte组件结构(.svelte) -->
<script>
  // logic goes here
</script>

<!-- CSS -->
<style>
  /* styles go here */
</style>

<!-- template (zero or more items) goes here -->
<div>....<div>
```



##### 变量

script中定义的变量，在html中用`{}`来引用，既可以在text中引用，也可以在属性中引用（比如img的src属性）

```html
<script>
	let name = 'world';
</script>

<h1>Hello {name.toUpperCase()}!</h1>
```

如果用在HTML上的变量名和属性名一样，可以用简写形式

```html
<script>
	let src = 'http://www.xx.com/assets/xxx.png';
</script>

<!-- 简写形式 -->
<img {src} alt="some text" />
```

默认情况下`script`标签下定义的字符串都是字面上的字符串，会在render是原样显示出来，如果想渲染没有转义过的字符串（比如一段html文本）可以在模版中用`@html`标注出来

```html
<script>
	let string = `this string contains some <strong>HTML!!!</strong>`;
</script>

<p>{@html string}</p>
```



##### 样式

直接用`<style>`标签可以给组件定义样式，但是组件内定义的`style`只在本组件内生效，不会影响其它组件。

```html
<style>
  p {font-sie: 18px}
</style>

<p>hello world</p>
```

只会影响本组件内的`p`标签，也就是hello world会受影响



##### 引用其它组件

一个svelte文件写完整个APP的情况正常人都干不出来这样的事，通常都会拆开来写组件，不同的组件负责不同的功能与业务。引入其它组件只需要在`script`区域里`import`即可。

```html
<script>
  import OtherComponent from './OtherComponent.svelte'
</script>

<OtherComponent />
```

约定：用户自定义组件用大驼峰来表示，用来和html原生标签区分。



##### 解析Svelte文件

svelte文件的结构与vue相当类似，也没办法直接被打包出来，所以需要用一些插件或者webpack loader才行。以下两个是官方维护的插件，比较交靠谱。

Webpack：[svelte-loader](https://github.com/sveltejs/svelte-loader)

Rollup：[rollup-plugin-svelte](https://github.com/sveltejs/rollup-plugin-svelte)

