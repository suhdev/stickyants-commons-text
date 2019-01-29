import { EditDistance } from "./EditDistance";
import { LevenshteinResults } from "./LevenshteinResults";
import { createArray } from "./util";

/**
 * An algorithm for measuring the difference between two character sequences.
 *
 * <p>
 * This is the number of changes needed to change one sequence into another,
 * where each change is a single character modification (deletion, insertion
 * or substitution).
 * </p>
 *
 * @since 1.0
 */
export class LevenshteinDetailedDistance implements EditDistance<LevenshteinResults> {

    /**
     * Default instance.
     */
    static DEFAULT_INSTANCE = new LevenshteinDetailedDistance();
    /**
     * Threshold.
     */
    private threshold:number;

    /**
     * <p>
     * This returns the default instance that uses a version
     * of the algorithm that does not use a threshold parameter.
     * </p>
     * 
     * @param threshold If this is null then distances calculations will not be limited. This may not be negative.
     * @see LevenshteinDetailedDistance#getDefaultInstance()
     */
    public LevenshteinDetailedDistance(threshold:number = null) {
        if (threshold !== null && threshold < 0) {
            throw new Error("Threshold must not be negative");
        }
        this.threshold = threshold;
    }

    /**
     * <p>Find the Levenshtein distance between two Strings.</p>
     *
     * <p>A higher score indicates a greater distance.</p>
     *
     * <p>The previous implementation of the Levenshtein distance algorithm
     * was from <a href="http://www.merriampark.com/ld.htm">http://www.merriampark.com/ld.htm</a></p>
     *
     * <p>Chas Emerick has written an implementation in Java, which avoids an OutOfMemoryError
     * which can occur when my Java implementation is used with very large strings.<br>
     * This implementation of the Levenshtein distance algorithm
     * is from <a href="http://www.merriampark.com/ldjava.htm">http://www.merriampark.com/ldjava.htm</a></p>
     *
     * <pre>
     * distance.apply(null, *)             = IllegalArgumentException
     * distance.apply(*, null)             = IllegalArgumentException
     * distance.apply("","")               = 0
     * distance.apply("","a")              = 1
     * distance.apply("aaapppp", "")       = 7
     * distance.apply("frog", "fog")       = 1
     * distance.apply("fly", "ant")        = 3
     * distance.apply("elephant", "hippo") = 7
     * distance.apply("hippo", "elephant") = 7
     * distance.apply("hippo", "zzzzzzzz") = 8
     * distance.apply("hello", "hallo")    = 1
     * </pre>
     *
     * @param left the first string, must not be null
     * @param right the second string, must not be null
     * @return result distance, or -1
     * @throws IllegalArgumentException if either String input {@code null}
     */
    apply( left:string,  right:string):LevenshteinResults {
        if (this.threshold != null) {
            return LevenshteinDetailedDistance.limitedCompare(left, right, this.threshold);
        }
        return LevenshteinDetailedDistance.unlimitedCompare(left, right);
    }

    /**
     * Gets the default instance.
     *
     * @return the default instace
     */
    public static getDefaultInstance():LevenshteinDetailedDistance {
        return LevenshteinDetailedDistance.DEFAULT_INSTANCE;
    }

    /**
     * Gets the distance threshold.
     *
     * @return the distance threshold
     */
    getThreshold() {
        return this.threshold;
    }

