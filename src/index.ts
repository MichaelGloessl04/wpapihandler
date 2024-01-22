import { WPApiHandler } from "./wpapihandler";
import { Headers, Post} from "./types/types";
import { AuthenticationError, PostNotFoundError } from "./errors/error";


export {
    WPApiHandler,
    Post,
    Headers,
    AuthenticationError,
    PostNotFoundError
}