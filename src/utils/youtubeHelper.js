const fetch = require("node-fetch");
var exports = module.exports = {};

const videoCategories = {
    Music: '🎵',
    Gaming: '🎮',
    Other: '📺'
}

exports.isGettingVideoInfo = false;

exports.getVideoInfo = async function (videoId) {
    exports.isGettingVideoInfo = true;
    var ytr = { title: null, uploader: null, likes: null, dislikes: null, views: null, category: null }
    await fetch(`https://www.youtube.com/watch?pbj=1&v=${videoId}`, {
        headers: {
            'x-youtube-client-name': '1',
            'x-youtube-client-version': '2.20180905'
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (jsd) {
            ytr.title = jsd[2].player.args.title
            ytr.uploader = jsd[2].player.args.author
            ytr.likes = jsd[3].response.contents.twoColumnWatchNextResults.results.results.contents[0].videoPrimaryInfoRenderer.sentimentBar.sentimentBarRenderer.tooltip.split(' / ')[0]
            ytr.dislikes = jsd[3].response.contents.twoColumnWatchNextResults.results.results.contents[0].videoPrimaryInfoRenderer.sentimentBar.sentimentBarRenderer.tooltip.split(' / ')[1]
            ytr.views = jsd[3].response.contents.twoColumnWatchNextResults.results.results.contents[0].videoPrimaryInfoRenderer.viewCount.videoViewCountRenderer.viewCount.simpleText.split(' ')[0]
            try {
                ytr.category = jsd[3].response.contents.twoColumnWatchNextResults.results.results.contents[1].videoSecondaryInfoRenderer.metadataRowContainer.metadataRowContainerRenderer.rows[1].metadataRowRenderer.contents[0].runs[0].text
            } catch (e) {
                ytr.category = jsd[3].response.contents.twoColumnWatchNextResults.results.results.contents[1].videoSecondaryInfoRenderer.metadataRowContainer.metadataRowContainerRenderer.rows[0].metadataRowRenderer.contents[0].runs[0].text
            }
        });

    exports.isGettingVideoInfo = false;
    return ytr;
}

exports.getCategoryIcon = function (name) {
    var icon = videoCategories[name];
    if (!icon) return videoCategories.Other;
    return icon;
}
