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

export class UI {
    static init() {
        Text.init();
        Editor.init(document.getElementById('code-inject'));
        split(['#result-panel', '#code-panel'], {sizes: [67, 33]});
    }

    static createMenus() {
        new SizeSelector(UITools.cleanQuery('#size-selector'));
        new BufferSelector(UITools.cleanQuery('#buffer-selector'));
        new TexturePanel(UITools.cleanQuery('#texture-panel'));
        new Help(UITools.cleanQuery('#help-section'));
        new FileOptions(UITools.cleanQuery('#file-options'));
        new MeshSelector(UITools.cleanQuery('#mesh-selector'));
    }
}
