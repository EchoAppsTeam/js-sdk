require "jsduck/meta_tag"

class EchoRendererTag < JsDuck::MetaTag
	def initialize
		@name = "echo_renderer"
		@multiline = false
		@boolean = true
		@signature = {:long => "renderer", :short => "renderer"}
	end
end

class EchoLocalizationTag < JsDuck::MetaTag
	def initialize
		@name = "echo_label"
		@multiline = false
		@boolean = true
		@signature = {:long => "localization label", :short => "L10N"}
	end
end
