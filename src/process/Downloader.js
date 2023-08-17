export class Downloader {
    static async data(blob, options = {}) {
        options.name ??= 'download';
        options.extension ??= 'txt';
        options.mimetype ??= 'text/plain';

        // Feature detection. The API needs to be supported
        // and the app not run in an iframe.
        const supportsFileSystemAccess =
        'showSaveFilePicker' in window &&
        (() => {
        try {
            return window.self === window.top;
        } catch {
            return false;
        }
        })();

        if (supportsFileSystemAccess) {
            try {
                const accept = {};
                accept[options.mimetype] = [`.${options.extension}`];
                const handle = await showSaveFilePicker({
                    suggestedName: options.name,
                    types: [{accept}]
                });

                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();
                return;
            } catch (err) {
                return;
            }
        }

        // Fallback if the File System Access API is not supported…
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl
        a.download = `${options.name}.${options.extension}`;
        a.style.display = 'none';
        document.body.append(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
    } 

    static async text(name, text) {
        const blob = new Blob([text], {type: 'text/plain'});
        await Downloader.data(blob, {name});
    }

    static async texel(name, text) {
        const blob = new Blob([text], {type: 'text/plain'});
        await Downloader.data(blob, {name, extension: 'txl', mimetype: 'texel/plain'});
    }

    static async canvasImage(name, canvas) {
        return new Promise(resolve => {
            canvas.toBlob(async blob => {
                await Downloader.data(blob, {name, extension: 'png', mimetype: 'image/png'});
                resolve();
            }, 'image/png', 1);
        });
    }
}
