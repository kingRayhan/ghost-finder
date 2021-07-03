import GhostFinder from '../dist/ghost-finder'

new GhostFinder({
    input: '#search-input',
    showResult: '#search-result',
    contentApiKey: '66a2f6ba7d2aeeebc1325a0625',
    homeUrl: 'http://localhost:2368',
    singleResultTemplate: '<li><a href="##url">##excerpt</a></li>'
})