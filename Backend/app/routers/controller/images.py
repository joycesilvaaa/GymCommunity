from app.modules.basic_response import BasicResponse
from fastapi.responses import FileResponse
import os
from pathlib import Path

class ImageController:
    async def get_image(self, image_url: str) -> FileResponse | None:
        # Remove the prefix from the URL to get the filename
        prefix = "http://10.0.2.2:8000/user/image/"
        if image_url.startswith(prefix):
            filename = image_url[len(prefix):]
        else:
            filename = image_url

        # Build the local file path
        image_path = Path("app/static/uploads") / filename

        # Verifica se o arquivo existe
        if not image_path.exists():
            return None
        
        # Retorna a imagem como resposta
        return FileResponse(
            path=image_path,
            media_type="image/jpeg",  # Ajuste o tipo de mídia conforme necessário
            filename=image_path.name
        )