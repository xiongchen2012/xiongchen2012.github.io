---
title: VSCode中的文件嵌套
date: "2025-01-10T10:06:21.392Z"
description: 打开Vite项目后，package.json/tsconfig.json/vite.config.ts文件下会嵌套很多文件，看起来比之前清爽很多
---

#### 起因

打开Vite项目后，原来项目中很多配置文件（例如.lock文件），现在会嵌套到package.json/tsconfig.json/vite.config.ts等文件下，折叠之后看起来比之前清爽很多

 <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com//images/image-20250110101245753.png" alt="image-20250110101245753" style="zoom:50%;" />

但是物理系统中却还是原来的那样，他们之前并没有嵌套从属关系

<img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com//images/image-20250110101503869.png" alt="image-20250110101503869" style="zoom:50%;" />

#### TLDR

经过一番百度，原来是打了VSCODE的自定义规则，在工程中新建一个`.vscode`文件夹，再新建一个`settings.json`，内容如下：

```json
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.patterns": {
    "tsconfig.json": "tsconfig.*.json, env.d.ts",
    "vite.config.*": "jsconfig*, vitest.config.*, cypress.config.*, playwright.config.*",
    "package.json": "package-lock.json, pnpm*, .yarnrc*, yarn*, .eslint*, eslint*, .prettier*, prettier*, .editorconfig"
  },
```

- 启用文件嵌套

  explorer.fileNesting.enabled设置为true

- 设置文件嵌套的pattern

  key是嵌套文件，value数组中的文件会被收纳到key指定的文件下，支持通配符；
