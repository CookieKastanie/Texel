export class Downloader {
    static data(filename = 'download', type = Downloader.TEXT, data) {
        const element = document.createElement('a');

        switch(type) {  
            case Downloader.IMAGE:
                element.setAttribute('href', data);
                break;

            default:
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
                break;
        }
        
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    static text(filename, text) {
        Downloader.data(filename, Downloader.TEXT, text);
    }

    static canvasImage(filename, canvas) {
        Downloader.data(filename, Downloader.IMAGE, canvas.toDataURL('image/png'));
    }
}

Downloader.TEXT = 'TEXT';
Downloader.IMAGE = 'IMAGE';
