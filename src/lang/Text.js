import fr from './fr';
import en from './en';

const langs = new Object();

const parseLangStr = str => {
    if(typeof str !== 'string') {
        return Text.DEFAULT;
    }

    if(str.length < 2) {
        return Text.DEFAULT;
    }

    return str.substring(0, 2).toLowerCase();
}

export class Text {
    static init(lang = Text.DEFAULT) {
        langs[Text.ENGLISH] = en;
        langs[Text.FRENCH] = fr;

        Text.setLanguage(lang);
    }

    static setLanguage(lang) {
        Text.currentLang = langs[parseLangStr(lang)];
        if(!Text.currentLang) Text.currentLang = langs[Text.DEFAULT];
    }

    static get(key) {
        return Text.currentLang[key];
    }
}

Text.ENGLISH = 'en';
Text.FRENCH = 'fr';
Text.DEFAULT = Text.FRENCH;
