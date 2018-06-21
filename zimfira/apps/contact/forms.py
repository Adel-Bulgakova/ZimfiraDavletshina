from django import forms

from .models import Contact


class ContactForm(forms.ModelForm):
    # recd = forms.DateTimeField('Date of receipt')
    # author_name = forms.CharField(widget=forms.TextInput(), required=True)
    # email = forms.EmailField(widget=forms.TextInput(), required=True)
    # message = forms.CharField(widget=forms.TextInput(), required=True)

    class Meta:
        model = Contact
        fields = ('email', 'message',)
