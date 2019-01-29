"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JaccardSimilarity_1 = require("./JaccardSimilarity");
/**
 * Measures the Jaccard distance of two sets of character sequence. Jaccard
 * distance is the dissimilarity between two sets. It is the complementary of
 * Jaccard similarity.
 *
 * <p>
 * For further explanation about Jaccard Distance, refer
 * https://en.wikipedia.org/wiki/Jaccard_index
 * </p>
 *
 * @since 1.0
 */
var JaccardDistance = /** @class */ (function () {
    function JaccardDistance() {
        /**
         * We normalize the jaccardSimilarity for the purpose of computing the distance.
         */
        this.jaccardSimilarity = new JaccardSimilarity_1.JaccardSimilarity();
    }
    /**
     * Calculates Jaccard distance of two set character sequence passed as
     * input. Calculates Jaccard similarity and returns the complement of it.
     *
     * @param left first character sequence
     * @param right second character sequence
     * @return index
     * @throws IllegalArgumentException
     *             if either String input {@code null}
     */
    JaccardDistance.prototype.apply = function (left, right) {
        if (left == null || right == null) {
            throw new Error("Input cannot be null");
        }
        return Math.round((1 - this.jaccardSimilarity.apply(left, right)) * 100) / 100;
    };
    return JaccardDistance;
}());
exports.JaccardDistance = JaccardDistance;
