export class Clipboard {
    static copyText(text) {
        navigator.clipboard.writeText(text).catch(() => {
            const element = document.createElement('input');
            document.body.appendChild(element);
            element.value = text;
            element.select();
            document.execCommand('copy');
            document.body.removeChild(element);
        });
    }
}
