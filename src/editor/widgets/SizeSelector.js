import { Text } from "../../lang/Text";
import { Process } from "../../process/Process";
import { UITools } from "../UITools";

import './SizeSelector.css';

export class SizeSelector {
    constructor(container) {
        container.appendChild(UITools.create('label', {for: 'width-selector', text: Text.get('width')}));
        const widthSelector = UITools.create('input', {id: 'width-selector', type: 'number'});
        SizeSelector.currentWidthSelector = widthSelector;
        container.appendChild(widthSelector);


        container.appendChild(UITools.create('label', {for: 'height-selector', text: Text.get('height')}));
        const heightSelector = UITools.create('input', {id: 'height-selector', type: 'number'});
        SizeSelector.currentHeightSelector = heightSelector;
        container.appendChild(heightSelector);


        const sizeButton = UITools.create('button', {text: Text.get('apply')});
        container.appendChild(sizeButton);

        SizeSelector.refresh();

        sizeButton.addEventListener('click', () => {
            Process.setSelectedLayerSize(widthSelector.value, heightSelector.value);
            SizeSelector.refresh();
        });
    }

    static refresh() {
        const l = Process.getSelectedLayer();
        SizeSelector.currentWidthSelector.value = l.getWidth();
        SizeSelector.currentHeightSelector.value = l.getHeight();
    }
}
