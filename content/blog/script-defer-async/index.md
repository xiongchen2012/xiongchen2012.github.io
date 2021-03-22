---
title: script标签中的defer和async
date: "2021-03-22T22:40:32.169Z"
description: 详解script标签中的defer和aysnc属性
---

#### 一张图很好的说明了区别：
![image-20210322101853195](https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210322101853195.png)

- script不带任何额外属性

  遇到script 标签会中断 HTML 的解析，然后开始下载脚本并执行，执行完成后继续 HTML 和解析

- defer 

  遇到带 defer 属性的 script 标签浏览器会另起一线程线下载脚本，不阻塞 HTML 的解析，HTML 解析完成后才开始执行脚本。（执行顺序于下载的顺序一致）

- async

  遇到带 defer 属性的 script 标签浏览器会另起一线程线下载脚本，但是下载完成后会立即阻塞 HTML 解析并开始执行脚本，执行完成后继续解析 HTML（不保存执行顺序，谁先下完谁先执行）
  