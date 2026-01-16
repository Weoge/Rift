FROM python:3.11

WORKDIR /Rift

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --upgrade pip

COPY . .

RUN mkdir -p /Rift/media/avatars /Rift/staticfiles
RUN chmod -R 755 /Rift/media
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "Rift.wsgi:application"]