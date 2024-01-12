export type Post = {
    id: number;
    title: string;
    content: string;
    status: string;
    [key: string]: any;
};

export type Headers = {
    'Content-Type': string;
    Authorization: string;
    [key: string]: string;
};
