import { Text } from "../../lang/Text";
import { UITools } from "../UITools";
import { Process } from "../../process/Process";
import { Mesh } from "../../process/Mesh";

import './MeshSelector.css';

export class MeshSelector {
    constructor(container) {
        const selectorLabel = UITools.create('label', {text: Text.get('meshSelectorLabel')});
        container.appendChild(selectorLabel);

        MeshSelector.selector = UITools.create('select');
        MeshSelector.names = [Text.get('defaultMeshName'), Text.get('sphereMeshName'), Text.get('cubeMeshName'), Text.get('custom')];
        for(let i = 0; i < MeshSelector.names.length; ++i) {
            const option = UITools.create('option', {class: 'mesh-selector-option', text: MeshSelector.names[i]});
            MeshSelector.selector.appendChild(option);
        }
        container.appendChild(MeshSelector.selector);

        MeshSelector.meshs = [Mesh.quad, Mesh.sphere, Mesh.cube, Mesh.custom];
        MeshSelector.selector.addEventListener('change', () => {
            Process.setSelectedLayerMesh(MeshSelector.meshs[MeshSelector.selector.selectedIndex]);
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

    static refresh() {
        const l = Process.getSelectedLayer();
        const m = l.getMesh();

        for(let i = 0; i < MeshSelector.meshs.length; ++i) {
            if(MeshSelector.meshs[i] == m) {
                MeshSelector.selector.selectedIndex = i;
            }
        }
    }
}
