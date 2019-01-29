"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Measures the Jaccard similarity (aka Jaccard index) of two sets of character
 * sequence. Jaccard similarity is the size of the intersection divided by the
 * size of the union of the two sets.
 *
 * <p>
 * For further explanation about Jaccard Similarity, refer
 * https://en.wikipedia.org/wiki/Jaccard_index
 * </p>
 *
 * @since 1.0
 */
var JaccardSimilarity = /** @class */ (function () {
    function JaccardSimilarity() {
    }
    /**
     * Calculates Jaccard Similarity of two set character sequence passed as
     * input.
     *
     * @param left first character sequence
     * @param right second character sequence
     * @return index
     * @throws IllegalArgumentException
     *             if either String input {@code null}
     */
    JaccardSimilarity.prototype.apply = function (left, right) {
        if (left == null || right == null) {
            throw new Error("Input cannot be null");
        }
        return Math.round(this.calculateJaccardSimilarity(left, right) * 100) / 100;
    };
    /**
     * Calculates Jaccard Similarity of two character sequences passed as
     * input. Does the calculation by identifying the union (characters in at
     * least one of the two sets) of the two sets and intersection (characters
     * which are present in set one which are present in set two)
     *
     * @param left first character sequence
     * @param right second character sequence
     * @return index
     */
    JaccardSimilarity.prototype.calculateJaccardSimilarity = function (left, right) {
        var leftLength = left.length;
        var rightLength = right.length;
        if (leftLength == 0 || rightLength == 0) {
            return 0;
        }
        var leftSet = new Set();
        for (var i = 0; i < leftLength; i++) {
            leftSet.add(left.charAt(i));
        }
        var rightSet = new Set();
        for (var i = 0; i < rightLength; i++) {
            rightSet.add(right.charAt(i));
        }
        var unionSet = new Set(leftSet);
        rightSet.forEach(function (v) {
            unionSet.add(v);
        });
        var intersectionSize = leftSet.size + rightSet.size - unionSet.size;
        return 1.0 * intersectionSize / unionSet.size;
    };
    return JaccardSimilarity;
}());
exports.JaccardSimilarity = JaccardSimilarity;
