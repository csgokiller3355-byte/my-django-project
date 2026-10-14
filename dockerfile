# 1. Используем официальный образ Python
FROM python:3.14-slim

# 2. Указываем рабочую директорию внутри контейнера
WORKDIR /app

# 3. Отключаем кэширование байт-кода и включаем мгновенный вывод логов в терминал
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 4. Копируем файл зависимостей из корня проекта в контейнер
COPY requirements.txt /app/

# 5. Устанавливаем библиотеки Python
RUN pip install --no-cache-dir -r requirements.txt

# 6. Копируем весь код из локальной папки App внутрь контейнера
COPY App/ /app/

# Открываем порт 8000, который использует Django
EXPOSE 8000