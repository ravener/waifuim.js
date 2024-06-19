/**
 * Represents an error response from the API when the status code is not 200.
 */
export class ApiError extends Error {
    /**
     * The original response object.
     */
    public response: Response;

    /**
     * Constructs an error from the given response and reason.
     * @param response The original response
     * @param detail The error message from the API.
     */
    public constructor(response: Response, detail: string) {
        super(detail);
        this.response = response;
    }

    /**
     * Get the status code of this error.
     */
    get status(): number {
        return this.response.status;
    }

    /**
     * Get the status message of this error.
     */
    get statusText(): string {
        return this.response.statusText;
    }
}
