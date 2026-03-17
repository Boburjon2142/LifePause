## PythonAnywhere deploy

Bu loyiha endi `PythonAnywhere`da bitta Django app sifatida ishlaydi:

- React production build `backend/frontend_dist/` ichiga tushadi
- `index.html` Django tomonidan serve qilinadi
- JS/CSS assetlar `/static/frontend_dist/` orqali serve qilinadi
- API frontend bilan bir domen ostida `/api/` da ishlaydi
- Local developmentda `DEBUG=True` default bo'ladi, PythonAnywhere'da esa env orqali `DEBUG=False` qo'ying

### 1. Serverda build qilish

`PythonAnywhere` Bash console ichida:

```bash
cd ~/lifepause/frontend
npm install
npm run build
```

### 2. Backend dependency va migratsiya

```bash
cd ~/lifepause/backend
pip install -r requirements.txt
export DEBUG=False
python manage.py migrate
python manage.py collectstatic --noinput
```

### 3. Web app static mapping

`PythonAnywhere` Web tab ichida quyidagi static mappingni qo'shing:

```text
URL: /static/frontend_dist/
Directory: /home/<your-pythonanywhere-username>/lifepause/backend/frontend_dist
```

Agar `collectstatic` ishlatsangiz, Django static mapping ham odatdagidek qolishi mumkin:

```text
URL: /static/
Directory: /home/<your-pythonanywhere-username>/lifepause/backend/staticfiles
```

### 4. WSGI reload

Build yoki backend o'zgargandan keyin web app'ni reload qiling.

### 5. Muhim eslatma

- Production API URL endi `frontend/.env.production` ichida `/api/`
- Demak frontend va backend alohida domain talab qilmaydi
- Agar `frontend_dist/index.html` yo'q bo'lsa, Django SPA sahifani ocholmaydi
