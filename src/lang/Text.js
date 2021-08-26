import fr from './fr';
import en from './en';

const langs = new Object();

export class Text {
    static init() {
        langs[Text.ENGLISH] = en;
        langs[Text.FRENCH] = fr;

        Text.setLanguage(Text.DEFAULT);
    }

    static setLanguage(lang) {
        Text.currentLang = langs[lang];
        if(!Text.currentLang) Text.currentLang = langs[Text.DEFAULT];
    }

    static get(key) {
        return Text.currentLang[key];
    }
}

Text.ENGLISH = 'en';
Text.FRENCH = 'fr';
Text.DEFAULT = Text.FRENCH;
