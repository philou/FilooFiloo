#this monkeypatch allows SC's built-in proxy lib/sproutcore/merb/bundle_controller.rb (in the gem) to work with https
#be sure to include :protocol=>'https' in the proxy options and add require 'proxy-patch.rb' to your sc-config
require 'merb-core'
require 'sproutcore/jsdoc'
require 'net/http'
require 'net/https'
require 'uri'
 
module SproutCore
  module Merb
    class BundleController < ::Merb::Controller
      # Proxy the request and return the result...
       def handle_proxy(url, proxy_url, opts ={})
         SC.logger.debug 'Using proxy-patch.rb!!!'
         
         # collect the method (don't use request.method as that might unmasquerade delete and put requests)
         http_method = request.env['REQUEST_METHOD'].to_s.downcase
 
         # capture the origin host for cookies. strip away any port.
         origin_host = request.host.gsub(/:[0-9]+$/,'')
 
         # collect the headers...
         headers = {}
         request.env.each do |key, value|
           next unless key =~ /^HTTP_/
           key = key.gsub(/^HTTP_/,'').titleize.gsub(' ','-')
           headers[key] = value
         end
 
         # add the Content-Type header
         if(request.content_type)
           headers['Content-Type'] = request.content_type;
           SC.logger.debug "Content-Type: #{headers['Content-Type']}"
         end
 
         uri = URI.parse(proxy_url)
         http_host = uri.host
         http_port = uri.port
         http_path = [uri.path, uri.query].compact.join('?')
         http_path = '/' if http_path.nil? || http_path.size <= 0
 
         # now make the request...
         response = nil
 
         #handle for https
         #change requires using :protocol option
         https = Net::HTTP.new(http_host,http_port)
         if opts[:protocol] and opts[:protocol] == "https"
           https.use_ssl = true
           https.ssl_timeout = 2
           https.verify_mode = OpenSSL::SSL::VERIFY_NONE
           headers['Cookie'] = $cookie if $cookie
           SC.logger.debug("The Cookie is: #{$cookie}")
           headers.delete('Host') #remove the host from the headers as it prevents https requests from being proxied
         end
 
         SC.logger.debug("Headers: ")
         headers.each do |key, value|
           SC.logger.debug("\t#{key}: #{value}")
         end
         # Handle those that require a body.
         no_body_method = %w(delete get copy head move options trace)
         https.start() do |http|
           if no_body_method.include?(http_method)
             response = http.send(http_method, http_path, headers)
           else
             http_body = request.raw_post
             response = http.send(http_method, http_path, http_body, headers)
           end
         end
         # Now set the status, headers, and body.
         @status = response.code
         self.status = @status.to_i
         SC.logger.debug " ~ PROXY: #{@status} #{request.uri} -> http://#{http_host}:#{http_port}#{http_path}"
 
         # Transfer response headers into reponse
         ignore = ['transfer-encoding', 'keep-alive', 'connection']
         response.each do | key, value |
           next if ignore.include?(key.downcase)
 
           # If this is a cookie, strip out the domain. This technically may
           # break certain scenarios where services try to set cross-domain
           # cookies, but those services should not be doing that anyway...
 
           if key.downcase == 'set-cookie'
             # Ugly Hacks to make the Cookie Work!
             value.gsub!(/domain=[^\;]+\;? ?/,'')
             value.gsub!(/expires=[^\;]+\;? ?/,'')
             value.gsub!(/path=[^\;]+\;? ?/,'')
             value.gsub!(/secure; HttpOnly, /,'')
             $cookie = value #get the cookie for other sessions
           end
 
           # Location headers should rewrite the hostname if it is included.
           if key.downcase == 'location'
             value.gsub!(/^http:\/\/#{http_host}(:[0-9]+)?\//, "http://#{request.host}/")
           end
 
           # Prep key and set header.
           key = key.split('-').map { |x| x.downcase.capitalize }.join('-')
           SC.logger.debug " #{key}: #{value}"
           @headers[key] = value
         end
 
         SC.logger.debug ''
         
         # Transfer response body
         return response.body
       end
      
    end
  end
end
 
