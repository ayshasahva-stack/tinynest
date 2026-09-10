function sendSuccessResponse(res, statusCode, data, message = "success") {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}
export default sendSuccessResponse;