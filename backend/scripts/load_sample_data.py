"""
Script to load full sample data for AgendaCulturalCostaRica.
Run with: python manage.py runscript load_sample_data

Populates all major models in dependency order for easy testing and development.
"""

from events.models import (
    Category, Currency, UserRole, Organization, User,
    Event, UserEvent, AccessibilityFeature, EventAccessibilityFeature, Comment
)
from django.utils import timezone
from datetime import timedelta

def run():
    """
    Load sample data into all core tables in the correct dependency order.
    This script assumes a fresh database or that no duplicate entries exist.
    """

    # --- 1. User Roles ---
    admin_role, _ = UserRole.objects.get_or_create(
        name="Administrador",
        defaults={"description": "Usuario con permisos totales"}
    )
    visitor_role, _ = UserRole.objects.get_or_create(
        name="Visitante",
        defaults={"description": "Usuario visitante que puede explorar y comentar eventos"}
    )

    # --- 2. Currencies ---
    crc, _ = Currency.objects.get_or_create(name="CRC")
    usd, _ = Currency.objects.get_or_create(name="USD")

    # --- 3. Organizations ---
    org_cenfotec, _ = Organization.objects.get_or_create(
        name="CENFOTEC",
        defaults={"phone": "2222-1111", "email": "info@cenfotec.ac.cr"}
    )
    org_museo, _ = Organization.objects.get_or_create(
        name="Museo Nacional",
        defaults={"phone": "2223-4455", "email": "info@museocostarica.go.cr"}
    )

    # --- 4. Users ---
    admin_user, _ = User.objects.get_or_create(
        email="admin@agendacultural.cr",
        defaults={
            "name": "Ana",  # antes "first_name"
            "last_name": "Gómez",
            "password_hash": "hashadmin123",
            "role": admin_role,
            "organization": org_cenfotec,
            "is_event_organizer": False,
        }
    )
    
    visitor_user, _ = User.objects.get_or_create(
        email="visitante@agendacultural.cr",
        defaults={
            "name": "Luis",  # antes "first_name"
            "last_name": "Pérez",
            "password_hash": "hashvisitante123",
            "role": visitor_role,
            "organization": org_museo,
            "is_event_organizer": True,
        }
    )

    # --- 5. Categories ---
    categorias = [
        {"name": "Música", "description": "Eventos musicales y conciertos."},
        {"name": "Teatro", "description": "Obras teatrales y representaciones escénicas."},
        {"name": "Arte", "description": "Exposiciones y actividades artísticas."}
    ]
    category_objs = []
    for cat in categorias:
        obj, _ = Category.objects.get_or_create(
            name=cat["name"],
            defaults={"description": cat["description"]}
        )
        category_objs.append(obj)

    # --- 6. Accessibility Features ---
    acc1, _ = AccessibilityFeature.objects.get_or_create(
        name="Acceso silla de ruedas",
        defaults={"description": "Espacio accesible para personas en silla de ruedas.", "image": None}
    )
    acc2, _ = AccessibilityFeature.objects.get_or_create(
        name="Interpretación en lengua de señas",
        defaults={"description": "Se ofrece interpretación en LESCO.", "image": None}
    )

    # --- 7. Events ---
    now = timezone.now()
    evento1, _ = Event.objects.get_or_create(
        name="Concierto Sinfónico",
        defaults={
            "description": "Gran concierto sinfónico en el Teatro Nacional.",
            "start_datetime": now + timedelta(days=5),
            "end_datetime": now + timedelta(days=5, hours=2),
            "price": 15000.00,
            "currency": crc,
            "ticket_link": "https://boleteria.teatronacional.go.cr/concierto",
            "contact_email": "contacto@teatronacional.go.cr",
            "contact_phone": "2221-1234",
            "address": "Teatro Nacional, San José",
            "map_location": "9.93333,-84.08333",
            "event_banner": None,
            "created_by": visitor_user,
            "is_event_approved": True,
            "last_request_change_reason": None,
            "delete_reason": None,
            "is_event_active": True,
            "approved_by": admin_user,
            "category": category_objs[0],
        }
    )

    # --- 8. Link Event and Accessibility Features ---
    EventAccessibilityFeature.objects.get_or_create(
        event=evento1, accessibility_feature=acc1
    )
    EventAccessibilityFeature.objects.get_or_create(
        event=evento1, accessibility_feature=acc2
    )

    # --- 9. User Events (Favorites/Agenda) ---
    UserEvent.objects.get_or_create(
        user=visitor_user, event=evento1
    )

    # --- 10. Comments ---
    Comment.objects.get_or_create(
        user=visitor_user,
        event=evento1,
        comment="¡Excelente evento, la acústica fue increíble!",
    )
    Comment.objects.get_or_create(
        user=admin_user,
        event=evento1,
        comment="¡Gracias por tu comentario, nos alegra que lo hayas disfrutado!",
    )

    print("Full sample data loaded (roles, orgs, users, categories, events, features, comments, etc.)")