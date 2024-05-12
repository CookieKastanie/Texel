import { Text } from "../../lang/Text";
import { Process } from "../../process/Process";
import { UI } from "../UI";
import { UITools } from "../UITools";
import { Texture } from "akila/webgl";
import { Clipboard } from "../../process/Clipboard";

import './TexturePanel.css';

const paramsOptions = {
    minFilter: [Texture.LINEAR, Texture.NEAREST, Texture.LINEAR_MIPMAP_LINEAR, Texture.LINEAR_MIPMAP_NEAREST, Texture.NEAREST_MIPMAP_NEAREST, Texture.NEAREST_MIPMAP_LINEAR],
    magFilter: [Texture.LINEAR, Texture.NEAREST],
    wrap: [Texture.REPEAT, Texture.CLAMP_TO_EDGE, Texture.MIRRORED_REPEAT]
};

export class TexturePanel {
    constructor(container) {
        const detail = UITools.create('details', {class: 'texture-panel-button'});
        container.appendChild(detail);
        const textureLabel = UITools.create('summary', {class: 'texture-label', text: Text.get('textureLabel')});
        detail.appendChild(textureLabel);

        const texturePanel = UITools.create('div', {class: 'texture-selector'});
        detail.appendChild(texturePanel);

        this.parametersModals = new Array(Process.textureNumber);
        for(let i = 0; i < Process.textureNumber; ++i) {
            const imageHolder = UITools.create('div', {class: ['flex', 'image-holder']});
            const label = UITools.create('label', {class: 'texture-input-label'});
            const input = UITools.create('input', {type: 'file', accept: 'image/*'});
            const img = UITools.create('img', {src: './img/placeholder.png', alt: 'placeholder'});

            // Bouton pour applique la taille de l'image au buffer
            const imageSizeButton = UITools.create('button', {class: ['image-size-button', 'hidden']});
            imageSizeButton.addEventListener('click', () => {
                Process.setSelectedLayerSize(img.naturalWidth, img.naturalHeight);
                UI.call('refreshSize');
            });

            const textureLetter = String.fromCharCode(65 + i);
            const textureLetterButton = UITools.create('button', {class: 'texture-letter-button', text: textureLetter});
            textureLetterButton.addEventListener('click', () => {
                Clipboard.copyText(`tex${textureLetter}`);
            });

            this.parametersModals[i] = UITools.create('details', {class: ['image-parameters-button', 'hidden']});
            this.refreshParametersModal(i);

            input.addEventListener('change', event => {
                const input = event.target;
                const index = i;
                if(input.files && input.files[0]) {
                    const reader = new FileReader();
                    reader.onload = e => {
                        img.src = e.target.result;
                        img.onload = () => {
                            Process.updateTexture(index, img);
                            imageSizeButton.classList.remove('hidden');
                            imageSizeButton.textContent = `${img.naturalWidth} x ${img.naturalHeight}`;
                            this.parametersModals[index].classList.remove('hidden');
                        }
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            });

            label.appendChild(input);
            label.appendChild(img);
            imageHolder.appendChild(label);
            imageHolder.appendChild(imageSizeButton);
            imageHolder.appendChild(this.parametersModals[i]);
            imageHolder.appendChild(textureLetterButton);
            texturePanel.appendChild(imageHolder);
        }
    }

    refreshParametersModal(index) {
        const params = Process.getTextureParams(index);

        const parametersButton = this.parametersModals[index];
        parametersButton.innerHTML = '';

        const parametersButtonSummary = UITools.create('summary', {text: '⚙'});
        parametersButton.appendChild(parametersButtonSummary);
        const parametersContent = UITools.create('div', {class: 'texture-parameters'});
        parametersButton.appendChild(parametersContent);

        const minFilterLabel = UITools.create('label', {for: `min-filter-tex-${index}`, text: Text.get('minFilter')});
        const minFilterSelect = UITools.create('select', {id: `min-filter-tex-${index}`});
        parametersContent.appendChild(minFilterLabel);
        parametersContent.appendChild(minFilterSelect);
        

        const magFilterLabel = UITools.create('label', {for: `mag-filter-tex-${index}`, text: Text.get('magFilter')});
        const magFilterSelect = UITools.create('select', {id: `mag-filter-tex-${index}`});
        parametersContent.appendChild(magFilterLabel);
        parametersContent.appendChild(magFilterSelect);


        const wrapSLabel = UITools.create('label', {for: `wrap-s-tex-${index}`, text: Text.get('wrapS')});
        const wrapSSelect = UITools.create('select', {id: `wrap-s-tex-${index}`});
        parametersContent.appendChild(wrapSLabel);
        parametersContent.appendChild(wrapSSelect);


        const wrapTLabel = UITools.create('label', {for: `wrap-t-tex-${index}`, text: Text.get('wrapT')});
        const wrapTSelect = UITools.create('select', {id: `wrap-t-tex-${index}`});
        parametersContent.appendChild(wrapTLabel);
        parametersContent.appendChild(wrapTSelect);


        const changeCallback = () => {
            const params = Process.getTextureParams(index);
            params.minFilter = minFilterSelect.value;
            params.magFilter = magFilterSelect.value;
            params.wrapS = wrapSSelect.value;
            params.wrapT = wrapTSelect.value;

            Process.setTextureParams(index, params);
        }

        const filterText = (text) => {
            const arr = text.toLocaleLowerCase().split('_');

            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
            }

            return arr.join(' ');
        }

        minFilterSelect.addEventListener('change', changeCallback);
        for(const opt of paramsOptions.minFilter) {
            const filterOption = UITools.create('option', {value: opt, text: filterText(opt)});
            filterOption.selected = opt === params.minFilter;
            minFilterSelect.appendChild(filterOption);
        }

        magFilterSelect.addEventListener('change', changeCallback);
        for(const opt of paramsOptions.magFilter) {
            const filterOption = UITools.create('option', {value: opt, text: filterText(opt)});
            filterOption.selected = opt === params.magFilter;
            magFilterSelect.appendChild(filterOption);
        }

        wrapSSelect.addEventListener('change', changeCallback);
        for(const opt of paramsOptions.wrap) {
            const filterOption = UITools.create('option', {value: opt, text: filterText(opt)});
            filterOption.selected = opt === params.wrapS;
            wrapSSelect.appendChild(filterOption);
        }

        wrapTSelect.addEventListener('change', changeCallback);
        for(const opt of paramsOptions.wrap) {
            const filterOption = UITools.create('option', {value: opt, text: filterText(opt)});
            filterOption.selected = opt === params.wrapT;
            wrapTSelect.appendChild(filterOption);
        }
    }

    refreshTextureParameters() {
        for(let i = 0; i < Process.textureNumber; ++i) {
            this.refreshParametersModal(i);
        }
    }
}
