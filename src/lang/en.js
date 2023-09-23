export default {
    fileOptions: 'File',
    import: 'Import',
    openFile: 'Open',
    saveAs: 'Save as...',
    exportImage: 'Export image...',
    confirmResetAll: 'Are you sure you want to delete everything?',
    resetAll: 'Reset all',
    textureLabel: 'Textures',
    bufferSelectorLabel: 'Current buffer :',
    size: 'Size :',
    width: 'Width :',
    height: 'Height :',
    apply: 'Apply',
    noError: 'No error.',
    help: 'Help',
    meshSelectorLabel: 'Mesh :',
    defaultMeshName: 'Default',
    sphereMeshName: 'Sphere',
    cubeMeshName: 'Cube',
    custom: 'Custom',
    uniformsTitle: 'Uniforms :',
    number: 'Number',
    range: 'Range',
    color: 'Color',
    minFilter: 'Min filter :',
    magFilter: 'Mag filter :',
    wrapS: 'Wrap S :',
    wrapT: 'Wrap T :',
    helpText:
`Specific types :

    struct TextureInfos {
        sampler2D sampler;
        vec2 size;
        float ratio;
    }

    struct Camera {
        mat4 view;
        mat4 projection;
        vec3 pos;
    }

    struct Mouse {
        vec2 pos;
        vec2 vel;
        vec3 buttons;
    }

Variables and constants :

    TextureInfos currentBuffer
    TextureInfos buffer[A..D]
    TextureInfos tex[A..F]

    Camera camera

    Mouse mouse

    float time

    float PI
    float HALF_PI


Additional functions :

    vec4 fxaa(TextureInfos, vec2)

    vec3 rgb2hsv(vec3)
    vec3 hsv2rgb(vec3)

    float luma(vec[3,4])

    vec3 unpackNormalMap(vec[2,3,4])

    vec3 dither[2,4,8](vec3, [float], [vec2])
    vec3 quantify(vec3, float)
    vec3 quantify2(vec3)

    mat2 rotate(float)
    mat3 rotateX(float)
    mat3 rotateY(float)
    mat3 rotateZ(float)

    float snoise(vec[2,3,4])
    float voronoi(vec2, float, float)
    vec3 voronoiDist(vec2, float)
`
}
