export default class Exception extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }

    getCode() {
        return this.code;
    }
}