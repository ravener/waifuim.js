export type FavoriteStatus = 'INSERTED' | 'DELETED';

export interface FavoriteStatusBody {
    state: FavoriteStatus;
}

export interface Tags<T> {
    versatile: T[];
    nsfw: T[];
}

/**
 * Represents an image.
 */
export interface Image {
    artist: Artist | null;
    byteSize: number;
    dominantColor: string;
    extension: string;
    favorites: number;
    height: number;
    imageId: number;
    isNsfw: boolean;
    likedAt: string | null;
    previewUrl: string;
    signature: string;
    source: string | null;
    tags: Tag[];
    uploadedAt: string;
    url: string;
    width: number;
}

export interface Images {
    images: Image[];
}

/**
 * Represents an artist for an image including their social links.
 */
export interface Artist {
    artistId: number;
    deviantArt: string | null;
    name: string;
    patreon: string | null;
    pixiv: string | null;
    twitter: string | null;
}

/**
 * Represents a tag.
 */
export interface Tag {
    description: string;
    isNsfw: boolean;
    name: string;
    tagId: number;
}

/**
 * Represents a reported image's information.
 */
export interface ImageReport {
    authorId: string;
    description: string;
    existed: boolean;
    imageId: number;
}
