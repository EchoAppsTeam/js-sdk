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

class EchoEventTag < JsDuck::MetaTag
	def initialize
		@name = "echo_event"
		@multiline = false
		@position = :top
	end

	def to_value(contents)
		contents[0] =~ /\A((?:\w+\.?)+) (.*)/m
		{:name => $1, :description => $2}
	end

	def to_html(params)
		format(
			"#{params[:description]}<br>" +
			"<b>Full name</b>: #{params[:name]}"
		)
	end
end
