"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
/**
 * A similarity algorithm indicating the percentage of matched characters between two character sequences.
 *
 * <p>
 * The Jaro measure is the weighted sum of percentage of matched characters
 * from each file and transposed characters. Winkler increased this measure
 * for matching initial characters.
 * </p>
 *
 * <p>
 * This implementation is based on the Jaro Winkler similarity algorithm
 * from <a href="http://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance">
 * http://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance</a>.
 * </p>
 *
 * <p>
 * This code has been adapted from Apache Commons Lang 3.3.
 * </p>
 *
 * @since 1.0
 */
var INDEX_NOT_FOUND = -1;
var JaroWinklerDistance = /** @class */ (function () {
    function JaroWinklerDistance() {
    }
    /**
     * Represents a failed index search.
     */
    /**
     * Find the Jaro Winkler Distance which indicates the similarity score
     * between two CharSequences.
     *
     * <pre>
     * distance.apply(null, null)          = IllegalArgumentException
     * distance.apply("","")               = 0.0
     * distance.apply("","a")              = 0.0
     * distance.apply("aaapppp", "")       = 0.0
     * distance.apply("frog", "fog")       = 0.93
     * distance.apply("fly", "ant")        = 0.0
     * distance.apply("elephant", "hippo") = 0.44
     * distance.apply("hippo", "elephant") = 0.44
     * distance.apply("hippo", "zzzzzzzz") = 0.0
     * distance.apply("hello", "hallo")    = 0.88
     * distance.apply("ABC Corporation", "ABC Corp") = 0.93
     * distance.apply("D N H Enterprises Inc", "D &amp; H Enterprises, Inc.") = 0.95
     * distance.apply("My Gym Children's Fitness Center", "My Gym. Childrens Fitness") = 0.92
     * distance.apply("PENNSYLVANIA", "PENNCISYLVNIA")    = 0.88
     * </pre>
     *
     * @param left the first CharSequence, must not be null
     * @param right the second CharSequence, must not be null
     * @return result distance
     * @throws IllegalArgumentException if either CharSequence input is {@code null}
     */
    JaroWinklerDistance.prototype.apply = function (left, right) {
        var defaultScalingFactor = 0.1;
        if (left == null || right == null) {
            throw new Error("CharSequences must not be null");
        }
        var mtp = JaroWinklerDistance.matches(left, right);
        var m = mtp[0];
        if (m == 0) {
            return 0;
        }
        var j = ((m / left.length + m / right.length + (m - mtp[1] / 2) / m)) / 3;
        var jw = j < 0.7 ? j : j + defaultScalingFactor * mtp[2] * (1 - j);
        return jw;
    };
    /**
     * This method returns the Jaro-Winkler string matches, half transpositions, prefix array.
     *
     * @param first the first string to be matched
     * @param second the second string to be matched
     * @return mtp array containing: matches, half transpositions, and prefix
     */
    JaroWinklerDistance.matches = function (first, second) {
        var max, min;
        if (first.length > second.length) {
            max = first;
            min = second;
        }
        else {
            max = second;
            min = first;
        }
        var range = Math.max(max.length / 2 - 1, 0);
        var matchIndexes = util_1.createArray(min.length, -1);
        var matchFlags = util_1.createArray(max.length, false);
        var matches = 0;
        for (var mi = 0; mi < min.length; mi++) {
            var c1 = min.charAt(mi);
            for (var xi = Math.max(mi - range, 0), xn = Math.min(mi + range + 1, max.length); xi < xn; xi++) {
                if (!matchFlags[xi] && c1 == max.charAt(xi)) {
                    matchIndexes[mi] = xi;
                    matchFlags[xi] = true;
                    matches++;
                    break;
                }
            }
        }
        var ms1 = util_1.createArray(matches, '');
        var ms2 = util_1.createArray(matches, '');
        for (var i = 0, si = 0; i < min.length; i++) {
            if (matchIndexes[i] != -1) {
                ms1[si] = min.charAt(i);
                si++;
            }
        }
        for (var i = 0, si = 0; i < max.length; i++) {
            if (matchFlags[i]) {
                ms2[si] = max.charAt(i);
                si++;
            }
        }
        var halfTranspositions = 0;
        for (var mi = 0; mi < ms1.length; mi++) {
            if (ms1[mi] != ms2[mi]) {
                halfTranspositions++;
            }
        }
        var prefix = 0;
        for (var mi = 0; mi < Math.min(4, min.length); mi++) {
            if (first.charAt(mi) == second.charAt(mi)) {
                prefix++;
            }
            else {
                break;
            }
        }
        return [matches, halfTranspositions, prefix];
    };
    return JaroWinklerDistance;
}());
exports.JaroWinklerDistance = JaroWinklerDistance;
