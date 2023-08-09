import { Text } from "../../lang/Text";
import { Process } from "../../process/Process";
import { UI } from "../UI";
import { UITools } from "../UITools";

import './TexturePanel.css';

export class TexturePanel {
    constructor(container) {
        const detail = UITools.create('details', {class: 'texture-panel-button'});
        container.appendChild(detail);
        const textureLabel = UITools.create('summary', {class: 'texture-label', text: Text.get('textureLabel')});
        detail.appendChild(textureLabel);

        const texturePanel = UITools.create('div', {class: 'texture-selector'});
        detail.appendChild(texturePanel);

        for(let i = 0; i < Process.textureNumber; ++i) {
            const imageHolder = UITools.create('div', {class: ['flex', 'imageHolder']});
            const label = UITools.create('label', {class: 'textureLabel'});
            const input = UITools.create('input', {type: 'file', accept: 'image/*'});
            const img = UITools.create('img', {src: './img/placeholder.png', alt: 'placeholder'});

            // Bouton pour applique la taille de l'image au buffer
            const imageSizeButton = UITools.create('button', {class: ['image-size-button', 'hidden']});
            imageSizeButton.addEventListener('click', () => {
                Process.setSelectedLayerSize(img.naturalWidth, img.naturalHeight);
                UI.call('refreshSize');
            });

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
                        }
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            });

            label.appendChild(input);
            label.appendChild(img);
            label.appendChild(imageSizeButton);
            imageHolder.appendChild(label);
            texturePanel.appendChild(imageHolder);
        }
    }
}
