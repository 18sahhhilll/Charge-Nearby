import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Standard error format required by ChargeNearby specification Section 8:
    {
      "error": {
        "code": "ERROR_CODE",
        "message": "Human readable description.",
        "details": {}
      }
    }
    """
    response = exception_handler(exc, context)

    if response is not None:
        error_code = getattr(exc, 'default_code', 'ERROR').upper()
        if hasattr(exc, 'get_codes'):
            codes = exc.get_codes()
            if isinstance(codes, str):
                error_code = codes.upper()
        
        # Determine status code message
        message = "An error occurred."
        details = response.data

        if isinstance(response.data, dict):
            if "detail" in response.data:
                message = str(response.data["detail"])
                details = {k: v for k, v in response.data.items() if k != "detail"}
            else:
                # Field errors
                message = "Validation error occurred."
        elif isinstance(response.data, list):
            message = "; ".join([str(item) for item in response.data])
            details = {"errors": response.data}

        # Map standard HTTP statuses to domain codes if generic
        if response.status_code == 401:
            error_code = "UNAUTHENTICATED"
        elif response.status_code == 403:
            error_code = "FORBIDDEN"
        elif response.status_code == 404:
            error_code = "NOT_FOUND"
        elif response.status_code == 409:
            error_code = "CONFLICT"

        response.data = {
            "error": {
                "code": error_code,
                "message": message,
                "details": details
            }
        }
    else:
        logger.exception("Unhandled server exception: %s", exc)
        response = Response(
            {
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "An internal server error occurred.",
                    "details": {}
                }
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response
