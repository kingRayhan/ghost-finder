import GhostContentAPI from '@tryghost/content-api'

class GhostSearch {
    constructor({
        selector = null,
        contentApiKey = null,
        homeUrl,
        fields = 'title,slug,html',
        showResult,
        resultTemplate,
        singleResultTemplate,
    }) {
        /**
         * Options
         */
        this.input = document.querySelector(selector)
        this.homeUrl = homeUrl
        this.contentApiKey = contentApiKey
        this.fields = fields
        this.resultTemplate = resultTemplate
        this.singleResultTemplate = singleResultTemplate
        this.showResult = document.querySelector(showResult)

        /**
         * trigger when user type to search
         */
        this.input.addEventListener('keyup', this.doSearch)

        if (
            contentApiKey === '' ||
            contentApiKey === undefined ||
            contentApiKey === null
        ) {
            return console.error('You must need to provide contentApiKey')
        }

        /**
         * Initialize ghost content api constructor
         */
        this.api = new GhostContentAPI({
            url: this.homeUrl,
            key: this.contentApiKey,
            version: 'v2',
        })
    }

    allReplace = (retStr, obj) => {
        for (var x in obj) {
            retStr = retStr.replace(`##${x}`, obj[x])
        }
        return retStr
    }

    doSearch = async e => {
        this.searchTerm = e.target.value
        const posts = await this.api.posts.browse({
            limit: 'all',
            fields: this.fields,
        })
        const filteredPosts = posts.filter(post =>
            post.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        )

        console.log(posts)

        // if searchTerm's length is less then 1 character then stop here...
        if (this.searchTerm.length === 0) {
            this.showResult.innerHTML = ''
        } else {
            const result = filteredPosts
                .map(post => {
                    let replacerObj = {}
                    this.fields.split(',').forEach(variable => {
                        replacerObj[variable] = post[variable]
                    })
                    return this.allReplace(
                        this.singleResultTemplate,
                        replacerObj
                    )
                })
                .join(' ')
            this.showResult.innerHTML =
                this.resultTemplate !== undefined
                    ? this.resultTemplate.replace('##results', result)
                    : result
        }
    }
}

global.GhostSearch = GhostSearch
