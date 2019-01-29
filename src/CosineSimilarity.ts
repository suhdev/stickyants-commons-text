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
export class CosineSimilarity {

    /**
     * Calculates the cosine similarity for two given vectors.
     *
     * @param leftVector left vector
     * @param rightVector right vector
     * @return cosine similarity between the two vectors
     */
    public cosineSimilarity(leftVector:Map<string,number>,
        rightVector:Map<string, number>) {
        if (leftVector == null || rightVector == null) {
            throw new Error("Vectors must not be null");
        }

        const intersection = this.getIntersection(leftVector, rightVector);

        const dotProduct = this.dot(leftVector, rightVector, intersection);
        let d1 = 0.0;
        leftVector.forEach((value,k)=>{
            d1 += Math.pow(value, 2);
        });
        let d2 = 0.0;
        rightVector.forEach((value,k)=>{
            d2 += Math.pow(value, 2);
        });
        let cosineSimilarity:number;
        if (d1 <= 0.0 || d2 <= 0.0) {
            cosineSimilarity = 0.0;
        } else {
            cosineSimilarity = dotProduct / (Math.sqrt(d1) * Math.sqrt(d2));
        }
        return cosineSimilarity;
    }

    /**
     * Returns a set with strings common to the two given maps.
     *
     * @param leftVector left vector map
     * @param rightVector right vector map
     * @return common strings
     */
    private getIntersection(leftVector:Map<string,number>,
            rightVector:Map<string,number>):Set<string> {
        const intersection = new Set<string>(leftVector.keys());
        intersection.forEach((value,key)=>{
            if (!rightVector.has(key)){
                intersection.delete(key); 
            }
        });
        return intersection;
    }

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
    private dot(leftVector:Map<string,number>, 
            rightVector:Map<string,number>,
            intersection:Set<string>) {
        let dotProduct = 0;
        intersection.forEach((value,key)=>{
            dotProduct += leftVector.get(key) * rightVector.get(key);
        });
        return dotProduct;
    }

}
