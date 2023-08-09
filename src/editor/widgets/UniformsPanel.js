import { UI } from '../UI';
import { UITools } from '../UITools';
import './UniformsPanel.css';

export class UniformsPanel {
	constructor(container) {
		const p = UITools.create('p', {text: 'UNIFORMS'});

		container.appendChild(p);
	}

	createScalarUI() {
		const input = UITools.create('input', {type: 'number'});
	}
}
