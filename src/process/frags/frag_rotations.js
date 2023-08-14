export default [
    {
        name: 'rotate',
        frag: `
        mat2 rotate(float a) {
            float c = cos(a);
            float s = sin(a);
            return mat2(
                c, -s,
                s,  c
            );
        }`
    },
    {
        name: 'rotateX',
        frag: `
        mat3 rotateX(float a) {
            float c = cos(a);
            float s = sin(a);
            return mat3(
                1, 0,  0,
                0, c, -s,
                0, s,  c
            );
        }`
    },
    {
        name: 'rotateY',
        frag: `
        mat3 rotateY(float a) {
            float c = cos(a);
            float s = sin(a);
            return mat3(
                 c, 0, s,
                 0, 1, 0,
                -s, 0, c
            );
        }`
    },
    {
        name: 'rotateZ',
        frag: `
        mat3 rotateZ(float a) {
            float c = cos(a);
            float s = sin(a);
            return mat3(
                c, -s, 0,
                s,  c, 0,
                0,  0, 1
            );
        }`
    }
]
