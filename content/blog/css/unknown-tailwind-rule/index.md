---
title: 解决VSCode中@tailwind无法解析问题
date: "2021-08-13T15:55:20.269Z"
description: 利用VSCode的css language service解决VSCode中@tailwind无法解析问题，

---

#### 问题

默认情况下如果使用 `@tailwind` 指令去引入Tailwind的 `base`, `components`和 `utilities` 样式时，会提示：`Unknown at rule @tailwind`，如下图所示：

 <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210813160827793.png" alt="image-20210813160827793" style="zoom:45%;" />

虽然不影响最终使用，但是心里还是有个疙瘩。

#### 解决方法

##### 1. 最简单的插件大法

安装`PostCSS Language Support`插件就可以了，简单粗暴。[下载地址](https://marketplace.visualstudio.com/items?itemName=csstools.postcss)

##### 2. Custom Data for CSS Language Service

VSCode支持给CSS Language Service配置`Custom Data（其实就是指这一个JSON文件的路径，然后在JSON文件里面配置）`来解决这个问题（[VSCode文档](https://github.com/Microsoft/vscode-css-languageservice/blob/main/docs/customData.md)），VS Code启动时会加载 这些自定义的配置来增加对`CSS文件`的支持，如`自定义CSS属性`，`@指令` ,`伪类和伪元素`等。

- 配置方法

  - 指定`custom data`文件的路径

    比较遗憾的是目前根据VSCode仅支持`workspace`级别的设置，不支持`user`级别的设置。

    > The file paths are relative to workspace and only workspace folder settings are considered.

    ```json
    // 当前工作区的.vscode/settings.json中，没有可以创建，有的话可以修改，增加如下配置
    {
        "css.customData": [
            ".vscode/css_custom_data.json"
        ]
    }
    ```

  - 创建`css_custom_data.json`文件

    ```json
    {
      "version": 1.1,
      "atDirectives": [
        {
          "name": "@tailwind",
          "description": "使用`@tailwind`指令插入`base`, `components`, `utilities`样式",
          "references": [
            {
              "name": "Tailwind Documentation",
              "url": "https://tailwindcss.com/docs/functions-and-directives#tailwind"
            }
          ]
        }
      ]
    }
    ```

  - 按`command+shift+p`然后`Reload Window`即可生效

- 使用效果

   <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210813165807291.png" alt="image-20210813165807291" style="zoom:45%;" />

  点击下面的链接还能跳到tailwind的官网文档

