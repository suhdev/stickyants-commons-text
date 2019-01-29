"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Container class to store Levenshtein distance between two character sequences.
 *
 * <p>Stores the count of insert, deletion and substitute operations needed to
 * change one character sequence into another.</p>
 *
 * <p>This class is immutable.</p>
 *
 * @since 1.0
 */
var LevenshteinResults = /** @class */ (function () {
    /**
     * Create the results for a detailed Levenshtein distance.
     *
     * @param distance distance between two character sequences.
     * @param insertCount insert character count
     * @param deleteCount delete character count
     * @param substituteCount substitute character count
     */
    function LevenshteinResults(distance, insertCount, deleteCount, substituteCount) {
        this.distance = distance;
        this.insertCount = insertCount;
        this.deleteCount = deleteCount;
        this.substituteCount = substituteCount;
    }
    /**
     * Get the distance between two character sequences.
     *
     * @return distance between two character sequence
     */
    LevenshteinResults.prototype.getDistance = function () {
        return this.distance;
    };
    /**
     * Get the number of insertion needed to change one character sequence into another.
     *
     * @return insert character count
     */
    LevenshteinResults.prototype.getInsertCount = function () {
        return this.insertCount;
    };
    /**
     * Get the number of character deletion needed to change one character sequence to other.
     *
     * @return delete character count
     */
    LevenshteinResults.prototype.getDeleteCount = function () {
        return this.deleteCount;
    };
    /**
     * Get the number of character substitution needed to change one character sequence into another.
     *
     * @return substitute character count
     */
    LevenshteinResults.prototype.getSubstituteCount = function () {
        return this.substituteCount;
    };
    LevenshteinResults.prototype.equals = function (o) {
        if (this == o) {
            return true;
        }
        return o.distance === this.distance &&
            o.insertCount === this.insertCount &&
            o.deleteCount === this.deleteCount &&
            o.substituteCount === this.substituteCount;
    };
    LevenshteinResults.prototype.toString = function () {
        return "Distance: " + this.distance + ", Insert: " + this.insertCount
            + ", Delete: " + this.deleteCount + ", Substitute: "
            + this.substituteCount;
    };
    return LevenshteinResults;
}());
exports.LevenshteinResults = LevenshteinResults;
