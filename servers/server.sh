#!/bin/sh

export DATABASE_URL=sqlite3://`pwd`/filoo_filoo_prod.db
ruby filoo_filoo.rb
