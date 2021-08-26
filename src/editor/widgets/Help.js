import { Text } from "../../lang/Text";
import { UITools } from "../UITools";

import './Help.css';

export class Help {
    constructor(container) {
        container.appendChild(UITools.create('p', {class: 'help-button', text: Text.get('help')}));
        container.appendChild(UITools.create('pre', {class: 'help-text', text: Text.get('helpText')}));
    }
}
