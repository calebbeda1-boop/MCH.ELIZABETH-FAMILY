# Jinsi ya kuongeza PWA kwenye index.html yako

## Hatua 1 — Pakia faili 4 kwenye GitHub repo yako (mzizi, karibu na index.html)
- `manifest.json`
- `service-worker.js`
- `icon-192.png`
- `icon-512.png`
- `icon-512-maskable.png`

## Hatua 2 — Ongeza mistari hii ndani ya `<head>` ya index.html
Weka chini ya `<meta name="viewport" ...>` iliyopo tayari:

```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#0a0907">
<link rel="apple-touch-icon" href="/icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Familia Elizabeth">
```

## Hatua 3 — Ongeza script hii kabla ya `</body>` (au ndani ya `<script>` iliyopo, mwishoni)

```html
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(console.error);
  });
}
</script>
```

## Hatua 4 — Commit na push kwenye GitHub
Vercel itajenga upya (redeploy) kiotomatiki.

## Hatua 5 — Install kwenye simu (Android)
1. Fungua https://mch-elizabeth-family.vercel.app/ kwenye **Chrome**
2. Bofya menyu (dots tatu) juu kulia
3. Chagua **"Add to Home screen"** / "Install app"
4. Icon ya app (nyumba ya dhahabu) itaonekana kwenye home screen — ikifunguliwa, itaonekana kama app halisi, bila address bar ya browser

## Kwa iPhone (Safari)
1. Fungua link kwenye Safari
2. Bofya kitufe cha "Share" (mstatili na mshale juu)
3. Chagua **"Add to Home Screen"**

Hakuna account ya Play Store/App Store inayohitajika kwa hatua hii — ni bure kabisa.
