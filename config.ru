require 'servers/filoo_filoo'

use Rack::Static, :urls => ["/static"], :root => "tmp/build"
use Rack::Static, :urls => ["/index.html"], :root => "tmp/build/static/filoo_filoo/en/2590f18811eee8eaf8eb279b0366920a659bf8fa"
run Sinatra::Application
