#!/bin/sh

export DATABASE_URL=sqlite3://`pwd`/servers/filoo_filoo_prod.db
rackup -p 4567 config.ru

