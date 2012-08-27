require "jsduck/meta_tag"

class RendererTag < JsDuck::MetaTag
	def initialize
		@name = "renderer"
		@multiline = false
		@boolean = true
		@signature = {:long => "renderer", :short => "renderer"}
	end
end

class LocalizationTag < JsDuck::MetaTag
	def initialize
		@name = "localization"
		@multiline = false
		@boolean = true
		@signature = {:long => "localization label", :short => "L10N"}
	end
end
