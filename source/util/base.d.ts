import { vec2, vec3, vec4 } from "gl-matrix";

export { vec_eq, vec_add, vec_sub, vec_norm, vec_scale, vec_dot, vec_cross, vec_lerp }

declare function vec_eq<T>(a: T, b: T): boolean;

declare function vec_sub<T>(a: T, b: T): T;
declare function vec_add<T>(a: T, b: T): T;
declare function vec_norm<T>(a: T): T;
declare function vec_scale<T>(a: T, x: number): T;
declare function vec_dot<T>(a: T, b: T): number;
declare function vec_cross(a: vec3, b: vec3): vec3;
declare function vec_lerp<T>(a: T, b: T, f: number): T;