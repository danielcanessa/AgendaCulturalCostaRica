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

############################################# Expected Data #############################################

# Expected roles response
expected_roles_response = [
   {
      "name": "Administrador",
      "description": "Administrator role with full permissions."
   },
   {
      "name": "Visitante",
      "description": "Standard visitor user."
   }
]

# Expected login data admin
expected_login_admin_response = {
   "user":{      
      "email":"dcanessav@ucenfotec.ac.cr",
      "role":{
         "name":"Administrador",
       },
   }
}

# Expected login data visitor Ana
expected_login_visitor_ana_response = {
   "user":{    
      "email":"ana@email.com",     
      "role":{
         "name":"Visitante",        
      },
      "organization":None
   }
}

# Expected login data visitor Pedro
expected_login_visitor_pedro_response = {
    "user":{
      "email":"peter@email.com",   
      "role":{
         "name":"Visitante",        
      },
      "organization":{
         "name":"Teatro Nacional",
      }
   }
}

# Expected users GET, admin role
expected_users_admin_get = [
   {    
      "name":"Daniel",
      "last_name":"Canessa",
      "email":"dcanessav@ucenfotec.ac.cr",
      "phone":"1111-2222",
      "bio":"Soy el admin.",   
      "role":{
         "name":"Administrador",       
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
      },
      "organization":{
         "name":"Teatro Nacional",
         "phone":"2222-0000",
         "email":"contacto@teatro.cr"
      }
   }
]

# Expected organizations GET, authenticated user
expected_organizations = [
   {
      "name":"Museo Nacional",
      "phone":"2222-0000",
      "email":"contacto@museo.cr"
   },
   {
      "name":"Teatro Nacional",
      "phone":"2222-0000",
      "email":"contacto@teatro.cr"
   }
]

# Expected categories GET, any user role
expected_categories_get = [
   {
      "name":"Danza",
      "description":"Eventos de danza y coreografía",
      "image_base64":"*" # Placeholder for actual base64 image data
   },
   {
      "name":"Teatro",
      "description":"Obras teatrales y actuaciones",
      "image_base64":"*" # Placeholder for actual base64 image data
   },
   {
      "name":"Música",
      "description":"Conciertos y presentaciones musicales",
      "image_base64":"*" # Placeholder for actual base64 image data
   }
]

# Expected filtere comments GET
expected_comments_get = [
    {
        "user": {        
            "name": "Pedro",
            "last_name": "Muñoz",
            "email": "peter@email.com",        
            "role": {               
                "name": "Visitante",               
            },
            "organization": {              
                "name": "Teatro Nacional",               
            }
        },
        "event": {         
            "name": "Obra de teatro: Lo mismo",
        },
        "comment": "Me encantó la obra, muy conmovedora.",
    }
]

############################################# Post / Path Data #############################################

# User data for registration, role admin
user_admin_data_post = {
    "name": "Daniel",
    "last_name": "Canessa",
    "email": "dcanessav@ucenfotec.ac.cr",
    "password": "Secret123!",
    "phone": "1111-2222",
    "bio": "Soy el admin.",
    "is_staff":True,
    # "role_id": None  # Will be set using admin role ID later
}

# User data for registration, role visitor
user_visitor_ana_data_post = {
    "name": "Ana",
    "last_name": "Martínez",
    "email": "ana@email.com",
    "password": "SecurePass456!",
    "phone": "2222-3333",
    "bio": "Soy visitante y me encanta asistir a museos",
    "is_event_organizer": False,
    "organization_id": None,   # Will be set later using a patch request
    "role_id": None   # Will be set using admin role ID later
}

# User data for registration, role visitor
user_visitor_pedro_data_post = {
    "name": "Pedro",
    "last_name": "Muñoz",
    "email": "peter@email.com",
    "password": "SecurePasss!",
    "phone": "2222-3378",
    "bio": "Soy visitante y me encanta asistir a teatros.",
    "is_event_organizer": False,
    "organization_id": None,   # Will be set later using a patch request
    "role_id": None   # Will be set using admin role ID later
}

# Organization data for refgistration
organization_museo_data_post = {
    "name": "Museo Nacional",
    "phone": "2222-0000",
    "email": "contacto@museo.cr"
}

organization_teatro_data_post = {
    "name": "Teatro Nacional",
    "phone": "2222-0000",
    "email": "contacto@teatro.cr"
}

