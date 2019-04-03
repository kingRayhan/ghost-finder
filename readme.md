## Ghost Finder

### Installation

**Include script**

```html
<script src="{{asset "ghost-search/dist/ghost-finder.js"}}"></script>
```

**Setup markup**

```html
<div>
    <input id="search-input" type="text" placeholder="Type to search" />
    <div id="search-result"></div>
</div>
```

**Activate the plugin**

```html
<script>
    new GhostFinder({
        input: '#search-input',
        homeUrl: '{{ @site.url }}',
        contentApiKey: //CONTENT API KEY...,
        showResult: '#search-result',
    })
</script>
```

---

### Options

| Name                 | Default Value       | Details                                            |
| -------------------- | ------------------- | -------------------------------------------------- |
| input                | `null` **Required** | DOM selector of search input                       |
| showResult           | `null` **Required** | DOM selector where search result will be pluged-in |
| homeUrl              | `null` **Required** | Your ghost site url                                |
| contentApiKey        | `null` **Required** | content api key                                    |
| resultTemplate       | see bellow          | Result wrapper template for search result          |
| singleResultTemplate | see bellow          | Single search result template                      |
| excerpt_length       | 15                  | word count to show in `##excerpt` variable         |
| time_format          | `'MMMM Do YYYY'`    | Time format string for `##published_at` variable   |

### Default templates

**Result Template**

```html
<ul class="search-results-wrapper">
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
