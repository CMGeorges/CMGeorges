# Ma vitrine : usage local et GitHub Pages

## Montrer le livrable immédiatement

Télécharger `docs/index.html` et l’ouvrir dans Safari, Chrome, Firefox ou Edge. Tout le HTML, le CSS et le JavaScript sont dans le même fichier ; aucun serveur n’est requis. Les liens GitHub, LinkedIn et courriel demandent une connexion externe, mais le contenu et la simulation fonctionnent hors ligne.

Je présente six de mes projets publics. La simulation de transfert est une illustration locale et ne fait aucun appel bancaire. Aucun dépôt privé, secret ou contenu de client n’est inclus.

Le bouton « Imprimer / enregistrer en PDF » ouvre la fonction d’impression du navigateur.

## Activer GitHub Pages

Le dépôt `CMGeorges/CMGeorges` est public et sa branche par défaut est `master`. Pages n’était pas activé à la préparation de cette livraison.

Après examen et fusion de la pull request de vitrine :

1. Ouvrir le dépôt → **Settings → Pages**.
2. Sous **Build and deployment**, choisir **GitHub Actions** comme source.
3. Ouvrir **Actions → Publish portfolio → Run workflow**, sur `master`.
4. Attendre la réussite du workflow ; le job `deploy` fournit l’URL publiée.

URL attendue : `https://cmgeorges.github.io/CMGeorges/`. Cette adresse est une destination prévue, pas une preuve de publication. Ne la partager qu’après une exécution réussie et une vérification du site.

J’ai préparé les commits et la pull request. La connexion utilisée n’expose pas la configuration administrative de Pages : je n’ai donc pas modifié ces paramètres.

Alternative sans workflow de déploiement : dans Pages, sélectionner **Deploy from a branch**, branche `master`, dossier `/docs`. Le fichier `.nojekyll` évite le traitement Jekyll.

Référence officielle : https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Hébergement des applications

Pages sert la vitrine HTML. Il ne lance pas les API Flask/FastAPI/.NET, PostgreSQL, Docker ou le Checkout serveur Next.js. Les guides liés dans la page permettent de lancer les applications séparément.

La boutique Next.js requiert des clés Stripe/Sanity pour un vrai Checkout ; le registre de commandes, les webhooks et les règles commerciales restent à compléter. CartePro requiert une association utilisateur-client Stripe pour synchroniser les abonnements.

## Mettre à jour

Modifier `docs/index.html`, mettre à jour les liens de preuves et les niveaux de maturité, puis exécuter :

```bash
node scripts/check-site.cjs
```

Éviter de publier l’inventaire des dépôts privés ou des clés. Les statistiques de validation de la page portent uniquement sur les deux projets publics corrigés présentés : 11 + 17 = 28 tests.
