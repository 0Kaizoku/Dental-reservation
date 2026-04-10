# Rapport de Projet de Fin d'Année (PFA)

# Application de Gestion de Cabinet Dentaire — Dental Reservation

---

## Dédicaces

Ce projet est dédié à tous ceux qui ont contribué à son développement, à nos familles et amis pour leur soutien inconditionnel, et à nos enseignants pour leur guidance précieuse tout au long de ce parcours académique.

---

## Remerciements

Nous tenons à exprimer notre profonde gratitude à toutes les personnes qui ont contribué, directement ou indirectement, à la réalisation de ce projet.

Nous remercions particulièrement notre encadrant pour ses conseils avisés, son accompagnement méthodologique et son soutien constant tout au long des différentes phases du projet. Ses orientations ont été déterminantes dans la qualité finale du livrable.

Nous remercions également l'ensemble du corps enseignant pour les connaissances transmises durant notre formation, qui ont constitué le socle technique sur lequel repose ce projet.

Enfin, nous exprimons notre reconnaissance à nos proches pour leur patience, leur compréhension et leur encouragement tout au long de cette aventure.

---

## Abstract

The **Dental Reservation** application is a full-stack web solution designed to streamline the management of dental clinics. It provides secure JWT-based authentication, comprehensive patient record management (CRUD operations on the `pop_personne` table), appointment scheduling with real-time conflict detection, calendar visualization with a weekly grid, available slots management, and an administration dashboard with key performance indicators.

The backend is built with **ASP.NET Core 8** and **Entity Framework Core** connected to a **SQL Server** database, exposing a RESTful API secured by JWT Bearer tokens. The frontend is a **React 18** single-page application written in **TypeScript**, bundled with **Vite**, styled with **TailwindCSS**, and powered by **shadcn/ui** component library. The two tiers communicate via HTTP, with the Vite dev server proxying `/api` requests to the backend. Docker and Docker Compose are used for containerized deployment with an Nginx reverse proxy.

---

## Résumé

L'application **Dental Reservation** est une solution web complète destinée à optimiser la gestion quotidienne des cabinets dentaires. Elle couvre l'ensemble du cycle de vie d'un rendez-vous : de l'authentification sécurisée du praticien jusqu'à la consultation du dossier médical du patient, en passant par la planification, la modification et la suppression des rendez-vous avec détection automatique des conflits de créneaux.

Le backend repose sur **ASP.NET Core 8** avec **Entity Framework Core** et une base de données **SQL Server**, exposant une API RESTful protégée par des jetons JWT. Le frontend est une application monopage **React 18 + TypeScript** construite avec **Vite**, stylisée avec **TailwindCSS** et la bibliothèque de composants **shadcn/ui**. Le déploiement est assuré par **Docker** et **Docker Compose** avec un proxy inverse **Nginx**.

---

## Liste des Acronymes

| Acronyme | Signification |
|----------|---------------|
| **API** | Application Programming Interface |
| **JWT** | JSON Web Token |
| **CRUD** | Create, Read, Update, Delete |
| **UI** | User Interface |
| **SQL** | Structured Query Language |
| **REST** | Representational State Transfer |
| **SPA** | Single Page Application |
| **DTO** | Data Transfer Object |
| **ORM** | Object-Relational Mapping |
| **EF Core** | Entity Framework Core |
| **CORS** | Cross-Origin Resource Sharing |
| **CI/CD** | Continuous Integration / Continuous Deployment |
| **HTTPS** | HyperText Transfer Protocol Secure |
| **CSS** | Cascading Style Sheets |
| **HTML** | HyperText Markup Language |

---

## Liste des Figures

1. Figure 1 — Architecture globale de l'application (client-serveur)
2. Figure 2 — Diagramme de cas d'utilisation
3. Figure 3 — Diagramme de classes
4. Figure 4 — Diagramme de séquence : Authentification
5. Figure 5 — Diagramme de séquence : Gestion des rendez-vous
6. Figure 6 — Diagramme de séquence : Gestion des patients
7. Figure 7 — Diagramme d'activité : Authentification
8. Figure 8 — Diagramme d'activité : Création d'un rendez-vous
9. Figure 9 — Diagramme d'activité : Gestion des patients (CRUD)
10. Figure 10 — Capture d'écran : Page de connexion
11. Figure 11 — Capture d'écran : Tableau de bord (Dashboard)
12. Figure 12 — Capture d'écran : Gestion des patients
13. Figure 13 — Capture d'écran : Gestion des rendez-vous
14. Figure 14 — Capture d'écran : Calendrier hebdomadaire
15. Figure 15 — Capture d'écran : Créneaux disponibles
16. Figure 16 — Capture d'écran : Dossier patient
17. Figure 17 — Capture d'écran : Page de profil

---

## Liste des Tableaux

1. Tableau 1 — Spécifications des besoins fonctionnels
2. Tableau 2 — Spécifications des besoins non fonctionnels
3. Tableau 3 — Spécifications techniques du backend
4. Tableau 4 — Spécifications techniques du frontend
5. Tableau 5 — Endpoints de l'API REST
6. Tableau 6 — Structure de la base de données

---

## Introduction Générale

La gestion d'un cabinet dentaire implique un ensemble de processus complexes : la prise de rendez-vous, la gestion des dossiers patients, le suivi des praticiens et l'administration des créneaux horaires. Les systèmes traditionnels, souvent basés sur des registres papier ou des tableurs, présentent des limitations significatives en termes de fiabilité, de traçabilité et d'efficacité.

Dans un cabinet dentaire, la planification des rendez-vous est une tâche critique. Une mauvaise gestion peut entraîner des conflits de créneaux (deux patients programmés chez le même médecin à la même heure), des temps d'attente excessifs, des oublis de rendez-vous, et une sous-utilisation des ressources (cabinets vides). Ces problématiques affectent directement la qualité du service et la satisfaction des patients.

Par ailleurs, les dossiers patients — contenant les informations personnelles, les antécédents médicaux, les contrats d'assurance et l'historique des consultations — doivent être centralisés, sécurisés et facilement accessibles pour permettre un suivi efficace.

Dans ce contexte, le présent projet vise à concevoir et réaliser une application web moderne baptisée **Dental Reservation**, capable de répondre à l'ensemble de ces besoins. L'application offre une interface intuitive permettant aux praticiens de gérer leurs patients, planifier et modifier les rendez-vous avec détection automatique des conflits, visualiser les créneaux disponibles sur un calendrier hebdomadaire, et consulter les dossiers médicaux — le tout de manière sécurisée grâce à un mécanisme d'authentification par jeton JWT.

Ce rapport décrit le projet dans son intégralité :
- **Chapitre 1** présente le contexte général, l'organisme d'accueil et un aperçu de la solution.
- **Chapitre 2** détaille l'étude fonctionnelle et technique : architecture, besoins et spécifications.
- **Chapitre 3** couvre la conception UML avec les diagrammes de cas d'utilisation, de classes, de séquence et d'activité.
- **Chapitre 4** présente la réalisation, avec une description détaillée de chaque module et fonctionnalité de l'application.

---

## Chapitre 1 : Contexte Général

### 1.1 Organisme d'accueil

Le projet a été réalisé dans le cadre d'un Projet de Fin d'Année (PFA) au sein d'un cabinet dentaire. L'organisme d'accueil est spécialisé dans la prestation de soins dentaires et la gestion des rendez-vous patients. L'objectif principal du stage était de moderniser le système de gestion existant en le remplaçant par une solution numérique performante et ergonomique.

Le cabinet gère quotidiennement un volume important de patients, de rendez-vous et de praticiens. Avant la mise en place de cette application, la gestion se faisait principalement à travers :
- Un registre papier pour les rendez-vous
- Des fiches cartonnées pour les dossiers patients
- Des appels téléphoniques pour la confirmation des rendez-vous

La nécessité d'un outil centralisé s'est imposée pour :
- **Éliminer les erreurs de planification** : doublons de créneaux, conflits horaires entre médecins et cabinets
- **Centraliser les dossiers patients** : accès instantané aux informations personnelles, aux contrats d'assurance et à l'historique des consultations
- **Offrir une vue calendaire claire** de la charge de travail de chaque praticien
- **Permettre un accès sécurisé** à l'application, réservé aux personnels autorisés
- **Automatiser les calculs** : créneaux disponibles, statistiques, âge des patients

