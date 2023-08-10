const FLOAT = 5126;
const VEC2 = 35664;
const VEC3 = 35665;
const VEC4 = 35666;

const INT = 5124;
const IVEC2 = 35667;
const IVEC3 = 35668;
const IVEC4 = 35669;

const BOOL = 35670;

export class UniformsUtils {
	static parseShaderUnif(unif) {
		const result = {
			size: unif.size,
			type: 'FLOAT'
		};

		if(unif.size != 1) { // pas d'array pour le moment
            return null;
        }

		switch(unif.type) {
			case FLOAT:
				result.length = 1;
				break;

			case VEC2:
				result.length = 2;
				break;

			case VEC3:
				result.length = 3;
				break;

			case VEC4:
				result.length = 4;
				break;

			case INT:
				result.length = 1;
				result.type = 'INT';
				break;

			case IVEC2:
				result.length = 2;
				result.type = 'INT';
				break;

			case IVEC3:
				result.length = 3;
				result.type = 'INT';
				break;

			case IVEC4:
				result.length = 4;
				result.type = 'INT';
				break;

			case BOOL:
				result.length = 1;
				result.type = 'BOOL';
				result.value = [false];
				break;
		
			default:
				return null;
		}

		if(unif.type != BOOL) {
			result.value = new Array(result.length).fill(0);
		}

		if(result.type === 'FLOAT' && result.length === 4) {
			result.value[3] = 1;
		}

		return result;
	}
}
