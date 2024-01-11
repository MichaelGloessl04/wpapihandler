export interface WPResponse {
    status: number;
    data?: Array<Post> | Post | any;
    error?: Error;
};

export interface Post {
    title: string;
    content: string;
    status: string;
    [key: string]: any;
};

export interface Headers {
    'Content-Type': string;
    Authorization: string;
    [key: string]: string;
};
