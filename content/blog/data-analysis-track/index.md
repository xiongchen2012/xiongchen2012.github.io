---
title: 前端埋点之数据上报方式
date: "2021-07-27T15:48:03.284Z"
excerpt: "前端埋点数据上报到服务器的3种方式:ajax，image,sendBeacon"
---



#### AJAX

和调用接口的方法一样，基于 `XMLHttpRequest` 封装发送埋点数据的API（不用`fetch`的原因是考虑XHR兼容性最好），这种方式最简单容易理解，而且使用 POST 方式可以发送的数据量可以很大。缺点是会占用一定的客户端资源，而且需要处理跨域。

```javascript
// 1.创建XMLHttpRequest对象
let xhr
if (window.XMLHttpRequest) {
  xhr = new XMLHttpRequest()
} else if (window.ActiveObject) {
  // 兼容IE6以下版本
  xhr = new ActiveXobject('Microsoft.XMLHTTP')
}

// 跨域的时候不会带上cookie，如果需要带上cookie需要额外设置
xhr.credentials = true

// 2.设置请求信息
xhr.open('post', 'http://xxx.com/api/some')

// 3.发送请求
xhr.send() // get请求不传body参数，只有post请求使用

// 4.接收响应(一般埋点数据上报不需要处理返回）
xhr.onreadystatechange = function () {
}
```

服务端跨域设置

```javascript
set('Access-Control-Allow-Credentials', true)
//不能设为星号，必须指定明确的、与请求网页一致的域名。
set('Access-Control-Allow-Origin', getRequestHeader('origin'))
```



#### Image请求

image 请求方式是通过将埋点数据转成字符串放在图片请求的`queryString`里，然后向服务端请求一个 1*1 px 大小的图片，设置它的 src 属性就可以发送数据。`src`属性天然是跨域的，且兼容所有浏览器，缺点是`GET`  请求对上报的数据有限制，最大只能有几KB。

```javascript
const img = new Image();
img.width = 1;
img.height = 1;
img.src = '/track.png?data=xxxxxxxxxxxxxxx';
```



#### sendBeacon

navigator.sendBeacon 是一个比较新的 API，浏览器通过异步的 post 方式发送数据到服务端。该方法在页面跳转、刷新、关闭页面时发送请求，可以保证数据发送不丢失，浏览器会对其进行调度以保证数据有效送达，并且不会阻塞页面的加载或卸载，引外也不受跨域限制。

```javascript
navigator.sendBeacon(url, data);
```

- url：数据上报地址；
- data：埋点数据（支持类型：ArrayBufferView、Blob、DOMString 、 FormData ）；
- 返回值：埋点数据加入传输队列成功时返回 true，否则返回 false；

`sendBeacon` 允许开发者发送少量数据到服务端，它的特点很明显：

- 在浏览器空闲的时候异步发送数据，不影响页面 JS和CSS Animation 等执行；
- 页面在 unload 状态下，也会异步发送数据，不阻塞页面刷新和跳转等操作；
- 能够被客户端优化发送，尤其在 Mobile 环境下，可以将 beacon 请求合并到其他请求上一起处理；
- 只能判断出是否放入浏览器任务队列，不能判断是否发送成功。



##### 兼容性：

 <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210727165805195.png" alt="image-20210727165805195" style="zoom:50%;" />

毫无意外除了IE，基本上现代浏览器都完美支持，所以需要做一个兼容性处理：先判断用户当前设备是否支持 sendBeacon，如果不支持，就会走 `image` 或 `ajax`方式将数据发送出去。

```javascript
if (sendType === 'beacon' && typeof navigator.sendBeacon !== "function") {
    sendType = 'image';
}
// 后续代码根据sendType走到不同的上报逻辑
```



##### 发送数据大小限制

[标准](https://www.w3.org/TR/beacon/)没有明确大小限制，但是可以肯定的是数据大小是会有限制的，不一样的浏览器应该有所差异。有网友做了实验，可以参考：http://www.voidcn.com/article/p-okdxpzox-bwh.html



#### 总结

面对不同的埋点数据上报场景时，我们要选择不同的方式来上报数据：

- 如果发送数据量较小，采用 `image` 方式上报给服务端更合适；
- 如果发送数据量较大，采用 `ajax` 方式更合适；
- 如果需要进行精准的统计信息，采用 `sendBeacon` 方式能最大程度保证数据上报的成功率。

建议优先使用 `sendBeacon`来上报数据。在浏览器不支持sendBeacon的情况下使用 `image` 方式来上报。