### 1.2 Présentation du projet

L'application **Dental Reservation** est une plateforme web full-stack qui permet aux cabinets dentaires de gérer efficacement leurs opérations quotidiennes. Le système couvre les fonctionnalités suivantes :

**Authentification et sécurité :**
- Connexion sécurisée par identifiant (email) et mot de passe
- Génération de jetons JWT avec une durée de validité d'une heure
- Protection de toutes les routes API par le middleware d'autorisation
- Stockage du token côté client dans le `localStorage` du navigateur
- Routes React protégées par un composant `ProtectedRoute` qui redirige les utilisateurs non authentifiés

**Gestion des patients :**
- Création de fiches patients avec informations complètes : nom, prénom, date de naissance, sexe, CIN, matricule, code collectivité, adresse, email, téléphone
- Modification et suppression de patients existants
- Recherche dynamique par nom, prénom, téléphone, email ou matricule
- Consultation du dossier complet d'un patient avec son historique de rendez-vous, triés par date décroissante
- Export du dossier patient en PDF via la fonction d'impression du navigateur
- Statistiques sur le nombre total de patients actifs

**Gestion des rendez-vous :**
- Création de rendez-vous avec sélection du patient (via un composant Combobox recherchable), du médecin, du cabinet, de la date, de l'heure, de la durée et de la nature du soin
- Détection automatique des conflits de créneaux : le serveur vérifie qu'aucun rendez-vous actif n'existe pour le même médecin ou le même cabinet à la même date et heure
- Modification du statut (confirmé, en attente, annulé) et des informations d'un rendez-vous
- Suppression de rendez-vous
- Filtrage par patient, médecin, date et statut

**Calendrier hebdomadaire :**
- Vue sur 7 jours (lundi à dimanche) avec navigation semaine par semaine
- Grille horaire de 08:00 à 17:30 avec pas de 30 minutes
- Affichage des rendez-vous dans les cellules avec code couleur selon le statut (vert = confirmé, jaune = en attente, rouge = annulé)
- Indicateur visuel de l'heure courante (ligne rouge) sur la colonne du jour
- Panneau latéral « Today's Schedule » avec la liste des rendez-vous du jour

**Créneaux disponibles :**
- Grille visuelle des créneaux horaires avec distinction disponible/réservé
- Durée configurable du créneau (15, 30, 45 ou 60 minutes)
- Statistiques de remplissage : total de créneaux, disponibles, réservés, taux d'utilisation
- Réservation rapide au clic sur un créneau disponible

**Profil utilisateur :**
- Consultation et modification des informations du compte
- Changement de mot de passe sécurisé (ancien mot de passe requis)

**Tableau de bord :**
- Métriques clés en temps réel : nombre total de rendez-vous, rendez-vous du jour, nombre de patients, créneaux disponibles
- Liste des rendez-vous récents du jour
- Accès rapide aux fonctionnalités principales via des boutons dédiés

### 1.3 Aperçu de la solution

La solution repose sur une architecture **client-serveur** composée de trois couches principales :

**1. Couche Backend (API REST)**

Développée avec **ASP.NET Core 8**, elle expose une API RESTful sécurisée par JWT Bearer. Le framework utilise **Entity Framework Core** comme ORM pour communiquer avec une base de données **SQL Server**. L'application est structurée selon le pattern MVC (Model-View-Controller) :

- **Models** : 8 entités mappées sur des tables SQL Server — `User` (table `Usercmim`), `PopPersonne` (table `pop_personne`), `PopAdresseP` (table `pop_adresse_p`), `PopContratPersonne` (table `pop_contrat_personne`), `Collectivite` (table `collectivite`), `RdvPatient` (table `tab_RDV_patient`), `RdvPra` (table `tab_RDV_Pra`), `Praticien` (table `Praticien_D`). Des DTOs (`LoginDto`, `PatientDto`, `AssureDto`, `BeneficiaireDto`, `CollectiviteDto`) assurent le transfert de données.
- **Controllers** : 7 contrôleurs — `AuthController`, `PatientsController`, `RendezVousController`, `PraticienController`, `ProfileController`, `InformationController`, `ListeAttenteController`.
- **Data** : `ApplicationDbContext` hérite de `DbContext` et configure les 8 `DbSet` avec les mappings Fluent API.

**2. Couche Frontend (SPA React)**

Construite avec **React 18**, **TypeScript** et **Vite**, elle consomme l'API backend via un service centralisé (`ApiService`). L'interface utilise la bibliothèque de composants **shadcn/ui** basée sur **Radix UI**, stylisée avec **TailwindCSS**. L'application comprend :

- 8 pages principales : Login, Dashboard, Calendar, Appointments, Patients, PatientDossier, AvailableSlots, Profile
- 3 hooks personnalisés : `useAuth` (contexte d'authentification), `useAppointments` (gestion d'état local des RDV), `usePatients` (hook de récupération des patients)
- Composants structurels : `AppSidebar` (navigation), `DashboardLayout` (mise en page), `NotificationsPanel` (notifications)
- Proxy Vite : les requêtes `/api` sont automatiquement redirigées vers `https://localhost:7091`

**3. Infrastructure**

- **Docker** : builds multi-étapes pour le backend (restore → build → publish) et le frontend (npm install → build → Nginx)
- **Docker Compose** : orchestre les deux services (`api` sur port 5057, `frontend` sur port 80)
- **Nginx** : sert les fichiers statiques du frontend et proxy les requêtes `/api` vers le backend
- **GitHub Actions** : pipeline CI/CD pour la construction automatique des images Docker

---

## Chapitre 2 : Étude Fonctionnelle et Technique

### 2.1 Architecture Globale

L'architecture de l'application suit le modèle **client-serveur à 3 niveaux** :

```
┌──────────────────────┐      HTTPS / REST      ┌──────────────────────┐      EF Core / SQL     ┌──────────────────┐
│   Frontend (React)   │ ───────────────────▶  │   Backend (ASP.NET)  │ ──────────────────▶    │   SQL Server     │
│   Vite + TypeScript  │ ◀───────────────────  │   Core 8 Web API     │ ◀──────────────────    │   (CabinetD)     │
│   TailwindCSS        │      JSON responses    │   JWT Authentication │      DbContext         │                  │
│   shadcn/ui          │                        │   Swagger (dev)      │                        │                  │
└──────────────────────┘                        └──────────────────────┘                        └──────────────────┘
         Port 8080                                    Ports 7091 / 5057                               Port 1433
```

**Flux de données détaillé :**

1. L'utilisateur interagit avec l'interface React dans le navigateur web.
2. Le frontend envoie des requêtes HTTP (`GET`, `POST`, `PUT`, `DELETE`) vers l'API backend. En développement, le serveur Vite agit comme proxy, redirigeant les requêtes `/api/*` vers `https://localhost:7091`. En production, Nginx assure ce rôle.
3. Le middleware d'authentification ASP.NET Core intercepte chaque requête et valide le token JWT dans l'en-tête `Authorization: Bearer <token>`. Si le token est absent, expiré ou invalide, le serveur retourne `401 Unauthorized`.
4. Le contrôleur approprié traite la requête en utilisant `ApplicationDbContext` (Entity Framework Core) pour construire des requêtes LINQ qui sont traduites en SQL et exécutées sur la base de données SQL Server `CabinetD`.
5. La réponse JSON est renvoyée au frontend, qui met à jour l'interface réactive via le système de state management de React et le cache React Query.

**Justification des choix technologiques :**

- **ASP.NET Core 8** : framework robuste, performant et bien documenté, avec un support natif de JWT et Swagger.
- **Entity Framework Core** : ORM qui permet d'écrire des requêtes en LINQ au lieu de SQL brut, réduisant les risques d'injection SQL.
- **React 18** : bibliothèque UI la plus populaire, avec un vaste écosystème de composants et d'outils.
- **TypeScript** : typage statique pour détecter les erreurs au moment du développement.
- **Vite** : bundler ultra-rapide avec Hot Module Replacement (HMR) pour un développement fluide.
- **TailwindCSS + shadcn/ui** : design cohérent et accessible sans écrire de CSS personnalisé.
- **React Query** : gestion optimisée de l'état serveur avec cache, revalidation et mutations.

### 2.2 Spécifications des besoins

#### 2.2.1 Besoins fonctionnels

