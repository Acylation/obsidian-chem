# Contribute to Obsidian Chem

[简体中文](CONTRIBUTING-ZH.md) | [English](CONTRIBUTING.md)

## How to report a bug or suggest a feature

- Please use the [issue tracker](https://github.com/Acylation/obsidian-chem/issues) to report any problems or suggest new features.
- Before creating a new issue, please search for existing issues to avoid duplicates.
- When creating a new issue, please follow the templates to provide necessary information.
- You can also vote for existing issues by adding a 👍 reaction to show your support.

## How to submit a pull request

### General

- Before you start working, please announce that you want to do so by commenting on the issue.
- Make small, focused changes on each PR.
- If you are a beginner in plugin development, you can check the official [developer documentation](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin).

### Clone the repo

```cmd
cd [your-working-folder]
```

> **Note**
> It is recommended to use the config directory of a dev vault (e.g., .obsidian\plugins\\) as the working directory.

```cmd
git clone https://github.com/Acylation/obsidian-chem.git chem
cd chem
```

> **Note**  
> The plugin id in the manifest is `chem` rather than `obsidian-chem`.  

### Install dependencies

```cmd
npm install
```

### Developing

```cmd
npm run dev
```

> **Note**  
> This command will listen for changes to the source code and provide a new build when you save changes.  
> Download and enable the [Hot-Reload](https://github.com/pjeby/hot-reload) plugin to experience a smooth debugging workflow.  

### Linting and Building

```cmd
npm run lint
```

```cmd
npm run build
```

### Propose a Pull Request

- Please include a clear and concise description of your changes in the pull request title and body.
- Please reference any related issues in the pull request body using keywords like `fixes #123`, `closes #456` and `updates #789`.
- In source code, comments should only be used to explain unidiomatic code, declare and provide links to copied code, and describe the feature of a function or module.
- For raising questions, providing suggestions, or explaining a specific line of code, please use GitHub’s code review feature.
- Please wait for a review before your pull request being merged.

## Still have questions?

- If you still have any questions or need help with using or developing this project, please join our [Discussions](https://github.com/Acylation/obsidian-chem/discussions) right here in the repo.

Thank you for being a part of this project! 🙌
