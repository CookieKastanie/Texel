import { Text } from "../../lang/Text";
import { Process } from "../../process/Process";
import { UITools } from "../UITools";

import './FileOptions.css';

export class FileOptions {
    constructor(conatainer) {
        const fileOptionsButton = UITools.create('p', {class: 'file-options-button', text: Text.get('fileOptions')});

        const dropdown = UITools.create('div', {class: 'file-options-content'});

        const importinput = UITools.create('span', {text: Text.get('openFile')});
        importinput.addEventListener('click', () => {
            const file = UITools.create('input', {type: 'file', accept: '.txl'});

            file.addEventListener('change', event => {
                const input = event.target;
                if(input.files && input.files[0]) {
                    const reader = new FileReader();
                    reader.onload = e => {
                        Process.uploadPrograms(e.target.result);
                    };
                    reader.readAsText(input.files[0]);
                }
            });

            file.click();
        });
        dropdown.appendChild(importinput);

        const exportButton = UITools.create('span', {text: Text.get('saveAs')});
        exportButton.addEventListener('click', () => {
            Process.downloadPrograms();
        });
        dropdown.appendChild(exportButton);


        /////////////////////////////////////

        const saveImageButton = UITools.create('span', {text: Text.get('exportImage')});
        saveImageButton.addEventListener('click', () => {
            Process.saveCurrentImage();
        });
        dropdown.appendChild(saveImageButton);

        /////////////////////////////////////

        const resetButton = UITools.create('span', {text: Text.get('resetAll')});
        resetButton.addEventListener('click', () => {
            if(window.confirm(Text.get('confirmResetAll')) !== true) {
                return;
            } 

            Process.resetAll();
        });
        dropdown.appendChild(resetButton);

        conatainer.appendChild(fileOptionsButton);
        conatainer.appendChild(dropdown);
    }
}