| # | Module | Exigence | Priorité |
|---|--------|----------|----------|
| BF01 | Authentification | L'utilisateur doit pouvoir se connecter avec un email et un mot de passe | Haute |
| BF02 | Authentification | Le système doit générer un token JWT valide 1 heure après connexion réussie | Haute |
| BF03 | Authentification | Les routes protégées doivent être inaccessibles sans token valide | Haute |
| BF04 | Patients | Le praticien doit pouvoir créer un nouveau patient avec toutes ses informations (nom, prénom, date de naissance, sexe, CIN, matricule, email, téléphone, code collectivité, adresse) | Haute |
| BF05 | Patients | Le praticien doit pouvoir modifier les informations d'un patient existant | Haute |
| BF06 | Patients | Le praticien doit pouvoir supprimer un patient | Moyenne |
| BF07 | Patients | Le praticien doit pouvoir rechercher un patient par nom, prénom, téléphone, email ou matricule | Haute |
| BF08 | Patients | Le praticien doit pouvoir consulter le dossier complet d'un patient avec son historique de rendez-vous | Haute |
| BF09 | Patients | Le praticien doit pouvoir imprimer le dossier patient en PDF | Moyenne |
| BF10 | Rendez-vous | Le praticien doit pouvoir créer un rendez-vous en sélectionnant un patient actif, un médecin, un cabinet, une date, une heure, une durée et une nature de soin | Haute |
| BF11 | Rendez-vous | Le système doit détecter automatiquement les conflits de créneaux (même médecin ou même cabinet à la même heure) | Haute |
| BF12 | Rendez-vous | Le praticien doit pouvoir modifier le statut d'un rendez-vous (confirmé, en attente, annulé) | Haute |
| BF13 | Rendez-vous | Le praticien doit pouvoir supprimer un rendez-vous | Moyenne |
| BF14 | Rendez-vous | Le praticien doit pouvoir filtrer les rendez-vous par patient, médecin, date ou statut | Moyenne |
| BF15 | Calendrier | Le praticien doit visualiser les rendez-vous sur un calendrier hebdomadaire avec grille horaire (08:00–17:30, pas de 30 min) | Haute |
| BF16 | Calendrier | Le calendrier doit afficher un code couleur pour les statuts et un indicateur de l'heure courante | Moyenne |
| BF17 | Créneaux | Le praticien doit pouvoir consulter les créneaux disponibles pour une date donnée avec durée configurable | Haute |
| BF18 | Créneaux | Le praticien doit pouvoir réserver directement depuis la grille des créneaux disponibles | Moyenne |
| BF19 | Profil | Le praticien doit pouvoir consulter et modifier ses informations de profil | Basse |
| BF20 | Profil | Le praticien doit pouvoir changer son mot de passe (ancien + nouveau) | Basse |
| BF21 | Dashboard | Le système doit afficher un tableau de bord avec les métriques clés (total rendez-vous, rendez-vous du jour, total patients, créneaux disponibles) | Moyenne |
| BF22 | Dashboard | Le tableau de bord doit proposer des accès rapides aux fonctionnalités principales | Basse |
| BF23 | Informations | Le praticien doit pouvoir consulter les informations d'un bénéficiaire, d'un assuré ou d'une collectivité par matricule ou code | Moyenne |
| BF24 | Liste d'attente | Le système doit afficher la liste d'attente d'un médecin pour une date donnée | Moyenne |

#### 2.2.2 Besoins non fonctionnels

| # | Catégorie | Exigence | Détails |
|---|-----------|----------|---------|
| BNF01 | Sécurité | Authentification JWT | Validation de l'émetteur, de l'audience, de la clé de signature (HMAC-SHA256), et de la durée de vie du token |
| BNF02 | Sécurité | Contrôle d'accès | Toutes les routes API (sauf login) sont protégées par l'attribut `[Authorize]` |
| BNF03 | Sécurité | CORS | Politique ouverte en développement (`AllowAnyOrigin`), configurable pour la production |
| BNF04 | Performance | Temps de réponse | Requêtes API standard traitées en moins de 500ms |
| BNF05 | Performance | Cache client | React Query met en cache les résultats et invalide automatiquement après mutation |
| BNF06 | Performance | Compilation rapide | Vite avec Hot Module Replacement pour un cycle de développement inférieur à 1 seconde |
| BNF07 | Ergonomie | Responsive design | Interface adaptée au desktop et au mobile via les classes utilitaires TailwindCSS |
| BNF08 | Ergonomie | Feedback utilisateur | Notifications toast après chaque action (succès, erreur, info) |
| BNF09 | Ergonomie | Navigation intuitive | Barre latérale rétractable avec icônes et menu utilisateur en haut à droite |
| BNF10 | Maintenabilité | Séparation des responsabilités | Backend : Controllers / Models / DTOs / DbContext. Frontend : Pages / Components / Hooks / Services |
| BNF11 | Maintenabilité | Typage statique | TypeScript pour le frontend, C# pour le backend — détection d'erreurs à la compilation |
| BNF12 | Déployabilité | Conteneurisation | Docker multi-stage builds pour le backend et le frontend |
| BNF13 | Déployabilité | Orchestration | Docker Compose pour le démarrage simultané des services |
| BNF14 | Documentation | API interactive | Swagger UI disponible en environnement de développement avec support JWT |

### 2.3 Spécifications Techniques

#### 2.3.1 Backend — Stack technique

| Composant | Technologie | Version | Rôle |
|-----------|------------|---------|------|
| Framework | ASP.NET Core | 8.0 (LTS) | Framework web principal |
| ORM | Entity Framework Core SqlServer | 9.0.7 | Mapping objet-relationnel |
| Authentification | JwtBearer | 8.0.7 | Middleware d'authentification par token |
| Documentation API | Swashbuckle.AspNetCore | 6.6.2 | Génération Swagger / OpenAPI |
| Base de données | Microsoft SQL Server | 2019+ | Stockage persistant des données |
| Runtime | .NET | 8.0 | Environnement d'exécution |

**Détail des contrôleurs et endpoints :**

| Contrôleur | Route de base | Méthode | Endpoint | Description |
|------------|---------------|---------|----------|-------------|
| `AuthController` | `/api/Auth` | POST | `/login` | Authentification et génération JWT |
| `PatientsController` | `/api/Patients` | GET | `/` | Liste des patients (filtrage optionnel) |
| | | GET | `/{id}` | Détail d'un patient par ID |
| | | GET | `/stats` | Statistiques patients |
| | | GET | `/{id}/dossier` | Dossier complet (info + historique RDV) |
| | | POST | `/` | Création d'un patient |
| | | PUT | `/{id}` | Mise à jour d'un patient |
| | | DELETE | `/{id}` | Suppression d'un patient |
| `RendezVousController` | `/api/RendezVous` | GET | `/` | Liste des rendez-vous (filtrage multiple) |
| | | GET | `/by-matricule/{m}` | RDV par matricule patient |
| | | GET | `/available-slots` | Créneaux disponibles (date, médecin, cabinet) |
| | | GET | `/doctor` | RDV par médecin |
| | | POST | `/` | Création d'un RDV (avec détection conflit) |
| | | PUT | `/{num_rdv}` | Modification d'un RDV |
| | | DELETE | `/{num_rdv}` | Suppression d'un RDV |
| `PraticienController` | `/api/Praticien` | GET | `/` | Liste de tous les praticiens |
| `ProfileController` | `/api/Profile` | GET | `/me` | Profil de l'utilisateur connecté |
| | | PUT | `/me` | Mise à jour du profil |
| | | PUT | `/password` | Changement de mot de passe |
| `InformationController` | `/api/Information` | GET | `/beneficiaire/{m}` | Infos bénéficiaire par matricule |
| | | GET | `/assure/{m}` | Infos assuré par matricule |
| | | GET | `/collectivite/{code}` | Infos collectivité par code |
| `ListeAttenteController` | `/api/ListeAttente` | GET | `/by-doctor-date` | Liste d'attente par médecin et date |

#### 2.3.2 Frontend — Stack technique

