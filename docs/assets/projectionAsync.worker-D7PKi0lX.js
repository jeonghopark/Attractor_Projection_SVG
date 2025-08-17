(function() {
  "use strict";
  /**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   */
  const REVISION = "179";
  const FrontSide = 0;
  const BackSide = 1;
  const DoubleSide = 2;
  const UVMapping = 300;
  const RepeatWrapping = 1e3;
  const ClampToEdgeWrapping = 1001;
  const MirroredRepeatWrapping = 1002;
  const LinearFilter = 1006;
  const LinearMipmapLinearFilter = 1008;
  const UnsignedByteType = 1009;
  const FloatType = 1015;
  const RGBAFormat = 1023;
  const NoColorSpace = "";
  const StaticDrawUsage = 35044;
  const WebGLCoordinateSystem = 2e3;
  const WebGPUCoordinateSystem = 2001;
  class EventDispatcher {
    /**
     * Adds the given event listener to the given event type.
     *
     * @param {string} type - The type of event to listen to.
     * @param {Function} listener - The function that gets called when the event is fired.
     */
    addEventListener(type, listener) {
      if (this._listeners === void 0) this._listeners = {};
      const listeners = this._listeners;
      if (listeners[type] === void 0) {
        listeners[type] = [];
      }
      if (listeners[type].indexOf(listener) === -1) {
        listeners[type].push(listener);
      }
    }
    /**
     * Returns `true` if the given event listener has been added to the given event type.
     *
     * @param {string} type - The type of event.
     * @param {Function} listener - The listener to check.
     * @return {boolean} Whether the given event listener has been added to the given event type.
     */
    hasEventListener(type, listener) {
      const listeners = this._listeners;
      if (listeners === void 0) return false;
      return listeners[type] !== void 0 && listeners[type].indexOf(listener) !== -1;
    }
    /**
     * Removes the given event listener from the given event type.
     *
     * @param {string} type - The type of event.
     * @param {Function} listener - The listener to remove.
     */
    removeEventListener(type, listener) {
      const listeners = this._listeners;
      if (listeners === void 0) return;
      const listenerArray = listeners[type];
      if (listenerArray !== void 0) {
        const index = listenerArray.indexOf(listener);
        if (index !== -1) {
          listenerArray.splice(index, 1);
        }
      }
    }
    /**
     * Dispatches an event object.
     *
     * @param {Object} event - The event that gets fired.
     */
    dispatchEvent(event) {
      const listeners = this._listeners;
      if (listeners === void 0) return;
      const listenerArray = listeners[event.type];
      if (listenerArray !== void 0) {
        event.target = this;
        const array = listenerArray.slice(0);
        for (let i = 0, l = array.length; i < l; i++) {
          array[i].call(this, event);
        }
        event.target = null;
      }
    }
  }
  const _lut = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"];
  const DEG2RAD = Math.PI / 180;
  function generateUUID() {
    const d0 = Math.random() * 4294967295 | 0;
    const d1 = Math.random() * 4294967295 | 0;
    const d2 = Math.random() * 4294967295 | 0;
    const d3 = Math.random() * 4294967295 | 0;
    const uuid = _lut[d0 & 255] + _lut[d0 >> 8 & 255] + _lut[d0 >> 16 & 255] + _lut[d0 >> 24 & 255] + "-" + _lut[d1 & 255] + _lut[d1 >> 8 & 255] + "-" + _lut[d1 >> 16 & 15 | 64] + _lut[d1 >> 24 & 255] + "-" + _lut[d2 & 63 | 128] + _lut[d2 >> 8 & 255] + "-" + _lut[d2 >> 16 & 255] + _lut[d2 >> 24 & 255] + _lut[d3 & 255] + _lut[d3 >> 8 & 255] + _lut[d3 >> 16 & 255] + _lut[d3 >> 24 & 255];
    return uuid.toLowerCase();
  }
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  function denormalize(value, array) {
    switch (array.constructor) {
      case Float32Array:
        return value;
      case Uint32Array:
        return value / 4294967295;
      case Uint16Array:
        return value / 65535;
      case Uint8Array:
        return value / 255;
      case Int32Array:
        return Math.max(value / 2147483647, -1);
      case Int16Array:
        return Math.max(value / 32767, -1);
      case Int8Array:
        return Math.max(value / 127, -1);
      default:
        throw new Error("Invalid component type.");
    }
  }
  function normalize(value, array) {
    switch (array.constructor) {
      case Float32Array:
        return value;
      case Uint32Array:
        return Math.round(value * 4294967295);
      case Uint16Array:
        return Math.round(value * 65535);
      case Uint8Array:
        return Math.round(value * 255);
      case Int32Array:
        return Math.round(value * 2147483647);
      case Int16Array:
        return Math.round(value * 32767);
      case Int8Array:
        return Math.round(value * 127);
      default:
        throw new Error("Invalid component type.");
    }
  }
  const MathUtils = {
    DEG2RAD
  };
  class Vector2 {
    /**
     * Constructs a new 2D vector.
     *
     * @param {number} [x=0] - The x value of this vector.
     * @param {number} [y=0] - The y value of this vector.
     */
    constructor(x = 0, y = 0) {
      Vector2.prototype.isVector2 = true;
      this.x = x;
      this.y = y;
    }
    /**
     * Alias for {@link Vector2#x}.
     *
     * @type {number}
     */
    get width() {
      return this.x;
    }
    set width(value) {
      this.x = value;
    }
    /**
     * Alias for {@link Vector2#y}.
     *
     * @type {number}
     */
    get height() {
      return this.y;
    }
    set height(value) {
      this.y = value;
    }
    /**
     * Sets the vector components.
     *
     * @param {number} x - The value of the x component.
     * @param {number} y - The value of the y component.
     * @return {Vector2} A reference to this vector.
     */
    set(x, y) {
      this.x = x;
      this.y = y;
      return this;
    }
    /**
     * Sets the vector components to the same value.
     *
     * @param {number} scalar - The value to set for all vector components.
     * @return {Vector2} A reference to this vector.
     */
    setScalar(scalar) {
      this.x = scalar;
      this.y = scalar;
      return this;
    }
    /**
     * Sets the vector's x component to the given value
     *
     * @param {number} x - The value to set.
     * @return {Vector2} A reference to this vector.
     */
    setX(x) {
      this.x = x;
      return this;
    }
    /**
     * Sets the vector's y component to the given value
     *
     * @param {number} y - The value to set.
     * @return {Vector2} A reference to this vector.
     */
    setY(y) {
      this.y = y;
      return this;
    }
    /**
     * Allows to set a vector component with an index.
     *
     * @param {number} index - The component index. `0` equals to x, `1` equals to y.
     * @param {number} value - The value to set.
     * @return {Vector2} A reference to this vector.
     */
    setComponent(index, value) {
      switch (index) {
        case 0:
          this.x = value;
          break;
        case 1:
          this.y = value;
          break;
        default:
          throw new Error("index is out of range: " + index);
      }
      return this;
    }
    /**
     * Returns the value of the vector component which matches the given index.
     *
     * @param {number} index - The component index. `0` equals to x, `1` equals to y.
     * @return {number} A vector component value.
     */
    getComponent(index) {
      switch (index) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        default:
          throw new Error("index is out of range: " + index);
      }
    }
    /**
     * Returns a new vector with copied values from this instance.
     *
     * @return {Vector2} A clone of this instance.
     */
    clone() {
      return new this.constructor(this.x, this.y);
    }
    /**
     * Copies the values of the given vector to this instance.
     *
     * @param {Vector2} v - The vector to copy.
     * @return {Vector2} A reference to this vector.
     */
    copy(v) {
      this.x = v.x;
      this.y = v.y;
      return this;
    }
    /**
     * Adds the given vector to this instance.
     *
     * @param {Vector2} v - The vector to add.
     * @return {Vector2} A reference to this vector.
     */
    add(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    }
    /**
     * Adds the given scalar value to all components of this instance.
     *
     * @param {number} s - The scalar to add.
     * @return {Vector2} A reference to this vector.
     */
    addScalar(s) {
      this.x += s;
      this.y += s;
      return this;
    }
    /**
     * Adds the given vectors and stores the result in this instance.
     *
     * @param {Vector2} a - The first vector.
     * @param {Vector2} b - The second vector.
     * @return {Vector2} A reference to this vector.
     */
    addVectors(a, b) {
      this.x = a.x + b.x;
      this.y = a.y + b.y;
      return this;
    }
    /**
     * Adds the given vector scaled by the given factor to this instance.
     *
     * @param {Vector2} v - The vector.
     * @param {number} s - The factor that scales `v`.
     * @return {Vector2} A reference to this vector.
     */
    addScaledVector(v, s) {
      this.x += v.x * s;
      this.y += v.y * s;
      return this;
    }
    /**
     * Subtracts the given vector from this instance.
     *
     * @param {Vector2} v - The vector to subtract.
     * @return {Vector2} A reference to this vector.
     */
    sub(v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    }
    /**
     * Subtracts the given scalar value from all components of this instance.
     *
     * @param {number} s - The scalar to subtract.
     * @return {Vector2} A reference to this vector.
     */
    subScalar(s) {
      this.x -= s;
      this.y -= s;
      return this;
    }
    /**
     * Subtracts the given vectors and stores the result in this instance.
     *
     * @param {Vector2} a - The first vector.
     * @param {Vector2} b - The second vector.
     * @return {Vector2} A reference to this vector.
     */
    subVectors(a, b) {
      this.x = a.x - b.x;
      this.y = a.y - b.y;
      return this;
    }
    /**
     * Multiplies the given vector with this instance.
     *
     * @param {Vector2} v - The vector to multiply.
     * @return {Vector2} A reference to this vector.
     */
    multiply(v) {
      this.x *= v.x;
      this.y *= v.y;
      return this;
    }
    /**
     * Multiplies the given scalar value with all components of this instance.
     *
     * @param {number} scalar - The scalar to multiply.
     * @return {Vector2} A reference to this vector.
     */
    multiplyScalar(scalar) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    }
    /**
     * Divides this instance by the given vector.
     *
     * @param {Vector2} v - The vector to divide.
     * @return {Vector2} A reference to this vector.
     */
    divide(v) {
      this.x /= v.x;
      this.y /= v.y;
      return this;
    }
    /**
     * Divides this vector by the given scalar.
     *
     * @param {number} scalar - The scalar to divide.
     * @return {Vector2} A reference to this vector.
     */
    divideScalar(scalar) {
      return this.multiplyScalar(1 / scalar);
    }
    /**
     * Multiplies this vector (with an implicit 1 as the 3rd component) by
     * the given 3x3 matrix.
     *
     * @param {Matrix3} m - The matrix to apply.
     * @return {Vector2} A reference to this vector.
     */
    applyMatrix3(m) {
      const x = this.x, y = this.y;
      const e = m.elements;
      this.x = e[0] * x + e[3] * y + e[6];
      this.y = e[1] * x + e[4] * y + e[7];
      return this;
    }
    /**
     * If this vector's x or y value is greater than the given vector's x or y
     * value, replace that value with the corresponding min value.
     *
     * @param {Vector2} v - The vector.
     * @return {Vector2} A reference to this vector.
     */
    min(v) {
      this.x = Math.min(this.x, v.x);
      this.y = Math.min(this.y, v.y);
      return this;
    }
    /**
     * If this vector's x or y value is less than the given vector's x or y
     * value, replace that value with the corresponding max value.
     *
     * @param {Vector2} v - The vector.
     * @return {Vector2} A reference to this vector.
     */
    max(v) {
      this.x = Math.max(this.x, v.x);
      this.y = Math.max(this.y, v.y);
      return this;
    }
    /**
     * If this vector's x or y value is greater than the max vector's x or y
     * value, it is replaced by the corresponding value.
     * If this vector's x or y value is less than the min vector's x or y value,
     * it is replaced by the corresponding value.
     *
     * @param {Vector2} min - The minimum x and y values.
     * @param {Vector2} max - The maximum x and y values in the desired range.
     * @return {Vector2} A reference to this vector.
     */
    clamp(min, max) {
      this.x = clamp(this.x, min.x, max.x);
      this.y = clamp(this.y, min.y, max.y);
      return this;
    }
    /**
     * If this vector's x or y values are greater than the max value, they are
     * replaced by the max value.
     * If this vector's x or y values are less than the min value, they are
     * replaced by the min value.
     *
     * @param {number} minVal - The minimum value the components will be clamped to.
     * @param {number} maxVal - The maximum value the components will be clamped to.
     * @return {Vector2} A reference to this vector.
     */
    clampScalar(minVal, maxVal) {
      this.x = clamp(this.x, minVal, maxVal);
      this.y = clamp(this.y, minVal, maxVal);
      return this;
    }
    /**
     * If this vector's length is greater than the max value, it is replaced by
     * the max value.
     * If this vector's length is less than the min value, it is replaced by the
     * min value.
     *
     * @param {number} min - The minimum value the vector length will be clamped to.
     * @param {number} max - The maximum value the vector length will be clamped to.
     * @return {Vector2} A reference to this vector.
     */
    clampLength(min, max) {
      const length = this.length();
      return this.divideScalar(length || 1).multiplyScalar(clamp(length, min, max));
    }
    /**
     * The components of this vector are rounded down to the nearest integer value.
     *
     * @return {Vector2} A reference to this vector.
     */
    floor() {
      this.x = Math.floor(this.x);
      this.y = Math.floor(this.y);
      return this;
    }
    /**
     * The components of this vector are rounded up to the nearest integer value.
     *
     * @return {Vector2} A reference to this vector.
     */
    ceil() {
      this.x = Math.ceil(this.x);
      this.y = Math.ceil(this.y);
      return this;
    }
    /**
     * The components of this vector are rounded to the nearest integer value
     *
     * @return {Vector2} A reference to this vector.
     */
    round() {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
      return this;
    }
    /**
     * The components of this vector are rounded towards zero (up if negative,
     * down if positive) to an integer value.
     *
     * @return {Vector2} A reference to this vector.
     */
    roundToZero() {
      this.x = Math.trunc(this.x);
      this.y = Math.trunc(this.y);
      return this;
    }
    /**
     * Inverts this vector - i.e. sets x = -x and y = -y.
     *
     * @return {Vector2} A reference to this vector.
     */
    negate() {
      this.x = -this.x;
      this.y = -this.y;
      return this;
    }
    /**
     * Calculates the dot product of the given vector with this instance.
     *
     * @param {Vector2} v - The vector to compute the dot product with.
     * @return {number} The result of the dot product.
     */
    dot(v) {
      return this.x * v.x + this.y * v.y;
    }
    /**
     * Calculates the cross product of the given vector with this instance.
     *
     * @param {Vector2} v - The vector to compute the cross product with.
     * @return {number} The result of the cross product.
     */
    cross(v) {
      return this.x * v.y - this.y * v.x;
    }
    /**
     * Computes the square of the Euclidean length (straight-line length) from
     * (0, 0) to (x, y). If you are comparing the lengths of vectors, you should
     * compare the length squared instead as it is slightly more efficient to calculate.
     *
     * @return {number} The square length of this vector.
     */
    lengthSq() {
      return this.x * this.x + this.y * this.y;
    }
    /**
     * Computes the  Euclidean length (straight-line length) from (0, 0) to (x, y).
     *
     * @return {number} The length of this vector.
     */
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /**
     * Computes the Manhattan length of this vector.
     *
     * @return {number} The length of this vector.
     */
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y);
    }
    /**
     * Converts this vector to a unit vector - that is, sets it equal to a vector
     * with the same direction as this one, but with a vector length of `1`.
     *
     * @return {Vector2} A reference to this vector.
     */
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    /**
     * Computes the angle in radians of this vector with respect to the positive x-axis.
     *
     * @return {number} The angle in radians.
     */
    angle() {
      const angle = Math.atan2(-this.y, -this.x) + Math.PI;
      return angle;
    }
    /**
     * Returns the angle between the given vector and this instance in radians.
     *
     * @param {Vector2} v - The vector to compute the angle with.
     * @return {number} The angle in radians.
     */
    angleTo(v) {
      const denominator = Math.sqrt(this.lengthSq() * v.lengthSq());
      if (denominator === 0) return Math.PI / 2;
      const theta = this.dot(v) / denominator;
      return Math.acos(clamp(theta, -1, 1));
    }
    /**
     * Computes the distance from the given vector to this instance.
     *
     * @param {Vector2} v - The vector to compute the distance to.
     * @return {number} The distance.
     */
    distanceTo(v) {
      return Math.sqrt(this.distanceToSquared(v));
    }
    /**
     * Computes the squared distance from the given vector to this instance.
     * If you are just comparing the distance with another distance, you should compare
     * the distance squared instead as it is slightly more efficient to calculate.
     *
     * @param {Vector2} v - The vector to compute the squared distance to.
     * @return {number} The squared distance.
     */
    distanceToSquared(v) {
      const dx = this.x - v.x, dy = this.y - v.y;
      return dx * dx + dy * dy;
    }
    /**
     * Computes the Manhattan distance from the given vector to this instance.
     *
     * @param {Vector2} v - The vector to compute the Manhattan distance to.
     * @return {number} The Manhattan distance.
     */
    manhattanDistanceTo(v) {
      return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
    }
    /**
     * Sets this vector to a vector with the same direction as this one, but
     * with the specified length.
     *
     * @param {number} length - The new length of this vector.
     * @return {Vector2} A reference to this vector.
     */
    setLength(length) {
      return this.normalize().multiplyScalar(length);
    }
    /**
     * Linearly interpolates between the given vector and this instance, where
     * alpha is the percent distance along the line - alpha = 0 will be this
     * vector, and alpha = 1 will be the given one.
     *
     * @param {Vector2} v - The vector to interpolate towards.
     * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
     * @return {Vector2} A reference to this vector.
     */
    lerp(v, alpha) {
      this.x += (v.x - this.x) * alpha;
      this.y += (v.y - this.y) * alpha;
      return this;
    }
    /**
     * Linearly interpolates between the given vectors, where alpha is the percent
     * distance along the line - alpha = 0 will be first vector, and alpha = 1 will
     * be the second one. The result is stored in this instance.
     *
     * @param {Vector2} v1 - The first vector.
     * @param {Vector2} v2 - The second vector.
     * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
     * @return {Vector2} A reference to this vector.
     */
    lerpVectors(v1, v2, alpha) {
      this.x = v1.x + (v2.x - v1.x) * alpha;
      this.y = v1.y + (v2.y - v1.y) * alpha;
      return this;
    }
    /**
     * Returns `true` if this vector is equal with the given one.
     *
     * @param {Vector2} v - The vector to test for equality.
     * @return {boolean} Whether this vector is equal with the given one.
     */
    equals(v) {
      return v.x === this.x && v.y === this.y;
    }
    /**
     * Sets this vector's x value to be `array[ offset ]` and y
     * value to be `array[ offset + 1 ]`.
     *
     * @param {Array<number>} array - An array holding the vector component values.
     * @param {number} [offset=0] - The offset into the array.
     * @return {Vector2} A reference to this vector.
     */
    fromArray(array, offset = 0) {
      this.x = array[offset];
      this.y = array[offset + 1];
      return this;
    }
    /**
     * Writes the components of this vector to the given array. If no array is provided,
     * the method returns a new instance.
     *
     * @param {Array<number>} [array=[]] - The target array holding the vector components.
     * @param {number} [offset=0] - Index of the first element in the array.
     * @return {Array<number>} The vector components.
     */
    toArray(array = [], offset = 0) {
      array[offset] = this.x;
      array[offset + 1] = this.y;
      return array;
    }
    /**
     * Sets the components of this vector from the given buffer attribute.
     *
     * @param {BufferAttribute} attribute - The buffer attribute holding vector data.
     * @param {number} index - The index into the attribute.
     * @return {Vector2} A reference to this vector.
     */
    fromBufferAttribute(attribute, index) {
      this.x = attribute.getX(index);
      this.y = attribute.getY(index);
      return this;
    }
    /**
     * Rotates this vector around the given center by the given angle.
     *
     * @param {Vector2} center - The point around which to rotate.
     * @param {number} angle - The angle to rotate, in radians.
     * @return {Vector2} A reference to this vector.
     */
    rotateAround(center, angle) {
      const c = Math.cos(angle), s = Math.sin(angle);
      const x = this.x - center.x;
      const y = this.y - center.y;
      this.x = x * c - y * s + center.x;
      this.y = x * s + y * c + center.y;
      return this;
    }
    /**
     * Sets each component of this vector to a pseudo-random value between `0` and
     * `1`, excluding `1`.
     *
     * @return {Vector2} A reference to this vector.
     */
    random() {
      this.x = Math.random();
      this.y = Math.random();
      return this;
    }
    *[Symbol.iterator]() {
      yield this.x;
      yield this.y;
    }
  }
  class Quaternion {
    /**
     * Constructs a new quaternion.
     *
     * @param {number} [x=0] - The x value of this quaternion.
     * @param {number} [y=0] - The y value of this quaternion.
     * @param {number} [z=0] - The z value of this quaternion.
     * @param {number} [w=1] - The w value of this quaternion.
     */
    constructor(x = 0, y = 0, z = 0, w = 1) {
      this.isQuaternion = true;
      this._x = x;
      this._y = y;
      this._z = z;
      this._w = w;
    }
    /**
     * Interpolates between two quaternions via SLERP. This implementation assumes the
     * quaternion data are managed  in flat arrays.
     *
     * @param {Array<number>} dst - The destination array.
     * @param {number} dstOffset - An offset into the destination array.
     * @param {Array<number>} src0 - The source array of the first quaternion.
     * @param {number} srcOffset0 - An offset into the first source array.
     * @param {Array<number>} src1 -  The source array of the second quaternion.
     * @param {number} srcOffset1 - An offset into the second source array.
     * @param {number} t - The interpolation factor in the range `[0,1]`.
     * @see {@link Quaternion#slerp}
     */
    static slerpFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {
      let x0 = src0[srcOffset0 + 0], y0 = src0[srcOffset0 + 1], z0 = src0[srcOffset0 + 2], w0 = src0[srcOffset0 + 3];
      const x1 = src1[srcOffset1 + 0], y1 = src1[srcOffset1 + 1], z1 = src1[srcOffset1 + 2], w1 = src1[srcOffset1 + 3];
      if (t === 0) {
        dst[dstOffset + 0] = x0;
        dst[dstOffset + 1] = y0;
        dst[dstOffset + 2] = z0;
        dst[dstOffset + 3] = w0;
        return;
      }
      if (t === 1) {
        dst[dstOffset + 0] = x1;
        dst[dstOffset + 1] = y1;
        dst[dstOffset + 2] = z1;
        dst[dstOffset + 3] = w1;
        return;
      }
      if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {
        let s = 1 - t;
        const cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1, dir = cos >= 0 ? 1 : -1, sqrSin = 1 - cos * cos;
        if (sqrSin > Number.EPSILON) {
          const sin = Math.sqrt(sqrSin), len = Math.atan2(sin, cos * dir);
          s = Math.sin(s * len) / sin;
          t = Math.sin(t * len) / sin;
        }
        const tDir = t * dir;
        x0 = x0 * s + x1 * tDir;
        y0 = y0 * s + y1 * tDir;
        z0 = z0 * s + z1 * tDir;
        w0 = w0 * s + w1 * tDir;
        if (s === 1 - t) {
          const f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);
          x0 *= f;
          y0 *= f;
          z0 *= f;
          w0 *= f;
        }
      }
      dst[dstOffset] = x0;
      dst[dstOffset + 1] = y0;
      dst[dstOffset + 2] = z0;
      dst[dstOffset + 3] = w0;
    }
    /**
     * Multiplies two quaternions. This implementation assumes the quaternion data are managed
     * in flat arrays.
     *
     * @param {Array<number>} dst - The destination array.
     * @param {number} dstOffset - An offset into the destination array.
     * @param {Array<number>} src0 - The source array of the first quaternion.
     * @param {number} srcOffset0 - An offset into the first source array.
     * @param {Array<number>} src1 -  The source array of the second quaternion.
     * @param {number} srcOffset1 - An offset into the second source array.
     * @return {Array<number>} The destination array.
     * @see {@link Quaternion#multiplyQuaternions}.
     */
    static multiplyQuaternionsFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1) {
      const x0 = src0[srcOffset0];
      const y0 = src0[srcOffset0 + 1];
      const z0 = src0[srcOffset0 + 2];
      const w0 = src0[srcOffset0 + 3];
      const x1 = src1[srcOffset1];
      const y1 = src1[srcOffset1 + 1];
      const z1 = src1[srcOffset1 + 2];
      const w1 = src1[srcOffset1 + 3];
      dst[dstOffset] = x0 * w1 + w0 * x1 + y0 * z1 - z0 * y1;
      dst[dstOffset + 1] = y0 * w1 + w0 * y1 + z0 * x1 - x0 * z1;
      dst[dstOffset + 2] = z0 * w1 + w0 * z1 + x0 * y1 - y0 * x1;
      dst[dstOffset + 3] = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1;
      return dst;
    }
    /**
     * The x value of this quaternion.
     *
     * @type {number}
     * @default 0
     */
    get x() {
      return this._x;
    }
    set x(value) {
      this._x = value;
      this._onChangeCallback();
    }
    /**
     * The y value of this quaternion.
     *
     * @type {number}
     * @default 0
     */
    get y() {
      return this._y;
    }
    set y(value) {
      this._y = value;
      this._onChangeCallback();
    }
    /**
     * The z value of this quaternion.
     *
     * @type {number}
     * @default 0
     */
    get z() {
      return this._z;
    }
    set z(value) {
      this._z = value;
      this._onChangeCallback();
    }
    /**
     * The w value of this quaternion.
     *
     * @type {number}
     * @default 1
     */
    get w() {
      return this._w;
    }
    set w(value) {
      this._w = value;
      this._onChangeCallback();
    }
    /**
     * Sets the quaternion components.
     *
     * @param {number} x - The x value of this quaternion.
     * @param {number} y - The y value of this quaternion.
     * @param {number} z - The z value of this quaternion.
     * @param {number} w - The w value of this quaternion.
     * @return {Quaternion} A reference to this quaternion.
     */
    set(x, y, z, w) {
      this._x = x;
      this._y = y;
      this._z = z;
      this._w = w;
      this._onChangeCallback();
      return this;
    }
    /**
     * Returns a new quaternion with copied values from this instance.
     *
     * @return {Quaternion} A clone of this instance.
     */
    clone() {
      return new this.constructor(this._x, this._y, this._z, this._w);
    }
    /**
     * Copies the values of the given quaternion to this instance.
     *
     * @param {Quaternion} quaternion - The quaternion to copy.
     * @return {Quaternion} A reference to this quaternion.
     */
    copy(quaternion) {
      this._x = quaternion.x;
      this._y = quaternion.y;
      this._z = quaternion.z;
      this._w = quaternion.w;
      this._onChangeCallback();
      return this;
    }
    /**
     * Sets this quaternion from the rotation specified by the given
     * Euler angles.
     *
     * @param {Euler} euler - The Euler angles.
     * @param {boolean} [update=true] - Whether the internal `onChange` callback should be executed or not.
     * @return {Quaternion} A reference to this quaternion.
     */
    setFromEuler(euler, update = true) {
      const x = euler._x, y = euler._y, z = euler._z, order = euler._order;
      const cos = Math.cos;
      const sin = Math.sin;
      const c1 = cos(x / 2);
      const c2 = cos(y / 2);
      const c3 = cos(z / 2);
      const s1 = sin(x / 2);
      const s2 = sin(y / 2);
      const s3 = sin(z / 2);
      switch (order) {
        case "XYZ":
          this._x = s1 * c2 * c3 + c1 * s2 * s3;
          this._y = c1 * s2 * c3 - s1 * c2 * s3;
          this._z = c1 * c2 * s3 + s1 * s2 * c3;
          this._w = c1 * c2 * c3 - s1 * s2 * s3;
          break;
        case "YXZ":
          this._x = s1 * c2 * c3 + c1 * s2 * s3;
          this._y = c1 * s2 * c3 - s1 * c2 * s3;
          this._z = c1 * c2 * s3 - s1 * s2 * c3;
          this._w = c1 * c2 * c3 + s1 * s2 * s3;
          break;
        case "ZXY":
          this._x = s1 * c2 * c3 - c1 * s2 * s3;
          this._y = c1 * s2 * c3 + s1 * c2 * s3;
          this._z = c1 * c2 * s3 + s1 * s2 * c3;
          this._w = c1 * c2 * c3 - s1 * s2 * s3;
          break;
        case "ZYX":
          this._x = s1 * c2 * c3 - c1 * s2 * s3;
          this._y = c1 * s2 * c3 + s1 * c2 * s3;
          this._z = c1 * c2 * s3 - s1 * s2 * c3;
          this._w = c1 * c2 * c3 + s1 * s2 * s3;
          break;
        case "YZX":
          this._x = s1 * c2 * c3 + c1 * s2 * s3;
          this._y = c1 * s2 * c3 + s1 * c2 * s3;
          this._z = c1 * c2 * s3 - s1 * s2 * c3;
          this._w = c1 * c2 * c3 - s1 * s2 * s3;
          break;
        case "XZY":
          this._x = s1 * c2 * c3 - c1 * s2 * s3;
          this._y = c1 * s2 * c3 - s1 * c2 * s3;
          this._z = c1 * c2 * s3 + s1 * s2 * c3;
          this._w = c1 * c2 * c3 + s1 * s2 * s3;
          break;
        default:
          console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + order);
      }
      if (update === true) this._onChangeCallback();
      return this;
    }
    /**
     * Sets this quaternion from the given axis and angle.
     *
     * @param {Vector3} axis - The normalized axis.
     * @param {number} angle - The angle in radians.
     * @return {Quaternion} A reference to this quaternion.
     */
    setFromAxisAngle(axis, angle) {
      const halfAngle = angle / 2, s = Math.sin(halfAngle);
      this._x = axis.x * s;
      this._y = axis.y * s;
      this._z = axis.z * s;
      this._w = Math.cos(halfAngle);
      this._onChangeCallback();
      return this;
    }
    /**
     * Sets this quaternion from the given rotation matrix.
     *
     * @param {Matrix4} m - A 4x4 matrix of which the upper 3x3 of matrix is a pure rotation matrix (i.e. unscaled).
     * @return {Quaternion} A reference to this quaternion.
     */
    setFromRotationMatrix(m) {
      const te = m.elements, m11 = te[0], m12 = te[4], m13 = te[8], m21 = te[1], m22 = te[5], m23 = te[9], m31 = te[2], m32 = te[6], m33 = te[10], trace = m11 + m22 + m33;
      if (trace > 0) {
        const s = 0.5 / Math.sqrt(trace + 1);
        this._w = 0.25 / s;
        this._x = (m32 - m23) * s;
        this._y = (m13 - m31) * s;
        this._z = (m21 - m12) * s;
      } else if (m11 > m22 && m11 > m33) {
        const s = 2 * Math.sqrt(1 + m11 - m22 - m33);
        this._w = (m32 - m23) / s;
        this._x = 0.25 * s;
        this._y = (m12 + m21) / s;
        this._z = (m13 + m31) / s;
      } else if (m22 > m33) {
        const s = 2 * Math.sqrt(1 + m22 - m11 - m33);
        this._w = (m13 - m31) / s;
        this._x = (m12 + m21) / s;
        this._y = 0.25 * s;
        this._z = (m23 + m32) / s;
      } else {
        const s = 2 * Math.sqrt(1 + m33 - m11 - m22);
        this._w = (m21 - m12) / s;
        this._x = (m13 + m31) / s;
        this._y = (m23 + m32) / s;
        this._z = 0.25 * s;
      }
      this._onChangeCallback();
      return this;
    }
    /**
     * Sets this quaternion to the rotation required to rotate the direction vector
     * `vFrom` to the direction vector `vTo`.
     *
     * @param {Vector3} vFrom - The first (normalized) direction vector.
     * @param {Vector3} vTo - The second (normalized) direction vector.
     * @return {Quaternion} A reference to this quaternion.
     */
    setFromUnitVectors(vFrom, vTo) {
      let r = vFrom.dot(vTo) + 1;
      if (r < 1e-8) {
        r = 0;
        if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
          this._x = -vFrom.y;
          this._y = vFrom.x;
          this._z = 0;
          this._w = r;
        } else {
          this._x = 0;
          this._y = -vFrom.z;
          this._z = vFrom.y;
          this._w = r;
        }
      } else {
        this._x = vFrom.y * vTo.z - vFrom.z * vTo.y;
        this._y = vFrom.z * vTo.x - vFrom.x * vTo.z;
        this._z = vFrom.x * vTo.y - vFrom.y * vTo.x;
        this._w = r;
      }
      return this.normalize();
    }
    /**
     * Returns the angle between this quaternion and the given one in radians.
     *
     * @param {Quaternion} q - The quaternion to compute the angle with.
     * @return {number} The angle in radians.
     */
    angleTo(q) {
      return 2 * Math.acos(Math.abs(clamp(this.dot(q), -1, 1)));
    }
    /**
     * Rotates this quaternion by a given angular step to the given quaternion.
     * The method ensures that the final quaternion will not overshoot `q`.
     *
     * @param {Quaternion} q - The target quaternion.
     * @param {number} step - The angular step in radians.
     * @return {Quaternion} A reference to this quaternion.
     */
    rotateTowards(q, step) {
      const angle = this.angleTo(q);
      if (angle === 0) return this;
      const t = Math.min(1, step / angle);
      this.slerp(q, t);
      return this;
    }
    /**
     * Sets this quaternion to the identity quaternion; that is, to the
     * quaternion that represents "no rotation".
     *
     * @return {Quaternion} A reference to this quaternion.
     */
    identity() {
      return this.set(0, 0, 0, 1);
    }
    /**
     * Inverts this quaternion via {@link Quaternion#conjugate}. The
     * quaternion is assumed to have unit length.
     *
     * @return {Quaternion} A reference to this quaternion.
     */
    invert() {
      return this.conjugate();
    }
    /**
     * Returns the rotational conjugate of this quaternion. The conjugate of a
     * quaternion represents the same rotation in the opposite direction about
     * the rotational axis.
     *
     * @return {Quaternion} A reference to this quaternion.
     */
    conjugate() {
      this._x *= -1;
      this._y *= -1;
      this._z *= -1;
      this._onChangeCallback();
      return this;
    }
    /**
     * Calculates the dot product of this quaternion and the given one.
     *
     * @param {Quaternion} v - The quaternion to compute the dot product with.
     * @return {number} The result of the dot product.
     */
    dot(v) {
      return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
    }
    /**
     * Computes the squared Euclidean length (straight-line length) of this quaternion,
     * considered as a 4 dimensional vector. This can be useful if you are comparing the
     * lengths of two quaternions, as this is a slightly more efficient calculation than
     * {@link Quaternion#length}.
     *
     * @return {number} The squared Euclidean length.
     */
    lengthSq() {
      return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
    }
    /**
     * Computes the Euclidean length (straight-line length) of this quaternion,
     * considered as a 4 dimensional vector.
     *
     * @return {number} The Euclidean length.
     */
    length() {
      return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
    }
    /**
     * Normalizes this quaternion - that is, calculated the quaternion that performs
     * the same rotation as this one, but has a length equal to `1`.
     *
     * @return {Quaternion} A reference to this quaternion.
     */
    normalize() {
      let l = this.length();
      if (l === 0) {
        this._x = 0;
        this._y = 0;
        this._z = 0;
        this._w = 1;
      } else {
        l = 1 / l;
        this._x = this._x * l;
        this._y = this._y * l;
        this._z = this._z * l;
        this._w = this._w * l;
      }
      this._onChangeCallback();
      return this;
    }
    /**
     * Multiplies this quaternion by the given one.
     *
     * @param {Quaternion} q - The quaternion.
     * @return {Quaternion} A reference to this quaternion.
     */
    multiply(q) {
      return this.multiplyQuaternions(this, q);
    }
    /**
     * Pre-multiplies this quaternion by the given one.
     *
     * @param {Quaternion} q - The quaternion.
     * @return {Quaternion} A reference to this quaternion.
     */
    premultiply(q) {
      return this.multiplyQuaternions(q, this);
    }
    /**
     * Multiplies the given quaternions and stores the result in this instance.
     *
     * @param {Quaternion} a - The first quaternion.
     * @param {Quaternion} b - The second quaternion.
     * @return {Quaternion} A reference to this quaternion.
     */
    multiplyQuaternions(a, b) {
      const qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
      const qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;
      this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
      this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
      this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
      this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
      this._onChangeCallback();
      return this;
    }
    /**
     * Performs a spherical linear interpolation between quaternions.
     *
     * @param {Quaternion} qb - The target quaternion.
     * @param {number} t - The interpolation factor in the closed interval `[0, 1]`.
     * @return {Quaternion} A reference to this quaternion.
     */
    slerp(qb, t) {
      if (t === 0) return this;
      if (t === 1) return this.copy(qb);
      const x = this._x, y = this._y, z = this._z, w = this._w;
      let cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;
      if (cosHalfTheta < 0) {
        this._w = -qb._w;
        this._x = -qb._x;
        this._y = -qb._y;
        this._z = -qb._z;
        cosHalfTheta = -cosHalfTheta;
      } else {
        this.copy(qb);
      }
      if (cosHalfTheta >= 1) {
        this._w = w;
        this._x = x;
        this._y = y;
        this._z = z;
        return this;
      }
      const sqrSinHalfTheta = 1 - cosHalfTheta * cosHalfTheta;
      if (sqrSinHalfTheta <= Number.EPSILON) {
        const s = 1 - t;
        this._w = s * w + t * this._w;
        this._x = s * x + t * this._x;
        this._y = s * y + t * this._y;
        this._z = s * z + t * this._z;
        this.normalize();
        return this;
      }
      const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
      const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
      const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta, ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
      this._w = w * ratioA + this._w * ratioB;
      this._x = x * ratioA + this._x * ratioB;
      this._y = y * ratioA + this._y * ratioB;
      this._z = z * ratioA + this._z * ratioB;
      this._onChangeCallback();
      return this;
    }
    /**
     * Performs a spherical linear interpolation between the given quaternions
     * and stores the result in this quaternion.
     *
     * @param {Quaternion} qa - The source quaternion.
     * @param {Quaternion} qb - The target quaternion.
     * @param {number} t - The interpolation factor in the closed interval `[0, 1]`.
     * @return {Quaternion} A reference to this quaternion.
     */
    slerpQuaternions(qa, qb, t) {
      return this.copy(qa).slerp(qb, t);
    }
    /**
     * Sets this quaternion to a uniformly random, normalized quaternion.
     *
     * @return {Quaternion} A reference to this quaternion.
     */
    random() {
      const theta1 = 2 * Math.PI * Math.random();
      const theta2 = 2 * Math.PI * Math.random();
      const x0 = Math.random();
      const r1 = Math.sqrt(1 - x0);
      const r2 = Math.sqrt(x0);
      return this.set(
        r1 * Math.sin(theta1),
        r1 * Math.cos(theta1),
        r2 * Math.sin(theta2),
        r2 * Math.cos(theta2)
      );
    }
    /**
     * Returns `true` if this quaternion is equal with the given one.
     *
     * @param {Quaternion} quaternion - The quaternion to test for equality.
     * @return {boolean} Whether this quaternion is equal with the given one.
     */
    equals(quaternion) {
      return quaternion._x === this._x && quaternion._y === this._y && quaternion._z === this._z && quaternion._w === this._w;
    }
    /**
     * Sets this quaternion's components from the given array.
     *
     * @param {Array<number>} array - An array holding the quaternion component values.
     * @param {number} [offset=0] - The offset into the array.
     * @return {Quaternion} A reference to this quaternion.
     */
    fromArray(array, offset = 0) {
      this._x = array[offset];
      this._y = array[offset + 1];
      this._z = array[offset + 2];
      this._w = array[offset + 3];
      this._onChangeCallback();
      return this;
    }
    /**
     * Writes the components of this quaternion to the given array. If no array is provided,
     * the method returns a new instance.
     *
     * @param {Array<number>} [array=[]] - The target array holding the quaternion components.
     * @param {number} [offset=0] - Index of the first element in the array.
     * @return {Array<number>} The quaternion components.
     */
    toArray(array = [], offset = 0) {
      array[offset] = this._x;
      array[offset + 1] = this._y;
      array[offset + 2] = this._z;
      array[offset + 3] = this._w;
      return array;
    }
    /**
     * Sets the components of this quaternion from the given buffer attribute.
     *
     * @param {BufferAttribute} attribute - The buffer attribute holding quaternion data.
     * @param {number} index - The index into the attribute.
     * @return {Quaternion} A reference to this quaternion.
     */
    fromBufferAttribute(attribute, index) {
      this._x = attribute.getX(index);
      this._y = attribute.getY(index);
      this._z = attribute.getZ(index);
      this._w = attribute.getW(index);
      this._onChangeCallback();
      return this;
    }
    /**
     * This methods defines the serialization result of this class. Returns the
     * numerical elements of this quaternion in an array of format `[x, y, z, w]`.
     *
     * @return {Array<number>} The serialized quaternion.
     */
    toJSON() {
      return this.toArray();
    }
    _onChange(callback) {
      this._onChangeCallback = callback;
      return this;
    }
    _onChangeCallback() {
    }
    *[Symbol.iterator]() {
      yield this._x;
      yield this._y;
      yield this._z;
      yield this._w;
    }
  }
  class Vector3 {
    /**
     * Constructs a new 3D vector.
     *
     * @param {number} [x=0] - The x value of this vector.
     * @param {number} [y=0] - The y value of this vector.
     * @param {number} [z=0] - The z value of this vector.
     */
    constructor(x = 0, y = 0, z = 0) {
      Vector3.prototype.isVector3 = true;
      this.x = x;
      this.y = y;
      this.z = z;
    }
    /**
     * Sets the vector components.
     *
     * @param {number} x - The value of the x component.
     * @param {number} y - The value of the y component.
     * @param {number} z - The value of the z component.
     * @return {Vector3} A reference to this vector.
     */
    set(x, y, z) {
      if (z === void 0) z = this.z;
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    }
    /**
     * Sets the vector components to the same value.
     *
     * @param {number} scalar - The value to set for all vector components.
     * @return {Vector3} A reference to this vector.
     */
    setScalar(scalar) {
      this.x = scalar;
      this.y = scalar;
      this.z = scalar;
      return this;
    }
    /**
     * Sets the vector's x component to the given value
     *
     * @param {number} x - The value to set.
     * @return {Vector3} A reference to this vector.
     */
    setX(x) {
      this.x = x;
      return this;
    }
    /**
     * Sets the vector's y component to the given value
     *
     * @param {number} y - The value to set.
     * @return {Vector3} A reference to this vector.
     */
    setY(y) {
      this.y = y;
      return this;
    }
    /**
     * Sets the vector's z component to the given value
     *
     * @param {number} z - The value to set.
     * @return {Vector3} A reference to this vector.
     */
    setZ(z) {
      this.z = z;
      return this;
    }
    /**
     * Allows to set a vector component with an index.
     *
     * @param {number} index - The component index. `0` equals to x, `1` equals to y, `2` equals to z.
     * @param {number} value - The value to set.
     * @return {Vector3} A reference to this vector.
     */
    setComponent(index, value) {
      switch (index) {
        case 0:
          this.x = value;
          break;
        case 1:
          this.y = value;
          break;
        case 2:
          this.z = value;
          break;
        default:
          throw new Error("index is out of range: " + index);
      }
      return this;
    }
    /**
     * Returns the value of the vector component which matches the given index.
     *
     * @param {number} index - The component index. `0` equals to x, `1` equals to y, `2` equals to z.
     * @return {number} A vector component value.
     */
    getComponent(index) {
      switch (index) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        default:
          throw new Error("index is out of range: " + index);
      }
    }
    /**
     * Returns a new vector with copied values from this instance.
     *
     * @return {Vector3} A clone of this instance.
     */
    clone() {
      return new this.constructor(this.x, this.y, this.z);
    }
    /**
     * Copies the values of the given vector to this instance.
     *
     * @param {Vector3} v - The vector to copy.
     * @return {Vector3} A reference to this vector.
     */
    copy(v) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      return this;
    }
    /**
     * Adds the given vector to this instance.
     *
     * @param {Vector3} v - The vector to add.
     * @return {Vector3} A reference to this vector.
     */
    add(v) {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
      return this;
    }
    /**
     * Adds the given scalar value to all components of this instance.
     *
     * @param {number} s - The scalar to add.
     * @return {Vector3} A reference to this vector.
     */
    addScalar(s) {
      this.x += s;
      this.y += s;
      this.z += s;
      return this;
    }
    /**
     * Adds the given vectors and stores the result in this instance.
     *
     * @param {Vector3} a - The first vector.
     * @param {Vector3} b - The second vector.
     * @return {Vector3} A reference to this vector.
     */
    addVectors(a, b) {
      this.x = a.x + b.x;
      this.y = a.y + b.y;
      this.z = a.z + b.z;
      return this;
    }
    /**
     * Adds the given vector scaled by the given factor to this instance.
     *
     * @param {Vector3|Vector4} v - The vector.
     * @param {number} s - The factor that scales `v`.
     * @return {Vector3} A reference to this vector.
     */
    addScaledVector(v, s) {
      this.x += v.x * s;
      this.y += v.y * s;
      this.z += v.z * s;
      return this;
    }
    /**
     * Subtracts the given vector from this instance.
     *
     * @param {Vector3} v - The vector to subtract.
     * @return {Vector3} A reference to this vector.
     */
    sub(v) {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
      return this;
    }
    /**
     * Subtracts the given scalar value from all components of this instance.
     *
     * @param {number} s - The scalar to subtract.
     * @return {Vector3} A reference to this vector.
     */
    subScalar(s) {
      this.x -= s;
      this.y -= s;
      this.z -= s;
      return this;
    }
    /**
     * Subtracts the given vectors and stores the result in this instance.
     *
     * @param {Vector3} a - The first vector.
     * @param {Vector3} b - The second vector.
     * @return {Vector3} A reference to this vector.
     */
    subVectors(a, b) {
      this.x = a.x - b.x;
      this.y = a.y - b.y;
      this.z = a.z - b.z;
      return this;
    }
    /**
     * Multiplies the given vector with this instance.
     *
     * @param {Vector3} v - The vector to multiply.
     * @return {Vector3} A reference to this vector.
     */
    multiply(v) {
      this.x *= v.x;
      this.y *= v.y;
      this.z *= v.z;
      return this;
    }
    /**
     * Multiplies the given scalar value with all components of this instance.
     *
     * @param {number} scalar - The scalar to multiply.
     * @return {Vector3} A reference to this vector.
     */
    multiplyScalar(scalar) {
      this.x *= scalar;
      this.y *= scalar;
      this.z *= scalar;
      return this;
    }
    /**
     * Multiplies the given vectors and stores the result in this instance.
     *
     * @param {Vector3} a - The first vector.
     * @param {Vector3} b - The second vector.
     * @return {Vector3} A reference to this vector.
     */
    multiplyVectors(a, b) {
      this.x = a.x * b.x;
      this.y = a.y * b.y;
      this.z = a.z * b.z;
      return this;
    }
    /**
     * Applies the given Euler rotation to this vector.
     *
     * @param {Euler} euler - The Euler angles.
     * @return {Vector3} A reference to this vector.
     */
    applyEuler(euler) {
      return this.applyQuaternion(_quaternion$4.setFromEuler(euler));
    }
    /**
     * Applies a rotation specified by an axis and an angle to this vector.
     *
     * @param {Vector3} axis - A normalized vector representing the rotation axis.
     * @param {number} angle - The angle in radians.
     * @return {Vector3} A reference to this vector.
     */
    applyAxisAngle(axis, angle) {
      return this.applyQuaternion(_quaternion$4.setFromAxisAngle(axis, angle));
    }
    /**
     * Multiplies this vector with the given 3x3 matrix.
     *
     * @param {Matrix3} m - The 3x3 matrix.
     * @return {Vector3} A reference to this vector.
     */
    applyMatrix3(m) {
      const x = this.x, y = this.y, z = this.z;
      const e = m.elements;
      this.x = e[0] * x + e[3] * y + e[6] * z;
      this.y = e[1] * x + e[4] * y + e[7] * z;
      this.z = e[2] * x + e[5] * y + e[8] * z;
      return this;
    }
    /**
     * Multiplies this vector by the given normal matrix and normalizes
     * the result.
     *
     * @param {Matrix3} m - The normal matrix.
     * @return {Vector3} A reference to this vector.
     */
    applyNormalMatrix(m) {
      return this.applyMatrix3(m).normalize();
    }
    /**
     * Multiplies this vector (with an implicit 1 in the 4th dimension) by m, and
     * divides by perspective.
     *
     * @param {Matrix4} m - The matrix to apply.
     * @return {Vector3} A reference to this vector.
     */
    applyMatrix4(m) {
      const x = this.x, y = this.y, z = this.z;
      const e = m.elements;
      const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
      this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
      this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
      this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
      return this;
    }
    /**
     * Applies the given Quaternion to this vector.
     *
     * @param {Quaternion} q - The Quaternion.
     * @return {Vector3} A reference to this vector.
     */
    applyQuaternion(q) {
      const vx = this.x, vy = this.y, vz = this.z;
      const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
      const tx = 2 * (qy * vz - qz * vy);
      const ty = 2 * (qz * vx - qx * vz);
      const tz = 2 * (qx * vy - qy * vx);
      this.x = vx + qw * tx + qy * tz - qz * ty;
      this.y = vy + qw * ty + qz * tx - qx * tz;
      this.z = vz + qw * tz + qx * ty - qy * tx;
      return this;
    }
    /**
     * Projects this vector from world space into the camera's normalized
     * device coordinate (NDC) space.
     *
     * @param {Camera} camera - The camera.
     * @return {Vector3} A reference to this vector.
     */
    project(camera) {
      return this.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);
    }
    /**
     * Unprojects this vector from the camera's normalized device coordinate (NDC)
     * space into world space.
     *
     * @param {Camera} camera - The camera.
     * @return {Vector3} A reference to this vector.
     */
    unproject(camera) {
      return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.matrixWorld);
    }
    /**
     * Transforms the direction of this vector by a matrix (the upper left 3 x 3
     * subset of the given 4x4 matrix and then normalizes the result.
     *
     * @param {Matrix4} m - The matrix.
     * @return {Vector3} A reference to this vector.
     */
    transformDirection(m) {
      const x = this.x, y = this.y, z = this.z;
      const e = m.elements;
      this.x = e[0] * x + e[4] * y + e[8] * z;
      this.y = e[1] * x + e[5] * y + e[9] * z;
      this.z = e[2] * x + e[6] * y + e[10] * z;
      return this.normalize();
    }
    /**
     * Divides this instance by the given vector.
     *
     * @param {Vector3} v - The vector to divide.
     * @return {Vector3} A reference to this vector.
     */
    divide(v) {
      this.x /= v.x;
      this.y /= v.y;
      this.z /= v.z;
      return this;
    }
    /**
     * Divides this vector by the given scalar.
     *
     * @param {number} scalar - The scalar to divide.
     * @return {Vector3} A reference to this vector.
     */
    divideScalar(scalar) {
      return this.multiplyScalar(1 / scalar);
    }
    /**
     * If this vector's x, y or z value is greater than the given vector's x, y or z
     * value, replace that value with the corresponding min value.
     *
     * @param {Vector3} v - The vector.
     * @return {Vector3} A reference to this vector.
     */
    min(v) {
      this.x = Math.min(this.x, v.x);
      this.y = Math.min(this.y, v.y);
      this.z = Math.min(this.z, v.z);
      return this;
    }
    /**
     * If this vector's x, y or z value is less than the given vector's x, y or z
     * value, replace that value with the corresponding max value.
     *
     * @param {Vector3} v - The vector.
     * @return {Vector3} A reference to this vector.
     */
    max(v) {
      this.x = Math.max(this.x, v.x);
      this.y = Math.max(this.y, v.y);
      this.z = Math.max(this.z, v.z);
      return this;
    }
    /**
     * If this vector's x, y or z value is greater than the max vector's x, y or z
     * value, it is replaced by the corresponding value.
     * If this vector's x, y or z value is less than the min vector's x, y or z value,
     * it is replaced by the corresponding value.
     *
     * @param {Vector3} min - The minimum x, y and z values.
     * @param {Vector3} max - The maximum x, y and z values in the desired range.
     * @return {Vector3} A reference to this vector.
     */
    clamp(min, max) {
      this.x = clamp(this.x, min.x, max.x);
      this.y = clamp(this.y, min.y, max.y);
      this.z = clamp(this.z, min.z, max.z);
      return this;
    }
    /**
     * If this vector's x, y or z values are greater than the max value, they are
     * replaced by the max value.
     * If this vector's x, y or z values are less than the min value, they are
     * replaced by the min value.
     *
     * @param {number} minVal - The minimum value the components will be clamped to.
     * @param {number} maxVal - The maximum value the components will be clamped to.
     * @return {Vector3} A reference to this vector.
     */
    clampScalar(minVal, maxVal) {
      this.x = clamp(this.x, minVal, maxVal);
      this.y = clamp(this.y, minVal, maxVal);
      this.z = clamp(this.z, minVal, maxVal);
      return this;
    }
    /**
     * If this vector's length is greater than the max value, it is replaced by
     * the max value.
     * If this vector's length is less than the min value, it is replaced by the
     * min value.
     *
     * @param {number} min - The minimum value the vector length will be clamped to.
     * @param {number} max - The maximum value the vector length will be clamped to.
     * @return {Vector3} A reference to this vector.
     */
    clampLength(min, max) {
      const length = this.length();
      return this.divideScalar(length || 1).multiplyScalar(clamp(length, min, max));
    }
    /**
     * The components of this vector are rounded down to the nearest integer value.
     *
     * @return {Vector3} A reference to this vector.
     */
    floor() {
      this.x = Math.floor(this.x);
      this.y = Math.floor(this.y);
      this.z = Math.floor(this.z);
      return this;
    }
    /**
     * The components of this vector are rounded up to the nearest integer value.
     *
     * @return {Vector3} A reference to this vector.
     */
    ceil() {
      this.x = Math.ceil(this.x);
      this.y = Math.ceil(this.y);
      this.z = Math.ceil(this.z);
      return this;
    }
    /**
     * The components of this vector are rounded to the nearest integer value
     *
     * @return {Vector3} A reference to this vector.
     */
    round() {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
      this.z = Math.round(this.z);
      return this;
    }
    /**
     * The components of this vector are rounded towards zero (up if negative,
     * down if positive) to an integer value.
     *
     * @return {Vector3} A reference to this vector.
     */
    roundToZero() {
      this.x = Math.trunc(this.x);
      this.y = Math.trunc(this.y);
      this.z = Math.trunc(this.z);
      return this;
    }
    /**
     * Inverts this vector - i.e. sets x = -x, y = -y and z = -z.
     *
     * @return {Vector3} A reference to this vector.
     */
    negate() {
      this.x = -this.x;
      this.y = -this.y;
      this.z = -this.z;
      return this;
    }
    /**
     * Calculates the dot product of the given vector with this instance.
     *
     * @param {Vector3} v - The vector to compute the dot product with.
     * @return {number} The result of the dot product.
     */
    dot(v) {
      return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    // TODO lengthSquared?
    /**
     * Computes the square of the Euclidean length (straight-line length) from
     * (0, 0, 0) to (x, y, z). If you are comparing the lengths of vectors, you should
     * compare the length squared instead as it is slightly more efficient to calculate.
     *
     * @return {number} The square length of this vector.
     */
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    /**
     * Computes the  Euclidean length (straight-line length) from (0, 0, 0) to (x, y, z).
     *
     * @return {number} The length of this vector.
     */
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    /**
     * Computes the Manhattan length of this vector.
     *
     * @return {number} The length of this vector.
     */
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }
    /**
     * Converts this vector to a unit vector - that is, sets it equal to a vector
     * with the same direction as this one, but with a vector length of `1`.
     *
     * @return {Vector3} A reference to this vector.
     */
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    /**
     * Sets this vector to a vector with the same direction as this one, but
     * with the specified length.
     *
     * @param {number} length - The new length of this vector.
     * @return {Vector3} A reference to this vector.
     */
    setLength(length) {
      return this.normalize().multiplyScalar(length);
    }
    /**
     * Linearly interpolates between the given vector and this instance, where
     * alpha is the percent distance along the line - alpha = 0 will be this
     * vector, and alpha = 1 will be the given one.
     *
     * @param {Vector3} v - The vector to interpolate towards.
     * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
     * @return {Vector3} A reference to this vector.
     */
    lerp(v, alpha) {
      this.x += (v.x - this.x) * alpha;
      this.y += (v.y - this.y) * alpha;
      this.z += (v.z - this.z) * alpha;
      return this;
    }
    /**
     * Linearly interpolates between the given vectors, where alpha is the percent
     * distance along the line - alpha = 0 will be first vector, and alpha = 1 will
     * be the second one. The result is stored in this instance.
     *
     * @param {Vector3} v1 - The first vector.
     * @param {Vector3} v2 - The second vector.
     * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
     * @return {Vector3} A reference to this vector.
     */
    lerpVectors(v1, v2, alpha) {
      this.x = v1.x + (v2.x - v1.x) * alpha;
      this.y = v1.y + (v2.y - v1.y) * alpha;
      this.z = v1.z + (v2.z - v1.z) * alpha;
      return this;
    }
    /**
     * Calculates the cross product of the given vector with this instance.
     *
     * @param {Vector3} v - The vector to compute the cross product with.
     * @return {Vector3} The result of the cross product.
     */
    cross(v) {
      return this.crossVectors(this, v);
    }
    /**
     * Calculates the cross product of the given vectors and stores the result
     * in this instance.
     *
     * @param {Vector3} a - The first vector.
     * @param {Vector3} b - The second vector.
     * @return {Vector3} A reference to this vector.
     */
    crossVectors(a, b) {
      const ax = a.x, ay = a.y, az = a.z;
      const bx = b.x, by = b.y, bz = b.z;
      this.x = ay * bz - az * by;
      this.y = az * bx - ax * bz;
      this.z = ax * by - ay * bx;
      return this;
    }
    /**
     * Projects this vector onto the given one.
     *
     * @param {Vector3} v - The vector to project to.
     * @return {Vector3} A reference to this vector.
     */
    projectOnVector(v) {
      const denominator = v.lengthSq();
      if (denominator === 0) return this.set(0, 0, 0);
      const scalar = v.dot(this) / denominator;
      return this.copy(v).multiplyScalar(scalar);
    }
    /**
     * Projects this vector onto a plane by subtracting this
     * vector projected onto the plane's normal from this vector.
     *
     * @param {Vector3} planeNormal - The plane normal.
     * @return {Vector3} A reference to this vector.
     */
    projectOnPlane(planeNormal) {
      _vector$c.copy(this).projectOnVector(planeNormal);
      return this.sub(_vector$c);
    }
    /**
     * Reflects this vector off a plane orthogonal to the given normal vector.
     *
     * @param {Vector3} normal - The (normalized) normal vector.
     * @return {Vector3} A reference to this vector.
     */
    reflect(normal) {
      return this.sub(_vector$c.copy(normal).multiplyScalar(2 * this.dot(normal)));
    }
    /**
     * Returns the angle between the given vector and this instance in radians.
     *
     * @param {Vector3} v - The vector to compute the angle with.
     * @return {number} The angle in radians.
     */
    angleTo(v) {
      const denominator = Math.sqrt(this.lengthSq() * v.lengthSq());
      if (denominator === 0) return Math.PI / 2;
      const theta = this.dot(v) / denominator;
      return Math.acos(clamp(theta, -1, 1));
    }
    /**
     * Computes the distance from the given vector to this instance.
     *
     * @param {Vector3} v - The vector to compute the distance to.
     * @return {number} The distance.
     */
    distanceTo(v) {
      return Math.sqrt(this.distanceToSquared(v));
    }
    /**
     * Computes the squared distance from the given vector to this instance.
     * If you are just comparing the distance with another distance, you should compare
     * the distance squared instead as it is slightly more efficient to calculate.
     *
     * @param {Vector3} v - The vector to compute the squared distance to.
     * @return {number} The squared distance.
     */
    distanceToSquared(v) {
      const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
      return dx * dx + dy * dy + dz * dz;
    }
    /**
     * Computes the Manhattan distance from the given vector to this instance.
     *
     * @param {Vector3} v - The vector to compute the Manhattan distance to.
     * @return {number} The Manhattan distance.
     */
    manhattanDistanceTo(v) {
      return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
    }
    /**
     * Sets the vector components from the given spherical coordinates.
     *
     * @param {Spherical} s - The spherical coordinates.
     * @return {Vector3} A reference to this vector.
     */
    setFromSpherical(s) {
      return this.setFromSphericalCoords(s.radius, s.phi, s.theta);
    }
    /**
     * Sets the vector components from the given spherical coordinates.
     *
     * @param {number} radius - The radius.
     * @param {number} phi - The phi angle in radians.
     * @param {number} theta - The theta angle in radians.
     * @return {Vector3} A reference to this vector.
     */
    setFromSphericalCoords(radius, phi, theta) {
      const sinPhiRadius = Math.sin(phi) * radius;
      this.x = sinPhiRadius * Math.sin(theta);
      this.y = Math.cos(phi) * radius;
      this.z = sinPhiRadius * Math.cos(theta);
      return this;
    }
    /**
     * Sets the vector components from the given cylindrical coordinates.
     *
     * @param {Cylindrical} c - The cylindrical coordinates.
     * @return {Vector3} A reference to this vector.
     */
    setFromCylindrical(c) {
      return this.setFromCylindricalCoords(c.radius, c.theta, c.y);
    }
    /**
     * Sets the vector components from the given cylindrical coordinates.
     *
     * @param {number} radius - The radius.
     * @param {number} theta - The theta angle in radians.
     * @param {number} y - The y value.
     * @return {Vector3} A reference to this vector.
     */
    setFromCylindricalCoords(radius, theta, y) {
      this.x = radius * Math.sin(theta);
      this.y = y;
      this.z = radius * Math.cos(theta);
      return this;
    }
    /**
     * Sets the vector components to the position elements of the
     * given transformation matrix.
     *
     * @param {Matrix4} m - The 4x4 matrix.
     * @return {Vector3} A reference to this vector.
     */
    setFromMatrixPosition(m) {
      const e = m.elements;
      this.x = e[12];
      this.y = e[13];
      this.z = e[14];
      return this;
    }
    /**
     * Sets the vector components to the scale elements of the
     * given transformation matrix.
     *
     * @param {Matrix4} m - The 4x4 matrix.
     * @return {Vector3} A reference to this vector.
     */
    setFromMatrixScale(m) {
      const sx = this.setFromMatrixColumn(m, 0).length();
      const sy = this.setFromMatrixColumn(m, 1).length();
      const sz = this.setFromMatrixColumn(m, 2).length();
      this.x = sx;
      this.y = sy;
      this.z = sz;
      return this;
    }
    /**
     * Sets the vector components from the specified matrix column.
     *
     * @param {Matrix4} m - The 4x4 matrix.
     * @param {number} index - The column index.
     * @return {Vector3} A reference to this vector.
     */
    setFromMatrixColumn(m, index) {
      return this.fromArray(m.elements, index * 4);
    }
    /**
     * Sets the vector components from the specified matrix column.
     *
     * @param {Matrix3} m - The 3x3 matrix.
     * @param {number} index - The column index.
     * @return {Vector3} A reference to this vector.
     */
    setFromMatrix3Column(m, index) {
      return this.fromArray(m.elements, index * 3);
    }
    /**
     * Sets the vector components from the given Euler angles.
     *
     * @param {Euler} e - The Euler angles to set.
     * @return {Vector3} A reference to this vector.
     */
    setFromEuler(e) {
      this.x = e._x;
      this.y = e._y;
      this.z = e._z;
      return this;
    }
    /**
     * Sets the vector components from the RGB components of the
     * given color.
     *
     * @param {Color} c - The color to set.
     * @return {Vector3} A reference to this vector.
     */
    setFromColor(c) {
      this.x = c.r;
      this.y = c.g;
      this.z = c.b;
      return this;
    }
    /**
     * Returns `true` if this vector is equal with the given one.
     *
     * @param {Vector3} v - The vector to test for equality.
     * @return {boolean} Whether this vector is equal with the given one.
     */
    equals(v) {
      return v.x === this.x && v.y === this.y && v.z === this.z;
    }
    /**
     * Sets this vector's x value to be `array[ offset ]`, y value to be `array[ offset + 1 ]`
     * and z value to be `array[ offset + 2 ]`.
     *
     * @param {Array<number>} array - An array holding the vector component values.
     * @param {number} [offset=0] - The offset into the array.
     * @return {Vector3} A reference to this vector.
     */
    fromArray(array, offset = 0) {
      this.x = array[offset];
      this.y = array[offset + 1];
      this.z = array[offset + 2];
      return this;
    }
    /**
     * Writes the components of this vector to the given array. If no array is provided,
     * the method returns a new instance.
     *
     * @param {Array<number>} [array=[]] - The target array holding the vector components.
     * @param {number} [offset=0] - Index of the first element in the array.
     * @return {Array<number>} The vector components.
     */
    toArray(array = [], offset = 0) {
      array[offset] = this.x;
      array[offset + 1] = this.y;
      array[offset + 2] = this.z;
      return array;
    }
    /**
     * Sets the components of this vector from the given buffer attribute.
     *
     * @param {BufferAttribute} attribute - The buffer attribute holding vector data.
     * @param {number} index - The index into the attribute.
     * @return {Vector3} A reference to this vector.
     */
    fromBufferAttribute(attribute, index) {
      this.x = attribute.getX(index);
      this.y = attribute.getY(index);
      this.z = attribute.getZ(index);
      return this;
    }
    /**
     * Sets each component of this vector to a pseudo-random value between `0` and
     * `1`, excluding `1`.
     *
     * @return {Vector3} A reference to this vector.
     */
    random() {
      this.x = Math.random();
      this.y = Math.random();
      this.z = Math.random();
      return this;
    }
    /**
     * Sets this vector to a uniformly random point on a unit sphere.
     *
     * @return {Vector3} A reference to this vector.
     */
    randomDirection() {
      const theta = Math.random() * Math.PI * 2;
      const u = Math.random() * 2 - 1;
      const c = Math.sqrt(1 - u * u);
      this.x = c * Math.cos(theta);
      this.y = u;
      this.z = c * Math.sin(theta);
      return this;
    }
    *[Symbol.iterator]() {
      yield this.x;
      yield this.y;
      yield this.z;
    }
  }
  const _vector$c = /* @__PURE__ */ new Vector3();
  const _quaternion$4 = /* @__PURE__ */ new Quaternion();
  class Matrix3 {
    /**
     * Constructs a new 3x3 matrix. The arguments are supposed to be
     * in row-major order. If no arguments are provided, the constructor
     * initializes the matrix as an identity matrix.
     *
     * @param {number} [n11] - 1-1 matrix element.
     * @param {number} [n12] - 1-2 matrix element.
     * @param {number} [n13] - 1-3 matrix element.
     * @param {number} [n21] - 2-1 matrix element.
     * @param {number} [n22] - 2-2 matrix element.
     * @param {number} [n23] - 2-3 matrix element.
     * @param {number} [n31] - 3-1 matrix element.
     * @param {number} [n32] - 3-2 matrix element.
     * @param {number} [n33] - 3-3 matrix element.
     */
    constructor(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
      Matrix3.prototype.isMatrix3 = true;
      this.elements = [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ];
      if (n11 !== void 0) {
        this.set(n11, n12, n13, n21, n22, n23, n31, n32, n33);
      }
    }
    /**
     * Sets the elements of the matrix.The arguments are supposed to be
     * in row-major order.
     *
     * @param {number} [n11] - 1-1 matrix element.
     * @param {number} [n12] - 1-2 matrix element.
     * @param {number} [n13] - 1-3 matrix element.
     * @param {number} [n21] - 2-1 matrix element.
     * @param {number} [n22] - 2-2 matrix element.
     * @param {number} [n23] - 2-3 matrix element.
     * @param {number} [n31] - 3-1 matrix element.
     * @param {number} [n32] - 3-2 matrix element.
     * @param {number} [n33] - 3-3 matrix element.
     * @return {Matrix3} A reference to this matrix.
     */
    set(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
      const te = this.elements;
      te[0] = n11;
      te[1] = n21;
      te[2] = n31;
      te[3] = n12;
      te[4] = n22;
      te[5] = n32;
      te[6] = n13;
      te[7] = n23;
      te[8] = n33;
      return this;
    }
    /**
     * Sets this matrix to the 3x3 identity matrix.
     *
     * @return {Matrix3} A reference to this matrix.
     */
    identity() {
      this.set(
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      );
      return this;
    }
    /**
     * Copies the values of the given matrix to this instance.
     *
     * @param {Matrix3} m - The matrix to copy.
     * @return {Matrix3} A reference to this matrix.
     */
    copy(m) {
      const te = this.elements;
      const me = m.elements;
      te[0] = me[0];
      te[1] = me[1];
      te[2] = me[2];
      te[3] = me[3];
      te[4] = me[4];
      te[5] = me[5];
      te[6] = me[6];
      te[7] = me[7];
      te[8] = me[8];
      return this;
    }
    /**
     * Extracts the basis of this matrix into the three axis vectors provided.
     *
     * @param {Vector3} xAxis - The basis's x axis.
     * @param {Vector3} yAxis - The basis's y axis.
     * @param {Vector3} zAxis - The basis's z axis.
     * @return {Matrix3} A reference to this matrix.
     */
    extractBasis(xAxis, yAxis, zAxis) {
      xAxis.setFromMatrix3Column(this, 0);
      yAxis.setFromMatrix3Column(this, 1);
      zAxis.setFromMatrix3Column(this, 2);
      return this;
    }
    /**
     * Set this matrix to the upper 3x3 matrix of the given 4x4 matrix.
     *
     * @param {Matrix4} m - The 4x4 matrix.
     * @return {Matrix3} A reference to this matrix.
     */
    setFromMatrix4(m) {
      const me = m.elements;
      this.set(
        me[0],
        me[4],
        me[8],
        me[1],
        me[5],
        me[9],
        me[2],
        me[6],
        me[10]
      );
      return this;
    }
    /**
     * Post-multiplies this matrix by the given 3x3 matrix.
     *
     * @param {Matrix3} m - The matrix to multiply with.
     * @return {Matrix3} A reference to this matrix.
     */
    multiply(m) {
      return this.multiplyMatrices(this, m);
    }
    /**
     * Pre-multiplies this matrix by the given 3x3 matrix.
     *
     * @param {Matrix3} m - The matrix to multiply with.
     * @return {Matrix3} A reference to this matrix.
     */
    premultiply(m) {
      return this.multiplyMatrices(m, this);
    }
    /**
     * Multiples the given 3x3 matrices and stores the result
     * in this matrix.
     *
     * @param {Matrix3} a - The first matrix.
     * @param {Matrix3} b - The second matrix.
     * @return {Matrix3} A reference to this matrix.
     */
    multiplyMatrices(a, b) {
      const ae = a.elements;
      const be = b.elements;
      const te = this.elements;
      const a11 = ae[0], a12 = ae[3], a13 = ae[6];
      const a21 = ae[1], a22 = ae[4], a23 = ae[7];
      const a31 = ae[2], a32 = ae[5], a33 = ae[8];
      const b11 = be[0], b12 = be[3], b13 = be[6];
      const b21 = be[1], b22 = be[4], b23 = be[7];
      const b31 = be[2], b32 = be[5], b33 = be[8];
      te[0] = a11 * b11 + a12 * b21 + a13 * b31;
      te[3] = a11 * b12 + a12 * b22 + a13 * b32;
      te[6] = a11 * b13 + a12 * b23 + a13 * b33;
      te[1] = a21 * b11 + a22 * b21 + a23 * b31;
      te[4] = a21 * b12 + a22 * b22 + a23 * b32;
      te[7] = a21 * b13 + a22 * b23 + a23 * b33;
      te[2] = a31 * b11 + a32 * b21 + a33 * b31;
      te[5] = a31 * b12 + a32 * b22 + a33 * b32;
      te[8] = a31 * b13 + a32 * b23 + a33 * b33;
      return this;
    }
    /**
     * Multiplies every component of the matrix by the given scalar.
     *
     * @param {number} s - The scalar.
     * @return {Matrix3} A reference to this matrix.
     */
    multiplyScalar(s) {
      const te = this.elements;
      te[0] *= s;
      te[3] *= s;
      te[6] *= s;
      te[1] *= s;
      te[4] *= s;
      te[7] *= s;
      te[2] *= s;
      te[5] *= s;
      te[8] *= s;
      return this;
    }
    /**
     * Computes and returns the determinant of this matrix.
     *
     * @return {number} The determinant.
     */
    determinant() {
      const te = this.elements;
      const a = te[0], b = te[1], c = te[2], d = te[3], e = te[4], f = te[5], g = te[6], h = te[7], i = te[8];
      return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
    }
    /**
     * Inverts this matrix, using the [analytic method]{@link https://en.wikipedia.org/wiki/Invertible_matrix#Analytic_solution}.
     * You can not invert with a determinant of zero. If you attempt this, the method produces
     * a zero matrix instead.
     *
     * @return {Matrix3} A reference to this matrix.
     */
    invert() {
      const te = this.elements, n11 = te[0], n21 = te[1], n31 = te[2], n12 = te[3], n22 = te[4], n32 = te[5], n13 = te[6], n23 = te[7], n33 = te[8], t11 = n33 * n22 - n32 * n23, t12 = n32 * n13 - n33 * n12, t13 = n23 * n12 - n22 * n13, det = n11 * t11 + n21 * t12 + n31 * t13;
      if (det === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
      const detInv = 1 / det;
      te[0] = t11 * detInv;
      te[1] = (n31 * n23 - n33 * n21) * detInv;
      te[2] = (n32 * n21 - n31 * n22) * detInv;
      te[3] = t12 * detInv;
      te[4] = (n33 * n11 - n31 * n13) * detInv;
      te[5] = (n31 * n12 - n32 * n11) * detInv;
      te[6] = t13 * detInv;
      te[7] = (n21 * n13 - n23 * n11) * detInv;
      te[8] = (n22 * n11 - n21 * n12) * detInv;
      return this;
    }
    /**
     * Transposes this matrix in place.
     *
     * @return {Matrix3} A reference to this matrix.
     */
    transpose() {
      let tmp;
      const m = this.elements;
      tmp = m[1];
      m[1] = m[3];
      m[3] = tmp;
      tmp = m[2];
      m[2] = m[6];
      m[6] = tmp;
      tmp = m[5];
      m[5] = m[7];
      m[7] = tmp;
      return this;
    }
    /**
     * Computes the normal matrix which is the inverse transpose of the upper
     * left 3x3 portion of the given 4x4 matrix.
     *
     * @param {Matrix4} matrix4 - The 4x4 matrix.
     * @return {Matrix3} A reference to this matrix.
     */
    getNormalMatrix(matrix4) {
      return this.setFromMatrix4(matrix4).invert().transpose();
    }
    /**
     * Transposes this matrix into the supplied array, and returns itself unchanged.
     *
     * @param {Array<number>} r - An array to store the transposed matrix elements.
     * @return {Matrix3} A reference to this matrix.
     */
    transposeIntoArray(r) {
      const m = this.elements;
      r[0] = m[0];
      r[1] = m[3];
      r[2] = m[6];
      r[3] = m[1];
      r[4] = m[4];
      r[5] = m[7];
      r[6] = m[2];
      r[7] = m[5];
      r[8] = m[8];
      return this;
    }
    /**
     * Sets the UV transform matrix from offset, repeat, rotation, and center.
     *
     * @param {number} tx - Offset x.
     * @param {number} ty - Offset y.
     * @param {number} sx - Repeat x.
     * @param {number} sy - Repeat y.
     * @param {number} rotation - Rotation, in radians. Positive values rotate counterclockwise.
     * @param {number} cx - Center x of rotation.
     * @param {number} cy - Center y of rotation
     * @return {Matrix3} A reference to this matrix.
     */
    setUvTransform(tx, ty, sx, sy, rotation, cx, cy) {
      const c = Math.cos(rotation);
      const s = Math.sin(rotation);
      this.set(
        sx * c,
        sx * s,
        -sx * (c * cx + s * cy) + cx + tx,
        -sy * s,
        sy * c,
        -sy * (-s * cx + c * cy) + cy + ty,
        0,
        0,
        1
      );
      return this;
    }
    /**
     * Scales this matrix with the given scalar values.
     *
     * @param {number} sx - The amount to scale in the X axis.
     * @param {number} sy - The amount to scale in the Y axis.
     * @return {Matrix3} A reference to this matrix.
     */
    scale(sx, sy) {
      this.premultiply(_m3.makeScale(sx, sy));
      return this;
    }
    /**
     * Rotates this matrix by the given angle.
     *
     * @param {number} theta - The rotation in radians.
     * @return {Matrix3} A reference to this matrix.
     */
    rotate(theta) {
      this.premultiply(_m3.makeRotation(-theta));
      return this;
    }
    /**
     * Translates this matrix by the given scalar values.
     *
     * @param {number} tx - The amount to translate in the X axis.
     * @param {number} ty - The amount to translate in the Y axis.
     * @return {Matrix3} A reference to this matrix.
     */
    translate(tx, ty) {
      this.premultiply(_m3.makeTranslation(tx, ty));
      return this;
    }
    // for 2D Transforms
    /**
     * Sets this matrix as a 2D translation transform.
     *
     * @param {number|Vector2} x - The amount to translate in the X axis or alternatively a translation vector.
     * @param {number} y - The amount to translate in the Y axis.
     * @return {Matrix3} A reference to this matrix.
     */
    makeTranslation(x, y) {
      if (x.isVector2) {
        this.set(
          1,
          0,
          x.x,
          0,
          1,
          x.y,
          0,
          0,
          1
        );
      } else {
        this.set(
          1,
          0,
          x,
          0,
          1,
          y,
          0,
          0,
          1
        );
      }
      return this;
    }
    /**
     * Sets this matrix as a 2D rotational transformation.
     *
     * @param {number} theta - The rotation in radians.
     * @return {Matrix3} A reference to this matrix.
     */
    makeRotation(theta) {
      const c = Math.cos(theta);
      const s = Math.sin(theta);
      this.set(
        c,
        -s,
        0,
        s,
        c,
        0,
        0,
        0,
        1
      );
      return this;
    }
    /**
     * Sets this matrix as a 2D scale transform.
     *
     * @param {number} x - The amount to scale in the X axis.
     * @param {number} y - The amount to scale in the Y axis.
     * @return {Matrix3} A reference to this matrix.
     */
    makeScale(x, y) {
      this.set(
        x,
        0,
        0,
        0,
        y,
        0,
        0,
        0,
        1
      );
      return this;
    }
    /**
     * Returns `true` if this matrix is equal with the given one.
     *
     * @param {Matrix3} matrix - The matrix to test for equality.
     * @return {boolean} Whether this matrix is equal with the given one.
     */
    equals(matrix) {
      const te = this.elements;
      const me = matrix.elements;
      for (let i = 0; i < 9; i++) {
        if (te[i] !== me[i]) return false;
      }
      return true;
    }
    /**
     * Sets the elements of the matrix from the given array.
     *
     * @param {Array<number>} array - The matrix elements in column-major order.
     * @param {number} [offset=0] - Index of the first element in the array.
     * @return {Matrix3} A reference to this matrix.
     */
    fromArray(array, offset = 0) {
      for (let i = 0; i < 9; i++) {
        this.elements[i] = array[i + offset];
      }
      return this;
    }
    /**
     * Writes the elements of this matrix to the given array. If no array is provided,
     * the method returns a new instance.
     *
     * @param {Array<number>} [array=[]] - The target array holding the matrix elements in column-major order.
     * @param {number} [offset=0] - Index of the first element in the array.
     * @return {Array<number>} The matrix elements in column-major order.
     */
    toArray(array = [], offset = 0) {
      const te = this.elements;
      array[offset] = te[0];
      array[offset + 1] = te[1];
      array[offset + 2] = te[2];
      array[offset + 3] = te[3];
      array[offset + 4] = te[4];
      array[offset + 5] = te[5];
      array[offset + 6] = te[6];
      array[offset + 7] = te[7];
      array[offset + 8] = te[8];
      return array;
    }
    /**
     * Returns a matrix with copied values from this instance.
     *
     * @return {Matrix3} A clone of this instance.
     */
    clone() {
      return new this.constructor().fromArray(this.elements);
    }
  }
  const _m3 = /* @__PURE__ */ new Matrix3();
  function arrayNeedsUint32(array) {
    for (let i = array.length - 1; i >= 0; --i) {
      if (array[i] >= 65535) return true;
    }
    return false;
  }
  function createElementNS(name) {
    return document.createElementNS("http://www.w3.org/1999/xhtml", name);
  }
  function SRGBToLinear(c) {
    return c < 0.04045 ? c * 0.0773993808 : Math.pow(c * 0.9478672986 + 0.0521327014, 2.4);
  }
  let _canvas;
  class ImageUtils {
    /**
     * Returns a data URI containing a representation of the given image.
     *
     * @param {(HTMLImageElement|HTMLCanvasElement)} image - The image object.
     * @param {string} [type='image/png'] - Indicates the image format.
     * @return {string} The data URI.
     */
    static getDataURL(image, type = "image/png") {
      if (/^data:/i.test(image.src)) {
        return image.src;
      }
      if (typeof HTMLCanvasElement === "undefined") {
        return image.src;
      }
      let canvas;
      if (image instanceof HTMLCanvasElement) {
        canvas = image;
      } else {
        if (_canvas === void 0) _canvas = createElementNS("canvas");
        _canvas.width = image.width;
        _canvas.height = image.height;
        const context = _canvas.getContext("2d");
        if (image instanceof ImageData) {
          context.putImageData(image, 0, 0);
        } else {
          context.drawImage(image, 0, 0, image.width, image.height);
        }
        canvas = _canvas;
      }
      return canvas.toDataURL(type);
    }
    /**
     * Converts the given sRGB image data to linear color space.
     *
     * @param {(HTMLImageElement|HTMLCanvasElement|ImageBitmap|Object)} image - The image object.
     * @return {HTMLCanvasElement|Object} The converted image.
     */
    static sRGBToLinear(image) {
      if (typeof HTMLImageElement !== "undefined" && image instanceof HTMLImageElement || typeof HTMLCanvasElement !== "undefined" && image instanceof HTMLCanvasElement || typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap) {
        const canvas = createElementNS("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        const imageData = context.getImageData(0, 0, image.width, image.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i++) {
          data[i] = SRGBToLinear(data[i] / 255) * 255;
        }
        context.putImageData(imageData, 0, 0);
        return canvas;
      } else if (image.data) {
        const data = image.data.slice(0);
        for (let i = 0; i < data.length; i++) {
          if (data instanceof Uint8Array || data instanceof Uint8ClampedArray) {
            data[i] = Math.floor(SRGBToLinear(data[i] / 255) * 255);
          } else {
            data[i] = SRGBToLinear(data[i]);
          }
        }
        return {
          data,
          width: image.width,
          height: image.height
        };
      } else {
        console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.");
        return image;
      }
    }
  }
  let _sourceId = 0;
  class Source {
    /**
     * Constructs a new video texture.
     *
     * @param {any} [data=null] - The data definition of a texture.
     */
    constructor(data = null) {
      this.isSource = true;
      Object.defineProperty(this, "id", { value: _sourceId++ });
      this.uuid = generateUUID();
      this.data = data;
      this.dataReady = true;
      this.version = 0;
    }
    /**
     * Returns the dimensions of the source into the given target vector.
     *
     * @param {(Vector2|Vector3)} target - The target object the result is written into.
     * @return {(Vector2|Vector3)} The dimensions of the source.
     */
    getSize(target) {
      const data = this.data;
      if (data instanceof HTMLVideoElement) {
        target.set(data.videoWidth, data.videoHeight, 0);
      } else if (data instanceof VideoFrame) {
        target.set(data.displayHeight, data.displayWidth, 0);
      } else if (data !== null) {
        target.set(data.width, data.height, data.depth || 0);
      } else {
        target.set(0, 0, 0);
      }
      return target;
    }
    /**
     * When the property is set to `true`, the engine allocates the memory
     * for the texture (if necessary) and triggers the actual texture upload
     * to the GPU next time the source is used.
     *
     * @type {boolean}
     * @default false
     * @param {boolean} value
     */
    set needsUpdate(value) {
      if (value === true) this.version++;
    }
    /**
     * Serializes the source into JSON.
     *
     * @param {?(Object|string)} meta - An optional value holding meta information about the serialization.
     * @return {Object} A JSON object representing the serialized source.
     * @see {@link ObjectLoader#parse}
     */
    toJSON(meta) {
      const isRootObject = meta === void 0 || typeof meta === "string";
      if (!isRootObject && meta.images[this.uuid] !== void 0) {
        return meta.images[this.uuid];
      }
      const output = {
        uuid: this.uuid,
        url: ""
      };
      const data = this.data;
      if (data !== null) {
        let url;
        if (Array.isArray(data)) {
          url = [];
          for (let i = 0, l = data.length; i < l; i++) {
            if (data[i].isDataTexture) {
              url.push(serializeImage(data[i].image));
            } else {
              url.push(serializeImage(data[i]));
            }
          }
        } else {
          url = serializeImage(data);
        }
        output.url = url;
      }
      if (!isRootObject) {
        meta.images[this.uuid] = output;
      }
      return output;
    }
  }
  function serializeImage(image) {
    if (typeof HTMLImageElement !== "undefined" && image instanceof HTMLImageElement || typeof HTMLCanvasElement !== "undefined" && image instanceof HTMLCanvasElement || typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap) {
      return ImageUtils.getDataURL(image);
    } else {
      if (image.data) {
        return {
          data: Array.from(image.data),
          width: image.width,
          height: image.height,
          type: image.data.constructor.name
        };
      } else {
        console.warn("THREE.Texture: Unable to serialize Texture.");
        return {};
      }
    }
  }
  let _textureId = 0;
  const _tempVec3 = /* @__PURE__ */ new Vector3();
  class Texture extends EventDispatcher {
    /**
     * Constructs a new texture.
     *
     * @param {?Object} [image=Texture.DEFAULT_IMAGE] - The image holding the texture data.
     * @param {number} [mapping=Texture.DEFAULT_MAPPING] - The texture mapping.
     * @param {number} [wrapS=ClampToEdgeWrapping] - The wrapS value.
     * @param {number} [wrapT=ClampToEdgeWrapping] - The wrapT value.
     * @param {number} [magFilter=LinearFilter] - The mag filter value.
     * @param {number} [minFilter=LinearMipmapLinearFilter] - The min filter value.
     * @param {number} [format=RGBAFormat] - The texture format.
     * @param {number} [type=UnsignedByteType] - The texture type.
     * @param {number} [anisotropy=Texture.DEFAULT_ANISOTROPY] - The anisotropy value.
     * @param {string} [colorSpace=NoColorSpace] - The color space.
     */
    constructor(image = Texture.DEFAULT_IMAGE, mapping = Texture.DEFAULT_MAPPING, wrapS = ClampToEdgeWrapping, wrapT = ClampToEdgeWrapping, magFilter = LinearFilter, minFilter = LinearMipmapLinearFilter, format = RGBAFormat, type = UnsignedByteType, anisotropy = Texture.DEFAULT_ANISOTROPY, colorSpace = NoColorSpace) {
      super();
      this.isTexture = true;
      Object.defineProperty(this, "id", { value: _textureId++ });
      this.uuid = generateUUID();
      this.name = "";
      this.source = new Source(image);
      this.mipmaps = [];
      this.mapping = mapping;
      this.channel = 0;
      this.wrapS = wrapS;
      this.wrapT = wrapT;
      this.magFilter = magFilter;
      this.minFilter = minFilter;
      this.anisotropy = anisotropy;
      this.format = format;
      this.internalFormat = null;
      this.type = type;
      this.offset = new Vector2(0, 0);
      this.repeat = new Vector2(1, 1);
      this.center = new Vector2(0, 0);
      this.rotation = 0;
      this.matrixAutoUpdate = true;
      this.matrix = new Matrix3();
      this.generateMipmaps = true;
      this.premultiplyAlpha = false;
      this.flipY = true;
      this.unpackAlignment = 4;
      this.colorSpace = colorSpace;
      this.userData = {};
      this.updateRanges = [];
      this.version = 0;
      this.onUpdate = null;
      this.renderTarget = null;
      this.isRenderTargetTexture = false;
      this.isArrayTexture = image && image.depth && image.depth > 1 ? true : false;
      this.pmremVersion = 0;
    }
    /**
     * The width of the texture in pixels.
     */
    get width() {
      return this.source.getSize(_tempVec3).x;
    }
    /**
     * The height of the texture in pixels.
     */
    get height() {
      return this.source.getSize(_tempVec3).y;
    }
    /**
     * The depth of the texture in pixels.
     */
    get depth() {
      return this.source.getSize(_tempVec3).z;
    }
    /**
     * The image object holding the texture data.
     *
     * @type {?Object}
     */
    get image() {
      return this.source.data;
    }
    set image(value = null) {
      this.source.data = value;
    }
    /**
     * Updates the texture transformation matrix from the from the properties {@link Texture#offset},
     * {@link Texture#repeat}, {@link Texture#rotation}, and {@link Texture#center}.
     */
    updateMatrix() {
      this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
    }
    /**
     * Adds a range of data in the data texture to be updated on the GPU.
     *
     * @param {number} start - Position at which to start update.
     * @param {number} count - The number of components to update.
     */
    addUpdateRange(start, count) {
      this.updateRanges.push({ start, count });
    }
    /**
     * Clears the update ranges.
     */
    clearUpdateRanges() {
      this.updateRanges.length = 0;
    }
    /**
     * Returns a new texture with copied values from this instance.
     *
     * @return {Texture} A clone of this instance.
     */
    clone() {
      return new this.constructor().copy(this);
    }
    /**
     * Copies the values of the given texture to this instance.
     *
     * @param {Texture} source - The texture to copy.
     * @return {Texture} A reference to this instance.
     */
    copy(source) {
      this.name = source.name;
      this.source = source.source;
      this.mipmaps = source.mipmaps.slice(0);
      this.mapping = source.mapping;
      this.channel = source.channel;
      this.wrapS = source.wrapS;
      this.wrapT = source.wrapT;
      this.magFilter = source.magFilter;
      this.minFilter = source.minFilter;
      this.anisotropy = source.anisotropy;
      this.format = source.format;
      this.internalFormat = source.internalFormat;
      this.type = source.type;
      this.offset.copy(source.offset);
      this.repeat.copy(source.repeat);
      this.center.copy(source.center);
      this.rotation = source.rotation;
      this.matrixAutoUpdate = source.matrixAutoUpdate;
      this.matrix.copy(source.matrix);
      this.generateMipmaps = source.generateMipmaps;
      this.premultiplyAlpha = source.premultiplyAlpha;
      this.flipY = source.flipY;
      this.unpackAlignment = source.unpackAlignment;
      this.colorSpace = source.colorSpace;
      this.renderTarget = source.renderTarget;
      this.isRenderTargetTexture = source.isRenderTargetTexture;
      this.isArrayTexture = source.isArrayTexture;
      this.userData = JSON.parse(JSON.stringify(source.userData));
      this.needsUpdate = true;
      return this;
    }
    /**
     * Sets this texture's properties based on `values`.
     * @param {Object} values - A container with texture parameters.
     */
    setValues(values) {
      for (const key in values) {
        const newValue = values[key];
        if (newValue === void 0) {
          console.warn(`THREE.Texture.setValues(): parameter '${key}' has value of undefined.`);
          continue;
        }
        const currentValue = this[key];
        if (currentValue === void 0) {
          console.warn(`THREE.Texture.setValues(): property '${key}' does not exist.`);
          continue;
        }
        if (currentValue && newValue && (currentValue.isVector2 && newValue.isVector2)) {
          currentValue.copy(newValue);
        } else if (currentValue && newValue && (currentValue.isVector3 && newValue.isVector3)) {
          currentValue.copy(newValue);
        } else if (currentValue && newValue && (currentValue.isMatrix3 && newValue.isMatrix3)) {
          currentValue.copy(newValue);
        } else {
          this[key] = newValue;
        }
      }
    }
    /**
     * Serializes the texture into JSON.
     *
     * @param {?(Object|string)} meta - An optional value holding meta information about the serialization.
     * @return {Object} A JSON object representing the serialized texture.
     * @see {@link ObjectLoader#parse}
     */
    toJSON(meta) {
      const isRootObject = meta === void 0 || typeof meta === "string";
      if (!isRootObject && meta.textures[this.uuid] !== void 0) {
        return meta.textures[this.uuid];
      }
      const output = {
        metadata: {
          version: 4.7,
          type: "Texture",
          generator: "Texture.toJSON"
        },
        uuid: this.uuid,
        name: this.name,
        image: this.source.toJSON(meta).uuid,
        mapping: this.mapping,
        channel: this.channel,
        repeat: [this.repeat.x, this.repeat.y],
        offset: [this.offset.x, this.offset.y],
        center: [this.center.x, this.center.y],
        rotation: this.rotation,
        wrap: [this.wrapS, this.wrapT],
        format: this.format,
        internalFormat: this.internalFormat,
        type: this.type,
        colorSpace: this.colorSpace,
        minFilter: this.minFilter,
        magFilter: this.magFilter,
        anisotropy: this.anisotropy,
        flipY: this.flipY,
        generateMipmaps: this.generateMipmaps,
        premultiplyAlpha: this.premultiplyAlpha,
        unpackAlignment: this.unpackAlignment
      };
      if (Object.keys(this.userData).length > 0) output.userData = this.userData;
      if (!isRootObject) {
        meta.textures[this.uuid] = output;
      }
      return output;
    }
    /**
     * Frees the GPU-related resources allocated by this instance. Call this
     * method whenever this instance is no longer used in your app.
     *
     * @fires Texture#dispose
     */
    dispose() {
      this.dispatchEvent({ type: "dispose" });
    }
    /**
     * Transforms the given uv vector with the textures uv transformation matrix.
     *
     * @param {Vector2} uv - The uv vector.
     * @return {Vector2} The transformed uv vector.
     */
    transformUv(uv) {
      if (this.mapping !== UVMapping) return uv;
      uv.applyMatrix3(this.matrix);
      if (uv.x < 0 || uv.x > 1) {
        switch (this.wrapS) {
          case RepeatWrapping:
            uv.x = uv.x - Math.floor(uv.x);
            break;
          case ClampToEdgeWrapping:
            uv.x = uv.x < 0 ? 0 : 1;
            break;
          case MirroredRepeatWrapping:
            if (Math.abs(Math.floor(uv.x) % 2) === 1) {
              uv.x = Math.ceil(uv.x) - uv.x;
            } else {
              uv.x = uv.x - Math.floor(uv.x);
            }
            break;
        }
      }
      if (uv.y < 0 || uv.y > 1) {
        switch (this.wrapT) {
          case RepeatWrapping:
            uv.y = uv.y - Math.floor(uv.y);
            break;
          case ClampToEdgeWrapping:
            uv.y = uv.y < 0 ? 0 : 1;
            break;
          case MirroredRepeatWrapping:
            if (Math.abs(Math.floor(uv.y) % 2) === 1) {
              uv.y = Math.ceil(uv.y) - uv.y;
            } else {
              uv.y = uv.y - Math.floor(uv.y);
            }
            break;
        }
      }
      if (this.flipY) {
        uv.y = 1 - uv.y;
      }
      return uv;
    }
    /**
     * Setting this property to `true` indicates the engine the texture
     * must be updated in the next render. This triggers a texture upload
     * to the GPU and ensures correct texture parameter configuration.
     *
     * @type {boolean}
     * @default false
     * @param {boolean} value
     */
    set needsUpdate(value) {
      if (value === true) {
        this.version++;
        this.source.needsUpdate = true;
      }
    }
    /**
     * Setting this property to `true` indicates the engine the PMREM
     * must be regenerated.
     *
     * @type {boolean}
     * @default false
     * @param {boolean} value
     */
    set needsPMREMUpdate(value) {
      if (value === true) {
        this.pmremVersion++;
      }
    }
  }
  Texture.DEFAULT_IMAGE = null;
  Texture.DEFAULT_MAPPING = UVMapping;
  Texture.DEFAULT_ANISOTROPY = 1;
  class Vector4 {
    /**
     * Constructs a new 4D vector.
     *
     * @param {number} [x=0] - The x value of this vector.
     * @param {number} [y=0] - The y value of this vector.
     * @param {number} [z=0] - The z value of this vector.
     * @param {number} [w=1] - The w value of this vector.
     */
    constructor(x = 0, y = 0, z = 0, w = 1) {
      Vector4.prototype.isVector4 = true;
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    }
    /**
     * Alias for {@link Vector4#z}.
     *
     * @type {number}
     */
    get width() {
      return this.z;
    }
    set width(value) {
      this.z = value;
    }
    /**
     * Alias for {@link Vector4#w}.
     *
     * @type {number}
     */
    get height() {
      return this.w;
    }
    set height(value) {
      this.w = value;
    }
    /**
     * Sets the vector components.
     *
     * @param {number} x - The value of the x component.
     * @param {number} y - The value of the y component.
     * @param {number} z - The value of the z component.
     * @param {number} w - The value of the w component.
     * @return {Vector4} A reference to this vector.
     */
    set(x, y, z, w) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
      return this;
    }
    /**
     * Sets the vector components to the same value.
     *
     * @param {number} scalar - The value to set for all vector components.
     * @return {Vector4} A reference to this vector.
     */
    setScalar(scalar) {
      this.x = scalar;
      this.y = scalar;
      this.z = scalar;
      this.w = scalar;
      return this;
    }
    /**
     * Sets the vector's x component to the given value
     *
     * @param {number} x - The value to set.
     * @return {Vector4} A reference to this vector.
     */
    setX(x) {
      this.x = x;
      return this;
    }
    /**
     * Sets the vector's y component to the given value
     *
     * @param {number} y - The value to set.
     * @return {Vector4} A reference to this vector.
     */
    setY(y) {
      this.y = y;
      return this;
    }
    /**
     * Sets the vector's z component to the given value
     *
     * @param {number} z - The value to set.
     * @return {Vector4} A reference to this vector.
     */
    setZ(z) {
      this.z = z;
      return this;
    }
    /**
     * Sets the vector's w component to the given value
     *
     * @param {number} w - The value to set.
     * @return {Vector4} A reference to this vector.
     */
    setW(w) {
      this.w = w;
      return this;
    }
    /**
     * Allows to set a vector component with an index.
     *
     * @param {number} index - The component index. `0` equals to x, `1` equals to y,
     * `2` equals to z, `3` equals to w.
     * @param {number} value - The value to set.
     * @return {Vector4} A reference to this vector.
     */
    setComponent(index, value) {
      switch (index) {
        case 0:
          this.x = value;
          break;
        case 1:
          this.y = value;
          break;
        case 2:
          this.z = value;
          break;
        case 3:
          this.w = value;
          break;
        default:
          throw new Error("index is out of range: " + index);
      }
      return this;
    }
    /**
     * Returns the value of the vector component which matches the given index.
     *
     * @param {number} index - The component index. `0` equals to x, `1` equals to y,
     * `2` equals to z, `3` equals to w.
     * @return {number} A vector component value.
     */
    getComponent(index) {
      switch (index) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        case 3:
          return this.w;
        default:
          throw new Error("index is out of range: " + index);
      }
    }
    /**
     * Returns a new vector with copied values from this instance.
     *
     * @return {Vector4} A clone of this instance.
     */
    clone() {
      return new this.constructor(this.x, this.y, this.z, this.w);
    }
    /**
     * Copies the values of the given vector to this instance.
     *
     * @param {Vector3|Vector4} v - The vector to copy.
     * @return {Vector4} A reference to this vector.
     */
    copy(v) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      this.w = v.w !== void 0 ? v.w : 1;
      return this;
    }
    /**
     * Adds the given vector to this instance.
     *
     * @param {Vector4} v - The vector to add.
     * @return {Vector4} A reference to this vector.
     */
    add(v) {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
      this.w += v.w;
      return this;
    }
    /**
     * Adds the given scalar value to all components of this instance.
     *
     * @param {number} s - The scalar to add.
     * @return {Vector4} A reference to this vector.
     */
    addScalar(s) {
      this.x += s;
      this.y += s;
      this.z += s;
      this.w += s;
      return this;
    }
    /**
     * Adds the given vectors and stores the result in this instance.
     *
     * @param {Vector4} a - The first vector.
     * @param {Vector4} b - The second vector.
     * @return {Vector4} A reference to this vector.
     */
    addVectors(a, b) {
      this.x = a.x + b.x;
      this.y = a.y + b.y;
      this.z = a.z + b.z;
      this.w = a.w + b.w;
      return this;
    }
    /**
     * Adds the given vector scaled by the given factor to this instance.
     *
     * @param {Vector4} v - The vector.
     * @param {number} s - The factor that scales `v`.
     * @return {Vector4} A reference to this vector.
     */
    addScaledVector(v, s) {
      this.x += v.x * s;
      this.y += v.y * s;
      this.z += v.z * s;
      this.w += v.w * s;
      return this;
    }
    /**
     * Subtracts the given vector from this instance.
     *
     * @param {Vector4} v - The vector to subtract.
     * @return {Vector4} A reference to this vector.
     */
    sub(v) {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
      this.w -= v.w;
      return this;
    }
    /**
     * Subtracts the given scalar value from all components of this instance.
     *
     * @param {number} s - The scalar to subtract.
     * @return {Vector4} A reference to this vector.
     */
    subScalar(s) {
      this.x -= s;
      this.y -= s;
      this.z -= s;
      this.w -= s;
      return this;
    }
    /**
     * Subtracts the given vectors and stores the result in this instance.
     *
     * @param {Vector4} a - The first vector.
     * @param {Vector4} b - The second vector.
     * @return {Vector4} A reference to this vector.
     */
    subVectors(a, b) {
      this.x = a.x - b.x;
      this.y = a.y - b.y;
      this.z = a.z - b.z;
      this.w = a.w - b.w;
      return this;
    }
    /**
     * Multiplies the given vector with this instance.
     *
     * @param {Vector4} v - The vector to multiply.
     * @return {Vector4} A reference to this vector.
     */
    multiply(v) {
      this.x *= v.x;
      this.y *= v.y;
      this.z *= v.z;
      this.w *= v.w;
      return this;
    }
    /**
     * Multiplies the given scalar value with all components of this instance.
     *
     * @param {number} scalar - The scalar to multiply.
     * @return {Vector4} A reference to this vector.
     */
    multiplyScalar(scalar) {
      this.x *= scalar;
      this.y *= scalar;
      this.z *= scalar;
      this.w *= scalar;
      return this;
    }
    /**
     * Multiplies this vector with the given 4x4 matrix.
     *
     * @param {Matrix4} m - The 4x4 matrix.
     * @return {Vector4} A reference to this vector.
     */
    applyMatrix4(m) {
      const x = this.x, y = this.y, z = this.z, w = this.w;
      const e = m.elements;
      this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
      this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
      this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
      this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;
      return this;
    }
    /**
     * Divides this instance by the given vector.
     *
     * @param {Vector4} v - The vector to divide.
     * @return {Vector4} A reference to this vector.
     */
    divide(v) {
      this.x /= v.x;
      this.y /= v.y;
      this.z /= v.z;
      this.w /= v.w;
      return this;
    }
    /**
     * Divides this vector by the given scalar.
     *
     * @param {number} scalar - The scalar to divide.
     * @return {Vector4} A reference to this vector.
     */
    divideScalar(scalar) {
      return this.multiplyScalar(1 / scalar);
    }
    /**
     * Sets the x, y and z components of this
     * vector to the quaternion's axis and w to the angle.
     *
     * @param {Quaternion} q - The Quaternion to set.
     * @return {Vector4} A reference to this vector.
     */
    setAxisAngleFromQuaternion(q) {
      this.w = 2 * Math.acos(q.w);
      const s = Math.sqrt(1 - q.w * q.w);
      if (s < 1e-4) {
        this.x = 1;
        this.y = 0;
        this.z = 0;
      } else {
        this.x = q.x / s;
        this.y = q.y / s;
        this.z = q.z / s;
      }
      return this;
    }
    /**
     * Sets the x, y and z components of this
     * vector to the axis of rotation and w to the angle.
     *
     * @param {Matrix4} m - A 4x4 matrix of which the upper left 3x3 matrix is a pure rotation matrix.
     * @return {Vector4} A reference to this vector.
     */
    setAxisAngleFromRotationMatrix(m) {
      let angle, x, y, z;
      const epsilon = 0.01, epsilon2 = 0.1, te = m.elements, m11 = te[0], m12 = te[4], m13 = te[8], m21 = te[1], m22 = te[5], m23 = te[9], m31 = te[2], m32 = te[6], m33 = te[10];
      if (Math.abs(m12 - m21) < epsilon && Math.abs(m13 - m31) < epsilon && Math.abs(m23 - m32) < epsilon) {
        if (Math.abs(m12 + m21) < epsilon2 && Math.abs(m13 + m31) < epsilon2 && Math.abs(m23 + m32) < epsilon2 && Math.abs(m11 + m22 + m33 - 3) < epsilon2) {
          this.set(1, 0, 0, 0);
          return this;
        }
        angle = Math.PI;
        const xx = (m11 + 1) / 2;
        const yy = (m22 + 1) / 2;
        const zz = (m33 + 1) / 2;
        const xy = (m12 + m21) / 4;
        const xz = (m13 + m31) / 4;
        const yz = (m23 + m32) / 4;
        if (xx > yy && xx > zz) {
          if (xx < epsilon) {
            x = 0;
            y = 0.707106781;
            z = 0.707106781;
          } else {
            x = Math.sqrt(xx);
            y = xy / x;
            z = xz / x;
          }
        } else if (yy > zz) {
          if (yy < epsilon) {
            x = 0.707106781;
            y = 0;
            z = 0.707106781;
          } else {
            y = Math.sqrt(yy);
            x = xy / y;
            z = yz / y;
          }
        } else {
          if (zz < epsilon) {
            x = 0.707106781;
            y = 0.707106781;
            z = 0;
          } else {
            z = Math.sqrt(zz);
            x = xz / z;
            y = yz / z;
          }
        }
        this.set(x, y, z, angle);
        return this;
      }
      let s = Math.sqrt((m32 - m23) * (m32 - m23) + (m13 - m31) * (m13 - m31) + (m21 - m12) * (m21 - m12));
      if (Math.abs(s) < 1e-3) s = 1;
      this.x = (m32 - m23) / s;
      this.y = (m13 - m31) / s;
      this.z = (m21 - m12) / s;
      this.w = Math.acos((m11 + m22 + m33 - 1) / 2);
      return this;
    }
    /**
     * Sets the vector components to the position elements of the
     * given transformation matrix.
     *
     * @param {Matrix4} m - The 4x4 matrix.
     * @return {Vector4} A reference to this vector.
     */
    setFromMatrixPosition(m) {
      const e = m.elements;
      this.x = e[12];
      this.y = e[13];
      this.z = e[14];
      this.w = e[15];
      return this;
    }
    /**
     * If this vector's x, y, z or w value is greater than the given vector's x, y, z or w
     * value, replace that value with the corresponding min value.
     *
     * @param {Vector4} v - The vector.
     * @return {Vector4} A reference to this vector.
     */
    min(v) {
      this.x = Math.min(this.x, v.x);
      this.y = Math.min(this.y, v.y);
      this.z = Math.min(this.z, v.z);
      this.w = Math.min(this.w, v.w);
      return this;
    }
    /**
     * If this vector's x, y, z or w value is less than the given vector's x, y, z or w
     * value, replace that value with the corresponding max value.
     *
     * @param {Vector4} v - The vector.
     * @return {Vector4} A reference to this vector.
     */
    max(v) {
      this.x = Math.max(this.x, v.x);
      this.y = Math.max(this.y, v.y);
      this.z = Math.max(this.z, v.z);
      this.w = Math.max(this.w, v.w);
      return this;
    }
    /**
     * If this vector's x, y, z or w value is greater than the max vector's x, y, z or w
     * value, it is replaced by the corresponding value.
     * If this vector's x, y, z or w value is less than the min vector's x, y, z or w value,
     * it is replaced by the corresponding value.
     *
     * @param {Vector4} min - The minimum x, y and z values.
     * @param {Vector4} max - The maximum x, y and z values in the desired range.
     * @return {Vector4} A reference to this vector.
     */
    clamp(min, max) {
      this.x = clamp(this.x, min.x, max.x);
      this.y = clamp(this.y, min.y, max.y);
      this.z = clamp(this.z, min.z, max.z);
      this.w = clamp(this.w, min.w, max.w);
      return this;
    }
    /**
     * If this vector's x, y, z or w values are greater than the max value, they are
     * replaced by the max value.
     * If this vector's x, y, z or w values are less than the min value, they are
     * replaced by the min value.
     *
     * @param {number} minVal - The minimum value the components will be clamped to.
     * @param {number} maxVal - The maximum value the components will be clamped to.
     * @return {Vector4} A reference to this vector.
     */
    clampScalar(minVal, maxVal) {
      this.x = clamp(this.x, minVal, maxVal);
      this.y = clamp(this.y, minVal, maxVal);
      this.z = clamp(this.z, minVal, maxVal);
      this.w = clamp(this.w, minVal, maxVal);
      return this;
    }
    /**
     * If this vector's length is greater than the max value, it is replaced by
     * the max value.
     * If this vector's length is less than the min value, it is replaced by the
     * min value.
     *
     * @param {number} min - The minimum value the vector length will be clamped to.
     * @param {number} max - The maximum value the vector length will be clamped to.
     * @return {Vector4} A reference to this vector.
     */
    clampLength(min, max) {
      const length = this.length();
      return this.divideScalar(length || 1).multiplyScalar(clamp(length, min, max));
    }
    /**
     * The components of this vector are rounded down to the nearest integer value.
     *
     * @return {Vector4} A reference to this vector.
     */
    floor() {
      this.x = Math.floor(this.x);
      this.y = Math.floor(this.y);
      this.z = Math.floor(this.z);
      this.w = Math.floor(this.w);
      return this;
    }
    /**
     * The components of this vector are rounded up to the nearest integer value.
     *
     * @return {Vector4} A reference to this vector.
     */
    ceil() {
      this.x = Math.ceil(this.x);
      this.y = Math.ceil(this.y);
      this.z = Math.ceil(this.z);
      this.w = Math.ceil(this.w);
      return this;
    }
    /**
     * The components of this vector are rounded to the nearest integer value
     *
     * @return {Vector4} A reference to this vector.
     */
    round() {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
      this.z = Math.round(this.z);
      this.w = Math.round(this.w);
      return this;
    }
    /**
     * The components of this vector are rounded towards zero (up if negative,
     * down if positive) to an integer value.
     *
     * @return {Vector4} A reference to this vector.
     */
    roundToZero() {
      this.x = Math.trunc(this.x);
      this.y = Math.trunc(this.y);
      this.z = Math.trunc(this.z);
      this.w = Math.trunc(this.w);
      return this;
    }
    /**
     * Inverts this vector - i.e. sets x = -x, y = -y, z = -z, w = -w.
     *
     * @return {Vector4} A reference to this vector.
     */
    negate() {
      this.x = -this.x;
      this.y = -this.y;
      this.z = -this.z;
      this.w = -this.w;
      return this;
    }
    /**
     * Calculates the dot product of the given vector with this instance.
     *
     * @param {Vector4} v - The vector to compute the dot product with.
     * @return {number} The result of the dot product.
     */
    dot(v) {
      return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    }
    /**
     * Computes the square of the Euclidean length (straight-line length) from
     * (0, 0, 0, 0) to (x, y, z, w). If you are comparing the lengths of vectors, you should
     * compare the length squared instead as it is slightly more efficient to calculate.
     *
     * @return {number} The square length of this vector.
     */
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    /**
     * Computes the  Euclidean length (straight-line length) from (0, 0, 0, 0) to (x, y, z, w).
     *
     * @return {number} The length of this vector.
     */
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    /**
     * Computes the Manhattan length of this vector.
     *
     * @return {number} The length of this vector.
     */
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
    }
    /**
     * Converts this vector to a unit vector - that is, sets it equal to a vector
     * with the same direction as this one, but with a vector length of `1`.
     *
     * @return {Vector4} A reference to this vector.
     */
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    /**
     * Sets this vector to a vector with the same direction as this one, but
     * with the specified length.
     *
     * @param {number} length - The new length of this vector.
     * @return {Vector4} A reference to this vector.
     */
    setLength(length) {
      return this.normalize().multiplyScalar(length);
    }
    /**
     * Linearly interpolates between the given vector and this instance, where
     * alpha is the percent distance along the line - alpha = 0 will be this
     * vector, and alpha = 1 will be the given one.
     *
     * @param {Vector4} v - The vector to interpolate towards.
     * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
     * @return {Vector4} A reference to this vector.
     */
    lerp(v, alpha) {
      this.x += (v.x - this.x) * alpha;
      this.y += (v.y - this.y) * alpha;
      this.z += (v.z - this.z) * alpha;
      this.w += (v.w - this.w) * alpha;
      return this;
    }
    /**
     * Linearly interpolates between the given vectors, where alpha is the percent
     * distance along the line - alpha = 0 will be first vector, and alpha = 1 will
     * be the second one. The result is stored in this instance.
     *
     * @param {Vector4} v1 - The first vector.
     * @param {Vector4} v2 - The second vector.
     * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
     * @return {Vector4} A reference to this vector.
     */
    lerpVectors(v1, v2, alpha) {
      this.x = v1.x + (v2.x - v1.x) * alpha;
      this.y = v1.y + (v2.y - v1.y) * alpha;
      this.z = v1.z + (v2.z - v1.z) * alpha;
      this.w = v1.w + (v2.w - v1.w) * alpha;
      return this;
    }
    /**
     * Returns `true` if this vector is equal with the given one.
     *
     * @param {Vector4} v - The vector to test for equality.
     * @return {boolean} Whether this vector is equal with the given one.
     */
    equals(v) {
      return v.x === this.x && v.y === this.y && v.z === this.z && v.w === this.w;
    }
    /**
     * Sets this vector's x value to be `array[ offset ]`, y value to be `array[ offset + 1 ]`,
     * z value to be `array[ offset + 2 ]`, w value to be `array[ offset + 3 ]`.
     *
     * @param {Array<number>} array - An array holding the vector component values.
     * @param {number} [offset=0] - The offset into the array.
     * @return {Vector4} A reference to this vector.
     */
    fromArray(array, offset = 0) {
      this.x = array[offset];
      this.y = array[offset + 1];
      this.z = array[offset + 2];
      this.w = array[offset + 3];
      return this;
    }
    /**
     * Writes the components of this vector to the given array. If no array is provided,
     * the method returns a new instance.
     *
     * @param {Array<number>} [array=[]] - The target array holding the vector components.
     * @param {number} [offset=0] - Index of the first element in the array.
     * @return {Array<number>} The vector components.
     */
    toArray(array = [], offset = 0) {
      array[offset] = this.x;
      array[offset + 1] = this.y;
      array[offset + 2] = this.z;
      array[offset + 3] = this.w;
      return array;
    }
    /**
     * Sets the components of this vector from the given buffer attribute.
     *
     * @param {BufferAttribute} attribute - The buffer attribute holding vector data.
     * @param {number} index - The index into the attribute.
     * @return {Vector4} A reference to this vector.
     */
    fromBufferAttribute(attribute, index) {
      this.x = attribute.getX(index);
      this.y = attribute.getY(index);
      this.z = attribute.getZ(index);
      this.w = attribute.getW(index);
      return this;
    }
    /**
     * Sets each component of this vector to a pseudo-random value between `0` and
     * `1`, excluding `1`.
     *
     * @return {Vector4} A reference to this vector.
     */
    random() {
      this.x = Math.random();
      this.y = Math.random();
      this.z = Math.random();
      this.w = Math.random();
      return this;
    }
    *[Symbol.iterator]() {
      yield this.x;
      yield this.y;
      yield this.z;
      yield this.w;
    }
  }
  class Box3 {
    /**
     * Constructs a new bounding box.
     *
     * @param {Vector3} [min=(Infinity,Infinity,Infinity)] - A vector representing the lower boundary of the box.
     * @param {Vector3} [max=(-Infinity,-Infinity,-Infinity)] - A vector representing the upper boundary of the box.
     */
    constructor(min = new Vector3(Infinity, Infinity, Infinity), max = new Vector3(-Infinity, -Infinity, -Infinity)) {
      this.isBox3 = true;
      this.min = min;
      this.max = max;
    }
    /**
     * Sets the lower and upper boundaries of this box.
     * Please note that this method only copies the values from the given objects.
     *
     * @param {Vector3} min - The lower boundary of the box.
     * @param {Vector3} max - The upper boundary of the box.
     * @return {Box3} A reference to this bounding box.
     */
    set(min, max) {
      this.min.copy(min);
      this.max.copy(max);
      return this;
    }
    /**
     * Sets the upper and lower bounds of this box so it encloses the position data
     * in the given array.
     *
     * @param {Array<number>} array - An array holding 3D position data.
     * @return {Box3} A reference to this bounding box.
     */
    setFromArray(array) {
      this.makeEmpty();
      for (let i = 0, il = array.length; i < il; i += 3) {
        this.expandByPoint(_vector$b.fromArray(array, i));
      }
      return this;
    }
    /**
     * Sets the upper and lower bounds of this box so it encloses the position data
     * in the given buffer attribute.
     *
     * @param {BufferAttribute} attribute - A buffer attribute holding 3D position data.
     * @return {Box3} A reference to this bounding box.
     */
    setFromBufferAttribute(attribute) {
      this.makeEmpty();
      for (let i = 0, il = attribute.count; i < il; i++) {
        this.expandByPoint(_vector$b.fromBufferAttribute(attribute, i));
      }
      return this;
    }
    /**
     * Sets the upper and lower bounds of this box so it encloses the position data
     * in the given array.
     *
     * @param {Array<Vector3>} points - An array holding 3D position data as instances of {@link Vector3}.
     * @return {Box3} A reference to this bounding box.
     */
    setFromPoints(points) {
      this.makeEmpty();
      for (let i = 0, il = points.length; i < il; i++) {
        this.expandByPoint(points[i]);
      }
      return this;
    }
    /**
     * Centers this box on the given center vector and sets this box's width, height and
     * depth to the given size values.
     *
     * @param {Vector3} center - The center of the box.
     * @param {Vector3} size - The x, y and z dimensions of the box.
     * @return {Box3} A reference to this bounding box.
     */
    setFromCenterAndSize(center, size) {
      const halfSize = _vector$b.copy(size).multiplyScalar(0.5);
      this.min.copy(center).sub(halfSize);
      this.max.copy(center).add(halfSize);
      return this;
    }
    /**
     * Computes the world-axis-aligned bounding box for the given 3D object
     * (including its children), accounting for the object's, and children's,
     * world transforms. The function may result in a larger box than strictly necessary.
     *
     * @param {Object3D} object - The 3D object to compute the bounding box for.
     * @param {boolean} [precise=false] - If set to `true`, the method computes the smallest
     * world-axis-aligned bounding box at the expense of more computation.
     * @return {Box3} A reference to this bounding box.
     */
    setFromObject(object, precise = false) {
      this.makeEmpty();
      return this.expandByObject(object, precise);
    }
    /**
     * Returns a new box with copied values from this instance.
     *
     * @return {Box3} A clone of this instance.
     */
    clone() {
      return new this.constructor().copy(this);
    }
    /**
     * Copies the values of the given box to this instance.
     *
     * @param {Box3} box - The box to copy.
     * @return {Box3} A reference to this bounding box.
     */
    copy(box) {
      this.min.copy(box.min);
      this.max.copy(box.max);
      return this;
    }
    /**
     * Makes this box empty which means in encloses a zero space in 3D.
     *
     * @return {Box3} A reference to this bounding box.
     */
    makeEmpty() {
      this.min.x = this.min.y = this.min.z = Infinity;
      this.max.x = this.max.y = this.max.z = -Infinity;
      return this;
    }
    /**
     * Returns true if this box includes zero points within its bounds.
     * Note that a box with equal lower and upper bounds still includes one
     * point, the one both bounds share.
     *
     * @return {boolean} Whether this box is empty or not.
     */
    isEmpty() {
      return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
    }
    /**
     * Returns the center point of this box.
     *
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {Vector3} The center point.
     */
    getCenter(target) {
      return this.isEmpty() ? target.set(0, 0, 0) : target.addVectors(this.min, this.max).multiplyScalar(0.5);
    }
    /**
     * Returns the dimensions of this box.
     *
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {Vector3} The size.
     */
    getSize(target) {
      return this.isEmpty() ? target.set(0, 0, 0) : target.subVectors(this.max, this.min);
    }
    /**
     * Expands the boundaries of this box to include the given point.
     *
     * @param {Vector3} point - The point that should be included by the bounding box.
     * @return {Box3} A reference to this bounding box.
     */
    expandByPoint(point) {
      this.min.min(point);
      this.max.max(point);
      return this;
    }
    /**
     * Expands this box equilaterally by the given vector. The width of this
     * box will be expanded by the x component of the vector in both
     * directions. The height of this box will be expanded by the y component of
     * the vector in both directions. The depth of this box will be
     * expanded by the z component of the vector in both directions.
     *
     * @param {Vector3} vector - The vector that should expand the bounding box.
     * @return {Box3} A reference to this bounding box.
     */
    expandByVector(vector) {
      this.min.sub(vector);
      this.max.add(vector);
      return this;
    }
    /**
     * Expands each dimension of the box by the given scalar. If negative, the
     * dimensions of the box will be contracted.
     *
     * @param {number} scalar - The scalar value that should expand the bounding box.
     * @return {Box3} A reference to this bounding box.
     */
    expandByScalar(scalar) {
      this.min.addScalar(-scalar);
      this.max.addScalar(scalar);
      return this;
    }
    /**
     * Expands the boundaries of this box to include the given 3D object and
     * its children, accounting for the object's, and children's, world
     * transforms. The function may result in a larger box than strictly
     * necessary (unless the precise parameter is set to true).
     *
     * @param {Object3D} object - The 3D object that should expand the bounding box.
     * @param {boolean} precise - If set to `true`, the method expands the bounding box
     * as little as necessary at the expense of more computation.
     * @return {Box3} A reference to this bounding box.
     */
    expandByObject(object, precise = false) {
      object.updateWorldMatrix(false, false);
      const geometry = object.geometry;
      if (geometry !== void 0) {
        const positionAttribute = geometry.getAttribute("position");
        if (precise === true && positionAttribute !== void 0 && object.isInstancedMesh !== true) {
          for (let i = 0, l = positionAttribute.count; i < l; i++) {
            if (object.isMesh === true) {
              object.getVertexPosition(i, _vector$b);
            } else {
              _vector$b.fromBufferAttribute(positionAttribute, i);
            }
            _vector$b.applyMatrix4(object.matrixWorld);
            this.expandByPoint(_vector$b);
          }
        } else {
          if (object.boundingBox !== void 0) {
            if (object.boundingBox === null) {
              object.computeBoundingBox();
            }
            _box$4.copy(object.boundingBox);
          } else {
            if (geometry.boundingBox === null) {
              geometry.computeBoundingBox();
            }
            _box$4.copy(geometry.boundingBox);
          }
          _box$4.applyMatrix4(object.matrixWorld);
          this.union(_box$4);
        }
      }
      const children = object.children;
      for (let i = 0, l = children.length; i < l; i++) {
        this.expandByObject(children[i], precise);
      }
      return this;
    }
    /**
     * Returns `true` if the given point lies within or on the boundaries of this box.
     *
     * @param {Vector3} point - The point to test.
     * @return {boolean} Whether the bounding box contains the given point or not.
     */
    containsPoint(point) {
      return point.x >= this.min.x && point.x <= this.max.x && point.y >= this.min.y && point.y <= this.max.y && point.z >= this.min.z && point.z <= this.max.z;
    }
    /**
     * Returns `true` if this bounding box includes the entirety of the given bounding box.
     * If this box and the given one are identical, this function also returns `true`.
     *
     * @param {Box3} box - The bounding box to test.
     * @return {boolean} Whether the bounding box contains the given bounding box or not.
     */
    containsBox(box) {
      return this.min.x <= box.min.x && box.max.x <= this.max.x && this.min.y <= box.min.y && box.max.y <= this.max.y && this.min.z <= box.min.z && box.max.z <= this.max.z;
    }
    /**
     * Returns a point as a proportion of this box's width, height and depth.
     *
     * @param {Vector3} point - A point in 3D space.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {Vector3} A point as a proportion of this box's width, height and depth.
     */
    getParameter(point, target) {
      return target.set(
        (point.x - this.min.x) / (this.max.x - this.min.x),
        (point.y - this.min.y) / (this.max.y - this.min.y),
        (point.z - this.min.z) / (this.max.z - this.min.z)
      );
    }
    /**
     * Returns `true` if the given bounding box intersects with this bounding box.
     *
     * @param {Box3} box - The bounding box to test.
     * @return {boolean} Whether the given bounding box intersects with this bounding box.
     */
    intersectsBox(box) {
      return box.max.x >= this.min.x && box.min.x <= this.max.x && box.max.y >= this.min.y && box.min.y <= this.max.y && box.max.z >= this.min.z && box.min.z <= this.max.z;
    }
    /**
     * Returns `true` if the given bounding sphere intersects with this bounding box.
     *
     * @param {Sphere} sphere - The bounding sphere to test.
     * @return {boolean} Whether the given bounding sphere intersects with this bounding box.
     */
    intersectsSphere(sphere) {
      this.clampPoint(sphere.center, _vector$b);
      return _vector$b.distanceToSquared(sphere.center) <= sphere.radius * sphere.radius;
    }
    /**
     * Returns `true` if the given plane intersects with this bounding box.
     *
     * @param {Plane} plane - The plane to test.
     * @return {boolean} Whether the given plane intersects with this bounding box.
     */
    intersectsPlane(plane) {
      let min, max;
      if (plane.normal.x > 0) {
        min = plane.normal.x * this.min.x;
        max = plane.normal.x * this.max.x;
      } else {
        min = plane.normal.x * this.max.x;
        max = plane.normal.x * this.min.x;
      }
      if (plane.normal.y > 0) {
        min += plane.normal.y * this.min.y;
        max += plane.normal.y * this.max.y;
      } else {
        min += plane.normal.y * this.max.y;
        max += plane.normal.y * this.min.y;
      }
      if (plane.normal.z > 0) {
        min += plane.normal.z * this.min.z;
        max += plane.normal.z * this.max.z;
      } else {
        min += plane.normal.z * this.max.z;
        max += plane.normal.z * this.min.z;
      }
      return min <= -plane.constant && max >= -plane.constant;
    }
    /**
     * Returns `true` if the given triangle intersects with this bounding box.
     *
     * @param {Triangle} triangle - The triangle to test.
     * @return {boolean} Whether the given triangle intersects with this bounding box.
     */
    intersectsTriangle(triangle3) {
      if (this.isEmpty()) {
        return false;
      }
      this.getCenter(_center);
      _extents.subVectors(this.max, _center);
      _v0$2.subVectors(triangle3.a, _center);
      _v1$7.subVectors(triangle3.b, _center);
      _v2$4.subVectors(triangle3.c, _center);
      _f0.subVectors(_v1$7, _v0$2);
      _f1.subVectors(_v2$4, _v1$7);
      _f2.subVectors(_v0$2, _v2$4);
      let axes = [
        0,
        -_f0.z,
        _f0.y,
        0,
        -_f1.z,
        _f1.y,
        0,
        -_f2.z,
        _f2.y,
        _f0.z,
        0,
        -_f0.x,
        _f1.z,
        0,
        -_f1.x,
        _f2.z,
        0,
        -_f2.x,
        -_f0.y,
        _f0.x,
        0,
        -_f1.y,
        _f1.x,
        0,
        -_f2.y,
        _f2.x,
        0
      ];
      if (!satForAxes(axes, _v0$2, _v1$7, _v2$4, _extents)) {
        return false;
      }
      axes = [1, 0, 0, 0, 1, 0, 0, 0, 1];
      if (!satForAxes(axes, _v0$2, _v1$7, _v2$4, _extents)) {
        return false;
      }
      _triangleNormal.crossVectors(_f0, _f1);
      axes = [_triangleNormal.x, _triangleNormal.y, _triangleNormal.z];
      return satForAxes(axes, _v0$2, _v1$7, _v2$4, _extents);
    }
    /**
     * Clamps the given point within the bounds of this box.
     *
     * @param {Vector3} point - The point to clamp.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {Vector3} The clamped point.
     */
    clampPoint(point, target) {
      return target.copy(point).clamp(this.min, this.max);
    }
    /**
     * Returns the euclidean distance from any edge of this box to the specified point. If
     * the given point lies inside of this box, the distance will be `0`.
     *
     * @param {Vector3} point - The point to compute the distance to.
     * @return {number} The euclidean distance.
     */
    distanceToPoint(point) {
      return this.clampPoint(point, _vector$b).distanceTo(point);
    }
    /**
     * Returns a bounding sphere that encloses this bounding box.
     *
     * @param {Sphere} target - The target sphere that is used to store the method's result.
     * @return {Sphere} The bounding sphere that encloses this bounding box.
     */
    getBoundingSphere(target) {
      if (this.isEmpty()) {
        target.makeEmpty();
      } else {
        this.getCenter(target.center);
        target.radius = this.getSize(_vector$b).length() * 0.5;
      }
      return target;
    }
    /**
     * Computes the intersection of this bounding box and the given one, setting the upper
     * bound of this box to the lesser of the two boxes' upper bounds and the
     * lower bound of this box to the greater of the two boxes' lower bounds. If
     * there's no overlap, makes this box empty.
     *
     * @param {Box3} box - The bounding box to intersect with.
     * @return {Box3} A reference to this bounding box.
     */
    intersect(box) {
      this.min.max(box.min);
      this.max.min(box.max);
      if (this.isEmpty()) this.makeEmpty();
      return this;
    }
    /**
     * Computes the union of this box and another and the given one, setting the upper
     * bound of this box to the greater of the two boxes' upper bounds and the
     * lower bound of this box to the lesser of the two boxes' lower bounds.
     *
     * @param {Box3} box - The bounding box that will be unioned with this instance.
     * @return {Box3} A reference to this bounding box.
     */
    union(box) {
      this.min.min(box.min);
      this.max.max(box.max);
      return this;
    }
    /**
     * Transforms this bounding box by the given 4x4 transformation matrix.
     *
     * @param {Matrix4} matrix - The transformation matrix.
     * @return {Box3} A reference to this bounding box.
     */
    applyMatrix4(matrix) {
      if (this.isEmpty()) return this;
      _points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix);
      _points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix);
      _points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix);
      _points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix);
      _points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix);
      _points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix);
      _points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix);
      _points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix);
      this.setFromPoints(_points);
      return this;
    }
    /**
     * Adds the given offset to both the upper and lower bounds of this bounding box,
     * effectively moving it in 3D space.
     *
     * @param {Vector3} offset - The offset that should be used to translate the bounding box.
     * @return {Box3} A reference to this bounding box.
     */
    translate(offset) {
      this.min.add(offset);
      this.max.add(offset);
      return this;
    }
    /**
     * Returns `true` if this bounding box is equal with the given one.
     *
     * @param {Box3} box - The box to test for equality.
     * @return {boolean} Whether this bounding box is equal with the given one.
     */
    equals(box) {
      return box.min.equals(this.min) && box.max.equals(this.max);
    }
    /**
     * Returns a serialized structure of the bounding box.
     *
     * @return {Object} Serialized structure with fields representing the object state.
     */
    toJSON() {
      return {
        min: this.min.toArray(),
        max: this.max.toArray()
      };
    }
    /**
     * Returns a serialized structure of the bounding box.
     *
     * @param {Object} json - The serialized json to set the box from.
     * @return {Box3} A reference to this bounding box.
     */
    fromJSON(json) {
      this.min.fromArray(json.min);
      this.max.fromArray(json.max);
      return this;
    }
  }
  const _points = [
    /* @__PURE__ */ new Vector3(),
    /* @__PURE__ */ new Vector3(),
    /* @__PURE__ */ new Vector3(),
    /* @__PURE__ */ new Vector3(),
    /* @__PURE__ */ new Vector3(),
    /* @__PURE__ */ new Vector3(),
    /* @__PURE__ */ new Vector3(),
    /* @__PURE__ */ new Vector3()
  ];
  const _vector$b = /* @__PURE__ */ new Vector3();
  const _box$4 = /* @__PURE__ */ new Box3();
  const _v0$2 = /* @__PURE__ */ new Vector3();
  const _v1$7 = /* @__PURE__ */ new Vector3();
  const _v2$4 = /* @__PURE__ */ new Vector3();
  const _f0 = /* @__PURE__ */ new Vector3();
  const _f1 = /* @__PURE__ */ new Vector3();
  const _f2 = /* @__PURE__ */ new Vector3();
  const _center = /* @__PURE__ */ new Vector3();
  const _extents = /* @__PURE__ */ new Vector3();
  const _triangleNormal = /* @__PURE__ */ new Vector3();
  const _testAxis = /* @__PURE__ */ new Vector3();
  function satForAxes(axes, v0, v1, v2, extents) {
    for (let i = 0, j = axes.length - 3; i <= j; i += 3) {
      _testAxis.fromArray(axes, i);
      const r = extents.x * Math.abs(_testAxis.x) + extents.y * Math.abs(_testAxis.y) + extents.z * Math.abs(_testAxis.z);
      const p0 = v0.dot(_testAxis);
      const p1 = v1.dot(_testAxis);
      const p2 = v2.dot(_testAxis);
      if (Math.max(-Math.max(p0, p1, p2), Math.min(p0, p1, p2)) > r) {
        return false;
      }
    }
    return true;
  }
  const _box$3 = /* @__PURE__ */ new Box3();
  const _v1$6 = /* @__PURE__ */ new Vector3();
  const _v2$3 = /* @__PURE__ */ new Vector3();
  class Sphere {
    /**
     * Constructs a new sphere.
     *
     * @param {Vector3} [center=(0,0,0)] - The center of the sphere
     * @param {number} [radius=-1] - The radius of the sphere.
     */
    constructor(center = new Vector3(), radius = -1) {
      this.isSphere = true;
      this.center = center;
      this.radius = radius;
    }
    /**
     * Sets the sphere's components by copying the given values.
     *
     * @param {Vector3} center - The center.
     * @param {number} radius - The radius.
     * @return {Sphere} A reference to this sphere.
     */
    set(center, radius) {
      this.center.copy(center);
      this.radius = radius;
      return this;
    }
    /**
     * Computes the minimum bounding sphere for list of points.
     * If the optional center point is given, it is used as the sphere's
     * center. Otherwise, the center of the axis-aligned bounding box
     * encompassing the points is calculated.
     *
     * @param {Array<Vector3>} points - A list of points in 3D space.
     * @param {Vector3} [optionalCenter] - The center of the sphere.
     * @return {Sphere} A reference to this sphere.
     */
    setFromPoints(points, optionalCenter) {
      const center = this.center;
      if (optionalCenter !== void 0) {
        center.copy(optionalCenter);
      } else {
        _box$3.setFromPoints(points).getCenter(center);
      }
      let maxRadiusSq = 0;
      for (let i = 0, il = points.length; i < il; i++) {
        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]));
      }
      this.radius = Math.sqrt(maxRadiusSq);
      return this;
    }
    /**
     * Copies the values of the given sphere to this instance.
     *
     * @param {Sphere} sphere - The sphere to copy.
     * @return {Sphere} A reference to this sphere.
     */
    copy(sphere) {
      this.center.copy(sphere.center);
      this.radius = sphere.radius;
      return this;
    }
    /**
     * Returns `true` if the sphere is empty (the radius set to a negative number).
     *
     * Spheres with a radius of `0` contain only their center point and are not
     * considered to be empty.
     *
     * @return {boolean} Whether this sphere is empty or not.
     */
    isEmpty() {
      return this.radius < 0;
    }
    /**
     * Makes this sphere empty which means in encloses a zero space in 3D.
     *
     * @return {Sphere} A reference to this sphere.
     */
    makeEmpty() {
      this.center.set(0, 0, 0);
      this.radius = -1;
      return this;
    }
    /**
     * Returns `true` if this sphere contains the given point inclusive of
     * the surface of the sphere.
     *
     * @param {Vector3} point - The point to check.
     * @return {boolean} Whether this sphere contains the given point or not.
     */
    containsPoint(point) {
      return point.distanceToSquared(this.center) <= this.radius * this.radius;
    }
    /**
     * Returns the closest distance from the boundary of the sphere to the
     * given point. If the sphere contains the point, the distance will
     * be negative.
     *
     * @param {Vector3} point - The point to compute the distance to.
     * @return {number} The distance to the point.
     */
    distanceToPoint(point) {
      return point.distanceTo(this.center) - this.radius;
    }
    /**
     * Returns `true` if this sphere intersects with the given one.
     *
     * @param {Sphere} sphere - The sphere to test.
     * @return {boolean} Whether this sphere intersects with the given one or not.
     */
    intersectsSphere(sphere) {
      const radiusSum = this.radius + sphere.radius;
      return sphere.center.distanceToSquared(this.center) <= radiusSum * radiusSum;
    }
    /**
     * Returns `true` if this sphere intersects with the given box.
     *
     * @param {Box3} box - The box to test.
     * @return {boolean} Whether this sphere intersects with the given box or not.
     */
    intersectsBox(box) {
      return box.intersectsSphere(this);
    }
    /**
     * Returns `true` if this sphere intersects with the given plane.
     *
     * @param {Plane} plane - The plane to test.
     * @return {boolean} Whether this sphere intersects with the given plane or not.
     */
    intersectsPlane(plane) {
      return Math.abs(plane.distanceToPoint(this.center)) <= this.radius;
    }
    /**
     * Clamps a point within the sphere. If the point is outside the sphere, it
     * will clamp it to the closest point on the edge of the sphere. Points
     * already inside the sphere will not be affected.
     *
     * @param {Vector3} point - The plane to clamp.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {Vector3} The clamped point.
     */
    clampPoint(point, target) {
      const deltaLengthSq = this.center.distanceToSquared(point);
      target.copy(point);
      if (deltaLengthSq > this.radius * this.radius) {
        target.sub(this.center).normalize();
        target.multiplyScalar(this.radius).add(this.center);
      }
      return target;
    }
    /**
     * Returns a bounding box that encloses this sphere.
     *
     * @param {Box3} target - The target box that is used to store the method's result.
     * @return {Box3} The bounding box that encloses this sphere.
     */
    getBoundingBox(target) {
      if (this.isEmpty()) {
        target.makeEmpty();
        return target;
      }
      target.set(this.center, this.center);
      target.expandByScalar(this.radius);
      return target;
    }
    /**
     * Transforms this sphere with the given 4x4 transformation matrix.
     *
     * @param {Matrix4} matrix - The transformation matrix.
     * @return {Sphere} A reference to this sphere.
     */
    applyMatrix4(matrix) {
      this.center.applyMatrix4(matrix);
      this.radius = this.radius * matrix.getMaxScaleOnAxis();
      return this;
    }
    /**
     * Translates the sphere's center by the given offset.
     *
     * @param {Vector3} offset - The offset.
     * @return {Sphere} A reference to this sphere.
     */
    translate(offset) {
      this.center.add(offset);
      return this;
    }
    /**
     * Expands the boundaries of this sphere to include the given point.
     *
     * @param {Vector3} point - The point to include.
     * @return {Sphere} A reference to this sphere.
     */
    expandByPoint(point) {
      if (this.isEmpty()) {
        this.center.copy(point);
        this.radius = 0;
        return this;
      }
      _v1$6.subVectors(point, this.center);
      const lengthSq = _v1$6.lengthSq();
      if (lengthSq > this.radius * this.radius) {
        const length = Math.sqrt(lengthSq);
        const delta = (length - this.radius) * 0.5;
        this.center.addScaledVector(_v1$6, delta / length);
        this.radius += delta;
      }
      return this;
    }
    /**
     * Expands this sphere to enclose both the original sphere and the given sphere.
     *
     * @param {Sphere} sphere - The sphere to include.
     * @return {Sphere} A reference to this sphere.
     */
    union(sphere) {
      if (sphere.isEmpty()) {
        return this;
      }
      if (this.isEmpty()) {
        this.copy(sphere);
        return this;
      }
      if (this.center.equals(sphere.center) === true) {
        this.radius = Math.max(this.radius, sphere.radius);
      } else {
        _v2$3.subVectors(sphere.center, this.center).setLength(sphere.radius);
        this.expandByPoint(_v1$6.copy(sphere.center).add(_v2$3));
        this.expandByPoint(_v1$6.copy(sphere.center).sub(_v2$3));
      }
      return this;
    }
    /**
     * Returns `true` if this sphere is equal with the given one.
     *
     * @param {Sphere} sphere - The sphere to test for equality.
     * @return {boolean} Whether this bounding sphere is equal with the given one.
     */
    equals(sphere) {
      return sphere.center.equals(this.center) && sphere.radius === this.radius;
    }
    /**
     * Returns a new sphere with copied values from this instance.
     *
     * @return {Sphere} A clone of this instance.
     */
    clone() {
      return new this.constructor().copy(this);
    }
    /**
     * Returns a serialized structure of the bounding sphere.
     *
     * @return {Object} Serialized structure with fields representing the object state.
     */
    toJSON() {
      return {
        radius: this.radius,
        center: this.center.toArray()
      };
    }
    /**
     * Returns a serialized structure of the bounding sphere.
     *
     * @param {Object} json - The serialized json to set the sphere from.
     * @return {Box3} A reference to this bounding sphere.
     */
    fromJSON(json) {
      this.radius = json.radius;
      this.center.fromArray(json.center);
      return this;
    }
  }
  const _vector$a = /* @__PURE__ */ new Vector3();
  const _segCenter = /* @__PURE__ */ new Vector3();
  const _segDir = /* @__PURE__ */ new Vector3();
  const _diff = /* @__PURE__ */ new Vector3();
  const _edge1 = /* @__PURE__ */ new Vector3();
  const _edge2 = /* @__PURE__ */ new Vector3();
  const _normal$1 = /* @__PURE__ */ new Vector3();
  class Ray {
    /**
     * Constructs a new ray.
     *
     * @param {Vector3} [origin=(0,0,0)] - The origin of the ray.
     * @param {Vector3} [direction=(0,0,-1)] - The (normalized) direction of the ray.
     */
    constructor(origin = new Vector3(), direction = new Vector3(0, 0, -1)) {
      this.origin = origin;
      this.direction = direction;
    }
    /**
     * Sets the ray's components by copying the given values.
     *
     * @param {Vector3} origin - The origin.
     * @param {Vector3} direction - The direction.
     * @return {Ray} A reference to this ray.
     */
    set(origin, direction) {
      this.origin.copy(origin);
      this.direction.copy(direction);
      return this;
    }
    /**
     * Copies the values of the given ray to this instance.
     *
     * @param {Ray} ray - The ray to copy.
     * @return {Ray} A reference to this ray.
     */
    copy(ray) {
      this.origin.copy(ray.origin);
      this.direction.copy(ray.direction);
      return this;
    }
    /**
     * Returns a vector that is located at a given distance along this ray.
     *
     * @param {number} t - The distance along the ray to retrieve a position for.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {Vector3} A position on the ray.
     */
    at(t, target) {
      return target.copy(this.origin).addScaledVector(this.direction, t);
    }
    /**
     * Adjusts the direction of the ray to point at the given vector in world space.
     *
     * @param {Vector3} v - The target position.
     * @return {Ray} A reference to this ray.
     */
    lookAt(v) {
      this.direction.copy(v).sub(this.origin).normalize();
      return this;
    }
    /**
     * Shift the origin of this ray along its direction by the given distance.
     *
     * @param {number} t - The distance along the ray to interpolate.
     * @return {Ray} A reference to this ray.
     */
    recast(t) {
      this.origin.copy(this.at(t, _vector$a));
      return this;
    }
    /**
     * Returns the point along this ray that is closest to the given point.
     *
     * @param {Vector3} point - A point in 3D space to get the closet location on the ray for.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {Vector3} The closest point on this ray.
     */
    closestPointToPoint(point, target) {
      target.subVectors(point, this.origin);
      const directionDistance = target.dot(this.direction);
      if (directionDistance < 0) {
        return target.copy(this.origin);
      }
      return target.copy(this.origin).addScaledVector(this.direction, directionDistance);
    }
    /**
     * Returns the distance of the closest approach between this ray and the given point.
     *
     * @param {Vector3} point - A point in 3D space to compute the distance to.
     * @return {number} The distance.
     */
    distanceToPoint(point) {
      return Math.sqrt(this.distanceSqToPoint(point));
    }
    /**
     * Returns the squared distance of the closest approach between this ray and the given point.
     *
     * @param {Vector3} point - A point in 3D space to compute the distance to.
     * @return {number} The squared distance.
     */
    distanceSqToPoint(point) {
      const directionDistance = _vector$a.subVectors(point, this.origin).dot(this.direction);
      if (directionDistance < 0) {
        return this.origin.distanceToSquared(point);
      }
      _vector$a.copy(this.origin).addScaledVector(this.direction, directionDistance);
      return _vector$a.distanceToSquared(point);
    }
    /**
     * Returns the squared distance between this ray and the given line segment.
     *
     * @param {Vector3} v0 - The start point of the line segment.
     * @param {Vector3} v1 - The end point of the line segment.
     * @param {Vector3} [optionalPointOnRay] - When provided, it receives the point on this ray that is closest to the segment.
     * @param {Vector3} [optionalPointOnSegment] - When provided, it receives the point on the line segment that is closest to this ray.
     * @return {number} The squared distance.
     */
    distanceSqToSegment(v0, v1, optionalPointOnRay, optionalPointOnSegment) {
      _segCenter.copy(v0).add(v1).multiplyScalar(0.5);
      _segDir.copy(v1).sub(v0).normalize();
      _diff.copy(this.origin).sub(_segCenter);
      const segExtent = v0.distanceTo(v1) * 0.5;
      const a01 = -this.direction.dot(_segDir);
      const b0 = _diff.dot(this.direction);
      const b1 = -_diff.dot(_segDir);
      const c = _diff.lengthSq();
      const det = Math.abs(1 - a01 * a01);
      let s0, s1, sqrDist, extDet;
      if (det > 0) {
        s0 = a01 * b1 - b0;
        s1 = a01 * b0 - b1;
        extDet = segExtent * det;
        if (s0 >= 0) {
          if (s1 >= -extDet) {
            if (s1 <= extDet) {
              const invDet = 1 / det;
              s0 *= invDet;
              s1 *= invDet;
              sqrDist = s0 * (s0 + a01 * s1 + 2 * b0) + s1 * (a01 * s0 + s1 + 2 * b1) + c;
            } else {
              s1 = segExtent;
              s0 = Math.max(0, -(a01 * s1 + b0));
              sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
            }
          } else {
            s1 = -segExtent;
            s0 = Math.max(0, -(a01 * s1 + b0));
            sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
          }
        } else {
          if (s1 <= -extDet) {
            s0 = Math.max(0, -(-a01 * segExtent + b0));
            s1 = s0 > 0 ? -segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
            sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
          } else if (s1 <= extDet) {
            s0 = 0;
            s1 = Math.min(Math.max(-segExtent, -b1), segExtent);
            sqrDist = s1 * (s1 + 2 * b1) + c;
          } else {
            s0 = Math.max(0, -(a01 * segExtent + b0));
            s1 = s0 > 0 ? segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
            sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
          }
        }
      } else {
        s1 = a01 > 0 ? -segExtent : segExtent;
        s0 = Math.max(0, -(a01 * s1 + b0));
        sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c;
      }
      if (optionalPointOnRay) {
        optionalPointOnRay.copy(this.origin).addScaledVector(this.direction, s0);
      }
      if (optionalPointOnSegment) {
        optionalPointOnSegment.copy(_segCenter).addScaledVector(_segDir, s1);
      }
      return sqrDist;
    }
    /**
     * Intersects this ray with the given sphere, returning the intersection
     * point or `null` if there is no intersection.
     *
     * @param {Sphere} sphere - The sphere to intersect.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {?Vector3} The intersection point.
     */
    intersectSphere(sphere, target) {
      _vector$a.subVectors(sphere.center, this.origin);
      const tca = _vector$a.dot(this.direction);
      const d2 = _vector$a.dot(_vector$a) - tca * tca;
      const radius2 = sphere.radius * sphere.radius;
      if (d2 > radius2) return null;
      const thc = Math.sqrt(radius2 - d2);
      const t0 = tca - thc;
      const t1 = tca + thc;
      if (t1 < 0) return null;
      if (t0 < 0) return this.at(t1, target);
      return this.at(t0, target);
    }
    /**
     * Returns `true` if this ray intersects with the given sphere.
     *
     * @param {Sphere} sphere - The sphere to intersect.
     * @return {boolean} Whether this ray intersects with the given sphere or not.
     */
    intersectsSphere(sphere) {
      if (sphere.radius < 0) return false;
      return this.distanceSqToPoint(sphere.center) <= sphere.radius * sphere.radius;
    }
    /**
     * Computes the distance from the ray's origin to the given plane. Returns `null` if the ray
     * does not intersect with the plane.
     *
     * @param {Plane} plane - The plane to compute the distance to.
     * @return {?number} Whether this ray intersects with the given sphere or not.
     */
    distanceToPlane(plane) {
      const denominator = plane.normal.dot(this.direction);
      if (denominator === 0) {
        if (plane.distanceToPoint(this.origin) === 0) {
          return 0;
        }
        return null;
      }
      const t = -(this.origin.dot(plane.normal) + plane.constant) / denominator;
      return t >= 0 ? t : null;
    }
    /**
     * Intersects this ray with the given plane, returning the intersection
     * point or `null` if there is no intersection.
     *
     * @param {Plane} plane - The plane to intersect.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {?Vector3} The intersection point.
     */
    intersectPlane(plane, target) {
      const t = this.distanceToPlane(plane);
      if (t === null) {
        return null;
      }
      return this.at(t, target);
    }
    /**
     * Returns `true` if this ray intersects with the given plane.
     *
     * @param {Plane} plane - The plane to intersect.
     * @return {boolean} Whether this ray intersects with the given plane or not.
     */
    intersectsPlane(plane) {
      const distToPoint = plane.distanceToPoint(this.origin);
      if (distToPoint === 0) {
        return true;
      }
      const denominator = plane.normal.dot(this.direction);
      if (denominator * distToPoint < 0) {
        return true;
      }
      return false;
    }
    /**
     * Intersects this ray with the given bounding box, returning the intersection
     * point or `null` if there is no intersection.
     *
     * @param {Box3} box - The box to intersect.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {?Vector3} The intersection point.
     */
    intersectBox(box, target) {
      let tmin, tmax, tymin, tymax, tzmin, tzmax;
      const invdirx = 1 / this.direction.x, invdiry = 1 / this.direction.y, invdirz = 1 / this.direction.z;
      const origin = this.origin;
      if (invdirx >= 0) {
        tmin = (box.min.x - origin.x) * invdirx;
        tmax = (box.max.x - origin.x) * invdirx;
      } else {
        tmin = (box.max.x - origin.x) * invdirx;
        tmax = (box.min.x - origin.x) * invdirx;
      }
      if (invdiry >= 0) {
        tymin = (box.min.y - origin.y) * invdiry;
        tymax = (box.max.y - origin.y) * invdiry;
      } else {
        tymin = (box.max.y - origin.y) * invdiry;
        tymax = (box.min.y - origin.y) * invdiry;
      }
      if (tmin > tymax || tymin > tmax) return null;
      if (tymin > tmin || isNaN(tmin)) tmin = tymin;
      if (tymax < tmax || isNaN(tmax)) tmax = tymax;
      if (invdirz >= 0) {
        tzmin = (box.min.z - origin.z) * invdirz;
        tzmax = (box.max.z - origin.z) * invdirz;
      } else {
        tzmin = (box.max.z - origin.z) * invdirz;
        tzmax = (box.min.z - origin.z) * invdirz;
      }
      if (tmin > tzmax || tzmin > tmax) return null;
      if (tzmin > tmin || tmin !== tmin) tmin = tzmin;
      if (tzmax < tmax || tmax !== tmax) tmax = tzmax;
      if (tmax < 0) return null;
      return this.at(tmin >= 0 ? tmin : tmax, target);
    }
    /**
     * Returns `true` if this ray intersects with the given box.
     *
     * @param {Box3} box - The box to intersect.
     * @return {boolean} Whether this ray intersects with the given box or not.
     */
    intersectsBox(box) {
      return this.intersectBox(box, _vector$a) !== null;
    }
    /**
     * Intersects this ray with the given triangle, returning the intersection
     * point or `null` if there is no intersection.
     *
     * @param {Vector3} a - The first vertex of the triangle.
     * @param {Vector3} b - The second vertex of the triangle.
     * @param {Vector3} c - The third vertex of the triangle.
     * @param {boolean} backfaceCulling - Whether to use backface culling or not.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {?Vector3} The intersection point.
     */
    intersectTriangle(a, b, c, backfaceCulling, target) {
      _edge1.subVectors(b, a);
      _edge2.subVectors(c, a);
      _normal$1.crossVectors(_edge1, _edge2);
      let DdN = this.direction.dot(_normal$1);
      let sign;
      if (DdN > 0) {
        if (backfaceCulling) return null;
        sign = 1;
      } else if (DdN < 0) {
        sign = -1;
        DdN = -DdN;
      } else {
        return null;
      }
      _diff.subVectors(this.origin, a);
      const DdQxE2 = sign * this.direction.dot(_edge2.crossVectors(_diff, _edge2));
      if (DdQxE2 < 0) {
        return null;
      }
      const DdE1xQ = sign * this.direction.dot(_edge1.cross(_diff));
      if (DdE1xQ < 0) {
        return null;
      }
      if (DdQxE2 + DdE1xQ > DdN) {
        return null;
      }
      const QdN = -sign * _diff.dot(_normal$1);
      if (QdN < 0) {
        return null;
      }
      return this.at(QdN / DdN, target);
    }
    /**
     * Transforms this ray with the given 4x4 transformation matrix.
     *
     * @param {Matrix4} matrix4 - The transformation matrix.
     * @return {Ray} A reference to this ray.
     */
    applyMatrix4(matrix4) {
      this.origin.applyMatrix4(matrix4);
      this.direction.transformDirection(matrix4);
      return this;
    }
    /**
     * Returns `true` if this ray is equal with the given one.
     *
     * @param {Ray} ray - The ray to test for equality.
     * @return {boolean} Whether this ray is equal with the given one.
     */
    equals(ray) {
      return ray.origin.equals(this.origin) && ray.direction.equals(this.direction);
    }
    /**
     * Returns a new ray with copied values from this instance.
     *
     * @return {Ray} A clone of this instance.
     */
    clone() {
      return new this.constructor().copy(this);
    }
  }
  class Matrix4 {
    /**
     * Constructs a new 4x4 matrix. The arguments are supposed to be
     * in row-major order. If no arguments are provided, the constructor
     * initializes the matrix as an identity matrix.
     *
     * @param {number} [n11] - 1-1 matrix element.
     * @param {number} [n12] - 1-2 matrix element.
     * @param {number} [n13] - 1-3 matrix element.
     * @param {number} [n14] - 1-4 matrix element.
     * @param {number} [n21] - 2-1 matrix element.
     * @param {number} [n22] - 2-2 matrix element.
     * @param {number} [n23] - 2-3 matrix element.
     * @param {number} [n24] - 2-4 matrix element.
     * @param {number} [n31] - 3-1 matrix element.
     * @param {number} [n32] - 3-2 matrix element.
     * @param {number} [n33] - 3-3 matrix element.
     * @param {number} [n34] - 3-4 matrix element.
     * @param {number} [n41] - 4-1 matrix element.
     * @param {number} [n42] - 4-2 matrix element.
     * @param {number} [n43] - 4-3 matrix element.
     * @param {number} [n44] - 4-4 matrix element.
     */
    constructor(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
      Matrix4.prototype.isMatrix4 = true;
      this.elements = [
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      ];
      if (n11 !== void 0) {
        this.set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44);
      }
    }
    /**
     * Sets the elements of the matrix.The arguments are supposed to be
     * in row-major order.
     *
     * @param {number} [n11] - 1-1 matrix element.
     * @param {number} [n12] - 1-2 matrix element.
     * @param {number} [n13] - 1-3 matrix element.
     * @param {number} [n14] - 1-4 matrix element.
     * @param {number} [n21] - 2-1 matrix element.
     * @param {number} [n22] - 2-2 matrix element.
     * @param {number} [n23] - 2-3 matrix element.
     * @param {number} [n24] - 2-4 matrix element.
     * @param {number} [n31] - 3-1 matrix element.
     * @param {number} [n32] - 3-2 matrix element.
     * @param {number} [n33] - 3-3 matrix element.
     * @param {number} [n34] - 3-4 matrix element.
     * @param {number} [n41] - 4-1 matrix element.
     * @param {number} [n42] - 4-2 matrix element.
     * @param {number} [n43] - 4-3 matrix element.
     * @param {number} [n44] - 4-4 matrix element.
     * @return {Matrix4} A reference to this matrix.
     */
    set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
      const te = this.elements;
      te[0] = n11;
      te[4] = n12;
      te[8] = n13;
      te[12] = n14;
      te[1] = n21;
      te[5] = n22;
      te[9] = n23;
      te[13] = n24;
      te[2] = n31;
      te[6] = n32;
      te[10] = n33;
      te[14] = n34;
      te[3] = n41;
      te[7] = n42;
      te[11] = n43;
      te[15] = n44;
      return this;
    }
    /**
     * Sets this matrix to the 4x4 identity matrix.
     *
     * @return {Matrix4} A reference to this matrix.
     */
    identity() {
      this.set(
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      );
      return this;
    }
    /**
     * Returns a matrix with copied values from this instance.
     *
     * @return {Matrix4} A clone of this instance.
     */
    clone() {
      return new Matrix4().fromArray(this.elements);
    }
    /**
     * Copies the values of the given matrix to this instance.
     *
     * @param {Matrix4} m - The matrix to copy.
     * @return {Matrix4} A reference to this matrix.
     */
    copy(m) {
      const te = this.elements;
      const me = m.elements;
      te[0] = me[0];
      te[1] = me[1];
      te[2] = me[2];
      te[3] = me[3];
      te[4] = me[4];
      te[5] = me[5];
      te[6] = me[6];
      te[7] = me[7];
      te[8] = me[8];
      te[9] = me[9];
      te[10] = me[10];
      te[11] = me[11];
      te[12] = me[12];
      te[13] = me[13];
      te[14] = me[14];
      te[15] = me[15];
      return this;
    }
    /**
     * Copies the translation component of the given matrix
     * into this matrix's translation component.
     *
     * @param {Matrix4} m - The matrix to copy the translation component.
     * @return {Matrix4} A reference to this matrix.
     */
    copyPosition(m) {
      const te = this.elements, me = m.elements;
      te[12] = me[12];
      te[13] = me[13];
      te[14] = me[14];
      return this;
    }
    /**
     * Set the upper 3x3 elements of this matrix to the values of given 3x3 matrix.
     *
     * @param {Matrix3} m - The 3x3 matrix.
     * @return {Matrix4} A reference to this matrix.
     */
    setFromMatrix3(m) {
      const me = m.elements;
      this.set(
        me[0],
        me[3],
        me[6],
        0,
        me[1],
        me[4],
        me[7],
        0,
        me[2],
        me[5],
        me[8],
        0,
        0,
        0,
        0,
        1
      );
      return this;
    }
    /**
     * Extracts the basis of this matrix into the three axis vectors provided.
     *
     * @param {Vector3} xAxis - The basis's x axis.
     * @param {Vector3} yAxis - The basis's y axis.
     * @param {Vector3} zAxis - The basis's z axis.
     * @return {Matrix4} A reference to this matrix.
     */
    extractBasis(xAxis, yAxis, zAxis) {
      xAxis.setFromMatrixColumn(this, 0);
      yAxis.setFromMatrixColumn(this, 1);
      zAxis.setFromMatrixColumn(this, 2);
      return this;
    }
    /**
     * Sets the given basis vectors to this matrix.
     *
     * @param {Vector3} xAxis - The basis's x axis.
     * @param {Vector3} yAxis - The basis's y axis.
     * @param {Vector3} zAxis - The basis's z axis.
     * @return {Matrix4} A reference to this matrix.
     */
    makeBasis(xAxis, yAxis, zAxis) {
      this.set(
        xAxis.x,
        yAxis.x,
        zAxis.x,
        0,
        xAxis.y,
        yAxis.y,
        zAxis.y,
        0,
        xAxis.z,
        yAxis.z,
        zAxis.z,
        0,
        0,
        0,
        0,
        1
      );
      return this;
    }
    /**
     * Extracts the rotation component of the given matrix
     * into this matrix's rotation component.
     *
     * Note: This method does not support reflection matrices.
     *
     * @param {Matrix4} m - The matrix.
     * @return {Matrix4} A reference to this matrix.
     */
    extractRotation(m) {
      const te = this.elements;
      const me = m.elements;
      const scaleX = 1 / _v1$5.setFromMatrixColumn(m, 0).length();
      const scaleY = 1 / _v1$5.setFromMatrixColumn(m, 1).length();
      const scaleZ = 1 / _v1$5.setFromMatrixColumn(m, 2).length();
      te[0] = me[0] * scaleX;
      te[1] = me[1] * scaleX;
      te[2] = me[2] * scaleX;
      te[3] = 0;
      te[4] = me[4] * scaleY;
      te[5] = me[5] * scaleY;
      te[6] = me[6] * scaleY;
      te[7] = 0;
      te[8] = me[8] * scaleZ;
      te[9] = me[9] * scaleZ;
      te[10] = me[10] * scaleZ;
      te[11] = 0;
      te[12] = 0;
      te[13] = 0;
      te[14] = 0;
      te[15] = 1;
      return this;
    }
    /**
     * Sets the rotation component (the upper left 3x3 matrix) of this matrix to
     * the rotation specified by the given Euler angles. The rest of
     * the matrix is set to the identity. Depending on the {@link Euler#order},
     * there are six possible outcomes. See [this page]{@link https://en.wikipedia.org/wiki/Euler_angles#Rotation_matrix}
     * for a complete list.
     *
     * @param {Euler} euler - The Euler angles.
     * @return {Matrix4} A reference to this matrix.
     */
    makeRotationFromEuler(euler) {
      const te = this.elements;
      const x = euler.x, y = euler.y, z = euler.z;
      const a = Math.cos(x), b = Math.sin(x);
      const c = Math.cos(y), d = Math.sin(y);
      const e = Math.cos(z), f = Math.sin(z);
      if (euler.order === "XYZ") {
        const ae = a * e, af = a * f, be = b * e, bf = b * f;
        te[0] = c * e;
        te[4] = -c * f;
        te[8] = d;
        te[1] = af + be * d;
        te[5] = ae - bf * d;
        te[9] = -b * c;
        te[2] = bf - ae * d;
        te[6] = be + af * d;
        te[10] = a * c;
      } else if (euler.order === "YXZ") {
        const ce = c * e, cf = c * f, de = d * e, df = d * f;
        te[0] = ce + df * b;
        te[4] = de * b - cf;
        te[8] = a * d;
        te[1] = a * f;
        te[5] = a * e;
        te[9] = -b;
        te[2] = cf * b - de;
        te[6] = df + ce * b;
        te[10] = a * c;
      } else if (euler.order === "ZXY") {
        const ce = c * e, cf = c * f, de = d * e, df = d * f;
        te[0] = ce - df * b;
        te[4] = -a * f;
        te[8] = de + cf * b;
        te[1] = cf + de * b;
        te[5] = a * e;
        te[9] = df - ce * b;
        te[2] = -a * d;
        te[6] = b;
        te[10] = a * c;
      } else if (euler.order === "ZYX") {
        const ae = a * e, af = a * f, be = b * e, bf = b * f;
        te[0] = c * e;
        te[4] = be * d - af;
        te[8] = ae * d + bf;
        te[1] = c * f;
        te[5] = bf * d + ae;
        te[9] = af * d - be;
        te[2] = -d;
        te[6] = b * c;
        te[10] = a * c;
      } else if (euler.order === "YZX") {
        const ac = a * c, ad = a * d, bc = b * c, bd = b * d;
        te[0] = c * e;
        te[4] = bd - ac * f;
        te[8] = bc * f + ad;
        te[1] = f;
        te[5] = a * e;
        te[9] = -b * e;
        te[2] = -d * e;
        te[6] = ad * f + bc;
        te[10] = ac - bd * f;
      } else if (euler.order === "XZY") {
        const ac = a * c, ad = a * d, bc = b * c, bd = b * d;
        te[0] = c * e;
        te[4] = -f;
        te[8] = d * e;
        te[1] = ac * f + bd;
        te[5] = a * e;
        te[9] = ad * f - bc;
        te[2] = bc * f - ad;
        te[6] = b * e;
        te[10] = bd * f + ac;
      }
      te[3] = 0;
      te[7] = 0;
      te[11] = 0;
      te[12] = 0;
      te[13] = 0;
      te[14] = 0;
      te[15] = 1;
      return this;
    }
    /**
     * Sets the rotation component of this matrix to the rotation specified by
     * the given Quaternion as outlined [here]{@link https://en.wikipedia.org/wiki/Rotation_matrix#Quaternion}
     * The rest of the matrix is set to the identity.
     *
     * @param {Quaternion} q - The Quaternion.
     * @return {Matrix4} A reference to this matrix.
     */
    makeRotationFromQuaternion(q) {
      return this.compose(_zero, q, _one);
    }
    /**
     * Sets the rotation component of the transformation matrix, looking from `eye` towards
     * `target`, and oriented by the up-direction.
     *
     * @param {Vector3} eye - The eye vector.
     * @param {Vector3} target - The target vector.
     * @param {Vector3} up - The up vector.
     * @return {Matrix4} A reference to this matrix.
     */
    lookAt(eye, target, up) {
      const te = this.elements;
      _z.subVectors(eye, target);
      if (_z.lengthSq() === 0) {
        _z.z = 1;
      }
      _z.normalize();
      _x.crossVectors(up, _z);
      if (_x.lengthSq() === 0) {
        if (Math.abs(up.z) === 1) {
          _z.x += 1e-4;
        } else {
          _z.z += 1e-4;
        }
        _z.normalize();
        _x.crossVectors(up, _z);
      }
      _x.normalize();
      _y.crossVectors(_z, _x);
      te[0] = _x.x;
      te[4] = _y.x;
      te[8] = _z.x;
      te[1] = _x.y;
      te[5] = _y.y;
      te[9] = _z.y;
      te[2] = _x.z;
      te[6] = _y.z;
      te[10] = _z.z;
      return this;
    }
    /**
     * Post-multiplies this matrix by the given 4x4 matrix.
     *
     * @param {Matrix4} m - The matrix to multiply with.
     * @return {Matrix4} A reference to this matrix.
     */
    multiply(m) {
      return this.multiplyMatrices(this, m);
    }
    /**
     * Pre-multiplies this matrix by the given 4x4 matrix.
     *
     * @param {Matrix4} m - The matrix to multiply with.
     * @return {Matrix4} A reference to this matrix.
     */
    premultiply(m) {
      return this.multiplyMatrices(m, this);
    }
    /**
     * Multiples the given 4x4 matrices and stores the result
     * in this matrix.
     *
     * @param {Matrix4} a - The first matrix.
     * @param {Matrix4} b - The second matrix.
     * @return {Matrix4} A reference to this matrix.
     */
    multiplyMatrices(a, b) {
      const ae = a.elements;
      const be = b.elements;
      const te = this.elements;
      const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
      const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
      const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
      const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];
      const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
      const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
      const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
      const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];
      te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
      te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
      te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
      te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
      te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
      te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
      te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
      te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
      te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
      te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
      te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
      te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
      te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
      te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
      te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
      te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
      return this;
    }
    /**
     * Multiplies every component of the matrix by the given scalar.
     *
     * @param {number} s - The scalar.
     * @return {Matrix4} A reference to this matrix.
     */
    multiplyScalar(s) {
      const te = this.elements;
      te[0] *= s;
      te[4] *= s;
      te[8] *= s;
      te[12] *= s;
      te[1] *= s;
      te[5] *= s;
      te[9] *= s;
      te[13] *= s;
      te[2] *= s;
      te[6] *= s;
      te[10] *= s;
      te[14] *= s;
      te[3] *= s;
      te[7] *= s;
      te[11] *= s;
      te[15] *= s;
      return this;
    }
    /**
     * Computes and returns the determinant of this matrix.
     *
     * Based on the method outlined [here]{@link http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.html}.
     *
     * @return {number} The determinant.
     */
    determinant() {
      const te = this.elements;
      const n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
      const n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
      const n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
      const n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];
      return n41 * (+n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) + n42 * (+n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) + n43 * (+n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) + n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31);
    }
    /**
     * Transposes this matrix in place.
     *
     * @return {Matrix4} A reference to this matrix.
     */
    transpose() {
      const te = this.elements;
      let tmp;
      tmp = te[1];
      te[1] = te[4];
      te[4] = tmp;
      tmp = te[2];
      te[2] = te[8];
      te[8] = tmp;
      tmp = te[6];
      te[6] = te[9];
      te[9] = tmp;
      tmp = te[3];
      te[3] = te[12];
      te[12] = tmp;
      tmp = te[7];
      te[7] = te[13];
      te[13] = tmp;
      tmp = te[11];
      te[11] = te[14];
      te[14] = tmp;
      return this;
    }
    /**
     * Sets the position component for this matrix from the given vector,
     * without affecting the rest of the matrix.
     *
     * @param {number|Vector3} x - The x component of the vector or alternatively the vector object.
     * @param {number} y - The y component of the vector.
     * @param {number} z - The z component of the vector.
     * @return {Matrix4} A reference to this matrix.
     */
    setPosition(x, y, z) {
      const te = this.elements;
      if (x.isVector3) {
        te[12] = x.x;
        te[13] = x.y;
        te[14] = x.z;
      } else {
        te[12] = x;
        te[13] = y;
        te[14] = z;
      }
      return this;
    }
    /**
     * Inverts this matrix, using the [analytic method]{@link https://en.wikipedia.org/wiki/Invertible_matrix#Analytic_solution}.
     * You can not invert with a determinant of zero. If you attempt this, the method produces
     * a zero matrix instead.
     *
     * @return {Matrix4} A reference to this matrix.
     */
    invert() {
      const te = this.elements, n11 = te[0], n21 = te[1], n31 = te[2], n41 = te[3], n12 = te[4], n22 = te[5], n32 = te[6], n42 = te[7], n13 = te[8], n23 = te[9], n33 = te[10], n43 = te[11], n14 = te[12], n24 = te[13], n34 = te[14], n44 = te[15], t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44, t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44, t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44, t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
      const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
      if (det === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      const detInv = 1 / det;
      te[0] = t11 * detInv;
      te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
      te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
      te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;
      te[4] = t12 * detInv;
      te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
      te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
      te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;
      te[8] = t13 * detInv;
      te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
      te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
      te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;
      te[12] = t14 * detInv;
      te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
      te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
      te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;
      return this;
    }
    /**
     * Multiplies the columns of this matrix by the given vector.
     *
     * @param {Vector3} v - The scale vector.
     * @return {Matrix4} A reference to this matrix.
     */
    scale(v) {
      const te = this.elements;
      const x = v.x, y = v.y, z = v.z;
      te[0] *= x;
      te[4] *= y;
      te[8] *= z;
      te[1] *= x;
      te[5] *= y;
      te[9] *= z;
      te[2] *= x;
      te[6] *= y;
      te[10] *= z;
      te[3] *= x;
      te[7] *= y;
      te[11] *= z;
      return this;
    }
    /**
     * Gets the maximum scale value of the three axes.
     *
     * @return {number} The maximum scale.
     */
    getMaxScaleOnAxis() {
      const te = this.elements;
      const scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
      const scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
      const scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
      return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
    }
    /**
     * Sets this matrix as a translation transform from the given vector.
     *
     * @param {number|Vector3} x - The amount to translate in the X axis or alternatively a translation vector.
     * @param {number} y - The amount to translate in the Y axis.
     * @param {number} z - The amount to translate in the z axis.
     * @return {Matrix4} A reference to this matrix.
     */
    makeTranslation(x, y, z) {
      if (x.isVector3) {
        this.set(
          1,
          0,
          0,
          x.x,
          0,
          1,
          0,
          x.y,
          0,
          0,
          1,
          x.z,
          0,
          0,
          0,
          1
        );
      } else {
        this.set(
          1,
          0,
          0,
          x,
          0,
          1,
          0,
          y,
          0,
          0,
          1,
          z,
          0,
          0,
          0,
          1
        );
      }
      return this;
    }
    /**
     * Sets this matrix as a rotational transformation around the X axis by
     * the given angle.
     *
     * @param {number} theta - The rotation in radians.
     * @return {Matrix4} A reference to this matrix.
     */
    makeRotationX(theta) {
      const c = Math.cos(theta), s = Math.sin(theta);
      this.set(
        1,
        0,
        0,
        0,
        0,
        c,
        -s,
        0,
        0,
        s,
        c,
        0,
        0,
        0,
        0,
        1
      );
      return this;
    }
    /**
     * Sets this matrix as a rotational transformation around the Y axis by
     * the given angle.
     *
     * @param {number} theta - The rotation in radians.
     * @return {Matrix4} A reference to this matrix.
     */
    makeRotationY(theta) {
      const c = Math.cos(theta), s = Math.sin(theta);
      this.set(
        c,
        0,
        s,
        0,
        0,
        1,
        0,
        0,
        -s,
        0,
        c,
        0,
        0,
        0,
        0,
        1
      );
      return this;
    }
    /**
     * Sets this matrix as a rotational transformation around the Z axis by
     * the given angle.
     *
     * @param {number} theta - The rotation in radians.
     * @return {Matrix4} A reference to this matrix.
     */
    makeRotationZ(theta) {
      const c = Math.cos(theta), s = Math.sin(theta);
      this.set(
        c,
        -s,
        0,
        0,
        s,
        c,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      );
      return this;
    }
    /**
     * Sets this matrix as a rotational transformation around the given axis by
     * the given angle.
     *
     * This is a somewhat controversial but mathematically sound alternative to
     * rotating via Quaternions. See the discussion [here]{@link https://www.gamedev.net/articles/programming/math-and-physics/do-we-really-need-quaternions-r1199}.
     *
     * @param {Vector3} axis - The normalized rotation axis.
     * @param {number} angle - The rotation in radians.
     * @return {Matrix4} A reference to this matrix.
     */
    makeRotationAxis(axis, angle) {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      const t = 1 - c;
      const x = axis.x, y = axis.y, z = axis.z;
      const tx = t * x, ty = t * y;
      this.set(
        tx * x + c,
        tx * y - s * z,
        tx * z + s * y,
        0,
        tx * y + s * z,
        ty * y + c,
        ty * z - s * x,
        0,
        tx * z - s * y,
        ty * z + s * x,
        t * z * z + c,
        0,
        0,
        0,
        0,
        1
      );
      return this;
    }
    /**
     * Sets this matrix as a scale transformation.
     *
     * @param {number} x - The amount to scale in the X axis.
     * @param {number} y - The amount to scale in the Y axis.
     * @param {number} z - The amount to scale in the Z axis.
     * @return {Matrix4} A reference to this matrix.
     */
    makeScale(x, y, z) {
      this.set(
        x,
        0,
        0,
        0,
        0,
        y,
        0,
        0,
        0,
        0,
        z,
        0,
        0,
        0,
        0,
        1
      );
      return this;
    }
    /**
     * Sets this matrix as a shear transformation.
     *
     * @param {number} xy - The amount to shear X by Y.
     * @param {number} xz - The amount to shear X by Z.
     * @param {number} yx - The amount to shear Y by X.
     * @param {number} yz - The amount to shear Y by Z.
     * @param {number} zx - The amount to shear Z by X.
     * @param {number} zy - The amount to shear Z by Y.
     * @return {Matrix4} A reference to this matrix.
     */
    makeShear(xy, xz, yx, yz, zx, zy) {
      this.set(
        1,
        yx,
        zx,
        0,
        xy,
        1,
        zy,
        0,
        xz,
        yz,
        1,
        0,
        0,
        0,
        0,
        1
      );
      return this;
    }
    /**
     * Sets this matrix to the transformation composed of the given position,
     * rotation (Quaternion) and scale.
     *
     * @param {Vector3} position - The position vector.
     * @param {Quaternion} quaternion - The rotation as a Quaternion.
     * @param {Vector3} scale - The scale vector.
     * @return {Matrix4} A reference to this matrix.
     */
    compose(position, quaternion, scale) {
      const te = this.elements;
      const x = quaternion._x, y = quaternion._y, z = quaternion._z, w = quaternion._w;
      const x2 = x + x, y2 = y + y, z2 = z + z;
      const xx = x * x2, xy = x * y2, xz = x * z2;
      const yy = y * y2, yz = y * z2, zz = z * z2;
      const wx = w * x2, wy = w * y2, wz = w * z2;
      const sx = scale.x, sy = scale.y, sz = scale.z;
      te[0] = (1 - (yy + zz)) * sx;
      te[1] = (xy + wz) * sx;
      te[2] = (xz - wy) * sx;
      te[3] = 0;
      te[4] = (xy - wz) * sy;
      te[5] = (1 - (xx + zz)) * sy;
      te[6] = (yz + wx) * sy;
      te[7] = 0;
      te[8] = (xz + wy) * sz;
      te[9] = (yz - wx) * sz;
      te[10] = (1 - (xx + yy)) * sz;
      te[11] = 0;
      te[12] = position.x;
      te[13] = position.y;
      te[14] = position.z;
      te[15] = 1;
      return this;
    }
    /**
     * Decomposes this matrix into its position, rotation and scale components
     * and provides the result in the given objects.
     *
     * Note: Not all matrices are decomposable in this way. For example, if an
     * object has a non-uniformly scaled parent, then the object's world matrix
     * may not be decomposable, and this method may not be appropriate.
     *
     * @param {Vector3} position - The position vector.
     * @param {Quaternion} quaternion - The rotation as a Quaternion.
     * @param {Vector3} scale - The scale vector.
     * @return {Matrix4} A reference to this matrix.
     */
    decompose(position, quaternion, scale) {
      const te = this.elements;
      let sx = _v1$5.set(te[0], te[1], te[2]).length();
      const sy = _v1$5.set(te[4], te[5], te[6]).length();
      const sz = _v1$5.set(te[8], te[9], te[10]).length();
      const det = this.determinant();
      if (det < 0) sx = -sx;
      position.x = te[12];
      position.y = te[13];
      position.z = te[14];
      _m1$2.copy(this);
      const invSX = 1 / sx;
      const invSY = 1 / sy;
      const invSZ = 1 / sz;
      _m1$2.elements[0] *= invSX;
      _m1$2.elements[1] *= invSX;
      _m1$2.elements[2] *= invSX;
      _m1$2.elements[4] *= invSY;
      _m1$2.elements[5] *= invSY;
      _m1$2.elements[6] *= invSY;
      _m1$2.elements[8] *= invSZ;
      _m1$2.elements[9] *= invSZ;
      _m1$2.elements[10] *= invSZ;
      quaternion.setFromRotationMatrix(_m1$2);
      scale.x = sx;
      scale.y = sy;
      scale.z = sz;
      return this;
    }
    /**
    		 * Creates a perspective projection matrix. This is used internally by
    		 * {@link PerspectiveCamera#updateProjectionMatrix}.
    
    		 * @param {number} left - Left boundary of the viewing frustum at the near plane.
    		 * @param {number} right - Right boundary of the viewing frustum at the near plane.
    		 * @param {number} top - Top boundary of the viewing frustum at the near plane.
    		 * @param {number} bottom - Bottom boundary of the viewing frustum at the near plane.
    		 * @param {number} near - The distance from the camera to the near plane.
    		 * @param {number} far - The distance from the camera to the far plane.
    		 * @param {(WebGLCoordinateSystem|WebGPUCoordinateSystem)} [coordinateSystem=WebGLCoordinateSystem] - The coordinate system.
    		 * @param {boolean} [reversedDepth=false] - Whether to use a reversed depth.
    		 * @return {Matrix4} A reference to this matrix.
    		 */
    makePerspective(left, right, top, bottom, near, far, coordinateSystem = WebGLCoordinateSystem, reversedDepth = false) {
      const te = this.elements;
      const x = 2 * near / (right - left);
      const y = 2 * near / (top - bottom);
      const a = (right + left) / (right - left);
      const b = (top + bottom) / (top - bottom);
      let c, d;
      if (reversedDepth) {
        c = near / (far - near);
        d = far * near / (far - near);
      } else {
        if (coordinateSystem === WebGLCoordinateSystem) {
          c = -(far + near) / (far - near);
          d = -2 * far * near / (far - near);
        } else if (coordinateSystem === WebGPUCoordinateSystem) {
          c = -far / (far - near);
          d = -far * near / (far - near);
        } else {
          throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + coordinateSystem);
        }
      }
      te[0] = x;
      te[4] = 0;
      te[8] = a;
      te[12] = 0;
      te[1] = 0;
      te[5] = y;
      te[9] = b;
      te[13] = 0;
      te[2] = 0;
      te[6] = 0;
      te[10] = c;
      te[14] = d;
      te[3] = 0;
      te[7] = 0;
      te[11] = -1;
      te[15] = 0;
      return this;
    }
    /**
    		 * Creates a orthographic projection matrix. This is used internally by
    		 * {@link OrthographicCamera#updateProjectionMatrix}.
    
    		 * @param {number} left - Left boundary of the viewing frustum at the near plane.
    		 * @param {number} right - Right boundary of the viewing frustum at the near plane.
    		 * @param {number} top - Top boundary of the viewing frustum at the near plane.
    		 * @param {number} bottom - Bottom boundary of the viewing frustum at the near plane.
    		 * @param {number} near - The distance from the camera to the near plane.
    		 * @param {number} far - The distance from the camera to the far plane.
    		 * @param {(WebGLCoordinateSystem|WebGPUCoordinateSystem)} [coordinateSystem=WebGLCoordinateSystem] - The coordinate system.
    		 * @param {boolean} [reversedDepth=false] - Whether to use a reversed depth.
    		 * @return {Matrix4} A reference to this matrix.
    		 */
    makeOrthographic(left, right, top, bottom, near, far, coordinateSystem = WebGLCoordinateSystem, reversedDepth = false) {
      const te = this.elements;
      const x = 2 / (right - left);
      const y = 2 / (top - bottom);
      const a = -(right + left) / (right - left);
      const b = -(top + bottom) / (top - bottom);
      let c, d;
      if (reversedDepth) {
        c = 1 / (far - near);
        d = far / (far - near);
      } else {
        if (coordinateSystem === WebGLCoordinateSystem) {
          c = -2 / (far - near);
          d = -(far + near) / (far - near);
        } else if (coordinateSystem === WebGPUCoordinateSystem) {
          c = -1 / (far - near);
          d = -near / (far - near);
        } else {
          throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + coordinateSystem);
        }
      }
      te[0] = x;
      te[4] = 0;
      te[8] = 0;
      te[12] = a;
      te[1] = 0;
      te[5] = y;
      te[9] = 0;
      te[13] = b;
      te[2] = 0;
      te[6] = 0;
      te[10] = c;
      te[14] = d;
      te[3] = 0;
      te[7] = 0;
      te[11] = 0;
      te[15] = 1;
      return this;
    }
    /**
     * Returns `true` if this matrix is equal with the given one.
     *
     * @param {Matrix4} matrix - The matrix to test for equality.
     * @return {boolean} Whether this matrix is equal with the given one.
     */
    equals(matrix) {
      const te = this.elements;
      const me = matrix.elements;
      for (let i = 0; i < 16; i++) {
        if (te[i] !== me[i]) return false;
      }
      return true;
    }
    /**
     * Sets the elements of the matrix from the given array.
     *
     * @param {Array<number>} array - The matrix elements in column-major order.
     * @param {number} [offset=0] - Index of the first element in the array.
     * @return {Matrix4} A reference to this matrix.
     */
    fromArray(array, offset = 0) {
      for (let i = 0; i < 16; i++) {
        this.elements[i] = array[i + offset];
      }
      return this;
    }
    /**
     * Writes the elements of this matrix to the given array. If no array is provided,
     * the method returns a new instance.
     *
     * @param {Array<number>} [array=[]] - The target array holding the matrix elements in column-major order.
     * @param {number} [offset=0] - Index of the first element in the array.
     * @return {Array<number>} The matrix elements in column-major order.
     */
    toArray(array = [], offset = 0) {
      const te = this.elements;
      array[offset] = te[0];
      array[offset + 1] = te[1];
      array[offset + 2] = te[2];
      array[offset + 3] = te[3];
      array[offset + 4] = te[4];
      array[offset + 5] = te[5];
      array[offset + 6] = te[6];
      array[offset + 7] = te[7];
      array[offset + 8] = te[8];
      array[offset + 9] = te[9];
      array[offset + 10] = te[10];
      array[offset + 11] = te[11];
      array[offset + 12] = te[12];
      array[offset + 13] = te[13];
      array[offset + 14] = te[14];
      array[offset + 15] = te[15];
      return array;
    }
  }
  const _v1$5 = /* @__PURE__ */ new Vector3();
  const _m1$2 = /* @__PURE__ */ new Matrix4();
  const _zero = /* @__PURE__ */ new Vector3(0, 0, 0);
  const _one = /* @__PURE__ */ new Vector3(1, 1, 1);
  const _x = /* @__PURE__ */ new Vector3();
  const _y = /* @__PURE__ */ new Vector3();
  const _z = /* @__PURE__ */ new Vector3();
  const _matrix$2 = /* @__PURE__ */ new Matrix4();
  const _quaternion$3 = /* @__PURE__ */ new Quaternion();
  class Euler {
    /**
     * Constructs a new euler instance.
     *
     * @param {number} [x=0] - The angle of the x axis in radians.
     * @param {number} [y=0] - The angle of the y axis in radians.
     * @param {number} [z=0] - The angle of the z axis in radians.
     * @param {string} [order=Euler.DEFAULT_ORDER] - A string representing the order that the rotations are applied.
     */
    constructor(x = 0, y = 0, z = 0, order = Euler.DEFAULT_ORDER) {
      this.isEuler = true;
      this._x = x;
      this._y = y;
      this._z = z;
      this._order = order;
    }
    /**
     * The angle of the x axis in radians.
     *
     * @type {number}
     * @default 0
     */
    get x() {
      return this._x;
    }
    set x(value) {
      this._x = value;
      this._onChangeCallback();
    }
    /**
     * The angle of the y axis in radians.
     *
     * @type {number}
     * @default 0
     */
    get y() {
      return this._y;
    }
    set y(value) {
      this._y = value;
      this._onChangeCallback();
    }
    /**
     * The angle of the z axis in radians.
     *
     * @type {number}
     * @default 0
     */
    get z() {
      return this._z;
    }
    set z(value) {
      this._z = value;
      this._onChangeCallback();
    }
    /**
     * A string representing the order that the rotations are applied.
     *
     * @type {string}
     * @default 'XYZ'
     */
    get order() {
      return this._order;
    }
    set order(value) {
      this._order = value;
      this._onChangeCallback();
    }
    /**
     * Sets the Euler components.
     *
     * @param {number} x - The angle of the x axis in radians.
     * @param {number} y - The angle of the y axis in radians.
     * @param {number} z - The angle of the z axis in radians.
     * @param {string} [order] - A string representing the order that the rotations are applied.
     * @return {Euler} A reference to this Euler instance.
     */
    set(x, y, z, order = this._order) {
      this._x = x;
      this._y = y;
      this._z = z;
      this._order = order;
      this._onChangeCallback();
      return this;
    }
    /**
     * Returns a new Euler instance with copied values from this instance.
     *
     * @return {Euler} A clone of this instance.
     */
    clone() {
      return new this.constructor(this._x, this._y, this._z, this._order);
    }
    /**
     * Copies the values of the given Euler instance to this instance.
     *
     * @param {Euler} euler - The Euler instance to copy.
     * @return {Euler} A reference to this Euler instance.
     */
    copy(euler) {
      this._x = euler._x;
      this._y = euler._y;
      this._z = euler._z;
      this._order = euler._order;
      this._onChangeCallback();
      return this;
    }
    /**
     * Sets the angles of this Euler instance from a pure rotation matrix.
     *
     * @param {Matrix4} m - A 4x4 matrix of which the upper 3x3 of matrix is a pure rotation matrix (i.e. unscaled).
     * @param {string} [order] - A string representing the order that the rotations are applied.
     * @param {boolean} [update=true] - Whether the internal `onChange` callback should be executed or not.
     * @return {Euler} A reference to this Euler instance.
     */
    setFromRotationMatrix(m, order = this._order, update = true) {
      const te = m.elements;
      const m11 = te[0], m12 = te[4], m13 = te[8];
      const m21 = te[1], m22 = te[5], m23 = te[9];
      const m31 = te[2], m32 = te[6], m33 = te[10];
      switch (order) {
        case "XYZ":
          this._y = Math.asin(clamp(m13, -1, 1));
          if (Math.abs(m13) < 0.9999999) {
            this._x = Math.atan2(-m23, m33);
            this._z = Math.atan2(-m12, m11);
          } else {
            this._x = Math.atan2(m32, m22);
            this._z = 0;
          }
          break;
        case "YXZ":
          this._x = Math.asin(-clamp(m23, -1, 1));
          if (Math.abs(m23) < 0.9999999) {
            this._y = Math.atan2(m13, m33);
            this._z = Math.atan2(m21, m22);
          } else {
            this._y = Math.atan2(-m31, m11);
            this._z = 0;
          }
          break;
        case "ZXY":
          this._x = Math.asin(clamp(m32, -1, 1));
          if (Math.abs(m32) < 0.9999999) {
            this._y = Math.atan2(-m31, m33);
            this._z = Math.atan2(-m12, m22);
          } else {
            this._y = 0;
            this._z = Math.atan2(m21, m11);
          }
          break;
        case "ZYX":
          this._y = Math.asin(-clamp(m31, -1, 1));
          if (Math.abs(m31) < 0.9999999) {
            this._x = Math.atan2(m32, m33);
            this._z = Math.atan2(m21, m11);
          } else {
            this._x = 0;
            this._z = Math.atan2(-m12, m22);
          }
          break;
        case "YZX":
          this._z = Math.asin(clamp(m21, -1, 1));
          if (Math.abs(m21) < 0.9999999) {
            this._x = Math.atan2(-m23, m22);
            this._y = Math.atan2(-m31, m11);
          } else {
            this._x = 0;
            this._y = Math.atan2(m13, m33);
          }
          break;
        case "XZY":
          this._z = Math.asin(-clamp(m12, -1, 1));
          if (Math.abs(m12) < 0.9999999) {
            this._x = Math.atan2(m32, m22);
            this._y = Math.atan2(m13, m11);
          } else {
            this._x = Math.atan2(-m23, m33);
            this._y = 0;
          }
          break;
        default:
          console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + order);
      }
      this._order = order;
      if (update === true) this._onChangeCallback();
      return this;
    }
    /**
     * Sets the angles of this Euler instance from a normalized quaternion.
     *
     * @param {Quaternion} q - A normalized Quaternion.
     * @param {string} [order] - A string representing the order that the rotations are applied.
     * @param {boolean} [update=true] - Whether the internal `onChange` callback should be executed or not.
     * @return {Euler} A reference to this Euler instance.
     */
    setFromQuaternion(q, order, update) {
      _matrix$2.makeRotationFromQuaternion(q);
      return this.setFromRotationMatrix(_matrix$2, order, update);
    }
    /**
     * Sets the angles of this Euler instance from the given vector.
     *
     * @param {Vector3} v - The vector.
     * @param {string} [order] - A string representing the order that the rotations are applied.
     * @return {Euler} A reference to this Euler instance.
     */
    setFromVector3(v, order = this._order) {
      return this.set(v.x, v.y, v.z, order);
    }
    /**
     * Resets the euler angle with a new order by creating a quaternion from this
     * euler angle and then setting this euler angle with the quaternion and the
     * new order.
     *
     * Warning: This discards revolution information.
     *
     * @param {string} [newOrder] - A string representing the new order that the rotations are applied.
     * @return {Euler} A reference to this Euler instance.
     */
    reorder(newOrder) {
      _quaternion$3.setFromEuler(this);
      return this.setFromQuaternion(_quaternion$3, newOrder);
    }
    /**
     * Returns `true` if this Euler instance is equal with the given one.
     *
     * @param {Euler} euler - The Euler instance to test for equality.
     * @return {boolean} Whether this Euler instance is equal with the given one.
     */
    equals(euler) {
      return euler._x === this._x && euler._y === this._y && euler._z === this._z && euler._order === this._order;
    }
    /**
     * Sets this Euler instance's components to values from the given array. The first three
     * entries of the array are assign to the x,y and z components. An optional fourth entry
     * defines the Euler order.
     *
     * @param {Array<number,number,number,?string>} array - An array holding the Euler component values.
     * @return {Euler} A reference to this Euler instance.
     */
    fromArray(array) {
      this._x = array[0];
      this._y = array[1];
      this._z = array[2];
      if (array[3] !== void 0) this._order = array[3];
      this._onChangeCallback();
      return this;
    }
    /**
     * Writes the components of this Euler instance to the given array. If no array is provided,
     * the method returns a new instance.
     *
     * @param {Array<number,number,number,string>} [array=[]] - The target array holding the Euler components.
     * @param {number} [offset=0] - Index of the first element in the array.
     * @return {Array<number,number,number,string>} The Euler components.
     */
    toArray(array = [], offset = 0) {
      array[offset] = this._x;
      array[offset + 1] = this._y;
      array[offset + 2] = this._z;
      array[offset + 3] = this._order;
      return array;
    }
    _onChange(callback) {
      this._onChangeCallback = callback;
      return this;
    }
    _onChangeCallback() {
    }
    *[Symbol.iterator]() {
      yield this._x;
      yield this._y;
      yield this._z;
      yield this._order;
    }
  }
  Euler.DEFAULT_ORDER = "XYZ";
  class Layers {
    /**
     * Constructs a new layers instance, with membership
     * initially set to layer `0`.
     */
    constructor() {
      this.mask = 1 | 0;
    }
    /**
     * Sets membership to the given layer, and remove membership all other layers.
     *
     * @param {number} layer - The layer to set.
     */
    set(layer) {
      this.mask = (1 << layer | 0) >>> 0;
    }
    /**
     * Adds membership of the given layer.
     *
     * @param {number} layer - The layer to enable.
     */
    enable(layer) {
      this.mask |= 1 << layer | 0;
    }
    /**
     * Adds membership to all layers.
     */
    enableAll() {
      this.mask = 4294967295 | 0;
    }
    /**
     * Toggles the membership of the given layer.
     *
     * @param {number} layer - The layer to toggle.
     */
    toggle(layer) {
      this.mask ^= 1 << layer | 0;
    }
    /**
     * Removes membership of the given layer.
     *
     * @param {number} layer - The layer to enable.
     */
    disable(layer) {
      this.mask &= ~(1 << layer | 0);
    }
    /**
     * Removes the membership from all layers.
     */
    disableAll() {
      this.mask = 0;
    }
    /**
     * Returns `true` if this and the given layers object have at least one
     * layer in common.
     *
     * @param {Layers} layers - The layers to test.
     * @return {boolean } Whether this and the given layers object have at least one layer in common or not.
     */
    test(layers) {
      return (this.mask & layers.mask) !== 0;
    }
    /**
     * Returns `true` if the given layer is enabled.
     *
     * @param {number} layer - The layer to test.
     * @return {boolean } Whether the given layer is enabled or not.
     */
    isEnabled(layer) {
      return (this.mask & (1 << layer | 0)) !== 0;
    }
  }
  let _object3DId = 0;
  const _v1$4 = /* @__PURE__ */ new Vector3();
  const _q1 = /* @__PURE__ */ new Quaternion();
  const _m1$1 = /* @__PURE__ */ new Matrix4();
  const _target = /* @__PURE__ */ new Vector3();
  const _position$3 = /* @__PURE__ */ new Vector3();
  const _scale$2 = /* @__PURE__ */ new Vector3();
  const _quaternion$2 = /* @__PURE__ */ new Quaternion();
  const _xAxis = /* @__PURE__ */ new Vector3(1, 0, 0);
  const _yAxis = /* @__PURE__ */ new Vector3(0, 1, 0);
  const _zAxis = /* @__PURE__ */ new Vector3(0, 0, 1);
  const _addedEvent = { type: "added" };
  const _removedEvent = { type: "removed" };
  const _childaddedEvent = { type: "childadded", child: null };
  const _childremovedEvent = { type: "childremoved", child: null };
  class Object3D extends EventDispatcher {
    /**
     * Constructs a new 3D object.
     */
    constructor() {
      super();
      this.isObject3D = true;
      Object.defineProperty(this, "id", { value: _object3DId++ });
      this.uuid = generateUUID();
      this.name = "";
      this.type = "Object3D";
      this.parent = null;
      this.children = [];
      this.up = Object3D.DEFAULT_UP.clone();
      const position = new Vector3();
      const rotation = new Euler();
      const quaternion = new Quaternion();
      const scale = new Vector3(1, 1, 1);
      function onRotationChange() {
        quaternion.setFromEuler(rotation, false);
      }
      function onQuaternionChange() {
        rotation.setFromQuaternion(quaternion, void 0, false);
      }
      rotation._onChange(onRotationChange);
      quaternion._onChange(onQuaternionChange);
      Object.defineProperties(this, {
        /**
         * Represents the object's local position.
         *
         * @name Object3D#position
         * @type {Vector3}
         * @default (0,0,0)
         */
        position: {
          configurable: true,
          enumerable: true,
          value: position
        },
        /**
         * Represents the object's local rotation as Euler angles, in radians.
         *
         * @name Object3D#rotation
         * @type {Euler}
         * @default (0,0,0)
         */
        rotation: {
          configurable: true,
          enumerable: true,
          value: rotation
        },
        /**
         * Represents the object's local rotation as Quaternions.
         *
         * @name Object3D#quaternion
         * @type {Quaternion}
         */
        quaternion: {
          configurable: true,
          enumerable: true,
          value: quaternion
        },
        /**
         * Represents the object's local scale.
         *
         * @name Object3D#scale
         * @type {Vector3}
         * @default (1,1,1)
         */
        scale: {
          configurable: true,
          enumerable: true,
          value: scale
        },
        /**
         * Represents the object's model-view matrix.
         *
         * @name Object3D#modelViewMatrix
         * @type {Matrix4}
         */
        modelViewMatrix: {
          value: new Matrix4()
        },
        /**
         * Represents the object's normal matrix.
         *
         * @name Object3D#normalMatrix
         * @type {Matrix3}
         */
        normalMatrix: {
          value: new Matrix3()
        }
      });
      this.matrix = new Matrix4();
      this.matrixWorld = new Matrix4();
      this.matrixAutoUpdate = Object3D.DEFAULT_MATRIX_AUTO_UPDATE;
      this.matrixWorldAutoUpdate = Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE;
      this.matrixWorldNeedsUpdate = false;
      this.layers = new Layers();
      this.visible = true;
      this.castShadow = false;
      this.receiveShadow = false;
      this.frustumCulled = true;
      this.renderOrder = 0;
      this.animations = [];
      this.customDepthMaterial = void 0;
      this.customDistanceMaterial = void 0;
      this.userData = {};
    }
    /**
     * A callback that is executed immediately before a 3D object is rendered to a shadow map.
     *
     * @param {Renderer|WebGLRenderer} renderer - The renderer.
     * @param {Object3D} object - The 3D object.
     * @param {Camera} camera - The camera that is used to render the scene.
     * @param {Camera} shadowCamera - The shadow camera.
     * @param {BufferGeometry} geometry - The 3D object's geometry.
     * @param {Material} depthMaterial - The depth material.
     * @param {Object} group - The geometry group data.
     */
    onBeforeShadow() {
    }
    /**
     * A callback that is executed immediately after a 3D object is rendered to a shadow map.
     *
     * @param {Renderer|WebGLRenderer} renderer - The renderer.
     * @param {Object3D} object - The 3D object.
     * @param {Camera} camera - The camera that is used to render the scene.
     * @param {Camera} shadowCamera - The shadow camera.
     * @param {BufferGeometry} geometry - The 3D object's geometry.
     * @param {Material} depthMaterial - The depth material.
     * @param {Object} group - The geometry group data.
     */
    onAfterShadow() {
    }
    /**
     * A callback that is executed immediately before a 3D object is rendered.
     *
     * @param {Renderer|WebGLRenderer} renderer - The renderer.
     * @param {Object3D} object - The 3D object.
     * @param {Camera} camera - The camera that is used to render the scene.
     * @param {BufferGeometry} geometry - The 3D object's geometry.
     * @param {Material} material - The 3D object's material.
     * @param {Object} group - The geometry group data.
     */
    onBeforeRender() {
    }
    /**
     * A callback that is executed immediately after a 3D object is rendered.
     *
     * @param {Renderer|WebGLRenderer} renderer - The renderer.
     * @param {Object3D} object - The 3D object.
     * @param {Camera} camera - The camera that is used to render the scene.
     * @param {BufferGeometry} geometry - The 3D object's geometry.
     * @param {Material} material - The 3D object's material.
     * @param {Object} group - The geometry group data.
     */
    onAfterRender() {
    }
    /**
     * Applies the given transformation matrix to the object and updates the object's position,
     * rotation and scale.
     *
     * @param {Matrix4} matrix - The transformation matrix.
     */
    applyMatrix4(matrix) {
      if (this.matrixAutoUpdate) this.updateMatrix();
      this.matrix.premultiply(matrix);
      this.matrix.decompose(this.position, this.quaternion, this.scale);
    }
    /**
     * Applies a rotation represented by given the quaternion to the 3D object.
     *
     * @param {Quaternion} q - The quaternion.
     * @return {Object3D} A reference to this instance.
     */
    applyQuaternion(q) {
      this.quaternion.premultiply(q);
      return this;
    }
    /**
     * Sets the given rotation represented as an axis/angle couple to the 3D object.
     *
     * @param {Vector3} axis - The (normalized) axis vector.
     * @param {number} angle - The angle in radians.
     */
    setRotationFromAxisAngle(axis, angle) {
      this.quaternion.setFromAxisAngle(axis, angle);
    }
    /**
     * Sets the given rotation represented as Euler angles to the 3D object.
     *
     * @param {Euler} euler - The Euler angles.
     */
    setRotationFromEuler(euler) {
      this.quaternion.setFromEuler(euler, true);
    }
    /**
     * Sets the given rotation represented as rotation matrix to the 3D object.
     *
     * @param {Matrix4} m - Although a 4x4 matrix is expected, the upper 3x3 portion must be
     * a pure rotation matrix (i.e, unscaled).
     */
    setRotationFromMatrix(m) {
      this.quaternion.setFromRotationMatrix(m);
    }
    /**
     * Sets the given rotation represented as a Quaternion to the 3D object.
     *
     * @param {Quaternion} q - The Quaternion
     */
    setRotationFromQuaternion(q) {
      this.quaternion.copy(q);
    }
    /**
     * Rotates the 3D object along an axis in local space.
     *
     * @param {Vector3} axis - The (normalized) axis vector.
     * @param {number} angle - The angle in radians.
     * @return {Object3D} A reference to this instance.
     */
    rotateOnAxis(axis, angle) {
      _q1.setFromAxisAngle(axis, angle);
      this.quaternion.multiply(_q1);
      return this;
    }
    /**
     * Rotates the 3D object along an axis in world space.
     *
     * @param {Vector3} axis - The (normalized) axis vector.
     * @param {number} angle - The angle in radians.
     * @return {Object3D} A reference to this instance.
     */
    rotateOnWorldAxis(axis, angle) {
      _q1.setFromAxisAngle(axis, angle);
      this.quaternion.premultiply(_q1);
      return this;
    }
    /**
     * Rotates the 3D object around its X axis in local space.
     *
     * @param {number} angle - The angle in radians.
     * @return {Object3D} A reference to this instance.
     */
    rotateX(angle) {
      return this.rotateOnAxis(_xAxis, angle);
    }
    /**
     * Rotates the 3D object around its Y axis in local space.
     *
     * @param {number} angle - The angle in radians.
     * @return {Object3D} A reference to this instance.
     */
    rotateY(angle) {
      return this.rotateOnAxis(_yAxis, angle);
    }
    /**
     * Rotates the 3D object around its Z axis in local space.
     *
     * @param {number} angle - The angle in radians.
     * @return {Object3D} A reference to this instance.
     */
    rotateZ(angle) {
      return this.rotateOnAxis(_zAxis, angle);
    }
    /**
     * Translate the 3D object by a distance along the given axis in local space.
     *
     * @param {Vector3} axis - The (normalized) axis vector.
     * @param {number} distance - The distance in world units.
     * @return {Object3D} A reference to this instance.
     */
    translateOnAxis(axis, distance) {
      _v1$4.copy(axis).applyQuaternion(this.quaternion);
      this.position.add(_v1$4.multiplyScalar(distance));
      return this;
    }
    /**
     * Translate the 3D object by a distance along its X-axis in local space.
     *
     * @param {number} distance - The distance in world units.
     * @return {Object3D} A reference to this instance.
     */
    translateX(distance) {
      return this.translateOnAxis(_xAxis, distance);
    }
    /**
     * Translate the 3D object by a distance along its Y-axis in local space.
     *
     * @param {number} distance - The distance in world units.
     * @return {Object3D} A reference to this instance.
     */
    translateY(distance) {
      return this.translateOnAxis(_yAxis, distance);
    }
    /**
     * Translate the 3D object by a distance along its Z-axis in local space.
     *
     * @param {number} distance - The distance in world units.
     * @return {Object3D} A reference to this instance.
     */
    translateZ(distance) {
      return this.translateOnAxis(_zAxis, distance);
    }
    /**
     * Converts the given vector from this 3D object's local space to world space.
     *
     * @param {Vector3} vector - The vector to convert.
     * @return {Vector3} The converted vector.
     */
    localToWorld(vector) {
      this.updateWorldMatrix(true, false);
      return vector.applyMatrix4(this.matrixWorld);
    }
    /**
     * Converts the given vector from this 3D object's word space to local space.
     *
     * @param {Vector3} vector - The vector to convert.
     * @return {Vector3} The converted vector.
     */
    worldToLocal(vector) {
      this.updateWorldMatrix(true, false);
      return vector.applyMatrix4(_m1$1.copy(this.matrixWorld).invert());
    }
    /**
     * Rotates the object to face a point in world space.
     *
     * This method does not support objects having non-uniformly-scaled parent(s).
     *
     * @param {number|Vector3} x - The x coordinate in world space. Alternatively, a vector representing a position in world space
     * @param {number} [y] - The y coordinate in world space.
     * @param {number} [z] - The z coordinate in world space.
     */
    lookAt(x, y, z) {
      if (x.isVector3) {
        _target.copy(x);
      } else {
        _target.set(x, y, z);
      }
      const parent = this.parent;
      this.updateWorldMatrix(true, false);
      _position$3.setFromMatrixPosition(this.matrixWorld);
      if (this.isCamera || this.isLight) {
        _m1$1.lookAt(_position$3, _target, this.up);
      } else {
        _m1$1.lookAt(_target, _position$3, this.up);
      }
      this.quaternion.setFromRotationMatrix(_m1$1);
      if (parent) {
        _m1$1.extractRotation(parent.matrixWorld);
        _q1.setFromRotationMatrix(_m1$1);
        this.quaternion.premultiply(_q1.invert());
      }
    }
    /**
     * Adds the given 3D object as a child to this 3D object. An arbitrary number of
     * objects may be added. Any current parent on an object passed in here will be
     * removed, since an object can have at most one parent.
     *
     * @fires Object3D#added
     * @fires Object3D#childadded
     * @param {Object3D} object - The 3D object to add.
     * @return {Object3D} A reference to this instance.
     */
    add(object) {
      if (arguments.length > 1) {
        for (let i = 0; i < arguments.length; i++) {
          this.add(arguments[i]);
        }
        return this;
      }
      if (object === this) {
        console.error("THREE.Object3D.add: object can't be added as a child of itself.", object);
        return this;
      }
      if (object && object.isObject3D) {
        object.removeFromParent();
        object.parent = this;
        this.children.push(object);
        object.dispatchEvent(_addedEvent);
        _childaddedEvent.child = object;
        this.dispatchEvent(_childaddedEvent);
        _childaddedEvent.child = null;
      } else {
        console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", object);
      }
      return this;
    }
    /**
     * Removes the given 3D object as child from this 3D object.
     * An arbitrary number of objects may be removed.
     *
     * @fires Object3D#removed
     * @fires Object3D#childremoved
     * @param {Object3D} object - The 3D object to remove.
     * @return {Object3D} A reference to this instance.
     */
    remove(object) {
      if (arguments.length > 1) {
        for (let i = 0; i < arguments.length; i++) {
          this.remove(arguments[i]);
        }
        return this;
      }
      const index = this.children.indexOf(object);
      if (index !== -1) {
        object.parent = null;
        this.children.splice(index, 1);
        object.dispatchEvent(_removedEvent);
        _childremovedEvent.child = object;
        this.dispatchEvent(_childremovedEvent);
        _childremovedEvent.child = null;
      }
      return this;
    }
    /**
     * Removes this 3D object from its current parent.
     *
     * @fires Object3D#removed
     * @fires Object3D#childremoved
     * @return {Object3D} A reference to this instance.
     */
    removeFromParent() {
      const parent = this.parent;
      if (parent !== null) {
        parent.remove(this);
      }
      return this;
    }
    /**
     * Removes all child objects.
     *
     * @fires Object3D#removed
     * @fires Object3D#childremoved
     * @return {Object3D} A reference to this instance.
     */
    clear() {
      return this.remove(...this.children);
    }
    /**
     * Adds the given 3D object as a child of this 3D object, while maintaining the object's world
     * transform. This method does not support scene graphs having non-uniformly-scaled nodes(s).
     *
     * @fires Object3D#added
     * @fires Object3D#childadded
     * @param {Object3D} object - The 3D object to attach.
     * @return {Object3D} A reference to this instance.
     */
    attach(object) {
      this.updateWorldMatrix(true, false);
      _m1$1.copy(this.matrixWorld).invert();
      if (object.parent !== null) {
        object.parent.updateWorldMatrix(true, false);
        _m1$1.multiply(object.parent.matrixWorld);
      }
      object.applyMatrix4(_m1$1);
      object.removeFromParent();
      object.parent = this;
      this.children.push(object);
      object.updateWorldMatrix(false, true);
      object.dispatchEvent(_addedEvent);
      _childaddedEvent.child = object;
      this.dispatchEvent(_childaddedEvent);
      _childaddedEvent.child = null;
      return this;
    }
    /**
     * Searches through the 3D object and its children, starting with the 3D object
     * itself, and returns the first with a matching ID.
     *
     * @param {number} id - The id.
     * @return {Object3D|undefined} The found 3D object. Returns `undefined` if no 3D object has been found.
     */
    getObjectById(id) {
      return this.getObjectByProperty("id", id);
    }
    /**
     * Searches through the 3D object and its children, starting with the 3D object
     * itself, and returns the first with a matching name.
     *
     * @param {string} name - The name.
     * @return {Object3D|undefined} The found 3D object. Returns `undefined` if no 3D object has been found.
     */
    getObjectByName(name) {
      return this.getObjectByProperty("name", name);
    }
    /**
     * Searches through the 3D object and its children, starting with the 3D object
     * itself, and returns the first with a matching property value.
     *
     * @param {string} name - The name of the property.
     * @param {any} value - The value.
     * @return {Object3D|undefined} The found 3D object. Returns `undefined` if no 3D object has been found.
     */
    getObjectByProperty(name, value) {
      if (this[name] === value) return this;
      for (let i = 0, l = this.children.length; i < l; i++) {
        const child = this.children[i];
        const object = child.getObjectByProperty(name, value);
        if (object !== void 0) {
          return object;
        }
      }
      return void 0;
    }
    /**
     * Searches through the 3D object and its children, starting with the 3D object
     * itself, and returns all 3D objects with a matching property value.
     *
     * @param {string} name - The name of the property.
     * @param {any} value - The value.
     * @param {Array<Object3D>} result - The method stores the result in this array.
     * @return {Array<Object3D>} The found 3D objects.
     */
    getObjectsByProperty(name, value, result = []) {
      if (this[name] === value) result.push(this);
      const children = this.children;
      for (let i = 0, l = children.length; i < l; i++) {
        children[i].getObjectsByProperty(name, value, result);
      }
      return result;
    }
    /**
     * Returns a vector representing the position of the 3D object in world space.
     *
     * @param {Vector3} target - The target vector the result is stored to.
     * @return {Vector3} The 3D object's position in world space.
     */
    getWorldPosition(target) {
      this.updateWorldMatrix(true, false);
      return target.setFromMatrixPosition(this.matrixWorld);
    }
    /**
     * Returns a Quaternion representing the position of the 3D object in world space.
     *
     * @param {Quaternion} target - The target Quaternion the result is stored to.
     * @return {Quaternion} The 3D object's rotation in world space.
     */
    getWorldQuaternion(target) {
      this.updateWorldMatrix(true, false);
      this.matrixWorld.decompose(_position$3, target, _scale$2);
      return target;
    }
    /**
     * Returns a vector representing the scale of the 3D object in world space.
     *
     * @param {Vector3} target - The target vector the result is stored to.
     * @return {Vector3} The 3D object's scale in world space.
     */
    getWorldScale(target) {
      this.updateWorldMatrix(true, false);
      this.matrixWorld.decompose(_position$3, _quaternion$2, target);
      return target;
    }
    /**
     * Returns a vector representing the ("look") direction of the 3D object in world space.
     *
     * @param {Vector3} target - The target vector the result is stored to.
     * @return {Vector3} The 3D object's direction in world space.
     */
    getWorldDirection(target) {
      this.updateWorldMatrix(true, false);
      const e = this.matrixWorld.elements;
      return target.set(e[8], e[9], e[10]).normalize();
    }
    /**
     * Abstract method to get intersections between a casted ray and this
     * 3D object. Renderable 3D objects such as {@link Mesh}, {@link Line} or {@link Points}
     * implement this method in order to use raycasting.
     *
     * @abstract
     * @param {Raycaster} raycaster - The raycaster.
     * @param {Array<Object>} intersects - An array holding the result of the method.
     */
    raycast() {
    }
    /**
     * Executes the callback on this 3D object and all descendants.
     *
     * Note: Modifying the scene graph inside the callback is discouraged.
     *
     * @param {Function} callback - A callback function that allows to process the current 3D object.
     */
    traverse(callback) {
      callback(this);
      const children = this.children;
      for (let i = 0, l = children.length; i < l; i++) {
        children[i].traverse(callback);
      }
    }
    /**
     * Like {@link Object3D#traverse}, but the callback will only be executed for visible 3D objects.
     * Descendants of invisible 3D objects are not traversed.
     *
     * Note: Modifying the scene graph inside the callback is discouraged.
     *
     * @param {Function} callback - A callback function that allows to process the current 3D object.
     */
    traverseVisible(callback) {
      if (this.visible === false) return;
      callback(this);
      const children = this.children;
      for (let i = 0, l = children.length; i < l; i++) {
        children[i].traverseVisible(callback);
      }
    }
    /**
     * Like {@link Object3D#traverse}, but the callback will only be executed for all ancestors.
     *
     * Note: Modifying the scene graph inside the callback is discouraged.
     *
     * @param {Function} callback - A callback function that allows to process the current 3D object.
     */
    traverseAncestors(callback) {
      const parent = this.parent;
      if (parent !== null) {
        callback(parent);
        parent.traverseAncestors(callback);
      }
    }
    /**
     * Updates the transformation matrix in local space by computing it from the current
     * position, rotation and scale values.
     */
    updateMatrix() {
      this.matrix.compose(this.position, this.quaternion, this.scale);
      this.matrixWorldNeedsUpdate = true;
    }
    /**
     * Updates the transformation matrix in world space of this 3D objects and its descendants.
     *
     * To ensure correct results, this method also recomputes the 3D object's transformation matrix in
     * local space. The computation of the local and world matrix can be controlled with the
     * {@link Object3D#matrixAutoUpdate} and {@link Object3D#matrixWorldAutoUpdate} flags which are both
     * `true` by default.  Set these flags to `false` if you need more control over the update matrix process.
     *
     * @param {boolean} [force=false] - When set to `true`, a recomputation of world matrices is forced even
     * when {@link Object3D#matrixWorldAutoUpdate} is set to `false`.
     */
    updateMatrixWorld(force) {
      if (this.matrixAutoUpdate) this.updateMatrix();
      if (this.matrixWorldNeedsUpdate || force) {
        if (this.matrixWorldAutoUpdate === true) {
          if (this.parent === null) {
            this.matrixWorld.copy(this.matrix);
          } else {
            this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
          }
        }
        this.matrixWorldNeedsUpdate = false;
        force = true;
      }
      const children = this.children;
      for (let i = 0, l = children.length; i < l; i++) {
        const child = children[i];
        child.updateMatrixWorld(force);
      }
    }
    /**
     * An alternative version of {@link Object3D#updateMatrixWorld} with more control over the
     * update of ancestor and descendant nodes.
     *
     * @param {boolean} [updateParents=false] Whether ancestor nodes should be updated or not.
     * @param {boolean} [updateChildren=false] Whether descendant nodes should be updated or not.
     */
    updateWorldMatrix(updateParents, updateChildren) {
      const parent = this.parent;
      if (updateParents === true && parent !== null) {
        parent.updateWorldMatrix(true, false);
      }
      if (this.matrixAutoUpdate) this.updateMatrix();
      if (this.matrixWorldAutoUpdate === true) {
        if (this.parent === null) {
          this.matrixWorld.copy(this.matrix);
        } else {
          this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
        }
      }
      if (updateChildren === true) {
        const children = this.children;
        for (let i = 0, l = children.length; i < l; i++) {
          const child = children[i];
          child.updateWorldMatrix(false, true);
        }
      }
    }
    /**
     * Serializes the 3D object into JSON.
     *
     * @param {?(Object|string)} meta - An optional value holding meta information about the serialization.
     * @return {Object} A JSON object representing the serialized 3D object.
     * @see {@link ObjectLoader#parse}
     */
    toJSON(meta) {
      const isRootObject = meta === void 0 || typeof meta === "string";
      const output = {};
      if (isRootObject) {
        meta = {
          geometries: {},
          materials: {},
          textures: {},
          images: {},
          shapes: {},
          skeletons: {},
          animations: {},
          nodes: {}
        };
        output.metadata = {
          version: 4.7,
          type: "Object",
          generator: "Object3D.toJSON"
        };
      }
      const object = {};
      object.uuid = this.uuid;
      object.type = this.type;
      if (this.name !== "") object.name = this.name;
      if (this.castShadow === true) object.castShadow = true;
      if (this.receiveShadow === true) object.receiveShadow = true;
      if (this.visible === false) object.visible = false;
      if (this.frustumCulled === false) object.frustumCulled = false;
      if (this.renderOrder !== 0) object.renderOrder = this.renderOrder;
      if (Object.keys(this.userData).length > 0) object.userData = this.userData;
      object.layers = this.layers.mask;
      object.matrix = this.matrix.toArray();
      object.up = this.up.toArray();
      if (this.matrixAutoUpdate === false) object.matrixAutoUpdate = false;
      if (this.isInstancedMesh) {
        object.type = "InstancedMesh";
        object.count = this.count;
        object.instanceMatrix = this.instanceMatrix.toJSON();
        if (this.instanceColor !== null) object.instanceColor = this.instanceColor.toJSON();
      }
      if (this.isBatchedMesh) {
        object.type = "BatchedMesh";
        object.perObjectFrustumCulled = this.perObjectFrustumCulled;
        object.sortObjects = this.sortObjects;
        object.drawRanges = this._drawRanges;
        object.reservedRanges = this._reservedRanges;
        object.geometryInfo = this._geometryInfo.map((info) => ({
          ...info,
          boundingBox: info.boundingBox ? info.boundingBox.toJSON() : void 0,
          boundingSphere: info.boundingSphere ? info.boundingSphere.toJSON() : void 0
        }));
        object.instanceInfo = this._instanceInfo.map((info) => ({ ...info }));
        object.availableInstanceIds = this._availableInstanceIds.slice();
        object.availableGeometryIds = this._availableGeometryIds.slice();
        object.nextIndexStart = this._nextIndexStart;
        object.nextVertexStart = this._nextVertexStart;
        object.geometryCount = this._geometryCount;
        object.maxInstanceCount = this._maxInstanceCount;
        object.maxVertexCount = this._maxVertexCount;
        object.maxIndexCount = this._maxIndexCount;
        object.geometryInitialized = this._geometryInitialized;
        object.matricesTexture = this._matricesTexture.toJSON(meta);
        object.indirectTexture = this._indirectTexture.toJSON(meta);
        if (this._colorsTexture !== null) {
          object.colorsTexture = this._colorsTexture.toJSON(meta);
        }
        if (this.boundingSphere !== null) {
          object.boundingSphere = this.boundingSphere.toJSON();
        }
        if (this.boundingBox !== null) {
          object.boundingBox = this.boundingBox.toJSON();
        }
      }
      function serialize(library, element) {
        if (library[element.uuid] === void 0) {
          library[element.uuid] = element.toJSON(meta);
        }
        return element.uuid;
      }
      if (this.isScene) {
        if (this.background) {
          if (this.background.isColor) {
            object.background = this.background.toJSON();
          } else if (this.background.isTexture) {
            object.background = this.background.toJSON(meta).uuid;
          }
        }
        if (this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== true) {
          object.environment = this.environment.toJSON(meta).uuid;
        }
      } else if (this.isMesh || this.isLine || this.isPoints) {
        object.geometry = serialize(meta.geometries, this.geometry);
        const parameters = this.geometry.parameters;
        if (parameters !== void 0 && parameters.shapes !== void 0) {
          const shapes = parameters.shapes;
          if (Array.isArray(shapes)) {
            for (let i = 0, l = shapes.length; i < l; i++) {
              const shape = shapes[i];
              serialize(meta.shapes, shape);
            }
          } else {
            serialize(meta.shapes, shapes);
          }
        }
      }
      if (this.isSkinnedMesh) {
        object.bindMode = this.bindMode;
        object.bindMatrix = this.bindMatrix.toArray();
        if (this.skeleton !== void 0) {
          serialize(meta.skeletons, this.skeleton);
          object.skeleton = this.skeleton.uuid;
        }
      }
      if (this.material !== void 0) {
        if (Array.isArray(this.material)) {
          const uuids = [];
          for (let i = 0, l = this.material.length; i < l; i++) {
            uuids.push(serialize(meta.materials, this.material[i]));
          }
          object.material = uuids;
        } else {
          object.material = serialize(meta.materials, this.material);
        }
      }
      if (this.children.length > 0) {
        object.children = [];
        for (let i = 0; i < this.children.length; i++) {
          object.children.push(this.children[i].toJSON(meta).object);
        }
      }
      if (this.animations.length > 0) {
        object.animations = [];
        for (let i = 0; i < this.animations.length; i++) {
          const animation = this.animations[i];
          object.animations.push(serialize(meta.animations, animation));
        }
      }
      if (isRootObject) {
        const geometries = extractFromCache(meta.geometries);
        const materials = extractFromCache(meta.materials);
        const textures = extractFromCache(meta.textures);
        const images = extractFromCache(meta.images);
        const shapes = extractFromCache(meta.shapes);
        const skeletons = extractFromCache(meta.skeletons);
        const animations = extractFromCache(meta.animations);
        const nodes = extractFromCache(meta.nodes);
        if (geometries.length > 0) output.geometries = geometries;
        if (materials.length > 0) output.materials = materials;
        if (textures.length > 0) output.textures = textures;
        if (images.length > 0) output.images = images;
        if (shapes.length > 0) output.shapes = shapes;
        if (skeletons.length > 0) output.skeletons = skeletons;
        if (animations.length > 0) output.animations = animations;
        if (nodes.length > 0) output.nodes = nodes;
      }
      output.object = object;
      return output;
      function extractFromCache(cache) {
        const values = [];
        for (const key in cache) {
          const data = cache[key];
          delete data.metadata;
          values.push(data);
        }
        return values;
      }
    }
    /**
     * Returns a new 3D object with copied values from this instance.
     *
     * @param {boolean} [recursive=true] - When set to `true`, descendants of the 3D object are also cloned.
     * @return {Object3D} A clone of this instance.
     */
    clone(recursive) {
      return new this.constructor().copy(this, recursive);
    }
    /**
     * Copies the values of the given 3D object to this instance.
     *
     * @param {Object3D} source - The 3D object to copy.
     * @param {boolean} [recursive=true] - When set to `true`, descendants of the 3D object are cloned.
     * @return {Object3D} A reference to this instance.
     */
    copy(source, recursive = true) {
      this.name = source.name;
      this.up.copy(source.up);
      this.position.copy(source.position);
      this.rotation.order = source.rotation.order;
      this.quaternion.copy(source.quaternion);
      this.scale.copy(source.scale);
      this.matrix.copy(source.matrix);
      this.matrixWorld.copy(source.matrixWorld);
      this.matrixAutoUpdate = source.matrixAutoUpdate;
      this.matrixWorldAutoUpdate = source.matrixWorldAutoUpdate;
      this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;
      this.layers.mask = source.layers.mask;
      this.visible = source.visible;
      this.castShadow = source.castShadow;
      this.receiveShadow = source.receiveShadow;
      this.frustumCulled = source.frustumCulled;
      this.renderOrder = source.renderOrder;
      this.animations = source.animations.slice();
      this.userData = JSON.parse(JSON.stringify(source.userData));
      if (recursive === true) {
        for (let i = 0; i < source.children.length; i++) {
          const child = source.children[i];
          this.add(child.clone());
        }
      }
      return this;
    }
  }
  Object3D.DEFAULT_UP = /* @__PURE__ */ new Vector3(0, 1, 0);
  Object3D.DEFAULT_MATRIX_AUTO_UPDATE = true;
  Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = true;
  const _v0$1$1 = /* @__PURE__ */ new Vector3();
  const _v1$3 = /* @__PURE__ */ new Vector3();
  const _v2$2 = /* @__PURE__ */ new Vector3();
  const _v3$2 = /* @__PURE__ */ new Vector3();
  const _vab = /* @__PURE__ */ new Vector3();
  const _vac = /* @__PURE__ */ new Vector3();
  const _vbc = /* @__PURE__ */ new Vector3();
  const _vap = /* @__PURE__ */ new Vector3();
  const _vbp = /* @__PURE__ */ new Vector3();
  const _vcp = /* @__PURE__ */ new Vector3();
  const _v40 = /* @__PURE__ */ new Vector4();
  const _v41 = /* @__PURE__ */ new Vector4();
  const _v42 = /* @__PURE__ */ new Vector4();
  class Triangle {
    /**
     * Constructs a new triangle.
     *
     * @param {Vector3} [a=(0,0,0)] - The first corner of the triangle.
     * @param {Vector3} [b=(0,0,0)] - The second corner of the triangle.
     * @param {Vector3} [c=(0,0,0)] - The third corner of the triangle.
     */
    constructor(a = new Vector3(), b = new Vector3(), c = new Vector3()) {
      this.a = a;
      this.b = b;
      this.c = c;
    }
    /**
     * Computes the normal vector of a triangle.
     *
     * @param {Vector3} a - The first corner of the triangle.
     * @param {Vector3} b - The second corner of the triangle.
     * @param {Vector3} c - The third corner of the triangle.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {Vector3} The triangle's normal.
     */
    static getNormal(a, b, c, target) {
      target.subVectors(c, b);
      _v0$1$1.subVectors(a, b);
      target.cross(_v0$1$1);
      const targetLengthSq = target.lengthSq();
      if (targetLengthSq > 0) {
        return target.multiplyScalar(1 / Math.sqrt(targetLengthSq));
      }
      return target.set(0, 0, 0);
    }
    /**
     * Computes a barycentric coordinates from the given vector.
     * Returns `null` if the triangle is degenerate.
     *
     * @param {Vector3} point - A point in 3D space.
     * @param {Vector3} a - The first corner of the triangle.
     * @param {Vector3} b - The second corner of the triangle.
     * @param {Vector3} c - The third corner of the triangle.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {?Vector3} The barycentric coordinates for the given point
     */
    static getBarycoord(point, a, b, c, target) {
      _v0$1$1.subVectors(c, a);
      _v1$3.subVectors(b, a);
      _v2$2.subVectors(point, a);
      const dot00 = _v0$1$1.dot(_v0$1$1);
      const dot01 = _v0$1$1.dot(_v1$3);
      const dot02 = _v0$1$1.dot(_v2$2);
      const dot11 = _v1$3.dot(_v1$3);
      const dot12 = _v1$3.dot(_v2$2);
      const denom = dot00 * dot11 - dot01 * dot01;
      if (denom === 0) {
        target.set(0, 0, 0);
        return null;
      }
      const invDenom = 1 / denom;
      const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
      const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
      return target.set(1 - u - v, v, u);
    }
    /**
     * Returns `true` if the given point, when projected onto the plane of the
     * triangle, lies within the triangle.
     *
     * @param {Vector3} point - The point in 3D space to test.
     * @param {Vector3} a - The first corner of the triangle.
     * @param {Vector3} b - The second corner of the triangle.
     * @param {Vector3} c - The third corner of the triangle.
     * @return {boolean} Whether the given point, when projected onto the plane of the
     * triangle, lies within the triangle or not.
     */
    static containsPoint(point, a, b, c) {
      if (this.getBarycoord(point, a, b, c, _v3$2) === null) {
        return false;
      }
      return _v3$2.x >= 0 && _v3$2.y >= 0 && _v3$2.x + _v3$2.y <= 1;
    }
    /**
     * Computes the value barycentrically interpolated for the given point on the
     * triangle. Returns `null` if the triangle is degenerate.
     *
     * @param {Vector3} point - Position of interpolated point.
     * @param {Vector3} p1 - The first corner of the triangle.
     * @param {Vector3} p2 - The second corner of the triangle.
     * @param {Vector3} p3 - The third corner of the triangle.
     * @param {Vector3} v1 - Value to interpolate of first vertex.
     * @param {Vector3} v2 - Value to interpolate of second vertex.
     * @param {Vector3} v3 - Value to interpolate of third vertex.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {?Vector3} The interpolated value.
     */
    static getInterpolation(point, p1, p2, p3, v1, v2, v3, target) {
      if (this.getBarycoord(point, p1, p2, p3, _v3$2) === null) {
        target.x = 0;
        target.y = 0;
        if ("z" in target) target.z = 0;
        if ("w" in target) target.w = 0;
        return null;
      }
      target.setScalar(0);
      target.addScaledVector(v1, _v3$2.x);
      target.addScaledVector(v2, _v3$2.y);
      target.addScaledVector(v3, _v3$2.z);
      return target;
    }
    /**
     * Computes the value barycentrically interpolated for the given attribute and indices.
     *
     * @param {BufferAttribute} attr - The attribute to interpolate.
     * @param {number} i1 - Index of first vertex.
     * @param {number} i2 - Index of second vertex.
     * @param {number} i3 - Index of third vertex.
     * @param {Vector3} barycoord - The barycoordinate value to use to interpolate.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {Vector3} The interpolated attribute value.
     */
    static getInterpolatedAttribute(attr, i1, i2, i3, barycoord, target) {
      _v40.setScalar(0);
      _v41.setScalar(0);
      _v42.setScalar(0);
      _v40.fromBufferAttribute(attr, i1);
      _v41.fromBufferAttribute(attr, i2);
      _v42.fromBufferAttribute(attr, i3);
      target.setScalar(0);
      target.addScaledVector(_v40, barycoord.x);
      target.addScaledVector(_v41, barycoord.y);
      target.addScaledVector(_v42, barycoord.z);
      return target;
    }
    /**
     * Returns `true` if the triangle is oriented towards the given direction.
     *
     * @param {Vector3} a - The first corner of the triangle.
     * @param {Vector3} b - The second corner of the triangle.
     * @param {Vector3} c - The third corner of the triangle.
     * @param {Vector3} direction - The (normalized) direction vector.
     * @return {boolean} Whether the triangle is oriented towards the given direction or not.
     */
    static isFrontFacing(a, b, c, direction) {
      _v0$1$1.subVectors(c, b);
      _v1$3.subVectors(a, b);
      return _v0$1$1.cross(_v1$3).dot(direction) < 0 ? true : false;
    }
    /**
     * Sets the triangle's vertices by copying the given values.
     *
     * @param {Vector3} a - The first corner of the triangle.
     * @param {Vector3} b - The second corner of the triangle.
     * @param {Vector3} c - The third corner of the triangle.
     * @return {Triangle} A reference to this triangle.
     */
    set(a, b, c) {
      this.a.copy(a);
      this.b.copy(b);
      this.c.copy(c);
      return this;
    }
    /**
     * Sets the triangle's vertices by copying the given array values.
     *
     * @param {Array<Vector3>} points - An array with 3D points.
     * @param {number} i0 - The array index representing the first corner of the triangle.
     * @param {number} i1 - The array index representing the second corner of the triangle.
     * @param {number} i2 - The array index representing the third corner of the triangle.
     * @return {Triangle} A reference to this triangle.
     */
    setFromPointsAndIndices(points, i0, i1, i2) {
      this.a.copy(points[i0]);
      this.b.copy(points[i1]);
      this.c.copy(points[i2]);
      return this;
    }
    /**
     * Sets the triangle's vertices by copying the given attribute values.
     *
     * @param {BufferAttribute} attribute - A buffer attribute with 3D points data.
     * @param {number} i0 - The attribute index representing the first corner of the triangle.
     * @param {number} i1 - The attribute index representing the second corner of the triangle.
     * @param {number} i2 - The attribute index representing the third corner of the triangle.
     * @return {Triangle} A reference to this triangle.
     */
    setFromAttributeAndIndices(attribute, i0, i1, i2) {
      this.a.fromBufferAttribute(attribute, i0);
      this.b.fromBufferAttribute(attribute, i1);
      this.c.fromBufferAttribute(attribute, i2);
      return this;
    }
    /**
     * Returns a new triangle with copied values from this instance.
     *
     * @return {Triangle} A clone of this instance.
     */
    clone() {
      return new this.constructor().copy(this);
    }
    /**
     * Copies the values of the given triangle to this instance.
     *
     * @param {Triangle} triangle - The triangle to copy.
     * @return {Triangle} A reference to this triangle.
     */
    copy(triangle3) {
      this.a.copy(triangle3.a);
      this.b.copy(triangle3.b);
      this.c.copy(triangle3.c);
      return this;
    }
    /**
     * Computes the area of the triangle.
     *
     * @return {number} The triangle's area.
     */
    getArea() {
      _v0$1$1.subVectors(this.c, this.b);
      _v1$3.subVectors(this.a, this.b);
      return _v0$1$1.cross(_v1$3).length() * 0.5;
    }
    /**
     * Computes the midpoint of the triangle.
     *
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {Vector3} The triangle's midpoint.
     */
    getMidpoint(target) {
      return target.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
    }
    /**
     * Computes the normal of the triangle.
     *
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {Vector3} The triangle's normal.
     */
    getNormal(target) {
      return Triangle.getNormal(this.a, this.b, this.c, target);
    }
    /**
     * Computes a plane the triangle lies within.
     *
     * @param {Plane} target - The target vector that is used to store the method's result.
     * @return {Plane} The plane the triangle lies within.
     */
    getPlane(target) {
      return target.setFromCoplanarPoints(this.a, this.b, this.c);
    }
    /**
     * Computes a barycentric coordinates from the given vector.
     * Returns `null` if the triangle is degenerate.
     *
     * @param {Vector3} point - A point in 3D space.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {?Vector3} The barycentric coordinates for the given point
     */
    getBarycoord(point, target) {
      return Triangle.getBarycoord(point, this.a, this.b, this.c, target);
    }
    /**
     * Computes the value barycentrically interpolated for the given point on the
     * triangle. Returns `null` if the triangle is degenerate.
     *
     * @param {Vector3} point - Position of interpolated point.
     * @param {Vector3} v1 - Value to interpolate of first vertex.
     * @param {Vector3} v2 - Value to interpolate of second vertex.
     * @param {Vector3} v3 - Value to interpolate of third vertex.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {?Vector3} The interpolated value.
     */
    getInterpolation(point, v1, v2, v3, target) {
      return Triangle.getInterpolation(point, this.a, this.b, this.c, v1, v2, v3, target);
    }
    /**
     * Returns `true` if the given point, when projected onto the plane of the
     * triangle, lies within the triangle.
     *
     * @param {Vector3} point - The point in 3D space to test.
     * @return {boolean} Whether the given point, when projected onto the plane of the
     * triangle, lies within the triangle or not.
     */
    containsPoint(point) {
      return Triangle.containsPoint(point, this.a, this.b, this.c);
    }
    /**
     * Returns `true` if the triangle is oriented towards the given direction.
     *
     * @param {Vector3} direction - The (normalized) direction vector.
     * @return {boolean} Whether the triangle is oriented towards the given direction or not.
     */
    isFrontFacing(direction) {
      return Triangle.isFrontFacing(this.a, this.b, this.c, direction);
    }
    /**
     * Returns `true` if this triangle intersects with the given box.
     *
     * @param {Box3} box - The box to intersect.
     * @return {boolean} Whether this triangle intersects with the given box or not.
     */
    intersectsBox(box) {
      return box.intersectsTriangle(this);
    }
    /**
     * Returns the closest point on the triangle to the given point.
     *
     * @param {Vector3} p - The point to compute the closest point for.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {Vector3} The closest point on the triangle.
     */
    closestPointToPoint(p, target) {
      const a = this.a, b = this.b, c = this.c;
      let v, w;
      _vab.subVectors(b, a);
      _vac.subVectors(c, a);
      _vap.subVectors(p, a);
      const d1 = _vab.dot(_vap);
      const d2 = _vac.dot(_vap);
      if (d1 <= 0 && d2 <= 0) {
        return target.copy(a);
      }
      _vbp.subVectors(p, b);
      const d3 = _vab.dot(_vbp);
      const d4 = _vac.dot(_vbp);
      if (d3 >= 0 && d4 <= d3) {
        return target.copy(b);
      }
      const vc = d1 * d4 - d3 * d2;
      if (vc <= 0 && d1 >= 0 && d3 <= 0) {
        v = d1 / (d1 - d3);
        return target.copy(a).addScaledVector(_vab, v);
      }
      _vcp.subVectors(p, c);
      const d5 = _vab.dot(_vcp);
      const d6 = _vac.dot(_vcp);
      if (d6 >= 0 && d5 <= d6) {
        return target.copy(c);
      }
      const vb = d5 * d2 - d1 * d6;
      if (vb <= 0 && d2 >= 0 && d6 <= 0) {
        w = d2 / (d2 - d6);
        return target.copy(a).addScaledVector(_vac, w);
      }
      const va = d3 * d6 - d5 * d4;
      if (va <= 0 && d4 - d3 >= 0 && d5 - d6 >= 0) {
        _vbc.subVectors(c, b);
        w = (d4 - d3) / (d4 - d3 + (d5 - d6));
        return target.copy(b).addScaledVector(_vbc, w);
      }
      const denom = 1 / (va + vb + vc);
      v = vb * denom;
      w = vc * denom;
      return target.copy(a).addScaledVector(_vab, v).addScaledVector(_vac, w);
    }
    /**
     * Returns `true` if this triangle is equal with the given one.
     *
     * @param {Triangle} triangle - The triangle to test for equality.
     * @return {boolean} Whether this triangle is equal with the given one.
     */
    equals(triangle3) {
      return triangle3.a.equals(this.a) && triangle3.b.equals(this.b) && triangle3.c.equals(this.c);
    }
  }
  const _vector$9 = /* @__PURE__ */ new Vector3();
  const _vector2$1 = /* @__PURE__ */ new Vector2();
  let _id$2 = 0;
  class BufferAttribute {
    /**
     * Constructs a new buffer attribute.
     *
     * @param {TypedArray} array - The array holding the attribute data.
     * @param {number} itemSize - The item size.
     * @param {boolean} [normalized=false] - Whether the data are normalized or not.
     */
    constructor(array, itemSize, normalized = false) {
      if (Array.isArray(array)) {
        throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
      }
      this.isBufferAttribute = true;
      Object.defineProperty(this, "id", { value: _id$2++ });
      this.name = "";
      this.array = array;
      this.itemSize = itemSize;
      this.count = array !== void 0 ? array.length / itemSize : 0;
      this.normalized = normalized;
      this.usage = StaticDrawUsage;
      this.updateRanges = [];
      this.gpuType = FloatType;
      this.version = 0;
    }
    /**
     * A callback function that is executed after the renderer has transferred the attribute
     * array data to the GPU.
     */
    onUploadCallback() {
    }
    /**
     * Flag to indicate that this attribute has changed and should be re-sent to
     * the GPU. Set this to `true` when you modify the value of the array.
     *
     * @type {number}
     * @default false
     * @param {boolean} value
     */
    set needsUpdate(value) {
      if (value === true) this.version++;
    }
    /**
     * Sets the usage of this buffer attribute.
     *
     * @param {(StaticDrawUsage|DynamicDrawUsage|StreamDrawUsage|StaticReadUsage|DynamicReadUsage|StreamReadUsage|StaticCopyUsage|DynamicCopyUsage|StreamCopyUsage)} value - The usage to set.
     * @return {BufferAttribute} A reference to this buffer attribute.
     */
    setUsage(value) {
      this.usage = value;
      return this;
    }
    /**
     * Adds a range of data in the data array to be updated on the GPU.
     *
     * @param {number} start - Position at which to start update.
     * @param {number} count - The number of components to update.
     */
    addUpdateRange(start, count) {
      this.updateRanges.push({ start, count });
    }
    /**
     * Clears the update ranges.
     */
    clearUpdateRanges() {
      this.updateRanges.length = 0;
    }
    /**
     * Copies the values of the given buffer attribute to this instance.
     *
     * @param {BufferAttribute} source - The buffer attribute to copy.
     * @return {BufferAttribute} A reference to this instance.
     */
    copy(source) {
      this.name = source.name;
      this.array = new source.array.constructor(source.array);
      this.itemSize = source.itemSize;
      this.count = source.count;
      this.normalized = source.normalized;
      this.usage = source.usage;
      this.gpuType = source.gpuType;
      return this;
    }
    /**
     * Copies a vector from the given buffer attribute to this one. The start
     * and destination position in the attribute buffers are represented by the
     * given indices.
     *
     * @param {number} index1 - The destination index into this buffer attribute.
     * @param {BufferAttribute} attribute - The buffer attribute to copy from.
     * @param {number} index2 - The source index into the given buffer attribute.
     * @return {BufferAttribute} A reference to this instance.
     */
    copyAt(index1, attribute, index2) {
      index1 *= this.itemSize;
      index2 *= attribute.itemSize;
      for (let i = 0, l = this.itemSize; i < l; i++) {
        this.array[index1 + i] = attribute.array[index2 + i];
      }
      return this;
    }
    /**
     * Copies the given array data into this buffer attribute.
     *
     * @param {(TypedArray|Array)} array - The array to copy.
     * @return {BufferAttribute} A reference to this instance.
     */
    copyArray(array) {
      this.array.set(array);
      return this;
    }
    /**
     * Applies the given 3x3 matrix to the given attribute. Works with
     * item size `2` and `3`.
     *
     * @param {Matrix3} m - The matrix to apply.
     * @return {BufferAttribute} A reference to this instance.
     */
    applyMatrix3(m) {
      if (this.itemSize === 2) {
        for (let i = 0, l = this.count; i < l; i++) {
          _vector2$1.fromBufferAttribute(this, i);
          _vector2$1.applyMatrix3(m);
          this.setXY(i, _vector2$1.x, _vector2$1.y);
        }
      } else if (this.itemSize === 3) {
        for (let i = 0, l = this.count; i < l; i++) {
          _vector$9.fromBufferAttribute(this, i);
          _vector$9.applyMatrix3(m);
          this.setXYZ(i, _vector$9.x, _vector$9.y, _vector$9.z);
        }
      }
      return this;
    }
    /**
     * Applies the given 4x4 matrix to the given attribute. Only works with
     * item size `3`.
     *
     * @param {Matrix4} m - The matrix to apply.
     * @return {BufferAttribute} A reference to this instance.
     */
    applyMatrix4(m) {
      for (let i = 0, l = this.count; i < l; i++) {
        _vector$9.fromBufferAttribute(this, i);
        _vector$9.applyMatrix4(m);
        this.setXYZ(i, _vector$9.x, _vector$9.y, _vector$9.z);
      }
      return this;
    }
    /**
     * Applies the given 3x3 normal matrix to the given attribute. Only works with
     * item size `3`.
     *
     * @param {Matrix3} m - The normal matrix to apply.
     * @return {BufferAttribute} A reference to this instance.
     */
    applyNormalMatrix(m) {
      for (let i = 0, l = this.count; i < l; i++) {
        _vector$9.fromBufferAttribute(this, i);
        _vector$9.applyNormalMatrix(m);
        this.setXYZ(i, _vector$9.x, _vector$9.y, _vector$9.z);
      }
      return this;
    }
    /**
     * Applies the given 4x4 matrix to the given attribute. Only works with
     * item size `3` and with direction vectors.
     *
     * @param {Matrix4} m - The matrix to apply.
     * @return {BufferAttribute} A reference to this instance.
     */
    transformDirection(m) {
      for (let i = 0, l = this.count; i < l; i++) {
        _vector$9.fromBufferAttribute(this, i);
        _vector$9.transformDirection(m);
        this.setXYZ(i, _vector$9.x, _vector$9.y, _vector$9.z);
      }
      return this;
    }
    /**
     * Sets the given array data in the buffer attribute.
     *
     * @param {(TypedArray|Array)} value - The array data to set.
     * @param {number} [offset=0] - The offset in this buffer attribute's array.
     * @return {BufferAttribute} A reference to this instance.
     */
    set(value, offset = 0) {
      this.array.set(value, offset);
      return this;
    }
    /**
     * Returns the given component of the vector at the given index.
     *
     * @param {number} index - The index into the buffer attribute.
     * @param {number} component - The component index.
     * @return {number} The returned value.
     */
    getComponent(index, component) {
      let value = this.array[index * this.itemSize + component];
      if (this.normalized) value = denormalize(value, this.array);
      return value;
    }
    /**
     * Sets the given value to the given component of the vector at the given index.
     *
     * @param {number} index - The index into the buffer attribute.
     * @param {number} component - The component index.
     * @param {number} value - The value to set.
     * @return {BufferAttribute} A reference to this instance.
     */
    setComponent(index, component, value) {
      if (this.normalized) value = normalize(value, this.array);
      this.array[index * this.itemSize + component] = value;
      return this;
    }
    /**
     * Returns the x component of the vector at the given index.
     *
     * @param {number} index - The index into the buffer attribute.
     * @return {number} The x component.
     */
    getX(index) {
      let x = this.array[index * this.itemSize];
      if (this.normalized) x = denormalize(x, this.array);
      return x;
    }
    /**
     * Sets the x component of the vector at the given index.
     *
     * @param {number} index - The index into the buffer attribute.
     * @param {number} x - The value to set.
     * @return {BufferAttribute} A reference to this instance.
     */
    setX(index, x) {
      if (this.normalized) x = normalize(x, this.array);
      this.array[index * this.itemSize] = x;
      return this;
    }
    /**
     * Returns the y component of the vector at the given index.
     *
     * @param {number} index - The index into the buffer attribute.
     * @return {number} The y component.
     */
    getY(index) {
      let y = this.array[index * this.itemSize + 1];
      if (this.normalized) y = denormalize(y, this.array);
      return y;
    }
    /**
     * Sets the y component of the vector at the given index.
     *
     * @param {number} index - The index into the buffer attribute.
     * @param {number} y - The value to set.
     * @return {BufferAttribute} A reference to this instance.
     */
    setY(index, y) {
      if (this.normalized) y = normalize(y, this.array);
      this.array[index * this.itemSize + 1] = y;
      return this;
    }
    /**
     * Returns the z component of the vector at the given index.
     *
     * @param {number} index - The index into the buffer attribute.
     * @return {number} The z component.
     */
    getZ(index) {
      let z = this.array[index * this.itemSize + 2];
      if (this.normalized) z = denormalize(z, this.array);
      return z;
    }
    /**
     * Sets the z component of the vector at the given index.
     *
     * @param {number} index - The index into the buffer attribute.
     * @param {number} z - The value to set.
     * @return {BufferAttribute} A reference to this instance.
     */
    setZ(index, z) {
      if (this.normalized) z = normalize(z, this.array);
      this.array[index * this.itemSize + 2] = z;
      return this;
    }
    /**
     * Returns the w component of the vector at the given index.
     *
     * @param {number} index - The index into the buffer attribute.
     * @return {number} The w component.
     */
    getW(index) {
      let w = this.array[index * this.itemSize + 3];
      if (this.normalized) w = denormalize(w, this.array);
      return w;
    }
    /**
     * Sets the w component of the vector at the given index.
     *
     * @param {number} index - The index into the buffer attribute.
     * @param {number} w - The value to set.
     * @return {BufferAttribute} A reference to this instance.
     */
    setW(index, w) {
      if (this.normalized) w = normalize(w, this.array);
      this.array[index * this.itemSize + 3] = w;
      return this;
    }
    /**
     * Sets the x and y component of the vector at the given index.
     *
     * @param {number} index - The index into the buffer attribute.
     * @param {number} x - The value for the x component to set.
     * @param {number} y - The value for the y component to set.
     * @return {BufferAttribute} A reference to this instance.
     */
    setXY(index, x, y) {
      index *= this.itemSize;
      if (this.normalized) {
        x = normalize(x, this.array);
        y = normalize(y, this.array);
      }
      this.array[index + 0] = x;
      this.array[index + 1] = y;
      return this;
    }
    /**
     * Sets the x, y and z component of the vector at the given index.
     *
     * @param {number} index - The index into the buffer attribute.
     * @param {number} x - The value for the x component to set.
     * @param {number} y - The value for the y component to set.
     * @param {number} z - The value for the z component to set.
     * @return {BufferAttribute} A reference to this instance.
     */
    setXYZ(index, x, y, z) {
      index *= this.itemSize;
      if (this.normalized) {
        x = normalize(x, this.array);
        y = normalize(y, this.array);
        z = normalize(z, this.array);
      }
      this.array[index + 0] = x;
      this.array[index + 1] = y;
      this.array[index + 2] = z;
      return this;
    }
    /**
     * Sets the x, y, z and w component of the vector at the given index.
     *
     * @param {number} index - The index into the buffer attribute.
     * @param {number} x - The value for the x component to set.
     * @param {number} y - The value for the y component to set.
     * @param {number} z - The value for the z component to set.
     * @param {number} w - The value for the w component to set.
     * @return {BufferAttribute} A reference to this instance.
     */
    setXYZW(index, x, y, z, w) {
      index *= this.itemSize;
      if (this.normalized) {
        x = normalize(x, this.array);
        y = normalize(y, this.array);
        z = normalize(z, this.array);
        w = normalize(w, this.array);
      }
      this.array[index + 0] = x;
      this.array[index + 1] = y;
      this.array[index + 2] = z;
      this.array[index + 3] = w;
      return this;
    }
    /**
     * Sets the given callback function that is executed after the Renderer has transferred
     * the attribute array data to the GPU. Can be used to perform clean-up operations after
     * the upload when attribute data are not needed anymore on the CPU side.
     *
     * @param {Function} callback - The `onUpload()` callback.
     * @return {BufferAttribute} A reference to this instance.
     */
    onUpload(callback) {
      this.onUploadCallback = callback;
      return this;
    }
    /**
     * Returns a new buffer attribute with copied values from this instance.
     *
     * @return {BufferAttribute} A clone of this instance.
     */
    clone() {
      return new this.constructor(this.array, this.itemSize).copy(this);
    }
    /**
     * Serializes the buffer attribute into JSON.
     *
     * @return {Object} A JSON object representing the serialized buffer attribute.
     */
    toJSON() {
      const data = {
        itemSize: this.itemSize,
        type: this.array.constructor.name,
        array: Array.from(this.array),
        normalized: this.normalized
      };
      if (this.name !== "") data.name = this.name;
      if (this.usage !== StaticDrawUsage) data.usage = this.usage;
      return data;
    }
  }
  class Uint16BufferAttribute extends BufferAttribute {
    /**
     * Constructs a new buffer attribute.
     *
     * @param {(Array<number>|Uint16Array)} array - The array holding the attribute data.
     * @param {number} itemSize - The item size.
     * @param {boolean} [normalized=false] - Whether the data are normalized or not.
     */
    constructor(array, itemSize, normalized) {
      super(new Uint16Array(array), itemSize, normalized);
    }
  }
  class Uint32BufferAttribute extends BufferAttribute {
    /**
     * Constructs a new buffer attribute.
     *
     * @param {(Array<number>|Uint32Array)} array - The array holding the attribute data.
     * @param {number} itemSize - The item size.
     * @param {boolean} [normalized=false] - Whether the data are normalized or not.
     */
    constructor(array, itemSize, normalized) {
      super(new Uint32Array(array), itemSize, normalized);
    }
  }
  class Float32BufferAttribute extends BufferAttribute {
    /**
     * Constructs a new buffer attribute.
     *
     * @param {(Array<number>|Float32Array)} array - The array holding the attribute data.
     * @param {number} itemSize - The item size.
     * @param {boolean} [normalized=false] - Whether the data are normalized or not.
     */
    constructor(array, itemSize, normalized) {
      super(new Float32Array(array), itemSize, normalized);
    }
  }
  let _id$1 = 0;
  const _m1 = /* @__PURE__ */ new Matrix4();
  const _obj = /* @__PURE__ */ new Object3D();
  const _offset = /* @__PURE__ */ new Vector3();
  const _box$2 = /* @__PURE__ */ new Box3();
  const _boxMorphTargets = /* @__PURE__ */ new Box3();
  const _vector$8 = /* @__PURE__ */ new Vector3();
  class BufferGeometry extends EventDispatcher {
    /**
     * Constructs a new geometry.
     */
    constructor() {
      super();
      this.isBufferGeometry = true;
      Object.defineProperty(this, "id", { value: _id$1++ });
      this.uuid = generateUUID();
      this.name = "";
      this.type = "BufferGeometry";
      this.index = null;
      this.indirect = null;
      this.attributes = {};
      this.morphAttributes = {};
      this.morphTargetsRelative = false;
      this.groups = [];
      this.boundingBox = null;
      this.boundingSphere = null;
      this.drawRange = { start: 0, count: Infinity };
      this.userData = {};
    }
    /**
     * Returns the index of this geometry.
     *
     * @return {?BufferAttribute} The index. Returns `null` if no index is defined.
     */
    getIndex() {
      return this.index;
    }
    /**
     * Sets the given index to this geometry.
     *
     * @param {Array<number>|BufferAttribute} index - The index to set.
     * @return {BufferGeometry} A reference to this instance.
     */
    setIndex(index) {
      if (Array.isArray(index)) {
        this.index = new (arrayNeedsUint32(index) ? Uint32BufferAttribute : Uint16BufferAttribute)(index, 1);
      } else {
        this.index = index;
      }
      return this;
    }
    /**
     * Sets the given indirect attribute to this geometry.
     *
     * @param {BufferAttribute} indirect - The attribute holding indirect draw calls.
     * @return {BufferGeometry} A reference to this instance.
     */
    setIndirect(indirect) {
      this.indirect = indirect;
      return this;
    }
    /**
     * Returns the indirect attribute of this geometry.
     *
     * @return {?BufferAttribute} The indirect attribute. Returns `null` if no indirect attribute is defined.
     */
    getIndirect() {
      return this.indirect;
    }
    /**
     * Returns the buffer attribute for the given name.
     *
     * @param {string} name - The attribute name.
     * @return {BufferAttribute|InterleavedBufferAttribute|undefined} The buffer attribute.
     * Returns `undefined` if not attribute has been found.
     */
    getAttribute(name) {
      return this.attributes[name];
    }
    /**
     * Sets the given attribute for the given name.
     *
     * @param {string} name - The attribute name.
     * @param {BufferAttribute|InterleavedBufferAttribute} attribute - The attribute to set.
     * @return {BufferGeometry} A reference to this instance.
     */
    setAttribute(name, attribute) {
      this.attributes[name] = attribute;
      return this;
    }
    /**
     * Deletes the attribute for the given name.
     *
     * @param {string} name - The attribute name to delete.
     * @return {BufferGeometry} A reference to this instance.
     */
    deleteAttribute(name) {
      delete this.attributes[name];
      return this;
    }
    /**
     * Returns `true` if this geometry has an attribute for the given name.
     *
     * @param {string} name - The attribute name.
     * @return {boolean} Whether this geometry has an attribute for the given name or not.
     */
    hasAttribute(name) {
      return this.attributes[name] !== void 0;
    }
    /**
     * Adds a group to this geometry.
     *
     * @param {number} start - The first element in this draw call. That is the first
     * vertex for non-indexed geometry, otherwise the first triangle index.
     * @param {number} count - Specifies how many vertices (or indices) are part of this group.
     * @param {number} [materialIndex=0] - The material array index to use.
     */
    addGroup(start, count, materialIndex = 0) {
      this.groups.push({
        start,
        count,
        materialIndex
      });
    }
    /**
     * Clears all groups.
     */
    clearGroups() {
      this.groups = [];
    }
    /**
     * Sets the draw range for this geometry.
     *
     * @param {number} start - The first vertex for non-indexed geometry, otherwise the first triangle index.
     * @param {number} count - For non-indexed BufferGeometry, `count` is the number of vertices to render.
     * For indexed BufferGeometry, `count` is the number of indices to render.
     */
    setDrawRange(start, count) {
      this.drawRange.start = start;
      this.drawRange.count = count;
    }
    /**
     * Applies the given 4x4 transformation matrix to the geometry.
     *
     * @param {Matrix4} matrix - The matrix to apply.
     * @return {BufferGeometry} A reference to this instance.
     */
    applyMatrix4(matrix) {
      const position = this.attributes.position;
      if (position !== void 0) {
        position.applyMatrix4(matrix);
        position.needsUpdate = true;
      }
      const normal = this.attributes.normal;
      if (normal !== void 0) {
        const normalMatrix = new Matrix3().getNormalMatrix(matrix);
        normal.applyNormalMatrix(normalMatrix);
        normal.needsUpdate = true;
      }
      const tangent = this.attributes.tangent;
      if (tangent !== void 0) {
        tangent.transformDirection(matrix);
        tangent.needsUpdate = true;
      }
      if (this.boundingBox !== null) {
        this.computeBoundingBox();
      }
      if (this.boundingSphere !== null) {
        this.computeBoundingSphere();
      }
      return this;
    }
    /**
     * Applies the rotation represented by the Quaternion to the geometry.
     *
     * @param {Quaternion} q - The Quaternion to apply.
     * @return {BufferGeometry} A reference to this instance.
     */
    applyQuaternion(q) {
      _m1.makeRotationFromQuaternion(q);
      this.applyMatrix4(_m1);
      return this;
    }
    /**
     * Rotates the geometry about the X axis. This is typically done as a one time
     * operation, and not during a loop. Use {@link Object3D#rotation} for typical
     * real-time mesh rotation.
     *
     * @param {number} angle - The angle in radians.
     * @return {BufferGeometry} A reference to this instance.
     */
    rotateX(angle) {
      _m1.makeRotationX(angle);
      this.applyMatrix4(_m1);
      return this;
    }
    /**
     * Rotates the geometry about the Y axis. This is typically done as a one time
     * operation, and not during a loop. Use {@link Object3D#rotation} for typical
     * real-time mesh rotation.
     *
     * @param {number} angle - The angle in radians.
     * @return {BufferGeometry} A reference to this instance.
     */
    rotateY(angle) {
      _m1.makeRotationY(angle);
      this.applyMatrix4(_m1);
      return this;
    }
    /**
     * Rotates the geometry about the Z axis. This is typically done as a one time
     * operation, and not during a loop. Use {@link Object3D#rotation} for typical
     * real-time mesh rotation.
     *
     * @param {number} angle - The angle in radians.
     * @return {BufferGeometry} A reference to this instance.
     */
    rotateZ(angle) {
      _m1.makeRotationZ(angle);
      this.applyMatrix4(_m1);
      return this;
    }
    /**
     * Translates the geometry. This is typically done as a one time
     * operation, and not during a loop. Use {@link Object3D#position} for typical
     * real-time mesh rotation.
     *
     * @param {number} x - The x offset.
     * @param {number} y - The y offset.
     * @param {number} z - The z offset.
     * @return {BufferGeometry} A reference to this instance.
     */
    translate(x, y, z) {
      _m1.makeTranslation(x, y, z);
      this.applyMatrix4(_m1);
      return this;
    }
    /**
     * Scales the geometry. This is typically done as a one time
     * operation, and not during a loop. Use {@link Object3D#scale} for typical
     * real-time mesh rotation.
     *
     * @param {number} x - The x scale.
     * @param {number} y - The y scale.
     * @param {number} z - The z scale.
     * @return {BufferGeometry} A reference to this instance.
     */
    scale(x, y, z) {
      _m1.makeScale(x, y, z);
      this.applyMatrix4(_m1);
      return this;
    }
    /**
     * Rotates the geometry to face a point in 3D space. This is typically done as a one time
     * operation, and not during a loop. Use {@link Object3D#lookAt} for typical
     * real-time mesh rotation.
     *
     * @param {Vector3} vector - The target point.
     * @return {BufferGeometry} A reference to this instance.
     */
    lookAt(vector) {
      _obj.lookAt(vector);
      _obj.updateMatrix();
      this.applyMatrix4(_obj.matrix);
      return this;
    }
    /**
     * Center the geometry based on its bounding box.
     *
     * @return {BufferGeometry} A reference to this instance.
     */
    center() {
      this.computeBoundingBox();
      this.boundingBox.getCenter(_offset).negate();
      this.translate(_offset.x, _offset.y, _offset.z);
      return this;
    }
    /**
     * Defines a geometry by creating a `position` attribute based on the given array of points. The array
     * can hold 2D or 3D vectors. When using two-dimensional data, the `z` coordinate for all vertices is
     * set to `0`.
     *
     * If the method is used with an existing `position` attribute, the vertex data are overwritten with the
     * data from the array. The length of the array must match the vertex count.
     *
     * @param {Array<Vector2>|Array<Vector3>} points - The points.
     * @return {BufferGeometry} A reference to this instance.
     */
    setFromPoints(points) {
      const positionAttribute = this.getAttribute("position");
      if (positionAttribute === void 0) {
        const position = [];
        for (let i = 0, l = points.length; i < l; i++) {
          const point = points[i];
          position.push(point.x, point.y, point.z || 0);
        }
        this.setAttribute("position", new Float32BufferAttribute(position, 3));
      } else {
        const l = Math.min(points.length, positionAttribute.count);
        for (let i = 0; i < l; i++) {
          const point = points[i];
          positionAttribute.setXYZ(i, point.x, point.y, point.z || 0);
        }
        if (points.length > positionAttribute.count) {
          console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.");
        }
        positionAttribute.needsUpdate = true;
      }
      return this;
    }
    /**
     * Computes the bounding box of the geometry, and updates the `boundingBox` member.
     * The bounding box is not computed by the engine; it must be computed by your app.
     * You may need to recompute the bounding box if the geometry vertices are modified.
     */
    computeBoundingBox() {
      if (this.boundingBox === null) {
        this.boundingBox = new Box3();
      }
      const position = this.attributes.position;
      const morphAttributesPosition = this.morphAttributes.position;
      if (position && position.isGLBufferAttribute) {
        console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this);
        this.boundingBox.set(
          new Vector3(-Infinity, -Infinity, -Infinity),
          new Vector3(Infinity, Infinity, Infinity)
        );
        return;
      }
      if (position !== void 0) {
        this.boundingBox.setFromBufferAttribute(position);
        if (morphAttributesPosition) {
          for (let i = 0, il = morphAttributesPosition.length; i < il; i++) {
            const morphAttribute = morphAttributesPosition[i];
            _box$2.setFromBufferAttribute(morphAttribute);
            if (this.morphTargetsRelative) {
              _vector$8.addVectors(this.boundingBox.min, _box$2.min);
              this.boundingBox.expandByPoint(_vector$8);
              _vector$8.addVectors(this.boundingBox.max, _box$2.max);
              this.boundingBox.expandByPoint(_vector$8);
            } else {
              this.boundingBox.expandByPoint(_box$2.min);
              this.boundingBox.expandByPoint(_box$2.max);
            }
          }
        }
      } else {
        this.boundingBox.makeEmpty();
      }
      if (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) {
        console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
      }
    }
    /**
     * Computes the bounding sphere of the geometry, and updates the `boundingSphere` member.
     * The engine automatically computes the bounding sphere when it is needed, e.g., for ray casting or view frustum culling.
     * You may need to recompute the bounding sphere if the geometry vertices are modified.
     */
    computeBoundingSphere() {
      if (this.boundingSphere === null) {
        this.boundingSphere = new Sphere();
      }
      const position = this.attributes.position;
      const morphAttributesPosition = this.morphAttributes.position;
      if (position && position.isGLBufferAttribute) {
        console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this);
        this.boundingSphere.set(new Vector3(), Infinity);
        return;
      }
      if (position) {
        const center = this.boundingSphere.center;
        _box$2.setFromBufferAttribute(position);
        if (morphAttributesPosition) {
          for (let i = 0, il = morphAttributesPosition.length; i < il; i++) {
            const morphAttribute = morphAttributesPosition[i];
            _boxMorphTargets.setFromBufferAttribute(morphAttribute);
            if (this.morphTargetsRelative) {
              _vector$8.addVectors(_box$2.min, _boxMorphTargets.min);
              _box$2.expandByPoint(_vector$8);
              _vector$8.addVectors(_box$2.max, _boxMorphTargets.max);
              _box$2.expandByPoint(_vector$8);
            } else {
              _box$2.expandByPoint(_boxMorphTargets.min);
              _box$2.expandByPoint(_boxMorphTargets.max);
            }
          }
        }
        _box$2.getCenter(center);
        let maxRadiusSq = 0;
        for (let i = 0, il = position.count; i < il; i++) {
          _vector$8.fromBufferAttribute(position, i);
          maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector$8));
        }
        if (morphAttributesPosition) {
          for (let i = 0, il = morphAttributesPosition.length; i < il; i++) {
            const morphAttribute = morphAttributesPosition[i];
            const morphTargetsRelative = this.morphTargetsRelative;
            for (let j = 0, jl = morphAttribute.count; j < jl; j++) {
              _vector$8.fromBufferAttribute(morphAttribute, j);
              if (morphTargetsRelative) {
                _offset.fromBufferAttribute(position, j);
                _vector$8.add(_offset);
              }
              maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector$8));
            }
          }
        }
        this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
        if (isNaN(this.boundingSphere.radius)) {
          console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
        }
      }
    }
    /**
     * Calculates and adds a tangent attribute to this geometry.
     *
     * The computation is only supported for indexed geometries and if position, normal, and uv attributes
     * are defined. When using a tangent space normal map, prefer the MikkTSpace algorithm provided by
     * {@link BufferGeometryUtils#computeMikkTSpaceTangents} instead.
     */
    computeTangents() {
      const index = this.index;
      const attributes = this.attributes;
      if (index === null || attributes.position === void 0 || attributes.normal === void 0 || attributes.uv === void 0) {
        console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
        return;
      }
      const positionAttribute = attributes.position;
      const normalAttribute = attributes.normal;
      const uvAttribute = attributes.uv;
      if (this.hasAttribute("tangent") === false) {
        this.setAttribute("tangent", new BufferAttribute(new Float32Array(4 * positionAttribute.count), 4));
      }
      const tangentAttribute = this.getAttribute("tangent");
      const tan1 = [], tan2 = [];
      for (let i = 0; i < positionAttribute.count; i++) {
        tan1[i] = new Vector3();
        tan2[i] = new Vector3();
      }
      const vA = new Vector3(), vB = new Vector3(), vC = new Vector3(), uvA = new Vector2(), uvB = new Vector2(), uvC = new Vector2(), sdir = new Vector3(), tdir = new Vector3();
      function handleTriangle(a, b, c) {
        vA.fromBufferAttribute(positionAttribute, a);
        vB.fromBufferAttribute(positionAttribute, b);
        vC.fromBufferAttribute(positionAttribute, c);
        uvA.fromBufferAttribute(uvAttribute, a);
        uvB.fromBufferAttribute(uvAttribute, b);
        uvC.fromBufferAttribute(uvAttribute, c);
        vB.sub(vA);
        vC.sub(vA);
        uvB.sub(uvA);
        uvC.sub(uvA);
        const r = 1 / (uvB.x * uvC.y - uvC.x * uvB.y);
        if (!isFinite(r)) return;
        sdir.copy(vB).multiplyScalar(uvC.y).addScaledVector(vC, -uvB.y).multiplyScalar(r);
        tdir.copy(vC).multiplyScalar(uvB.x).addScaledVector(vB, -uvC.x).multiplyScalar(r);
        tan1[a].add(sdir);
        tan1[b].add(sdir);
        tan1[c].add(sdir);
        tan2[a].add(tdir);
        tan2[b].add(tdir);
        tan2[c].add(tdir);
      }
      let groups = this.groups;
      if (groups.length === 0) {
        groups = [{
          start: 0,
          count: index.count
        }];
      }
      for (let i = 0, il = groups.length; i < il; ++i) {
        const group = groups[i];
        const start = group.start;
        const count = group.count;
        for (let j = start, jl = start + count; j < jl; j += 3) {
          handleTriangle(
            index.getX(j + 0),
            index.getX(j + 1),
            index.getX(j + 2)
          );
        }
      }
      const tmp = new Vector3(), tmp2 = new Vector3();
      const n = new Vector3(), n2 = new Vector3();
      function handleVertex(v) {
        n.fromBufferAttribute(normalAttribute, v);
        n2.copy(n);
        const t = tan1[v];
        tmp.copy(t);
        tmp.sub(n.multiplyScalar(n.dot(t))).normalize();
        tmp2.crossVectors(n2, t);
        const test = tmp2.dot(tan2[v]);
        const w = test < 0 ? -1 : 1;
        tangentAttribute.setXYZW(v, tmp.x, tmp.y, tmp.z, w);
      }
      for (let i = 0, il = groups.length; i < il; ++i) {
        const group = groups[i];
        const start = group.start;
        const count = group.count;
        for (let j = start, jl = start + count; j < jl; j += 3) {
          handleVertex(index.getX(j + 0));
          handleVertex(index.getX(j + 1));
          handleVertex(index.getX(j + 2));
        }
      }
    }
    /**
     * Computes vertex normals for the given vertex data. For indexed geometries, the method sets
     * each vertex normal to be the average of the face normals of the faces that share that vertex.
     * For non-indexed geometries, vertices are not shared, and the method sets each vertex normal
     * to be the same as the face normal.
     */
    computeVertexNormals() {
      const index = this.index;
      const positionAttribute = this.getAttribute("position");
      if (positionAttribute !== void 0) {
        let normalAttribute = this.getAttribute("normal");
        if (normalAttribute === void 0) {
          normalAttribute = new BufferAttribute(new Float32Array(positionAttribute.count * 3), 3);
          this.setAttribute("normal", normalAttribute);
        } else {
          for (let i = 0, il = normalAttribute.count; i < il; i++) {
            normalAttribute.setXYZ(i, 0, 0, 0);
          }
        }
        const pA = new Vector3(), pB = new Vector3(), pC = new Vector3();
        const nA = new Vector3(), nB = new Vector3(), nC = new Vector3();
        const cb = new Vector3(), ab = new Vector3();
        if (index) {
          for (let i = 0, il = index.count; i < il; i += 3) {
            const vA = index.getX(i + 0);
            const vB = index.getX(i + 1);
            const vC = index.getX(i + 2);
            pA.fromBufferAttribute(positionAttribute, vA);
            pB.fromBufferAttribute(positionAttribute, vB);
            pC.fromBufferAttribute(positionAttribute, vC);
            cb.subVectors(pC, pB);
            ab.subVectors(pA, pB);
            cb.cross(ab);
            nA.fromBufferAttribute(normalAttribute, vA);
            nB.fromBufferAttribute(normalAttribute, vB);
            nC.fromBufferAttribute(normalAttribute, vC);
            nA.add(cb);
            nB.add(cb);
            nC.add(cb);
            normalAttribute.setXYZ(vA, nA.x, nA.y, nA.z);
            normalAttribute.setXYZ(vB, nB.x, nB.y, nB.z);
            normalAttribute.setXYZ(vC, nC.x, nC.y, nC.z);
          }
        } else {
          for (let i = 0, il = positionAttribute.count; i < il; i += 3) {
            pA.fromBufferAttribute(positionAttribute, i + 0);
            pB.fromBufferAttribute(positionAttribute, i + 1);
            pC.fromBufferAttribute(positionAttribute, i + 2);
            cb.subVectors(pC, pB);
            ab.subVectors(pA, pB);
            cb.cross(ab);
            normalAttribute.setXYZ(i + 0, cb.x, cb.y, cb.z);
            normalAttribute.setXYZ(i + 1, cb.x, cb.y, cb.z);
            normalAttribute.setXYZ(i + 2, cb.x, cb.y, cb.z);
          }
        }
        this.normalizeNormals();
        normalAttribute.needsUpdate = true;
      }
    }
    /**
     * Ensures every normal vector in a geometry will have a magnitude of `1`. This will
     * correct lighting on the geometry surfaces.
     */
    normalizeNormals() {
      const normals = this.attributes.normal;
      for (let i = 0, il = normals.count; i < il; i++) {
        _vector$8.fromBufferAttribute(normals, i);
        _vector$8.normalize();
        normals.setXYZ(i, _vector$8.x, _vector$8.y, _vector$8.z);
      }
    }
    /**
     * Return a new non-index version of this indexed geometry. If the geometry
     * is already non-indexed, the method is a NOOP.
     *
     * @return {BufferGeometry} The non-indexed version of this indexed geometry.
     */
    toNonIndexed() {
      function convertBufferAttribute(attribute, indices2) {
        const array = attribute.array;
        const itemSize = attribute.itemSize;
        const normalized = attribute.normalized;
        const array2 = new array.constructor(indices2.length * itemSize);
        let index = 0, index2 = 0;
        for (let i = 0, l = indices2.length; i < l; i++) {
          if (attribute.isInterleavedBufferAttribute) {
            index = indices2[i] * attribute.data.stride + attribute.offset;
          } else {
            index = indices2[i] * itemSize;
          }
          for (let j = 0; j < itemSize; j++) {
            array2[index2++] = array[index++];
          }
        }
        return new BufferAttribute(array2, itemSize, normalized);
      }
      if (this.index === null) {
        console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.");
        return this;
      }
      const geometry2 = new BufferGeometry();
      const indices = this.index.array;
      const attributes = this.attributes;
      for (const name in attributes) {
        const attribute = attributes[name];
        const newAttribute = convertBufferAttribute(attribute, indices);
        geometry2.setAttribute(name, newAttribute);
      }
      const morphAttributes = this.morphAttributes;
      for (const name in morphAttributes) {
        const morphArray = [];
        const morphAttribute = morphAttributes[name];
        for (let i = 0, il = morphAttribute.length; i < il; i++) {
          const attribute = morphAttribute[i];
          const newAttribute = convertBufferAttribute(attribute, indices);
          morphArray.push(newAttribute);
        }
        geometry2.morphAttributes[name] = morphArray;
      }
      geometry2.morphTargetsRelative = this.morphTargetsRelative;
      const groups = this.groups;
      for (let i = 0, l = groups.length; i < l; i++) {
        const group = groups[i];
        geometry2.addGroup(group.start, group.count, group.materialIndex);
      }
      return geometry2;
    }
    /**
     * Serializes the geometry into JSON.
     *
     * @return {Object} A JSON object representing the serialized geometry.
     */
    toJSON() {
      const data = {
        metadata: {
          version: 4.7,
          type: "BufferGeometry",
          generator: "BufferGeometry.toJSON"
        }
      };
      data.uuid = this.uuid;
      data.type = this.type;
      if (this.name !== "") data.name = this.name;
      if (Object.keys(this.userData).length > 0) data.userData = this.userData;
      if (this.parameters !== void 0) {
        const parameters = this.parameters;
        for (const key in parameters) {
          if (parameters[key] !== void 0) data[key] = parameters[key];
        }
        return data;
      }
      data.data = { attributes: {} };
      const index = this.index;
      if (index !== null) {
        data.data.index = {
          type: index.array.constructor.name,
          array: Array.prototype.slice.call(index.array)
        };
      }
      const attributes = this.attributes;
      for (const key in attributes) {
        const attribute = attributes[key];
        data.data.attributes[key] = attribute.toJSON(data.data);
      }
      const morphAttributes = {};
      let hasMorphAttributes = false;
      for (const key in this.morphAttributes) {
        const attributeArray = this.morphAttributes[key];
        const array = [];
        for (let i = 0, il = attributeArray.length; i < il; i++) {
          const attribute = attributeArray[i];
          array.push(attribute.toJSON(data.data));
        }
        if (array.length > 0) {
          morphAttributes[key] = array;
          hasMorphAttributes = true;
        }
      }
      if (hasMorphAttributes) {
        data.data.morphAttributes = morphAttributes;
        data.data.morphTargetsRelative = this.morphTargetsRelative;
      }
      const groups = this.groups;
      if (groups.length > 0) {
        data.data.groups = JSON.parse(JSON.stringify(groups));
      }
      const boundingSphere = this.boundingSphere;
      if (boundingSphere !== null) {
        data.data.boundingSphere = boundingSphere.toJSON();
      }
      return data;
    }
    /**
     * Returns a new geometry with copied values from this instance.
     *
     * @return {BufferGeometry} A clone of this instance.
     */
    clone() {
      return new this.constructor().copy(this);
    }
    /**
     * Copies the values of the given geometry to this instance.
     *
     * @param {BufferGeometry} source - The geometry to copy.
     * @return {BufferGeometry} A reference to this instance.
     */
    copy(source) {
      this.index = null;
      this.attributes = {};
      this.morphAttributes = {};
      this.groups = [];
      this.boundingBox = null;
      this.boundingSphere = null;
      const data = {};
      this.name = source.name;
      const index = source.index;
      if (index !== null) {
        this.setIndex(index.clone());
      }
      const attributes = source.attributes;
      for (const name in attributes) {
        const attribute = attributes[name];
        this.setAttribute(name, attribute.clone(data));
      }
      const morphAttributes = source.morphAttributes;
      for (const name in morphAttributes) {
        const array = [];
        const morphAttribute = morphAttributes[name];
        for (let i = 0, l = morphAttribute.length; i < l; i++) {
          array.push(morphAttribute[i].clone(data));
        }
        this.morphAttributes[name] = array;
      }
      this.morphTargetsRelative = source.morphTargetsRelative;
      const groups = source.groups;
      for (let i = 0, l = groups.length; i < l; i++) {
        const group = groups[i];
        this.addGroup(group.start, group.count, group.materialIndex);
      }
      const boundingBox2 = source.boundingBox;
      if (boundingBox2 !== null) {
        this.boundingBox = boundingBox2.clone();
      }
      const boundingSphere = source.boundingSphere;
      if (boundingSphere !== null) {
        this.boundingSphere = boundingSphere.clone();
      }
      this.drawRange.start = source.drawRange.start;
      this.drawRange.count = source.drawRange.count;
      this.userData = source.userData;
      return this;
    }
    /**
     * Frees the GPU-related resources allocated by this instance. Call this
     * method whenever this instance is no longer used in your app.
     *
     * @fires BufferGeometry#dispose
     */
    dispose() {
      this.dispatchEvent({ type: "dispose" });
    }
  }
  const _vector1 = /* @__PURE__ */ new Vector3();
  const _vector2 = /* @__PURE__ */ new Vector3();
  const _normalMatrix = /* @__PURE__ */ new Matrix3();
  class Plane {
    /**
     * Constructs a new plane.
     *
     * @param {Vector3} [normal=(1,0,0)] - A unit length vector defining the normal of the plane.
     * @param {number} [constant=0] - The signed distance from the origin to the plane.
     */
    constructor(normal = new Vector3(1, 0, 0), constant = 0) {
      this.isPlane = true;
      this.normal = normal;
      this.constant = constant;
    }
    /**
     * Sets the plane components by copying the given values.
     *
     * @param {Vector3} normal - The normal.
     * @param {number} constant - The constant.
     * @return {Plane} A reference to this plane.
     */
    set(normal, constant) {
      this.normal.copy(normal);
      this.constant = constant;
      return this;
    }
    /**
     * Sets the plane components by defining `x`, `y`, `z` as the
     * plane normal and `w` as the constant.
     *
     * @param {number} x - The value for the normal's x component.
     * @param {number} y - The value for the normal's y component.
     * @param {number} z - The value for the normal's z component.
     * @param {number} w - The constant value.
     * @return {Plane} A reference to this plane.
     */
    setComponents(x, y, z, w) {
      this.normal.set(x, y, z);
      this.constant = w;
      return this;
    }
    /**
     * Sets the plane from the given normal and coplanar point (that is a point
     * that lies onto the plane).
     *
     * @param {Vector3} normal - The normal.
     * @param {Vector3} point - A coplanar point.
     * @return {Plane} A reference to this plane.
     */
    setFromNormalAndCoplanarPoint(normal, point) {
      this.normal.copy(normal);
      this.constant = -point.dot(this.normal);
      return this;
    }
    /**
     * Sets the plane from three coplanar points. The winding order is
     * assumed to be counter-clockwise, and determines the direction of
     * the plane normal.
     *
     * @param {Vector3} a - The first coplanar point.
     * @param {Vector3} b - The second coplanar point.
     * @param {Vector3} c - The third coplanar point.
     * @return {Plane} A reference to this plane.
     */
    setFromCoplanarPoints(a, b, c) {
      const normal = _vector1.subVectors(c, b).cross(_vector2.subVectors(a, b)).normalize();
      this.setFromNormalAndCoplanarPoint(normal, a);
      return this;
    }
    /**
     * Copies the values of the given plane to this instance.
     *
     * @param {Plane} plane - The plane to copy.
     * @return {Plane} A reference to this plane.
     */
    copy(plane) {
      this.normal.copy(plane.normal);
      this.constant = plane.constant;
      return this;
    }
    /**
     * Normalizes the plane normal and adjusts the constant accordingly.
     *
     * @return {Plane} A reference to this plane.
     */
    normalize() {
      const inverseNormalLength = 1 / this.normal.length();
      this.normal.multiplyScalar(inverseNormalLength);
      this.constant *= inverseNormalLength;
      return this;
    }
    /**
     * Negates both the plane normal and the constant.
     *
     * @return {Plane} A reference to this plane.
     */
    negate() {
      this.constant *= -1;
      this.normal.negate();
      return this;
    }
    /**
     * Returns the signed distance from the given point to this plane.
     *
     * @param {Vector3} point - The point to compute the distance for.
     * @return {number} The signed distance.
     */
    distanceToPoint(point) {
      return this.normal.dot(point) + this.constant;
    }
    /**
     * Returns the signed distance from the given sphere to this plane.
     *
     * @param {Sphere} sphere - The sphere to compute the distance for.
     * @return {number} The signed distance.
     */
    distanceToSphere(sphere) {
      return this.distanceToPoint(sphere.center) - sphere.radius;
    }
    /**
     * Projects a the given point onto the plane.
     *
     * @param {Vector3} point - The point to project.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {Vector3} The projected point on the plane.
     */
    projectPoint(point, target) {
      return target.copy(point).addScaledVector(this.normal, -this.distanceToPoint(point));
    }
    /**
     * Returns the intersection point of the passed line and the plane. Returns
     * `null` if the line does not intersect. Returns the line's starting point if
     * the line is coplanar with the plane.
     *
     * @param {Line3} line - The line to compute the intersection for.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {?Vector3} The intersection point.
     */
    intersectLine(line, target) {
      const direction = line.delta(_vector1);
      const denominator = this.normal.dot(direction);
      if (denominator === 0) {
        if (this.distanceToPoint(line.start) === 0) {
          return target.copy(line.start);
        }
        return null;
      }
      const t = -(line.start.dot(this.normal) + this.constant) / denominator;
      if (t < 0 || t > 1) {
        return null;
      }
      return target.copy(line.start).addScaledVector(direction, t);
    }
    /**
     * Returns `true` if the given line segment intersects with (passes through) the plane.
     *
     * @param {Line3} line - The line to test.
     * @return {boolean} Whether the given line segment intersects with the plane or not.
     */
    intersectsLine(line) {
      const startSign = this.distanceToPoint(line.start);
      const endSign = this.distanceToPoint(line.end);
      return startSign < 0 && endSign > 0 || endSign < 0 && startSign > 0;
    }
    /**
     * Returns `true` if the given bounding box intersects with the plane.
     *
     * @param {Box3} box - The bounding box to test.
     * @return {boolean} Whether the given bounding box intersects with the plane or not.
     */
    intersectsBox(box) {
      return box.intersectsPlane(this);
    }
    /**
     * Returns `true` if the given bounding sphere intersects with the plane.
     *
     * @param {Sphere} sphere - The bounding sphere to test.
     * @return {boolean} Whether the given bounding sphere intersects with the plane or not.
     */
    intersectsSphere(sphere) {
      return sphere.intersectsPlane(this);
    }
    /**
     * Returns a coplanar vector to the plane, by calculating the
     * projection of the normal at the origin onto the plane.
     *
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {Vector3} The coplanar point.
     */
    coplanarPoint(target) {
      return target.copy(this.normal).multiplyScalar(-this.constant);
    }
    /**
     * Apply a 4x4 matrix to the plane. The matrix must be an affine, homogeneous transform.
     *
     * The optional normal matrix can be pre-computed like so:
     * ```js
     * const optionalNormalMatrix = new THREE.Matrix3().getNormalMatrix( matrix );
     * ```
     *
     * @param {Matrix4} matrix - The transformation matrix.
     * @param {Matrix4} [optionalNormalMatrix] - A pre-computed normal matrix.
     * @return {Plane} A reference to this plane.
     */
    applyMatrix4(matrix, optionalNormalMatrix) {
      const normalMatrix = optionalNormalMatrix || _normalMatrix.getNormalMatrix(matrix);
      const referencePoint = this.coplanarPoint(_vector1).applyMatrix4(matrix);
      const normal = this.normal.applyMatrix3(normalMatrix).normalize();
      this.constant = -referencePoint.dot(normal);
      return this;
    }
    /**
     * Translates the plane by the distance defined by the given offset vector.
     * Note that this only affects the plane constant and will not affect the normal vector.
     *
     * @param {Vector3} offset - The offset vector.
     * @return {Plane} A reference to this plane.
     */
    translate(offset) {
      this.constant -= offset.dot(this.normal);
      return this;
    }
    /**
     * Returns `true` if this plane is equal with the given one.
     *
     * @param {Plane} plane - The plane to test for equality.
     * @return {boolean} Whether this plane is equal with the given one.
     */
    equals(plane) {
      return plane.normal.equals(this.normal) && plane.constant === this.constant;
    }
    /**
     * Returns a new plane with copied values from this instance.
     *
     * @return {Plane} A clone of this instance.
     */
    clone() {
      return new this.constructor().copy(this);
    }
  }
  const _startP = /* @__PURE__ */ new Vector3();
  const _startEnd = /* @__PURE__ */ new Vector3();
  const _d1 = /* @__PURE__ */ new Vector3();
  const _d2 = /* @__PURE__ */ new Vector3();
  const _r = /* @__PURE__ */ new Vector3();
  const _c1 = /* @__PURE__ */ new Vector3();
  const _c2 = /* @__PURE__ */ new Vector3();
  class Line3 {
    /**
     * Constructs a new line segment.
     *
     * @param {Vector3} [start=(0,0,0)] - Start of the line segment.
     * @param {Vector3} [end=(0,0,0)] - End of the line segment.
     */
    constructor(start = new Vector3(), end = new Vector3()) {
      this.start = start;
      this.end = end;
    }
    /**
     * Sets the start and end values by copying the given vectors.
     *
     * @param {Vector3} start - The start point.
     * @param {Vector3} end - The end point.
     * @return {Line3} A reference to this line segment.
     */
    set(start, end) {
      this.start.copy(start);
      this.end.copy(end);
      return this;
    }
    /**
     * Copies the values of the given line segment to this instance.
     *
     * @param {Line3} line - The line segment to copy.
     * @return {Line3} A reference to this line segment.
     */
    copy(line) {
      this.start.copy(line.start);
      this.end.copy(line.end);
      return this;
    }
    /**
     * Returns the center of the line segment.
     *
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {Vector3} The center point.
     */
    getCenter(target) {
      return target.addVectors(this.start, this.end).multiplyScalar(0.5);
    }
    /**
     * Returns the delta vector of the line segment's start and end point.
     *
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {Vector3} The delta vector.
     */
    delta(target) {
      return target.subVectors(this.end, this.start);
    }
    /**
     * Returns the squared Euclidean distance between the line' start and end point.
     *
     * @return {number} The squared Euclidean distance.
     */
    distanceSq() {
      return this.start.distanceToSquared(this.end);
    }
    /**
     * Returns the Euclidean distance between the line' start and end point.
     *
     * @return {number} The Euclidean distance.
     */
    distance() {
      return this.start.distanceTo(this.end);
    }
    /**
     * Returns a vector at a certain position along the line segment.
     *
     * @param {number} t - A value between `[0,1]` to represent a position along the line segment.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {Vector3} The delta vector.
     */
    at(t, target) {
      return this.delta(target).multiplyScalar(t).add(this.start);
    }
    /**
     * Returns a point parameter based on the closest point as projected on the line segment.
     *
     * @param {Vector3} point - The point for which to return a point parameter.
     * @param {boolean} clampToLine - Whether to clamp the result to the range `[0,1]` or not.
     * @return {number} The point parameter.
     */
    closestPointToPointParameter(point, clampToLine) {
      _startP.subVectors(point, this.start);
      _startEnd.subVectors(this.end, this.start);
      const startEnd2 = _startEnd.dot(_startEnd);
      const startEnd_startP = _startEnd.dot(_startP);
      let t = startEnd_startP / startEnd2;
      if (clampToLine) {
        t = clamp(t, 0, 1);
      }
      return t;
    }
    /**
     * Returns the closest point on the line for a given point.
     *
     * @param {Vector3} point - The point to compute the closest point on the line for.
     * @param {boolean} clampToLine - Whether to clamp the result to the range `[0,1]` or not.
     * @param {Vector3} target - The target vector that is used to store the method's result.
     * @return {Vector3} The closest point on the line.
     */
    closestPointToPoint(point, clampToLine, target) {
      const t = this.closestPointToPointParameter(point, clampToLine);
      return this.delta(target).multiplyScalar(t).add(this.start);
    }
    /**
     * Returns the closest squared distance between this line segment and the given one.
     *
     * @param {Line3} line - The line segment to compute the closest squared distance to.
     * @param {Vector3} [c1] - The closest point on this line segment.
     * @param {Vector3} [c2] - The closest point on the given line segment.
     * @return {number} The squared distance between this line segment and the given one.
     */
    distanceSqToLine3(line, c1 = _c1, c2 = _c2) {
      const EPSILON2 = 1e-8 * 1e-8;
      let s, t;
      const p1 = this.start;
      const p2 = line.start;
      const q1 = this.end;
      const q2 = line.end;
      _d1.subVectors(q1, p1);
      _d2.subVectors(q2, p2);
      _r.subVectors(p1, p2);
      const a = _d1.dot(_d1);
      const e = _d2.dot(_d2);
      const f = _d2.dot(_r);
      if (a <= EPSILON2 && e <= EPSILON2) {
        c1.copy(p1);
        c2.copy(p2);
        c1.sub(c2);
        return c1.dot(c1);
      }
      if (a <= EPSILON2) {
        s = 0;
        t = f / e;
        t = clamp(t, 0, 1);
      } else {
        const c = _d1.dot(_r);
        if (e <= EPSILON2) {
          t = 0;
          s = clamp(-c / a, 0, 1);
        } else {
          const b = _d1.dot(_d2);
          const denom = a * e - b * b;
          if (denom !== 0) {
            s = clamp((b * f - c * e) / denom, 0, 1);
          } else {
            s = 0;
          }
          t = (b * s + f) / e;
          if (t < 0) {
            t = 0;
            s = clamp(-c / a, 0, 1);
          } else if (t > 1) {
            t = 1;
            s = clamp((b - c) / a, 0, 1);
          }
        }
      }
      c1.copy(p1).add(_d1.multiplyScalar(s));
      c2.copy(p2).add(_d2.multiplyScalar(t));
      c1.sub(c2);
      return c1.dot(c1);
    }
    /**
     * Applies a 4x4 transformation matrix to this line segment.
     *
     * @param {Matrix4} matrix - The transformation matrix.
     * @return {Line3} A reference to this line segment.
     */
    applyMatrix4(matrix) {
      this.start.applyMatrix4(matrix);
      this.end.applyMatrix4(matrix);
      return this;
    }
    /**
     * Returns `true` if this line segment is equal with the given one.
     *
     * @param {Line3} line - The line segment to test for equality.
     * @return {boolean} Whether this line segment is equal with the given one.
     */
    equals(line) {
      return line.start.equals(this.start) && line.end.equals(this.end);
    }
    /**
     * Returns a new line segment with copied values from this instance.
     *
     * @return {Line3} A clone of this instance.
     */
    clone() {
      return new this.constructor().copy(this);
    }
  }
  if (typeof __THREE_DEVTOOLS__ !== "undefined") {
    __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: {
      revision: REVISION
    } }));
  }
  if (typeof window !== "undefined") {
    if (window.__THREE__) {
      console.warn("WARNING: Multiple instances of Three.js being imported.");
    } else {
      window.__THREE__ = REVISION;
    }
  }
  const CENTER = 0;
  const AVERAGE = 1;
  const SAH = 2;
  const CONTAINED = 2;
  const TRIANGLE_INTERSECT_COST = 1.25;
  const TRAVERSAL_COST = 1;
  const BYTES_PER_NODE = 6 * 4 + 4 + 4;
  const IS_LEAFNODE_FLAG = 65535;
  const FLOAT32_EPSILON = Math.pow(2, -24);
  const SKIP_GENERATION = Symbol("SKIP_GENERATION");
  function getVertexCount(geo) {
    return geo.index ? geo.index.count : geo.attributes.position.count;
  }
  function getTriCount(geo) {
    return getVertexCount(geo) / 3;
  }
  function getIndexArray(vertexCount, BufferConstructor = ArrayBuffer) {
    if (vertexCount > 65535) {
      return new Uint32Array(new BufferConstructor(4 * vertexCount));
    } else {
      return new Uint16Array(new BufferConstructor(2 * vertexCount));
    }
  }
  function ensureIndex(geo, options) {
    if (!geo.index) {
      const vertexCount = geo.attributes.position.count;
      const BufferConstructor = options.useSharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer;
      const index = getIndexArray(vertexCount, BufferConstructor);
      geo.setIndex(new BufferAttribute(index, 1));
      for (let i = 0; i < vertexCount; i++) {
        index[i] = i;
      }
    }
  }
  function getFullGeometryRange(geo, range) {
    const triCount = getTriCount(geo);
    const drawRange = range ? range : geo.drawRange;
    const start = drawRange.start / 3;
    const end = (drawRange.start + drawRange.count) / 3;
    const offset = Math.max(0, start);
    const count = Math.min(triCount, end) - offset;
    return [{
      offset: Math.floor(offset),
      count: Math.floor(count)
    }];
  }
  function getRootIndexRanges(geo, range) {
    if (!geo.groups || !geo.groups.length) {
      return getFullGeometryRange(geo, range);
    }
    const ranges = [];
    const rangeBoundaries = /* @__PURE__ */ new Set();
    const drawRange = range ? range : geo.drawRange;
    const drawRangeStart = drawRange.start / 3;
    const drawRangeEnd = (drawRange.start + drawRange.count) / 3;
    for (const group of geo.groups) {
      const groupStart = group.start / 3;
      const groupEnd = (group.start + group.count) / 3;
      rangeBoundaries.add(Math.max(drawRangeStart, groupStart));
      rangeBoundaries.add(Math.min(drawRangeEnd, groupEnd));
    }
    const sortedBoundaries = Array.from(rangeBoundaries.values()).sort((a, b) => a - b);
    for (let i = 0; i < sortedBoundaries.length - 1; i++) {
      const start = sortedBoundaries[i];
      const end = sortedBoundaries[i + 1];
      ranges.push({
        offset: Math.floor(start),
        count: Math.floor(end - start)
      });
    }
    return ranges;
  }
  function hasGroupGaps(geometry, range) {
    const vertexCount = getTriCount(geometry);
    const groups = getRootIndexRanges(geometry, range).sort((a, b) => a.offset - b.offset);
    const finalGroup = groups[groups.length - 1];
    finalGroup.count = Math.min(vertexCount - finalGroup.offset, finalGroup.count);
    let total = 0;
    groups.forEach(({ count }) => total += count);
    return vertexCount !== total;
  }
  function getBounds(triangleBounds, offset, count, target, centroidTarget) {
    let minx = Infinity;
    let miny = Infinity;
    let minz = Infinity;
    let maxx = -Infinity;
    let maxy = -Infinity;
    let maxz = -Infinity;
    let cminx = Infinity;
    let cminy = Infinity;
    let cminz = Infinity;
    let cmaxx = -Infinity;
    let cmaxy = -Infinity;
    let cmaxz = -Infinity;
    for (let i = offset * 6, end = (offset + count) * 6; i < end; i += 6) {
      const cx = triangleBounds[i + 0];
      const hx = triangleBounds[i + 1];
      const lx = cx - hx;
      const rx = cx + hx;
      if (lx < minx) minx = lx;
      if (rx > maxx) maxx = rx;
      if (cx < cminx) cminx = cx;
      if (cx > cmaxx) cmaxx = cx;
      const cy = triangleBounds[i + 2];
      const hy = triangleBounds[i + 3];
      const ly = cy - hy;
      const ry = cy + hy;
      if (ly < miny) miny = ly;
      if (ry > maxy) maxy = ry;
      if (cy < cminy) cminy = cy;
      if (cy > cmaxy) cmaxy = cy;
      const cz = triangleBounds[i + 4];
      const hz = triangleBounds[i + 5];
      const lz = cz - hz;
      const rz = cz + hz;
      if (lz < minz) minz = lz;
      if (rz > maxz) maxz = rz;
      if (cz < cminz) cminz = cz;
      if (cz > cmaxz) cmaxz = cz;
    }
    target[0] = minx;
    target[1] = miny;
    target[2] = minz;
    target[3] = maxx;
    target[4] = maxy;
    target[5] = maxz;
    centroidTarget[0] = cminx;
    centroidTarget[1] = cminy;
    centroidTarget[2] = cminz;
    centroidTarget[3] = cmaxx;
    centroidTarget[4] = cmaxy;
    centroidTarget[5] = cmaxz;
  }
  function computeTriangleBounds(geo, target = null, offset = null, count = null) {
    const posAttr = geo.attributes.position;
    const index = geo.index ? geo.index.array : null;
    const triCount = getTriCount(geo);
    const normalized = posAttr.normalized;
    let triangleBounds;
    if (target === null) {
      triangleBounds = new Float32Array(triCount * 6);
      offset = 0;
      count = triCount;
    } else {
      triangleBounds = target;
      offset = offset || 0;
      count = count || triCount;
    }
    const posArr = posAttr.array;
    const bufferOffset = posAttr.offset || 0;
    let stride = 3;
    if (posAttr.isInterleavedBufferAttribute) {
      stride = posAttr.data.stride;
    }
    const getters = ["getX", "getY", "getZ"];
    for (let tri = offset; tri < offset + count; tri++) {
      const tri3 = tri * 3;
      const tri6 = tri * 6;
      let ai = tri3 + 0;
      let bi = tri3 + 1;
      let ci = tri3 + 2;
      if (index) {
        ai = index[ai];
        bi = index[bi];
        ci = index[ci];
      }
      if (!normalized) {
        ai = ai * stride + bufferOffset;
        bi = bi * stride + bufferOffset;
        ci = ci * stride + bufferOffset;
      }
      for (let el = 0; el < 3; el++) {
        let a, b, c;
        if (normalized) {
          a = posAttr[getters[el]](ai);
          b = posAttr[getters[el]](bi);
          c = posAttr[getters[el]](ci);
        } else {
          a = posArr[ai + el];
          b = posArr[bi + el];
          c = posArr[ci + el];
        }
        let min = a;
        if (b < min) min = b;
        if (c < min) min = c;
        let max = a;
        if (b > max) max = b;
        if (c > max) max = c;
        const halfExtents = (max - min) / 2;
        const el2 = el * 2;
        triangleBounds[tri6 + el2 + 0] = min + halfExtents;
        triangleBounds[tri6 + el2 + 1] = halfExtents + (Math.abs(min) + halfExtents) * FLOAT32_EPSILON;
      }
    }
    return triangleBounds;
  }
  function arrayToBox(nodeIndex32, array, target) {
    target.min.x = array[nodeIndex32];
    target.min.y = array[nodeIndex32 + 1];
    target.min.z = array[nodeIndex32 + 2];
    target.max.x = array[nodeIndex32 + 3];
    target.max.y = array[nodeIndex32 + 4];
    target.max.z = array[nodeIndex32 + 5];
    return target;
  }
  function getLongestEdgeIndex(bounds) {
    let splitDimIdx = -1;
    let splitDist = -Infinity;
    for (let i = 0; i < 3; i++) {
      const dist = bounds[i + 3] - bounds[i];
      if (dist > splitDist) {
        splitDist = dist;
        splitDimIdx = i;
      }
    }
    return splitDimIdx;
  }
  function copyBounds(source, target) {
    target.set(source);
  }
  function unionBounds(a, b, target) {
    let aVal, bVal;
    for (let d = 0; d < 3; d++) {
      const d3 = d + 3;
      aVal = a[d];
      bVal = b[d];
      target[d] = aVal < bVal ? aVal : bVal;
      aVal = a[d3];
      bVal = b[d3];
      target[d3] = aVal > bVal ? aVal : bVal;
    }
  }
  function expandByTriangleBounds(startIndex, triangleBounds, bounds) {
    for (let d = 0; d < 3; d++) {
      const tCenter = triangleBounds[startIndex + 2 * d];
      const tHalf = triangleBounds[startIndex + 2 * d + 1];
      const tMin = tCenter - tHalf;
      const tMax = tCenter + tHalf;
      if (tMin < bounds[d]) {
        bounds[d] = tMin;
      }
      if (tMax > bounds[d + 3]) {
        bounds[d + 3] = tMax;
      }
    }
  }
  function computeSurfaceArea(bounds) {
    const d0 = bounds[3] - bounds[0];
    const d1 = bounds[4] - bounds[1];
    const d2 = bounds[5] - bounds[2];
    return 2 * (d0 * d1 + d1 * d2 + d2 * d0);
  }
  const BIN_COUNT = 32;
  const binsSort = (a, b) => a.candidate - b.candidate;
  const sahBins = new Array(BIN_COUNT).fill().map(() => {
    return {
      count: 0,
      bounds: new Float32Array(6),
      rightCacheBounds: new Float32Array(6),
      leftCacheBounds: new Float32Array(6),
      candidate: 0
    };
  });
  const leftBounds = new Float32Array(6);
  function getOptimalSplit(nodeBoundingData, centroidBoundingData, triangleBounds, offset, count, strategy) {
    let axis = -1;
    let pos = 0;
    if (strategy === CENTER) {
      axis = getLongestEdgeIndex(centroidBoundingData);
      if (axis !== -1) {
        pos = (centroidBoundingData[axis] + centroidBoundingData[axis + 3]) / 2;
      }
    } else if (strategy === AVERAGE) {
      axis = getLongestEdgeIndex(nodeBoundingData);
      if (axis !== -1) {
        pos = getAverage(triangleBounds, offset, count, axis);
      }
    } else if (strategy === SAH) {
      const rootSurfaceArea = computeSurfaceArea(nodeBoundingData);
      let bestCost = TRIANGLE_INTERSECT_COST * count;
      const cStart = offset * 6;
      const cEnd = (offset + count) * 6;
      for (let a = 0; a < 3; a++) {
        const axisLeft = centroidBoundingData[a];
        const axisRight = centroidBoundingData[a + 3];
        const axisLength = axisRight - axisLeft;
        const binWidth = axisLength / BIN_COUNT;
        if (count < BIN_COUNT / 4) {
          const truncatedBins = [...sahBins];
          truncatedBins.length = count;
          let b = 0;
          for (let c = cStart; c < cEnd; c += 6, b++) {
            const bin = truncatedBins[b];
            bin.candidate = triangleBounds[c + 2 * a];
            bin.count = 0;
            const {
              bounds,
              leftCacheBounds,
              rightCacheBounds
            } = bin;
            for (let d = 0; d < 3; d++) {
              rightCacheBounds[d] = Infinity;
              rightCacheBounds[d + 3] = -Infinity;
              leftCacheBounds[d] = Infinity;
              leftCacheBounds[d + 3] = -Infinity;
              bounds[d] = Infinity;
              bounds[d + 3] = -Infinity;
            }
            expandByTriangleBounds(c, triangleBounds, bounds);
          }
          truncatedBins.sort(binsSort);
          let splitCount = count;
          for (let bi = 0; bi < splitCount; bi++) {
            const bin = truncatedBins[bi];
            while (bi + 1 < splitCount && truncatedBins[bi + 1].candidate === bin.candidate) {
              truncatedBins.splice(bi + 1, 1);
              splitCount--;
            }
          }
          for (let c = cStart; c < cEnd; c += 6) {
            const center = triangleBounds[c + 2 * a];
            for (let bi = 0; bi < splitCount; bi++) {
              const bin = truncatedBins[bi];
              if (center >= bin.candidate) {
                expandByTriangleBounds(c, triangleBounds, bin.rightCacheBounds);
              } else {
                expandByTriangleBounds(c, triangleBounds, bin.leftCacheBounds);
                bin.count++;
              }
            }
          }
          for (let bi = 0; bi < splitCount; bi++) {
            const bin = truncatedBins[bi];
            const leftCount = bin.count;
            const rightCount = count - bin.count;
            const leftBounds2 = bin.leftCacheBounds;
            const rightBounds = bin.rightCacheBounds;
            let leftProb = 0;
            if (leftCount !== 0) {
              leftProb = computeSurfaceArea(leftBounds2) / rootSurfaceArea;
            }
            let rightProb = 0;
            if (rightCount !== 0) {
              rightProb = computeSurfaceArea(rightBounds) / rootSurfaceArea;
            }
            const cost = TRAVERSAL_COST + TRIANGLE_INTERSECT_COST * (leftProb * leftCount + rightProb * rightCount);
            if (cost < bestCost) {
              axis = a;
              bestCost = cost;
              pos = bin.candidate;
            }
          }
        } else {
          for (let i = 0; i < BIN_COUNT; i++) {
            const bin = sahBins[i];
            bin.count = 0;
            bin.candidate = axisLeft + binWidth + i * binWidth;
            const bounds = bin.bounds;
            for (let d = 0; d < 3; d++) {
              bounds[d] = Infinity;
              bounds[d + 3] = -Infinity;
            }
          }
          for (let c = cStart; c < cEnd; c += 6) {
            const triCenter = triangleBounds[c + 2 * a];
            const relativeCenter = triCenter - axisLeft;
            let binIndex = ~~(relativeCenter / binWidth);
            if (binIndex >= BIN_COUNT) binIndex = BIN_COUNT - 1;
            const bin = sahBins[binIndex];
            bin.count++;
            expandByTriangleBounds(c, triangleBounds, bin.bounds);
          }
          const lastBin = sahBins[BIN_COUNT - 1];
          copyBounds(lastBin.bounds, lastBin.rightCacheBounds);
          for (let i = BIN_COUNT - 2; i >= 0; i--) {
            const bin = sahBins[i];
            const nextBin = sahBins[i + 1];
            unionBounds(bin.bounds, nextBin.rightCacheBounds, bin.rightCacheBounds);
          }
          let leftCount = 0;
          for (let i = 0; i < BIN_COUNT - 1; i++) {
            const bin = sahBins[i];
            const binCount = bin.count;
            const bounds = bin.bounds;
            const nextBin = sahBins[i + 1];
            const rightBounds = nextBin.rightCacheBounds;
            if (binCount !== 0) {
              if (leftCount === 0) {
                copyBounds(bounds, leftBounds);
              } else {
                unionBounds(bounds, leftBounds, leftBounds);
              }
            }
            leftCount += binCount;
            let leftProb = 0;
            let rightProb = 0;
            if (leftCount !== 0) {
              leftProb = computeSurfaceArea(leftBounds) / rootSurfaceArea;
            }
            const rightCount = count - leftCount;
            if (rightCount !== 0) {
              rightProb = computeSurfaceArea(rightBounds) / rootSurfaceArea;
            }
            const cost = TRAVERSAL_COST + TRIANGLE_INTERSECT_COST * (leftProb * leftCount + rightProb * rightCount);
            if (cost < bestCost) {
              axis = a;
              bestCost = cost;
              pos = bin.candidate;
            }
          }
        }
      }
    } else {
      console.warn(`MeshBVH: Invalid build strategy value ${strategy} used.`);
    }
    return { axis, pos };
  }
  function getAverage(triangleBounds, offset, count, axis) {
    let avg = 0;
    for (let i = offset, end = offset + count; i < end; i++) {
      avg += triangleBounds[i * 6 + axis * 2];
    }
    return avg / count;
  }
  class MeshBVHNode {
    constructor() {
      this.boundingData = new Float32Array(6);
    }
  }
  function partition(indirectBuffer, index, triangleBounds, offset, count, split) {
    let left = offset;
    let right = offset + count - 1;
    const pos = split.pos;
    const axisOffset = split.axis * 2;
    while (true) {
      while (left <= right && triangleBounds[left * 6 + axisOffset] < pos) {
        left++;
      }
      while (left <= right && triangleBounds[right * 6 + axisOffset] >= pos) {
        right--;
      }
      if (left < right) {
        for (let i = 0; i < 3; i++) {
          let t0 = index[left * 3 + i];
          index[left * 3 + i] = index[right * 3 + i];
          index[right * 3 + i] = t0;
        }
        for (let i = 0; i < 6; i++) {
          let tb = triangleBounds[left * 6 + i];
          triangleBounds[left * 6 + i] = triangleBounds[right * 6 + i];
          triangleBounds[right * 6 + i] = tb;
        }
        left++;
        right--;
      } else {
        return left;
      }
    }
  }
  function partition_indirect(indirectBuffer, index, triangleBounds, offset, count, split) {
    let left = offset;
    let right = offset + count - 1;
    const pos = split.pos;
    const axisOffset = split.axis * 2;
    while (true) {
      while (left <= right && triangleBounds[left * 6 + axisOffset] < pos) {
        left++;
      }
      while (left <= right && triangleBounds[right * 6 + axisOffset] >= pos) {
        right--;
      }
      if (left < right) {
        let t = indirectBuffer[left];
        indirectBuffer[left] = indirectBuffer[right];
        indirectBuffer[right] = t;
        for (let i = 0; i < 6; i++) {
          let tb = triangleBounds[left * 6 + i];
          triangleBounds[left * 6 + i] = triangleBounds[right * 6 + i];
          triangleBounds[right * 6 + i] = tb;
        }
        left++;
        right--;
      } else {
        return left;
      }
    }
  }
  function IS_LEAF(n16, uint16Array2) {
    return uint16Array2[n16 + 15] === 65535;
  }
  function OFFSET(n32, uint32Array2) {
    return uint32Array2[n32 + 6];
  }
  function COUNT(n16, uint16Array2) {
    return uint16Array2[n16 + 14];
  }
  function LEFT_NODE(n32) {
    return n32 + 8;
  }
  function RIGHT_NODE(n32, uint32Array2) {
    return uint32Array2[n32 + 6];
  }
  function SPLIT_AXIS(n32, uint32Array2) {
    return uint32Array2[n32 + 7];
  }
  function BOUNDING_DATA_INDEX(n32) {
    return n32;
  }
  let float32Array, uint32Array, uint16Array, uint8Array;
  const MAX_POINTER = Math.pow(2, 32);
  function countNodes(node) {
    if ("count" in node) {
      return 1;
    } else {
      return 1 + countNodes(node.left) + countNodes(node.right);
    }
  }
  function populateBuffer(byteOffset, node, buffer) {
    float32Array = new Float32Array(buffer);
    uint32Array = new Uint32Array(buffer);
    uint16Array = new Uint16Array(buffer);
    uint8Array = new Uint8Array(buffer);
    return _populateBuffer(byteOffset, node);
  }
  function _populateBuffer(byteOffset, node) {
    const stride4Offset = byteOffset / 4;
    const stride2Offset = byteOffset / 2;
    const isLeaf = "count" in node;
    const boundingData = node.boundingData;
    for (let i = 0; i < 6; i++) {
      float32Array[stride4Offset + i] = boundingData[i];
    }
    if (isLeaf) {
      if (node.buffer) {
        const buffer = node.buffer;
        uint8Array.set(new Uint8Array(buffer), byteOffset);
        for (let offset = byteOffset, l = byteOffset + buffer.byteLength; offset < l; offset += BYTES_PER_NODE) {
          const offset2 = offset / 2;
          if (!IS_LEAF(offset2, uint16Array)) {
            uint32Array[offset / 4 + 6] += stride4Offset;
          }
        }
        return byteOffset + buffer.byteLength;
      } else {
        const offset = node.offset;
        const count = node.count;
        uint32Array[stride4Offset + 6] = offset;
        uint16Array[stride2Offset + 14] = count;
        uint16Array[stride2Offset + 15] = IS_LEAFNODE_FLAG;
        return byteOffset + BYTES_PER_NODE;
      }
    } else {
      const left = node.left;
      const right = node.right;
      const splitAxis = node.splitAxis;
      let nextUnusedPointer;
      nextUnusedPointer = _populateBuffer(byteOffset + BYTES_PER_NODE, left);
      if (nextUnusedPointer / 4 > MAX_POINTER) {
        throw new Error("MeshBVH: Cannot store child pointer greater than 32 bits.");
      }
      uint32Array[stride4Offset + 6] = nextUnusedPointer / 4;
      nextUnusedPointer = _populateBuffer(nextUnusedPointer, right);
      uint32Array[stride4Offset + 7] = splitAxis;
      return nextUnusedPointer;
    }
  }
  function generateIndirectBuffer(geometry, useSharedArrayBuffer) {
    const triCount = (geometry.index ? geometry.index.count : geometry.attributes.position.count) / 3;
    const useUint32 = triCount > 2 ** 16;
    const byteCount = useUint32 ? 4 : 2;
    const buffer = useSharedArrayBuffer ? new SharedArrayBuffer(triCount * byteCount) : new ArrayBuffer(triCount * byteCount);
    const indirectBuffer = useUint32 ? new Uint32Array(buffer) : new Uint16Array(buffer);
    for (let i = 0, l = indirectBuffer.length; i < l; i++) {
      indirectBuffer[i] = i;
    }
    return indirectBuffer;
  }
  function buildTree(bvh, triangleBounds, offset, count, options) {
    const {
      maxDepth,
      verbose,
      maxLeafTris,
      strategy,
      onProgress,
      indirect
    } = options;
    const indirectBuffer = bvh._indirectBuffer;
    const geometry = bvh.geometry;
    const indexArray = geometry.index ? geometry.index.array : null;
    const partionFunc = indirect ? partition_indirect : partition;
    const totalTriangles = getTriCount(geometry);
    const cacheCentroidBoundingData = new Float32Array(6);
    let reachedMaxDepth = false;
    const root = new MeshBVHNode();
    getBounds(triangleBounds, offset, count, root.boundingData, cacheCentroidBoundingData);
    splitNode(root, offset, count, cacheCentroidBoundingData);
    return root;
    function triggerProgress(trianglesProcessed) {
      if (onProgress) {
        onProgress(trianglesProcessed / totalTriangles);
      }
    }
    function splitNode(node, offset2, count2, centroidBoundingData = null, depth = 0) {
      if (!reachedMaxDepth && depth >= maxDepth) {
        reachedMaxDepth = true;
        if (verbose) {
          console.warn(`MeshBVH: Max depth of ${maxDepth} reached when generating BVH. Consider increasing maxDepth.`);
          console.warn(geometry);
        }
      }
      if (count2 <= maxLeafTris || depth >= maxDepth) {
        triggerProgress(offset2 + count2);
        node.offset = offset2;
        node.count = count2;
        return node;
      }
      const split = getOptimalSplit(node.boundingData, centroidBoundingData, triangleBounds, offset2, count2, strategy);
      if (split.axis === -1) {
        triggerProgress(offset2 + count2);
        node.offset = offset2;
        node.count = count2;
        return node;
      }
      const splitOffset = partionFunc(indirectBuffer, indexArray, triangleBounds, offset2, count2, split);
      if (splitOffset === offset2 || splitOffset === offset2 + count2) {
        triggerProgress(offset2 + count2);
        node.offset = offset2;
        node.count = count2;
      } else {
        node.splitAxis = split.axis;
        const left = new MeshBVHNode();
        const lstart = offset2;
        const lcount = splitOffset - offset2;
        node.left = left;
        getBounds(triangleBounds, lstart, lcount, left.boundingData, cacheCentroidBoundingData);
        splitNode(left, lstart, lcount, cacheCentroidBoundingData, depth + 1);
        const right = new MeshBVHNode();
        const rstart = splitOffset;
        const rcount = count2 - lcount;
        node.right = right;
        getBounds(triangleBounds, rstart, rcount, right.boundingData, cacheCentroidBoundingData);
        splitNode(right, rstart, rcount, cacheCentroidBoundingData, depth + 1);
      }
      return node;
    }
  }
  function buildPackedTree(bvh, options) {
    const geometry = bvh.geometry;
    if (options.indirect) {
      bvh._indirectBuffer = generateIndirectBuffer(geometry, options.useSharedArrayBuffer);
      if (hasGroupGaps(geometry, options.range) && !options.verbose) {
        console.warn(
          'MeshBVH: Provided geometry contains groups or a range that do not fully span the vertex contents while using the "indirect" option. BVH may incorrectly report intersections on unrendered portions of the geometry.'
        );
      }
    }
    if (!bvh._indirectBuffer) {
      ensureIndex(geometry, options);
    }
    const BufferConstructor = options.useSharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer;
    const triangleBounds = computeTriangleBounds(geometry);
    const geometryRanges = options.indirect ? getFullGeometryRange(geometry, options.range) : getRootIndexRanges(geometry, options.range);
    bvh._roots = geometryRanges.map((range) => {
      const root = buildTree(bvh, triangleBounds, range.offset, range.count, options);
      const nodeCount = countNodes(root);
      const buffer = new BufferConstructor(BYTES_PER_NODE * nodeCount);
      populateBuffer(0, root, buffer);
      return buffer;
    });
  }
  class SeparatingAxisBounds {
    constructor() {
      this.min = Infinity;
      this.max = -Infinity;
    }
    setFromPointsField(points, field) {
      let min = Infinity;
      let max = -Infinity;
      for (let i = 0, l = points.length; i < l; i++) {
        const p = points[i];
        const val = p[field];
        min = val < min ? val : min;
        max = val > max ? val : max;
      }
      this.min = min;
      this.max = max;
    }
    setFromPoints(axis, points) {
      let min = Infinity;
      let max = -Infinity;
      for (let i = 0, l = points.length; i < l; i++) {
        const p = points[i];
        const val = axis.dot(p);
        min = val < min ? val : min;
        max = val > max ? val : max;
      }
      this.min = min;
      this.max = max;
    }
    isSeparated(other) {
      return this.min > other.max || other.min > this.max;
    }
  }
  SeparatingAxisBounds.prototype.setFromBox = function() {
    const p = new Vector3();
    return function setFromBox(axis, box) {
      const boxMin = box.min;
      const boxMax = box.max;
      let min = Infinity;
      let max = -Infinity;
      for (let x = 0; x <= 1; x++) {
        for (let y = 0; y <= 1; y++) {
          for (let z = 0; z <= 1; z++) {
            p.x = boxMin.x * x + boxMax.x * (1 - x);
            p.y = boxMin.y * y + boxMax.y * (1 - y);
            p.z = boxMin.z * z + boxMax.z * (1 - z);
            const val = axis.dot(p);
            min = Math.min(val, min);
            max = Math.max(val, max);
          }
        }
      }
      this.min = min;
      this.max = max;
    };
  }();
  const closestPointLineToLine = function() {
    const dir1 = new Vector3();
    const dir2 = new Vector3();
    const v02 = new Vector3();
    return function closestPointLineToLine2(l1, l2, result) {
      const v0 = l1.start;
      const v10 = dir1;
      const v2 = l2.start;
      const v32 = dir2;
      v02.subVectors(v0, v2);
      dir1.subVectors(l1.end, l1.start);
      dir2.subVectors(l2.end, l2.start);
      const d0232 = v02.dot(v32);
      const d3210 = v32.dot(v10);
      const d3232 = v32.dot(v32);
      const d0210 = v02.dot(v10);
      const d1010 = v10.dot(v10);
      const denom = d1010 * d3232 - d3210 * d3210;
      let d, d2;
      if (denom !== 0) {
        d = (d0232 * d3210 - d0210 * d3232) / denom;
      } else {
        d = 0;
      }
      d2 = (d0232 + d * d3210) / d3232;
      result.x = d;
      result.y = d2;
    };
  }();
  const closestPointsSegmentToSegment = function() {
    const paramResult = new Vector2();
    const temp12 = new Vector3();
    const temp22 = new Vector3();
    return function closestPointsSegmentToSegment2(l1, l2, target1, target2) {
      closestPointLineToLine(l1, l2, paramResult);
      let d = paramResult.x;
      let d2 = paramResult.y;
      if (d >= 0 && d <= 1 && d2 >= 0 && d2 <= 1) {
        l1.at(d, target1);
        l2.at(d2, target2);
        return;
      } else if (d >= 0 && d <= 1) {
        if (d2 < 0) {
          l2.at(0, target2);
        } else {
          l2.at(1, target2);
        }
        l1.closestPointToPoint(target2, true, target1);
        return;
      } else if (d2 >= 0 && d2 <= 1) {
        if (d < 0) {
          l1.at(0, target1);
        } else {
          l1.at(1, target1);
        }
        l2.closestPointToPoint(target1, true, target2);
        return;
      } else {
        let p;
        if (d < 0) {
          p = l1.start;
        } else {
          p = l1.end;
        }
        let p2;
        if (d2 < 0) {
          p2 = l2.start;
        } else {
          p2 = l2.end;
        }
        const closestPoint = temp12;
        const closestPoint2 = temp22;
        l1.closestPointToPoint(p2, true, temp12);
        l2.closestPointToPoint(p, true, temp22);
        if (closestPoint.distanceToSquared(p2) <= closestPoint2.distanceToSquared(p)) {
          target1.copy(closestPoint);
          target2.copy(p2);
          return;
        } else {
          target1.copy(p);
          target2.copy(closestPoint2);
          return;
        }
      }
    };
  }();
  const sphereIntersectTriangle = function() {
    const closestPointTemp = new Vector3();
    const projectedPointTemp = new Vector3();
    const planeTemp = new Plane();
    const lineTemp = new Line3();
    return function sphereIntersectTriangle2(sphere, triangle3) {
      const { radius, center } = sphere;
      const { a, b, c } = triangle3;
      lineTemp.start = a;
      lineTemp.end = b;
      const closestPoint1 = lineTemp.closestPointToPoint(center, true, closestPointTemp);
      if (closestPoint1.distanceTo(center) <= radius) return true;
      lineTemp.start = a;
      lineTemp.end = c;
      const closestPoint2 = lineTemp.closestPointToPoint(center, true, closestPointTemp);
      if (closestPoint2.distanceTo(center) <= radius) return true;
      lineTemp.start = b;
      lineTemp.end = c;
      const closestPoint3 = lineTemp.closestPointToPoint(center, true, closestPointTemp);
      if (closestPoint3.distanceTo(center) <= radius) return true;
      const plane = triangle3.getPlane(planeTemp);
      const dp = Math.abs(plane.distanceToPoint(center));
      if (dp <= radius) {
        const pp = plane.projectPoint(center, projectedPointTemp);
        const cp = triangle3.containsPoint(pp);
        if (cp) return true;
      }
      return false;
    };
  }();
  const ZERO_EPSILON = 1e-15;
  function isNearZero(value) {
    return Math.abs(value) < ZERO_EPSILON;
  }
  class ExtendedTriangle extends Triangle {
    constructor(...args) {
      super(...args);
      this.isExtendedTriangle = true;
      this.satAxes = new Array(4).fill().map(() => new Vector3());
      this.satBounds = new Array(4).fill().map(() => new SeparatingAxisBounds());
      this.points = [this.a, this.b, this.c];
      this.sphere = new Sphere();
      this.plane = new Plane();
      this.needsUpdate = true;
    }
    intersectsSphere(sphere) {
      return sphereIntersectTriangle(sphere, this);
    }
    update() {
      const a = this.a;
      const b = this.b;
      const c = this.c;
      const points = this.points;
      const satAxes = this.satAxes;
      const satBounds = this.satBounds;
      const axis0 = satAxes[0];
      const sab0 = satBounds[0];
      this.getNormal(axis0);
      sab0.setFromPoints(axis0, points);
      const axis1 = satAxes[1];
      const sab1 = satBounds[1];
      axis1.subVectors(a, b);
      sab1.setFromPoints(axis1, points);
      const axis2 = satAxes[2];
      const sab2 = satBounds[2];
      axis2.subVectors(b, c);
      sab2.setFromPoints(axis2, points);
      const axis3 = satAxes[3];
      const sab3 = satBounds[3];
      axis3.subVectors(c, a);
      sab3.setFromPoints(axis3, points);
      this.sphere.setFromPoints(this.points);
      this.plane.setFromNormalAndCoplanarPoint(axis0, a);
      this.needsUpdate = false;
    }
  }
  ExtendedTriangle.prototype.closestPointToSegment = function() {
    const point1 = new Vector3();
    const point2 = new Vector3();
    const edge = new Line3();
    return function distanceToSegment(segment, target1 = null, target2 = null) {
      const { start, end } = segment;
      const points = this.points;
      let distSq;
      let closestDistanceSq = Infinity;
      for (let i = 0; i < 3; i++) {
        const nexti = (i + 1) % 3;
        edge.start.copy(points[i]);
        edge.end.copy(points[nexti]);
        closestPointsSegmentToSegment(edge, segment, point1, point2);
        distSq = point1.distanceToSquared(point2);
        if (distSq < closestDistanceSq) {
          closestDistanceSq = distSq;
          if (target1) target1.copy(point1);
          if (target2) target2.copy(point2);
        }
      }
      this.closestPointToPoint(start, point1);
      distSq = start.distanceToSquared(point1);
      if (distSq < closestDistanceSq) {
        closestDistanceSq = distSq;
        if (target1) target1.copy(point1);
        if (target2) target2.copy(start);
      }
      this.closestPointToPoint(end, point1);
      distSq = end.distanceToSquared(point1);
      if (distSq < closestDistanceSq) {
        closestDistanceSq = distSq;
        if (target1) target1.copy(point1);
        if (target2) target2.copy(end);
      }
      return Math.sqrt(closestDistanceSq);
    };
  }();
  ExtendedTriangle.prototype.intersectsTriangle = function() {
    const saTri2 = new ExtendedTriangle();
    const arr1 = new Array(3);
    const arr2 = new Array(3);
    const cachedSatBounds = new SeparatingAxisBounds();
    const cachedSatBounds2 = new SeparatingAxisBounds();
    const cachedAxis = new Vector3();
    const dir = new Vector3();
    const dir1 = new Vector3();
    const dir2 = new Vector3();
    const tempDir = new Vector3();
    const edge = new Line3();
    const edge1 = new Line3();
    const edge2 = new Line3();
    const tempPoint = new Vector3();
    function triIntersectPlane(tri, plane, targetEdge) {
      const points = tri.points;
      let count = 0;
      let startPointIntersection = -1;
      for (let i = 0; i < 3; i++) {
        const { start, end } = edge;
        start.copy(points[i]);
        end.copy(points[(i + 1) % 3]);
        edge.delta(dir);
        const startIntersects = isNearZero(plane.distanceToPoint(start));
        if (isNearZero(plane.normal.dot(dir)) && startIntersects) {
          targetEdge.copy(edge);
          count = 2;
          break;
        }
        const doesIntersect = plane.intersectLine(edge, tempPoint);
        if (!doesIntersect && startIntersects) {
          tempPoint.copy(start);
        }
        if ((doesIntersect || startIntersects) && !isNearZero(tempPoint.distanceTo(end))) {
          if (count <= 1) {
            const point = count === 1 ? targetEdge.start : targetEdge.end;
            point.copy(tempPoint);
            if (startIntersects) {
              startPointIntersection = count;
            }
          } else if (count >= 2) {
            const point = startPointIntersection === 1 ? targetEdge.start : targetEdge.end;
            point.copy(tempPoint);
            count = 2;
            break;
          }
          count++;
          if (count === 2 && startPointIntersection === -1) {
            break;
          }
        }
      }
      return count;
    }
    return function intersectsTriangle(other, target = null, suppressLog = false) {
      if (this.needsUpdate) {
        this.update();
      }
      if (!other.isExtendedTriangle) {
        saTri2.copy(other);
        saTri2.update();
        other = saTri2;
      } else if (other.needsUpdate) {
        other.update();
      }
      const plane1 = this.plane;
      const plane2 = other.plane;
      if (Math.abs(plane1.normal.dot(plane2.normal)) > 1 - 1e-10) {
        const satBounds1 = this.satBounds;
        const satAxes1 = this.satAxes;
        arr2[0] = other.a;
        arr2[1] = other.b;
        arr2[2] = other.c;
        for (let i = 0; i < 4; i++) {
          const sb = satBounds1[i];
          const sa = satAxes1[i];
          cachedSatBounds.setFromPoints(sa, arr2);
          if (sb.isSeparated(cachedSatBounds)) return false;
        }
        const satBounds2 = other.satBounds;
        const satAxes2 = other.satAxes;
        arr1[0] = this.a;
        arr1[1] = this.b;
        arr1[2] = this.c;
        for (let i = 0; i < 4; i++) {
          const sb = satBounds2[i];
          const sa = satAxes2[i];
          cachedSatBounds.setFromPoints(sa, arr1);
          if (sb.isSeparated(cachedSatBounds)) return false;
        }
        for (let i = 0; i < 4; i++) {
          const sa1 = satAxes1[i];
          for (let i2 = 0; i2 < 4; i2++) {
            const sa2 = satAxes2[i2];
            cachedAxis.crossVectors(sa1, sa2);
            cachedSatBounds.setFromPoints(cachedAxis, arr1);
            cachedSatBounds2.setFromPoints(cachedAxis, arr2);
            if (cachedSatBounds.isSeparated(cachedSatBounds2)) return false;
          }
        }
        if (target) {
          if (!suppressLog) {
            console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0.");
          }
          target.start.set(0, 0, 0);
          target.end.set(0, 0, 0);
        }
        return true;
      } else {
        const count1 = triIntersectPlane(this, plane2, edge1);
        if (count1 === 1 && other.containsPoint(edge1.end)) {
          if (target) {
            target.start.copy(edge1.end);
            target.end.copy(edge1.end);
          }
          return true;
        } else if (count1 !== 2) {
          return false;
        }
        const count2 = triIntersectPlane(other, plane1, edge2);
        if (count2 === 1 && this.containsPoint(edge2.end)) {
          if (target) {
            target.start.copy(edge2.end);
            target.end.copy(edge2.end);
          }
          return true;
        } else if (count2 !== 2) {
          return false;
        }
        edge1.delta(dir1);
        edge2.delta(dir2);
        if (dir1.dot(dir2) < 0) {
          let tmp = edge2.start;
          edge2.start = edge2.end;
          edge2.end = tmp;
        }
        const s1 = edge1.start.dot(dir1);
        const e1 = edge1.end.dot(dir1);
        const s2 = edge2.start.dot(dir1);
        const e2 = edge2.end.dot(dir1);
        const separated1 = e1 < s2;
        const separated2 = s1 < e2;
        if (s1 !== e2 && s2 !== e1 && separated1 === separated2) {
          return false;
        }
        if (target) {
          tempDir.subVectors(edge1.start, edge2.start);
          if (tempDir.dot(dir1) > 0) {
            target.start.copy(edge1.start);
          } else {
            target.start.copy(edge2.start);
          }
          tempDir.subVectors(edge1.end, edge2.end);
          if (tempDir.dot(dir1) < 0) {
            target.end.copy(edge1.end);
          } else {
            target.end.copy(edge2.end);
          }
        }
        return true;
      }
    };
  }();
  ExtendedTriangle.prototype.distanceToPoint = function() {
    const target = new Vector3();
    return function distanceToPoint(point) {
      this.closestPointToPoint(point, target);
      return point.distanceTo(target);
    };
  }();
  ExtendedTriangle.prototype.distanceToTriangle = function() {
    const point = new Vector3();
    const point2 = new Vector3();
    const cornerFields = ["a", "b", "c"];
    const line1 = new Line3();
    const line2 = new Line3();
    return function distanceToTriangle(other, target1 = null, target2 = null) {
      const lineTarget = target1 || target2 ? line1 : null;
      if (this.intersectsTriangle(other, lineTarget)) {
        if (target1 || target2) {
          if (target1) lineTarget.getCenter(target1);
          if (target2) lineTarget.getCenter(target2);
        }
        return 0;
      }
      let closestDistanceSq = Infinity;
      for (let i = 0; i < 3; i++) {
        let dist;
        const field = cornerFields[i];
        const otherVec = other[field];
        this.closestPointToPoint(otherVec, point);
        dist = otherVec.distanceToSquared(point);
        if (dist < closestDistanceSq) {
          closestDistanceSq = dist;
          if (target1) target1.copy(point);
          if (target2) target2.copy(otherVec);
        }
        const thisVec = this[field];
        other.closestPointToPoint(thisVec, point);
        dist = thisVec.distanceToSquared(point);
        if (dist < closestDistanceSq) {
          closestDistanceSq = dist;
          if (target1) target1.copy(thisVec);
          if (target2) target2.copy(point);
        }
      }
      for (let i = 0; i < 3; i++) {
        const f11 = cornerFields[i];
        const f12 = cornerFields[(i + 1) % 3];
        line1.set(this[f11], this[f12]);
        for (let i2 = 0; i2 < 3; i2++) {
          const f21 = cornerFields[i2];
          const f22 = cornerFields[(i2 + 1) % 3];
          line2.set(other[f21], other[f22]);
          closestPointsSegmentToSegment(line1, line2, point, point2);
          const dist = point.distanceToSquared(point2);
          if (dist < closestDistanceSq) {
            closestDistanceSq = dist;
            if (target1) target1.copy(point);
            if (target2) target2.copy(point2);
          }
        }
      }
      return Math.sqrt(closestDistanceSq);
    };
  }();
  class OrientedBox {
    constructor(min, max, matrix) {
      this.isOrientedBox = true;
      this.min = new Vector3();
      this.max = new Vector3();
      this.matrix = new Matrix4();
      this.invMatrix = new Matrix4();
      this.points = new Array(8).fill().map(() => new Vector3());
      this.satAxes = new Array(3).fill().map(() => new Vector3());
      this.satBounds = new Array(3).fill().map(() => new SeparatingAxisBounds());
      this.alignedSatBounds = new Array(3).fill().map(() => new SeparatingAxisBounds());
      this.needsUpdate = false;
      if (min) this.min.copy(min);
      if (max) this.max.copy(max);
      if (matrix) this.matrix.copy(matrix);
    }
    set(min, max, matrix) {
      this.min.copy(min);
      this.max.copy(max);
      this.matrix.copy(matrix);
      this.needsUpdate = true;
    }
    copy(other) {
      this.min.copy(other.min);
      this.max.copy(other.max);
      this.matrix.copy(other.matrix);
      this.needsUpdate = true;
    }
  }
  OrientedBox.prototype.update = /* @__PURE__ */ function() {
    return function update() {
      const matrix = this.matrix;
      const min = this.min;
      const max = this.max;
      const points = this.points;
      for (let x = 0; x <= 1; x++) {
        for (let y = 0; y <= 1; y++) {
          for (let z = 0; z <= 1; z++) {
            const i = (1 << 0) * x | (1 << 1) * y | (1 << 2) * z;
            const v = points[i];
            v.x = x ? max.x : min.x;
            v.y = y ? max.y : min.y;
            v.z = z ? max.z : min.z;
            v.applyMatrix4(matrix);
          }
        }
      }
      const satBounds = this.satBounds;
      const satAxes = this.satAxes;
      const minVec = points[0];
      for (let i = 0; i < 3; i++) {
        const axis = satAxes[i];
        const sb = satBounds[i];
        const index = 1 << i;
        const pi = points[index];
        axis.subVectors(minVec, pi);
        sb.setFromPoints(axis, points);
      }
      const alignedSatBounds = this.alignedSatBounds;
      alignedSatBounds[0].setFromPointsField(points, "x");
      alignedSatBounds[1].setFromPointsField(points, "y");
      alignedSatBounds[2].setFromPointsField(points, "z");
      this.invMatrix.copy(this.matrix).invert();
      this.needsUpdate = false;
    };
  }();
  OrientedBox.prototype.intersectsBox = function() {
    const aabbBounds = new SeparatingAxisBounds();
    return function intersectsBox(box) {
      if (this.needsUpdate) {
        this.update();
      }
      const min = box.min;
      const max = box.max;
      const satBounds = this.satBounds;
      const satAxes = this.satAxes;
      const alignedSatBounds = this.alignedSatBounds;
      aabbBounds.min = min.x;
      aabbBounds.max = max.x;
      if (alignedSatBounds[0].isSeparated(aabbBounds)) return false;
      aabbBounds.min = min.y;
      aabbBounds.max = max.y;
      if (alignedSatBounds[1].isSeparated(aabbBounds)) return false;
      aabbBounds.min = min.z;
      aabbBounds.max = max.z;
      if (alignedSatBounds[2].isSeparated(aabbBounds)) return false;
      for (let i = 0; i < 3; i++) {
        const axis = satAxes[i];
        const sb = satBounds[i];
        aabbBounds.setFromBox(axis, box);
        if (sb.isSeparated(aabbBounds)) return false;
      }
      return true;
    };
  }();
  OrientedBox.prototype.intersectsTriangle = function() {
    const saTri = new ExtendedTriangle();
    const pointsArr = new Array(3);
    const cachedSatBounds = new SeparatingAxisBounds();
    const cachedSatBounds2 = new SeparatingAxisBounds();
    const cachedAxis = new Vector3();
    return function intersectsTriangle(triangle3) {
      if (this.needsUpdate) {
        this.update();
      }
      if (!triangle3.isExtendedTriangle) {
        saTri.copy(triangle3);
        saTri.update();
        triangle3 = saTri;
      } else if (triangle3.needsUpdate) {
        triangle3.update();
      }
      const satBounds = this.satBounds;
      const satAxes = this.satAxes;
      pointsArr[0] = triangle3.a;
      pointsArr[1] = triangle3.b;
      pointsArr[2] = triangle3.c;
      for (let i = 0; i < 3; i++) {
        const sb = satBounds[i];
        const sa = satAxes[i];
        cachedSatBounds.setFromPoints(sa, pointsArr);
        if (sb.isSeparated(cachedSatBounds)) return false;
      }
      const triSatBounds = triangle3.satBounds;
      const triSatAxes = triangle3.satAxes;
      const points = this.points;
      for (let i = 0; i < 3; i++) {
        const sb = triSatBounds[i];
        const sa = triSatAxes[i];
        cachedSatBounds.setFromPoints(sa, points);
        if (sb.isSeparated(cachedSatBounds)) return false;
      }
      for (let i = 0; i < 3; i++) {
        const sa1 = satAxes[i];
        for (let i2 = 0; i2 < 4; i2++) {
          const sa2 = triSatAxes[i2];
          cachedAxis.crossVectors(sa1, sa2);
          cachedSatBounds.setFromPoints(cachedAxis, pointsArr);
          cachedSatBounds2.setFromPoints(cachedAxis, points);
          if (cachedSatBounds.isSeparated(cachedSatBounds2)) return false;
        }
      }
      return true;
    };
  }();
  OrientedBox.prototype.closestPointToPoint = /* @__PURE__ */ function() {
    return function closestPointToPoint2(point, target1) {
      if (this.needsUpdate) {
        this.update();
      }
      target1.copy(point).applyMatrix4(this.invMatrix).clamp(this.min, this.max).applyMatrix4(this.matrix);
      return target1;
    };
  }();
  OrientedBox.prototype.distanceToPoint = function() {
    const target = new Vector3();
    return function distanceToPoint(point) {
      this.closestPointToPoint(point, target);
      return point.distanceTo(target);
    };
  }();
  OrientedBox.prototype.distanceToBox = function() {
    const xyzFields = ["x", "y", "z"];
    const segments1 = new Array(12).fill().map(() => new Line3());
    const segments2 = new Array(12).fill().map(() => new Line3());
    const point1 = new Vector3();
    const point2 = new Vector3();
    return function distanceToBox(box, threshold = 0, target1 = null, target2 = null) {
      if (this.needsUpdate) {
        this.update();
      }
      if (this.intersectsBox(box)) {
        if (target1 || target2) {
          box.getCenter(point2);
          this.closestPointToPoint(point2, point1);
          box.closestPointToPoint(point1, point2);
          if (target1) target1.copy(point1);
          if (target2) target2.copy(point2);
        }
        return 0;
      }
      const threshold2 = threshold * threshold;
      const min = box.min;
      const max = box.max;
      const points = this.points;
      let closestDistanceSq = Infinity;
      for (let i = 0; i < 8; i++) {
        const p = points[i];
        point2.copy(p).clamp(min, max);
        const dist = p.distanceToSquared(point2);
        if (dist < closestDistanceSq) {
          closestDistanceSq = dist;
          if (target1) target1.copy(p);
          if (target2) target2.copy(point2);
          if (dist < threshold2) return Math.sqrt(dist);
        }
      }
      let count = 0;
      for (let i = 0; i < 3; i++) {
        for (let i1 = 0; i1 <= 1; i1++) {
          for (let i2 = 0; i2 <= 1; i2++) {
            const nextIndex = (i + 1) % 3;
            const nextIndex2 = (i + 2) % 3;
            const index = i1 << nextIndex | i2 << nextIndex2;
            const index2 = 1 << i | i1 << nextIndex | i2 << nextIndex2;
            const p1 = points[index];
            const p2 = points[index2];
            const line1 = segments1[count];
            line1.set(p1, p2);
            const f1 = xyzFields[i];
            const f2 = xyzFields[nextIndex];
            const f3 = xyzFields[nextIndex2];
            const line2 = segments2[count];
            const start = line2.start;
            const end = line2.end;
            start[f1] = min[f1];
            start[f2] = i1 ? min[f2] : max[f2];
            start[f3] = i2 ? min[f3] : max[f2];
            end[f1] = max[f1];
            end[f2] = i1 ? min[f2] : max[f2];
            end[f3] = i2 ? min[f3] : max[f2];
            count++;
          }
        }
      }
      for (let x = 0; x <= 1; x++) {
        for (let y = 0; y <= 1; y++) {
          for (let z = 0; z <= 1; z++) {
            point2.x = x ? max.x : min.x;
            point2.y = y ? max.y : min.y;
            point2.z = z ? max.z : min.z;
            this.closestPointToPoint(point2, point1);
            const dist = point2.distanceToSquared(point1);
            if (dist < closestDistanceSq) {
              closestDistanceSq = dist;
              if (target1) target1.copy(point1);
              if (target2) target2.copy(point2);
              if (dist < threshold2) return Math.sqrt(dist);
            }
          }
        }
      }
      for (let i = 0; i < 12; i++) {
        const l1 = segments1[i];
        for (let i2 = 0; i2 < 12; i2++) {
          const l2 = segments2[i2];
          closestPointsSegmentToSegment(l1, l2, point1, point2);
          const dist = point1.distanceToSquared(point2);
          if (dist < closestDistanceSq) {
            closestDistanceSq = dist;
            if (target1) target1.copy(point1);
            if (target2) target2.copy(point2);
            if (dist < threshold2) return Math.sqrt(dist);
          }
        }
      }
      return Math.sqrt(closestDistanceSq);
    };
  }();
  class PrimitivePool {
    constructor(getNewPrimitive) {
      this._getNewPrimitive = getNewPrimitive;
      this._primitives = [];
    }
    getPrimitive() {
      const primitives = this._primitives;
      if (primitives.length === 0) {
        return this._getNewPrimitive();
      } else {
        return primitives.pop();
      }
    }
    releasePrimitive(primitive) {
      this._primitives.push(primitive);
    }
  }
  class ExtendedTrianglePoolBase extends PrimitivePool {
    constructor() {
      super(() => new ExtendedTriangle());
    }
  }
  const ExtendedTrianglePool = /* @__PURE__ */ new ExtendedTrianglePoolBase();
  class _BufferStack {
    constructor() {
      this.float32Array = null;
      this.uint16Array = null;
      this.uint32Array = null;
      const stack = [];
      let prevBuffer = null;
      this.setBuffer = (buffer) => {
        if (prevBuffer) {
          stack.push(prevBuffer);
        }
        prevBuffer = buffer;
        this.float32Array = new Float32Array(buffer);
        this.uint16Array = new Uint16Array(buffer);
        this.uint32Array = new Uint32Array(buffer);
      };
      this.clearBuffer = () => {
        prevBuffer = null;
        this.float32Array = null;
        this.uint16Array = null;
        this.uint32Array = null;
        if (stack.length !== 0) {
          this.setBuffer(stack.pop());
        }
      };
    }
  }
  const BufferStack = new _BufferStack();
  let _box1, _box2;
  const boxStack = [];
  const boxPool = /* @__PURE__ */ new PrimitivePool(() => new Box3());
  function shapecast(bvh, root, intersectsBounds, intersectsRange, boundsTraverseOrder, byteOffset) {
    _box1 = boxPool.getPrimitive();
    _box2 = boxPool.getPrimitive();
    boxStack.push(_box1, _box2);
    BufferStack.setBuffer(bvh._roots[root]);
    const result = shapecastTraverse(0, bvh.geometry, intersectsBounds, intersectsRange, boundsTraverseOrder, byteOffset);
    BufferStack.clearBuffer();
    boxPool.releasePrimitive(_box1);
    boxPool.releasePrimitive(_box2);
    boxStack.pop();
    boxStack.pop();
    const length = boxStack.length;
    if (length > 0) {
      _box2 = boxStack[length - 1];
      _box1 = boxStack[length - 2];
    }
    return result;
  }
  function shapecastTraverse(nodeIndex32, geometry, intersectsBoundsFunc, intersectsRangeFunc, nodeScoreFunc = null, nodeIndexByteOffset = 0, depth = 0) {
    const { float32Array: float32Array2, uint16Array: uint16Array2, uint32Array: uint32Array2 } = BufferStack;
    let nodeIndex16 = nodeIndex32 * 2;
    const isLeaf = IS_LEAF(nodeIndex16, uint16Array2);
    if (isLeaf) {
      const offset = OFFSET(nodeIndex32, uint32Array2);
      const count = COUNT(nodeIndex16, uint16Array2);
      arrayToBox(BOUNDING_DATA_INDEX(nodeIndex32), float32Array2, _box1);
      return intersectsRangeFunc(offset, count, false, depth, nodeIndexByteOffset + nodeIndex32, _box1);
    } else {
      let getLeftOffset = function(nodeIndex322) {
        const { uint16Array: uint16Array3, uint32Array: uint32Array3 } = BufferStack;
        let nodeIndex162 = nodeIndex322 * 2;
        while (!IS_LEAF(nodeIndex162, uint16Array3)) {
          nodeIndex322 = LEFT_NODE(nodeIndex322);
          nodeIndex162 = nodeIndex322 * 2;
        }
        return OFFSET(nodeIndex322, uint32Array3);
      }, getRightEndOffset = function(nodeIndex322) {
        const { uint16Array: uint16Array3, uint32Array: uint32Array3 } = BufferStack;
        let nodeIndex162 = nodeIndex322 * 2;
        while (!IS_LEAF(nodeIndex162, uint16Array3)) {
          nodeIndex322 = RIGHT_NODE(nodeIndex322, uint32Array3);
          nodeIndex162 = nodeIndex322 * 2;
        }
        return OFFSET(nodeIndex322, uint32Array3) + COUNT(nodeIndex162, uint16Array3);
      };
      const left = LEFT_NODE(nodeIndex32);
      const right = RIGHT_NODE(nodeIndex32, uint32Array2);
      let c1 = left;
      let c2 = right;
      let score1, score2;
      let box1, box2;
      if (nodeScoreFunc) {
        box1 = _box1;
        box2 = _box2;
        arrayToBox(BOUNDING_DATA_INDEX(c1), float32Array2, box1);
        arrayToBox(BOUNDING_DATA_INDEX(c2), float32Array2, box2);
        score1 = nodeScoreFunc(box1);
        score2 = nodeScoreFunc(box2);
        if (score2 < score1) {
          c1 = right;
          c2 = left;
          const temp5 = score1;
          score1 = score2;
          score2 = temp5;
          box1 = box2;
        }
      }
      if (!box1) {
        box1 = _box1;
        arrayToBox(BOUNDING_DATA_INDEX(c1), float32Array2, box1);
      }
      const isC1Leaf = IS_LEAF(c1 * 2, uint16Array2);
      const c1Intersection = intersectsBoundsFunc(box1, isC1Leaf, score1, depth + 1, nodeIndexByteOffset + c1);
      let c1StopTraversal;
      if (c1Intersection === CONTAINED) {
        const offset = getLeftOffset(c1);
        const end = getRightEndOffset(c1);
        const count = end - offset;
        c1StopTraversal = intersectsRangeFunc(offset, count, true, depth + 1, nodeIndexByteOffset + c1, box1);
      } else {
        c1StopTraversal = c1Intersection && shapecastTraverse(
          c1,
          geometry,
          intersectsBoundsFunc,
          intersectsRangeFunc,
          nodeScoreFunc,
          nodeIndexByteOffset,
          depth + 1
        );
      }
      if (c1StopTraversal) return true;
      box2 = _box2;
      arrayToBox(BOUNDING_DATA_INDEX(c2), float32Array2, box2);
      const isC2Leaf = IS_LEAF(c2 * 2, uint16Array2);
      const c2Intersection = intersectsBoundsFunc(box2, isC2Leaf, score2, depth + 1, nodeIndexByteOffset + c2);
      let c2StopTraversal;
      if (c2Intersection === CONTAINED) {
        const offset = getLeftOffset(c2);
        const end = getRightEndOffset(c2);
        const count = end - offset;
        c2StopTraversal = intersectsRangeFunc(offset, count, true, depth + 1, nodeIndexByteOffset + c2, box2);
      } else {
        c2StopTraversal = c2Intersection && shapecastTraverse(
          c2,
          geometry,
          intersectsBoundsFunc,
          intersectsRangeFunc,
          nodeScoreFunc,
          nodeIndexByteOffset,
          depth + 1
        );
      }
      if (c2StopTraversal) return true;
      return false;
    }
  }
  const temp = /* @__PURE__ */ new Vector3();
  const temp1$2 = /* @__PURE__ */ new Vector3();
  function closestPointToPoint(bvh, point, target = {}, minThreshold = 0, maxThreshold = Infinity) {
    const minThresholdSq = minThreshold * minThreshold;
    const maxThresholdSq = maxThreshold * maxThreshold;
    let closestDistanceSq = Infinity;
    let closestDistanceTriIndex = null;
    bvh.shapecast(
      {
        boundsTraverseOrder: (box) => {
          temp.copy(point).clamp(box.min, box.max);
          return temp.distanceToSquared(point);
        },
        intersectsBounds: (box, isLeaf, score) => {
          return score < closestDistanceSq && score < maxThresholdSq;
        },
        intersectsTriangle: (tri, triIndex) => {
          tri.closestPointToPoint(point, temp);
          const distSq = point.distanceToSquared(temp);
          if (distSq < closestDistanceSq) {
            temp1$2.copy(temp);
            closestDistanceSq = distSq;
            closestDistanceTriIndex = triIndex;
          }
          if (distSq < minThresholdSq) {
            return true;
          } else {
            return false;
          }
        }
      }
    );
    if (closestDistanceSq === Infinity) return null;
    const closestDistance = Math.sqrt(closestDistanceSq);
    if (!target.point) target.point = temp1$2.clone();
    else target.point.copy(temp1$2);
    target.distance = closestDistance, target.faceIndex = closestDistanceTriIndex;
    return target;
  }
  const IS_GT_REVISION_169 = parseInt(REVISION) >= 169;
  const _vA = /* @__PURE__ */ new Vector3();
  const _vB = /* @__PURE__ */ new Vector3();
  const _vC = /* @__PURE__ */ new Vector3();
  const _uvA = /* @__PURE__ */ new Vector2();
  const _uvB = /* @__PURE__ */ new Vector2();
  const _uvC = /* @__PURE__ */ new Vector2();
  const _normalA = /* @__PURE__ */ new Vector3();
  const _normalB = /* @__PURE__ */ new Vector3();
  const _normalC = /* @__PURE__ */ new Vector3();
  const _intersectionPoint = /* @__PURE__ */ new Vector3();
  function checkIntersection(ray, pA, pB, pC, point, side, near, far) {
    let intersect;
    if (side === BackSide) {
      intersect = ray.intersectTriangle(pC, pB, pA, true, point);
    } else {
      intersect = ray.intersectTriangle(pA, pB, pC, side !== DoubleSide, point);
    }
    if (intersect === null) return null;
    const distance = ray.origin.distanceTo(point);
    if (distance < near || distance > far) return null;
    return {
      distance,
      point: point.clone()
    };
  }
  function checkBufferGeometryIntersection(ray, position, normal, uv, uv1, a, b, c, side, near, far) {
    _vA.fromBufferAttribute(position, a);
    _vB.fromBufferAttribute(position, b);
    _vC.fromBufferAttribute(position, c);
    const intersection = checkIntersection(ray, _vA, _vB, _vC, _intersectionPoint, side, near, far);
    if (intersection) {
      const barycoord = new Vector3();
      Triangle.getBarycoord(_intersectionPoint, _vA, _vB, _vC, barycoord);
      if (uv) {
        _uvA.fromBufferAttribute(uv, a);
        _uvB.fromBufferAttribute(uv, b);
        _uvC.fromBufferAttribute(uv, c);
        intersection.uv = Triangle.getInterpolation(_intersectionPoint, _vA, _vB, _vC, _uvA, _uvB, _uvC, new Vector2());
      }
      if (uv1) {
        _uvA.fromBufferAttribute(uv1, a);
        _uvB.fromBufferAttribute(uv1, b);
        _uvC.fromBufferAttribute(uv1, c);
        intersection.uv1 = Triangle.getInterpolation(_intersectionPoint, _vA, _vB, _vC, _uvA, _uvB, _uvC, new Vector2());
      }
      if (normal) {
        _normalA.fromBufferAttribute(normal, a);
        _normalB.fromBufferAttribute(normal, b);
        _normalC.fromBufferAttribute(normal, c);
        intersection.normal = Triangle.getInterpolation(_intersectionPoint, _vA, _vB, _vC, _normalA, _normalB, _normalC, new Vector3());
        if (intersection.normal.dot(ray.direction) > 0) {
          intersection.normal.multiplyScalar(-1);
        }
      }
      const face = {
        a,
        b,
        c,
        normal: new Vector3(),
        materialIndex: 0
      };
      Triangle.getNormal(_vA, _vB, _vC, face.normal);
      intersection.face = face;
      intersection.faceIndex = a;
      if (IS_GT_REVISION_169) {
        intersection.barycoord = barycoord;
      }
    }
    return intersection;
  }
  function intersectTri(geo, side, ray, tri, intersections, near, far) {
    const triOffset = tri * 3;
    let a = triOffset + 0;
    let b = triOffset + 1;
    let c = triOffset + 2;
    const index = geo.index;
    if (geo.index) {
      a = index.getX(a);
      b = index.getX(b);
      c = index.getX(c);
    }
    const { position, normal, uv, uv1 } = geo.attributes;
    const intersection = checkBufferGeometryIntersection(ray, position, normal, uv, uv1, a, b, c, side, near, far);
    if (intersection) {
      intersection.faceIndex = tri;
      if (intersections) intersections.push(intersection);
      return intersection;
    }
    return null;
  }
  function setTriangle(tri, i, index, pos) {
    const ta = tri.a;
    const tb = tri.b;
    const tc = tri.c;
    let i0 = i;
    let i1 = i + 1;
    let i2 = i + 2;
    if (index) {
      i0 = index.getX(i0);
      i1 = index.getX(i1);
      i2 = index.getX(i2);
    }
    ta.x = pos.getX(i0);
    ta.y = pos.getY(i0);
    ta.z = pos.getZ(i0);
    tb.x = pos.getX(i1);
    tb.y = pos.getY(i1);
    tb.z = pos.getZ(i1);
    tc.x = pos.getX(i2);
    tc.y = pos.getY(i2);
    tc.z = pos.getZ(i2);
  }
  function intersectTris(bvh, side, ray, offset, count, intersections, near, far) {
    const { geometry, _indirectBuffer } = bvh;
    for (let i = offset, end = offset + count; i < end; i++) {
      intersectTri(geometry, side, ray, i, intersections, near, far);
    }
  }
  function intersectClosestTri(bvh, side, ray, offset, count, near, far) {
    const { geometry, _indirectBuffer } = bvh;
    let dist = Infinity;
    let res = null;
    for (let i = offset, end = offset + count; i < end; i++) {
      let intersection;
      intersection = intersectTri(geometry, side, ray, i, null, near, far);
      if (intersection && intersection.distance < dist) {
        res = intersection;
        dist = intersection.distance;
      }
    }
    return res;
  }
  function iterateOverTriangles(offset, count, bvh, intersectsTriangleFunc, contained, depth, triangle3) {
    const { geometry } = bvh;
    const { index } = geometry;
    const pos = geometry.attributes.position;
    for (let i = offset, l = count + offset; i < l; i++) {
      let tri;
      tri = i;
      setTriangle(triangle3, tri * 3, index, pos);
      triangle3.needsUpdate = true;
      if (intersectsTriangleFunc(triangle3, tri, contained, depth)) {
        return true;
      }
    }
    return false;
  }
  function refit(bvh, nodeIndices = null) {
    if (nodeIndices && Array.isArray(nodeIndices)) {
      nodeIndices = new Set(nodeIndices);
    }
    const geometry = bvh.geometry;
    const indexArr = geometry.index ? geometry.index.array : null;
    const posAttr = geometry.attributes.position;
    let buffer, uint32Array2, uint16Array2, float32Array2;
    let byteOffset = 0;
    const roots = bvh._roots;
    for (let i = 0, l = roots.length; i < l; i++) {
      buffer = roots[i];
      uint32Array2 = new Uint32Array(buffer);
      uint16Array2 = new Uint16Array(buffer);
      float32Array2 = new Float32Array(buffer);
      _traverse2(0, byteOffset);
      byteOffset += buffer.byteLength;
    }
    function _traverse2(node32Index, byteOffset2, force = false) {
      const node16Index = node32Index * 2;
      const isLeaf = uint16Array2[node16Index + 15] === IS_LEAFNODE_FLAG;
      if (isLeaf) {
        const offset = uint32Array2[node32Index + 6];
        const count = uint16Array2[node16Index + 14];
        let minx = Infinity;
        let miny = Infinity;
        let minz = Infinity;
        let maxx = -Infinity;
        let maxy = -Infinity;
        let maxz = -Infinity;
        for (let i = 3 * offset, l = 3 * (offset + count); i < l; i++) {
          let index = indexArr[i];
          const x = posAttr.getX(index);
          const y = posAttr.getY(index);
          const z = posAttr.getZ(index);
          if (x < minx) minx = x;
          if (x > maxx) maxx = x;
          if (y < miny) miny = y;
          if (y > maxy) maxy = y;
          if (z < minz) minz = z;
          if (z > maxz) maxz = z;
        }
        if (float32Array2[node32Index + 0] !== minx || float32Array2[node32Index + 1] !== miny || float32Array2[node32Index + 2] !== minz || float32Array2[node32Index + 3] !== maxx || float32Array2[node32Index + 4] !== maxy || float32Array2[node32Index + 5] !== maxz) {
          float32Array2[node32Index + 0] = minx;
          float32Array2[node32Index + 1] = miny;
          float32Array2[node32Index + 2] = minz;
          float32Array2[node32Index + 3] = maxx;
          float32Array2[node32Index + 4] = maxy;
          float32Array2[node32Index + 5] = maxz;
          return true;
        } else {
          return false;
        }
      } else {
        const left = node32Index + 8;
        const right = uint32Array2[node32Index + 6];
        const offsetLeft = left + byteOffset2;
        const offsetRight = right + byteOffset2;
        let forceChildren = force;
        let includesLeft = false;
        let includesRight = false;
        if (nodeIndices) {
          if (!forceChildren) {
            includesLeft = nodeIndices.has(offsetLeft);
            includesRight = nodeIndices.has(offsetRight);
            forceChildren = !includesLeft && !includesRight;
          }
        } else {
          includesLeft = true;
          includesRight = true;
        }
        const traverseLeft = forceChildren || includesLeft;
        const traverseRight = forceChildren || includesRight;
        let leftChange = false;
        if (traverseLeft) {
          leftChange = _traverse2(left, byteOffset2, forceChildren);
        }
        let rightChange = false;
        if (traverseRight) {
          rightChange = _traverse2(right, byteOffset2, forceChildren);
        }
        const didChange = leftChange || rightChange;
        if (didChange) {
          for (let i = 0; i < 3; i++) {
            const lefti = left + i;
            const righti = right + i;
            const minLeftValue = float32Array2[lefti];
            const maxLeftValue = float32Array2[lefti + 3];
            const minRightValue = float32Array2[righti];
            const maxRightValue = float32Array2[righti + 3];
            float32Array2[node32Index + i] = minLeftValue < minRightValue ? minLeftValue : minRightValue;
            float32Array2[node32Index + i + 3] = maxLeftValue > maxRightValue ? maxLeftValue : maxRightValue;
          }
        }
        return didChange;
      }
    }
  }
  function intersectRay(nodeIndex32, array, ray, near, far) {
    let tmin, tmax, tymin, tymax, tzmin, tzmax;
    const invdirx = 1 / ray.direction.x, invdiry = 1 / ray.direction.y, invdirz = 1 / ray.direction.z;
    const ox = ray.origin.x;
    const oy = ray.origin.y;
    const oz = ray.origin.z;
    let minx = array[nodeIndex32];
    let maxx = array[nodeIndex32 + 3];
    let miny = array[nodeIndex32 + 1];
    let maxy = array[nodeIndex32 + 3 + 1];
    let minz = array[nodeIndex32 + 2];
    let maxz = array[nodeIndex32 + 3 + 2];
    if (invdirx >= 0) {
      tmin = (minx - ox) * invdirx;
      tmax = (maxx - ox) * invdirx;
    } else {
      tmin = (maxx - ox) * invdirx;
      tmax = (minx - ox) * invdirx;
    }
    if (invdiry >= 0) {
      tymin = (miny - oy) * invdiry;
      tymax = (maxy - oy) * invdiry;
    } else {
      tymin = (maxy - oy) * invdiry;
      tymax = (miny - oy) * invdiry;
    }
    if (tmin > tymax || tymin > tmax) return false;
    if (tymin > tmin || isNaN(tmin)) tmin = tymin;
    if (tymax < tmax || isNaN(tmax)) tmax = tymax;
    if (invdirz >= 0) {
      tzmin = (minz - oz) * invdirz;
      tzmax = (maxz - oz) * invdirz;
    } else {
      tzmin = (maxz - oz) * invdirz;
      tzmax = (minz - oz) * invdirz;
    }
    if (tmin > tzmax || tzmin > tmax) return false;
    if (tzmin > tmin || tmin !== tmin) tmin = tzmin;
    if (tzmax < tmax || tmax !== tmax) tmax = tzmax;
    return tmin <= far && tmax >= near;
  }
  function intersectTris_indirect(bvh, side, ray, offset, count, intersections, near, far) {
    const { geometry, _indirectBuffer } = bvh;
    for (let i = offset, end = offset + count; i < end; i++) {
      let vi = _indirectBuffer ? _indirectBuffer[i] : i;
      intersectTri(geometry, side, ray, vi, intersections, near, far);
    }
  }
  function intersectClosestTri_indirect(bvh, side, ray, offset, count, near, far) {
    const { geometry, _indirectBuffer } = bvh;
    let dist = Infinity;
    let res = null;
    for (let i = offset, end = offset + count; i < end; i++) {
      let intersection;
      intersection = intersectTri(geometry, side, ray, _indirectBuffer ? _indirectBuffer[i] : i, null, near, far);
      if (intersection && intersection.distance < dist) {
        res = intersection;
        dist = intersection.distance;
      }
    }
    return res;
  }
  function iterateOverTriangles_indirect(offset, count, bvh, intersectsTriangleFunc, contained, depth, triangle3) {
    const { geometry } = bvh;
    const { index } = geometry;
    const pos = geometry.attributes.position;
    for (let i = offset, l = count + offset; i < l; i++) {
      let tri;
      tri = bvh.resolveTriangleIndex(i);
      setTriangle(triangle3, tri * 3, index, pos);
      triangle3.needsUpdate = true;
      if (intersectsTriangleFunc(triangle3, tri, contained, depth)) {
        return true;
      }
    }
    return false;
  }
  function raycast(bvh, root, side, ray, intersects, near, far) {
    BufferStack.setBuffer(bvh._roots[root]);
    _raycast$1(0, bvh, side, ray, intersects, near, far);
    BufferStack.clearBuffer();
  }
  function _raycast$1(nodeIndex32, bvh, side, ray, intersects, near, far) {
    const { float32Array: float32Array2, uint16Array: uint16Array2, uint32Array: uint32Array2 } = BufferStack;
    const nodeIndex16 = nodeIndex32 * 2;
    const isLeaf = IS_LEAF(nodeIndex16, uint16Array2);
    if (isLeaf) {
      const offset = OFFSET(nodeIndex32, uint32Array2);
      const count = COUNT(nodeIndex16, uint16Array2);
      intersectTris(bvh, side, ray, offset, count, intersects, near, far);
    } else {
      const leftIndex = LEFT_NODE(nodeIndex32);
      if (intersectRay(leftIndex, float32Array2, ray, near, far)) {
        _raycast$1(leftIndex, bvh, side, ray, intersects, near, far);
      }
      const rightIndex = RIGHT_NODE(nodeIndex32, uint32Array2);
      if (intersectRay(rightIndex, float32Array2, ray, near, far)) {
        _raycast$1(rightIndex, bvh, side, ray, intersects, near, far);
      }
    }
  }
  const _xyzFields$1 = ["x", "y", "z"];
  function raycastFirst(bvh, root, side, ray, near, far) {
    BufferStack.setBuffer(bvh._roots[root]);
    const result = _raycastFirst$1(0, bvh, side, ray, near, far);
    BufferStack.clearBuffer();
    return result;
  }
  function _raycastFirst$1(nodeIndex32, bvh, side, ray, near, far) {
    const { float32Array: float32Array2, uint16Array: uint16Array2, uint32Array: uint32Array2 } = BufferStack;
    let nodeIndex16 = nodeIndex32 * 2;
    const isLeaf = IS_LEAF(nodeIndex16, uint16Array2);
    if (isLeaf) {
      const offset = OFFSET(nodeIndex32, uint32Array2);
      const count = COUNT(nodeIndex16, uint16Array2);
      return intersectClosestTri(bvh, side, ray, offset, count, near, far);
    } else {
      const splitAxis = SPLIT_AXIS(nodeIndex32, uint32Array2);
      const xyzAxis = _xyzFields$1[splitAxis];
      const rayDir = ray.direction[xyzAxis];
      const leftToRight = rayDir >= 0;
      let c1, c2;
      if (leftToRight) {
        c1 = LEFT_NODE(nodeIndex32);
        c2 = RIGHT_NODE(nodeIndex32, uint32Array2);
      } else {
        c1 = RIGHT_NODE(nodeIndex32, uint32Array2);
        c2 = LEFT_NODE(nodeIndex32);
      }
      const c1Intersection = intersectRay(c1, float32Array2, ray, near, far);
      const c1Result = c1Intersection ? _raycastFirst$1(c1, bvh, side, ray, near, far) : null;
      if (c1Result) {
        const point = c1Result.point[xyzAxis];
        const isOutside = leftToRight ? point <= float32Array2[c2 + splitAxis] : (
          // min bounding data
          point >= float32Array2[c2 + splitAxis + 3]
        );
        if (isOutside) {
          return c1Result;
        }
      }
      const c2Intersection = intersectRay(c2, float32Array2, ray, near, far);
      const c2Result = c2Intersection ? _raycastFirst$1(c2, bvh, side, ray, near, far) : null;
      if (c1Result && c2Result) {
        return c1Result.distance <= c2Result.distance ? c1Result : c2Result;
      } else {
        return c1Result || c2Result || null;
      }
    }
  }
  const boundingBox$1 = /* @__PURE__ */ new Box3();
  const triangle$1 = /* @__PURE__ */ new ExtendedTriangle();
  const triangle2$1 = /* @__PURE__ */ new ExtendedTriangle();
  const invertedMat$1 = /* @__PURE__ */ new Matrix4();
  const obb$4 = /* @__PURE__ */ new OrientedBox();
  const obb2$3 = /* @__PURE__ */ new OrientedBox();
  function intersectsGeometry(bvh, root, otherGeometry, geometryToBvh) {
    BufferStack.setBuffer(bvh._roots[root]);
    const result = _intersectsGeometry$1(0, bvh, otherGeometry, geometryToBvh);
    BufferStack.clearBuffer();
    return result;
  }
  function _intersectsGeometry$1(nodeIndex32, bvh, otherGeometry, geometryToBvh, cachedObb = null) {
    const { float32Array: float32Array2, uint16Array: uint16Array2, uint32Array: uint32Array2 } = BufferStack;
    let nodeIndex16 = nodeIndex32 * 2;
    if (cachedObb === null) {
      if (!otherGeometry.boundingBox) {
        otherGeometry.computeBoundingBox();
      }
      obb$4.set(otherGeometry.boundingBox.min, otherGeometry.boundingBox.max, geometryToBvh);
      cachedObb = obb$4;
    }
    const isLeaf = IS_LEAF(nodeIndex16, uint16Array2);
    if (isLeaf) {
      const thisGeometry = bvh.geometry;
      const thisIndex = thisGeometry.index;
      const thisPos = thisGeometry.attributes.position;
      const index = otherGeometry.index;
      const pos = otherGeometry.attributes.position;
      const offset = OFFSET(nodeIndex32, uint32Array2);
      const count = COUNT(nodeIndex16, uint16Array2);
      invertedMat$1.copy(geometryToBvh).invert();
      if (otherGeometry.boundsTree) {
        arrayToBox(BOUNDING_DATA_INDEX(nodeIndex32), float32Array2, obb2$3);
        obb2$3.matrix.copy(invertedMat$1);
        obb2$3.needsUpdate = true;
        const res = otherGeometry.boundsTree.shapecast({
          intersectsBounds: (box) => obb2$3.intersectsBox(box),
          intersectsTriangle: (tri) => {
            tri.a.applyMatrix4(geometryToBvh);
            tri.b.applyMatrix4(geometryToBvh);
            tri.c.applyMatrix4(geometryToBvh);
            tri.needsUpdate = true;
            for (let i = offset * 3, l = (count + offset) * 3; i < l; i += 3) {
              setTriangle(triangle2$1, i, thisIndex, thisPos);
              triangle2$1.needsUpdate = true;
              if (tri.intersectsTriangle(triangle2$1)) {
                return true;
              }
            }
            return false;
          }
        });
        return res;
      } else {
        for (let i = offset * 3, l = (count + offset) * 3; i < l; i += 3) {
          setTriangle(triangle$1, i, thisIndex, thisPos);
          triangle$1.a.applyMatrix4(invertedMat$1);
          triangle$1.b.applyMatrix4(invertedMat$1);
          triangle$1.c.applyMatrix4(invertedMat$1);
          triangle$1.needsUpdate = true;
          for (let i2 = 0, l2 = index.count; i2 < l2; i2 += 3) {
            setTriangle(triangle2$1, i2, index, pos);
            triangle2$1.needsUpdate = true;
            if (triangle$1.intersectsTriangle(triangle2$1)) {
              return true;
            }
          }
        }
      }
    } else {
      const left = nodeIndex32 + 8;
      const right = uint32Array2[nodeIndex32 + 6];
      arrayToBox(BOUNDING_DATA_INDEX(left), float32Array2, boundingBox$1);
      const leftIntersection = cachedObb.intersectsBox(boundingBox$1) && _intersectsGeometry$1(left, bvh, otherGeometry, geometryToBvh, cachedObb);
      if (leftIntersection) return true;
      arrayToBox(BOUNDING_DATA_INDEX(right), float32Array2, boundingBox$1);
      const rightIntersection = cachedObb.intersectsBox(boundingBox$1) && _intersectsGeometry$1(right, bvh, otherGeometry, geometryToBvh, cachedObb);
      if (rightIntersection) return true;
      return false;
    }
  }
  const tempMatrix$1 = /* @__PURE__ */ new Matrix4();
  const obb$3 = /* @__PURE__ */ new OrientedBox();
  const obb2$2 = /* @__PURE__ */ new OrientedBox();
  const temp1$1 = /* @__PURE__ */ new Vector3();
  const temp2$1 = /* @__PURE__ */ new Vector3();
  const temp3$1 = /* @__PURE__ */ new Vector3();
  const temp4$1 = /* @__PURE__ */ new Vector3();
  function closestPointToGeometry(bvh, otherGeometry, geometryToBvh, target1 = {}, target2 = {}, minThreshold = 0, maxThreshold = Infinity) {
    if (!otherGeometry.boundingBox) {
      otherGeometry.computeBoundingBox();
    }
    obb$3.set(otherGeometry.boundingBox.min, otherGeometry.boundingBox.max, geometryToBvh);
    obb$3.needsUpdate = true;
    const geometry = bvh.geometry;
    const pos = geometry.attributes.position;
    const index = geometry.index;
    const otherPos = otherGeometry.attributes.position;
    const otherIndex = otherGeometry.index;
    const triangle3 = ExtendedTrianglePool.getPrimitive();
    const triangle22 = ExtendedTrianglePool.getPrimitive();
    let tempTarget1 = temp1$1;
    let tempTargetDest1 = temp2$1;
    let tempTarget2 = null;
    let tempTargetDest2 = null;
    if (target2) {
      tempTarget2 = temp3$1;
      tempTargetDest2 = temp4$1;
    }
    let closestDistance = Infinity;
    let closestDistanceTriIndex = null;
    let closestDistanceOtherTriIndex = null;
    tempMatrix$1.copy(geometryToBvh).invert();
    obb2$2.matrix.copy(tempMatrix$1);
    bvh.shapecast(
      {
        boundsTraverseOrder: (box) => {
          return obb$3.distanceToBox(box);
        },
        intersectsBounds: (box, isLeaf, score) => {
          if (score < closestDistance && score < maxThreshold) {
            if (isLeaf) {
              obb2$2.min.copy(box.min);
              obb2$2.max.copy(box.max);
              obb2$2.needsUpdate = true;
            }
            return true;
          }
          return false;
        },
        intersectsRange: (offset, count) => {
          if (otherGeometry.boundsTree) {
            const otherBvh = otherGeometry.boundsTree;
            return otherBvh.shapecast({
              boundsTraverseOrder: (box) => {
                return obb2$2.distanceToBox(box);
              },
              intersectsBounds: (box, isLeaf, score) => {
                return score < closestDistance && score < maxThreshold;
              },
              intersectsRange: (otherOffset, otherCount) => {
                for (let i2 = otherOffset, l2 = otherOffset + otherCount; i2 < l2; i2++) {
                  setTriangle(triangle22, 3 * i2, otherIndex, otherPos);
                  triangle22.a.applyMatrix4(geometryToBvh);
                  triangle22.b.applyMatrix4(geometryToBvh);
                  triangle22.c.applyMatrix4(geometryToBvh);
                  triangle22.needsUpdate = true;
                  for (let i = offset, l = offset + count; i < l; i++) {
                    setTriangle(triangle3, 3 * i, index, pos);
                    triangle3.needsUpdate = true;
                    const dist = triangle3.distanceToTriangle(triangle22, tempTarget1, tempTarget2);
                    if (dist < closestDistance) {
                      tempTargetDest1.copy(tempTarget1);
                      if (tempTargetDest2) {
                        tempTargetDest2.copy(tempTarget2);
                      }
                      closestDistance = dist;
                      closestDistanceTriIndex = i;
                      closestDistanceOtherTriIndex = i2;
                    }
                    if (dist < minThreshold) {
                      return true;
                    }
                  }
                }
              }
            });
          } else {
            const triCount = getTriCount(otherGeometry);
            for (let i2 = 0, l2 = triCount; i2 < l2; i2++) {
              setTriangle(triangle22, 3 * i2, otherIndex, otherPos);
              triangle22.a.applyMatrix4(geometryToBvh);
              triangle22.b.applyMatrix4(geometryToBvh);
              triangle22.c.applyMatrix4(geometryToBvh);
              triangle22.needsUpdate = true;
              for (let i = offset, l = offset + count; i < l; i++) {
                setTriangle(triangle3, 3 * i, index, pos);
                triangle3.needsUpdate = true;
                const dist = triangle3.distanceToTriangle(triangle22, tempTarget1, tempTarget2);
                if (dist < closestDistance) {
                  tempTargetDest1.copy(tempTarget1);
                  if (tempTargetDest2) {
                    tempTargetDest2.copy(tempTarget2);
                  }
                  closestDistance = dist;
                  closestDistanceTriIndex = i;
                  closestDistanceOtherTriIndex = i2;
                }
                if (dist < minThreshold) {
                  return true;
                }
              }
            }
          }
        }
      }
    );
    ExtendedTrianglePool.releasePrimitive(triangle3);
    ExtendedTrianglePool.releasePrimitive(triangle22);
    if (closestDistance === Infinity) {
      return null;
    }
    if (!target1.point) {
      target1.point = tempTargetDest1.clone();
    } else {
      target1.point.copy(tempTargetDest1);
    }
    target1.distance = closestDistance, target1.faceIndex = closestDistanceTriIndex;
    if (target2) {
      if (!target2.point) target2.point = tempTargetDest2.clone();
      else target2.point.copy(tempTargetDest2);
      target2.point.applyMatrix4(tempMatrix$1);
      tempTargetDest1.applyMatrix4(tempMatrix$1);
      target2.distance = tempTargetDest1.sub(target2.point).length();
      target2.faceIndex = closestDistanceOtherTriIndex;
    }
    return target1;
  }
  function refit_indirect(bvh, nodeIndices = null) {
    if (nodeIndices && Array.isArray(nodeIndices)) {
      nodeIndices = new Set(nodeIndices);
    }
    const geometry = bvh.geometry;
    const indexArr = geometry.index ? geometry.index.array : null;
    const posAttr = geometry.attributes.position;
    let buffer, uint32Array2, uint16Array2, float32Array2;
    let byteOffset = 0;
    const roots = bvh._roots;
    for (let i = 0, l = roots.length; i < l; i++) {
      buffer = roots[i];
      uint32Array2 = new Uint32Array(buffer);
      uint16Array2 = new Uint16Array(buffer);
      float32Array2 = new Float32Array(buffer);
      _traverse2(0, byteOffset);
      byteOffset += buffer.byteLength;
    }
    function _traverse2(node32Index, byteOffset2, force = false) {
      const node16Index = node32Index * 2;
      const isLeaf = uint16Array2[node16Index + 15] === IS_LEAFNODE_FLAG;
      if (isLeaf) {
        const offset = uint32Array2[node32Index + 6];
        const count = uint16Array2[node16Index + 14];
        let minx = Infinity;
        let miny = Infinity;
        let minz = Infinity;
        let maxx = -Infinity;
        let maxy = -Infinity;
        let maxz = -Infinity;
        for (let i = offset, l = offset + count; i < l; i++) {
          const t = 3 * bvh.resolveTriangleIndex(i);
          for (let j = 0; j < 3; j++) {
            let index = t + j;
            index = indexArr ? indexArr[index] : index;
            const x = posAttr.getX(index);
            const y = posAttr.getY(index);
            const z = posAttr.getZ(index);
            if (x < minx) minx = x;
            if (x > maxx) maxx = x;
            if (y < miny) miny = y;
            if (y > maxy) maxy = y;
            if (z < minz) minz = z;
            if (z > maxz) maxz = z;
          }
        }
        if (float32Array2[node32Index + 0] !== minx || float32Array2[node32Index + 1] !== miny || float32Array2[node32Index + 2] !== minz || float32Array2[node32Index + 3] !== maxx || float32Array2[node32Index + 4] !== maxy || float32Array2[node32Index + 5] !== maxz) {
          float32Array2[node32Index + 0] = minx;
          float32Array2[node32Index + 1] = miny;
          float32Array2[node32Index + 2] = minz;
          float32Array2[node32Index + 3] = maxx;
          float32Array2[node32Index + 4] = maxy;
          float32Array2[node32Index + 5] = maxz;
          return true;
        } else {
          return false;
        }
      } else {
        const left = node32Index + 8;
        const right = uint32Array2[node32Index + 6];
        const offsetLeft = left + byteOffset2;
        const offsetRight = right + byteOffset2;
        let forceChildren = force;
        let includesLeft = false;
        let includesRight = false;
        if (nodeIndices) {
          if (!forceChildren) {
            includesLeft = nodeIndices.has(offsetLeft);
            includesRight = nodeIndices.has(offsetRight);
            forceChildren = !includesLeft && !includesRight;
          }
        } else {
          includesLeft = true;
          includesRight = true;
        }
        const traverseLeft = forceChildren || includesLeft;
        const traverseRight = forceChildren || includesRight;
        let leftChange = false;
        if (traverseLeft) {
          leftChange = _traverse2(left, byteOffset2, forceChildren);
        }
        let rightChange = false;
        if (traverseRight) {
          rightChange = _traverse2(right, byteOffset2, forceChildren);
        }
        const didChange = leftChange || rightChange;
        if (didChange) {
          for (let i = 0; i < 3; i++) {
            const lefti = left + i;
            const righti = right + i;
            const minLeftValue = float32Array2[lefti];
            const maxLeftValue = float32Array2[lefti + 3];
            const minRightValue = float32Array2[righti];
            const maxRightValue = float32Array2[righti + 3];
            float32Array2[node32Index + i] = minLeftValue < minRightValue ? minLeftValue : minRightValue;
            float32Array2[node32Index + i + 3] = maxLeftValue > maxRightValue ? maxLeftValue : maxRightValue;
          }
        }
        return didChange;
      }
    }
  }
  function raycast_indirect(bvh, root, side, ray, intersects, near, far) {
    BufferStack.setBuffer(bvh._roots[root]);
    _raycast(0, bvh, side, ray, intersects, near, far);
    BufferStack.clearBuffer();
  }
  function _raycast(nodeIndex32, bvh, side, ray, intersects, near, far) {
    const { float32Array: float32Array2, uint16Array: uint16Array2, uint32Array: uint32Array2 } = BufferStack;
    const nodeIndex16 = nodeIndex32 * 2;
    const isLeaf = IS_LEAF(nodeIndex16, uint16Array2);
    if (isLeaf) {
      const offset = OFFSET(nodeIndex32, uint32Array2);
      const count = COUNT(nodeIndex16, uint16Array2);
      intersectTris_indirect(bvh, side, ray, offset, count, intersects, near, far);
    } else {
      const leftIndex = LEFT_NODE(nodeIndex32);
      if (intersectRay(leftIndex, float32Array2, ray, near, far)) {
        _raycast(leftIndex, bvh, side, ray, intersects, near, far);
      }
      const rightIndex = RIGHT_NODE(nodeIndex32, uint32Array2);
      if (intersectRay(rightIndex, float32Array2, ray, near, far)) {
        _raycast(rightIndex, bvh, side, ray, intersects, near, far);
      }
    }
  }
  const _xyzFields = ["x", "y", "z"];
  function raycastFirst_indirect(bvh, root, side, ray, near, far) {
    BufferStack.setBuffer(bvh._roots[root]);
    const result = _raycastFirst(0, bvh, side, ray, near, far);
    BufferStack.clearBuffer();
    return result;
  }
  function _raycastFirst(nodeIndex32, bvh, side, ray, near, far) {
    const { float32Array: float32Array2, uint16Array: uint16Array2, uint32Array: uint32Array2 } = BufferStack;
    let nodeIndex16 = nodeIndex32 * 2;
    const isLeaf = IS_LEAF(nodeIndex16, uint16Array2);
    if (isLeaf) {
      const offset = OFFSET(nodeIndex32, uint32Array2);
      const count = COUNT(nodeIndex16, uint16Array2);
      return intersectClosestTri_indirect(bvh, side, ray, offset, count, near, far);
    } else {
      const splitAxis = SPLIT_AXIS(nodeIndex32, uint32Array2);
      const xyzAxis = _xyzFields[splitAxis];
      const rayDir = ray.direction[xyzAxis];
      const leftToRight = rayDir >= 0;
      let c1, c2;
      if (leftToRight) {
        c1 = LEFT_NODE(nodeIndex32);
        c2 = RIGHT_NODE(nodeIndex32, uint32Array2);
      } else {
        c1 = RIGHT_NODE(nodeIndex32, uint32Array2);
        c2 = LEFT_NODE(nodeIndex32);
      }
      const c1Intersection = intersectRay(c1, float32Array2, ray, near, far);
      const c1Result = c1Intersection ? _raycastFirst(c1, bvh, side, ray, near, far) : null;
      if (c1Result) {
        const point = c1Result.point[xyzAxis];
        const isOutside = leftToRight ? point <= float32Array2[c2 + splitAxis] : (
          // min bounding data
          point >= float32Array2[c2 + splitAxis + 3]
        );
        if (isOutside) {
          return c1Result;
        }
      }
      const c2Intersection = intersectRay(c2, float32Array2, ray, near, far);
      const c2Result = c2Intersection ? _raycastFirst(c2, bvh, side, ray, near, far) : null;
      if (c1Result && c2Result) {
        return c1Result.distance <= c2Result.distance ? c1Result : c2Result;
      } else {
        return c1Result || c2Result || null;
      }
    }
  }
  const boundingBox = /* @__PURE__ */ new Box3();
  const triangle = /* @__PURE__ */ new ExtendedTriangle();
  const triangle2 = /* @__PURE__ */ new ExtendedTriangle();
  const invertedMat = /* @__PURE__ */ new Matrix4();
  const obb$2 = /* @__PURE__ */ new OrientedBox();
  const obb2$1 = /* @__PURE__ */ new OrientedBox();
  function intersectsGeometry_indirect(bvh, root, otherGeometry, geometryToBvh) {
    BufferStack.setBuffer(bvh._roots[root]);
    const result = _intersectsGeometry(0, bvh, otherGeometry, geometryToBvh);
    BufferStack.clearBuffer();
    return result;
  }
  function _intersectsGeometry(nodeIndex32, bvh, otherGeometry, geometryToBvh, cachedObb = null) {
    const { float32Array: float32Array2, uint16Array: uint16Array2, uint32Array: uint32Array2 } = BufferStack;
    let nodeIndex16 = nodeIndex32 * 2;
    if (cachedObb === null) {
      if (!otherGeometry.boundingBox) {
        otherGeometry.computeBoundingBox();
      }
      obb$2.set(otherGeometry.boundingBox.min, otherGeometry.boundingBox.max, geometryToBvh);
      cachedObb = obb$2;
    }
    const isLeaf = IS_LEAF(nodeIndex16, uint16Array2);
    if (isLeaf) {
      const thisGeometry = bvh.geometry;
      const thisIndex = thisGeometry.index;
      const thisPos = thisGeometry.attributes.position;
      const index = otherGeometry.index;
      const pos = otherGeometry.attributes.position;
      const offset = OFFSET(nodeIndex32, uint32Array2);
      const count = COUNT(nodeIndex16, uint16Array2);
      invertedMat.copy(geometryToBvh).invert();
      if (otherGeometry.boundsTree) {
        arrayToBox(BOUNDING_DATA_INDEX(nodeIndex32), float32Array2, obb2$1);
        obb2$1.matrix.copy(invertedMat);
        obb2$1.needsUpdate = true;
        const res = otherGeometry.boundsTree.shapecast({
          intersectsBounds: (box) => obb2$1.intersectsBox(box),
          intersectsTriangle: (tri) => {
            tri.a.applyMatrix4(geometryToBvh);
            tri.b.applyMatrix4(geometryToBvh);
            tri.c.applyMatrix4(geometryToBvh);
            tri.needsUpdate = true;
            for (let i = offset, l = count + offset; i < l; i++) {
              setTriangle(triangle2, 3 * bvh.resolveTriangleIndex(i), thisIndex, thisPos);
              triangle2.needsUpdate = true;
              if (tri.intersectsTriangle(triangle2)) {
                return true;
              }
            }
            return false;
          }
        });
        return res;
      } else {
        for (let i = offset, l = count + offset; i < l; i++) {
          const ti = bvh.resolveTriangleIndex(i);
          setTriangle(triangle, 3 * ti, thisIndex, thisPos);
          triangle.a.applyMatrix4(invertedMat);
          triangle.b.applyMatrix4(invertedMat);
          triangle.c.applyMatrix4(invertedMat);
          triangle.needsUpdate = true;
          for (let i2 = 0, l2 = index.count; i2 < l2; i2 += 3) {
            setTriangle(triangle2, i2, index, pos);
            triangle2.needsUpdate = true;
            if (triangle.intersectsTriangle(triangle2)) {
              return true;
            }
          }
        }
      }
    } else {
      const left = nodeIndex32 + 8;
      const right = uint32Array2[nodeIndex32 + 6];
      arrayToBox(BOUNDING_DATA_INDEX(left), float32Array2, boundingBox);
      const leftIntersection = cachedObb.intersectsBox(boundingBox) && _intersectsGeometry(left, bvh, otherGeometry, geometryToBvh, cachedObb);
      if (leftIntersection) return true;
      arrayToBox(BOUNDING_DATA_INDEX(right), float32Array2, boundingBox);
      const rightIntersection = cachedObb.intersectsBox(boundingBox) && _intersectsGeometry(right, bvh, otherGeometry, geometryToBvh, cachedObb);
      if (rightIntersection) return true;
      return false;
    }
  }
  const tempMatrix = /* @__PURE__ */ new Matrix4();
  const obb$1 = /* @__PURE__ */ new OrientedBox();
  const obb2 = /* @__PURE__ */ new OrientedBox();
  const temp1 = /* @__PURE__ */ new Vector3();
  const temp2 = /* @__PURE__ */ new Vector3();
  const temp3 = /* @__PURE__ */ new Vector3();
  const temp4 = /* @__PURE__ */ new Vector3();
  function closestPointToGeometry_indirect(bvh, otherGeometry, geometryToBvh, target1 = {}, target2 = {}, minThreshold = 0, maxThreshold = Infinity) {
    if (!otherGeometry.boundingBox) {
      otherGeometry.computeBoundingBox();
    }
    obb$1.set(otherGeometry.boundingBox.min, otherGeometry.boundingBox.max, geometryToBvh);
    obb$1.needsUpdate = true;
    const geometry = bvh.geometry;
    const pos = geometry.attributes.position;
    const index = geometry.index;
    const otherPos = otherGeometry.attributes.position;
    const otherIndex = otherGeometry.index;
    const triangle3 = ExtendedTrianglePool.getPrimitive();
    const triangle22 = ExtendedTrianglePool.getPrimitive();
    let tempTarget1 = temp1;
    let tempTargetDest1 = temp2;
    let tempTarget2 = null;
    let tempTargetDest2 = null;
    if (target2) {
      tempTarget2 = temp3;
      tempTargetDest2 = temp4;
    }
    let closestDistance = Infinity;
    let closestDistanceTriIndex = null;
    let closestDistanceOtherTriIndex = null;
    tempMatrix.copy(geometryToBvh).invert();
    obb2.matrix.copy(tempMatrix);
    bvh.shapecast(
      {
        boundsTraverseOrder: (box) => {
          return obb$1.distanceToBox(box);
        },
        intersectsBounds: (box, isLeaf, score) => {
          if (score < closestDistance && score < maxThreshold) {
            if (isLeaf) {
              obb2.min.copy(box.min);
              obb2.max.copy(box.max);
              obb2.needsUpdate = true;
            }
            return true;
          }
          return false;
        },
        intersectsRange: (offset, count) => {
          if (otherGeometry.boundsTree) {
            const otherBvh = otherGeometry.boundsTree;
            return otherBvh.shapecast({
              boundsTraverseOrder: (box) => {
                return obb2.distanceToBox(box);
              },
              intersectsBounds: (box, isLeaf, score) => {
                return score < closestDistance && score < maxThreshold;
              },
              intersectsRange: (otherOffset, otherCount) => {
                for (let i2 = otherOffset, l2 = otherOffset + otherCount; i2 < l2; i2++) {
                  const ti2 = otherBvh.resolveTriangleIndex(i2);
                  setTriangle(triangle22, 3 * ti2, otherIndex, otherPos);
                  triangle22.a.applyMatrix4(geometryToBvh);
                  triangle22.b.applyMatrix4(geometryToBvh);
                  triangle22.c.applyMatrix4(geometryToBvh);
                  triangle22.needsUpdate = true;
                  for (let i = offset, l = offset + count; i < l; i++) {
                    const ti = bvh.resolveTriangleIndex(i);
                    setTriangle(triangle3, 3 * ti, index, pos);
                    triangle3.needsUpdate = true;
                    const dist = triangle3.distanceToTriangle(triangle22, tempTarget1, tempTarget2);
                    if (dist < closestDistance) {
                      tempTargetDest1.copy(tempTarget1);
                      if (tempTargetDest2) {
                        tempTargetDest2.copy(tempTarget2);
                      }
                      closestDistance = dist;
                      closestDistanceTriIndex = i;
                      closestDistanceOtherTriIndex = i2;
                    }
                    if (dist < minThreshold) {
                      return true;
                    }
                  }
                }
              }
            });
          } else {
            const triCount = getTriCount(otherGeometry);
            for (let i2 = 0, l2 = triCount; i2 < l2; i2++) {
              setTriangle(triangle22, 3 * i2, otherIndex, otherPos);
              triangle22.a.applyMatrix4(geometryToBvh);
              triangle22.b.applyMatrix4(geometryToBvh);
              triangle22.c.applyMatrix4(geometryToBvh);
              triangle22.needsUpdate = true;
              for (let i = offset, l = offset + count; i < l; i++) {
                const ti = bvh.resolveTriangleIndex(i);
                setTriangle(triangle3, 3 * ti, index, pos);
                triangle3.needsUpdate = true;
                const dist = triangle3.distanceToTriangle(triangle22, tempTarget1, tempTarget2);
                if (dist < closestDistance) {
                  tempTargetDest1.copy(tempTarget1);
                  if (tempTargetDest2) {
                    tempTargetDest2.copy(tempTarget2);
                  }
                  closestDistance = dist;
                  closestDistanceTriIndex = i;
                  closestDistanceOtherTriIndex = i2;
                }
                if (dist < minThreshold) {
                  return true;
                }
              }
            }
          }
        }
      }
    );
    ExtendedTrianglePool.releasePrimitive(triangle3);
    ExtendedTrianglePool.releasePrimitive(triangle22);
    if (closestDistance === Infinity) {
      return null;
    }
    if (!target1.point) {
      target1.point = tempTargetDest1.clone();
    } else {
      target1.point.copy(tempTargetDest1);
    }
    target1.distance = closestDistance, target1.faceIndex = closestDistanceTriIndex;
    if (target2) {
      if (!target2.point) target2.point = tempTargetDest2.clone();
      else target2.point.copy(tempTargetDest2);
      target2.point.applyMatrix4(tempMatrix);
      tempTargetDest1.applyMatrix4(tempMatrix);
      target2.distance = tempTargetDest1.sub(target2.point).length();
      target2.faceIndex = closestDistanceOtherTriIndex;
    }
    return target1;
  }
  function isSharedArrayBufferSupported() {
    return typeof SharedArrayBuffer !== "undefined";
  }
  const _bufferStack1 = new BufferStack.constructor();
  const _bufferStack2 = new BufferStack.constructor();
  const _boxPool = new PrimitivePool(() => new Box3());
  const _leftBox1 = new Box3();
  const _rightBox1 = new Box3();
  const _leftBox2 = new Box3();
  const _rightBox2 = new Box3();
  let _active = false;
  function bvhcast(bvh, otherBvh, matrixToLocal, intersectsRanges) {
    if (_active) {
      throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");
    }
    _active = true;
    const roots = bvh._roots;
    const otherRoots = otherBvh._roots;
    let result;
    let offset1 = 0;
    let offset2 = 0;
    const invMat = new Matrix4().copy(matrixToLocal).invert();
    for (let i = 0, il = roots.length; i < il; i++) {
      _bufferStack1.setBuffer(roots[i]);
      offset2 = 0;
      const localBox = _boxPool.getPrimitive();
      arrayToBox(BOUNDING_DATA_INDEX(0), _bufferStack1.float32Array, localBox);
      localBox.applyMatrix4(invMat);
      for (let j = 0, jl = otherRoots.length; j < jl; j++) {
        _bufferStack2.setBuffer(otherRoots[j]);
        result = _traverse(
          0,
          0,
          matrixToLocal,
          invMat,
          intersectsRanges,
          offset1,
          offset2,
          0,
          0,
          localBox
        );
        _bufferStack2.clearBuffer();
        offset2 += otherRoots[j].length;
        if (result) {
          break;
        }
      }
      _boxPool.releasePrimitive(localBox);
      _bufferStack1.clearBuffer();
      offset1 += roots[i].length;
      if (result) {
        break;
      }
    }
    _active = false;
    return result;
  }
  function _traverse(node1Index32, node2Index32, matrix2to1, matrix1to2, intersectsRangesFunc, node1IndexByteOffset = 0, node2IndexByteOffset = 0, depth1 = 0, depth2 = 0, currBox = null, reversed = false) {
    let bufferStack1, bufferStack2;
    if (reversed) {
      bufferStack1 = _bufferStack2;
      bufferStack2 = _bufferStack1;
    } else {
      bufferStack1 = _bufferStack1;
      bufferStack2 = _bufferStack2;
    }
    const float32Array1 = bufferStack1.float32Array, uint32Array1 = bufferStack1.uint32Array, uint16Array1 = bufferStack1.uint16Array, float32Array2 = bufferStack2.float32Array, uint32Array2 = bufferStack2.uint32Array, uint16Array2 = bufferStack2.uint16Array;
    const node1Index16 = node1Index32 * 2;
    const node2Index16 = node2Index32 * 2;
    const isLeaf1 = IS_LEAF(node1Index16, uint16Array1);
    const isLeaf2 = IS_LEAF(node2Index16, uint16Array2);
    let result = false;
    if (isLeaf2 && isLeaf1) {
      if (reversed) {
        result = intersectsRangesFunc(
          OFFSET(node2Index32, uint32Array2),
          COUNT(node2Index32 * 2, uint16Array2),
          OFFSET(node1Index32, uint32Array1),
          COUNT(node1Index32 * 2, uint16Array1),
          depth2,
          node2IndexByteOffset + node2Index32,
          depth1,
          node1IndexByteOffset + node1Index32
        );
      } else {
        result = intersectsRangesFunc(
          OFFSET(node1Index32, uint32Array1),
          COUNT(node1Index32 * 2, uint16Array1),
          OFFSET(node2Index32, uint32Array2),
          COUNT(node2Index32 * 2, uint16Array2),
          depth1,
          node1IndexByteOffset + node1Index32,
          depth2,
          node2IndexByteOffset + node2Index32
        );
      }
    } else if (isLeaf2) {
      const newBox = _boxPool.getPrimitive();
      arrayToBox(BOUNDING_DATA_INDEX(node2Index32), float32Array2, newBox);
      newBox.applyMatrix4(matrix2to1);
      const cl1 = LEFT_NODE(node1Index32);
      const cr1 = RIGHT_NODE(node1Index32, uint32Array1);
      arrayToBox(BOUNDING_DATA_INDEX(cl1), float32Array1, _leftBox1);
      arrayToBox(BOUNDING_DATA_INDEX(cr1), float32Array1, _rightBox1);
      const intersectCl1 = newBox.intersectsBox(_leftBox1);
      const intersectCr1 = newBox.intersectsBox(_rightBox1);
      result = intersectCl1 && _traverse(
        node2Index32,
        cl1,
        matrix1to2,
        matrix2to1,
        intersectsRangesFunc,
        node2IndexByteOffset,
        node1IndexByteOffset,
        depth2,
        depth1 + 1,
        newBox,
        !reversed
      ) || intersectCr1 && _traverse(
        node2Index32,
        cr1,
        matrix1to2,
        matrix2to1,
        intersectsRangesFunc,
        node2IndexByteOffset,
        node1IndexByteOffset,
        depth2,
        depth1 + 1,
        newBox,
        !reversed
      );
      _boxPool.releasePrimitive(newBox);
    } else {
      const cl2 = LEFT_NODE(node2Index32);
      const cr2 = RIGHT_NODE(node2Index32, uint32Array2);
      arrayToBox(BOUNDING_DATA_INDEX(cl2), float32Array2, _leftBox2);
      arrayToBox(BOUNDING_DATA_INDEX(cr2), float32Array2, _rightBox2);
      const leftIntersects = currBox.intersectsBox(_leftBox2);
      const rightIntersects = currBox.intersectsBox(_rightBox2);
      if (leftIntersects && rightIntersects) {
        result = _traverse(
          node1Index32,
          cl2,
          matrix2to1,
          matrix1to2,
          intersectsRangesFunc,
          node1IndexByteOffset,
          node2IndexByteOffset,
          depth1,
          depth2 + 1,
          currBox,
          reversed
        ) || _traverse(
          node1Index32,
          cr2,
          matrix2to1,
          matrix1to2,
          intersectsRangesFunc,
          node1IndexByteOffset,
          node2IndexByteOffset,
          depth1,
          depth2 + 1,
          currBox,
          reversed
        );
      } else if (leftIntersects) {
        if (isLeaf1) {
          result = _traverse(
            node1Index32,
            cl2,
            matrix2to1,
            matrix1to2,
            intersectsRangesFunc,
            node1IndexByteOffset,
            node2IndexByteOffset,
            depth1,
            depth2 + 1,
            currBox,
            reversed
          );
        } else {
          const newBox = _boxPool.getPrimitive();
          newBox.copy(_leftBox2).applyMatrix4(matrix2to1);
          const cl1 = LEFT_NODE(node1Index32);
          const cr1 = RIGHT_NODE(node1Index32, uint32Array1);
          arrayToBox(BOUNDING_DATA_INDEX(cl1), float32Array1, _leftBox1);
          arrayToBox(BOUNDING_DATA_INDEX(cr1), float32Array1, _rightBox1);
          const intersectCl1 = newBox.intersectsBox(_leftBox1);
          const intersectCr1 = newBox.intersectsBox(_rightBox1);
          result = intersectCl1 && _traverse(
            cl2,
            cl1,
            matrix1to2,
            matrix2to1,
            intersectsRangesFunc,
            node2IndexByteOffset,
            node1IndexByteOffset,
            depth2,
            depth1 + 1,
            newBox,
            !reversed
          ) || intersectCr1 && _traverse(
            cl2,
            cr1,
            matrix1to2,
            matrix2to1,
            intersectsRangesFunc,
            node2IndexByteOffset,
            node1IndexByteOffset,
            depth2,
            depth1 + 1,
            newBox,
            !reversed
          );
          _boxPool.releasePrimitive(newBox);
        }
      } else if (rightIntersects) {
        if (isLeaf1) {
          result = _traverse(
            node1Index32,
            cr2,
            matrix2to1,
            matrix1to2,
            intersectsRangesFunc,
            node1IndexByteOffset,
            node2IndexByteOffset,
            depth1,
            depth2 + 1,
            currBox,
            reversed
          );
        } else {
          const newBox = _boxPool.getPrimitive();
          newBox.copy(_rightBox2).applyMatrix4(matrix2to1);
          const cl1 = LEFT_NODE(node1Index32);
          const cr1 = RIGHT_NODE(node1Index32, uint32Array1);
          arrayToBox(BOUNDING_DATA_INDEX(cl1), float32Array1, _leftBox1);
          arrayToBox(BOUNDING_DATA_INDEX(cr1), float32Array1, _rightBox1);
          const intersectCl1 = newBox.intersectsBox(_leftBox1);
          const intersectCr1 = newBox.intersectsBox(_rightBox1);
          result = intersectCl1 && _traverse(
            cr2,
            cl1,
            matrix1to2,
            matrix2to1,
            intersectsRangesFunc,
            node2IndexByteOffset,
            node1IndexByteOffset,
            depth2,
            depth1 + 1,
            newBox,
            !reversed
          ) || intersectCr1 && _traverse(
            cr2,
            cr1,
            matrix1to2,
            matrix2to1,
            intersectsRangesFunc,
            node2IndexByteOffset,
            node1IndexByteOffset,
            depth2,
            depth1 + 1,
            newBox,
            !reversed
          );
          _boxPool.releasePrimitive(newBox);
        }
      }
    }
    return result;
  }
  const obb = /* @__PURE__ */ new OrientedBox();
  const tempBox = /* @__PURE__ */ new Box3();
  const DEFAULT_OPTIONS = {
    strategy: CENTER,
    maxDepth: 40,
    maxLeafTris: 10,
    useSharedArrayBuffer: false,
    setBoundingBox: true,
    onProgress: null,
    indirect: false,
    verbose: true,
    range: null
  };
  class MeshBVH {
    static serialize(bvh, options = {}) {
      options = {
        cloneBuffers: true,
        ...options
      };
      const geometry = bvh.geometry;
      const rootData = bvh._roots;
      const indirectBuffer = bvh._indirectBuffer;
      const indexAttribute = geometry.getIndex();
      let result;
      if (options.cloneBuffers) {
        result = {
          roots: rootData.map((root) => root.slice()),
          index: indexAttribute ? indexAttribute.array.slice() : null,
          indirectBuffer: indirectBuffer ? indirectBuffer.slice() : null
        };
      } else {
        result = {
          roots: rootData,
          index: indexAttribute ? indexAttribute.array : null,
          indirectBuffer
        };
      }
      return result;
    }
    static deserialize(data, geometry, options = {}) {
      options = {
        setIndex: true,
        indirect: Boolean(data.indirectBuffer),
        ...options
      };
      const { index, roots, indirectBuffer } = data;
      const bvh = new MeshBVH(geometry, { ...options, [SKIP_GENERATION]: true });
      bvh._roots = roots;
      bvh._indirectBuffer = indirectBuffer || null;
      if (options.setIndex) {
        const indexAttribute = geometry.getIndex();
        if (indexAttribute === null) {
          const newIndex = new BufferAttribute(data.index, 1, false);
          geometry.setIndex(newIndex);
        } else if (indexAttribute.array !== index) {
          indexAttribute.array.set(index);
          indexAttribute.needsUpdate = true;
        }
      }
      return bvh;
    }
    get indirect() {
      return !!this._indirectBuffer;
    }
    constructor(geometry, options = {}) {
      if (!geometry.isBufferGeometry) {
        throw new Error("MeshBVH: Only BufferGeometries are supported.");
      } else if (geometry.index && geometry.index.isInterleavedBufferAttribute) {
        throw new Error("MeshBVH: InterleavedBufferAttribute is not supported for the index attribute.");
      }
      options = Object.assign({
        ...DEFAULT_OPTIONS,
        // undocumented options
        // Whether to skip generating the tree. Used for deserialization.
        [SKIP_GENERATION]: false
      }, options);
      if (options.useSharedArrayBuffer && !isSharedArrayBufferSupported()) {
        throw new Error("MeshBVH: SharedArrayBuffer is not available.");
      }
      this.geometry = geometry;
      this._roots = null;
      this._indirectBuffer = null;
      if (!options[SKIP_GENERATION]) {
        buildPackedTree(this, options);
        if (!geometry.boundingBox && options.setBoundingBox) {
          geometry.boundingBox = this.getBoundingBox(new Box3());
        }
      }
      this.resolveTriangleIndex = options.indirect ? (i) => this._indirectBuffer[i] : (i) => i;
    }
    refit(nodeIndices = null) {
      const refitFunc = this.indirect ? refit_indirect : refit;
      return refitFunc(this, nodeIndices);
    }
    traverse(callback, rootIndex = 0) {
      const buffer = this._roots[rootIndex];
      const uint32Array2 = new Uint32Array(buffer);
      const uint16Array2 = new Uint16Array(buffer);
      _traverse2(0);
      function _traverse2(node32Index, depth = 0) {
        const node16Index = node32Index * 2;
        const isLeaf = uint16Array2[node16Index + 15] === IS_LEAFNODE_FLAG;
        if (isLeaf) {
          const offset = uint32Array2[node32Index + 6];
          const count = uint16Array2[node16Index + 14];
          callback(depth, isLeaf, new Float32Array(buffer, node32Index * 4, 6), offset, count);
        } else {
          const left = node32Index + BYTES_PER_NODE / 4;
          const right = uint32Array2[node32Index + 6];
          const splitAxis = uint32Array2[node32Index + 7];
          const stopTraversal = callback(depth, isLeaf, new Float32Array(buffer, node32Index * 4, 6), splitAxis);
          if (!stopTraversal) {
            _traverse2(left, depth + 1);
            _traverse2(right, depth + 1);
          }
        }
      }
    }
    /* Core Cast Functions */
    raycast(ray, materialOrSide = FrontSide, near = 0, far = Infinity) {
      const roots = this._roots;
      const geometry = this.geometry;
      const intersects = [];
      const isMaterial = materialOrSide.isMaterial;
      const isArrayMaterial = Array.isArray(materialOrSide);
      const groups = geometry.groups;
      const side = isMaterial ? materialOrSide.side : materialOrSide;
      const raycastFunc = this.indirect ? raycast_indirect : raycast;
      for (let i = 0, l = roots.length; i < l; i++) {
        const materialSide = isArrayMaterial ? materialOrSide[groups[i].materialIndex].side : side;
        const startCount = intersects.length;
        raycastFunc(this, i, materialSide, ray, intersects, near, far);
        if (isArrayMaterial) {
          const materialIndex = groups[i].materialIndex;
          for (let j = startCount, jl = intersects.length; j < jl; j++) {
            intersects[j].face.materialIndex = materialIndex;
          }
        }
      }
      return intersects;
    }
    raycastFirst(ray, materialOrSide = FrontSide, near = 0, far = Infinity) {
      const roots = this._roots;
      const geometry = this.geometry;
      const isMaterial = materialOrSide.isMaterial;
      const isArrayMaterial = Array.isArray(materialOrSide);
      let closestResult = null;
      const groups = geometry.groups;
      const side = isMaterial ? materialOrSide.side : materialOrSide;
      const raycastFirstFunc = this.indirect ? raycastFirst_indirect : raycastFirst;
      for (let i = 0, l = roots.length; i < l; i++) {
        const materialSide = isArrayMaterial ? materialOrSide[groups[i].materialIndex].side : side;
        const result = raycastFirstFunc(this, i, materialSide, ray, near, far);
        if (result != null && (closestResult == null || result.distance < closestResult.distance)) {
          closestResult = result;
          if (isArrayMaterial) {
            result.face.materialIndex = groups[i].materialIndex;
          }
        }
      }
      return closestResult;
    }
    intersectsGeometry(otherGeometry, geomToMesh) {
      let result = false;
      const roots = this._roots;
      const intersectsGeometryFunc = this.indirect ? intersectsGeometry_indirect : intersectsGeometry;
      for (let i = 0, l = roots.length; i < l; i++) {
        result = intersectsGeometryFunc(this, i, otherGeometry, geomToMesh);
        if (result) {
          break;
        }
      }
      return result;
    }
    shapecast(callbacks) {
      const triangle3 = ExtendedTrianglePool.getPrimitive();
      const iterateFunc = this.indirect ? iterateOverTriangles_indirect : iterateOverTriangles;
      let {
        boundsTraverseOrder,
        intersectsBounds,
        intersectsRange,
        intersectsTriangle
      } = callbacks;
      if (intersectsRange && intersectsTriangle) {
        const originalIntersectsRange = intersectsRange;
        intersectsRange = (offset, count, contained, depth, nodeIndex) => {
          if (!originalIntersectsRange(offset, count, contained, depth, nodeIndex)) {
            return iterateFunc(offset, count, this, intersectsTriangle, contained, depth, triangle3);
          }
          return true;
        };
      } else if (!intersectsRange) {
        if (intersectsTriangle) {
          intersectsRange = (offset, count, contained, depth) => {
            return iterateFunc(offset, count, this, intersectsTriangle, contained, depth, triangle3);
          };
        } else {
          intersectsRange = (offset, count, contained) => {
            return contained;
          };
        }
      }
      let result = false;
      let byteOffset = 0;
      const roots = this._roots;
      for (let i = 0, l = roots.length; i < l; i++) {
        const root = roots[i];
        result = shapecast(this, i, intersectsBounds, intersectsRange, boundsTraverseOrder, byteOffset);
        if (result) {
          break;
        }
        byteOffset += root.byteLength;
      }
      ExtendedTrianglePool.releasePrimitive(triangle3);
      return result;
    }
    bvhcast(otherBvh, matrixToLocal, callbacks) {
      let {
        intersectsRanges,
        intersectsTriangles
      } = callbacks;
      const triangle1 = ExtendedTrianglePool.getPrimitive();
      const indexAttr1 = this.geometry.index;
      const positionAttr1 = this.geometry.attributes.position;
      const assignTriangle1 = this.indirect ? (i1) => {
        const ti = this.resolveTriangleIndex(i1);
        setTriangle(triangle1, ti * 3, indexAttr1, positionAttr1);
      } : (i1) => {
        setTriangle(triangle1, i1 * 3, indexAttr1, positionAttr1);
      };
      const triangle22 = ExtendedTrianglePool.getPrimitive();
      const indexAttr2 = otherBvh.geometry.index;
      const positionAttr2 = otherBvh.geometry.attributes.position;
      const assignTriangle2 = otherBvh.indirect ? (i2) => {
        const ti2 = otherBvh.resolveTriangleIndex(i2);
        setTriangle(triangle22, ti2 * 3, indexAttr2, positionAttr2);
      } : (i2) => {
        setTriangle(triangle22, i2 * 3, indexAttr2, positionAttr2);
      };
      if (intersectsTriangles) {
        const iterateOverDoubleTriangles = (offset1, count1, offset2, count2, depth1, index1, depth2, index2) => {
          for (let i2 = offset2, l2 = offset2 + count2; i2 < l2; i2++) {
            assignTriangle2(i2);
            triangle22.a.applyMatrix4(matrixToLocal);
            triangle22.b.applyMatrix4(matrixToLocal);
            triangle22.c.applyMatrix4(matrixToLocal);
            triangle22.needsUpdate = true;
            for (let i1 = offset1, l1 = offset1 + count1; i1 < l1; i1++) {
              assignTriangle1(i1);
              triangle1.needsUpdate = true;
              if (intersectsTriangles(triangle1, triangle22, i1, i2, depth1, index1, depth2, index2)) {
                return true;
              }
            }
          }
          return false;
        };
        if (intersectsRanges) {
          const originalIntersectsRanges = intersectsRanges;
          intersectsRanges = function(offset1, count1, offset2, count2, depth1, index1, depth2, index2) {
            if (!originalIntersectsRanges(offset1, count1, offset2, count2, depth1, index1, depth2, index2)) {
              return iterateOverDoubleTriangles(offset1, count1, offset2, count2, depth1, index1, depth2, index2);
            }
            return true;
          };
        } else {
          intersectsRanges = iterateOverDoubleTriangles;
        }
      }
      return bvhcast(this, otherBvh, matrixToLocal, intersectsRanges);
    }
    /* Derived Cast Functions */
    intersectsBox(box, boxToMesh) {
      obb.set(box.min, box.max, boxToMesh);
      obb.needsUpdate = true;
      return this.shapecast(
        {
          intersectsBounds: (box2) => obb.intersectsBox(box2),
          intersectsTriangle: (tri) => obb.intersectsTriangle(tri)
        }
      );
    }
    intersectsSphere(sphere) {
      return this.shapecast(
        {
          intersectsBounds: (box) => sphere.intersectsBox(box),
          intersectsTriangle: (tri) => tri.intersectsSphere(sphere)
        }
      );
    }
    closestPointToGeometry(otherGeometry, geometryToBvh, target1 = {}, target2 = {}, minThreshold = 0, maxThreshold = Infinity) {
      const closestPointToGeometryFunc = this.indirect ? closestPointToGeometry_indirect : closestPointToGeometry;
      return closestPointToGeometryFunc(
        this,
        otherGeometry,
        geometryToBvh,
        target1,
        target2,
        minThreshold,
        maxThreshold
      );
    }
    closestPointToPoint(point, target = {}, minThreshold = 0, maxThreshold = Infinity) {
      return closestPointToPoint(
        this,
        point,
        target,
        minThreshold,
        maxThreshold
      );
    }
    getBoundingBox(target) {
      target.makeEmpty();
      const roots = this._roots;
      roots.forEach((buffer) => {
        arrayToBox(0, new Float32Array(buffer), tempBox);
        target.union(tempBox);
      });
      return target;
    }
  }
  const EPSILON$2 = 1e-16;
  const UP_VECTOR$3 = /* @__PURE__ */ new Vector3(0, 1, 0);
  const _dir$2 = new Vector3();
  function isYProjectedLineDegenerate(line) {
    line.delta(_dir$2).normalize();
    return Math.abs(_dir$2.dot(UP_VECTOR$3)) >= 1 - EPSILON$2;
  }
  function isYProjectedTriangleDegenerate(tri) {
    if (tri.needsUpdate) {
      tri.update();
    }
    return Math.abs(tri.plane.normal.dot(UP_VECTOR$3)) <= EPSILON$2;
  }
  function isLineTriangleEdge(tri, line) {
    const { start, end } = line;
    const triPoints = tri.points;
    let startMatches = false;
    let endMatches = false;
    for (let i = 0; i < 3; i++) {
      const tp = triPoints[i];
      if (!startMatches && start.distanceToSquared(tp) <= EPSILON$2) {
        startMatches = true;
      }
      if (!endMatches && end.distanceToSquared(tp) <= EPSILON$2) {
        endMatches = true;
      }
      if (startMatches && endMatches) {
        return true;
      }
    }
    return startMatches && endMatches;
  }
  const EPSILON$1 = 1e-16;
  const UP_VECTOR$2 = /* @__PURE__ */ new Vector3(0, 1, 0);
  const _v0$1 = /* @__PURE__ */ new Vector3();
  const _v1$1 = /* @__PURE__ */ new Vector3();
  const _normal = /* @__PURE__ */ new Vector3();
  const _triangle = /* @__PURE__ */ new Triangle();
  function generateEdges(geometry, projectionDir = UP_VECTOR$2, thresholdAngle = 1) {
    const edges = [];
    const precisionPoints = 4;
    const precision = Math.pow(10, precisionPoints);
    const thresholdDot = Math.cos(MathUtils.DEG2RAD * thresholdAngle);
    const indexAttr = geometry.getIndex();
    const positionAttr = geometry.getAttribute("position");
    const indexCount = indexAttr ? indexAttr.count : positionAttr.count;
    const indexArr = [0, 0, 0];
    const vertKeys = ["a", "b", "c"];
    const hashes = new Array(3);
    const edgeData = {};
    for (let i = 0; i < indexCount; i += 3) {
      if (indexAttr) {
        indexArr[0] = indexAttr.getX(i);
        indexArr[1] = indexAttr.getX(i + 1);
        indexArr[2] = indexAttr.getX(i + 2);
      } else {
        indexArr[0] = i;
        indexArr[1] = i + 1;
        indexArr[2] = i + 2;
      }
      const { a, b, c } = _triangle;
      a.fromBufferAttribute(positionAttr, indexArr[0]);
      b.fromBufferAttribute(positionAttr, indexArr[1]);
      c.fromBufferAttribute(positionAttr, indexArr[2]);
      _triangle.getNormal(_normal);
      hashes[0] = `${Math.round(a.x * precision)},${Math.round(a.y * precision)},${Math.round(a.z * precision)}`;
      hashes[1] = `${Math.round(b.x * precision)},${Math.round(b.y * precision)},${Math.round(b.z * precision)}`;
      hashes[2] = `${Math.round(c.x * precision)},${Math.round(c.y * precision)},${Math.round(c.z * precision)}`;
      if (hashes[0] === hashes[1] || hashes[1] === hashes[2] || hashes[2] === hashes[0]) {
        continue;
      }
      for (let j = 0; j < 3; j++) {
        const jNext = (j + 1) % 3;
        const vecHash0 = hashes[j];
        const vecHash1 = hashes[jNext];
        const v0 = _triangle[vertKeys[j]];
        const v1 = _triangle[vertKeys[jNext]];
        const hash = `${vecHash0}_${vecHash1}`;
        const reverseHash = `${vecHash1}_${vecHash0}`;
        if (reverseHash in edgeData && edgeData[reverseHash]) {
          const otherNormal = edgeData[reverseHash].normal;
          const meetsThreshold = _normal.dot(otherNormal) <= thresholdDot;
          let normDot = projectionDir.dot(_normal);
          normDot = Math.abs(normDot) < EPSILON$1 ? 0 : normDot;
          let otherDot = projectionDir.dot(otherNormal);
          otherDot = Math.abs(otherDot) < EPSILON$1 ? 0 : otherDot;
          const projectionThreshold = Math.sign(normDot) !== Math.sign(otherDot);
          if (meetsThreshold || projectionThreshold) {
            const line = new Line3();
            line.start.copy(v0);
            line.end.copy(v1);
            edges.push(line);
          }
          edgeData[reverseHash] = null;
        } else if (!(hash in edgeData)) {
          edgeData[hash] = {
            index0: indexArr[j],
            index1: indexArr[jNext],
            normal: _normal.clone()
          };
        }
      }
    }
    for (const key in edgeData) {
      if (edgeData[key]) {
        const { index0, index1 } = edgeData[key];
        _v0$1.fromBufferAttribute(positionAttr, index0);
        _v1$1.fromBufferAttribute(positionAttr, index1);
        const line = new Line3();
        line.start.copy(_v0$1);
        line.end.copy(_v1$1);
        edges.push(line);
      }
    }
    return edges;
  }
  const _line$2 = /* @__PURE__ */ new Line3();
  function compressEdgeOverlaps(overlaps) {
    overlaps.sort((a, b) => {
      return a[0] - b[0];
    });
    for (let i = 1; i < overlaps.length; i++) {
      const overlap = overlaps[i];
      const prevOverlap = overlaps[i - 1];
      if (prevOverlap[1] >= overlap[0]) {
        prevOverlap[1] = Math.max(prevOverlap[1], overlap[1]);
        overlaps.splice(i, 1);
        i--;
      }
    }
  }
  function overlapsToLines(line, overlaps, target = []) {
    compressEdgeOverlaps(overlaps);
    const invOverlaps = [[0, 1]];
    for (let i = 0, l = overlaps.length; i < l; i++) {
      const invOverlap = invOverlaps[i];
      const overlap = overlaps[i];
      invOverlap[1] = overlap[0];
      invOverlaps.push(new Float32Array([overlap[1], 1]));
    }
    for (let i = 0, l = invOverlaps.length; i < l; i++) {
      const { start, end } = line;
      _line$2.start.lerpVectors(start, end, invOverlaps[i][0]);
      _line$2.end.lerpVectors(start, end, invOverlaps[i][1]);
      target.push(new Float32Array([
        _line$2.start.x,
        _line$2.start.y,
        _line$2.start.z,
        _line$2.end.x,
        _line$2.end.y,
        _line$2.end.z
      ]));
    }
    return target;
  }
  const EPSILON = 1e-16;
  const UP_VECTOR$1 = /* @__PURE__ */ new Vector3(0, 1, 0);
  const _plane = /* @__PURE__ */ new Plane();
  const _planeHit = /* @__PURE__ */ new Vector3();
  const _lineDirection = /* @__PURE__ */ new Vector3();
  function trimToBeneathTriPlane(tri, line, lineTarget) {
    if (isYProjectedTriangleDegenerate(tri)) {
      return false;
    }
    if (tri.needsUpdate) {
      tri.update();
    }
    _plane.copy(tri.plane);
    if (_plane.normal.dot(UP_VECTOR$1) < 0) {
      _plane.normal.multiplyScalar(-1);
      _plane.constant *= -1;
    }
    const startDist = _plane.distanceToPoint(line.start);
    const endDist = _plane.distanceToPoint(line.end);
    const isStartOnPlane = Math.abs(startDist) < EPSILON;
    const isEndOnPlane = Math.abs(endDist) < EPSILON;
    const isStartBelow = startDist < 0;
    const isEndBelow = endDist < 0;
    line.delta(_lineDirection).normalize();
    if (Math.abs(_plane.normal.dot(_lineDirection)) < EPSILON) {
      if (isStartOnPlane || !isStartBelow) {
        return false;
      } else {
        lineTarget.copy(line);
        return true;
      }
    }
    if (isStartBelow && isEndBelow) {
      lineTarget.copy(line);
      return true;
    } else if (!isStartBelow && !isEndBelow) {
      return false;
    } else {
      let didHit = _plane.intersectLine(line, _planeHit);
      if (!didHit) {
        if (isStartOnPlane) {
          _planeHit.copy(line.start);
          didHit = true;
        }
        if (isEndOnPlane) {
          _planeHit.copy(line.end);
          didHit = true;
        }
      }
      if (didHit) {
        if (isStartBelow) {
          lineTarget.start.copy(line.start);
          lineTarget.end.copy(_planeHit);
          return true;
        } else if (isEndBelow) {
          lineTarget.end.copy(line.end);
          lineTarget.start.copy(_planeHit);
          return true;
        }
      }
    }
    return false;
  }
  const AREA_EPSILON = 1e-16;
  const DIST_EPSILON$1 = 1e-16;
  const _orthoPlane = /* @__PURE__ */ new Plane();
  const _edgeLine = /* @__PURE__ */ new Line3();
  const _point = /* @__PURE__ */ new Vector3();
  const _vec$1 = /* @__PURE__ */ new Vector3();
  const _tri$1 = /* @__PURE__ */ new ExtendedTriangle();
  const _line$1 = /* @__PURE__ */ new Line3();
  const _triLine = /* @__PURE__ */ new Line3();
  const _dir$1 = /* @__PURE__ */ new Vector3();
  const _triDir = /* @__PURE__ */ new Vector3();
  function getProjectedLineOverlap(line, triangle3, lineTarget = new Line3()) {
    _tri$1.copy(triangle3);
    _tri$1.a.y = 0;
    _tri$1.b.y = 0;
    _tri$1.c.y = 0;
    _tri$1.update();
    _line$1.copy(line);
    _line$1.start.y = 0;
    _line$1.end.y = 0;
    if (_tri$1.getArea() <= AREA_EPSILON) {
      return null;
    }
    _line$1.delta(_dir$1).normalize();
    _dir$1.cross(_tri$1.plane.normal).normalize();
    _orthoPlane.setFromNormalAndCoplanarPoint(_dir$1, _line$1.start);
    let intersectCount = 0;
    const { points } = _tri$1;
    for (let i = 0; i < 3; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % 3];
      _edgeLine.start.copy(p1);
      _edgeLine.end.copy(p2);
      const startIntersects = Math.abs(_orthoPlane.distanceToPoint(_edgeLine.start)) < DIST_EPSILON$1;
      const endIntersects = Math.abs(_orthoPlane.distanceToPoint(_edgeLine.end)) < DIST_EPSILON$1;
      const edgeIntersects = _orthoPlane.intersectLine(_edgeLine, _point);
      if (edgeIntersects && !endIntersects || startIntersects) {
        if (startIntersects && !edgeIntersects) {
          _point.copy(_edgeLine.start);
        }
        if (intersectCount === 0) {
          _triLine.start.copy(_point);
        } else {
          _triLine.end.copy(_point);
        }
        intersectCount++;
        if (intersectCount === 2) {
          break;
        }
      }
    }
    if (intersectCount === 2) {
      _line$1.delta(_dir$1).normalize();
      _triLine.delta(_triDir).normalize();
      if (_dir$1.dot(_triDir) < 0) {
        let tmp = _triLine.start;
        _triLine.start = _triLine.end;
        _triLine.end = tmp;
      }
      const s1 = 0;
      const e1 = _vec$1.subVectors(_line$1.end, _line$1.start).dot(_dir$1);
      const s2 = _vec$1.subVectors(_triLine.start, _line$1.start).dot(_dir$1);
      const e2 = _vec$1.subVectors(_triLine.end, _line$1.start).dot(_dir$1);
      const separated1 = e1 <= s2;
      const separated2 = e2 <= s1;
      if (separated1 || separated2) {
        return null;
      }
      line.at(
        Math.max(s1, s2) / _line$1.distance(),
        lineTarget.start
      );
      line.at(
        Math.min(e1, e2) / _line$1.distance(),
        lineTarget.end
      );
      return lineTarget;
    }
    return null;
  }
  const DIST_EPSILON = 1e-16;
  const _dir = /* @__PURE__ */ new Vector3();
  const _v0 = /* @__PURE__ */ new Vector3();
  const _v1 = /* @__PURE__ */ new Vector3();
  function appendOverlapRange(line, overlapLine, overlapsTarget) {
    line.delta(_dir);
    _v0.subVectors(overlapLine.start, line.start);
    _v1.subVectors(overlapLine.end, line.start);
    const length = _dir.length();
    let d0 = _v0.length() / length;
    let d1 = _v1.length() / length;
    d0 = Math.min(Math.max(d0, 0), 1);
    d1 = Math.min(Math.max(d1, 0), 1);
    if (!(Math.abs(d0 - d1) <= DIST_EPSILON)) {
      overlapsTarget.push(new Float32Array([d0, d1]));
      return true;
    }
    return false;
  }
  const OFFSET_EPSILON = 1e-6;
  const _tri = new ExtendedTriangle();
  const _line = new Line3();
  function* generateIntersectionEdges(bvh, iterationTime = 30) {
    const edges = [];
    const geometry = bvh.geometry;
    const index = geometry.index;
    const posAttr = geometry.attributes.position;
    const vertCount = index ? index.count : posAttr;
    let time = performance.now();
    for (let i = 0; i < vertCount; i += 3) {
      let i0 = i + 0;
      let i1 = i + 1;
      let i2 = i + 2;
      if (index) {
        i0 = index.getX(i0);
        i1 = index.getX(i1);
        i2 = index.getX(i2);
      }
      const { a, b, c } = _tri;
      a.fromBufferAttribute(posAttr, i0);
      b.fromBufferAttribute(posAttr, i1);
      c.fromBufferAttribute(posAttr, i2);
      _tri.needsUpdate = true;
      _tri.update();
      bvh.shapecast({
        intersectsBounds: (box) => {
          return box.intersectsTriangle(_tri);
        },
        intersectsTriangle: (tri2) => {
          if (_tri.equals(tri2)) {
            return false;
          }
          if (tri2.needsUpdate) {
            tri2.update();
          }
          if (Math.abs(_tri.plane.normal.dot(tri2.plane.normal)) > 1 - 1e-6) {
            return false;
          }
          if (_tri.intersectsTriangle(tri2, _line, true) && !isLineTriangleEdge(_tri, _line) && !isLineTriangleEdge(tri2, _line)) {
            _line.start.y += OFFSET_EPSILON;
            _line.end.y += OFFSET_EPSILON;
            edges.push(_line.clone());
          }
        }
      });
      const delta = performance.now() - time;
      if (delta > iterationTime) {
        yield;
        time = performance.now();
      }
    }
    return edges;
  }
  const DIST_THRESHOLD = 1e-10;
  const UP_VECTOR = /* @__PURE__ */ new Vector3(0, 1, 0);
  const _beneathLine = /* @__PURE__ */ new Line3();
  const _ray = /* @__PURE__ */ new Ray();
  const _vec = /* @__PURE__ */ new Vector3();
  const _overlapLine = /* @__PURE__ */ new Line3();
  class EdgeSet {
    constructor() {
      this.edges = [];
    }
    getLineGeometry(y = 0) {
      const edges = this.edges;
      const edgeArray = new Float32Array(edges.length * 6);
      let c = 0;
      for (let i = 0, l = edges.length; i < l; i++) {
        const line = edges[i];
        edgeArray[c++] = line[0];
        edgeArray[c++] = y;
        edgeArray[c++] = line[2];
        edgeArray[c++] = line[3];
        edgeArray[c++] = y;
        edgeArray[c++] = line[5];
      }
      const edgeGeom = new BufferGeometry();
      const edgeBuffer = new BufferAttribute(edgeArray, 3, true);
      edgeGeom.setAttribute("position", edgeBuffer);
      return edgeGeom;
    }
  }
  class ProjectionGenerator {
    constructor() {
      this.sortEdges = true;
      this.iterationTime = 30;
      this.angleThreshold = 50;
      this.includeIntersectionEdges = true;
    }
    generateAsync(geometry, options = {}) {
      return new Promise((resolve, reject) => {
        const { signal } = options;
        const task = this.generate(geometry, options);
        run();
        function run() {
          if (signal && signal.aborted) {
            reject(new Error("ProjectionGenerator: Process aborted via AbortSignal."));
            return;
          }
          const result = task.next();
          if (result.done) {
            resolve(result.value);
          } else {
            requestAnimationFrame(run);
          }
        }
      });
    }
    *generate(bvh, options = {}) {
      const { onProgress } = options;
      const { sortEdges, iterationTime, angleThreshold, includeIntersectionEdges } = this;
      if (bvh instanceof BufferGeometry) {
        bvh = new MeshBVH(bvh, { maxLeafTris: 1 });
      }
      const geometry = bvh.geometry;
      let edges = generateEdges(geometry, UP_VECTOR, angleThreshold);
      if (includeIntersectionEdges) {
        const results = yield* generateIntersectionEdges(bvh, iterationTime);
        edges = edges.concat(results);
      }
      if (sortEdges) {
        edges.sort((a, b) => {
          return Math.min(a.start.y, a.end.y) - Math.min(b.start.y, b.end.y);
        });
      }
      yield;
      const finalEdges = new EdgeSet();
      let time = performance.now();
      for (let i = 0, l = edges.length; i < l; i++) {
        const line = edges[i];
        if (isYProjectedLineDegenerate(line)) {
          continue;
        }
        const lowestLineY = Math.min(line.start.y, line.end.y);
        const highestLineY = Math.max(line.start.y, line.end.y);
        const hiddenOverlaps = [];
        bvh.shapecast({
          intersectsBounds: (box) => {
            box.min.y = Math.min(lowestLineY - 1e-6, box.min.y);
            const { origin, direction } = _ray;
            origin.copy(line.start);
            line.delta(direction).normalize();
            if (box.containsPoint(origin)) {
              return true;
            }
            if (_ray.intersectBox(box, _vec)) {
              return origin.distanceToSquared(_vec) < line.distanceSq();
            }
            return false;
          },
          intersectsTriangle: (tri) => {
            const highestTriangleY = Math.max(tri.a.y, tri.b.y, tri.c.y);
            if (highestTriangleY <= lowestLineY) {
              return false;
            }
            if (isYProjectedTriangleDegenerate(tri)) {
              return false;
            }
            if (isLineTriangleEdge(tri, line)) {
              return false;
            }
            const lowestTriangleY = Math.min(tri.a.y, tri.b.y, tri.c.y);
            if (highestLineY < lowestTriangleY) {
              _beneathLine.copy(line);
            } else if (!trimToBeneathTriPlane(tri, line, _beneathLine)) {
              return false;
            }
            if (_beneathLine.distance() < DIST_THRESHOLD) {
              return false;
            }
            if (getProjectedLineOverlap(_beneathLine, tri, _overlapLine) && appendOverlapRange(line, _overlapLine, hiddenOverlaps)) {
              compressEdgeOverlaps(hiddenOverlaps);
            }
            if (hiddenOverlaps.length !== 0) {
              const [d0, d1] = hiddenOverlaps[hiddenOverlaps.length - 1];
              return d0 === 0 && d1 === 1;
            }
            return false;
          }
        });
        overlapsToLines(line, hiddenOverlaps, finalEdges.edges);
        const delta = performance.now() - time;
        if (delta > iterationTime) {
          if (onProgress) {
            const progress = i / edges.length;
            onProgress(progress, finalEdges);
          }
          yield;
          time = performance.now();
        }
      }
      return finalEdges.getLineGeometry(0);
    }
  }
  onmessage = function({ data }) {
    let prevTime = performance.now();
    function onProgressCallback(progress) {
      const currTime = performance.now();
      if (currTime - prevTime >= 10 || progress === 1) {
        postMessage({
          error: null,
          progress
        });
        prevTime = currTime;
      }
    }
    try {
      const { index, position, options } = data;
      const geometry = new BufferGeometry();
      geometry.setIndex(new BufferAttribute(index, 1, false));
      geometry.setAttribute("position", new BufferAttribute(position, 3, false));
      const generator = new ProjectionGenerator();
      generator.sortEdges = options.sortEdges ?? generator.sortEdges;
      generator.angleThreshold = options.angleThreshold ?? generator.angleThreshold;
      generator.includeIntersectionEdges = options.includeIntersectionEdges ?? generator.includeIntersectionEdges;
      const task = generator.generate(geometry, {
        onProgress: onProgressCallback
      });
      let result = task.next();
      while (!result.done) {
        result = task.next();
      }
      const resultLines = result.value.attributes.position.array;
      postMessage({
        result: resultLines,
        error: null,
        progress: 1
      }, [resultLines.buffer]);
    } catch (error) {
      postMessage({
        error,
        progress: 1
      });
    }
  };
})();
