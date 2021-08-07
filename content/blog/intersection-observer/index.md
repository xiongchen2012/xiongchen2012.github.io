---
title: 前端埋点之曝光埋点
date: "2021-07-28T09:52:44.284Z"
description: "曝光埋点用来统计页面某个区域被用户“看到”的次数，此外一般还需要加上有效浏览的限制，即该区域至少需要停留时长5s以上"
---



#### 什么是曝光埋点

如果需要衡量流量的分发效率，或者需要衡量活动对用户的吸引力时，会涉及到一个点击效果的量化指标：点击率（CTR），点击率的计算公式如下所示：

```javascript
CTR = 点击数 / 曝光数
```

点击数通过点击事件埋点很容获得，但是分母就比较困难了。如果直接采用页面的浏览次数作为分母，明显是不科学的，因为很可能活动区域用户压根就没看见或是看见了并没有停留。想要获取分母的数据，要用到本文所说的曝光埋点。`曝光埋点`用来统计页面某个区域被用户`看到`的次数，此外一般还需要加上有效浏览的限制，即该区域至少需要停留时长5秒以上。



#### 传统方法

监听`scroll`事件，然后调用目标区域的[`getBoundingClientRect()`](https://developer.mozilla.org/en/docs/Web/API/Element/getBoundingClientRect)方法，得到它相对于`viewport`的坐标，再判断是否在`viewport`之内。这种方法比较简单，但是有个致命缺点，事件监听和调用 `getBoundingClientRect()` 都是在主线程上运行，因此频繁触发、调用可能会造成性能问题。用防抖来优化又极易造成在防抖的`timeout`时间段内目标区域脱离。所以传统的做法极其怪异且不优雅。



#### Observer API实现

##### [IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)

> `IntersectionObserver`**接口** (从属于[Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)) 提供了一种异步观察目标元素与其祖先元素或顶级文档视窗([viewport](https://developer.mozilla.org/zh-CN/docs/Glossary/Viewport))交叉状态的方法。祖先元素与视窗([viewport](https://developer.mozilla.org/zh-CN/docs/Glossary/Viewport))被称为**根(root)。**

这里所谓的**交叉状态**就是指和视口产生了交集，由于可见的本质就是目标元素与视口产生一个交叉区，所以这个 API又叫`交叉观察器`，可以简单且高性能的监视元素是否出现。



**兼容性**

 除IE之外（不出所料），现代浏览器已经全部很好的支持了`IntersectionObserver`

 <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210728105459323.png" alt="image-20210728105459323" style="zoom:50%;" />



**优点**

- **异步处理**消除了昂贵的DOM样式查询和连续的轮询；
- API配置丰富，可以实现除曝光埋点以外各种需要判断元素可见性的需求；



**概念和用法**

`IntersectionObserver`的基本用法是注册一个回调函数，当以下条件满足时调用该回调函数：

- 目标元素与`viewport`或者指定的元素产生交集时；
- IntersectionObserver第一次监听元素时；

```javascript
// 创建IntersectionObserver对象，需要传入相应参数和回调用函数
const observer = new IntersectionObserver(callback, options);
// 指定目标元素
const target = document.querySelector('#advertisment');
// 监听目标元素
observer.observe(target);
```



**选项(options)**

- **root**

  指定根元素，用于检查目标的可见性。必须是目标元素的父级元素。如果未指定或者为`null`，则默认为浏览器视窗。

- **rootMargin**

  根(**root**)元素的外边距。类似于 CSS 中的  [`margin`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin) 属性，比如 "`10px 20px 30px 40px"` (top, right, bottom, left)。如果有指定root参数，则rootMargin也可以使用百分比来取值。该属性值是用作root元素和target发生交集时候的计算交集的区域范围，使用该属性可以控制root元素每一边的收缩或者扩张。默认值为0。

   <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210728144424498.png" alt="image-20210728144424498" style="zoom:50%;" />

- **threshold**

  可以是单一的`number`也可以是`number数组`，target元素和root元素相交程度达到该值的时候`IntersectionObserver`注册的回调函数将会被执行。如果你只是想要探测当target元素的在root元素中的可见性超过50%的时候，你可以指定该属性值为0.5。如果你想要target元素在root元素的可见程度每多25%就执行一次回调，那么你可以指定一个数组[0, 0.25, 0.5, 0.75, 1]。

  默认值是`0`(意味着只要有一个target像素出现在root元素中，回调函数将会被执行)。该值为`1.0`含义是当target完全出现在root元素中时候 回调才会被执行。

  

**回调函数(callback)**

回调函数接收 [`IntersectionObserverEntry`](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserverEntry) 对象和观察者的列表：

```javascript
let callback =(entries, observer) => {};
```

| 属性                  | 含义                                                         |
| --------------------- | ------------------------------------------------------------ |
| boundingClientRect    | 目标元素的边界信息，返回结果与`getBoundingClientRect` 相同   |
| **intersectionRatio** | 目标元素出现在可视区的比例                                   |
| **isIntersecting**    | 1. 如果目标元素出现在root可视区，返回true。<br>2. 如果目标元素从root可视区消失，返回false |
| intersectionRect      | root和目标元素的相交区域                                     |
| rootBounds            | 交叉区域观察器(intersection observer)中的根.                 |
| target                | 目标元素                                                     |
| time                  | 记录从 IntersectionObserver 的时间原点到交叉事件被触发的时间 |

表格中加粗的两个属性是比较常用的判断条件：**isIntersecting**和**intersectionRatio**

注意：回调函数将会在主线程中被执行。所以该函数执行速度要尽可能的快。如果有一些耗时的操作需要执行，建议使用 [`Window.requestIdleCallback()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback) 方法。



**其它API**

- unobserve()

  停止对指定目标元素的监听

- takeRecords()

  返回所有观察目标的IntersectionObserverEntry对象数组

- disconnect()

  使`IntersectionObserver`对象停止全部监听工作



#### 扩展应用

除了曝光埋点之外，交叉检测可以轻送实现以前很复杂的功能，如下：

- 图片懒加载（LazyLoad）——当图片滚动到可见时才进行加载
- 内容无限滚动（Infinity Scroll）——当用户滚动到接近内容底部（触底）时直接加载更多，而无需用户操作翻页，给用户一种网页可以无限滚动的错觉
- 在用户看见某个区域时执行任务或播放视频等，当用户划走时开启小窗继续播放或停止播放。
- 吸顶 —— 如果用css的`position: sticky`实现兼容性比较差。



##### Polyfill

如里需要在IE中兼容`IntersectionObserver`，需要引入[W3C官方Polyfill](https://github.com/w3c/IntersectionObserver/tree/main/polyfill)

