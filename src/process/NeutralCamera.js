import { Camera } from "akila/utils";
import { mat4 } from "akila/math";

export class NeutralCamera extends Camera {
    constructor() {
        super(1, 1);

        this.projection = mat4.create();
    }

    setSize(width, height) {}

    update() {}
}
