function cookieParser(req, res, next) {
    req.cookies = {}

    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) {
        return next();
    }

    cookieHeader.split(";").forEach(cookie => {
        cookie = cookie.trim();

        const separator = cookie.indexOf('=');
        if (separator === -1) {
            return;
        }

        const name = cookie.slice(0, separator);
        const value = cookie.slice(separator + 1);

        req.cookies[name] = value;
    })
    next();
}

module.exports = cookieParser