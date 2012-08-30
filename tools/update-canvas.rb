#!/usr/bin/env ruby

require 'rubygems'
require 'net/http'
require 'net/https'
require 'openssl'
require 'json'

# check if local configuration file exists
if (!File.exists?("../config.local.json"))
	abort "No local configuration file (config.local.json) found..."
end

config = JSON.parse(File.read("../config.local.json"))

# check if we have appkey and secret info
if (config["appkey"] == nil || config["secret"] == nil)
	abort "No appkey or secret found in the local config..."
end

canvas_name = ARGV.first
canvas_file = "canvases/#{canvas_name}.json"

# check if we have corresponding canvas file
if (!File.exists?(canvas_file))
	abort "No canvas named '#{canvas_name}'"
end

content = File.read(canvas_file)

# Validate the JSON
JSON.parse(content)

uri = URI.parse("https://api.echoenabled.com/v1/kvs/put")

http = Net::HTTP.new(uri.host, 443)
http.use_ssl = true
http.verify_mode = OpenSSL::SSL::VERIFY_NONE

request = Net::HTTP::Post.new(uri.request_uri)
request.set_form_data({:key => canvas_name, :value => content, :public => true})
request.basic_auth(config["appkey"], config["secret"])
response = http.request(request)

if response.code == "200"
	puts "Canvas publish complete: #{response.body}"
else
	puts "Failed to publish canvas: #{response.code} #{response.body}"
end