    /**
     * Find the Levenshtein distance between two CharSequences if it's less than or
     * equal to a given threshold.
     *
     * <p>
     * This implementation follows from Algorithms on Strings, Trees and
     * Sequences by Dan Gusfield and Chas Emerick's implementation of the
     * Levenshtein distance algorithm from <a
     * href="http://www.merriampark.com/ld.htm"
     * >http://www.merriampark.com/ld.htm</a>
     * </p>
     *
     * <pre>
     * limitedCompare(null, *, *)             = IllegalArgumentException
     * limitedCompare(*, null, *)             = IllegalArgumentException
     * limitedCompare(*, *, -1)               = IllegalArgumentException
     * limitedCompare("","", 0)               = 0
     * limitedCompare("aaapppp", "", 8)       = 7
     * limitedCompare("aaapppp", "", 7)       = 7
     * limitedCompare("aaapppp", "", 6))      = -1
     * limitedCompare("elephant", "hippo", 7) = 7
     * limitedCompare("elephant", "hippo", 6) = -1
     * limitedCompare("hippo", "elephant", 7) = 7
     * limitedCompare("hippo", "elephant", 6) = -1
     * </pre>
     *
     * @param left the first CharSequence, must not be null
     * @param right the second CharSequence, must not be null
     * @param threshold the target threshold, must not be negative
     * @return result distance, or -1
     */
    static limitedCompare(left:string, 
        right:string,
        threshold:number):LevenshteinResults { //NOPMD
        if (left == null || right == null) {
            throw new Error("CharSequences must not be null");
        }
        if (threshold < 0) {
            throw new Error("Threshold must not be negative");
        }

        /*
         * This implementation only computes the distance if it's less than or
         * equal to the threshold value, returning -1 if it's greater. The
         * advantage is performance: unbounded distance is O(nm), but a bound of
         * k allows us to reduce it to O(km) time by only computing a diagonal
         * stripe of width 2k + 1 of the cost table. It is also possible to use
         * this to compute the unbounded Levenshtein distance by starting the
         * threshold at 1 and doubling each time until the distance is found;
         * this is O(dm), where d is the distance.
         *
         * One subtlety comes from needing to ignore entries on the border of
         * our stripe eg. p[] = |#|#|#|* d[] = *|#|#|#| We must ignore the entry
         * to the left of the leftmost member We must ignore the entry above the
         * rightmost member
         *
         * Another subtlety comes from our stripe running off the matrix if the
         * strings aren't of the same size. Since string s is always swapped to
         * be the shorter of the two, the stripe will always run off to the
         * upper right instead of the lower left of the matrix.
         *
         * As a concrete example, suppose s is of length 5, t is of length 7,
         * and our threshold is 1. In this case we're going to walk a stripe of
         * length 3. The matrix would look like so:
         *
         * <pre>
         *    1 2 3 4 5
         * 1 |#|#| | | |
         * 2 |#|#|#| | |
         * 3 | |#|#|#| |
         * 4 | | |#|#|#|
         * 5 | | | |#|#|
         * 6 | | | | |#|
         * 7 | | | | | |
         * </pre>
         *
         * Note how the stripe leads off the table as there is no possible way
         * to turn a string of length 5 into one of length 7 in edit distance of
         * 1.
         *
         * Additionally, this implementation decreases memory usage by using two
         * single-dimensional arrays and swapping them back and forth instead of
         * allocating an entire n by m matrix. This requires a few minor
         * changes, such as immediately returning when it's detected that the
         * stripe has run off the matrix and initially filling the arrays with
         * large values so that entries we don't compute are ignored.
         *
         * See Algorithms on Strings, Trees and Sequences by Dan Gusfield for
         * some discussion.
         */

        let n = left.length; // length of left
        let m = right.length; // length of right

        // if one string is empty, the edit distance is necessarily the length of the other
        if (n == 0) {
            return m <= threshold ? new LevenshteinResults(m, m, 0, 0) : new LevenshteinResults(-1, 0, 0, 0);
        } else if (m == 0) {
            return n <= threshold ? new LevenshteinResults(n, 0, n, 0) : new LevenshteinResults(-1, 0, 0, 0);
        }

        let swapped = false;
        if (n > m) {
            // swap the two strings to consume less memory
            const tmp = left;
            left = right;
            right = tmp;
            n = m;
            m = right.length;
            swapped = true;
        }

        let p = createArray(n + 1,0);
        let d = createArray(n + 1,0); // cost array, horizontally
        let tempD:number[]; // placeholder to assist in swapping p and d
        const matrix:number[][] = createArray(m+1,()=>createArray(n + 1,0));

        //filling the first row and first column values in the matrix
        for (let index = 0; index <= n; index++) {
            matrix[0][index] = index;
        }
        for (let index = 0; index <= m; index++) {
            matrix[index][0] = index;
        }

        // fill in starting table values
        const boundary = Math.min(n, threshold) + 1;
        for (let i = 0; i < boundary; i++) {
            p[i] = i;
        }
        // these fills ensure that the value above the rightmost entry of our
        // stripe will be ignored in following loop iterations
        p.fill(Number.MAX_VALUE,boundary,p.length);
        d.fill(Number.MAX_VALUE);

        // iterates through t
        for (let j = 1; j <= m; j++) {
            const rightJ = right.charAt(j - 1); // jth character of right
            d[0] = j;

            // compute stripe indices, constrain to array size
            const min = Math.max(1, j - threshold);
            const max = j > Number.MAX_VALUE - threshold ? n : Math.min(
                    n, j + threshold);

            // the stripe may lead off of the table if s and t are of different sizes
            if (min > max) {
                return new LevenshteinResults(-1, 0, 0, 0);
            }

            // ignore entry left of leftmost
            if (min > 1) {
                d[min - 1] = Number.MAX_VALUE;
            }

            // iterates through [min, max] in s
            for (let i = min; i <= max; i++) {
                if (left.charAt(i - 1) == rightJ) {
                    // diagonally left and up
                    d[i] = p[i - 1];
                } else {
                    // 1 + minimum of cell to the left, to the top, diagonally left and up
                    d[i] = 1 + Math.min(Math.min(d[i - 1], p[i]), p[i - 1]);
                }
                matrix[j][i] = d[i];
            }

            // copy current distance counts to 'previous row' distance counts
            tempD = p;
            p = d;
            d = tempD;
        }

        // if p[n] is greater than the threshold, there's no guarantee on it being the correct distance
        if (p[n] <= threshold) {
            return LevenshteinDetailedDistance.findDetailedResults(left, right, matrix, swapped);
        }
        return new LevenshteinResults(-1, 0, 0, 0);
    }

