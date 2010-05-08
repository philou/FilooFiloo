#!/bin/sh

export DATABASE_URL=sqlite3://`pwd`/servers/filoo_filoo_prod.db
rackup -p 8080 config.ru