# Events data for registration
events_danza_data_post =  {
    "name": "Festival Nacional de Danza",
    "description": "Una muestra del talento nacional en danza contemporánea.",
    "start_datetime": "2025-09-15T18:00:00Z",
    "end_datetime": "2025-09-15T21:00:00Z",
    "price": 5000.00,   
    "ticket_link": "https://entradas.cr/danza",
    "contact_email": "danza@festival.cr",
    "contact_phone": "2255-3322",
    "address": "Teatro Nacional, San José",
    "map_location": "https://maps.google.com/?q=Teatro+Nacional",
    # The following fields are assigned using the IDs fetched from the database
    #"currency_id": , 
    #"category_id": ,
    #"event_banner_base64": 
}
   
events_teatro_data_post = {
    "name": "Obra de teatro: Lo mismo",
    "description": "Una sátira sobre la cotidianidad costarricense.",
    "start_datetime": "2025-10-05T19:30:00Z",
    "price": 8000.00,
    "ticket_link": "https://entradas.cr/teatro",
    "contact_email": "teatro@cultura.cr",
    "contact_phone": "2222-1234",
    "address": "Teatro Mélico Salazar",
    # The following fields are assigned using the IDs fetched from the database
    #"currency_id": , 
    #"category_id": ,
    #"event_banner_base64": 
}

events_musica_data = {
    "name": "Concierto de Rock Sinfónico",
    "description": "Una fusión entre la música clásica y el rock nacional.",
    "start_datetime": "2025-12-01T20:00:00Z",
    "price": 0,
    "ticket_link": "https://entradas.cr/rocksinf",
    "contact_email": "musica@festival.cr",
    "contact_phone": "8888-0000",
    "address": "Estadio Nacional",
    # The following fields are assigned using the IDs fetched from the database
    #"category_id": ,
    #"event_banner_base64": 
}


############################################# Constants #############################################
api_base_url = "http://localhost:8000/api"

############################################# Helper Functions #############################################
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

        assert status_code == 200, f"Failed to patch user {data}, code: {status_code}"
        
        return status_code, data
    except requests.RequestException as e:
        print(f"Error patching user {user_id}: {e}")
        raise

############################################# Agenda Cultural Endpoints #############################################
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

def get_roles():
    url = f"{api_base_url}/userroles/"
    return api_get(url) 

def get_role_id_by_name(name):
    roles = get_roles()
    for role in roles:
        if role['name'].lower() == name.lower():
            return role['id']
    return None
   
def register_user(user_data):
    url = f"{api_base_url}/register/"
    status, data = api_post(url, user_data)
    assert status == 201, f"User registration failed: {data}"
    print("User registered:", data)
    return data

def login_user(email, password):
    url = f"{api_base_url}/login/"
    payload = {"email": email, "password": password}
    status, data = api_post(url, payload)
    assert status == 200, f"Login failed: {data}"
    print("Login successful:", data["user"]["email"])
    return data.get('access'), data.get('refresh'), data

def create_organization(org_data, access_token):
    url = f"{api_base_url}/organizations/"
    headers = {"Authorization": f"Bearer {access_token}"}
    status_code, data = api_post(url, org_data, headers=headers)
    assert status_code == 201, f"Organization creation failed: {data}"
    print("Organization created:", data["name"])
    return data

def get_organizations(access_token):
    url = f"{api_base_url}/organizations/"
    headers = {"Authorization": f"Bearer {access_token}"}
    return api_get(url, headers=headers)

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
    print(f"Bookmarking event {event_id} for token holder...")
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

def change_password(access_token, old_password, new_password):
    url = f"{api_base_url}/change-password/"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "old_password": old_password,
        "new_password": new_password
    }

    response = requests.post(url, json=payload, headers=headers)
    try:
        data = response.json()
    except Exception:
        data = response.text

    # Validación estricta del status code
    assert response.status_code == 200, f"Error changing password: [{response.status_code}] {data}"
    print("Password changed successfully.")
    return data

def logout_api(refresh_token):
    """
    Llama al endpoint de logout enviando el refresh token.
    Devuelve True si fue exitoso, False si hubo error.
    """
    url = f"{api_base_url}/logout/"
    payload = {"refresh": refresh_token}
    response = requests.post(url, json=payload)
    print(f"Logout status: {response.status_code}")
    return response.status_code == 205

