import { Text } from "../../lang/Text";
import { Process } from "../../process/Process";
import { UITools } from "../UITools";

import './SizeSelector.css';

export class SizeSelector {
    constructor(container) {
        container.appendChild(UITools.create('label', {for: 'width-selector', text: Text.get('width')}));
        const widthSelector = UITools.create('input', {id: 'width-selector', type: 'text'});
        this.widthSelector = widthSelector;
        container.appendChild(widthSelector);


        container.appendChild(UITools.create('label', {for: 'height-selector', text: Text.get('height')}));
        const heightSelector = UITools.create('input', {id: 'height-selector', type: 'text'});
        this.heightSelector = heightSelector;
        container.appendChild(heightSelector);


        const sizeButton = UITools.create('button', {text: Text.get('apply')});
        container.appendChild(sizeButton);

        this.refreshSize();

        sizeButton.addEventListener('click', () => {
            const parseValue = (value, defaultValue) => {
                let result = defaultValue;
                try {
                    if(value.match(/^([0-9]|\+|\-|\*|\/)*$/g)) {
                        result = parseInt(eval(value));
                    }
                } finally {
                    return result;
                }
            }

            const l = Process.getSelectedLayer();
            Process.setSelectedLayerSize(
                parseValue(widthSelector.value, l.getWidth()),
                parseValue(heightSelector.value, l.getHeight())
            );
        });
    }

    refreshSize() {
        const l = Process.getSelectedLayer();
        this.widthSelector.value = l.getWidth();
        this.heightSelector.value = l.getHeight();
    }
}
