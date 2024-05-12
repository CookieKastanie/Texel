export class Clipboard {
    static copyText(text) {
        navigator.clipboard.writeText(text).catch(() => {
            if (!navigator.clipboard){
                const element = document.createElement('input');
                document.body.appendChild(element);
                element.value = text;
                element.select();
                document.execCommand('copy');
                document.body.removeChild(element);
            } else {
                navigator.clipboard.writeText(text);
            }
        });
    }
}
