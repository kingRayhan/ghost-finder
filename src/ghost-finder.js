/**
 * Ghost Finder
 * v3.0.0
 * @author kingrayhan
 * @url https://rayhan.info
 */
import "regenerator-runtime/runtime";
import GhostContentAPI from "@tryghost/content-api";
import dateFnsFormat from "date-fns/format";

const resultDefaultTemplate = `<ul class="search-results-wrapper">
                                    <p>Search match(es): ##resultCount</p>
                                    ##results
                                </ul>`;
const singleResultDefaultTemplate = `<li><a href="##url">##title</a></li>`;

// TODO: add matcher parameter
// TODO: event Type
// TODO: Templating in markup
class GhostFinder {
  resultCount = 0;

  constructor({
    input,
    showResult,
    contentApiKey,
    homeUrl = window.location.origin,
    resultTemplate = resultDefaultTemplate,
    singleResultTemplate = singleResultDefaultTemplate,
    excerpt_length = 250,
    /*
     *time_format = 'MMMM Do YYYY',
     */
    time_format = "MMMM dd yyyy",
  }) {
    /**
     * Chekc for errors
     */
    if (input === undefined) {
      throw new Error(`Provide "input" selector in options`);
    }
    if (showResult === undefined) {
      throw new Error(`Provide "showResult" selector in options`);
    }
    if (homeUrl === undefined) {
      throw new Error(`Provide "homeUrl" selector in options`);
    }
    if (contentApiKey === undefined || !contentApiKey.length) {
      throw new Error(`Provide "contentApiKey" selector in options`);
    }

    /**
     * Options
     */
    this.input = document.querySelector(input);
    this.homeUrl = homeUrl;
    this.contentApiKey = contentApiKey;
    this.resultTemplate = resultTemplate;
    this.singleResultTemplate = singleResultTemplate;
    this.showResult = document.querySelector(showResult);

    this.excerpt_length = excerpt_length;
    this.time_format = time_format;

    /**
     * trigger when user type to search
     */
    this.input.addEventListener("keyup", this.doSearch);

    /**
     * Initialize ghost content api constructor
     */
    this.api = new GhostContentAPI({
      url: this.homeUrl,
      key: this.contentApiKey,
      version: "v3",
    });
  }

  // Concept source: https://stackoverflow.com/a/17606289/3705299
  allReplace = (retStr, obj) => {
    for (var x in obj) {
      retStr = retStr.replace(new RegExp(`##${x}`, "g"), obj[x]);
    }
    return retStr;
  };

  doSearch = async (e) => {
    this.searchTerm = e.target.value;
    const posts = await this.api.posts.browse({
      limit: "all",
      fields: `title,url,slug,feature_image,published_at,primary_author,primary_tag`,
      include: "tags,authors",
      formats: ["plaintext"],
    });

    const filteredPosts = posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        post.plaintext.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });

    this.resultCount = filteredPosts.length;

    // if searchTerm's length is less then 1 character then stop here...
    if (this.searchTerm.length === 0) {
      this.showResult.innerHTML = "";
    } else {
      const result = filteredPosts
        .map((post) => {
          let replacerObj = {};

          /**
           * ##title
           */
          if (post.title) {
            replacerObj["title"] = post.title;
          }
          /**
           * ##url
           */
          if (post.title) {
            replacerObj["url"] = post.url;
          }

          /**
           * Tag fileds
           * ------------------------
           * primary_tag_name
           * primary_tag_url
           */
          if (post.primary_tag) {
            replacerObj["primary_tag_name"] = post.primary_tag.name;
            replacerObj["primary_tag_url"] = post.primary_tag.url;
          }

          /**
           * Author fileds
           * ------------------------
           * primary_author_name
           * primary_author_url
           * primary_author_avater
           */
          if (post.primary_author) {
            const { name, profile_image, url } = post.primary_author;
            replacerObj["primary_author_name"] = name;
            replacerObj["primary_author_url"] = url;
            replacerObj["primary_author_avater"] = profile_image;
          }
          /**
           * ------------------------
           * feature_image
           */
          if (post.feature_image) {
            replacerObj["feature_image"] = post.feature_image;
          }

          /**
           * Excerpt
           * ---------------
           * ##excerpt
           */
          if (post.plaintext) {
            replacerObj["excerpt"] = post.plaintext.slice(
              0,
              this.excerpt_length
            );
          }

          /**
           * Time
           * ---------------
           * ##published_at
           */

          if (post.published_at) {
            replacerObj["published_at"] = dateFnsFormat(
              new Date(post.published_at),
              this.time_format
            );
          }

          /**
           * Result Count
           */
          replacerObj["resultCount"] = this.resultCount;

          return this.allReplace(this.singleResultTemplate, replacerObj);
        }) // map
        .join(" ");

      // Push result html
      this.showResult.innerHTML =
        this.resultTemplate !== undefined
          ? this.resultTemplate
              .replace("##results", result)
              .replace("##resultCount", this.resultCount)
          : result;
    }
  };
}
global.GhostFinder = GhostFinder;
window.GhostFinder = GhostFinder;
export default GhostFinder;
