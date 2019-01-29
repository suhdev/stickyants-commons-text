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
export class LevenshteinResults {
    /**
     * Edit distance.
     */
    private distance:number;
    /**
     * Insert character count.
     */
    private insertCount:number;
    /**
     * Delete character count.
     */
    private deleteCount:number;
    /**
     * Substitute character count.
     */
    private substituteCount:number;

    /**
     * Create the results for a detailed Levenshtein distance.
     *
     * @param distance distance between two character sequences.
     * @param insertCount insert character count
     * @param deleteCount delete character count
     * @param substituteCount substitute character count
     */
    public constructor(distance:number, 
            insertCount:number, 
            deleteCount:number,
            substituteCount:number) {
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
    public getDistance():number {
        return this.distance;
    }

    /**
     * Get the number of insertion needed to change one character sequence into another.
     *
     * @return insert character count
     */
    public getInsertCount():number {
        return this.insertCount;
    }

    /**
     * Get the number of character deletion needed to change one character sequence to other.
     *
     * @return delete character count
     */
    public getDeleteCount():number {
        return this.deleteCount;
    }

    /**
     * Get the number of character substitution needed to change one character sequence into another.
     *
     * @return substitute character count
     */
    public getSubstituteCount():number {
        return this.substituteCount;
    }

    public equals(o:LevenshteinResults) {
        if (this == o) {
            return true;
        }
        return o.distance === this.distance &&
            o.insertCount === this.insertCount && 
            o.deleteCount === this.deleteCount &&
            o.substituteCount === this.substituteCount;
    }

    toString():string {
        return "Distance: " + this.distance + ", Insert: " + this.insertCount 
            + ", Delete: " + this.deleteCount + ", Substitute: "
            + this.substituteCount;
    }
}