| Composant | Technologie | Version | Rôle |
|-----------|------------|---------|------|
| Framework UI | React | 18.x | Bibliothèque de composants réactifs |
| Langage | TypeScript | 5.x | Typage statique |
| Bundler | Vite | 5.x | Build et dev server avec HMR |
| Styles | TailwindCSS | 3.x | Framework CSS utilitaire |
| Composants UI | shadcn/ui (Radix UI) | Dernière | Composants accessibles et personnalisables |
| État serveur | TanStack React Query | 5.56+ | Cache, synchronisation, mutations |
| Routage | React Router DOM | 6.x | Navigation SPA |
| Icônes | Lucide React | 0.462+ | Bibliothèque d'icônes SVG |
| Date | date-fns | 3.x | Manipulation de dates |
| Formulaires | React Hook Form + Zod | — | Gestion et validation de formulaires |

**Architecture des pages :**

| Page | Fichier | Route | Description |
|------|---------|-------|-------------|
| Login | `Login.tsx` | `/` | Formulaire de connexion (email + mot de passe) |
| Dashboard | `Dashboard.tsx` | `/dashboard` | Tableau de bord avec métriques et accès rapides |
| Calendar | `Calendar.tsx` | `/calendar` | Vue calendaire hebdomadaire avec grille horaire |
| Appointments | `Appointments.tsx` | `/appointments` | Gestion CRUD complète des rendez-vous |
| Patients | `Patients.tsx` | `/patients` | Gestion CRUD complète des patients |
| Patient Dossier | `PatientDossier.tsx` | `/patients/:id/dossier` | Dossier individuel avec historique des rendez-vous |
| Available Slots | `AvailableSlots.tsx` | `/slots` | Grille de créneaux avec réservation directe |
| Profile | `Profile.tsx` | `/profile` | Consultation et modification du profil |

#### 2.3.3 Structure de la base de données

| Table | Clé primaire | Colonnes principales | Description |
|-------|-------------|---------------------|-------------|
| `Usercmim` | `username` (varchar) | lastName, password, userType | Comptes utilisateurs (praticiens) |
| `pop_personne` | `Id Num Personne` (int, auto) | NomPer, PrenomPer, DteNaisPer, SexePer, CIN, NumSecuOdPer, CodeCollectivite, Email, Phone | Fiches patients |
| `pop_adresse_p` | `Id Num Adresse Per` (int) | LibAdresse | Adresses des patients |
| `pop_contrat_personne` | `Id_Num_Personne_Ctt` (int) | — | Contrats d'assurance |
| `collectivite` | `CodeCollectivite` (varchar) | RaisonSociale, Adresse, Ville, Region | Organismes / collectivités |
| `tab_RDV_patient` | `num_rdv` (int, auto) | Id_personne, DateRdv, Heure, DureeRdv, NomPs, Cabinet, NatureSoin, Status, Notes | Rendez-vous patients |
| `tab_RDV_Pra` | Keyless | DateRDV, HeureDebut, HeureFin, NomPra, IdRDV | Planning praticiens (vue) |
| `Praticien_D` | `cod_pra` (varchar) | NomPra, CodePs | Référentiel praticiens |

---

## Chapitre 3 : Conception

La conception de l'application a été réalisée à l'aide de diagrammes UML normalisés, générés avec l'outil **PlantUML**. Les fichiers source `.puml` sont disponibles dans le dossier `diagrams/` du projet. Les diagrammes couvrent quatre types de modélisation : cas d'utilisation, classes, séquence et activité.

### 3.1 Diagramme de Cas d'Utilisation

*(Voir Figure 2 — fichier `diagrams/use_case_diagram.puml`)*

Le diagramme de cas d'utilisation identifie deux acteurs principaux et modélise l'ensemble des interactions possibles avec le système :

**Acteurs :**
- **Utilisateur non authentifié (Guest)** : ne peut accéder qu'à la page de connexion.
- **Praticien (Administrateur)** : après authentification, a accès à l'ensemble des fonctionnalités de l'application.

**Packages de cas d'utilisation :**

1. **Authentification**
   - *Se connecter* : l'utilisateur saisit son email et mot de passe
   - *Générer Token JWT* (<<include>>) : le système génère automatiquement un token JWT après authentification réussie

2. **Gestion des Patients**
   - *Consulter la liste des patients* : affichage tabulaire avec filtrage
   - *Rechercher un patient* : recherche par nom, prénom ou matricule
   - *Consulter le dossier d'un patient* : informations complètes + historique des rendez-vous
   - *Ajouter un patient* : formulaire de création avec validation
   - *Modifier un patient* : mise à jour partielle des informations
   - *Supprimer un patient* : suppression avec confirmation
   - *Consulter les statistiques* : nombre total de patients

3. **Gestion des Rendez-vous**
   - *Consulter la liste des rendez-vous* : affichage tabulaire avec filtres multiples
   - *Créer un rendez-vous* : formulaire avec sélection patient/médecin/cabinet → inclut *Vérifier les conflits de créneaux*
   - *Modifier un rendez-vous* : mise à jour des informations et du statut
   - *Supprimer un rendez-vous* : suppression avec confirmation
   - *Consulter les créneaux disponibles* : grille horaire visuelle
   - *Filtrer les rendez-vous* : par date, médecin, patient ou statut

4. **Gestion du Profil**
   - *Consulter le profil* : informations du compte connecté
   - *Modifier le profil* : mise à jour du nom
   - *Changer le mot de passe* : ancien + nouveau mot de passe

5. **Informations**
   - *Consulter les informations d'un bénéficiaire* : par matricule
   - *Consulter les informations d'un assuré* : par matricule
   - *Consulter les informations d'une collectivité* : par code

6. **Gestion des Praticiens**
   - *Consulter la liste des praticiens* : référentiel des médecins

7. **Liste d'attente**
   - *Consulter la liste d'attente par médecin et date* : rendez-vous en attente

### 3.2 Diagramme de Classes

*(Voir Figure 3 — fichier `diagrams/class_diagram.puml`)*

Le diagramme de classes modélise l'ensemble des entités du système, leurs attributs, leurs méthodes et les relations entre elles. Il est organisé en quatre catégories :

#### 3.2.1 Entités (mapping base de données)

- **User** → table `Usercmim`
  - Attributs : `username` (PK, string), `lastName` (string), `password` (string), `userType` (string)
  - Rôle : stocke les identifiants des praticiens

- **PopPersonne** → table `pop_personne`
  - Attributs : `IdNumPersonne` (PK, int, auto-incrémenté), `NomPer`, `PrenomPer`, `DteNaisPer` (DateTime), `SexePer` (string), `CIN` (string), `NumSecuOdPer` (string, matricule), `CodeCollectivite` (string), `Email`, `Phone`
  - Rôle : entité centrale représentant un patient avec toutes ses informations personnelles

- **PopAdresseP** → table `pop_adresse_p`
  - Attribut : `IdNumAdressePer` (PK, int), `LibAdresse` (string)
  - Rôle : adresse postale du patient

- **PopContratPersonne** → table `pop_contrat_personne`
  - Attribut : `IdNumPersonneCtt` (PK, int)
  - Rôle : contrat d'assurance associé au patient

- **Collectivite** → table `collectivite`
  - Attributs : `CodeCollectivite` (PK, string), `RaisonSociale`, `Adresse`, `Ville`, `Region`
  - Rôle : organisme ou collectivité d'appartenance du patient

- **RdvPatient** → table `tab_RDV_patient`
  - Attributs : `NumRdv` (PK, int, auto), `IdPersonne` (int, FK), `DateRdv` (DateOnly), `Heure` (TimeOnly), `DureeRdv` (int), `NomPs` (string, médecin), `Cabinet` (string), `NatureSoin` (string), `Status` (string), `Notes` (string)
  - Rôle : rendez-vous d'un patient avec toutes les informations de la consultation

- **RdvPra** → table `tab_RDV_Pra` (Keyless — pas de clé primaire)
  - Attributs : `DateRDV`, `HeureDebut`, `HeureFin`, `NomPra`, `IdRDV`
  - Rôle : vue ou table de planification des praticiens

- **Praticien** → table `Praticien_D`
  - Attributs : `CodPra` (PK, string), `NomPra` (string), `CodePs` (string)
  - Rôle : référentiel des praticiens avec leur code et nom

#### 3.2.2 DTOs (Data Transfer Objects)

- **LoginDto** : `username`, `password` — utilisé pour la requête de connexion
- **PatientDto** : `nom`, `prenom`, `dateNaissance`, `sexe`, `cin`, `matricule`, etc. — utilisé pour la création/mise à jour de patient
- **AssureDto** : informations de l'assuré (personne, adresse, contrat)
- **BeneficiaireDto** : informations du bénéficiaire
- **CollectiviteDto** : informations de la collectivité

