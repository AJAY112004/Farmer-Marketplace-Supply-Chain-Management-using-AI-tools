from django.apps import AppConfig

class CartConfig(AppConfig):
    name = 'cart'

    def ready(self):
        import cart.models
        import cart.tests
        import cart.views
        import cart.serializers
        import cart.urls