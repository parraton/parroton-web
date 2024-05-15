const path = require('path');
const fs = require('fs');

const uaLocal = require('./ua.json');

//TODO: check in production mode

function addUaLocaleToTonConnect() {

//resolve path to the @ton-connect/ui locales folder
    const tonConnectLocalesPath = path.resolve(require.resolve('@tonconnect/ui'));

    const origin = 'index.cjs';
    const minified = 'index.mjs';
    const minifiedPath = tonConnectLocalesPath.replace(origin, minified);

    const files = [tonConnectLocalesPath, minifiedPath];

    files.forEach(file => {
        //read this file
        const tonConnectLocalesFile = fs.readFileSync(file, 'utf8');

        const dictionaryText = `
const i18nDictionary = {
  en: parseDictionary(en),
  ru: parseDictionary(ru)
};
`
        if (!tonConnectLocalesFile.includes(dictionaryText)) {
            return;
        }

        const newDictionaryText = `
const ua = ${JSON.stringify(uaLocal, null, 2)};
const i18nDictionary = {
    en: parseDictionary(en),
    ru: parseDictionary(ru),
    ua: parseDictionary(ua)
};
`
        const newTonConnectLocalesFile = tonConnectLocalesFile.replace(dictionaryText, newDictionaryText);

        const isFileChanged = newTonConnectLocalesFile !== tonConnectLocalesFile && newTonConnectLocalesFile.includes(newDictionaryText);

//replace file with new content
        if (isFileChanged) {
            fs.writeFileSync(file, newTonConnectLocalesFile, 'utf8');
            console.log(`Added ua locale to @ton-connect/ui for${file}`);
        }
    })
}

module.exports = {
    addUaLocaleToTonConnect
}
