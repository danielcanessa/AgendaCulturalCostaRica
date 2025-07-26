import sys
import os
import django
import requests
import base64

# Add the backend folder (where manage.py lives) to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "agendacultural.settings")

django.setup()

from events.models import UserRole

########### Expected Data ###########
expected_roles = [
   {
      "id": 1,
      "name": "Administrador",
      "description": "Administrator role with full permissions."
   },
   {
      "id": 2,
      "name": "Visitante",
      "description": "Standard visitor user."
   }
]

expected_login_data_admin = {
   "user":{      
      "name":"Alfonso",
      "last_name":"Brenes",
      "email":"alfonso_brenes@email.com",
      "phone":"1111-2222",
      "bio":"Soy el admin.",         
      "role":{
         "name":"Administrador",
         "description":"Administrator role with full permissions."
      },
   }
}

expected_login_data_visitante_ana = {
   "user":{
      "name":"Ana",
      "last_name":"Martínez",
      "email":"ana@email.com",
      "phone":"2222-3333",
      "bio":"Soy visitante y me encanta asistir a museos",
      "is_event_organizer":False,
      "role":{
         "name":"Visitante",
         "description":"Standard visitor user."
      },
      "organization":None
   }
}

expected_login_data_visitante_pedro = {
    "user":{
      "name":"Pedro",
      "last_name":"Muñoz",
      "email":"peter@email.com",
      "phone":"2222-3378",
      "bio":"Soy visitante y me encanta asistir a teatros.",
      "is_event_organizer":False,
      "role":{
         "name":"Visitante",
         "description":"Standard visitor user."
      },
      "organization":{
         "name":"Teatro Nacional",
         "phone":"2222-0000",
         "email":"contacto@teatro.cr"
      }
   }
}

expected_users_admin_get = [
   {    
      "name":"Alfonso",
      "last_name":"Brenes",
      "email":"alfonso_brenes@email.com",
      "phone":"1111-2222",
      "bio":"Soy el admin.",   
      "role":{
         "name":"Administrador",
         "description":"Administrator role with full permissions."
      },
      "organization":None
   },
   {      
      "name":"Ana",
      "last_name":"Martínez",
      "email":"ana@email.com",
      "phone":"2222-3333",
      "bio":"Soy visitante y me encanta asistir a museos",
      "is_event_organizer":False,
      "role":{        
         "name":"Visitante",
         "description":"Standard visitor user."
      },
      "organization":{       
         "name":"Museo Nacional",
         "phone":"2222-0000",
         "email":"contacto@museo.cr"
      }
   },
   {
      "name":"Pedro",
      "last_name":"Muñoz",
      "email":"peter@email.com",
      "phone":"2222-3378",
      "bio":"Soy visitante y me encanta asistir a teatros.",
      "is_event_organizer":False,
      "role":{
         "name":"Visitante",
         "description":"Standard visitor user."
      },
      "organization":{
         "name":"Teatro Nacional",
         "phone":"2222-0000",
         "email":"contacto@teatro.cr"
      }
   }
]

expected_categories = [
   {
      "name":"Danza",
      "description":"Eventos de danza y coreografía",
      "image_base64":"*"
   },
   {
      "name":"Teatro",
      "description":"Obras teatrales y actuaciones",
      "image_base64":"*"
   },
   {
      "name":"Música",
      "description":"Conciertos y presentaciones musicales",
      "image_base64":"*"
   }
]

user_admin_data = {
    "name": "Alfonso",
    "last_name": "Brenes",
    "email": "alfonso_brenes@email.com",
    "password": "Secret123!",
    "phone": "1111-2222",
    "bio": "Soy el admin.",
    "is_staff":True,
    # "role_id": None  # Will be set dynamically
}

user_visitante_ana_data = {
    "name": "Ana",
    "last_name": "Martínez",
    "email": "ana@email.com",
    "password": "SecurePass456!",
    "phone": "2222-3333",
    "bio": "Soy visitante y me encanta asistir a museos",
    "is_event_organizer": False,
    "organization_id": None,  # Puedes dejarlo así o asignar un ID válido si existe una organización
    "role_id": None  # Se asignará dinámicamente en el script
}

