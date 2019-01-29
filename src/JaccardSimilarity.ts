import { SimilarityScore } from "./SimilarityScore";

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
export class JaccardSimilarity implements SimilarityScore<number> {

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
    apply(left:string,right:string) {
        if (left == null || right == null) {
            throw new Error("Input cannot be null");
        }
        return Math.round(this.calculateJaccardSimilarity(left, right) * 100) / 100;
    }

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
    private calculateJaccardSimilarity(left:string,right:string) {
        let leftLength = left.length;
        let rightLength = right.length;
        if (leftLength == 0 || rightLength == 0) {
            return 0;
        }
        const leftSet = new Set<string>();
        for (let i = 0; i < leftLength; i++) {
            leftSet.add(left.charAt(i));
        }
        const rightSet = new Set<string>();
        for (let i = 0; i < rightLength; i++) {
            rightSet.add(right.charAt(i));
        }
        const unionSet = new Set<string>(leftSet);
        rightSet.forEach((v)=>{
            unionSet.add(v);
        });
        const intersectionSize = leftSet.size + rightSet.size - unionSet.size;
        return 1.0 * intersectionSize / unionSet.size;
    }
}
