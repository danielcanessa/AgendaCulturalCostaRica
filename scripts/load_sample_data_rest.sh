#!/bin/bash

API_URL="http://localhost:8000/api"

post_and_get_id() {
  local endpoint=$1
  local json=$2

  response=$(curl -s -X POST "$API_URL/$endpoint/" -H "Content-Type: application/json" -d "$json")
  id=$(echo "$response" | jq -r '.id // empty')

  if [ -z "$id" ]; then
    echo "Error creando en $endpoint:"
    echo "$response"
    exit 1
  fi

  echo "$id"
}

echo "Creando roles..."
json_admin_role=$(jq -n --arg name "Administrador" --arg desc "Usuario con permisos totales" '{name: $name, description: $desc}')
ADMIN_ROLE_ID=$(post_and_get_id "userroles" "$json_admin_role")

json_visitor_role=$(jq -n --arg name "Visitante" --arg desc "Usuario visitante que puede explorar y comentar eventos" '{name: $name, description: $desc}')
VISITOR_ROLE_ID=$(post_and_get_id "userroles" "$json_visitor_role")

echo "Creando organizaciones..."
json_org_cenfotec=$(jq -n --arg name "CENFOTEC" --arg phone "2222-1111" --arg email "info@cenfotec.ac.cr" '{name: $name, phone: $phone, email: $email}')
ORG_CENFOTEC_ID=$(post_and_get_id "organizations" "$json_org_cenfotec")

json_org_museo=$(jq -n --arg name "Museo Nacional" --arg phone "2223-4455" --arg email "info@museocostarica.go.cr" '{name: $name, phone: $phone, email: $email}')
ORG_MUSEO_ID=$(post_and_get_id "organizations" "$json_org_museo")

echo "Creando usuarios..."
json_admin_user=$(jq -n \
  --arg name "Ana" \
  --arg last_name "Gómez" \
  --arg email "admin@agendacultural.cr" \
  --arg password "hashadmin123" \
  --argjson role $ADMIN_ROLE_ID \
  --argjson organization $ORG_CENFOTEC_ID \
  --argjson is_event_organizer false \
  '{
    name: $name,
    last_name: $last_name,
    email: $email,
    password: $password,
    role: $role,
    organization: $organization,
    is_event_organizer: $is_event_organizer
  }'
)
ADMIN_USER_ID=$(post_and_get_id "users" "$json_admin_user")

json_visitor_user=$(jq -n \
  --arg name "Luis" \
  --arg last_name "Pérez" \
  --arg email "visitante@agendacultural.cr" \
  --arg password "hashvisitante123" \
  --argjson role $VISITOR_ROLE_ID \
  --argjson organization $ORG_MUSEO_ID \
  --argjson is_event_organizer true \
  '{
    name: $name,
    last_name: $last_name,
    email: $email,
    password: $password,
    role: $role,
    organization: $organization,
    is_event_organizer: $is_event_organizer
  }'
)
VISITOR_USER_ID=$(post_and_get_id "users" "$json_visitor_user")

json_visitor_user2=$(jq -n \
  --arg name "María" \
  --arg last_name "Fernández" \
  --arg email "visitante2@agendacultural.cr" \
  --arg password "hashvisitante456" \
  --argjson role $VISITOR_ROLE_ID \
  --argjson organization $ORG_MUSEO_ID \
  --argjson is_event_organizer true \
  '{
    name: $name,
    last_name: $last_name,
    email: $email,
    password: $password,
    role: $role,
    organization: $organization,
    is_event_organizer: $is_event_organizer
  }'
)
VISITOR_USER2_ID=$(post_and_get_id "users" "$json_visitor_user2")

echo "Creando monedas..."
json_usd=$(jq -n --arg code "USD" --arg symbol "$" --arg name "Dólar estadounidense" '{code: $code, symbol: $symbol, name: $name}')
USD_ID=$(post_and_get_id "currencies" "$json_usd")

json_crc=$(jq -n --arg code "CRC" --arg symbol "₡" --arg name "Colón costarricense" '{code: $code, symbol: $symbol, name: $name}')
CRC_ID=$(post_and_get_id "currencies" "$json_crc")

echo "Creando categorías con imágenes..."

