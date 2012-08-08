#!/usr/bin/env ruby

require 'rubygems'
require 'net/http'
require 'net/https'
require 'openssl'
require 'json'

# config
endpoint = "https://api.echoenabled.com/v1/kvs/put"
key = {:public => "test.aboutecho.com", :secret => "NOT.A.REAL.VALUE"}

canvas_name = ARGV.first
canvas_file = "canvases/#{canvas_name}.json"
abort "No canvas named '#{canvas_name}'" unless File.exists?(canvas_file)
canvas_content = File.read(canvas_file)

# Validate the JSON
JSON.parse(canvas_content)

uri = URI.parse(endpoint)

http = Net::HTTP.new(uri.host, 443)
http.use_ssl = true
http.verify_mode = OpenSSL::SSL::VERIFY_NONE

request = Net::HTTP::Post.new(uri.request_uri)
request.set_form_data({:key => canvas_name, :value => canvas_content, :public => true})
request.basic_auth(key[:public], key[:secret])
response = http.request(request)

if response.code == "200"
	puts "Canvas publish complete: #{response.body}"
else
	puts "Failed to publish canvas: #{response.code} #{response.body}"
end

