FROM php:8.3-fpm-alpine

WORKDIR /var/www/api

# Install system dependencies
RUN apk add --no-cache \
    bash \
    git \
    curl \
    zip \
    unzip \
    libpq-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    libwebp-dev \
    freetype-dev \
    libxml2-dev \
    oniguruma-dev \
    libxslt-dev \
    icu-dev \
    libzip-dev \
    zlib-dev \
    g++ \
    make \
    linux-headers # Add this line

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
        bcmath \
        exif \
        gd \
        intl \
        mysqli \
        opcache \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        soap \
        xsl \
        zip \
        sockets \
        pcntl

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install
#RUN php bin/console doctrine:database:create
#RUN php bin/console doctrine:migrations:migrate
#RUN php bin/console doctrine:fixtures:load

# Clear cache
# RUN rm -rf /var/cache/apk/*
# RUN rm -rf /var/www/app/var
# RUN rm -rf /var/www/app/public/bundles/

# RUN mkdir /var/www/api
# RUN mkdir /var/www/api/public

# Permissions (adjust as needed for your Symfony app)
RUN chown -R www-data:www-data /var/www/api \
    && chmod -R 755 /var/www/api \
    && chmod -R 755 /var/www/api/public
    

# Expose the port on which PHP-FPM runs
EXPOSE 9000

# Start PHP-FPM server
CMD ["php-fpm"]
