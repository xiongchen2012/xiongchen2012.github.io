---
title: picgo在typora中的配置与使用
date: "2021-04-23T16:50:32.169Z"
description: 使用阿里云OSS作为typora的图床，配置好picgo后自动上传粘贴到typora中的图片
---

#### Picgo部分

Picgo是一个很不错的文件上传工具，支持很多图床：阿里云OSS、腾读云COS、Github、又拍云、七牛云等

> picgo和Picgo-Core可以认为是同一个东西，只有命令行
>
> Picgo是用`electron`包装后带图形界面的picgo

因为我只是写BLOG需要上传图片，没必要再装个有界面的picgo，所以选择命令行形式的picgo

- 全局安装picgo

  ```shell
  # NPM
  npm install -g picgo
  # Yarn 
  yarn global add picgo
  ```

  验证一下：

  ```shell
  picgo --version
  # 1.4.19
  which picgo # 查看一下picgo装在哪里，后面会用到
  # /Users/deathdealer/.nvm/versions/node/v15.14.0/bin/picgo
  ```

- 生成picgo配置文件

  picgo的配置文件是`~/.picgo/config.json`，可以自己创建也可以用交互式命令行`picgo set uploader`自动生成，推荐用后者生成，然后根据需要修改

  ```shell
  $ picgo set uploader
  ? Choose a(n) uploader aliyun  # 选择图床
  ? accessKeyId: xxxxxxxxxxxxxxxxx  # AccessKey ID
  ? accessKeySecret: xxxxxxxxxxxxxxxxx # AccessKey Secret
  ? bucket: obs-deathdealer  # 桶名
  ? area: oss-cn-hangzhou # oss所在region
  ? path: images/  # 自定义桶内文件夹，
  ? customUrl:     # 自定义域名，默认是阿里云的域名
  ? options:       # 选项，一般不需要指定
  [PicGo SUCCESS]: Configure config successfully!
  ```

至此`picgo`配置完成，其它图床选项各不相同，可以根据提示输入或参考：[picgo配置](https://picgo.github.io/PicGo-Core-Doc/zh/guide/config.html#picbed)

#### Typora部分

打开Typora的配置窗口：`偏好设置`、`图像`。将`插入图片时...`设置为`上传图片`

 <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210423163151924.png" alt="image-20210423163151924" style="zoom:45%;" />

然后在`上传服务设定`中选择`Custom command`，在下面的`命令`中填入：`$node_path $picgo_path upload `

`$node_path`是node所在的路径，可以用`which node`获得，`$picgo_path`是picgo所在路径，可以通过`which picgo`获得，填完后点击`验证图片上传选项`按钮，如果配置没问题，会提示验证成功。



#### 效果

经过以上两步配置之后，在typora写文档时，如果粘贴图片进来，会自动把文件上传到图床上，然后把markdown中图片的`src`替换为图床生成的URL，这样无论在哪里都可以访问到这个图片了，并且可以永久保存。

