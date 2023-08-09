import { Text } from "../../lang/Text";
import { Process } from "../../process/Process";
import { UI } from "../UI";
import { UITools } from "../UITools";

import './BufferSelector.css';

export class BufferSelector {
    constructor(container) {
        const selectorLabel = UITools.create('label', {text: Text.get('bufferSelectorLabel')});
        container.appendChild(selectorLabel);

        const selector = UITools.create('select');
        const chars = ['A', 'B', 'C', 'D'];
        for(let i = 0; i < Process.layerNumber; ++i) {
            const option = UITools.create('option', {class: 'buffer-selector-option', text: chars[i]});
            selector.appendChild(option);
        }
        container.appendChild(selector);

        selector.addEventListener('change', () => {
            Process.selectLayer(selector.selectedIndex);
            UI.call('refreshSize');
            UI.call('refreshMesh');
        });
    }
}
