# 贡献指南

[English](CONTRIBUTING.md) | [简体中文](CONTRIBUTING-ZH.md)

## 通过 Issue 提交错误报告和功能请求

- 您可以使用 [issue tracker](https://github.com/Acylation/obsidian-chem/issues) 报告本插件的任何错误，或提交您希望实现的功能
- 在创建新 issue 前，请先行搜索相关 issue，以避免重复提交（请同时搜索英文关键词）
- 本仓库提供了 issue 模板，请按照模板指引填写，以提供必要的内容
- 为您需要的功能点赞👍！投票人数更多的功能请求将被优先考虑

## 提交 PR

### 注意事项

- 开始工作前，请在对应的 issue 中评论声明
- 一个 PR 应当解决一个特定、有限的问题
- 如果您对 Obsidian 插件开发比较陌生，您可以参考官方[开发者文档](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)，您将学到如何配置所需环境，并了解如何与 Obsidian 交互

### 克隆本仓库到本地

```cmd
cd [你的工作文件夹]
```

> **Note**
> 建议使用一个开发 vault 的配置文件夹作为本插件的工作文件夹。例如 `.obsidian\plugins\)`.

```cmd
git clone https://github.com/Acylation/obsidian-chem.git chem
cd chem
```

> **Note**  
> 本插件的 id 是 `chem` 而不是 `obsidian-chem`

### Install dependencies

```cmd
npm install
```

### Developing

```cmd
npm run dev
```

> **Note**  
> 该命令执行后，将监听源代码的更改，并在保存更改时自动编译出一个新版的`main.js`  
> 下载并启用 [Hot-Reload](https://github.com/pjeby/hot-reload) 插件以获得流畅的开发体验  

### 检查并构建插件

```cmd
npm run lint
```

```cmd
npm run build
```

### 撰写 PR

- 请使用简明的标题和内容描述您的PR中作出的变化
- 请使用 `fixes #123` `closes #456` 或 `updates #789` 的方式引用相关 issue
- 代码中的注释仅用于解释特殊代码行为、声明并链接引用/复制的代码以及概述函数/模块的功能
- 需要针对特定代码提出疑问、提供建议等，请在提交 PR 后使用 GitHub 的 code review 功能
- 您提交的PR将在审核后被合并，或被要求修改

## 仍有疑问?

- 如果您有任何疑问，或需要帮助，请在本仓库下的 [Discussions](https://github.com/Acylation/obsidian-chem/discussions) 栏目中发帖询问
- 若您希望展示您的使用案例，也欢迎前往 [Discussions](https://github.com/Acylation/obsidian-chem/discussions) 栏目

感谢您成为本项目的一份子！🙌
