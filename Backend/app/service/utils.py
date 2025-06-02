import os

from fastapi import UploadFile


class ImageSaver:
    def __init__(self, folder: str = "app/static/uploads"):
        self.folder = folder
        os.makedirs(self.folder, exist_ok=True)

    async def save_image(self, image: UploadFile) -> str:
        file_location = os.path.join(self.folder, image.filename)
        contents = await image.read()
        with open(file_location, "wb") as f:
            f.write(contents)
        return file_location
