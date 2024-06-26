export default {
    fileOptions: 'Fichier',
    import: 'Importer',
    openFile: 'Ouvrir',
    saveAs: 'Enregistrer sous...',
    exportImage: 'Exporter l\'image...',
    confirmResetAll: 'Voulez-vous vraiment tout supprimer ?',
    resetAll: 'Tout supprimer',
    textureLabel: 'Textures',
    bufferSelectorLabel: 'Buffer :',
    size: 'Taille :',
    width: 'Largeur :',
    height: 'Hauteur :',
    apply: 'Appliquer',
    noError: 'Aucune erreur.',
    help: 'Aide',
    meshSelectorLabel: 'Modèle :',
    defaultMeshName: 'Défaut',
    sphereMeshName: 'Sphère',
    cubeMeshName: 'Cube',
    custom: 'Perso*',
    uniformsTitle: 'Uniformes :',
    number: 'Nombre',
    range: 'Glissière',
    color: 'Couleur',
    minFilter: 'Filtre min* :',
    magFilter: 'Filtre mag* :',
    wrapS: 'Enveloppe S :',
    wrapT: 'Enveloppe T :',
    copyToClipboard: 'Copier dans le presse-papier',
    setBufferSize: 'Définir la taille du buffer',
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

    struct Mouse {
        vec2 pos;
        vec2 vel;
        vec3 buttons;
    }

Variables et constantes :

    TextureInfos currentBuffer
    TextureInfos buffer[A..D]
    TextureInfos tex[A..F]

    Camera camera

    Mouse mouse

    float time

    float PI
    float HALF_PI


Fonctions additionnelles :

    vec4 fxaa(TextureInfos, vec2)
    vec4 ssaa(TextureInfos, vec2)

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
