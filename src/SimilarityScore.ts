/**
 * Interface for the concept of a string similarity score.
 *
 * <p>
 * A string similarity score is intended to have <i>some</i> of the properties of a metric, yet
 * allowing for exceptions, namely the Jaro-Winkler similarity score.
 * </p>
 * <p>
 * We Define a SimilarityScore to be a function <code>d: [X * X] -&gt; [0, INFINITY)</code> with the
 * following properties:
 * </p>
 * <ul>
 *     <li><code>d(x,y) &gt;= 0</code>, non-negativity or separation axiom</li>
 *     <li><code>d(x,y) == d(y,x)</code>, symmetry.</li>
 * </ul>
 *
 * <p>
 * Notice, these are two of the properties that contribute to d being a metric.
 * </p>
 *
 *
 * <p>
 * Further, this intended to be BiFunction&lt;CharSequence, CharSequence, R&gt;.
 * The <code>apply</code> method
 * accepts a pair of {@link CharSequence} parameters
 * and returns an <code>R</code> type similarity score. We have omitted the explicit
 * statement of extending BiFunction due to it only being implemented in Java 1.8, and we
 * wish to maintain Java 1.7 compatibility.
 * </p>
 *
 * @param <R> The type of similarity score unit used by this EditDistance.
 * @since 1.0
 */
export interface SimilarityScore<R> {

    /**
     * Compares two CharSequences.
     *
     * @param left the first CharSequence
     * @param right the second CharSequence
     * @return the similarity score between two CharSequences
     */
    apply(left:string,right:string):R;

}
