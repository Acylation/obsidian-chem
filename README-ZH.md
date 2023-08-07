# Obsidian Chem

![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22chem%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)

[English](README.md) | [简体中文](README-ZH.md)

**Chem** 是一个旨在提升化学相关笔记记录体验的 [Obsidian.md](https://obsidian.md/) 插件。目前，本插件能够将您笔记中的SMILES字符串渲染为化学结构式。（基于 [Smiles Drawer](https://github.com/reymond-group/smilesDrawer)）

<!--https://github.com/Mqxx/GitHub-Markdown-->
> <picture>
>   <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/Mqxx/GitHub-Markdown/main/blockquotes/badge/light-theme/info.svg">
>   <img alt="Info" src="https://raw.githubusercontent.com/Mqxx/GitHub-Markdown/main/blockquotes/badge/dark-theme/info.svg">
> </picture><br>
>
> 最新插件版本: 0.2.0  
> 文档版本: 0.2.0

## 功能介绍和使用说明

### 渲染 SMILES 字符串为化学结构式

如图所示，本插件能够识别语言被标记为 `smiles` 的代码块，并将其中的 SMILES 字符串逐行转化为化学结构式。得益于 SMILES 的纯文本特性，数据能够持久保存，该功能将得到稳定支持；此外，由于 SMILES 是一个通用标准，即使本插件换用了其他化学信息学工具包，SMILES 字符串仍能够被正确解析和渲染

![Image](https://github.com/Acylation/obsidian-chem/assets/73122375/a9f9a440-dc66-4689-ab1a-1ef265242778)

您可以在插件设置页面调整化学结构式的尺寸比例，或指定图像大小，并分别调整浅色模式/深色模式下对应的结构式颜色主题。插件设置发生更改，或浅色/深色模式切换后，图像样式会自动更新

![Image](https://github.com/Acylation/obsidian-chem/assets/73122375/fde8d0a4-2c9c-458c-b357-78952480b755)

#### SMILES 是什么？

简化分子线性输入规范，Simplified Molecular-Input Line-Entry System，简称 SMILES，是一种用线性 ASCII 字符串描述化学结构的规范。您可以参阅[官方网站](http://opensmiles.org/opensmiles.html)或[维基百科](https://zh.wikipedia.org/wiki/%E7%AE%80%E5%8C%96%E5%88%86%E5%AD%90%E7%BA%BF%E6%80%A7%E8%BE%93%E5%85%A5%E8%A7%84%E8%8C%83)以了解更多内容

#### 为什么使用 SMILES？

SMILES 使用 ASCII 字符串表示化学结构的特性与 Obsidian 的纯文本编辑器的定位十分契合。作为一种通用规范，SMILES 得到了许多专业化学工具的支持，相比于 mhchem 和 chemfig 等 LaTeX 包，使用起来更加方便；而与其他通用化学结构规范相比，SMILES 的语义明晰，可读性更强

#### 如何生成 SMILES 字符串？

 对于简单结构，您在初步学习 SMILES 知识后即可手动输入。对于复杂结构，您可以使用 ChemDraw，[ChemDrawJS](https://chemdrawdirect.perkinelmer.cloud/js/sample/index.html#)，[MarvinJS](https://marvinjs-demo.chemaxon.com/latest/index.html) 或 [Ketcher](https://lifescience.opensource.epam.com/KetcherDemoSA/index.html) 等**结构编辑器**先行绘制，再导出 SMILES 字符串。您也可以使用 [Open Bable](http://openbabel.org/wiki/Main_Page)，[JOELib](https://sourceforge.net/projects/joelib/) 或 [Chemical Translation Service](https://cts.fiehnlab.ucdavis.edu/) 等**化学语言转换工具**/**化学数据库**，将化合物名称、CAS 号、*.mol 文件等转化为 SMILES 格式

## 安装步骤

> **Note**  
> 确保您已在设置→第三方插件中禁用**安全模式**

本插件可以在官方插件市场中找到。在`设置→第三方插件→浏览`中，搜索 `Chem` 插件，点击安装并启用

由于网络问题无法浏览插件市场时，请按照以下步骤手动安装

1. 在本仓库的最新 [release](https://github.com/Acylation/obsidian-chem/releases/latest) 页面中下载 `main.js`，`style.css` 和 `manifest.json` 三个文件，或者下载压缩包后解压
2. 将上述文件复制到您本地的笔记库的插件路径，如 `[yourvault]/.obsidian/plugins/obsidian-chem/`。您可能需要自行新建 `obsidian-chem` 这个文件夹
3. 打开/重启 Obsidian 或刷新插件列表，您将看到 `Chem` 插件，点击启用，安装完成！

后续会在中文论坛建立面向墙内的发布方法

## 插件定位

我希望本插件能够提升化学相关笔记的记录体验。例如，您可能希望在电子实验记录中记下您今天合成的化合物的结构式，或者您想创建有机化学反应的 Anki 卡片等等。下面是一些我认为本插件可以提供的功能：

- 显示化学式、结构式
- 从剪切板或常用化学文件导入分子结构
- 在分子结构旁添加化合物信息，如精确质量等，能够帮到质谱用户和化学初学者
- 支持以内坐标表示的分子结构，优化计算化学工作流
- 物理化学LaTeX公式模板，拯救您的物理化学课笔记
- ......

你们的意见对这个插件的迭代、建设有着很大的帮助。本插件的首个功能——将 SMILES 字符串渲染为结构式，就是在社区用户的呼唤下开发的。我十分感谢用户们的有益讨论 （参见 [acknowledgment](https://github.com/Acylation/obsidian-chem#acknowledgment) 部分），也欢迎各位的任何反馈和建议

## 设计原则

本插件计划提供的功能需要至少满足下列条件中的一条：

- 助力化学科研笔记，如实验记录、文献阅读笔记、论文大纲撰写等
- 帮助构建与常用化学工具紧密协作的工作流
- 利于化学、生物等相关学科的学习，如课程笔记、暗记卡片等

作为一个 Obsidian 插件，本项目遵循以下原则：

- 本地化：数据留存在本地，同时尽量使用独立包实现功能，避免调用在线服务
- 无痕化：使用常规 markdown 元素和 LaTeX 实现功能，不能引入插件特定的格式，确保笔记清洁
- 纯文本：数据以纯文本形式存储，尽量减少修饰格式，工作流同样以纯文本为中心

## 贡献指南

首先感谢您考虑为本项目添砖加瓦！本插件欢迎任何错误报告（bug report）、功能请求（feature request）和合并请求（pull request）。更多细节请参见[贡献指南](docs/CONTRIBUTING-ZH.md)

> **Note**  
> 您可以直接使用中文提交内容，但能力允许时，希望您能够附上对应的英文关键词/标题，以便潜在的国际用户和开发者检索和阅读。您使用中文提交的内容将由我翻译

## 路线图

本项目使用 GitHub Projects 记录[路线图](https://github.com/users/Acylation/projects/6)，您可以在此查看开发进度

## 致谢

本插件依赖 [Smiles Drawer](https://github.com/reymond-group/smilesDrawer) 实现 SMILES 字符串的解析以及结构式绘制的功能，导入这个包的例子来源于 [Mathpix](https://github.com/Mathpix/mathpix-markdown-it)。在此向这些杰出的工作表示感谢!

在整个开发过程中，官方[开发者文档](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)提供了非常详细的指引，感谢 [@marcusolsson](https://github.com/marcusolsson) 的早期非官方文档，以及对官方开发者文档整理工作的领导!

本插件是在关于“在笔记中包含化学结构式”的论坛讨论的驱动下产生的，感谢论坛成员的启发性讨论！

- <https://forum.obsidian.md/t/smiles-in-obsidian/35974>
- <https://forum.obsidian.md/t/structural-formulas-for-chemistry/29366>
- <https://forum.obsidian.md/t/chemistry-formulas-in-obsidian/25772>
- <https://forum.obsidian.md/t/obsidian-for-chemistry/33491>
- <https://forum.obsidian.md/t/how-to-write-chemical-formulas/12249>