IMAGE_DIR="./sample_images"
BASE64_MUSIC=$(base64 -i "$IMAGE_DIR/categoria_musica.png" | tr -d '\n')
BASE64_DANCE=$(base64 -i "$IMAGE_DIR/categoria_danza.png" | tr -d '\n')
BASE64_THEATRE=$(base64 -i "$IMAGE_DIR/categoria_teatro.png" | tr -d '\n')
BASE64_CINE=$(base64 -i "$IMAGE_DIR/catergoria_peliculas.png" | tr -d '\n')

json_music_cat=$(jq -n --arg name "Música" --arg desc "Eventos musicales y conciertos." --arg image_base64 "$BASE64_MUSIC" '{name: $name, description: $desc, image_base64: $image_base64}')
MUSIC_CAT_ID=$(post_and_get_id "categories" "$json_music_cat")

json_dance_cat=$(jq -n --arg name "Danza" --arg desc "Eventos de danza y baile." --arg image_base64 "$BASE64_DANCE" '{name: $name, description: $desc, image_base64: $image_base64}')
DANCE_CAT_ID=$(post_and_get_id "categories" "$json_dance_cat")

json_theatre_cat=$(jq -n --arg name "Teatro" --arg desc "Obras teatrales y representaciones escénicas." --arg image_base64 "$BASE64_THEATRE" '{name: $name, description: $desc, image_base64: $image_base64}')
THEATRE_CAT_ID=$(post_and_get_id "categories" "$json_theatre_cat")

json_cine_cat=$(jq -n --arg name "Cine" --arg desc "Proyecciones y festivales de cine." --arg image_base64 "$BASE64_CINE" '{name: $name, description: $desc, image_base64: $image_base64}')
CINE_CAT_ID=$(post_and_get_id "categories" "$json_cine_cat")

echo "Creando características de accesibilidad..."

json_wheelchair=$(jq -n --arg name "Acceso para silla de ruedas" --arg desc "Rampa y espacio adecuado para sillas de ruedas." '{name: $name, description: $desc}')
WHEELCHAIR_ID=$(post_and_get_id "accessibilityfeatures" "$json_wheelchair")

json_hearing=$(jq -n --arg name "Asistencia auditiva" --arg desc "Equipos de ayuda para personas con dificultades auditivas." '{name: $name, description: $desc}')
HEARING_ID=$(post_and_get_id "accessibilityfeatures" "$json_hearing")

echo "Creando monedas..."

json_usd=$(jq -n --arg name "USD" '{name: $name}')
USD_ID=$(post_and_get_id "currencies" "$json_usd")
echo "ID USD: $USD_ID"

json_crc=$(jq -n --arg name "CRC" '{name: $name}')
CRC_ID=$(post_and_get_id "currencies" "$json_crc")
echo "ID CRC: $CRC_ID"

echo "Creando eventos..."

echo "VISITOR_USER_ID: $VISITOR_USER_ID"
echo "ADMIN_USER_ID: $ADMIN_USER_ID"
echo "MUSIC_CAT_ID: $MUSIC_CAT_ID"
echo "CRC_ID: $CRC_ID"


# Placeholder de base64 para banner
BASE64_EVENT1=$(base64 -i "$IMAGE_DIR/evento_concierto.jpg" | tr -d '\n')
BASE64_EVENT2=$(base64 -i "$IMAGE_DIR/evento_danza.jpg" | tr -d '\n')

json_event1=$(jq -n \
  --arg name "Concierto de Rock" \
  --arg desc "Una noche de rock nacional con bandas emergentes." \
  --arg start "2025-08-01T19:00:00Z" \
  --arg end "2025-08-01T23:00:00Z" \
  --arg price "5000.00" \
  --argjson currency "$CRC_ID" \
  --arg ticket "https://entradas.cr/rock" \
  --arg email "eventos@cenfotec.ac.cr" \
  --arg phone "8888-8888" \
  --arg address "Teatro Nacional, San José" \
  --arg map "https://goo.gl/maps/ejemplo1" \
  --argjson created_by "$VISITOR_USER_ID" \
  --argjson approved_by "$ADMIN_USER_ID" \
  --argjson category "$MUSIC_CAT_ID" \
  --arg banner_base64 "$BASE64_EVENT1" \
  '{
    name: $name,
    description: $desc,
    start_datetime: $start,
    end_datetime: $end,
    price: $price | tonumber,
    currency: $currency,
    ticket_link: $ticket,
    contact_email: $email,
    contact_phone: $phone,
    address: $address,
    map_location: $map,
    created_by: $created_by,
    approved_by: $approved_by,
    category: $category,
    event_banner_base64: $banner_base64
  }'
)
EVENT1_ID=$(post_and_get_id "events" "$json_event1")
echo "ID Evento 1: $EVENT1_ID"

