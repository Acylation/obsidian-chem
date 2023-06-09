# Obsidian Chem

![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22chem%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)

[简体中文](README-ZH.md) | [English](README.md)

**Chem** is a plugin for [Obsidian.md](https://obsidian.md/) providing chemistry support. It allows you to insert chemical structures into your notes through code blocks containing SMILES strings (powered by [Smiles Drawer](https://github.com/reymond-group/smilesDrawer)).

## Features & Usage

### Render SMILES strings as chemical structures

You can use this plugin to render chemical structures from SMILES strings. Just type the SMILES strings in a code block with `smiles` as the language. Each line should contain only one string.

The data is stored as plain text, so you won’t lose it. The renderer will always work, even if the plugin changes its cheminfo core.

![Image](https://user-images.githubusercontent.com/73122375/235232368-614cb591-a19a-4e1e-94df-781a317d25d0.jpg)

You can adjust the image size and configure light themes and dark themes of the molecule pictures in the plugin’s settings page.

> **Note**  
> For now, you need to reopen the active notes containing SMILES blocks to apply the new settings, as well as adapting the Obsidian light/dark theme changes.

![Image](https://user-images.githubusercontent.com/73122375/235232505-08386ce2-bc44-4fd6-96b4-22fa9c8c6fbf.jpg)

#### What is SMILES?

SMILES stands for Simplified Molecular-Input Line-Entry System. It is a specification to describe chemical structures using linear ASCII strings. You can learn more about it from the [official website](http://opensmiles.org/opensmiles.html) or [Wikipedia](https://en.wikipedia.org/wiki/Simplified_molecular-input_line-entry_system).

#### Why using SMILES?

Using SMILES strings to represent molecules is easier and more widely supported by chemistry drawing tools than using LaTeX packages like mhchem and chemfig.

#### How to generate SMILES strings?

 For simple structures, you can type them in manually. However, for more complex ones, you may want to use **structure editors**, such as ChemDraw, [ChemDrawJS](https://chemdrawdirect.perkinelmer.cloud/js/sample/index.html#), [MarvinJS](https://marvinjs-demo.chemaxon.com/latest/index.html) and [Ketcher](https://lifescience.opensource.epam.com/KetcherDemoSA/index.html). Also, you can use **translators** like [Open Bable](http://openbabel.org/wiki/Main_Page), [JOELib](https://sourceforge.net/projects/joelib/) and the [Chemical Translation Service](https://cts.fiehnlab.ucdavis.edu/) to convert chemical names, CAS numbers and *.mol files into SMILES strings.

## Installation

> **Note**  
> Make sure that you are not in the **Restricted Mode**.

The plugin is available in the official plugin market. You can go to Settings → Community plugins → Browse, and search for the `Chem` plugin by Acylation. After installing, you need to enable the plugin to use it.

You can also follow the steps below to install the plugin manually.

1. Go to the repo's latest [release page](https://github.com/Acylation/obsidian-chem/releases/latest), and download the `main.js`, `style.css`, and `manifest.json`. Alternatively, you can download the latest zip file and then unzip it to get the three files.
2. Copy these files to your local path `[yourvault]/.obsidian/plugins/obsidian-chem/`. You may need to create the folder `obsidian-chem` by yourself.
3. Launch/restart Obsidian, or refresh the plugin list, you will see this plugin.
4. In the plugin list, enable `Chem` and enjoy!

## Plugin Scope

I have a lot of ideas for this plugin, but my coding skills and resources are limited. I want to make it useful for anyone who needs to take notes on chemistry (such as research records, organic chemistry anki cards, etc.). As examples, here are some of the features I have in mind.

- Displaying chemical formulas and structures.
- Importing structures from the clipboard, .cdxml files, etc.
- Appending chemical info (e.g. exact mass) next to the structures. This can help MS users and beginners in chemistry.
- Supporting internal coordinates like .mol files. Would be useful in computational chemistry.
- Shortcuts for physicochemical formulas in LaTeX.
- ......

I'd love to hear your feedback and suggestions. Actually, the first feature of the plugin, to render SMILES strings, was suggested by community users! I’m very grateful for their input. (See the [acknowledgment](https://github.com/Acylation/obsidian-chem#acknowledgment) section for details)

## Design Philosophy

Before working on a new feature, I will consider the following criteria. The feature should meet at least one of them to be useful.

- It helps with taking notes on chemical research, like experimental records, literature notes, paper writing, etc.
- It promotes a workflow that integrates well with other chemistry tools.
- It aids in learning chemistry and related subjects.

As an Obsidian plugin, this project adheres to the following principles:

- Localize: Data should be kept local and standalone packages are preferred over remote services.
- Leave No Trace: The plugin must not leave plugin-specific content in notes, allowing them to be shared with non-Obsidian users.
- Plain Text Central: Plain text is preferred over complex formats.

## Contributing

Thank you for your interest in contributing to this project! We welcome bug reports, feature requests, and pull requests from anyone.

### How to report a bug or suggest a feature

- Please use the [issue tracker](https://github.com/Acylation/obsidian-chem/issues) to report any problems or suggest new features.
- Before creating a new issue, please search for existing issues to avoid duplicates.
- When creating a new issue, please follow the templates to provide necessary information.
- You can also vote for existing issues by adding a 👍 reaction to show your support.

### How to submit a pull request

- If you want to contribute code, please fork the repository and create a new branch for your work.
- If you are a beginner in plugin development, you can check the official [developer documentation](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin).
- Please include a clear and concise description of your changes in the pull request title and body.
- Please reference any related issues in the pull request body using keywords like `fixes #123` or `closes #456`.
- Please wait for a review before merging your pull request.

### How to get help

- If you have any questions or need help with using or developing this project, please join our [Discussions](https://github.com/Acylation/obsidian-chem/discussions) right here in the repo.

Thank you for being a part of this project! 🙌

## Roadmap

Check out the [roadmap](https://github.com/users/Acylation/projects/6) to see what's been working on.

## Acknowledgement

The plugin relies on [Smiles Drawer](https://github.com/reymond-group/smilesDrawer) as the parsing and drawing core, and uses [Mathpix](https://github.com/Mathpix/mathpix-markdown-it) as an example on how to integrate the package. Thank you very much!

During the whole process of development, I found the [developer documentation](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin) super helpful. Massive thanks to [@marcusolsson](https://github.com/marcusolsson) for leading this project!

The plugin is motivated by forum requests for including chemical structures in Obsidian. Thank you for the inspiring discussions and the great ideas!

- <https://forum.obsidian.md/t/smiles-in-obsidian/35974>
- <https://forum.obsidian.md/t/structural-formulas-for-chemistry/29366>
- <https://forum.obsidian.md/t/chemistry-formulas-in-obsidian/25772>
- <https://forum.obsidian.md/t/obsidian-for-chemistry/33491>
- <https://forum.obsidian.md/t/how-to-write-chemical-formulas/12249>
