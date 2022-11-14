var λ;

if (typeof (require) !== "undefined") {
    λ = require("functional.js");
}

var includes = (function () {
    "use strict";

    var includes = {},
        startTag = "<include>",
        endTag = "</include>",
        tags = [],
        src;

    var defaultOptions = {
    };

    includes.setSrc = function (val) {
        src = val;
    };

    includes.getTag = function (from) {
        var tag = {};
        tag.start = src.indexOf(startTag, from || 0);
        if (tag.start === -1) {
            return;
        }
        tag.end = src.indexOf(endTag, tag.start) + endTag.length;
        tag.inner = src.substring(tag.start + startTag.length, tag.end - endTag.length);
        return tag;
    };

    includes.getTags = function () {
        var tag = { end: 0 };
        tags = [];
        while ((tag = includes.getTag(tag.end))) {
            tags.push(tag);
        }
        return tags;
    };

    includes.process = function (options) {
        if (!options || !options.src) {
            return;
        }
        src = options.src;
    };

    return includes;
})();

if (typeof (exports) !== "undefined") {
    if (typeof (module) !== "undefined" && module.exports) {
        exports = module.exports = includes;
    }
    exports.includes = includes;
}