json_event2=$(jq -n \
  --arg name "Festival de Cine Latinoamericano" \
  --arg desc "Muestra de cine independiente latinoamericano." \
  --arg start "2025-08-15T18:00:00Z" \
  --arg end "2025-08-18T22:00:00Z" \
  --arg price "0.00" \
  --argjson currency "$USD_ID" \
  --arg ticket "https://entradas.cr/cine" \
  --arg email "cine@agenda.cr" \
  --arg phone "8777-7777" \
  --arg address "Cine Magaly, San José" \
  --arg map "https://goo.gl/maps/ejemplo2" \
  --argjson created_by "$VISITOR_USER2_ID" \
  --argjson category "$CINE_CAT_ID" \
  --arg banner_base64 "$BASE64_EVENT2" \
  '{
    name: $name,
    description: $desc,
    start_datetime: $start,
    end_datetime: $end,
    price: $price | tonumber,
    currency: $currency,
    ticket_link: $ticket,
    contact_email: $email,
    contact_phone: $phone,
    address: $address,
    map_location: $map,
    created_by: $created_by,
    category: $category,
    event_banner_base64: $banner_base64
  }'
)
EVENT2_ID=$(post_and_get_id "events" "$json_event2")
echo "ID Evento 2: $EVENT2_ID"

echo "Agregando características de accesibilidad a eventos..."
json_event1_access=$(jq -n --argjson event "$EVENT1_ID" --argjson accessibility_feature "$WHEELCHAIR_ID" '{event: $event, accessibility_feature: $accessibility_feature}')
post_and_get_id "eventaccessibilityfeatures" "$json_event1_access"

json_event2_access=$(jq -n --argjson event "$EVENT2_ID" --argjson accessibility_feature "$HEARING_ID" '{event: $event, accessibility_feature: $accessibility_feature}')
post_and_get_id "eventaccessibilityfeatures" "$json_event2_access"

echo "Agregando eventos a Mi Agenda del visitante..."
json_user_event1=$(jq -n --argjson user "$VISITOR_USER_ID" --argjson event "$EVENT1_ID" '{user: $user, event: $event}')
post_and_get_id "userevents" "$json_user_event1"

json_user_event2=$(jq -n --argjson user "$VISITOR_USER_ID" --argjson event "$EVENT2_ID" '{user: $user, event: $event}')
post_and_get_id "userevents" "$json_user_event2"

json_user2_event2=$(jq -n --argjson user "$VISITOR_USER2_ID" --argjson event "$EVENT2_ID" '{user: $user, event: $event}')
post_and_get_id "userevents" "$json_user2_event2"

echo "Agregando comentarios..."
BASE64_COMMENT1=$(base64 -i "$IMAGE_DIR/comentario_musica.png" | tr -d '\n')
BASE64_COMMENT2=$(base64 -i "$IMAGE_DIR/comentario_danza.jpg" | tr -d '\n')

json_comment1=$(jq -n \
  --arg comment "¡Excelente concierto, me encantó la banda principal!" \
  --argjson user "$VISITOR_USER_ID" \
  --argjson event "$EVENT1_ID" \
  --arg image_base64 "$BASE64_COMMENT1" \
  '{user: $user, event: $event, comment: $comment, image_base64: $image_base64}'
)
post_and_get_id "comments" "$json_comment1"

json_comment2=$(jq -n \
  --arg comment "Me encantó la coreografía de danza contemporánea." \
  --argjson user "$VISITOR_USER_ID" \
  --argjson event "$EVENT2_ID" \
  --arg image_base64 "$BASE64_COMMENT2" \
  '{user: $user, event: $event, comment: $comment, image_base64: $image_base64}'
)
post_and_get_id "comments" "$json_comment2"

echo "----- Carga completa de datos exitosa -----"