export default {
    fileOptions: 'Fichier',
    import: 'Importer',
    export: 'Exporter',
    saveImage: 'Sauvegarder l\'image',
    textureLabel: 'Textures',
    bufferSelectorLabel: 'Buffer actuel :',
    size: 'Taille :',
    width: 'Largeur :',
    height: 'Hauteur :',
    apply: 'Appliquer',
    noError: 'Aucune erreur.',
    help: 'Aide',
    helpText:
`Types spécifiques :

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

Liste des variables/constantes :

    TextureInfos currentBuffer
    TextureInfos buffer[A..D]
    TextureInfos tex[A..F]

    Camera camera

    float time

    float PI
    float HALF_PI


Liste des fonctions additionnelles :

    vec4 fxaa(TextureInfos, vec2)

    vec3 rgb2hsv(vec3)
    vec3 hsv2rgb(vec3)

    mat2 rotate(float)
    mat3 rotateX(float)
    mat3 rotateY(float)
    mat3 rotateZ(float)

    float snoise(vec[2,3,4])
    float voronoi(vec2, float, float)
    vec3 voronoiDist(vec2, float)
`,
    meshSelectorLabel: 'Modèle :',
    defaultMeshName: 'Défaut',
    spheretMeshName: 'Sphère',
    cubeMeshName: 'Cube'
}
