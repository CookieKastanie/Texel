export class UITools {
    static cleanQuery(selector) {
        const e = document.querySelector(selector);
        e.innerHTML = '';
        return e;
    }

    static create(tagName, options = {}) {
        const e = document.createElement(tagName);
        
        if(options.class) {
            if(typeof options.class == 'string') e.classList.add(options.class);
            else for(const c of options.class) e.classList.add(c);
            delete options.class;
        }

        if(options.text) {
            e.textContent = options.text;
            delete options.text;
        }

        for(const [key, value] of Object.entries(options)) e.setAttribute(key, value);

        return e;
    }
}
