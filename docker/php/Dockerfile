# Użyjemy PHP 8.2-FPM w wersji Alpine (lżejsza dystrybucja Linuksa)
# PHP 8.2 ma dobre wsparcie dla rozszerzeń. Jeśli potrzebujesz 8.4, można spróbować zmienić,
# ale dostępność rozszerzeń może być mniejsza dla najnowszych wersji.
FROM php:8.2-fpm-alpine

# Zmienne środowiskowe dla konfiguracji PHP (przykładowe, dostosuj w razie potrzeby)
ENV PHP_UPLOAD_MAX_FILESIZE=128M \
    PHP_POST_MAX_SIZE=128M \
    PHP_MEMORY_LIMIT=256M \
    PHP_MAX_EXECUTION_TIME=300

# Instalacja zależności systemowych potrzebnych do kompilacji rozszerzeń PHP
# oraz narzędzi jak git (może być potrzebny Composerowi w kontenerze)
RUN apk add --no-cache \
    bash \
    git \
    openssh-client \
    libzip-dev \
    zlib-dev \
    libpng-dev \
    jpeg-dev \
    freetype-dev \
    icu-dev \
    libwebp-dev \
    # Do YAML
    yaml-dev \
    # Do APCu
    autoconf \
    build-base \
    # Do exif
    exiftool # Chociaż samo exiftool nie jest rozszerzeniem PHP, ale biblioteką systemową.

# Instalacja podstawowych rozszerzeń PHP wymaganych/zalecanych przez Grav
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
        gd \
        zip \
        intl \
        opcache \
        exif \
        bcmath

# Instalacja YAML z PECL
# Alpine wymaga pewnych kroków budowania
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install yaml \
    && docker-php-ext-enable yaml \
    && apk del .build-deps

# Instalacja APCu z PECL
RUN pecl install apcu \
    && docker-php-ext-enable apcu

# Ustawienie katalogu roboczego
WORKDIR /var/www/html

# (Opcjonalnie) Możesz zainstalować Composera w obrazie, jeśli chcesz go używać wewnątrz kontenera
# RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# (Opcjonalnie) Zmiana właściciela plików - może być potrzebne, jeśli są problemy z uprawnieniami
# RUN chown -R www-data:www-data /var/www/html

# Domyślna komenda (nie musisz jej zmieniać dla php-fpm)
CMD ["php-fpm"]