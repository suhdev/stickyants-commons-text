import { SimilarityScore } from "./SimilarityScore";

export interface EditDistance<R> extends SimilarityScore<R> {

    /**
     * Compares two CharSequences.
     *
     * @param left the first CharSequence
     * @param right the second CharSequence
     * @return the similarity score between two CharSequences
     */
    apply(left:string, right:string):R;

}