#### 3.2.3 Relations entre les classes

- `PopPersonne` **1 ── 0..1** `PopAdresseP` : chaque patient peut avoir une adresse
- `PopPersonne` **1 ── 0..1** `PopContratPersonne` : chaque patient peut avoir un contrat d'assurance
- `PopPersonne` **0..* ── 0..1** `Collectivite` : plusieurs patients peuvent appartenir à une collectivité
- `PopPersonne` **1 ── 0..\*** `RdvPatient` : un patient a zéro ou plusieurs rendez-vous
- `Praticien` **1 ── 0..\*** `RdvPra` : un praticien a zéro ou plusieurs planifications
- Tous les contrôleurs dépendent de `ApplicationDbContext` (injection de dépendance)
- `ApplicationDbContext` possède un `DbSet<T>` pour chaque entité

### 3.3 Diagrammes de Séquence

Trois diagrammes de séquence décrivent les interactions entre les composants principaux du système pour les scénarios les plus importants.

#### 3.3.1 Séquence d'authentification

*(Voir Figure 4 — fichier `diagrams/sequence_authentification.puml`)*

Le flux d'authentification implique quatre participants : **Utilisateur**, **Frontend React**, **AuthController** et **Base de données SQL Server**.

**Scénario nominal (succès) :**
1. L'utilisateur ouvre la page Login et saisit son email et son mot de passe dans les champs du formulaire.
2. Au clic sur « Sign in », le composant `Login.tsx` appelle `apiService.login(email, password)`.
3. Le service API envoie une requête `POST /api/Auth/login` avec le corps JSON `{username: email, password: password}`.
4. Le `AuthController` exécute une requête LINQ : `dbContext.Users.FirstOrDefault(u => u.username == loginDto.username)`.
5. Si l'utilisateur existe, le contrôleur compare `loginDto.password` avec `user.password`.
6. Si les mots de passe correspondent, le contrôleur crée un `JwtSecurityToken` avec :
   - Claim : `ClaimTypes.Name = user.username`
   - Expiration : `DateTime.Now.AddHours(1)`
   - Signing key : HMAC-SHA256 avec la clé définie dans `appsettings.json > Jwt:Key`
7. Le token est sérialisé et renvoyé dans la réponse `200 OK` : `{token: "eyJhbG...", user: {username, lastName, userType}}`.
8. Le frontend stocke le token dans `localStorage.setItem('token', token)` et l'utilisateur dans `localStorage.setItem('user', JSON.stringify(user))`.
9. Le `AuthContext` met à jour l'état `isAuthenticated = true` et navigue vers `/dashboard`.

**Scénario alternatif (échec) :**
- Si l'utilisateur n'existe pas ou si le mot de passe est incorrect → réponse `401 Unauthorized` avec message d'erreur.
- Le frontend affiche une notification toast rouge avec le message d'erreur.

#### 3.3.2 Séquence de gestion des rendez-vous

*(Voir Figure 5 — fichier `diagrams/sequence_rendez_vous.puml`)*

Ce diagramme couvre quatre opérations principales :

**1. Consulter les créneaux disponibles :**
- Le frontend appelle `GET /api/RendezVous/available-slots?date=...&doctor=...&cabinet=...`
- Le contrôleur génère la grille complète des créneaux de 08:00 à 17:30 avec un pas de 30 minutes
- Il récupère les rendez-vous existants pour la date donnée (médecin et/ou cabinet)
- Il retourne la différence : créneaux totaux - créneaux réservés = créneaux disponibles

**2. Créer un rendez-vous :**
- Le praticien remplit le formulaire (patient, médecin, cabinet, date, heure, durée, nature du soin)
- Le frontend envoie `POST /api/RendezVous` avec les données
- Le contrôleur vérifie les conflits :
  - Conflit médecin : `dbContext.RdvPatients.Any(r => r.NomPs == rdv.NomPs && r.DateRdv == rdv.DateRdv && r.Heure == rdv.Heure && r.Status != "canceled")`
  - Conflit cabinet : `dbContext.RdvPatients.Any(r => r.Cabinet == rdv.Cabinet && r.DateRdv == rdv.DateRdv && r.Heure == rdv.Heure && r.Status != "canceled")`
- Si conflit → `409 Conflict` avec message explicatif
- Si pas de conflit → insertion avec statut initial « pending » → `201 Created`

**3. Modifier un rendez-vous :**
- Le praticien modifie les champs dans la modale d'édition
- `PUT /api/RendezVous/{num_rdv}` → même logique de vérification de conflits → mise à jour

**4. Supprimer un rendez-vous :**
- Confirmation par l'utilisateur → `DELETE /api/RendezVous/{num_rdv}` → `204 No Content`

#### 3.3.3 Séquence de gestion des patients

*(Voir Figure 6 — fichier `diagrams/sequence_patients.puml`)*

Ce diagramme illustre les opérations CRUD complètes sur l'entité `PopPersonne` :

**1. Consulter la liste :**
- `GET /api/Patients?search=...` → le contrôleur applique un filtre optionnel sur `NomPer` et `PrenomPer`
- Chaque entité `PopPersonne` est mappée en `PatientDto` avec calcul dynamique du genre basé sur `SexePer` (M/Mr → Male, Mme/Mlle → Female)
- La dernière visite est récupérée depuis `tab_RDV_patient`

**2. Consulter le dossier :**
- `GET /api/Patients/{id}/dossier` → récupération du patient + tous ses rendez-vous triés par `DateRdv` décroissante
- Retour d'un objet contenant les infos patient et la liste des rendez-vous

**3. Ajouter un patient :**
- Le praticien remplit la modale avec 16 champs
- `POST /api/Patients` avec le `PatientDto` → création de l'entité `PopPersonne` → sauvegarde → retour du DTO créé

**4. Modifier un patient :**
- `PUT /api/Patients/{id}` → recherche par ID → mise à jour partielle des champs fournis (seuls les champs non-null sont modifiés)

**5. Supprimer un patient :**
- `DELETE /api/Patients/{id}` → recherche → suppression → `204 No Content`

### 3.4 Diagrammes d'Activité

Les diagrammes d'activité modélisent les flux de contrôle avec les points de décision pour les processus les plus importants.

#### 3.4.1 Activité d'authentification

*(Voir Figure 7 — fichier `diagrams/activity_authentification.puml`)*

Le diagramme montre le flux décisionnel complet :

```
[Début] → Saisie email et mot de passe → Envoi POST /api/Auth/login
       → [Décision] Utilisateur trouvé en BDD ?
           ├─ NON → Afficher erreur « Unauthorized » → [Fin]
           └─ OUI → [Décision] Mot de passe correct ?
                       ├─ NON → Afficher erreur « Unauthorized » → [Fin]
                       └─ OUI → Générer token JWT (1h)
                              → Stocker token dans localStorage
                              → Rediriger vers Dashboard → [Fin]
```

#### 3.4.2 Activité de création d'un rendez-vous

*(Voir Figure 8 — fichier `diagrams/activity_rendez_vous.puml`)*

Le flux de création avec les points de décision multiples :

```
[Début] → Ouvrir formulaire de création
       → Sélectionner patient, médecin, cabinet
       → Choisir date et heure
       → [Décision] Date et heure renseignées ?
           ├─ NON → Afficher message de validation → Retour au formulaire
           └─ OUI → Vérifier conflit médecin (même médecin, même date, même heure, statut ≠ canceled)
                   → [Décision] Conflit médecin ?
                       ├─ OUI → Afficher erreur 409 « Conflit médecin » → [Fin]
                       └─ NON → Vérifier conflit cabinet
                               → [Décision] Conflit cabinet ?
                                   ├─ OUI → Afficher erreur 409 « Conflit cabinet » → [Fin]
                                   └─ NON → Insérer RDV avec statut « pending »
                                          → Notification toast succès
                                          → Fermer modale → [Fin]
```

#### 3.4.3 Activité de gestion des patients (CRUD)

*(Voir Figure 9 — fichier `diagrams/activity_patients.puml`)*

Le diagramme présente les quatre opérations CRUD en parallèle avec des partitions (swimlanes) :

