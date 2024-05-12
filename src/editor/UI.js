import { Text } from "../lang/Text";
import { Editor } from "./Editor";
import split from '../libs/split/split';
import { SizeSelector } from "./widgets/SizeSelector";
import { UITools } from "./UITools";
import { BufferSelector } from "./widgets/BufferSelector";
import { Help } from "./widgets/Help";
import { TexturePanel } from "./widgets/TexturePanel";
import { FileOptions } from "./widgets/FileOptions";
import { MeshSelector } from "./widgets/MeshSelector";
import { UniformsPanel } from "./widgets/UniformsPanel";

export class UI {
    static init() {
        Text.init(navigator.language || navigator.userLanguage);
        Editor.init(document.getElementById('code-inject'));
        UI.split = split(['#uniforms-panel', '#result-panel', '#code-panel'], {
            sizes: [0, 67, 33],
            minSize: [0, 200, 200],
            snapOffset: 5,
        });
        UI.split.defaultMineSize = 300;

        UI.firstGlutter = document.querySelector('.gutter');
        UI.firstGlutter.classList.add('gluter-disable');
    }

    static createWidgets() {
        UI.widgets = new Array();

        UI.widgets.push(new SizeSelector(UITools.cleanQuery('#size-selector')));
        UI.widgets.push(new BufferSelector(UITools.cleanQuery('#buffer-selector')));
        UI.widgets.push(new TexturePanel(UITools.cleanQuery('#texture-panel')));
        UI.widgets.push(new Help(UITools.cleanQuery('#help-section')));
        UI.widgets.push(new FileOptions(UITools.cleanQuery('#file-options')));
        UI.widgets.push(new MeshSelector(UITools.cleanQuery('#mesh-selector')));
        UI.widgets.push(new UniformsPanel(UITools.cleanQuery('#uniforms-panel')));
    }

    static call(mName, ...params) {
        for(const widget of UI.widgets) {
            const func = widget[mName];
            if(typeof func === 'function') {
                func.bind(widget)(...params);
            }
        }
    }
}

UI.widgets = new Array();
