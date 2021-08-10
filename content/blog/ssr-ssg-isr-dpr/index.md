---
title: SSR、SSG、ISR、DPR简介
date: "2021-08-09T10:14:45.169Z"
description: SSR、SSG、ISR、DPR分别是什么，有什么区别，它们是如何一步一步进化的？
---

#### 名词解释

- CSR：Client Side Rendering，客户端渲染（大多数前端开发者集中的领域）
- SSR：Server Side Rendering，服务端渲染
- SSG：Static Site Generation，静态站点生成（我的博客就是）
- ISR：Incremental Site Rendering，增量站点渲染
- DPR：Distributed Persistent Rendering，分布式持续渲染

#### 从SSR到SSG

SSR 最早是为了解决单页应用（SPA）的 SEO不友好、首屏渲染时间长等问题而诞生的，在服务端实时渲染用户看到的页面，能最大程度上提高用户的体验。完整的SSR过程如下图所示：

 <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210810222708422.png" alt="image-20210810222708422" style="zoom:50%;" />

##### SSR的弊端

- 需要部署额外的服务，消耗计算资源，日常也存在传统服务端同样的运维、监控告警等方面额外的人力。
- 项目的可维护性会降低，不容易Debug，代码问题的追溯也会变得困难。
- 前后端责任分工不明，不能很好的并行开发。

重新对 SSR 进行审视，服务端渲染出的页面，逻辑上讲可以分成下面两大块：

1. **变化不频繁，甚至不会变化的内容**：例如文章、列表页、详情页等，这些数据非常适合静态化；
2. **变化比较频繁，或者千人千面的内容**：例如登录状态、实时评论、商品推荐等。

例如，在一篇文章的页面中，文章的主题内容是偏向于静态的，很少有改动，那么每次用户的页面请求，都通过服务端来渲染就变得非常不值得，因为每次服务端渲染出来大部分内容都是一样的！因此SSG应运而生。

> SSG和SSR的不同之处在于发送给客户端的内容是在**构建时生成**而不是在**请求时生成**。

##### SSG的优点

- 可以把生成的静态内容分发到 CDN，速度快
- 没有服务器
- 数据有变化时，重新触发一次网站的异步渲染，然后推送新的内容到 CDN 即可。
- 由于每次都是全站渲染，所以网站的版本可以很好的与 Git 的版本对应上，甚至可以做到原子化发布和回滚。

##### SSG框架

- [GatsbyJS](https://www.gatsbyjs.com/)	

- [NextJS](https://nextjs.org/)的SSG模式

  

#### 从SSG到ISR

对于小型的应用和站点来说，增删改数据时，跑一次全量生成静态页面的成本是可以接受的。**但对于有百万级及以上页面的大型网站而言，显然是不可能每次都做全量渲染的**为了解决这个问题，就有了ISR这种方案。

既然全量预渲染整个网站是不现实的，那么我们可以做一个切分：

1、**关键性的页面**（如网站首页、热点数据等）预渲染为静态页面，缓存至 CDN，保证最佳的访问性能；

2、**非关键性的页面**（如流量很少的老旧内容）先响应 fallback 内容，然后浏览器渲染（CSR）为实际数据；同时对页面进行异步预渲染，之后缓存至 CDN，提升后续用户访问的性能。

 <img src="https://pic1.zhimg.com/80/v2-9268a31db4779be8dfa01fbfa13c1524_1440w.jpg" alt="img" style="zoom:50%;" />

页面的更新遵循 stale-while-revalidate 的逻辑，即始终返回 CDN 的缓存数据（无论是否过期）；如果数据已经过期，那么触发异步的预渲染，异步更新 CDN 的缓存。

<img src="https://pic3.zhimg.com/80/v2-b4954ced325187f5894ab46e0eaf0c16_1440w.jpg" alt="img" style="zoom:50%;" />

这就是增量式更新（ISR）的概念，这个概念最早由 [Next.js 在 9.5 版本中提出](https://link.zhihu.com/?target=https%3A//nextjs.org/blog/next-9-5%23stable-incremental-static-regeneration)

##### ISR的弊端

- 对于没有预渲染的页面，用户首次访问将会看到一个 fallback 页面，此时服务端才开始渲染页面，直到渲染完毕。这就导致用户**体验上的不一致**。
- 对于已经被预渲染的页面，用户直接从 CDN 加载，**但这些页面可能是已经过期的，甚至过期很久的**，只有在用户刷新一次，第二次访问之后，才能看到新的数据。

为了解决 ISR 的一系列问题，Netlify 在前段时间发起了一个新的提案：

[Distributed Persistent Rendering (DPR)](https://link.zhihu.com/?target=https%3A//github.com/jamstack/jamstack.org/discussions/549)

DPR 本质上讲，是对 ISR 的模型做了几处改动，并且搭配上 CDN 的能力：

1. 去除了 fallback 行为，而是直接用 [On-demand Builder](https://link.zhihu.com/?target=https%3A//www.netlify.com/blog/2021/04/14/faster-builds-for-large-sites-on-netlify-with-on-demand-builders-now-in-early-access/)（按需构建器）来响应未经过预渲染的页面，然后将结果缓存至 CDN；
2. 数据页面过期时，不再响应过期的缓存页面，而是 CDN 回源到 Builder 上，渲染出最新的数据；
3. 每次发布新版本时，自动清除 CDN 的缓存数据。

<img src="https://pic3.zhimg.com/80/v2-2e1ad7f07dcd5986606f763f62894aae_1440w.jpg" alt="img" style="zoom:50%;" />

