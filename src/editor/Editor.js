import { Text } from '../lang/Text';
import * as CodeMirror from '../libs/code_mirror/codemirror';
import * as addActiveLine from '../libs/code_mirror/addons/activeLine';
import * as addCloseBrackets from '../libs/code_mirror/addons/closebrackets';
import * as addGLSL from '../libs/code_mirror/codemirror-glsl';
import { ShaderLayer } from '../process/ShaderLayer';
addActiveLine(CodeMirror);
addCloseBrackets(CodeMirror);
addGLSL(CodeMirror, ShaderLayer.customFuncs, ShaderLayer.customAtoms);

export class Editor {
    static init(element) {
        this.changeCallBack = () => {};

        const area = document.createElement('textarea');
        element.parentNode.appendChild(area);
        element.style = 'display: none;';

        this.editor = CodeMirror.fromTextArea(area, {
            mode: 'glsl',
            lineNumbers: true,
            matchBrackets: true,
            indentWithTabs: false,
            tabSize: 4,
            indentUnit: 4,
            theme: 'material',
            styleActiveLine: true,
            autoCloseBrackets: true,
            showCursorWhenSelecting: true,
            viewportMargin: Infinity
        });
    
        this.editor.on('change', () => {
            this.changeCallBack(this.editor.getValue());
        });

        const label = document.createElement('label');
        label.setAttribute('for', 'code-area');
        label.setAttribute('style', 'position: absolute; top: -100px;');
        label.textContent = 'woula';
        const t = document.querySelector('.CodeMirror textarea');
        if(t) {
            t.parentElement.appendChild(label);
            t.setAttribute('id', 'code-area');
        }

        this.errorZone = document.querySelector('#error-zone');

        this.displayNoError();
    }

    static onchange(cb) {
        this.changeCallBack = cb;
    }

    static getValue() {
        return this.editor.getValue();
    }

    static setValue(v) {
        return this.editor.setValue(v);
    }

    static displayError(e) {
        this.errorZone.textContent = e;
        this.errorZone.classList.add('error');
        this.errorZone.classList.remove('no-error');
    }

    static displayNoError() {
        this.errorZone.textContent = Text.get('noError');
        this.errorZone.classList.add('no-error');
        this.errorZone.classList.remove('error');
    }
}
