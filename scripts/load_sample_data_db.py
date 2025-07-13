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

    # --- 2. Organizations ---
    org_cenfotec, _ = Organization.objects.get_or_create(
        name="CENFOTEC",
        defaults={"phone": "2222-1111", "email": "info@cenfotec.ac.cr"}
    )
    org_museo, _ = Organization.objects.get_or_create(
        name="Museo Nacional",
        defaults={"phone": "2223-4455", "email": "info@museocostarica.go.cr"}
    )

    # --- 3. Users ---
    admin_user, _ = User.objects.get_or_create(
        email="admin@agendacultural.cr",
        defaults={
            "name": "Ana",
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
            "name": "Luis",
            "last_name": "Pérez",
            "password_hash": "hashvisitante123",
            "role": visitor_role,
            "organization": org_museo,
            "is_event_organizer": True,
        }
    )
    
    visitor2_user, _ = User.objects.get_or_create(
        email="visitante2@agendacultural.cr",
        defaults={
            "name": "María",
            "last_name": "Fernández",
            "password_hash": "hashvisitante2123",
            "role": visitor_role,
            "organization": org_museo,
            "is_event_organizer": True,
        }
    )

    # --- 4. Currencies ---
    usd, _ = Currency.objects.get_or_create(name="USD")
    crc, _ = Currency.objects.get_or_create(name="CRC")

    # --- 5. Categories ---
    categories_data = [
        {"name": "Música", "description": "Eventos musicales y conciertos."},
        {"name": "Danza", "description": "Presentaciones de danza y ballet."},
        {"name": "Teatro", "description": "Obras teatrales y representaciones escénicas."},
        {"name": "Cine", "description": "Proyecciones y festivales de cine."}
    ]
    category_objs = []
    for cat in categories_data:
        obj, _ = Category.objects.get_or_create(
            name=cat["name"],
            defaults={
                "description": cat["description"],
                "image_path": None,
            }
        )
        category_objs.append(obj)

    # --- 6. Accessibility Features ---
    acc_wheelchair, _ = AccessibilityFeature.objects.get_or_create(
        name="Acceso para silla de ruedas",
        defaults={"description": "Espacio accesible para personas en silla de ruedas."}
    )
    acc_hearing, _ = AccessibilityFeature.objects.get_or_create(
        name="Asistencia auditiva",
        defaults={"description": "Soporte para personas con dificultades auditivas."}
    )

    # --- 7. Events ---
    now = timezone.now()
    event_rock, _ = Event.objects.get_or_create(
        name="Concierto de Rock",
        defaults={
            "description": "Concierto de rock en el parque central.",
            "start_datetime": now + timedelta(days=7),
            "end_datetime": now + timedelta(days=7, hours=4),
            "price": 20000.00,
            "currency": crc,
            "ticket_link": "https://tickets.rockconcert.cr",
            "contact_email": "contacto@rockconcert.cr",
            "contact_phone": "2225-6789",
            "address": "Parque Central, San José",
            "map_location": "9.93333,-84.08333",
            "event_banner_path": None,
            "created_by": visitor_user,
            "is_event_approved": True,
            "last_request_change_reason": None,
            "delete_reason": None,
            "is_event_active": True,
            "approved_by": admin_user,
            "category": category_objs[0],  # Música
        }
    )

    event_cine, _ = Event.objects.get_or_create(
        name="Festival de Cine Latinoamericano",
        defaults={
            "description": "Festival anual de cine latinoamericano.",
            "start_datetime": now + timedelta(days=15),
            "end_datetime": now + timedelta(days=18),
            "price": 10000.00,
            "currency": usd,
            "ticket_link": "https://festivalcine.lat",
            "contact_email": "info@festivalcine.lat",
            "contact_phone": "2226-7890",
            "address": "Cine Teatro, San José",
            "map_location": "9.93333,-84.08333",
            "event_banner_path": None,
            "created_by": visitor2_user,
            "is_event_approved": False,
            "last_request_change_reason": None,
            "delete_reason": None,
            "is_event_active": True,
            "approved_by": None,
            "category": category_objs[3],  # Cine
        }
    )

    # --- 8. Link Event and Accessibility Features ---
    EventAccessibilityFeature.objects.get_or_create(
        event=event_rock, accessibility_feature=acc_wheelchair
    )
    EventAccessibilityFeature.objects.get_or_create(
        event=event_cine, accessibility_feature=acc_hearing
    )

    # --- 9. User Events (Favorites/Agenda) ---
    UserEvent.objects.get_or_create(user=visitor_user, event=event_rock)
    UserEvent.objects.get_or_create(user=visitor2_user, event=event_cine)

    # --- 10. Comments ---
    Comment.objects.get_or_create(
        user=visitor_user,
        event=event_rock,
        comment="¡Me encantó el concierto, la energía fue increíble!",
        image_path=None,
    )
    Comment.objects.get_or_create(
        user=visitor_user,
        event=event_cine,
        comment="Espero que el festival sea todo un éxito.",
        image_path=None,
    )

    print("Full sample data loaded (roles, orgs, users, categories, events, features, comments, etc.)")