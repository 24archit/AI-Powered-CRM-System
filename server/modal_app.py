import modal
import os
from main import app

# Create a Modal App
stub = modal.Stub("crm-api-monolith")

# Define the image with all dependencies
image = modal.Image.debian_slim().pip_install_from_requirements("requirements.txt")

@stub.function(image=image)
@modal.asgi_app()
def fastapi_app():
    return app
