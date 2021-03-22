---
title: Babel入门（1） - 基础知识
date: "2018-08-17T22:12:03.284Z"
description: "Babel入门（1） - 基础知识"
---

### Babel是什么
由于现代浏览器对于ECMAScript2015+支持非常有限，用ES6语法写的Javascript代码没办法直接在浏览器中运行。于是Babel（发音/'beibəl/）应运而生了。

Babel通过自己的工具链（ToolChain），将使用ES6语法写的Javascript代码转换成完全同等功能的ES5代码，以便在浏览器中执行。有了Babel用户可以直接山书写ES6的代码，而不用担心浏览器无法执行，大大提高了用户的开发效率，降低了由于ES5语言特性带来潜在问题的几率。

官网的解释更简洁：  
Babel is a JavaScript compiler

它的目的是：  
**Use next generation JavaScript, today.**

### 配置Babel
有两种方式可以在项目中配置和使用Babel：.bablerc和package.json

#### .babelrc
在项目根目录配置一个名为`.babelrc`的文件，这个文件按照JSON格式进行书写。主要可以分为两段：

```json
{
    presets:[],
    plugins:[]
}
```

其中`presets`用于指定babel编译js代码时使用的规则，`plugins`指定babel使用的一些插件

#### package.json
也可以在项目的package.json中配置babel，内容和上述方式一样：

```json	
	...
	"babel":{
        presets: [],
        plugins: []
	}
	...
```

#### env选项
如果想为不同的env配置不同的选项，可以增加`env`配置项

```json
	{
        "presets": [], //全局的预设
        "plugins": [], //全局的插件
        "env": {
            "production": {
            	"presets": [], //production环境下的预设
                "plugins": []  //production环境下的插件
            }
        }
	}
```
env的取值：process.env.BABEL_ENV > process.env.NODE_ENV > "development"

**配置文件的查找顺序如下：**

需编译的js文件的当前目录中查找`.babelrc` > 向上查找babelrc文件直到项目的根目录 > 如果没有babelrc则查找`package.json`中是否有`babel:{}`

### Plugins

为什么要先写插件？要从Babel工作的步骤说起。Babel自称为编译器，它的编译工作分为了三个步骤：解析（parsing）-> 转换（transforming）-> 生成目标代码（generating）。

开箱即用的Babel（可以理解为初始状态时的babel），实际上在第2阶段（transforming）什么工作都没做。解析(parsing)一份代码，因为在第2阶段什么都没做，所以第3阶段会输出完全相同的代码。即：`const babel = code => code`

因此Babel引入了插件来作用于第2阶段（transforming），插件以第1阶段解析的原始代码作为输入，实质性的进行了转换然后输出给第3阶段。这类用于转换代码的Babel插件统称为：Transform Plugins，插件机制带了很好的扩展性和性能。

例如，如果需要将下面代码的的箭头函数转换成ES5，需要用到ES2015插件中的`es2015-arrow-functions`

```javascript
let doubled = [1,2,3,4,5].map(num=>num*2);
```

安装箭头函数转换的plugin

```shell
npm install --save-dev es2015-arrow-functions
babel -i example.js -o output.js
```

转码后输出，已将箭头函数转换成了ES5的function：

```javascript
let doubled = [1,2,3,4,5].map(function(num){
    return num*2;
})
```

Babel插件拆分的非常细，基本上每一项语法特性都会有一个对应的插件，比如将ES2015转换相关的官方插件就有19个之多，几乎每个新特性对应一个插件。这样的设计使得开发者可以根据自己的需要进行插件的组合，官方可以不断对其进行扩展，也有利于babel社区贡献特定的插件。

PS：有些代码在第1阶段就可能会无法解析，典型的比如React的jsx，babel也通过插件来解决问题。这类用于解析源文件的插件统称为：Syntax Plugins。一般Transform插件会自动使用相应的Syntax插件，不需额外指定Syntax插件。

**总结：Syntax插件+Transform插件共同组成了Babel的插件体系，Syntax用于第1阶段解析源码，Transform用于第2阶段转换源码**

### Presets

上一节解释了Babel的插件机制，通过插件就可以把Babel所有的事情都干了，为什么还要引入Presets呢？

原因很简单：逐个插件引入的效率比较低下。比如在项目开发中，开发者想要将所有ES6的代码转成ES5，插件逐个引入的方式比较麻烦（需要引入20+个插件），而且容易出错（少一个可能就会跪了）。

这时候，就可以引入presets来解决这个麻烦。

> Don't want to assemble your own set of plugins? No problem! Presets are sharable [`.babelrc`](https://babeljs.io/docs/en/babelrc) configs or simply an array of babel plugins.

官方把presets定义成可共享的babel配置，也可以简单把presets看成plugins数组。比如`babel-preset-es2015`包含了所有跟ES6转换有关的插件；可以理解为：`babel-preset-es2015 === [es2015-arrow-functions,es2015-classes,es2015-destructuring.....] `

可共享的babel配置，可以理解为配置了presets就可以省去配置一堆插件，而preset名可以替代这些插件名。

```json
{
    "presets": ["es2015"] // 配置了es2015 preset
}
// 等价于
{
    "plugins": ["es2015-arrow-functions","es2015-classes","es2015-literals" // ...]
}
```

官方提供了12种Preset
| Preset | 用途 | 备注 |
| :----- | ------ | ------ |
| env | 可以根据指定的环境自动配置Babel插件的preset | 这篇博客专门讲这个preset |
| es2015/es2016/es2017 | 用于转ES2015,2016和2017 | 还有个latest，已经不用了 |
| stage-0/1/2/3 | 用于转tc39处于各阶段的提案语法 |  |
| flow | 用于将Flow书写的代码转成javascript |  |
| react | 用于将React代码转成js(主要是jsx语法) |  |
| minify | 用于将编译后的代码进行压缩 |  |

### Plugin和Preset简写形式

如果plugin的名称以`babel-plugin-`开头，就可以在配置中省掉这个前缀。比如：

```json
"plugins": ["someplugin"]
等价于
"plugins": ["babel-plugin-someplugin"]
```

同样，preset的名称以`babel-preset-`开头，可以在配置中省掉这个前缀。比如：

```json
"presets": ["somepreset"]
等价于
"presets": ["babel-plugin-somepreset"]
```

### Plugin和Preset的执行顺序

可以同时指定多个plugin和preset，plugins和presets也可以同时存在。所以需要知道顺序：

- plugin执行先于preset（Plugins run before Presets）
- plugin按照配置的次序**顺序**执行（Plugin ordering is first to last）
- plugin按照配置的次序**逆序**执行（Preset ordering is last to first）

### Plugin和Preset的选项配置

plugin和preset都支持各自进行配置，不同的插件和预设支持的选项不一样，需要具体查看其文档，但是指定选项的配置语法是相同的：

```json
{
    "plugins": [
        ["plugin1",{
            "someoption": "value"
            ...
        }], //需要用一个数组来配置plugin和它的选项
        ["plugin2",{
            "someoption": "value"
            //...
        }]
    ],
    "presets": [
        ["preset1",{
            "someoption": "value"
            //...
        }],
        ["preset2",{
            "someoption": "value"
            //...
        }],
    ]
}
```
