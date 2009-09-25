from django import forms
import os.path

VALID_FILETYPES = (
    ".jpg", ".png", ".gif"
)

class UploadScreenshotForm(forms.Form):
    description = forms.CharField(max_length=50, required=False)
    file = forms.FileField()

    def is_valid(self):
        is_valid_filetype = False
        if self.files:
            is_valid_filetype = os.path.splitext(self.files['file'].name)[1].lower() in VALID_FILETYPES
        return super(UploadScreenshotForm, self).is_valid() and is_valid_filetype
        

