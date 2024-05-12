const copyTextFallback = text => {
    const element = document.createElement('input');
    document.body.appendChild(element);
    element.value = text;
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);
}

export class Clipboard {
    static copyText(text) {
        if (navigator.clipboard){
            navigator.clipboard.writeText(text).catch(() => {
                copyTextFallback(text);
            });
        } else {
            copyTextFallback(text);
        }
    }
}
