from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .services import generate_ai_recommendations

class RecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        result = generate_ai_recommendations(request.user)
        return Response(result)