- **Partition Consulter** : Charger la liste → Appliquer filtres (recherche, statut, matricule) → Afficher tableau
- **Partition Ajouter** : Ouvrir modale → Remplir formulaire (16 champs) → Valider → POST API → Rafraîchir liste
- **Partition Modifier** : Sélectionner patient → Ouvrir modale pré-remplie → Modifier champs → PUT API → Rafraîchir liste
- **Partition Supprimer** : Sélectionner patient → Confirmer → DELETE API → Rafraîchir liste

---

## Chapitre 4 : Réalisation

### 4.1 Introduction

La phase de réalisation a consisté à implémenter l'ensemble des fonctionnalités spécifiées dans l'étude fonctionnelle et technique, et modélisées dans les diagrammes UML. Le développement a suivi une approche itérative, en commençant par la couche backend (API et base de données), puis la couche frontend (interface utilisateur). Cette section présente en détail chaque module développé avec des explications techniques approfondies.

L'environnement de développement comprend :
- **IDE** : Visual Studio Code avec les extensions C#, TypeScript, Tailwind CSS IntelliSense
- **Backend** : `dotnet run` (port HTTPS 7091, HTTP 5057)
- **Frontend** : `npm run dev` (port 8080, proxy vers le backend)
- **Base de données** : SQL Server LocalDB (`(localdb)\MSSQLLocalDB`, base `CabinetD`)

### 4.2 Sécurité : Authentification et Contrôle d'accès

La sécurité de l'application repose sur le standard **JSON Web Token (JWT)**, un mécanisme d'authentification stateless largement adopté dans les architectures REST modernes.

#### 4.2.1 Configuration JWT côté backend

Dans le fichier `Program.cs`, le middleware d'authentification ASP.NET Core est configuré au démarrage de l'application :

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["Jwt:Issuer"],
            ValidAudience = configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))
        };
    });
