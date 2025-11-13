from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Shipment
from .serializers import ShipmentSerializer
import random
import string


def generate_tracking_number():
    """Generate a random tracking number"""
    prefix = "TRK"
    unique = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return f"{prefix}{unique}"


@api_view(['GET'])
def list_shipments(request):
    shipments = Shipment.objects.all().order_by('-created_at')
    serializer = ShipmentSerializer(shipments, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_shipment(request):
    data = request.data
    data['tracking_number'] = generate_tracking_number()

    serializer = ShipmentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def track_shipment(request, tracking_number):
    try:
        shipment = Shipment.objects.get(tracking_number=tracking_number)
        serializer = ShipmentSerializer(shipment)
        return Response(serializer.data)
    except Shipment.DoesNotExist:
        return Response({'error': 'Shipment not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PATCH'])
def update_shipment_status(request, tracking_number):
    try:
        shipment = Shipment.objects.get(tracking_number=tracking_number)
    except Shipment.DoesNotExist:
        return Response({'error': 'Shipment not found'}, status=status.HTTP_404_NOT_FOUND)

    shipment.status = request.data.get('status', shipment.status)
    shipment.save()
    return Response({'message': 'Status updated successfully'})
