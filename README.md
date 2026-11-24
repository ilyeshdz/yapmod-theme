# Yapmod themes

A personal collection of themes for [Yapmod](https://github.com/ilyeshdz/yapmod).

## Black

![Black in Yapin, showing the general channel welcome panel, JetBrains Mono typography, and monochrome action buttons](assets/black-preview.png)

Black pairs an ink-black channel view with graphite sidebars and white accents. A slim line marks the selected channel, and the composer gains a brighter border when focused. JetBrains Mono runs throughout the interface. Avatars, emoji, and shared media also appear in grayscale while Black is active.

### Install

1. [Download the collection](https://github.com/ilyeshdz/yapmod-theme/archive/refs/heads/main.zip) and unzip it.
2. Open **Settings → Themes → Import theme** in Yapmod and select the **themes/black** folder.
3. Switch on **Black** in the theme gallery.

### Theme source

Each directory under [themes/](themes/) is a standalone Yapmod theme package. For Black, [manifest.json](themes/black/manifest.json) declares its identity and dark mode, and [theme.css](themes/black/theme.css) defines the palette, font and control styles. The font loads from Google Fonts’ asset host, with a local monospace fallback.
