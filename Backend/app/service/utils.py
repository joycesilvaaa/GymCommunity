import os
import uuid
from fastapi import UploadFile

class ImageSaver:
    def __init__(self, folder: str = "app/static/uploads"):
        self.folder = folder
        os.makedirs(self.folder, exist_ok=True)
        self._base_url = "http://10.0.2.2:8000/user/image/"
    
    async def save_image(self, image: UploadFile) -> str:
        # Gera um nome único para evitar sobrescrever arquivos existentes
        unique_filename = f"{uuid.uuid4().hex}_{image.filename}"
        
        # Salva o arquivo fisicamente
        file_location = os.path.join(self.folder, unique_filename)
        contents = await image.read()
        with open(file_location, "wb") as f:
            f.write(contents)
            
        # Retorna a URL completa que o Expo pode acessar
        return f"{self._base_url}{unique_filename}"