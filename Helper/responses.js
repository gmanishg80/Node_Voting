// responses.js

module.exports = {
    success: function(res, data, message) {
        if (message === undefined) {
            message = "Operation successful";
        }
        return res.status(200).json({
            status: 'success',
            message: message,
            data: data
        });
    },

    created: function(res, data, message) {
        if (message === undefined) {
            message = "Resource created successfully";
        }
        return res.status(201).json({
            status: 'success',
            message: message,
            data: data
        });
    },

    badRequest: function(res, message) {
        if (message === undefined) {
            message = "Bad request";
        }
        return res.status(400).json({
            status: 'error',
            message: message
        });
    },

    unauthorized: function(res, message) {
        if (message === undefined) {
            message = "Unauthorized access";
        }
        return res.status(401).json({
            status: 'error',
            message: message
        });
    },

    forbidden: function(res, message) {
        if (message === undefined) {
            message = "Access forbidden";
        }
        return res.status(403).json({
            status: 'error',
            message: message
        });
    },

    notFound: function(res, message) {
        if (message === undefined) {
            message = "Resource not found";
        }
        return res.status(404).json({
            status: 'error',
            message: message
        });
    },

    serverError: function(res, message) {
        if (message === undefined) {
            message = "Internal server error";
        }
        return res.status(500).json({
            status: 'error',
            message: message
        });
    }
};