    /**
     * <p>Find the Levenshtein distance between two Strings.</p>
     *
     * <p>A higher score indicates a greater distance.</p>
     *
     * <p>The previous implementation of the Levenshtein distance algorithm
     * was from <a href="http://www.merriampark.com/ld.htm">http://www.merriampark.com/ld.htm</a></p>
     *
     * <p>Chas Emerick has written an implementation in Java, which avoids an OutOfMemoryError
     * which can occur when my Java implementation is used with very large strings.<br>
     * This implementation of the Levenshtein distance algorithm
     * is from <a href="http://www.merriampark.com/ldjava.htm">http://www.merriampark.com/ldjava.htm</a></p>
     *
     * <pre>
     * unlimitedCompare(null, *)             = IllegalArgumentException
     * unlimitedCompare(*, null)             = IllegalArgumentException
     * unlimitedCompare("","")               = 0
     * unlimitedCompare("","a")              = 1
     * unlimitedCompare("aaapppp", "")       = 7
     * unlimitedCompare("frog", "fog")       = 1
     * unlimitedCompare("fly", "ant")        = 3
     * unlimitedCompare("elephant", "hippo") = 7
     * unlimitedCompare("hippo", "elephant") = 7
     * unlimitedCompare("hippo", "zzzzzzzz") = 8
     * unlimitedCompare("hello", "hallo")    = 1
     * </pre>
     *
     * @param left the first CharSequence, must not be null
     * @param right the second CharSequence, must not be null
     * @return result distance, or -1
     * @throws IllegalArgumentException if either CharSequence input is {@code null}
     */
    private static unlimitedCompare(left:string,right:string):LevenshteinResults {
        if (left == null || right == null) {
            throw new Error("CharSequences must not be null");
        }

        /*
           The difference between this impl. and the previous is that, rather
           than creating and retaining a matrix of size s.length() + 1 by t.length() + 1,
           we maintain two single-dimensional arrays of length s.length() + 1.  The first, d,
           is the 'current working' distance array that maintains the newest distance cost
           counts as we iterate through the characters of String s.  Each time we increment
           the index of String t we are comparing, d is copied to p, the second int[].  Doing so
           allows us to retain the previous cost counts as required by the algorithm (taking
           the minimum of the cost count to the left, up one, and diagonally up and to the left
           of the current cost count being calculated).  (Note that the arrays aren't really
           copied anymore, just switched...this is clearly much better than cloning an array
           or doing a System.arraycopy() each time  through the outer loop.)

           Effectively, the difference between the two implementations is this one does not
           cause an out of memory condition when calculating the LD over two very large strings.
         */

        let n = left.length; // length of left
        let m = right.length; // length of right

        if (n == 0) {
            return new LevenshteinResults(m, m, 0, 0);
        } else if (m == 0) {
            return new LevenshteinResults(n, 0, n, 0);
        }
        let swapped = false;
        if (n > m) {
            // swap the input strings to consume less memory
            const tmp = left;
            left = right;
            right = tmp;
            n = m;
            m = right.length;
            swapped = true;
        }

        let p = createArray(n+1,0);
        let d = createArray(n+1,0); 
        let tempD:number[]; //placeholder to assist in swapping p and d
        const matrix:number[][] = createArray(m+1,()=>createArray(n+1,0));

        // filling the first row and first column values in the matrix
        for (let index = 0; index <= n; index++) {
            matrix[0][index] = index;
        }
        for (let index = 0; index <= m; index++) {
            matrix[index][0] = index;
        }

        // indexes into strings left and right
        let i:number; // iterates through left
        let j:number; // iterates through right

        let rightJ:string; // jth character of right

        let cost; // cost
        for (i = 0; i <= n; i++) {
            p[i] = i;
        }

        for (j = 1; j <= m; j++) {
            rightJ = right.charAt(j - 1);
            d[0] = j;

            for (i = 1; i <= n; i++) {
                cost = left.charAt(i - 1) == rightJ ? 0 : 1;
                // minimum of cell to the left+1, to the top+1, diagonally left and up +cost
                d[i] = Math.min(Math.min(d[i - 1] + 1, p[i] + 1), p[i - 1] + cost);
                //filling the matrix
                matrix[j][i] = d[i];
            }

            // copy current distance counts to 'previous row' distance counts
            tempD = p;
            p = d;
            d = tempD;
        }
        return LevenshteinDetailedDistance.findDetailedResults(left, right, matrix, swapped);
    }

