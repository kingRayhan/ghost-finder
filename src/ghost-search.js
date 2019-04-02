import GhostContentAPI from '@tryghost/content-api'
import DOMPurify from 'dompurify'

class GhostSearch {
    constructor({
        selector = null,
        contentApiKey = null,
        homeUrl,
        fields = 'title,slug,html',
        showResult,
        resultTemplate,
        singleResultTemplate,
        excerpt_length = 15,
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

        this.excerpt_length = excerpt_length

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

    // source: https://stackoverflow.com/a/17606289/3705299
    allReplace = (retStr, obj) => {
        for (var x in obj) {
            retStr = retStr.replace(new RegExp(`##${x}`, 'g'), obj[x])
        }
        return retStr
    }

    doSearch = async e => {
        this.searchTerm = e.target.value
        const posts = await this.api.posts.browse({
            limit: 'all',
            fields: `${
                this.fields.split(',').includes('excerpt')
                    ? this.fields + ',html'
                    : this.fields
            }`,
            include: 'tags,authors',
        })

        const filteredPosts = posts.filter(post =>
            post.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        )

        // if searchTerm's length is less then 1 character then stop here...
        if (this.searchTerm.length === 0) {
            this.showResult.innerHTML = ''
        } else {
            const result = filteredPosts
                .map(post => {
                    let replacerObj = {}

                    let fieldsArray = this.fields.split(',')

                    /**
                     * Check fileds has primary_tag
                     */
                    if (fieldsArray.includes('primary_tag')) {
                        /**
                         * Tag fileds
                         * ------------------------
                         * primary_tag_name
                         * primary_tag_url
                         */
                        if (post.primary_tag) {
                            replacerObj['primary_tag_name'] =
                                post.primary_tag.name
                            replacerObj['primary_tag_url'] =
                                post.primary_tag.url
                        }
                    }

                    /**
                     * Check fileds has primary_author
                     */
                    if (fieldsArray.includes('primary_author')) {
                        /**
                         * Author fileds
                         * ------------------------
                         * primary_author_name
                         * primary_author_url
                         * primary_author_avater
                         */
                        if (post.primary_author) {
                            const {
                                name,
                                profile_image,
                                url,
                            } = post.primary_author
                            replacerObj['primary_author_name'] = name
                            replacerObj['primary_author_url'] = url
                            replacerObj['primary_author_avater'] = profile_image
                        }
                    }

                    /**
                     * Excerpt
                     * ---------------
                     * ##excerpt
                     */
                    if (fieldsArray.includes('excerpt')) {
                        if (post.html) {
                            let excerpt = DOMPurify.sanitize(post.html, {
                                ALLOWED_TAGS: [''],
                            })
                                .split(' ')
                                .slice(0, this.excerpt_length)
                                .join(' ')
                            replacerObj['excerpt'] = excerpt
                        }
                    }

                    /**
                     * itarate through all replacer
                     */
                    fieldsArray.forEach(variable => {
                        if (variable !== 'excerpt')
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
