# AgendaCulturalCostaRica

Agenda Cultural Costa Rica is a web application designed to promote and organize cultural events throughout Costa Rica. It allows event organizers to publish events, visitors to discover and bookmark them, and registered users to participate through comments and ratings.

This project is developed as part of the **Software Design course** at CENFOTEC, to apply best practices in full-stack web development, system architecture, and usability/accessibility design.

## Tech Stack
- **Frontend**: ReactJS
- **Backend**: Django + Django REST Framework
- **Database**: MySQL

## Features
- Public event listings with filters
- Accessibility metadata per event
- User authentication and role-based permissions
- Personalized "My Agenda" section
- Event comments and rating system
- Admin interface for managing users and content

## Development Setup (Automatic)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/AgendaCulturalCostaRica.git
cd AgendaCulturalCostaRica
````

### 2. Run the setup script

This command will:

* Recreate the MySQL database
* Set up a Python virtual environment
* Install backend dependencies
* Apply Django migrations
* Load sample data
* Start the Django development server

> Replace `mysqlpassword` with your actual MySQL root password.

```bash
./setup.sh mysqlpassword
```

Once complete, the API will be available at [http://localhost:8000](http://localhost:8000).

## Backend Configuration (Important)

Make sure the following settings are configured correctly in `backend/agendacultural/settings.py`.

### Database settings

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'agenda_cultural',
        'USER': 'root',
        'PASSWORD': 'mysqlpassword',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

### Required `INSTALLED_APPS`

Ensure these apps are listed:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'django_extensions',

    # Project apps
    'events',
]
```

> `django_extensions` is required for running custom scripts with `manage.py runscript`.

## Working with Models and Data

### Adding new models (tables)

1. Define your model in `events/models.py`:

```python
class Location(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
```

2. Generate and apply migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

### Populating sample data

1. Create a script in `backend/scripts/load_sample_data.py`:

```python
from events.models import Category

def run():
    for name in ["Music", "Art", "Theater", "Dance"]:
        obj, created = Category.objects.get_or_create(name=name)
        if created:
            print(f"Category created: {name}")
```

2. Run it using:

```bash
python manage.py runscript load_sample_data
```

## Frontend Setup (Manual)

From the `frontend/` folder:

```bash
cd frontend
npm install
npm start
```

The frontend will run at [http://localhost:3000](http://localhost:3000) and interact with the backend API.

## Notes

* Make sure you have MySQL installed and running.
* Python version: 3.10 or later is recommended.
* Node.js v18+ is recommended for the frontend.