def main():
    # Create roles, validate them, and get their IDs
    print("--- Creating roles...")
    
    create_role_if_not_exists("Administrador", "Administrator role with full permissions.")
    create_role_if_not_exists("Visitante", "Standard visitor user.")
    
    print("Roles created. Validating...")
    roles = get_roles()
    assert validate_expected_in_actual(expected_roles_response, roles), f"Roles validation failed: expected {expected_roles_response}, got {roles}"
    
    print("Roles validation successful.")

    role_admin_id = get_role_id_by_name("Administrador")
    role_visitor_id = get_role_id_by_name("Visitante")    
    print(f"Admin role ID: {role_admin_id}, Visitante role ID: {role_visitor_id}")

    # Register users: 1 admin and  1 visitor
    print("--- Registering users...")
    user_admin_data_post["role_id"] = role_admin_id
    register_user(user_admin_data_post)

    user_visitor_ana_data_post["role_id"] = role_visitor_id
    register_user(user_visitor_ana_data_post)
    print("Users registered successfully.")

    # Login to get token
    print("--- Logging in users to get access tokens...")
    user_admin_access_token, user_admin_refresh_token, data_daniel = login_user(user_admin_data_post['email'], user_admin_data_post['password'])
    assert validate_expected_in_actual(expected_login_admin_response, data_daniel), f"Admin login data_daniel does not match expected structure expected:{expected_login_admin_response}, received: {data_daniel}"

    user_visitante__ana_access_token, user_visitante_ana_refresh_token, data_ana = login_user(user_visitor_ana_data_post['email'], user_visitor_ana_data_post['password'])
    assert validate_expected_in_actual(expected_login_visitor_ana_response, data_ana), f"Visitante login data_ana does not match expected structure expected:{expected_login_visitor_ana_response}, received: {data_ana}"
    print("Users logged in successfully.")

    # Create organizations and validate
    print("--- Creating organizations...")
    
    id_organization_museo = create_organization(organization_museo_data_post, user_visitante__ana_access_token)["id"] # Use admin token to create organization
    id_organization_teatro = create_organization(organization_teatro_data_post, user_visitante__ana_access_token)["id"] # Use admin token to create organization

    organizations = get_organizations(user_admin_access_token)  # Use visitor's token to fetch organizations
    assert validate_expected_in_actual(expected_organizations, organizations), f"Organizations data does not match expected structure expected:{expected_organizations}, received: {organizations}"

    print("Organizations created and validation")

    # Register a second visitor but with an organization 
    print("--- Registering second visitor with organization...")
    user_visitor_pedro_data_post["role_id"] = role_visitor_id
    user_visitor_pedro_data_post["organization_id"] = id_organization_teatro
    register_user(user_visitor_pedro_data_post)

    # Login the second visitor
    user_visitante_pedro_access_token, user_visitante_pedro_refresh_token, data_pedro = login_user(user_visitor_pedro_data_post['email'], user_visitor_pedro_data_post['password'])
    assert validate_expected_in_actual(expected_login_visitor_pedro_response, data_pedro), f"Visitante login data_pedro does not match expected structure expected:{expected_login_visitor_ana_response}, received: {data_pedro}"   
    print("Second visitor registered and logged in successfully.")

    # Patch visitor Ana to assign an organization
    print("--- Patching visitor to assign organization...")
    user_ana_id = data_ana['user']['id']
    patch_user(user_ana_id, {"organization_id": id_organization_museo}, user_visitante__ana_access_token)
    print("Visitor patched successfully with organization.")

    # Get all users and validate
    print("--- Fetching all users...")
    users = get_all_users(user_admin_access_token)
    assert validate_expected_in_actual(expected_users_admin_get, users), f"Users data does not match expected structure expected:{expected_users_admin_get}, received: {users}"
    print("All users fetched and validated successfully.")

    # Create currencies
    print("--- Creating currencies...")
   
    colon_id = create_currency("CRC", user_admin_access_token)["id"] # Use admin token to create currency
    dolar_response_id = create_currency("USD", user_admin_access_token)["id"] # Use admin token to create currency

    print("Currencies created successfully.")

    # Create categories
    print("--- Creating categories...")
    base64_str_category_danza = image_to_base64("sample_images/categoria_danza.png")
    base64_str_category_teatro = image_to_base64("sample_images/categoria_teatro.png")
    base64_str_category_musica = image_to_base64("sample_images/categoria_musica.png")    

    category_danza_id = create_category("Danza", "Eventos de danza y coreografía", base64_str_category_danza, user_admin_access_token)["id"]
    category_teatro_id = create_category("Teatro", "Obras teatrales y actuaciones", base64_str_category_teatro, user_admin_access_token)["id"]
    category_musica_id = create_category("Música", "Conciertos y presentaciones musicales", base64_str_category_musica, user_admin_access_token)["id"]
    
    categories = get_all_categories()
    assert validate_expected_in_actual(expected_categories_get, categories), f"Categories data does not match expected structure expected:{expected_categories_get}, received: {categories}"
 
    print("Categories created and validated successfully.")

    # Create events
    print("--- Creating events...")

    base_64_str_evento_danza = image_to_base64("sample_images/evento_danza.jpg")
    base_64_str_evento_teatro = image_to_base64("sample_images/evento_lo_mismo.jpg")
    base_64_str_evento_musica = image_to_base64("sample_images/evento_concierto.jpg")

    # --- Evento de Danza (creado por Daniel) ---
    events_danza_data_post["currency_id"] = colon_id
    events_danza_data_post["category_id"] = category_danza_id
    events_danza_data_post["event_banner_base64"] = base_64_str_evento_danza
    event_danza_response = create_event(events_danza_data_post, user_admin_access_token)
    event_danza_id = event_danza_response["id"]

    # --- Evento de Teatro (creado por Ana) ---
    events_teatro_data_post["currency_id"] = colon_id
    events_teatro_data_post["category_id"] = category_teatro_id
    events_teatro_data_post["event_banner_base64"] = base_64_str_evento_teatro
    event_teatro_response = create_event(events_teatro_data_post, user_visitante__ana_access_token)
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
    print("Events approved successfully.")

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

    # Patch the event price for Danza
    print("--- Patching Danza event price to 1000...")
    patched_event_danza = patch_event_price(event_danza_id, 1000, user_admin_access_token)
    print(f"Event Danza patched successfully. New price: {patched_event_danza['price']}")


    # Link accessibility features to events
    print("--- Linking accessibility features to events...")
    link_accessibility_feature_to_event(event_danza_id, feature_wc_id, user_admin_access_token)
    link_accessibility_feature_to_event(event_teatro_id, feature_sign_id, user_admin_access_token)
    link_accessibility_feature_to_event(event_teatro_id, feature_audio_id, user_visitante__ana_access_token)
    print("Accessibility features linked to events successfully.")

    # TODO: validate events creation with expected data

    # Comentario sin imagen
    print("--- Posting comments on events...")
    post_event_comment(event_danza_id, "¡Qué espectáculo más impresionante!", user_visitante__ana_access_token)
    post_event_comment(event_teatro_id, "Me encantó la obra, muy conmovedora.", user_visitante_pedro_access_token)

    # Comentario con imagen
    image_str = image_to_base64("sample_images/comentario_danza.jpg")
    post_event_comment(event_danza_id, "Aquí disfrutando del evento 🎉", user_visitante__ana_access_token, image_base64=image_str)
    print("Comments posted successfully.")

    # Bookmark events
    print("--- Bookmarking events for users...")

    bookmark_event(event_danza_id, user_visitante__ana_access_token)
    bookmark_event(event_teatro_id, user_visitante_pedro_access_token)
    bookmark_event(event_musica_id, user_admin_access_token)

    print("Events bookmarked successfully.")

    # Check filtered comments
    print("--- Fetching filtered comments for Teatro Nacional event...")
    url = f"{api_base_url}/comments/?event={event_teatro_id}"
    result = api_get(url)
    assert validate_expected_in_actual(expected_comments_get, result), f"Filtered comments data does not match expected structure expected:{expected_comments_get}, received: {result}"
    print("Filtered comments fetched and validated successfully.")

    # Change admin password to 'admin' 
    print("--- Changing admin password to 'admin'")
    change_password(user_admin_access_token, user_admin_data_post['password'], "admin")
    print("Admin password changed successfully.")

    # Logout all users
    print("--- Logging out all users...")
    assert logout_api(user_admin_refresh_token), "Admin logout failed."
    assert logout_api(user_visitante_ana_refresh_token), "Visitor Ana logout failed."
    assert logout_api(user_visitante_pedro_refresh_token), "Visitor Pedro logout failed."
    print("All users logged out successfully.")

    
    print("--- Seed and validation completed.")
    

if __name__ == "__main__":
    main()