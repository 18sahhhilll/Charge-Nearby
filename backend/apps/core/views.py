from django.db import connection
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

class HealthCheckView(APIView):
    """
    Health check endpoint returning system status without leaking secrets.
    Specification Section 17 & 18.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        db_status = "healthy"
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                row = cursor.fetchone()
                if not row or row[0] != 1:
                    db_status = "unhealthy"
        except Exception as e:
            db_status = f"unreachable ({type(e).__name__})"

        is_healthy = db_status == "healthy"
        payload = {
            "status": "healthy" if is_healthy else "degraded",
            "service": "ChargeNearby API",
            "version": "1.0.0",
            "database": db_status,
            "pilot_city": "Pune, Maharashtra, India",
            "timestamp": timezone.now().isoformat()
        }

        return Response(
            payload,
            status=status.HTTP_200_OK if is_healthy else status.HTTP_503_SERVICE_UNAVAILABLE
        )
