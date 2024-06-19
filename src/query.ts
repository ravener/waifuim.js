/**
 * Image ordering criterias.
 */
export type ImageOrder = 'FAVORITES' | 'UPLOADED_AT' | 'LIKED_AT' | 'RANDOM';

/**
 * Image orientations.
 */
export type ImageOrientation = 'RANDOM' | 'LANDSCAPE' | 'PORTRAIT';

/**
 * Represents the query options used for searching.
 */
export interface SearchQuery {
    /**
     * Force the API to return images with at least all the provided tags.
     */
    includedTags?: string | string[];

    /**
     * Force the API to return images without any of the provided tags.
     */
    excludedTags?: string | string[];

    /**
     * Force the API to provide only the specified file IDs or signatures.
     */
    includedFiles?: string | string[];

    /**
     * Force the API to not list the specified file IDs or signatures.
     */
    excludedFiles?: string | string[];

    /**
     * Force or exclude lewd files (only works if included_tags only contain versatile tags and no nsfw only tag).
     * You can provide 'null' to make it random.
     */
    isNsfw?: boolean;

    /**
     * Force or prevent the API to return .gif files.
     */
    gif?: boolean;

    /**
     * Ordering criteria for the images.
     */
    orderBy?: ImageOrder;

    /**
     * Image orientation criteria.
     */
    orientation?: ImageOrientation;

    /**
     * Return an array of the number provided.
     * A value greater than 30 requires admin permissions.
     * Default is 1.
     */
    limit?: number;

    /**
     * Returns the full result without any limit (admins only).
     */
    full?: boolean;

    /**
     * Filter images by width (in pixels). Accepted operators: <=, >=, >, <, !=, =
     */
    width?: string;

    /**
     * Filter images by height (in pixels). Accepted operators: <=, >=, >, <, !=, =
     */
    height?: string;

    /**
     * Filter images by byte size. Accepted operators: <=, >=, >, <, !=, =
     */
    byteSize?: string;
}

function appendMaybeArray(params: URLSearchParams, key: string, value: string | string[]) {
    if (Array.isArray(value)) {
        value.forEach((value) => params.append(key, value));
    } else {
        params.append(key, value);
    }
}

export function formatQuery(query: SearchQuery, userId?: number): string {
    const params = new URLSearchParams();

    // Optional User ID for endpoints that may need it.
    if (userId) params.append('user_id', userId.toString());

    // Parameters that can be an array.
    if (query.includedTags) appendMaybeArray(params, 'included_tags', query.includedTags);
    if (query.excludedTags) appendMaybeArray(params, 'excluded_tags', query.excludedTags);
    if (query.includedFiles) appendMaybeArray(params, 'included_files', query.includedFiles);
    if (query.excludedFiles) appendMaybeArray(params, 'excluded_files', query.excludedFiles);

    // Simple string values.
    if (query.orderBy) params.append('order_by', query.orderBy);
    if (query.orientation) params.append('orientation', query.orientation);
    if (query.width) params.append('width', query.width);
    if (query.height) params.append('height', query.height);
    if (query.byteSize) params.append('byte_size', query.byteSize);

    if (typeof query.isNsfw !== 'undefined') {
        params.append('is_nsfw', query.isNsfw ? 'true' : 'false');
    }

    if (typeof query.gif !== 'undefined') {
        params.append('gif', query.gif ? 'true' : 'false');
    }

    if (typeof query.limit !== 'undefined') {
        params.append('limit', query.limit.toString());
    }

    if (typeof query.full !== 'undefined') {
        params.append('full', query.full ? 'true' : 'false');
    }

    return params.toString();
}