user_visitante_pedro_data = {
    "name": "Pedro",
    "last_name": "Muñoz",
    "email": "peter@email.com",
    "password": "SecurePasss!",
    "phone": "2222-3378",
    "bio": "Soy visitante y me encanta asistir a teatros.",
    "is_event_organizer": False,
    "organization_id": None,  # Puedes dejarlo así o asignar un ID válido si existe una organización
    "role_id": None  # Se asignará dinámicamente en el script
}

organization_museo_data = {
    "name": "Museo Nacional",
    "phone": "2222-0000",
    "email": "contacto@museo.cr"
}

organization_teatro_data = {
    "name": "Teatro Nacional",
    "phone": "2222-0000",
    "email": "contacto@teatro.cr"
}

events_danza_data =  {
    "name": "Festival Nacional de Danza",
    "description": "Una muestra del talento nacional en danza contemporánea.",
    "start_datetime": "2025-09-15T18:00:00Z",
    "end_datetime": "2025-09-15T21:00:00Z",
    "price": 5000.00,
    #"currency_id": colon_id,
    #"category_id": category_danza_id,
    "ticket_link": "https://entradas.cr/danza",
    "contact_email": "danza@festival.cr",
    "contact_phone": "2255-3322",
    "address": "Teatro Nacional, San José",
    "map_location": "https://maps.google.com/?q=Teatro+Nacional",
    #"event_banner_base64": base_64_str_evento_danza
}
   
events_teatro_data = {
    "name": "Obra de teatro: Lo mismo",
    "description": "Una sátira sobre la cotidianidad costarricense.",
    "start_datetime": "2025-10-05T19:30:00Z",
    "price": 8000.00,
    #"currency_id": colon_id,
    #"category_id": category_teatro_id,
    "ticket_link": "https://entradas.cr/teatro",
    "contact_email": "teatro@cultura.cr",
    "contact_phone": "2222-1234",
    "address": "Teatro Mélico Salazar",
    #"event_banner_base64": base_64_str_evento_teatro
}


events_musica_data = {
    "name": "Concierto de Rock Sinfónico",
    "description": "Una fusión entre la música clásica y el rock nacional.",
    "start_datetime": "2025-12-01T20:00:00Z",
    "price": 0,
    #"category_id": category_musica_id,
    "ticket_link": "https://entradas.cr/rocksinf",
    "contact_email": "musica@festival.cr",
    "contact_phone": "8888-0000",
    "address": "Estadio Nacional",
    #"event_banner_base64": base_64_str_evento_musica
}


############ Script Logic ###########
api_base_url = "http://localhost:8000/api"

