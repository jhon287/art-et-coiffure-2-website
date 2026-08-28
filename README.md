# Art & Coiffure 2 Website

Minimalist, lightweight, responsive hair salon website.

## Multilingual support

The site supports 3 languages with a header language switcher:
- FR
- NL
- EN

Current language is stored in URL (`?lang=fr|nl|en`) and local storage.

## Customisation

Edit `data/site.json` to change:
- contact details
- translated labels and texts for each language
- opening hours per language
- prices for men and women per language

## Local preview

Open `index.html` in your browser.

If your browser blocks local JSON loading, run a tiny local server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000
