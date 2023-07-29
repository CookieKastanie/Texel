export const frags = new Array();

import texture from './frag_texture';
frags.push(...texture);

import hsv from './frag_hsv';
frags.push(...hsv);

import simplex from './frag_simplexNoise';
frags.push(...simplex);

import voronoise from './frag_voronoise';
frags.push(...voronoise);

import rotations from './frag_rotations';
frags.push(...rotations);

import fxaa from './frag_fxaa';
frags.push(...fxaa);

import dither from './frag_dither';
frags.push(...dither);

