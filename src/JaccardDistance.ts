import { JaccardSimilarity } from "./JaccardSimilarity";
import { EditDistance } from "./EditDistance";

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
export class JaccardDistance implements EditDistance<number> {

    /**
     * We normalize the jaccardSimilarity for the purpose of computing the distance.
     */
    jaccardSimilarity = new JaccardSimilarity();

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
    apply(left:string,right:string):number {
        if (left == null || right == null) {
            throw new Error("Input cannot be null");
        }
        return Math.round((1 - this.jaccardSimilarity.apply(left, right)) * 100) / 100;
    }
}
