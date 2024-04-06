import { mat4 } from "gl-matrix";

/**
 *  A SimpleRotator can be used to implement rotation by mouse
 *  (or touch) WebGL.  In this style of rotation, the y-axis
 *  is always vertical, with the positive direction pointing
 *  upwards in the view.  Dragging the mouse left and right
 *  rotates the view about the y-axis.  Dragging it up and down
 *  rotates the view about the x-axis, with the angle of rotation
 *  about the x-axis limited to the range -85 to 85.
 *
 *  NOTE: No error checking of parameters is done!
 *
 * Functions defined for an object, rotator, of type SimpleRotator:
 *
 *    rotator.getViewMatrix() -- returns an array of 16 numbers representing
 *       the view matrix corresponding to the current rotation.  The
 *       matrix is in column-matrix order (ready for use with glMatrix or
 *       gl.uniformMatrix4fv).  The view matrix takes into account the
 *       view distance and the center of view.
 *    rotator.setXLimit( d ) -- sets the range of possible rotations.
 *       about the x-axis.  The parameter must be a non-negative number,
 *       and the value is clamped to the range 0 to 85.  The allowed range
 *       of rotation angles is from -d to d degrees.  If the value is zero
 *       only rotation about the y-axis is allowed.  Initial value is 85.
 *    rotator.getXLimit() -- returns the current limit.
 *    rotator.setRotationCenter( vector ) -- Sets the center of rotation.
 *       The parameter must be an array of (at least) three numbers.  The
 *       view is rotated about this point.  Usually, you want the rotation
 *       center to be the point that appears at the middle of the canvas,
 *       but that is not a requirement.  The initial value is effectively
 *       equal to [0,0,0].
 *    rotator.getRotationCenter() -- returns the current value.
 *    rotator.setAngles( rotateY, rotateX ) -- sets the angles of rotation
 *       about the y- and x- axes.  The values must be numbers and are
 *       given in degrees.  The limit on the range of x rotations is enforced.
 *       If the callback function is defined, it is called.
 *    rotator.getAngles() -- returns the current x and y rotations angles,
 *       as an array of two numbers.
 *    rotator.setViewDistance(dist) -- Sets the view distance to dist, which
 *       must be a number.
 *    rotator.getViewDistance() -- returns the current value.
 *
 * @param canvas must be a DOM element for a canvas.  A mouse
 *     listener and a touch listener are installed on the canvas.
 *     This is a required parameter.
 * @param callback if present, must be a function.  The function,
 *     if given, is called when the view changes.  Typically, it
 *     it would be a function that renders the image in the canvas,
 *     or possibly a function that renders the image only if no
 *     animation is running.
 * @param viewDistance if present, must be a number.  Gives the
 *     distance of the viewer from the center of rotation, which
 *     is ordinarily the origin.  If not present, the distance is
 *     0, which can be appropriate for an orthogonal projection.
 * @param rotY if present, must be a number.  Gives the initial rotation
 *     about the y-axis, in degrees. If not present, the default is zero.
 * @param rotX if present, must be a number.  Gives the initial rotation
 *     about the x-axis, in degrees. If not present, the default is zero.
 */
export { SimpleRotator };
declare class SimpleRotator {
    constructor(canvas: Element, callback: () => void, viewDistance: number, rotY?: number, rotX?: number)
    addCanvas(canvas: Element): void;
    getViewMatrix(): mat4;
}

