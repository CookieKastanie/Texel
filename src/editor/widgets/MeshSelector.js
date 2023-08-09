import { Text } from "../../lang/Text";
import { UITools } from "../UITools";
import { Process } from "../../process/Process";
import { Mesh } from "../../process/Mesh";

import './MeshSelector.css';

export class MeshSelector {
    constructor(container) {
        const selectorLabel = UITools.create('label', {text: Text.get('meshSelectorLabel')});
        container.appendChild(selectorLabel);

        this.selector = UITools.create('select');
        this.names = [Text.get('defaultMeshName'), Text.get('sphereMeshName'), Text.get('cubeMeshName'), Text.get('custom')];
        for(let i = 0; i < this.names.length; ++i) {
            const option = UITools.create('option', {class: 'mesh-selector-option', text: this.names[i]});
            this.selector.appendChild(option);
        }
        container.appendChild(this.selector);

        this.meshs = [Mesh.quad, Mesh.sphere, Mesh.cube, Mesh.custom];
        this.selector.addEventListener('change', () => {
            Process.setSelectedLayerMesh(this.meshs[this.selector.selectedIndex]);
        });

        ///////////////////////////////////////////////////////////

        const openMeshButton = UITools.create('button', {text: `${Text.get('import')} (OBJ)`});
        openMeshButton.addEventListener('click', () => {
            const file = UITools.create('input', {type: 'file', accept: '.obj'});

            file.addEventListener('change', event => {
                const input = event.target;
                if(input.files && input.files[0]) {
                    const reader = new FileReader();
                    reader.onload = e => {
                        Mesh.loadFromOBJText(e.target.result);
                    };
                    reader.readAsText(input.files[0]);
                }
            });

            file.click();
        });
        container.appendChild(openMeshButton);
    }

    refreshMesh() {
        const l = Process.getSelectedLayer();
        const m = l.getMesh();

        for(let i = 0; i < this.meshs.length; ++i) {
            if(this.meshs[i] == m) {
                this.selector.selectedIndex = i;
            }
        }
    }
}
