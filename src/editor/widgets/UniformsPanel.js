import { Text } from "../../lang/Text";
import { Process } from '../../process/Process';
import { UI } from "../UI";
import { UITools } from '../UITools';

import './UniformsPanel.css';

const hexStringToColor = hex => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    return {r, g, b};
}

const colorToHexString = (r, g, b) => {
    return '#' + ("000000" + (((Math.round(r * 255)) << 16) + (Math.round(g * 255) << 8) + ((Math.round(b * 255)))).toString(16)).slice(-6);
}

export class UniformsPanel {
    constructor(container) {
        const p = UITools.create('p', {text: Text.get('uniforms')});

        this.uniformContainer = UITools.create('div');

        container.appendChild(p);
        container.appendChild(this.uniformContainer);
        this.mainContainer = container;
    }

    createDrop(options) {
        const select = UITools.create('select', {class: 'uniform-drop'});
        for(const o of options) {
            const option = UITools.create('option', {value: o, text: Text.get(o)});
            select.appendChild(option);
        }

        return select;
    }

    createInputsNumberGroup(container, values, isInt = false, range = false) {
        for(let i = 0; i < values.length; ++i) {
            let input;

            const callback = () => {
                values[i] = input.value;
                const layer = Process.getSelectedLayer();
                layer.forceRender();
            }

            if(range && isInt === false) {
                input = UITools.create('input', {type: 'range', min: 0, max: 1, step: 0.01});
                input.addEventListener('input', callback);
            } else {
                const step = isInt ? 1 : 0.1;
                input = UITools.create('input', {type: 'number', step});
            }

            input.value = values[i];
            input.addEventListener('change', callback);

            container.appendChild(input);
        }
    }

    createInputsColorGroup(container, values, alpha = false) {
        const inputColor = UITools.create('input', {type: 'color'});
        inputColor.value = colorToHexString(values[0], values[1], values[2]);

        const inputColorCallback = () => {
            const color = hexStringToColor(inputColor.value);

            values[0] = color.r;
            values[1] = color.g;
            values[2] = color.b;

            const layer = Process.getSelectedLayer();
            layer.forceRender();
        }

        inputColor.addEventListener('change', inputColorCallback);
        inputColor.addEventListener('input', inputColorCallback);

        container.appendChild(inputColor);

        if(alpha) {
            const inputAlpha = UITools.create('input', {type: 'range', min: 0, max: 1, step: 0.01});
            inputAlpha.value = values[3];

            const inputAlphaCallback = () => {
                values[3] = inputAlpha.value;
                const layer = Process.getSelectedLayer();
                layer.forceRender();
            }

            inputAlpha.addEventListener('change', inputAlphaCallback);
            inputAlpha.addEventListener('input', inputAlphaCallback);
            container.appendChild(inputAlpha);
        }
    }

    createInputsCheckboxGroup(container, values) {
        for(let i = 0; i < values.length; ++i) {
            const input = UITools.create('input', {type: 'checkbox'});
            input.checked = values[i];

            input.addEventListener('change', () => {
                values[i] = input.checked;
                const layer = Process.getSelectedLayer();
                layer.forceRender();
            });

            container.appendChild(input);
        }
    }

    createUniformUI(unifName, unif) {
        const div = UITools.create('div', {class: 'uniform'});

        const header = UITools.create('div', {class: 'uniform-header'});

        const name = UITools.create('span', {class: 'uniform-name', text: unifName});
        header.appendChild(name);

        const valsGroup = UITools.create('div', {class: 'uniform-values'});

        const options = [];
        if(unif.type !== 'BOOL') options.push('number');
        if(unif.type === 'FLOAT') options.push('range');
        if(unif.type === 'FLOAT' && unif.length >= 3) options.push('color');

        if(options.length > 1) {
            const select = this.createDrop(options);
            header.appendChild(select);

            const changeCallback = () => {
                valsGroup.innerHTML = '';

                unif.ui = select.value;

                if(select.value === 'color') {
                    this.createInputsColorGroup(valsGroup, unif.value, unif.length === 4);
                } else if(select.value === 'range') {
                    this.createInputsNumberGroup(valsGroup, unif.value, false, true);
                } else {
                    this.createInputsNumberGroup(valsGroup, unif.value, unif.type === 'INT');
                }
            }

            select.addEventListener('change', changeCallback);
            if(options.find((e) => e === unif.ui)) {
                select.value = unif.ui;
                changeCallback();
            } else {
                this.createInputsNumberGroup(valsGroup, unif.value);
            }
            
        } else if(unif.type === 'BOOL') {
            this.createInputsCheckboxGroup(valsGroup, unif.value);
        } else {
            this.createInputsNumberGroup(valsGroup, unif.value, true);
        }

        const button = UITools.create('button', {class: 'uniform-delete-btn', text: 'X'});
        button.disabled = unif.active;
        button.addEventListener('click', () => {
            const layer = Process.getSelectedLayer();
            layer.deleteUserUniform(unifName);
        });

        header.appendChild(button);

        div.appendChild(header);
        div.appendChild(valsGroup);

        return div;
    }

    refreshUniforms() {
        const layer = Process.getSelectedLayer();

        this.uniformContainer.innerHTML = '';

        const uniforms = layer.getUserUniforms();

        if(Object.keys(uniforms).length === 0) {
            this.mainContainer.classList.add('hidden');
            console.log('hide')
            UI.split.elements[0].minSize = 0;
            UI.split.collapse(0);
            //UI.split.set
        } else {
            this.mainContainer.classList.remove('hidden');
            UI.split.elements[0].minSize = 200;
            UI.split.collapse(0);
            console.log('show')
        }

        for(const unifName in uniforms) {
            const unif = uniforms[unifName];
            this.uniformContainer.appendChild(this.createUniformUI(unifName, unif));
        }
    }
}
