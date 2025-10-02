# Présentation Pro Ultra

Application de création de présentations professionnelles avec 15 types de dispositions différentes.

## 🚀 Fonctionnalités

### Dispositions Disponibles
- **Titre** - Page de titre avec sous-titre
- **Contenu** - Titre et contenu texte
- **2 Colonnes** - Disposition à deux colonnes
- **3 Colonnes** - Disposition à trois colonnes
- **Comparaison** - Comparaison côte à côte
- **Citation** - Citation avec auteur
- **Équipe** - Organigramme d'équipe
- **Graphique** - Graphiques (bar, pie, line)
- **QCM** - Questions à choix multiples
- **Timeline** - Chronologie d'événements
- **Processus** - Flux de processus
- **SWOT** - Analyse SWOT avec quadrants colorés
- **Sommaire** - Aperçu de toutes les diapositives
- **Vidéo** - Intégration YouTube/Vimeo/Dailymotion
- **HTML** - Éditeur HTML avec prévisualisation

### Mode Présentation
- Affichage plein écran
- Navigation au clavier (flèches, espace)
- Affichage correct de tous les éléments (vidéos, HTML, SWOT, etc.)
- Notes du présentateur
- Compteur de diapositives

### Thèmes
- Défaut (violet/bleu)
- Sombre (noir/gris)
- Océan (bleu)
- Coucher de soleil (rouge/orange)

### Autres Fonctionnalités
- Sauvegarde automatique (toutes les 30 secondes)
- Historique Annuler/Rétablir
- Export JSON
- 6 modèles prédéfinis
- Zoom (50% - 200%)
- Glisser-déposer d'images

## ⌨️ Raccourcis Clavier

### Mode Édition
- `Ctrl+N` - Nouvelle diapositive
- `Ctrl+S` - Sauvegarder
- `Ctrl+Z` - Annuler
- `Ctrl+Shift+Z` - Rétablir
- `Ctrl+E` - Exporter
- `F5` - Mode présentation

### Mode Présentation
- `→` / `Espace` - Diapositive suivante
- `←` - Diapositive précédente
- `Échap` - Quitter
- `N` - Afficher/masquer les notes
- `F` - Plein écran

## 🎯 Utilisation

1. Ouvrez `index.html` dans votre navigateur
2. Cliquez sur "Nouveau" pour ajouter des diapositives
3. Sélectionnez une disposition dans le panneau de droite
4. Modifiez le contenu en cliquant sur les éléments
5. Cliquez sur "Présenter" pour lancer la présentation

## 🛠️ Technologies

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- JavaScript (ES6+)
- Chart.js (pour les graphiques)
- Font Awesome (icônes)

## 📝 Structure du Projet

```
.
├── index.html          # Structure HTML principale
├── styles.css          # Styles CSS complets
├── app.js             # Logique principale de l'application
├── layouts.js         # Rendu des dispositions avancées
├── interactions.js    # Gestionnaires d'interactions
└── README.md          # Documentation
```

## ✨ Points Forts

- **Mode Présentation Optimisé** : Tous les éléments s'affichent correctement (vidéos, HTML, SWOT, etc.)
- **Édition Intuitive** : Modification directe du contenu par clic
- **Responsive** : S'adapte à différentes tailles d'écran
- **Sauvegarde Locale** : Vos présentations sont sauvegardées automatiquement
- **Modèles Prêts** : Démarrez rapidement avec des modèles professionnels

## 🐛 Problèmes Connus

- Les CDN externes (Font Awesome, Chart.js) peuvent être bloqués dans certains environnements
- Les vidéos YouTube nécessitent une connexion internet

## 📄 Licence

Libre d'utilisation pour tout projet.
