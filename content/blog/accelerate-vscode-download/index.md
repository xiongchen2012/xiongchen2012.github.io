---
title: 国内加速VSCode下载
date: "2021-05-18T11:12:03.284Z"
description: "vscode从微软官网下载非常慢，使用国内azure的镜像下载会大大提速"
---

由于某种不可抗力的因素，国内从microsoft官网下载vscode非常的慢（2021年了却只有几kb/s），甚至无法下载。解决方法如下：

从官网下载VSCode时给的下载服务器域名是`az764295.vo.msecnd.net`：

```http
https://az764295.vo.msecnd.net/stable/054a9295330880ed74ceaedda236253b4f39a335/VSCode-darwin-arm64.zip
```

直接复制这个完整下载路径，保持stable及之后内容不变，只修改域名部分

```http
https://vscode.cdn.azure.cn/stable/054a9295330880ed74ceaedda236253b4f39a335/VSCode-darwin-arm64.zip
```

速度直接起飞，并且不用担心下面的域名有问题，他一样是微软官方的azure域名（走的是国内CDN)