```

Les paramètres JWT sont stockés dans `appsettings.json` :
- `Jwt:Key` : clé secrète HMAC-SHA256 pour la signature du token
- `Jwt:Issuer` : identifiant de l'émetteur (le backend)
- `Jwt:Audience` : identifiant de l'audience (le frontend)

Le `AuthController` expose un unique endpoint `POST /api/Auth/login` qui :
1. Reçoit un `LoginDto` contenant `username` et `password`.
2. Recherche l'utilisateur dans la table `Usercmim` par `username`.
3. Compare le mot de passe fourni avec celui stocké en base.
4. Si valide, crée un `SecurityTokenDescriptor` avec un claim `ClaimTypes.Name = user.username`, une expiration de 1 heure, et une signature HMAC-SHA256.
5. Retourne le token JWT sérialisé et les informations utilisateur.

#### 4.2.2 Protection côté frontend

Le frontend utilise un **pattern Provider/Context** (React Context API) pour gérer l'authentification de manière globale :

- **`AuthProvider`** (`use-auth.tsx`) : enveloppe toute l'application et expose via le contexte :
  - `user` : l'utilisateur connecté (ou null)
  - `isAuthenticated` : booléen dérivé de la présence du token
  - `login(email, password)` : appelle l'API, stocke le token et l'utilisateur dans `localStorage`
  - `logout()` : supprime le token et l'utilisateur du `localStorage`, redirige vers la page de connexion
  - `updateUser(userData)` : met à jour les données utilisateur locales

- **`ProtectedRoute`** : composant wrapper qui vérifie `isAuthenticated`. Si l'utilisateur n'est pas connecté, il est automatiquement redirigé vers `/` (page Login).

- **`ApiService.getAuthHeaders()`** : méthode privée qui injecte automatiquement l'en-tête `Authorization: Bearer <token>` dans chaque requête API.

#### 4.2.3 Swagger avec authentification

En environnement de développement (`app.Environment.IsDevelopment()`), Swagger UI est activé avec un bouton « Authorize » permettant de saisir le token JWT. La configuration Swagger inclut un `SecurityDefinition` de type Bearer et un `SecurityRequirement` global, ce qui permet de tester tous les endpoints protégés directement depuis l'interface Swagger.

### 4.3 Gestion des requêtes et communication client-serveur

#### 4.3.1 Service API centralisé

Toute la communication entre le frontend et le backend est centralisée dans la classe **`ApiService`** (`src/lib/api.ts`). Cette classe fournit une abstraction de haut niveau sur l'API Fetch du navigateur :

**Méthodes d'authentification :**
- `login(email, password)` → `POST /api/Auth/login`
- `logout()` → suppression du token du `localStorage`
- `isAuthenticated()` → vérification de la présence du token
- `getToken()` → récupération du token
- `getAuthHeaders()` → construction de l'en-tête `Authorization`

**Méthodes patients :**
- `getPatients(search?)` → `GET /api/Patients?search=...`
- `createPatient(data)` → `POST /api/Patients`
- `updatePatient(id, data)` → `PUT /api/Patients/{id}`
- `deletePatient(id)` → `DELETE /api/Patients/{id}`
- `getPatientStats()` → `GET /api/Patients/stats`
- `getPatientDossier(id)` → `GET /api/Patients/{id}/dossier`

**Méthodes rendez-vous :**
- `getAppointments(filters?)` → `GET /api/RendezVous` avec query string
- `createAppointment(data)` → `POST /api/RendezVous`
- `updateAppointment(id, data)` → `PUT /api/RendezVous/{id}`
- `deleteAppointment(id)` → `DELETE /api/RendezVous/{id}`
- `getAvailableSlots(date, doctor?, cabinet?)` → `GET /api/RendezVous/available-slots`

**Méthodes profil :**
- `getProfile()` → `GET /api/Profile/me`
- `updateProfile(data)` → `PUT /api/Profile/me`
- `changePassword(oldPassword, newPassword)` → `PUT /api/Profile/password`

Chaque méthode gère automatiquement :
- L'injection des headers d'authentification
- Le `Content-Type: application/json`
- Le parsing de la réponse JSON
- La levée d'exceptions en cas d'erreur HTTP

#### 4.3.2 Gestion du cache avec React Query

Le frontend utilise **TanStack React Query** pour optimiser les interactions avec l'API :

- **Queries** (`useQuery`) : les données sont mises en cache avec des clés uniques (ex : `["patients"]`, `["appointments"]`, `["availableSlots", date]`). Le cache évite les requêtes réseau redondantes et améliore la réactivité de l'interface.

- **Mutations** (`useMutation`) : les opérations d'écriture (création, modification, suppression) sont encapsulées dans des mutations qui :
  - Appellent l'API via `ApiService`
  - Invalident automatiquement les caches associés via `queryClient.invalidateQueries()` après succès
  - Déclenchent des notifications toast de succès ou d'erreur
  - Gèrent les états de chargement (`isPending`)

Exemple de flux : lorsqu'un patient est créé, la mutation appelle `apiService.createPatient()`, puis invalide la clé `["patients"]`, ce qui déclenche automatiquement un rechargement de la liste des patients dans le tableau.

#### 4.3.3 Détection des conflits de rendez-vous

La détection des conflits est implémentée côté serveur dans le `RendezVousController` pour garantir l'intégrité des données :

**Conflit médecin :** Le système vérifie qu'aucun rendez-vous actif (statut ≠ « canceled ») n'existe pour le même médecin (`NomPs`), à la même date (`DateRdv`) et heure (`Heure`). Si un tel rendez-vous existe, le serveur retourne `409 Conflict` avec le message « Ce médecin a déjà un rendez-vous à cette heure ».

**Conflit cabinet :** De manière similaire, le système vérifie qu'aucun rendez-vous actif n'existe pour le même cabinet, à la même date et heure. Si conflit → `409 Conflict` avec le message « Ce cabinet est déjà occupé à cette heure ».

Cette double vérification garantit qu'un médecin ne peut pas avoir deux consultations simultanées et qu'un cabinet ne peut pas être utilisé par deux médecins en même temps.

### 4.4 Notifications et retour utilisateur

L'application implémente un système de notifications visuelles basé sur les composants **Toast** de shadcn/ui :

- **Notifications toast** : chaque action utilisateur (création, modification, suppression, erreur) déclenche une notification toast éphémère qui apparaît en haut à droite de l'écran. Les toasts sont colorés selon le type : vert pour le succès, rouge pour les erreurs, bleu pour les informations.

- **Panneau de notifications** (`NotificationsPanel.tsx`) : accessible via l'icône cloche dans la barre de navigation supérieure, il affiche l'historique complet des notifications de la session avec :
  - Titre et description de chaque notification
  - Horodatage relatif (« il y a 2 minutes »)
  - Bouton pour effacer toutes les notifications
  - Badge rouge sur l'icône cloche indiquant le nombre de notifications non lues

### 4.5 Interface d'administration — Pages de l'application

#### 4.5.1 Page de connexion (Login)

*(Voir Figure 10)*

La page de connexion (`Login.tsx`) est la porte d'entrée de l'application. Elle présente :
- Un arrière-plan avec un dégradé bleu-violet et des formes géométriques floutées (effet glassmorphism)
- Une carte centrale contenant :
  - Le logo de l'application avec le nom « DentalCare »
  - Le titre « Sign in to your account »
  - Un champ « Email address » (type email, requis)
  - Un champ « Password » (type password, requis)
  - Un bouton « Sign in » avec animation de chargement (spinner) pendant la requête
- Gestion des erreurs : si l'authentification échoue, un toast rouge s'affiche avec le message d'erreur du serveur
- Redirection automatique vers `/dashboard` après connexion réussie

#### 4.5.2 Tableau de bord (Dashboard)

*(Voir Figure 11)*

Le Dashboard (`Dashboard.tsx`) est la page d'accueil après connexion. Il offre une vue synthétique de l'activité du cabinet :

**Cartes de statistiques (4 indicateurs clés) :**
| Carte | Icône | Donnée | Couleur |
|-------|-------|--------|---------|
| Total Appointments | Calendar | Nombre total de RDV en base | Bleu |
| Today's Appointments | Clock | RDV du jour courant | Vert |
| Total Patients | Users | Nombre de patients actifs | Violet |
| Available Slots | CheckCircle | Créneaux libres aujourd'hui | Orange |

Les données sont récupérées dynamiquement via trois requêtes API parallèles (`getAppointments`, `getPatientStats`, `getAvailableSlots`).

**Section « Recent Appointments » :** affiche les 6 premiers rendez-vous du jour sous forme de cartes avec :
- Nom du patient et type de soin
- Heure du rendez-vous
- Badge de statut (confirmed = vert, pending = jaune, canceled = rouge)

**Section « Quick Actions » :** quatre boutons d'accès rapide :
- ➕ New Appointment → `/appointments`
- 👤 Add Patient → `/patients`
- 📅 View Calendar → `/calendar`
- ⏰ Manage Slots → `/slots`

#### 4.5.3 Gestion des patients (Patients)

*(Voir Figure 12)*

La page Patients (`Patients.tsx`) offre une interface complète de gestion CRUD :

**Barre d'outils :**
- Bouton « + New Patient » ouvrant une modale (Dialog) de création
- Champ de recherche avec filtrage en temps réel (côté client) par nom, téléphone, email
- Filtre « Filter by Matricule » (sélection dans une liste)
- Filtre « Filter by Status » (All, Active, New, Inactive)

**Tableau des patients :**
| Colonne | Description |
|---------|-------------|
| Name | Nom complet (prénom + nom) |
| Age | Calculé dynamiquement à partir de la date de naissance |
| Gender | Badge coloré (Male = bleu, Female = rose, Autre = gris) |
| Last Visit | Dernière date de rendez-vous |
| Status | Badge (Active = vert, New = bleu, Inactive = gris) |
| Phone | Numéro de téléphone |
| Email | Adresse email |
| Actions | 3 boutons icônes : Dossier, Éditer, Supprimer |

**Modale de création/édition :** formulaire à 2 colonnes avec 16 champs :
- Nom, Prénom (obligatoires)
- Date de naissance, Sexe (sélection : M, Mme, Mlle, Mr)
- CIN, Matricule
- Code collectivité
- Adresse
- Email, Téléphone
- Notes (zone de texte)
- Code PS, Cabinet

La modale d'édition est pré-remplie avec les données existantes du patient.

**Suppression :** dialogue de confirmation avant suppression définitive.

#### 4.5.4 Gestion des rendez-vous (Appointments)

*(Voir Figure 13)*

La page Appointments (`Appointments.tsx`) offre la gestion complète des rendez-vous :

**Barre d'outils :**
- Bouton « + New Appointment » ouvrant une modale de création
- Champ de recherche
- Filtre par statut (All, Confirmed, Pending, Canceled)

**Modale de création :** La fonctionnalité la plus riche de l'application :
- **Sélection du patient** : composant Combobox (Popover + Command) avec recherche en temps réel dans la liste des patients actifs. Les patients sont affichés avec leur nom complet et leur matricule.
- **Médecin** (Doctor) : champ texte
- **Cabinet** : champ texte
- **Date** : sélecteur de date
- **Heure** : sélecteur d'heure (format HH:mm)
- **Durée** : sélection (15, 30, 45, 60 minutes)
- **Statut** : sélection (pending, confirmed, canceled)
- **Nature du soin** : champ texte libre
- **Notes** : zone de texte optionnelle

**Tableau des rendez-vous :**
| Colonne | Description |
|---------|-------------|
| Patient | Nom complet du patient |
| Doctor | Nom du médecin |
| Cabinet | Nom du cabinet |
| Date & Time | Date et heure formatées |
| Type | Nature du soin |
| Duration | Durée en minutes |
| Status | Badge coloré (confirmed/pending/canceled) |
| Actions | Éditer, Supprimer |

La modale d'édition permet de modifier tous les champs, y compris le statut.

#### 4.5.5 Calendrier hebdomadaire (Calendar)

*(Voir Figure 14)*

La page Calendar (`Calendar.tsx`) offre une visualisation temporelle des rendez-vous :

**Navigation :**
- Boutons « ← » et « → » pour naviguer semaine par semaine
- Affichage du mois courant avec indicateur « This week » si la semaine contient aujourd'hui
- Bouton « Today » pour revenir à la semaine courante

**Grille principale :**
- Axe Y : créneaux horaires de 08:00 à 17:30 (20 lignes de 30 minutes)
- Axe X : 7 jours (lundi à dimanche) avec date et numéro du jour
- En-tête du jour courant surligné avec un indicateur bleu
- Les rendez-vous sont affichés comme des étiquettes dans les cellules correspondantes avec :
  - Bordure latérale colorée (vert/jaune/rouge selon le statut)
  - Nom du patient et nature du soin
  - Taille tronquée si le texte est trop long

**Indicateur de l'heure courante :** une ligne rouge horizontale est affichée sur la grille à la position correspondant à l'heure actuelle, uniquement sur la colonne du jour courant. La position est mise à jour dynamiquement.

**Panneau latéral « Today's Schedule » :**
- Liste des rendez-vous du jour avec heure, nom du patient, type de soin et badge de statut
- Si aucun rendez-vous : message « No appointments scheduled for today »

**Panneau « Quick Stats » :**
- Total d'aujourd'hui : nombre de rendez-vous du jour
- Premier créneau : heure du premier rendez-vous

#### 4.5.6 Créneaux disponibles (Available Slots)

*(Voir Figure 15)*

La page Available Slots (`AvailableSlots.tsx`) permet de visualiser et réserver les créneaux horaires :

**Navigation par date :**
- Boutons précédent/suivant pour changer de jour
- Affichage de la date sélectionnée (ex : « Monday, January 15, 2025 »)
- Bouton « Today » pour revenir au jour courant

**Panneau de configuration latéral :**
- **Slot Duration** : durée du créneau configurable (15, 30, 45 ou 60 minutes) via des boutons radio
- **Statistics** : métriques du jour sélectionné :
  - Total Slots : nombre total de créneaux dans la journée
  - Available : créneaux libres (en vert)
  - Booked : créneaux réservés (en rouge)
  - Utilization : taux d'occupation en pourcentage

**Grille des créneaux :**
- Affichage sous forme de grille responsive (4 colonnes sur desktop)
- Chaque créneau affiche l'heure de début et de fin
- Créneaux disponibles : fond vert clair, icône ✓, cliquable
- Créneaux réservés : fond gris, icône ✗, nom du patient et du médecin affichés

**Réservation rapide :** au clic sur un créneau disponible, une modale s'ouvre avec :
- L'heure pré-remplie
- Sélection du patient, médecin, cabinet
- Durée et nature du soin
- Bouton de confirmation

#### 4.5.7 Dossier patient (Patient Dossier)

*(Voir Figure 16)*

La page PatientDossier (`PatientDossier.tsx`) affiche le dossier complet d'un patient :

**En-tête :**
- Bouton « ← Retour à la liste » (navigation vers `/patients`)
- Nom complet du patient et badge de genre
- Bouton « 🖨 Imprimer PDF » qui déclenche `window.print()` avec une feuille de style `@media print` dédiée

**Carte d'informations personnelles :**
| Champ | Description |
|-------|-------------|
| Date of Birth | Date de naissance formatée |
| Last Visit | Date de la dernière consultation |
| Next Appointment | Prochain rendez-vous planifié |
| Phone | Numéro de téléphone |
| Email | Adresse email |

**Historique des rendez-vous :**
Tableau chronologique avec :
| Colonne | Description |
|---------|-------------|
| Date | Date du rendez-vous |
| Time | Heure du rendez-vous |
| Doctor | Nom du médecin |
| Type | Nature du soin |
| Status | Badge coloré |

L'historique est trié par date décroissante (plus récent en premier).

**Export PDF :** la feuille de style `@media print` masque les éléments de navigation (sidebar, barre de navigation, boutons d'action) et optimise la mise en page pour l'impression. Le praticien peut ainsi générer un document PDF propre du dossier patient.

#### 4.5.8 Profil utilisateur (Profile)

*(Voir Figure 17)*

La page Profile (`Profile.tsx`) permet au praticien de gérer son compte :

**Section « Profile Information » :**
- Champs : Email (lecture seule), Last Name (modifiable)
- Bouton « Update Profile » pour sauvegarder les modifications

**Section « Change Password » :**
- Champ « Current Password » (requis)
- Champ « New Password » (requis)
- Bouton « Change Password »
- Validation côté serveur : le mot de passe actuel doit correspondre

Les données sont chargées via `GET /api/Profile/me` au montage du composant, et les modifications sont envoyées via `PUT /api/Profile/me` ou `PUT /api/Profile/password`.

#### 4.5.9 Navigation et mise en page

**Barre latérale (`AppSidebar.tsx`) :**
La sidebar utilise le composant `Sidebar` de shadcn/ui et offre :
- Logo et nom « DentalCare Pro » en en-tête
- Menu principal avec 5 entrées : Dashboard, Calendar, Appointments, Patients, Available Slots
- Section Settings
- Chaque entrée est un lien React Router avec icône Lucide
- Mise en surbrillance de la page active (détection par `useLocation`)
- Mode rétractable (icône seule) via un bouton `SidebarTrigger`

**Barre de navigation supérieure (`DashboardLayout.tsx`) :**
- Bouton de rétraction de la sidebar (hamburger)
- Barre de recherche globale (placeholder « Search patients, appointments... »)
- Bouton de notifications avec :
  - Icône cloche (Bell)
  - Badge rouge avec le nombre de notifications non lues
  - Panneau déroulant au clic avec l'historique des notifications
- Menu utilisateur (DropdownMenu) avec :
  - Avatar et nom du praticien connecté
  - Lien « Profile » → `/profile`
  - Bouton « Logout » → déconnexion et redirection

### 4.6 Conclusion de la réalisation

La phase de réalisation a permis de livrer une application fonctionnelle couvrant l'ensemble des besoins exprimés. Les fonctionnalités clés — authentification sécurisée, gestion CRUD des patients et des rendez-vous, détection de conflits, calendrier hebdomadaire, créneaux disponibles et profil utilisateur — sont pleinement opérationnelles.

L'architecture choisie (API REST + SPA React) offre une séparation claire des responsabilités et une expérience utilisateur fluide grâce au rendu côté client, au cache React Query et aux notifications toast instantanées.

---

## Conclusion et Perspectives

### Conclusion

Le projet **Dental Reservation** a permis de concevoir et réaliser une solution web complète, moderne et fonctionnelle pour la gestion des cabinets dentaires. L'application couvre l'ensemble du cycle de gestion : de l'authentification sécurisée du praticien, à la gestion des patients et de leurs dossiers médicaux, en passant par la planification intelligente des rendez-vous avec détection automatique des conflits de créneaux.

Le choix d'une architecture client-serveur avec un backend ASP.NET Core 8 et un frontend React TypeScript a permis une séparation claire des responsabilités, facilitant la maintenance et l'évolution du système. L'utilisation d'Entity Framework Core comme ORM a simplifié les interactions avec la base de données SQL Server tout en protégeant contre les injections SQL. TanStack React Query a optimisé la gestion de l'état serveur côté frontend, offrant un cache intelligent et une synchronisation automatique.

La modélisation UML réalisée avec PlantUML (8 diagrammes) a fourni une base solide de conception avant l'implémentation, couvrant les cas d'utilisation, les classes, les séquences d'interaction et les flux d'activité.

La conteneurisation avec Docker et Docker Compose assure un déploiement reproductible et portable, et la documentation API via Swagger facilite l'intégration et les tests.

### Perspectives d'évolution

Plusieurs axes d'amélioration et d'extension sont envisagés pour les versions futures :

1. **Application mobile** : Développement d'une application mobile React Native ou Flutter permettant aux patients de prendre rendez-vous directement depuis leur smartphone et de recevoir des rappels.

2. **Notifications push et rappels** : Intégration d'un service d'envoi de rappels par email (via SendGrid) ou SMS (via Twilio) avant chaque rendez-vous, réduisant le taux de rendez-vous manqués.

3. **Gestion des paiements et facturation** : Ajout d'un module de facturation permettant de générer des factures, suivre les paiements et s'intégrer avec des solutions de paiement en ligne.

4. **Tableau de bord analytique avancé** : Intégration de graphiques interactifs avec des bibliothèques comme Recharts ou Chart.js pour visualiser l'évolution des rendez-vous, le taux de remplissage, les revenus, et les tendances sur des périodes personnalisables.

5. **Multi-cabinet et multi-rôles** : Support de plusieurs cabinets avec des rôles différenciés (administrateur, praticien, secrétaire, patient) et des permissions granulaires.

6. **Intégration avec des systèmes tiers** : Connexion avec des logiciels de comptabilité, des systèmes d'information hospitaliers (SIH), ou des annuaires de professionnels de santé.

7. **Hachage des mots de passe** : Remplacement du stockage en clair des mots de passe par un algorithme de hachage sécurisé (bcrypt ou Argon2) pour une sécurité renforcée.

8. **Tests automatisés** : Mise en place d'une suite de tests unitaires (xUnit pour le backend, Jest/Vitest pour le frontend) et de tests d'intégration pour garantir la fiabilité du code lors des évolutions.

9. **Internationalisation (i18n)** : Support multilingue (français, anglais, arabe) pour les cabinets opérant dans des environnements multilingues.

10. **Prise de rendez-vous en ligne par les patients** : Portail web dédié permettant aux patients de consulter les créneaux disponibles et de réserver eux-mêmes leurs rendez-vous.

---

## Bibliographie

1. Microsoft. *ASP.NET Core Documentation*. [https://learn.microsoft.com/en-us/aspnet/core/](https://learn.microsoft.com/en-us/aspnet/core/)
2. Microsoft. *Entity Framework Core Documentation*. [https://learn.microsoft.com/en-us/ef/core/](https://learn.microsoft.com/en-us/ef/core/)
3. React Team. *React Documentation*. [https://react.dev/](https://react.dev/)
4. Vite Team. *Vite Documentation*. [https://vitejs.dev/](https://vitejs.dev/)
5. TailwindCSS Team. *Tailwind CSS Documentation*. [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
6. shadcn. *shadcn/ui Documentation*. [https://ui.shadcn.com/](https://ui.shadcn.com/)
7. TanStack. *React Query Documentation*. [https://tanstack.com/query/latest](https://tanstack.com/query/latest)
8. Microsoft. *SQL Server Documentation*. [https://learn.microsoft.com/en-us/sql/](https://learn.microsoft.com/en-us/sql/)
9. Docker Inc. *Docker Documentation*. [https://docs.docker.com/](https://docs.docker.com/)
10. Auth0. *Introduction to JSON Web Tokens*. [https://jwt.io/introduction](https://jwt.io/introduction)
11. PlantUML. *PlantUML Documentation*. [https://plantuml.com/](https://plantuml.com/)
12. Radix UI. *Radix UI Primitives*. [https://www.radix-ui.com/](https://www.radix-ui.com/)
13. Lucide. *Lucide Icons*. [https://lucide.dev/](https://lucide.dev/)

---
