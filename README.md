# Utveckling

Installera dependecies:
```
npm install
```

Kör:
```
npm run dev
```

Bygg:
```
npm build
```


# Backlog

- Gör spelmotorn skalbar, d.v.s att du kan rendera den i valfri upplösning och på valfri position på en canvas.
    - Med det kan vi implementera ett redigeringsverktyg för nivåer med förhandsgranskning på samma skärm.
- Lägg till animerade dörrar.
- Lägg till lönndörrar, väggar som kan flytta på sig.
- Lägg till samlingsbara objekt, t.ex. pengar, ammunition, första hjälpen-kit...
- Renderingen av sprite-objekt är buggig.
    - Från vissa vinklar renderas inte objekten.
    - De bör sorteras på avstånd och renderas i rätt ordning.

# Documentation / Inspiration

3DSage på YouTube har exempel på hur man renderar sprites i 3D-rymd.

http://wademcgillis.com/html5games/Wolfenstein3D/