def image_to_base64(relative_path):
    with open(relative_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        return encoded_string
    
def validate_expected_in_actual(expected, actual):
    def dict_matches(expected_dict, actual_dict):
        for key, expected_value in expected_dict.items():
            actual_value = actual_dict.get(key)

            if expected_value == "*":
                if actual_value in (None, "", [], {}):
                    print(f"Field '{key}' is empty or missing in response.")
                    return False
                continue

            if isinstance(expected_value, dict):
                if not isinstance(actual_value, dict) or not dict_matches(expected_value, actual_value):
                    print(f"Nested mismatch in field '{key}': expected {expected_value}, got {actual_value}")
                    return False
            else:
                if actual_value != expected_value:
                    print(f"Mismatch in field '{key}': expected {expected_value}, got {actual_value}")
                    return False

        return True

    if isinstance(expected, dict) and isinstance(actual, dict):
        return dict_matches(expected, actual)

    elif isinstance(expected, list) and isinstance(actual, list):
        used_indices = set()
        for expected_obj in expected:
            found = False
            for idx, actual_obj in enumerate(actual):
                if idx in used_indices:
                    continue  # prevent matching the same actual object multiple times
                if dict_matches(expected_obj, actual_obj):
                    used_indices.add(idx)
                    found = True
                    break
            if not found:
                print(f"Missing or mismatched: {expected_obj}")
                return False
        return True

    else:
        print("Expected and Actual must both be either lists or dictionaries.")
        return False

def api_get(url, headers=None, params=None):
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching data from {url}: {e}")
        raise

def api_post(url, data, headers=None):
    try:
        response = requests.post(url, json=data, headers=headers)
        status_code = response.status_code
        try:
            data = response.json()
        except Exception:
            data = response.text
        response.raise_for_status()
        return status_code, data
    except requests.RequestException as e:
        print(f"Error in POST {url}: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print("Response:", e.response.text)
        raise

def patch_user(user_id, patch_data, access_token):
    url = f"{api_base_url}/users/{user_id}/"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    try:
        response = requests.patch(url, json=patch_data, headers=headers)
        status_code = response.status_code
        try:
            data = response.json()
        except Exception:
            data = response.text
        return status_code, data
    except requests.RequestException as e:
        print(f"Error patching user {user_id}: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print("Response:", e.response.text)
        raise

def create_role_if_not_exists(name, description=""):
    # Ensure role exists in the database for later API GET
    role, created = UserRole.objects.get_or_create(
        name=name,
        defaults={"description": description}
    )
    if created:
        print(f"Created role: {name}")
    else:
        print(f"Role already exists: {name}")

def create_and_validate_roles():
    print("--- Creating roles...")
    create_role_if_not_exists("Administrador", "Administrator role with full permissions.")
    create_role_if_not_exists("Visitante", "Standard visitor user.")
    print("Roles created. Validating...")

    url = f"{api_base_url}/userroles/"
    response = api_get(url)
    
    # Remove id check for flexibility, or re-fetch with the latest ids from DB
    found_admin = next((r for r in response if r["name"] == "Administrador"), None)
    found_visitor = next((r for r in response if r["name"] == "Visitante"), None)

    assert found_admin is not None, "Administrador role not found in API!"
    assert found_visitor is not None, "Visitante role not found in API!"

    print("Roles validation successful.")

    role_admin_id = found_admin["id"]
    role_visitante_id = found_visitor["id"]

    return role_admin_id, role_visitante_id

def register_user(user_data):
    url = f"{api_base_url}/register/"
    status, data = api_post(url, user_data)
    assert status == 201, f"User registration failed: {data}"
    print("User registered:", data["name"])
    return data

def login_user(email, password):
    url = f"{api_base_url}/login/"
    payload = {"email": email, "password": password}
    status, data = api_post(url, payload)
    assert status == 200, f"Login failed: {data}"
    print("--- Login successful:", data["user"]["name"])
    return data.get('access'), data.get('refresh'), data

def create_organization(org_data, access_token):
    url = f"{api_base_url}/organizations/"
    headers = {"Authorization": f"Bearer {access_token}"}
    status_code, data = api_post(url, org_data, headers=headers)
    assert status_code == 201, f"Organization creation failed: {data}"
    print("--- Organization created:", data["name"])
    return data

def create_organizations_and_validate(access_token):
    print("--- Creating organizations...")
    
    # Create Museo Nacional
    org_museo = create_organization(organization_museo_data, access_token)
    
    # Create Teatro Nacional
    org_teatro = create_organization(organization_teatro_data, access_token)

    print("Organizations created. Validating...")

    url = f"{api_base_url}/organizations/"
    response = api_get(url, headers={"Authorization": f"Bearer {access_token}"})

    assert any(org["name"] == "Museo Nacional" for org in response), "Museo Nacional not found in API!"
    assert any(org["name"] == "Teatro Nacional" for org in response), "Teatro Nacional not found in API!"

    print("Organizations validation successful.")

    return org_museo["id"], org_teatro["id"]

def create_currency(name, access_token):
    url = f"{api_base_url}/currencies/"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    data = {"name": name}
    status_code, response_data = api_post(url, data, headers=headers)
    assert status_code == 201, f"Failed to create currency {name}: {response_data}"
    return response_data

def get_all_users(access_token):
    url = f"{api_base_url}/users/"
    headers = {"Authorization": f"Bearer {access_token}"}
    return api_get(url, headers=headers) 

def create_category(name, description, image_base64, access_token):
    url = f"{api_base_url}/categories/"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    data = {
        "name": name,
        "description": description,
        "image_base64": image_base64
    }
    status_code, response_data = api_post(url, data, headers=headers)
    assert status_code == 201, f"Failed to create category '{name}': {response_data}"
    print(f"Category created: {name}")
    return response_data

def get_all_categories():
    """
    Fetches all event categories from the public API.
    This endpoint does not require authentication.
    """
    url = f"{api_base_url}/categories/"
    return api_get(url)


def create_event(event_data, access_token):
    """
    Posts a new event using the API with authentication.
    """
    url = f"{api_base_url}/events/"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    status_code, response_data = api_post(url, event_data, headers=headers)
    assert status_code == 201, f"Failed to create event '{event_data.get('name')}' → {response_data}"
    print(f"Event created: {response_data['name']}")
    return response_data


def approve_event(event_id, access_token):
    url = f"{api_base_url}/events/{event_id}/approve/"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    status_code, data = api_post(url, {}, headers=headers)
    assert status_code == 200, f"Failed to approve event {event_id}: {data}"
    print(f"Event {event_id} approved by admin.")
    return data

def create_accessibility_feature(name, description, access_token):
    url = f"{api_base_url}/accessibilityfeatures/"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    data = {"name": name, "description": description}
    status_code, response_data = api_post(url, data, headers=headers)
    assert status_code == 201, f"Failed to create accessibility feature '{name}': {response_data}"
    print(f"Accessibility feature created: {name}")
    return response_data


def patch_event_price(event_id, new_price, access_token):
    """
    Patches the price of a given event.

    Args:
        event_id (int): ID of the event to update.
        new_price (float): New price to set.
        access_token (str): Bearer token for authentication.

    Returns:
        dict: The updated event data.
    """
    patch_url = f"{api_base_url}/events/{event_id}/"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    patch_payload = {
        "price": new_price
    }

    response = requests.patch(patch_url, json=patch_payload, headers=headers)
    assert response.status_code == 200, f"Failed to patch event {event_id}: {response.text}"
    patched_event = response.json()

    print(f"Event '{patched_event['name']}' updated successfully. New price: {patched_event['price']}")
    return patched_event

def link_accessibility_feature_to_event(event_id, accessibility_feature_id, access_token):
    """
    Links an accessibility feature to an event (many-to-many).
    
    Args:
        event_id (int): ID of the event.
        accessibility_feature_id (int): ID of the accessibility feature.
        access_token (str): Bearer token of an authorized user.

    Returns:
        dict: Response data from the API if successful.
    """
    url = f"{api_base_url}/eventaccessibilityfeatures/"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "event_id": event_id,
        "accessibility_feature_id": accessibility_feature_id
    }

    status_code, response_data = api_post(url, payload, headers=headers)
    assert status_code == 201, f"Failed to link feature {accessibility_feature_id} to event {event_id}: {response_data}"
    print(f"Feature {accessibility_feature_id} linked to event {event_id}.")
    return response_data


def post_event_comment(event_id, comment_text, access_token, image_base64=None):
    """
    Posts a comment to a given event.

    Args:
        event_id (int): ID of the event being commented on.
        comment_text (str): The text content of the comment.
        access_token (str): Bearer token of the commenting user.
        image_base64 (str, optional): Base64-encoded image string (optional).

    Returns:
        dict: Response from the API if successful.
    """
    url = f"{api_base_url}/comments/"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "event_id": event_id,
        "comment": comment_text
    }

    if image_base64:
        payload["image_base64"] = image_base64

    status_code, response_data = api_post(url, payload, headers=headers)
    assert status_code == 201, f"Failed to post comment to event {event_id}: {response_data}"
    print(f"Comment posted to event {event_id} by user.")
    return response_data

def bookmark_event(event_id, token):
    """
    Adds an event to the authenticated user's agenda (My Agenda).
    """
    print(f"--- Bookmarking event {event_id} for token holder...")
    url = f"{api_base_url}/userevents/"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    payload = {
        "event_id": event_id 
    }

    response = requests.post(url, json=payload, headers=headers)
    try:
        data = response.json()
    except Exception:
        data = response.text

    if response.status_code == 201:
        print(f"Event {event_id} bookmarked successfully.")
        return data
    elif response.status_code == 400:
        print(f"400 Bad Request when bookmarking event: {data}")
    else:
        print(f"Failed to bookmark event: {response.status_code} — {data}")

    return None

def main():
    # Create roles, validate them, and get their IDs
    role_admin_id, role_visitante_id = create_and_validate_roles()

    # Register the admin and visitor
    print("--- Registering users...")
    user_admin_data["role_id"] = role_admin_id
    register_user(user_admin_data)

    # Register the visitante user with the visitante role
    user_visitante_ana_data["role_id"] = role_visitante_id
    register_user(user_visitante_ana_data)
    print("--- Users registered successfully.")

    # Login to get token
    user_admin_access_token, user_admin_refresh_token, data_alfonso = login_user(user_admin_data['email'], user_admin_data['password'])
    assert validate_expected_in_actual(expected_login_data_admin, data_alfonso), f"Admin login data_alfonso does not match expected structure expected:{expected_login_data_admin}, received: {data_alfonso}"

    user_visitante__ana_access_token, user_visitante_pedro_refresh_token, data_ana = login_user(user_visitante_ana_data['email'], user_visitante_ana_data['password'])
    assert validate_expected_in_actual(expected_login_data_visitante_ana, data_ana), f"Visitante login data_ana does not match expected structure expected:{expected_login_data_visitante_ana}, received: {data_ana}"

    # Create organizations and validate
    id_organization_museo, id_organization_teatro = create_organizations_and_validate(user_admin_access_token)

    # Register a second visitante but with an organization
    user_visitante_pedro_data["role_id"] = role_visitante_id
    user_visitante_pedro_data["organization_id"] = id_organization_teatro
    register_user(user_visitante_pedro_data)

    # Login the second visitante
    user_visitante_pedro_access_token, user_visitante_pedro_refresh_token, data_pedro = login_user(user_visitante_pedro_data['email'], user_visitante_pedro_data['password'])
    assert validate_expected_in_actual(expected_login_data_visitante_pedro, data_pedro), f"Visitante login data_pedro does not match expected structure expected:{expected_login_data_visitante_ana}, received: {data_pedro}"   
    
    # Patch Ana to assign organization
    print("--- Patching Ana to assign organization...")
    user_ana_id = data_ana['user']['id']
    status_code, patched_data = patch_user(
        user_id=user_ana_id,
        patch_data={"organization_id": id_organization_museo},
        access_token=user_visitante__ana_access_token
    )
    assert status_code == 200, f"Failed to patch user Ana: {patched_data}"
    assert patched_data["organization"]["id"] == id_organization_museo, "Ana's organization not updated correctly!"
    print("--- Ana patched successfully with organization.")

    # Get all users and validate
    print("--- Fetching all users...")
    users = get_all_users(user_admin_access_token)
    assert validate_expected_in_actual(expected_users_admin_get, users), f"Users data does not match expected structure expected:{expected_users_admin_get}, received: {users}"
    print("--- All users fetched and validated successfully.")

    # Create currencies
    print("--- Creating currencies...")
   
    # Create some currencies using Alfonso's token
    colon_id = create_currency("CRC", user_admin_access_token)["id"]
    dolar_response_id = create_currency("USD", user_admin_access_token)["id"]

    print("Currencies created successfully.")

    # Create categories
    print("--- Creating categories...")
    base64_str_category_danza = image_to_base64("sample_images/categoria_danza.png")
    base64_str_category_teatro = image_to_base64("sample_images/categoria_teatro.png")
    base64_str_category_musica = image_to_base64("sample_images/categoria_musica.png")
    base64_str_category_peliculas = image_to_base64("sample_images/categoria_peliculas.png")    

    category_danza_id = create_category("Danza", "Eventos de danza y coreografía", base64_str_category_danza, user_admin_access_token)["id"]
    category_teatro_id = create_category("Teatro", "Obras teatrales y actuaciones", base64_str_category_teatro, user_admin_access_token)["id"]
    category_musica_id = create_category("Música", "Conciertos y presentaciones musicales", base64_str_category_musica, user_admin_access_token)["id"]
    
    categories = get_all_categories()
    assert validate_expected_in_actual(expected_categories, categories), f"Categories data does not match expected structure expected:{expected_categories}, received: {categories}"
 
    print("--- Categories created and validated successfully.")

    print("--- Creating events...")

    # Convertir imágenes a base64
    base_64_str_evento_danza = image_to_base64("sample_images/evento_danza.jpg")
    base_64_str_evento_teatro = image_to_base64("sample_images/evento_lo_mismo.jpg")
    base_64_str_evento_musica = image_to_base64("sample_images/evento_concierto.jpg")

    # --- Evento de Danza (creado por Alfonso) ---
    events_danza_data["currency_id"] = colon_id
    events_danza_data["category_id"] = category_danza_id
    events_danza_data["event_banner_base64"] = base_64_str_evento_danza
    event_danza_response = create_event(events_danza_data, user_admin_access_token)
    event_danza_id = event_danza_response["id"]

    # --- Evento de Teatro (creado por Ana) ---
    events_teatro_data["currency_id"] = colon_id
    events_teatro_data["category_id"] = category_teatro_id
    events_teatro_data["event_banner_base64"] = base_64_str_evento_teatro
    event_teatro_response = create_event(events_teatro_data, user_visitante__ana_access_token)
    event_teatro_id = event_teatro_response["id"]

    # --- Evento de Música (creado por Pedro) ---
    events_musica_data["category_id"] = category_musica_id
    events_musica_data["event_banner_base64"] = base_64_str_evento_musica
    event_musica_response = create_event(events_musica_data, user_visitante_pedro_access_token)
    event_musica_id = event_musica_response["id"]

    print(f"Events created: Danza (ID {event_danza_id}), Teatro (ID {event_teatro_id}), Música (ID {event_musica_id})")

    # Approve the events
    print("--- Approving events...")
    approve_event(event_danza_id, user_admin_access_token)
    approve_event(event_teatro_id, user_admin_access_token)    
    print("--- Events approved successfully.")

    # Add accesibilty features
    print("--- Creating accessibility features...")

    feature_wc = create_accessibility_feature(
        name="Wheelchair access",
        description="Ramp or elevator available for wheelchair users.",
        access_token=user_admin_access_token
    )
    feature_wc_id = feature_wc["id"]

    feature_sign = create_accessibility_feature(
        name="Sign language interpreter",
        description="Interpreter for hearing-impaired attendees.",
        access_token=user_admin_access_token
    )
    feature_sign_id = feature_sign["id"]

    feature_audio = create_accessibility_feature(
        name="Audio description",
        description="Narrated description for visually impaired people.",
        access_token=user_admin_access_token
    )
    feature_audio_id = feature_audio["id"]

    print(f"Accessibility features created: Wheelchair (ID {feature_wc_id}), Sign Language (ID {feature_sign_id}), Audio Description (ID {feature_audio_id})")

    print("--- Patching Danza event price to 1000...")
    patched_event_danza = patch_event_price(event_danza_id, 1000, user_admin_access_token)
    print(f"Event Danza patched successfully. New price: {patched_event_danza['price']}")


    print("--- Linking accessibility features to events...")
    link_accessibility_feature_to_event(event_danza_id, feature_wc_id, user_admin_access_token)
    link_accessibility_feature_to_event(event_teatro_id, feature_sign_id, user_admin_access_token)
    link_accessibility_feature_to_event(event_teatro_id, feature_audio_id, user_visitante__ana_access_token)

    # Comentario sin imagen
    print("--- Posting comments on events...")
    post_event_comment(event_danza_id, "¡Qué espectáculo más impresionante!", user_visitante__ana_access_token)

    # Comentario con imagen (si tienes una imagen cargada)
    image_str = image_to_base64("sample_images/comentario_danza.jpg")
    post_event_comment(event_danza_id, "Aquí disfrutando del evento 🎉", user_visitante__ana_access_token, image_base64=image_str)
    print("--- Comments posted successfully.")

    # Bookmark events
    print("--- Bookmarking events for users...")

    bookmark_event(event_danza_id, user_visitante__ana_access_token)
    bookmark_event(event_teatro_id, user_visitante_pedro_access_token)
    bookmark_event(event_musica_id, user_admin_access_token)

    print("--- Events bookmarked successfully.")

    
    print("--- Seed and validation completed.")

if __name__ == "__main__":
    main()