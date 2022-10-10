# Ghost Finder
Here's a helpful npm package I made. This addon allows you to easily and sweetly incorporate search features into your ghost theme. It operates using the Ghost Content API.

![](./ghost-finder.png)


![](https://img.shields.io/github/package-json/v/electronthemes/ghost-finder.svg)
![](https://img.shields.io/github/languages/code-size/electronthemes/ghost-finder.svg)
![](https://img.shields.io/github/license/electronthemes/ghost-finder.svg)
![](https://img.shields.io/github/issues-raw/electronthemes/ghost-finder.svg?style=plastic)
![](https://img.shields.io/github/last-commit/electronthemes/ghost-finder.svg)

## Installation

```bash
npm install ghost-finder
```

### OR

![download](https://img.icons8.com/material-sharp/24/000000/download-2.png) [Download Latest Release](https://github.com/kingRayhan/ghost-finder/releases/latest)

**Include script**

```html
<script src="{{asset "ghost-finder/dist/ghost-finder.js"}}"></script>
```

**Setup markup**

```html
<div>
  <input id="search-input" type="text" placeholder="Type to search" />
  <div id="search-result"></div>
</div>
```

**Activate the plugin**

```js
new GhostFinder({
    input: '#search-input',
    showResult: '#search-result',
    contentApiKey: //CONTENT API KEY...,
})
```

To see how you can get contentApiKey , [Click Here](https://github.com/kingrayhan/ghost-finder/wiki/How-to-get-contentApiKey-%3F)

---

### Options

| Name                 | Default Value       | Details                                                                                                                   |
| -------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| input                | `null` **Required** | DOM selector of search input                                                                                              |
| showResult           | `null` **Required** | DOM selector where search result will be pluged-in                                                                        |
| homeUrl              | current website url | Your ghost site url                                                                                                       |
| contentApiKey        | `null` **Required** | content api key                                                                                                           |
| resultTemplate       | see bellow          | Result wrapper template for search result                                                                                 |
| singleResultTemplate | see bellow          | Single search result template                                                                                             |
| excerpt_length       | 250                 | word count to show in `##excerpt` variable                                                                                |
| time_format          | `'MMMM dd yyyy'`    | Time format string for `##published_at` variable. [Available formats](https://date-fns.org/v2.22.1/docs/format#description) |

### Default templates

**Result Template**

```html
<ul class="search-results-wrapper">
  <p>Search match(es): ##resultCount</p>
  ##results
</ul>
```

**Single Result Template**

```html
<li><a href="##url">##title</a></li>
```

### Variables

| Field Name                | Purpose                                                             |
| ------------------------- | ------------------------------------------------------------------- |
| `##title`                 | Post title                                                          |
| `##url`                   | Post url                                                            |
| `##primary_tag_name`      | Name of primary tag                                                 |
| `##primary_tag_url`       | Url of primary tag                                                  |
| `##primary_author_name`   | Name of primary author                                              |
| `##primary_author_url`    | Profile url of primary author                                       |
| `##primary_author_avater` | Profile photo of primary author                                     |
| `##excerpt`               | show some words of the post content. Default words count is 15      |
| `##published_at`          | Post publication date. Format can be change by `time_format` option |
| `##feature_image`         | Post featured image url                                             |
| `##resultCount`           | Matched result count                                                |

## Logs
- 3.1.0 - Search on content along with title, Replace [laravel-mix](https://laravel-mix.com/) with [parcel](https://parceljs.org/)

