import crypto from "crypto";


export function HashToken(token: string) {
    const hash = crypto.createHash("sha256");
    hash.update(token);
    return hash.digest("hex");
}