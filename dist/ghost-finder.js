'use strict';

var _contentApi = require('@tryghost/content-api');

var _contentApi2 = _interopRequireDefault(_contentApi);

var _dompurify = require('dompurify');

var _dompurify2 = _interopRequireDefault(_dompurify);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _sweetalert = require('sweetalert');

var _sweetalert2 = _interopRequireDefault(_sweetalert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * Ghost Finder
                                                                                                                                                           * v1.0.1
                                                                                                                                                           * @author kingrayhan
                                                                                                                                                           * @url https://rayhan.info
                                                                                                                                                           */

var resultDefaultTemplate = '<ul class="search-results-wrapper">\n                                    <p>Search match(es): ##resultCount</p>\n                                    ##results\n                                </ul>';
var singleResultDefaultTemplate = '<li><a href="##url">##title</a></li>';

// TODO: add matcher parameter
// TODO: event Type
// TODO: Templating in markup

var GhostFinder = function GhostFinder(_ref) {
    var _this = this;

    var input = _ref.input,
        showResult = _ref.showResult,
        contentApiKey = _ref.contentApiKey,
        _ref$homeUrl = _ref.homeUrl,
        homeUrl = _ref$homeUrl === undefined ? window.location.origin : _ref$homeUrl,
        _ref$resultTemplate = _ref.resultTemplate,
        resultTemplate = _ref$resultTemplate === undefined ? resultDefaultTemplate : _ref$resultTemplate,
        _ref$singleResultTemp = _ref.singleResultTemplate,
        singleResultTemplate = _ref$singleResultTemp === undefined ? singleResultDefaultTemplate : _ref$singleResultTemp,
        _ref$excerpt_length = _ref.excerpt_length,
        excerpt_length = _ref$excerpt_length === undefined ? 15 : _ref$excerpt_length,
        _ref$time_format = _ref.time_format,
        time_format = _ref$time_format === undefined ? 'MMMM Do YYYY' : _ref$time_format;

    _classCallCheck(this, GhostFinder);

    this.resultCount = 0;

    this.allReplace = function (retStr, obj) {
        for (var x in obj) {
            retStr = retStr.replace(new RegExp('##' + x, 'g'), obj[x]);
        }
        return retStr;
    };

    this.doSearch = function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
            var posts, filteredPosts, result;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _this.searchTerm = e.target.value;
                            _context.next = 3;
                            return _this.api.posts.browse({
                                limit: 'all',
                                fields: 'title,url,slug,html,feature_image,published_at,primary_author,primary_tag',
                                include: 'tags,authors'
                            });

                        case 3:
                            posts = _context.sent;
                            filteredPosts = posts.filter(function (post) {
                                return post.title.toLowerCase().includes(_this.searchTerm.toLowerCase());
                            });


                            _this.resultCount = filteredPosts.length;

                            // if searchTerm's length is less then 1 character then stop here...
                            if (_this.searchTerm.length === 0) {
                                _this.showResult.innerHTML = '';
                            } else {
                                result = filteredPosts.map(function (post) {
                                    var replacerObj = {};

                                    /**
                                     * ##title
                                     */
                                    if (post.title) {
                                        replacerObj['title'] = post.title;
                                    }
                                    /**
                                     * ##url
                                     */
                                    if (post.title) {
                                        replacerObj['url'] = post.url;
                                    }

                                    /**
                                     * Tag fileds
                                     * ------------------------
                                     * primary_tag_name
                                     * primary_tag_url
                                     */
                                    if (post.primary_tag) {
                                        replacerObj['primary_tag_name'] = post.primary_tag.name;
                                        replacerObj['primary_tag_url'] = post.primary_tag.url;
                                    }

                                    /**
                                     * Author fileds
                                     * ------------------------
                                     * primary_author_name
                                     * primary_author_url
                                     * primary_author_avater
                                     */
                                    if (post.primary_author) {
                                        var _post$primary_author = post.primary_author,
                                            name = _post$primary_author.name,
                                            profile_image = _post$primary_author.profile_image,
                                            url = _post$primary_author.url;

                                        replacerObj['primary_author_name'] = name;
                                        replacerObj['primary_author_url'] = url;
                                        replacerObj['primary_author_avater'] = profile_image;
                                    }
                                    /**
                                     * ------------------------
                                     * feature_image
                                     */
                                    if (post.feature_image) {
                                        replacerObj['feature_image'] = post.feature_image;
                                    }

                                    /**
                                     * Excerpt
                                     * ---------------
                                     * ##excerpt
                                     */
                                    if (post.html) {
                                        var excerpt = _dompurify2.default.sanitize(post.html, {
                                            ALLOWED_TAGS: ['']
                                        }).split(' ').slice(0, _this.excerpt_length).join(' ');
                                        replacerObj['excerpt'] = excerpt;
                                    }

                                    /**
                                     * Time
                                     * ---------------
                                     * ##published_at
                                     */

                                    if (post.published_at) {
                                        replacerObj['published_at'] = (0, _moment2.default)(post.published_at).format(_this.time_format);
                                    }

                                    /**
                                     * Result Count
                                     */
                                    replacerObj['resultCount'] = _this.resultCount;

                                    return _this.allReplace(_this.singleResultTemplate, replacerObj);
                                }) // map
                                .join(' ');

                                // Push result html

                                _this.showResult.innerHTML = _this.resultTemplate !== undefined ? _this.resultTemplate.replace('##results', result).replace('##resultCount', _this.resultCount) : result;
                            }

                        case 7:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this);
        }));

        return function (_x) {
            return _ref2.apply(this, arguments);
        };
    }();

    /**
     * Chekc for errors
     */
    if (input === undefined) {
        return (0, _sweetalert2.default)('Ghost Finder Error', 'Provide "input" selector in options', 'error');
    }
    if (showResult === undefined) {
        return (0, _sweetalert2.default)('Ghost Finder Error', 'Provide "showResult" selector in options', 'error');
    }
    if (homeUrl === undefined) {
        return (0, _sweetalert2.default)('Ghost Finder Error', 'Provide "homeUrl" selector in options', 'error');
    }
    if (contentApiKey === undefined) {
        return (0, _sweetalert2.default)('Ghost Finder Error', 'Provide "contentApiKey" selector in options', 'error');
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
    this.input.addEventListener('keyup', this.doSearch);

    /**
     * Initialize ghost content api constructor
     */
    this.api = new _contentApi2.default({
        url: this.homeUrl,
        key: this.contentApiKey,
        version: 'v2'
    });
}

// Concept source: https://stackoverflow.com/a/17606289/3705299
;

global.GhostFinder = GhostFinder;