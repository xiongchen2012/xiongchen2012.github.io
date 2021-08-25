---
title: XSS攻击的防护（JS）
date: "2021-07-23T09:38:32.169Z"
description: 详解script标签中的defer和aysnc属性

---

#### XSS 攻击是什么

Cross-Site Scripting（跨站脚本攻击）简称 XSS，是一种代码注入攻击。XSS 攻击通常指的是利用网页的漏洞，攻击者通过巧妙的方法注入 XSS 代码到网页，因为浏览器无法分辨哪些脚本是可信的，导致 XSS 脚本被执行。XSS 脚本通常能够窃取用户数据并发送到攻击者的网站，或者冒充用户，调用目标网站接口并执行攻击者指定的操作。



#### XSS的分类

- 反射型
  - 把 XSS 脚本放在 HTTP 请求中当成普通数据发送给服务端
  - 服务端在 HTTP 请求中收到数据后处理完，又将该数据拼接在 HTML 中返回
- 存储型
  - XSS脚本存在于服务端的数据库，文件，缓存中
  - 用户访问接口或网页时服务器将XSS脚本在响应中返回，浏览器默认执行
- DOM型
  - 前端直接将 URL 中的数据不做处理并动态插入到 HTML 中，是纯粹的前端安全问题
  - 类似反射型，区别在于 DOM 型 XSS 不会和后台进行交互

无论使用哪种攻击方式，本质就是将恶意代码注入到应用中，浏览器无脑执行后被注入。



#### React中XSS的防护

React DOM 在渲染所有输入内容之前，默认会进行转义。它可以确保在你的应用中，永远不会注入那些并非自己明确编写的内容。所有的内容在渲染之前都被转换成了字符串，因此恶意代码无法成功注入，从而有效地防止了 XSS 攻击。但是有一个例外的场景，就是使用 `dangerouslySetInnerHTML` 显示的内容，React不会自动帮助转义，如果不加处理，一定会被XSS注入。

推荐一个可以帮助我们转义标签的库：[DOMPurify](https://github.com/cure53/DOMPurify)

- 安装

  ```shell
  npm install dompurify --save
  # or
  yarn add dompurify
  ```

- 使用

  直接调用`sanitize`方法即可转义所有危险标签和属性

  ```javascript
  import DOMPurify from 'dompurify';
  
  const dirty = '<img src=x onerror=alert(1)//>'
  
  function createMarkup() {
    return {__html: DOMPurify.sanitize(dirty)};
  }
  
  function MyComponent() {
    return <div dangerouslySetInnerHTML={createMarkup()} />;
  }
  ```

DOMPurify有很多选项可以设置（具体[参考文档](https://github.com/cure53/DOMPurify#can-i-configure-dompurify)），大部分情况下用默认的选项就可以了。

PS：如果觉得用这个库是大炮打蚊子的话，也可以自己用`replace`去转义`"<>&'`等符号。

