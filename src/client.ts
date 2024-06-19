import { ApiError } from './error.js';
import { FavoriteStatus, FavoriteStatusBody, Image, ImageReport, Images, Tag, Tags } from './models.js';
import { SearchQuery, formatQuery } from './query.js';
import camelcaseKeys from 'camelcase-keys';

/**
 * Options for instantiating a client.
 */
export interface WaifuClientOptions {
    /**
     * Optional token used for authentication.
     */
    token?: string;

    /**
     * Optional user agent override so the server can identify your application.
     */
    userAgent?: string;
}

/**
 * WaifuClient is the main class used to interact with the Waifu.im API.
 */
export class WaifuClient {
    /**
     * The token used for authentication, if provided.
     */
    public token?: string;

    /**
     * The User-Agent used in requests.
     */
    public userAgent: string;

    public constructor(options?: WaifuClientOptions) {
        this.token = options?.token;
        this.userAgent = options?.userAgent ?? 'https://github.com/ravener/waifuim.js';
    }

    async #request<T>(endpoint: string, body?: unknown): Promise<T> {
        const headers = new Headers({
            'User-Agent': this.userAgent,
            'Accept-Version': 'v6'
        });

        if (this.token) {
            headers.append('Authorization', `Bearer ${this.token}`);
        }

        if (body) {
            headers.append('Content-Type', 'application/json');
        }

        const response = await fetch(`https://api.waifu.im/${endpoint}`, {
            headers,
            method: body ? 'POST' : 'GET',
            body: body ? JSON.stringify(body) : undefined
        });

        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(response, data.detail);
        }

        return camelcaseKeys(data, { deep: true });
    }

    /**
     * Search images.
     * Retrieves images randomly or by tag based on the specified search criteria.
     *
     * @param query Search query options.
     * @returns Array of images.
     */
    public async search(query?: SearchQuery): Promise<Image[]> {
        if (query?.full && !this.token) {
            throw new Error("Option 'full' requires a token with admin permissions.");
        }

        if (query?.limit && query?.limit > 30 && !this.token) {
            throw new Error("Option 'limit' cannot be greater than 30 without a token with admin permissions.");
        }

        const params = query ? `?${formatQuery(query)}` : '';
        const { images } = await this.#request<Images>(`search${params}`);
        return images;
    }

    /**
     * Get full tag information.
     */
    public getTags(full: true): Promise<Tags<Tag>>;

    /**
     * Get list of available tags.
     */
    public getTags(full: false): Promise<Tags<string>>;

    /**
     * Gets the list of available tags.
     * @param full Whether to return full tag information.
     */
    public getTags(full: boolean): Promise<Tags<string> | Tags<Tag>>;

    public getTags(full: boolean): Promise<Tags<string> | Tags<Tag>> {
        const params = full ? '?full=true' : '';
        return this.#request(`tags${params}`);
    }

    /**
     * Get your favorites.
     * By default, this endpoint returns all images in the user favorites,
     * meaning it will also returns lewd images if there are some in the user favorites.
     *
     * @param query Search query options.
     * @returns Array of images.
     */
    public async getFavorites(query?: SearchQuery, userId?: number): Promise<Image[]> {
        if (!this.token) {
            throw new Error('A token must be provided to use this endpoint.');
        }

        const params = query ? `?${formatQuery(query, userId)}` : '';
        const { images } = await this.#request<Images>(`fav${params}`);
        return images;
    }

    /**
     * Inserts an image into the user
     *
     * @param image_id The ID of the image to insert.
     * @param user_id The user ID of the user whose favorites you want to edit. Defaults to token's owner.
     */
    public async insertFavorite(image_id: number, user_id?: number): Promise<FavoriteStatus> {
        if (!this.token) {
            throw new Error('A token must be provided to use this endpoint.');
        }

        const { state } = await this.#request<FavoriteStatusBody>('fav/insert', { image_id, user_id });
        return state;
    }

    /**
     * Removes an image from the user
     * @param image_id The ID of the image to insert.
     * @param user_id The user ID of the user whose favorites you want to edit. Defaults to token's owner.
     */
    public async deleteFavorite(image_id: number, user_id?: number): Promise<FavoriteStatus> {
        if (!this.token) {
            throw new Error('A token must be provided to use this endpoint.');
        }

        const { state } = await this.#request<FavoriteStatusBody>('fav/delete', { image_id, user_id });
        return state;
    }

    /**
     * Toggles an image in the user
     *
     * @param image_id The ID of the image to insert.
     * @param user_id The user ID of the user whose favorites you want to edit. Defaults to token's owner.
     */
    public async toggleFavorite(image_id: number, user_id?: number): Promise<FavoriteStatus> {
        if (!this.token) {
            throw new Error('A token must be provided to use this endpoint.');
        }

        const { state } = await this.#request<FavoriteStatusBody>('fav/toggle', { image_id, user_id });
        return state;
    }

    /**
     * Reports an image.
     * Used to report any inappropriate, offensive or wrongly labelled image in the API.
     * Requires report permission.
     *
     * @param image_id The ID of the image to report.
     * @param description A brief explanation (up to 200 characters) used to describe the issue.
     */
    public async reportImage(image_id: number, description: string): Promise<ImageReport> {
        if (!this.token) {
            throw new Error('A token must be provided to use this endpoint.');
        }

        return this.#request('report', { image_id, description });
    }
}
