# 🤖 Arabic NER & AI Contextual Assistant

Une application **Full-Stack intelligente** capable d'extraire des entités nommées (Personnes, Lieux, Organisations) à partir de textes en arabe et de fournir des explications contextuelles via l'IA Générative.

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95+-green)
![AraBERT](https://img.shields.io/badge/Model-AraBERT_v02-yellow)
![Gemini](https://img.shields.io/badge/AI-Google_Gemini-orange)

------------------------------------------------------------------------

## 📌 Présentation du Projet

Ce projet vise à résoudre la complexité du traitement du langage naturel(NLP) pour la langue arabe.\
Il combine : 
- 🧠 Un modèle **Deep Learning (AraBERT)** pour la reconnaissance d'entités nommées (NER). 
- 🤖 Un **LLM (Google Gemini)** pour fournir des réponses contextuelles (RAG).

------------------------------------------------------------------------

## 🚀 Fonctionnalités Clés

-   Reconnaissance d'Entités (NER) :

    -   🟢 Lieux (LOC)
    -   🔵 Organisations (ORG)
    -   🟣 Personnes (PERS)
    -   ⚫ Divers (MISC)

-   Assistant IA Contextuel\
    Cliquez sur une entité pour obtenir une explication générée par Google Gemini.

-   Chatbot Intelligent

    -   Questions générales
    -   Traduction de texte

-   Authentification Sécurisée

    -   Login / Register
    -   Hachage Argon2
    -   JWT Tokens

-   Historique

    -   Sauvegarde automatique des analyses dans MySQL

-   Dashboard Moderne

    -   Interface React
    -   Dark mode

------------------------------------------------------------------------

## 🛠 Architecture Technique

### Intelligence Artificielle

-   Modèle NER : AraBERT v02 (Fine-tuned sur ANERCorp)
-   Frameworks : PyTorch, HuggingFace Transformers
-   Métriques :
    -   Accuracy ≈ 97%
    -   F1-score ≈ 82%
-   LLM : Google Gemini 1.5 / 2.0 Flash

### Backend (API)

-   Langage : Python
-   Framework : FastAPI
-   Base de données : MySQL
-   ORM : SQLAlchemy
-   Authentification : JWT

### Frontend (UI)

-   Framework : React.js (Vite)
-   Style : Tailwind CSS
-   UI : Dashboard dynamique

------------------------------------------------------------------------

## ⚙️ Installation et Configuration

### Prérequis

-   Python 3.8+
-   Node.js + npm
-   MySQL (XAMPP recommandé)
-   Git

------------------------------------------------------------------------

## Backend

``` bash
git clone https://github.com/VOTRE_USERNAME/NOM_DU_REPO.git
cd NOM_DU_REPO/backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
```

### Variables d'environnement

Créer un fichier `.env` dans le dossier backend :

``` env
DATABASE_URL=mysql+pymysql://root:@localhost:3306/ner_db
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GEMINI_API_KEY=YOUR_GOOGLE_API_KEY
```

### Lancer le backend

``` bash
uvicorn main:app --reload
```

Accès : - http://127.0.0.1:8000 - http://127.0.0.1:8000/docs

------------------------------------------------------------------------

## Frontend

``` bash
cd ../frontend
npm install
npm run dev
```

Accès : - http://localhost:5173

------------------------------------------------------------------------

## 📁 Structure du Projet

    PROJET
    ├── backend
    │   ├── app
    │   │   ├── ml_models
    │   │   ├── routers
    │   │   ├── services
    │   │   └── main.py
    │   └── requirements.txt
    │
    ├── frontend
    │   ├── src
    │   │   ├── components
    │   │   └── pages
    │   └── package.json
    │
    └── README.md

------------------------------------------------------------------------

## 📊 Performance du Modèle

-   Dataset : ANERCorp
-   Accuracy : \~97%
-   F1-score : \~82%
-   Validation Loss : 0.13

------------------------------------------------------------------------

## 🤝 Auteur

Mohamed Amine Aabid\
Développeur Full Stack & AI Engineer
