require 'servers/filoo_filoo'

use Rack::Static, :urls => ["/static"], :root => "tmp/build"
use Rack::Static, :urls => ["/index.html"], :root => "tmp/build/static/filoo_filoo/en/LATEST"
run Sinatra::Application
