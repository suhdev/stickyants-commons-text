import { SimilarityScore } from "./SimilarityScore";
import { createArray } from "./util";



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
const INDEX_NOT_FOUND = -1;
export class JaroWinklerDistance implements SimilarityScore<number> {

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
    apply(left:string,right:string) {
        const defaultScalingFactor = 0.1;

        if (left == null || right == null) {
            throw new Error("CharSequences must not be null");
        }

        const mtp = JaroWinklerDistance.matches(left, right);
        const m = mtp[0];
        if (m == 0) {
            return 0;
        }
        const j = ((m / left.length + m / right.length + (m - mtp[1] / 2) / m)) / 3;
        const jw = j < 0.7 ? j : j + defaultScalingFactor * mtp[2] * (1 - j);
        return jw;
    }

    /**
     * This method returns the Jaro-Winkler string matches, half transpositions, prefix array.
     *
     * @param first the first string to be matched
     * @param second the second string to be matched
     * @return mtp array containing: matches, half transpositions, and prefix
     */
    static matches(first:string,second:string):number[]{
        var max:string, min:string;
        if (first.length > second.length) {
            max = first;
            min = second;
        } else {
            max = second;
            min = first;
        }
        const range = Math.max(max.length / 2 - 1, 0);
        const matchIndexes = createArray(min.length,-1);
        const matchFlags = createArray(max.length,false); 
        let matches = 0;
        for (let mi = 0; mi < min.length; mi++) {
            const c1 = min.charAt(mi);
            for (let xi = Math.max(mi - range, 0), xn = Math.min(mi + range + 1, max.length); xi < xn; xi++) {
                if (!matchFlags[xi] && c1 == max.charAt(xi)) {
                    matchIndexes[mi] = xi;
                    matchFlags[xi] = true;
                    matches++;
                    break;
                }
            }
        }
        const ms1 = createArray(matches,'');
        const ms2 = createArray(matches,'');
        for (let i = 0, si = 0; i < min.length; i++) {
            if (matchIndexes[i] != -1) {
                ms1[si] = min.charAt(i);
                si++;
            }
        }
        for (let i = 0, si = 0; i < max.length; i++) {
            if (matchFlags[i]) {
                ms2[si] = max.charAt(i);
                si++;
            }
        }
        let halfTranspositions = 0;
        for (let mi = 0; mi < ms1.length; mi++) {
            if (ms1[mi] != ms2[mi]) {
                halfTranspositions++;
            }
        }
        let prefix = 0;
        for (let mi = 0; mi < Math.min(4, min.length); mi++) {
            if (first.charAt(mi) == second.charAt(mi)) {
                prefix++;
            } else {
                break;
            }
        }
        return [matches, halfTranspositions, prefix];
    }

}
