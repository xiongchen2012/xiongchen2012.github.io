---
title: Chrome控制台加载第三方库
date: "2021-07-21T11:18:23.269Z"
description: Chrome浏览器的console控台引入外部js文件
---



##### 0x0 背景

经常需要在在引用某个库之前测试一下基本功能和API，又不想创建一个工程去`npm i`进，可以通过以下两种手段加载CDN上的JS文件



##### 0x1 动态创建Script标签

在第三方库的官网，一般会提供npm、直接下载、CDN等几种方式。比如著名的lodash，官网提供的CDN是：

```http
https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
```

引用的方法是动态创建一个`script`标签

```javascript
const lodashCDN = document.createElement('script');
lodashCDN.src = 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js';
document.getElementsByTagName('head')[0].appendChild(lodashCDN);
```

然后就直接在console中使用`_`来引用loadash了

 ![image-20210721112705331](https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210721112705331.png)



##### 0x2 Chrome插件

在Chrome插件:[Console Importer](https://chrome.google.com/webstore/detail/console-importer/hgajpakhafplebkdljleajgbpdmplhie/related)的帮助之下，也可以快速的在console中引入第三方库。这个更智能更简单一点，缺点是需要翻墙下载插件

安装完这个插件，在Console直接运行例如 `$i('lodashjs')`  然后在几秒钟之后，你就可以获取到`lodash` 了。

<img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/chromeimporter.gif" alt="image-20210721112705331" style="zoom:60%;" />