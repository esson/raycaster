# Raycaster

This repository holds an experimental raycasting game engine written in JavaScript. Inspired by John Carmack's work on Wolfenstein 3D, the engine utilizes a 2D canvas element to render immersive, interactive 3D graphics in real-time. Currently, the engine includes a single level that is a clone of the first level of the classic Wolfenstein 3D game.

Please be aware that this project is still a work in progress and is not yet complete.

## Demo

https://esson.github.io/raycaster/

## Key Mappings

| Key      | Action                      |
| -------- | --------------------------- |
| W        | Move Forward                |
| S        | Move Backward               |
| A        | Turn Left                   |
| D        | Turn Right                  |
| Z        | Strafe                      |
| X        | Fire                        |
| L Shift  | Run                         |
| Space    | Action / Open Door          |
| Esc      | Pause                       |
| 1-5      | Toggle Weapons              |
| M        | Toggle Minimap              |
| U        | Show Debug Information      |
| G        | Show Performance Graphs     |
| I        | Toggle Interlaced Rendering |
| O        | Toggle Sprites              |
| [        | Toggle Wall Collision       |
| P        | Toggle Smoothing            |
| R        | Reset Player Position       |
| Numpad + | Zoom In                     |
| Numpad - | Zoom Out                    |


## Development

Install dependencies
```
npm install
```

Run
```
npm run dev
```

Build
```
npm build
```

## Backlog

- Gör spelmotorn skalbar, d.v.s att du kan rendera den i valfri upplösning och på valfri position på en canvas.
    - Med det kan vi implementera ett redigeringsverktyg för nivåer med förhandsgranskning på samma skärm.
- Lägg till animerade dörrar.
- Lägg till lönndörrar, väggar som kan flytta på sig.
- Lägg till samlingsbara objekt, t.ex. pengar, ammunition, första hjälpen-kit...
- Renderingen av sprite-objekt är buggig.
    - Från vissa vinklar renderas inte objekten.
    - De bör sorteras på avstånd och renderas i rätt ordning.

## Documentation / Inspiration

3DSage på YouTube har exempel på hur man renderar sprites i 3D-rymd.

http://wademcgillis.com/html5games/Wolfenstein3D/