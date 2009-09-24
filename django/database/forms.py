from django import forms

class UploadScreenshotForm(forms.Form):
    description = forms.CharField(max_length=50)
    file = forms.FileField()

