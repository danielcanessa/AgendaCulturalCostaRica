from django_rest_passwordreset.signals import reset_password_token_created
from django.dispatch import receiver
from django.core.mail import send_mail

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    reset_link = f"http://localhost:8000/api/password-reset/confirm/{reset_password_token.key}"
    send_mail(
        subject="Password Reset Agenda Cultural",
        message=f"Utiliza este link para hacer resert de tu password: {reset_link}",
        from_email="no-reply@tusitio.com",
        recipient_list=[reset_password_token.user.email],
    )