    /**
     * Finds count for each of the three [insert, delete, substitute] operations
     * needed. This is based on the matrix formed based on the two character
     * sequence.
     *
     * @param left character sequence which need to be converted from
     * @param right character sequence which need to be converted to
     * @param matrix two dimensional array containing
     * @param swapped tells whether the value for left character sequence and right
     *            character sequence were swapped to save memory
     * @return result object containing the count of insert, delete and substitute and total count needed
     */
    static findDetailedResults(left:string,
        right:string,
        matrix:number[][],
        swapped:boolean):LevenshteinResults {

        let delCount = 0;
        let addCount = 0;
        let subCount = 0;

        let rowIndex = right.length;
        let columnIndex = left.length;

        let dataAtLeft = 0;
        let dataAtTop = 0;
        let dataAtDiagonal = 0;
        let data = 0;
        let deleted = false;
        let added = false;

        while (rowIndex >= 0 && columnIndex >= 0) {

            if (columnIndex == 0) {
                dataAtLeft = -1;
            } else {
                dataAtLeft = matrix[rowIndex][columnIndex - 1];
            }
            if (rowIndex == 0) {
                dataAtTop = -1;
            } else {
                dataAtTop = matrix[rowIndex - 1][columnIndex];
            }
            if (rowIndex > 0 && columnIndex > 0) {
                dataAtDiagonal = matrix[rowIndex - 1][columnIndex - 1];
            } else {
                dataAtDiagonal = -1;
            }
            if (dataAtLeft == -1 && dataAtTop == -1 && dataAtDiagonal == -1) {
                break;
            }
            data = matrix[rowIndex][columnIndex];

            // case in which the character at left and right are the same,
            // in this case none of the counters will be incremented.
            if (columnIndex > 0 && rowIndex > 0 && left.charAt(columnIndex - 1) == right.charAt(rowIndex - 1)) {
                columnIndex--;
                rowIndex--;
                continue;
            }

            // handling insert and delete cases.
            deleted = false;
            added = false;
            if (data - 1 == dataAtLeft && (data <= dataAtDiagonal && data <= dataAtTop)
                    || (dataAtDiagonal == -1 && dataAtTop == -1)) { // NOPMD
                columnIndex--;
                if (swapped) {
                    addCount++;
                    added = true;
                } else {
                    delCount++;
                    deleted = true;
                }
            } else if (data - 1 == dataAtTop && (data <= dataAtDiagonal && data <= dataAtLeft)
                    || (dataAtDiagonal == -1 && dataAtLeft == -1)) { // NOPMD
                rowIndex--;
                if (swapped) {
                    delCount++;
                    deleted = true;
                } else {
                    addCount++;
                    added = true;
                }
            }

            // substituted case
            if (!added && !deleted) {
                subCount++;
                columnIndex--;
                rowIndex--;
            }
        }
        return new LevenshteinResults(addCount + delCount + subCount, addCount, delCount, subCount);
    }
}
