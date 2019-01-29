import { EditDistance } from "./EditDistance";

/**
 * The hamming distance between two strings of equal length is the number of
 * positions at which the corresponding symbols are different.
 *
 * <p>
 * For further explanation about the Hamming Distance, take a look at its
 * Wikipedia page at http://en.wikipedia.org/wiki/Hamming_distance.
 * </p>
 *
 * @since 1.0
 */
export class HammingDistance implements EditDistance<number> {

    /**
     * Find the Hamming Distance between two strings with the same
     * length.
     *
     * <p>The distance starts with zero, and for each occurrence of a
     * different character in either String, it increments the distance
     * by 1, and finally return its value.</p>
     *
     * <p>Since the Hamming Distance can only be calculated between strings of equal length, input of different lengths
     * will throw IllegalArgumentException</p>
     *
     * <pre>
     * distance.apply("", "")               = 0
     * distance.apply("pappa", "pappa")     = 0
     * distance.apply("1011101", "1011111") = 1
     * distance.apply("ATCG", "ACCC")       = 2
     * distance.apply("karolin", "kerstin"  = 3
     * </pre>
     *
     * @param left the first CharSequence, must not be null
     * @param right the second CharSequence, must not be null
     * @return distance
     * @throws IllegalArgumentException if either input is {@code null} or
     *             if they do not have the same length
     */
    apply(left:string, right:string) {
        if (left == null || right == null) {
            throw new Error("CharSequences must not be null");
        }

        if (left.length != right.length) {
            throw new Error("CharSequences must have the same length");
        }

        let distance = 0;

        for (let i = 0; i < left.length; i++) {
            if (left.charAt(i) != right.charAt(i)) {
                distance++;
            }
        }
        return distance;
    }

}
