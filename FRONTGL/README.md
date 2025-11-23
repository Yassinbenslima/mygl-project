# Système de Gestion des Surveillances - Faculté des Sciences Économiques et de Gestion

## Description du Projet

Application web Angular pour la gestion des surveillances d'examens à la Faculté des Sciences Économiques et de Gestion de Sfax. Cette application permet aux enseignants d'exprimer leurs vœux de surveillance et aux administrateurs de gérer efficacement l'affectation des surveillants.

## Fonctionnalités Principales

### Pour les Enseignants
- **Tableau de bord personnalisé** avec vue d'ensemble de la charge de surveillance
- **Calendrier interactif** pour visualiser et sélectionner les séances d'examen
- **Expression des vœux** avec système de priorités (1-5)
- **Suivi des préférences** et de leur statut (en attente, approuvé, rejeté)
- **Impression et export** des vœux soumis
- **Historique des séances** assignées

### Pour les Administrateurs
- **Vue d'ensemble du système** avec statistiques en temps réel
- **Gestion complète des séances** d'examen (création, modification, suppression)
- **Supervision des enseignants** et de leurs charges de surveillance
- **Calendrier global** pour la planification des examens
- **Statistiques avancées** et rapports d'utilisation
- **Gestion des affectations** automatiques et manuelles

## Architecture Technique

### Stack Technologique
- **Angular 17+** avec composants standalone
- **Angular Material** pour l'interface utilisateur
- **FullCalendar** pour le composant calendrier
- **RxJS** pour la gestion d'état réactive
- **TypeScript** pour le développement type-safe
- **SCSS** pour le styling avancé

### Structure du Projet
```
src/
├── app/
│   ├── components/
│   │   ├── calendar/           # Composant calendrier principal
│   │   ├── teacher-dashboard/  # Tableau de bord enseignant
│   │   ├── admin-dashboard/    # Tableau de bord administrateur
│   │   ├── session-management/ # Gestion des séances
│   │   └── login/              # Page de connexion
│   ├── services/
│   │   ├── api.service.ts      # Service API REST
│   │   ├── auth.service.ts     # Service d'authentification
│   │   └── calendar.service.ts # Service calendrier
│   ├── models/
│   │   └── session.model.ts    # Modèles de données
│   ├── interfaces/
│   │   └── api-response.interface.ts
│   ├── guards/
│   │   └── auth.guard.ts       # Guards d'authentification
│   └── app.routes.ts           # Configuration des routes
```

## Installation et Configuration

### Prérequis
- Node.js 18+ 
- npm 9+
- Angular CLI 17+

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd surveillance-management

# Installer les dépendances
npm install

# Démarrer le serveur de développement
ng serve
```

L'application sera accessible sur `http://localhost:4200`

### Configuration de l'API
Modifiez le fichier `src/environments/environment.ts` pour pointer vers votre API backend :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api', // URL de votre API Spring Boot
  appName: 'Surveillance Management System',
  version: '1.0.0'
};
```

## Utilisation

### Connexion
1. Accédez à l'application
2. Connectez-vous avec vos identifiants universitaires
3. Vous serez redirigé vers votre tableau de bord selon votre rôle

### Pour les Enseignants
1. **Consulter le calendrier** : Visualisez les séances disponibles
2. **Sélectionner des séances** : Cliquez sur les séances souhaitées
3. **Définir les priorités** : Attribuez une priorité de 1 à 5 à chaque séance
4. **Soumettre les vœux** : Envoyez votre sélection au système
5. **Suivre le statut** : Consultez l'approbation de vos vœux

### Pour les Administrateurs
1. **Gérer les séances** : Créez et modifiez les séances d'examen
2. **Superviser les enseignants** : Consultez les charges et affectations
3. **Planifier le calendrier** : Organisez les examens sur le calendrier global
4. **Analyser les statistiques** : Consultez les rapports d'utilisation

## Fonctionnalités Avancées

### Calendrier Interactif
- **Vues multiples** : Mois, semaine, jour, liste
- **Navigation intuitive** : Boutons précédent/suivant, retour à aujourd'hui
- **Filtres avancés** : Par statut, département, classe
- **Sélection multiple** : Pour exprimer plusieurs vœux simultanément
- **Indicateurs visuels** : Couleurs distinctes selon le statut des séances

### Système de Priorités
- **5 niveaux de priorité** : De très prioritaire à non prioritaire
- **Validation automatique** : Contrôles de cohérence des vœux
- **Historique complet** : Suivi de tous les vœux soumis

### Responsive Design
- **Mobile-first** : Optimisé pour tous les écrans
- **Interface adaptative** : S'ajuste automatiquement à la taille d'écran
- **Accessibilité** : Respect des standards WCAG

## Sécurité

### Authentification
- **JWT Tokens** : Authentification sécurisée
- **Guards de routes** : Protection des pages sensibles
- **Gestion des rôles** : Séparation enseignant/administrateur
- **Expiration automatique** : Renouvellement des tokens

### Protection des Données
- **Validation côté client** : Contrôles de saisie
- **Sanitisation** : Protection contre les injections
- **HTTPS** : Communication chiffrée en production

## Développement

### Scripts Disponibles
```bash
# Développement
ng serve

# Build de production
ng build --configuration production

# Tests unitaires
ng test

# Tests e2e
ng e2e

# Linting
ng lint
```

### Standards de Code
- **ESLint** : Respect des règles de codage
- **Prettier** : Formatage automatique
- **TypeScript strict** : Mode strict activé
- **Conventions Angular** : Respect du style guide officiel

## Contribution

### Workflow de Développement
1. Fork du repository
2. Création d'une branche feature
3. Développement avec tests
4. Pull request avec description détaillée
5. Review et merge

### Guidelines
- **Commits conventionnels** : Utilisation de Conventional Commits
- **Tests obligatoires** : Couverture de code requise
- **Documentation** : Commentaires JSDoc pour les fonctions publiques

## Support

### Documentation
- **README détaillé** : Guide d'installation et d'utilisation
- **Commentaires de code** : Documentation inline
- **API Documentation** : Référence des services

### Contact
- **Support technique** : support@univ-sfax.tn
- **Développement** : dev-team@univ-sfax.tn

## Licence

Ce projet est développé pour l'Université de Sfax - Faculté des Sciences Économiques et de Gestion.

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Auteur** : Équipe de développement FSEG