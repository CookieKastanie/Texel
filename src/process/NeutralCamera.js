import { Camera } from "akila/utils";
import { mat4 } from "akila/math";

export class NeutralCamera extends Camera {
    constructor() {
        super(1, 1);

        this.projection = mat4.create();
        this.position[2] = 1;
        mat4.translate(this.camera, this.camera, this.position);
    }

    setSize(width, height) {}

    update() {}
}
