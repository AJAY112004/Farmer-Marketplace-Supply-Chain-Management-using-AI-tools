from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from typing import Any, Dict
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)  # type: ignore
    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)  # type: ignore
    serializer = CartItemSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data: Dict[str, Any] = serializer.validated_data  # type: ignore
    product_name = data.get('product_name')

    if not product_name:
        return Response({'error': 'Product name is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if item already exists
    existing_item = cart.items.filter(product_name=product_name).first()

    if existing_item:
        existing_item.quantity += data.get('quantity', 1)
        # Recalculate total cost
        existing_item.total_cost = cart.calculate_item_cost(
            existing_item.price,
            existing_item.quantity,
            existing_item.weight_kg,
            existing_item.distance_km
        )
        existing_item.save()
    else:
        # Create new cart item
        quantity = data.get('quantity', 1)
        CartItem.objects.create(  # type: ignore
            cart=cart,
            product_name=data['product_name'],
            price=data['price'],
            quantity=quantity,
            weight_kg=data.get('weight_kg'),
            distance_km=data.get('distance_km'),
            total_cost=cart.calculate_item_cost(
                data['price'],
                quantity,
                data.get('weight_kg'),
                data.get('distance_km')
            )
        )

    return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, product_name):
    try:
        cart = Cart.objects.get(user=request.user)  # type: ignore
    except Cart.DoesNotExist:  # type: ignore
        return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)

    cart.items.filter(product_name=product_name).delete()
    return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_cart_item(request, product_name):
    try:
        cart = Cart.objects.get(user=request.user)  # type: ignore
    except Cart.DoesNotExist:  # type: ignore
        return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)

    quantity = request.data.get('quantity')
    if quantity is None or not isinstance(quantity, int) or quantity < 1:
        return Response({'error': 'Invalid quantity'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        item = cart.items.get(product_name=product_name)
        item.quantity = quantity
        item.total_cost = cart.calculate_item_cost(
            item.price,
            quantity,
            item.weight_kg,
            item.distance_km
        )
        item.save()
    except CartItem.DoesNotExist:  # type: ignore
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    try:
        cart = Cart.objects.get(user=request.user)  # type: ignore
        cart.items.all().delete()
        return Response({'message': 'Cart cleared successfully'}, status=status.HTTP_200_OK)
    except Cart.DoesNotExist:  # type: ignore
        return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
