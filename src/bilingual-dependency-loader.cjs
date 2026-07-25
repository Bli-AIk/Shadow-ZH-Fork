const fs = require('node:fs');
const path = require('node:path');

module.exports = function bilingualDependencyLoader(source) {
    const wikiRoot = path.resolve(this.rootContext, 'content/en/wiki');
    const relativePath = path.relative(wikiRoot, this.resourcePath);

    if (!relativePath.startsWith('..') && !path.isAbsolute(relativePath)) {
        const chinesePath = path.resolve(this.rootContext, 'content/zh/wiki', relativePath);

        if (fs.existsSync(chinesePath)) {
            this.addDependency(chinesePath);
        } else if (this.addMissingDependency) {
            this.addMissingDependency(chinesePath);
        }
    }

    return source;
};
