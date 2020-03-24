# WIP: Flarum Progressive Web App

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/askvortsov/flarum-pwa.svg)](https://packagist.org/packages/askvortsov/flarum-pwa)

A [Flarum](http://flarum.org) extension. Progressive Web App support for Flarum. WIP.

## TODO:

### v0.1.0

- Status Checks
  - Add check for at least one icon
  - Add check for HTTPS
  - Add check for full name attribute
  - Add check for sw.js (if enabled)
  - Add check for webmanifest.json (if enabled)
- Redo offline page
- Redo service workers
- Support for subdirectory installations

### v0.2.0

- Push Notifications Support (Android only due to PWA limitations)
- Bugfixes and minor improvements

### v0.3.0

- Caching and expanded offline support
- Support configuration of ALL webmanifest attributes, especially:
  - Related Applications
  - Categories
  - Language
- Bugfixes and minor improvements


### Installation

Use [Bazaar](https://discuss.flarum.org/d/5151-flagrow-bazaar-the-extension-marketplace) or install manually with composer:

```sh
composer require askvortsov/flarum-pwa
```

### Updating

```sh
composer update askvortsov/flarum-pwa
```

### Links

- [Packagist](https://packagist.org/packages/askvortsov/flarum-pwa)
