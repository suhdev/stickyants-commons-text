"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Measures the Cosine similarity of two vectors of an inner product space and
 * compares the angle between them.
 *
 * <p>
 * For further explanation about the Cosine Similarity, refer to
 * http://en.wikipedia.org/wiki/Cosine_similarity.
 * </p>
 *
 * @since 1.0
 */
var CosineSimilarity = /** @class */ (function () {
    function CosineSimilarity() {
    }
    /**
     * Calculates the cosine similarity for two given vectors.
     *
     * @param leftVector left vector
     * @param rightVector right vector
     * @return cosine similarity between the two vectors
     */
    CosineSimilarity.prototype.cosineSimilarity = function (leftVector, rightVector) {
        if (leftVector == null || rightVector == null) {
            throw new Error("Vectors must not be null");
        }
        var intersection = this.getIntersection(leftVector, rightVector);
        var dotProduct = this.dot(leftVector, rightVector, intersection);
        var d1 = 0.0;
        leftVector.forEach(function (value, k) {
            d1 += Math.pow(value, 2);
        });
        var d2 = 0.0;
        rightVector.forEach(function (value, k) {
            d2 += Math.pow(value, 2);
        });
        var cosineSimilarity;
        if (d1 <= 0.0 || d2 <= 0.0) {
            cosineSimilarity = 0.0;
        }
        else {
            cosineSimilarity = dotProduct / (Math.sqrt(d1) * Math.sqrt(d2));
        }
        return cosineSimilarity;
    };
    /**
     * Returns a set with strings common to the two given maps.
     *
     * @param leftVector left vector map
     * @param rightVector right vector map
     * @return common strings
     */
    CosineSimilarity.prototype.getIntersection = function (leftVector, rightVector) {
        var intersection = new Set(leftVector.keys());
        intersection.forEach(function (value, key) {
            if (!rightVector.has(key)) {
                intersection.delete(key);
            }
        });
        return intersection;
    };
    /**
     * Computes the dot product of two vectors. It ignores remaining elements. It means
     * that if a vector is longer than other, then a smaller part of it will be used to compute
     * the dot product.
     *
     * @param leftVector left vector
     * @param rightVector right vector
     * @param intersection common elements
     * @return the dot product
     */
    CosineSimilarity.prototype.dot = function (leftVector, rightVector, intersection) {
        var dotProduct = 0;
        intersection.forEach(function (value, key) {
            dotProduct += leftVector.get(key) * rightVector.get(key);
        });
        return dotProduct;
    };
    return CosineSimilarity;
}());
exports.CosineSimilarity = CosineSimilarity;
