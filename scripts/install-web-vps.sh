#!/usr/bin/env bash
set -euo pipefail

if [[ $(id -u) != 0 ]]; then
  echo 'Exécuter ce script avec sudo sur le VPS.' >&2
  exit 1
fi

release=$(cd "$(dirname "$0")/.." && pwd)
host=simularbre.levergerdesplumes.fr
webroot=/var/www/simularbre
test -f "$release/web/index.html"
test -f "$release/deploy/apache-simularbre.conf"
test -f "$release/deploy/apache-simularbre-bootstrap.conf"

install -d -m 0755 "$webroot"
rsync -a --delete --exclude='/.well-known/' "$release/web/" "$webroot/"

if [[ ! -f "/etc/letsencrypt/live/$host/fullchain.pem" ]]; then
  install -m 0644 "$release/deploy/apache-simularbre-bootstrap.conf" /etc/apache2/sites-available/simularbre-bootstrap.conf
  /usr/sbin/a2ensite simularbre-bootstrap.conf
  /usr/sbin/apache2ctl configtest
  systemctl reload apache2
  certbot certonly --webroot --webroot-path "$webroot" --domain "$host" \
    --non-interactive --agree-tos --register-unsafely-without-email
fi

install -m 0644 "$release/deploy/apache-simularbre.conf" /etc/apache2/sites-available/simularbre.conf
/usr/sbin/a2enmod headers
/usr/sbin/a2ensite simularbre.conf
if [[ -e /etc/apache2/sites-enabled/simularbre-bootstrap.conf ]]; then
  /usr/sbin/a2dissite simularbre-bootstrap.conf
fi
/usr/sbin/apache2ctl configtest
systemctl reload apache2
curl --fail --silent --show-error --resolve "$host:443:127.0.0.1" "https://$host/" >/dev/null
echo "Site actif : https://$host/"
