# Présentation Pro Ultra - Créateur Avancé

Une application web complète et professionnelle pour créer des présentations interactives et animées.

## 🎯 Fonctionnalités Principales

### Édition de Diapositives
- **Multiples dispositions** : Titre, Contenu, 2/3 Colonnes, Comparaison, Citation, etc.
- **Éditeur de texte riche** : Formatage du texte (gras, italique, souligné, couleurs)
- **Polices et tailles personnalisables**
- **Alignement et listes** : Gauche, centre, droite, justifié, listes à puces/numérotées
- **Insertion de liens hypertextes**

### Gestion des Diapositives
- ✅ Ajouter/supprimer/dupliquer des diapositives
- ✅ Réorganiser par glisser-déposer
- ✅ Miniatures avec aperçu
- ✅ Navigation rapide

### Thèmes et Personnalisation
- **5 thèmes de couleurs** : Par défaut, Sombre, Océan, Coucher de soleil, Forêt
- **Transitions animées** : Aucune, Fondu, Glissement, Zoom
- **Zoom** : Agrandir/réduire la vue de l'éditeur

### Modèles Prédéfinis
- 📊 **Professionnel** : Présentation d'entreprise
- 🎓 **Éducatif** : Leçon ou formation
- 🎨 **Créatif** : Portfolio artistique
- ✨ **Minimaliste** : Design épuré

### Mode Présentation
- **Plein écran** avec contrôles intuitifs
- **Navigation** : Flèches clavier, boutons, espace
- **Notes du présentateur** (affichage/masquage)
- **Compteur de diapositives**
- **Transitions fluides**

### Fonctionnalités Avancées
- ⏮️ **Historique** : Annuler/Rétablir les actions
- 💾 **Sauvegarde automatique** : Toutes les 30 secondes
- 📥 **Export** : JSON pour partage et backup
- 🖨️ **Impression** : Support natif
- 🔗 **Partage** : Copie du lien ou partage natif
- 🎨 **Glisser-déposer** : Images (en développement)

## 🚀 Utilisation

### Démarrage Rapide
1. Ouvrez `index.html` dans votre navigateur
2. Commencez à éditer la première diapositive
3. Ajoutez de nouvelles diapositives avec le bouton "+"
4. Changez la disposition dans le panneau de droite
5. Appuyez sur F5 ou "Présenter" pour lancer le mode présentation

### Raccourcis Clavier

#### Mode Édition
- `Ctrl+N` : Nouvelle diapositive
- `Ctrl+S` : Sauvegarder
- `Ctrl+Z` : Annuler
- `Ctrl+Shift+Z` : Rétablir
- `F5` : Démarrer la présentation

#### Mode Présentation
- `→` ou `Espace` : Diapositive suivante
- `←` : Diapositive précédente
- `N` : Afficher/masquer les notes
- `F` : Plein écran
- `Échap` : Quitter la présentation

## 🎨 Structure du Projet

```
/workspaces/1oct25/
├── index.html       # Structure HTML principale
├── styles.css       # Styles CSS complets
├── app.js          # Logique JavaScript
├── package.json    # Configuration du projet
└── README.md       # Documentation
```

## 💡 Fonctionnalités à Venir

Les fonctionnalités suivantes sont prévues pour les prochaines versions :
- 📊 Graphiques interactifs (barres, camembert, lignes)
- 👥 Organigramme d'équipe
- ✅ QCM interactifs
- ⏱️ Chronologie
- 🔄 Diagrammes de processus
- 📈 Analyse SWOT
- 🎬 Intégration vidéo (YouTube, Vimeo)
- 💻 Éditeur HTML personnalisé
- 🖼️ Formes géométriques
- 📸 Gestion avancée des images

## 🛠️ Technologies Utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Animations et mise en page moderne
- **JavaScript ES6** : Logique d'application
- **Font Awesome 6** : Icônes vectorielles
- **LocalStorage** : Sauvegarde persistante

## 📝 Notes Techniques

### Sauvegarde
Les présentations sont automatiquement sauvegardées dans le LocalStorage du navigateur toutes les 30 secondes. Elles persistent entre les sessions.

### Export/Import
Exportez vos présentations en JSON pour :
- Backup de sécurité
- Partage avec d'autres utilisateurs
- Versionnage

### Compatibilité
- ✅ Chrome/Edge (recommandé)
- ✅ Firefox
- ✅ Safari
- ⚠️ Internet Explorer non supporté

## 🎯 Cas d'Usage

1. **Présentations professionnelles** : Réunions, pitches, rapports
2. **Enseignement** : Cours, formations, tutoriels
3. **Portfolio** : Présentation de projets créatifs
4. **Événements** : Conférences, séminaires, webinaires

## 🔧 Développement

### Personnalisation
Le code est organisé et commenté pour faciliter les modifications :
- Ajoutez de nouvelles dispositions dans `changeLayout()`
- Créez des thèmes dans les variables CSS
- Personnalisez les modèles dans `applyTemplate()`

### Performance
- Optimisé pour 50+ diapositives
- Transitions fluides (60 FPS)
- Chargement instantané

## 📄 Licence

Projet open-source pour usage éducatif et personnel.

---

**Créé avec ❤️ pour faciliter la création de présentations professionnelles**