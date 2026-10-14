from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required


def home(request):
    """Render the home page and handle user authentication."""
    error_message = None

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        print(f"DEBUG: Получен логин -> '{username}', пароль -> '{password}'")  # Выведется в терминал

        user = authenticate(request, username=username, password=password)

        if user is not None:
            print(f"DEBUG: Пользователь найден! Роль staff: {user.is_staff}")
            login(request, user)
            if user.is_staff or user.is_superuser:
                return redirect('admin_panel')
            else:
                return redirect('dashboard')
        else:
            print("DEBUG: Пользователь НЕ найден (authenticate вернул None)")
            error_message = "Неверный логин или пароль"

    return render(request, 'index.html', {'error': error_message})

def dashboard_view(request):
    """Render the student dashboard page with classwork, grades, and schedule data."""
    assignments = [
        {'title': 'Math Homework — Ch. 5', 'due': '2026-10-07', 'status': 'in_progress'},
        {'title': 'Physics Lab Report', 'due': '2026-10-09', 'status': 'pending'},
        {'title': 'English Essay Draft', 'due': '2026-10-06', 'status': 'completed'},
        {'title': 'History Presentation', 'due': '2026-10-12', 'status': 'pending'},
    ]

    grades = [
        {'subject': 'Mathematics', 'score': 92, 'grade': 'A'},
        {'subject': 'Physics', 'score': 85, 'grade': 'B+'},
        {'subject': 'English', 'score': 95, 'grade': 'A+'},
        {'subject': 'History', 'score': 78, 'grade': 'B'},
        {'subject': 'Computer Science', 'score': 97, 'grade': 'A+'},
    ]

    schedule = [
        {'time': '08:00 – 09:30', 'course': 'Mathematics', 'room': 'A-101'},
        {'time': '09:45 – 11:15', 'course': 'Physics', 'room': 'B-204'},
        {'time': '11:30 – 13:00', 'course': 'English', 'room': 'C-302'},
        {'time': '13:15 – 14:45', 'course': 'History', 'room': 'A-105'},
        {'time': '15:00 – 16:30', 'course': 'Computer Science', 'room': 'D-410'},
    ]

    context = {
        'assignments': assignments,
        'grades': grades,
        'schedule': schedule,
    }
    # Обратите внимание на путь к шаблону, поправьте на 'dashboard.html' или 'home/dashboard.html', в зависимости от того, где лежит ваш файл
    return render(request, 'dashboard.html', context)


@login_required
def admin_panel_view(request):
    """Render the admin panel if the user has staff permissions."""
    if not request.user.is_staff:
        return redirect('dashboard')
    return render(request, 'admin_panel.html')