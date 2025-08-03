# modal_app.py

import modal

app = modal.App("policypal-fastapi")

image = (
    modal.Image.debian_slim()
    .pip_install("fastapi", "uvicorn", "transformers", "torch", "PyPDF2")
)

@app.function(image=image, gpu="any", timeout=600)
@modal.asgi_app()
def fastapi_app():
    from main import app
    return app
