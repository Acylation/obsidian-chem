# Obsidian Chem

![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22chem%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)

![Powered by RDKit](https://img.shields.io/badge/Powered%20by-RDKit-3838ff.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAFVBMVEXc3NwUFP8UPP9kZP+MjP+0tP////9ZXZotAAAAAXRSTlMAQObYZgAAAAFiS0dEBmFmuH0AAAAHdElNRQfmAwsPGi+MyC9RAAAAQElEQVQI12NgQABGQUEBMENISUkRLKBsbGwEEhIyBgJFsICLC0iIUdnExcUZwnANQWfApKCK4doRBsKtQFgKAQC5Ww1JEHSEkAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wMy0xMVQxNToyNjo0NyswMDowMDzr2J4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDMtMTFUMTU6MjY6NDcrMDA6MDBNtmAiAAAAAElFTkSuQmCC)

[简体中文](README-ZH.md) | [English](README.md)

**Chem** is a plugin for [Obsidian.md](https://obsidian.md/) providing chemistry support. It allows you to insert chemical structures into your notes through code blocks containing SMILES strings (powered by [Smiles Drawer](https://github.com/reymond-group/smilesDrawer) & [RDKit.js](https://github.com/rdkit/rdkit-js)).

> [!Note]
> Latest release: 0.4.0  
> Document version: 0.4.0  

## Features & Usage

### Render SMILES Strings as Chemical Structures

You can use this plugin to render chemical structures from SMILES strings. Just type the SMILES strings in a code block with `smiles` as the language. Each line should contain only one string.

The data is stored as plain text, so you won’t lose it. The renderer will always work, even if the plugin changes its cheminfo core.

![Render SMILES strings into structures](https://github.com/Acylation/obsidian-chem/assets/73122375/a9f9a440-dc66-4689-ab1a-1ef265242778)

#### Global Sizing and Theming

You can adjust the structure scale or the image size and configure light/dark themes of the structure images in the plugin’s settings page. The structures in open notes will be automatically updated when the plugin settings or Obsidian color scheme are changed.

![Configure size and theme](https://github.com/Acylation/obsidian-chem/assets/73122375/fde8d0a4-2c9c-458c-b357-78952480b755)

#### Copy & Export

The copy feature is accessible through the right-click menu on images. Images are copied in `png` format. Despite common applications, you can also paste the copied image into your note, which will then save the image as a file to your attachment folder. The scale of the export, transparency, and theme can be configured to suit your needs.

#### Utilizing Dataview

Inline Dataview queries and DataviewJS rendering can be enabled in the settings tab. Once enabled, lines within the smiles block will be checked and parsed. The return values from this process will be used to render chemical structures, providing greater flexibility. The prefix and strategy are fetched directly from the corresponding Dataview plugin settings.

![Dataview lines in smiles block](https://github-production-user-asset-6210df.s3.amazonaws.com/73122375/292734194-d227fdb8-9c8f-4c87-965a-73c0f2445993.png)

> [!Warning]
> This feature is dependent on the Dataview plugin. Please ensure that you have installed and enabled it.
>
> The execution of DataviewJS is implemented by calling `eval()` at the bottom, which is known to have security issues. To avoid unintended execution, only trusted code lines should be passed.  
>
> If you wish to keep inline Dataview queries rendering and only disable DataviewJS, you can toggle off the `Enable JavaScript Queries` or `Enable Inline JavaScript Queries` options through the Dataview plugin settings.  

## Introduction on SMILES

### What is SMILES?

SMILES stands for Simplified Molecular-Input Line-Entry System. It is a specification to describe chemical structures using linear ASCII strings. You can learn more about it from the [official website](http://opensmiles.org/opensmiles.html) or [Wikipedia](https://en.wikipedia.org/wiki/Simplified_molecular-input_line-entry_system).

### Why Using SMILES?

Using SMILES strings to represent molecules is easier and more widely supported by chemistry drawing tools than using LaTeX packages like mhchem and chemfig.

### How to Generate SMILES Strings?

 For simple structures, you can type them in manually. However, for more complex ones, you may want to use **structure editors**, such as ChemDraw, [ChemDrawJS](https://chemdrawdirect.perkinelmer.cloud/js/sample/index.html#), [MarvinJS](https://marvinjs-demo.chemaxon.com/latest/index.html) and [Ketcher](https://lifescience.opensource.epam.com/KetcherDemoSA/index.html). There's a Ketcher editor integration plugin [Obsidian Ketcher](https://github.com/yuleicul/obsidian-ketcher) available right in Obsidian.

 Also, you can use **translators** like [Open Babel](https://openbabel.org/), [JOELib](https://sourceforge.net/projects/joelib/) and the [Chemical Translation Service](https://cts.fiehnlab.ucdavis.edu/) to convert chemical names, CAS numbers and `*.mol` files into SMILES strings.

## Installation

> [!Note]  
> Make sure that you are not in the **Restricted Mode**.

The plugin is available in the official plugin market. You can go to Settings → Community plugins → Browse, and search for the `Chem` plugin by Acylation. After installing, you need to enable the plugin to use it.

You can also follow the steps below to install the plugin manually.

1. Go to the repo's latest [release page](https://github.com/Acylation/obsidian-chem/releases/latest), and download the `main.js`, `style.css`, and `manifest.json`. Alternatively, you can download the latest zip file and then unzip it to get the three files.
2. Copy these files to your local path `[yourvault]/.obsidian/plugins/chem/`. You may need to create the folder `chem` by yourself.
3. Launch/restart Obsidian, or refresh the plugin list, you will see this plugin.
4. In the plugin list, enable `Chem` and enjoy!

> [!Note]
> If you want to utilize `RDKit.js`, Chem plugin would try to fetch `RDKit_minimal` and `RDKit_minimal.wasm` files from [release](https://github.com/Acylation/obsidian-chem/releases/latest). If you have problem connecting GitHub, please download them manully and put them in the directory `[yourvault]/.obsidian/plugins/chem/rdkit/` for recognization and loading.

## Plugin Scope

I have a lot of ideas for this plugin, but my coding skills and resources are limited. I want to make it useful for anyone who needs to take notes on chemistry (such as research records, organic chemistry anki cards, etc.). As examples, here are some of the features I have in mind.

- Displaying chemical formulas and structures.
- Importing structures from the clipboard, .cdxml files, etc.
- Appending chemical info (e.g. exact mass) next to the structures. This can help MS users and beginners in chemistry.
- Supporting internal coordinates like .mol files. Would be useful in computational chemistry.
- Shortcuts for physicochemical formulas in LaTeX.
- ......

I'd love to hear your feedback and suggestions. Actually, the first feature of the plugin, to render SMILES strings, was suggested by community users! I’m very grateful for their input. (See the [acknowledgment](https://github.com/Acylation/obsidian-chem#acknowledgment) section for details)

## Contributing

Thank you for your interest in contributing to this project! We welcome bug reports, feature requests, and pull requests from anyone. For more information on how to contribute to Chem, check out [CONTRIBUTING.md](docs/CONTRIBUTING.md).

## Roadmap

Check out the [roadmap](https://github.com/users/Acylation/projects/6) to see what's been working on.

## Companion Plugins

`Chem` plugin is now primarily focused on rendering texts into structures. If you want to create complex structures from scratch, the [Ketcher](https://github.com/yuleicul/obsidian-ketcher) plugin has integrated a powerful opensource editor.

[Chemical Structure Renderer](https://github.com/xaya1001/obsidian-Chemical-Structure-Renderer) is a similar plugin of `Chem`, which uses [Ketcher](https://github.com/epam/ketcher), [Indigo](https://github.com/epam/Indigo) online service for parsing and rendering, while `Chem` plugin integrates standalone packages and runs locally.

## Acknowledgement

The plugin relies on [Smiles Drawer](https://github.com/reymond-group/smilesDrawer) as the parsing and drawing core, and uses [Mathpix](https://github.com/Mathpix/mathpix-markdown-it) as an example on how to integrate the package. Thank you very much!

During the whole process of development, I found the [developer documentation](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin) super helpful. Massive thanks to [@marcusolsson](https://github.com/marcusolsson) for leading this project!

The plugin is motivated by forum requests for including chemical structures in Obsidian. Thank you for the inspiring discussions and the great ideas!

- <https://forum.obsidian.md/t/smiles-in-obsidian/35974>
- <https://forum.obsidian.md/t/structural-formulas-for-chemistry/29366>
- <https://forum.obsidian.md/t/chemistry-formulas-in-obsidian/25772>
- <https://forum.obsidian.md/t/obsidian-for-chemistry/33491>
- <https://forum.obsidian.md/t/how-to-write-chemical-formulas/12249>
