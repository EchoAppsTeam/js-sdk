class Package < JsDuck::Tag::Tag
	def initialize
		@tagname = :package
		@pattern = "package"
		@html_position = POS_DOC + 0.1
		@repeatable = true
	end

	def parse_doc(scanner, position)
		text = scanner.match(/.*$/)
		return { :tagname => @tagname, :text => text }
	end

	def process_doc(context, package_tags, position)
		context[@tagname] = package_tags.map {|tag| tag[:text] }
	end

	def to_html(context)
		base = "//cdn.echoenabled.com/sdk/v3/"
		packages = context[@tagname].map {|package| "<a target='_blank' href='#{base}#{package}'>#{package}</a>" }.join(", ")
		<<-EOHTML
			<p>
				Available from Echo CDN as a part of the #{packages} package(s).
			</p>
		EOHTML
	end
end

class EchoRenderer < JsDuck::Tag::Tag
	def initialize
		@tagname = :echo_renderer
		@pattern = "echo_renderer"
		@member_type = {
			:name => @tagname,
			:category => :method_like,
			:title => "Renderers",
			:position => MEMBER_POS_METHOD + 0.1
		}
	end

	def parse_doc(scanner, position)
		scanner.standard_tag({:tagname => @tagname, :type => true, :name => true})
	end
end

class EchoLabel < JsDuck::Tag::Tag
	def initialize
		@tagname = :echo_label
		@pattern = "echo_label"
		@member_type = {
			:name => @tagname,
			:category => :property_like,
			:title => "Labels",
			:position => MEMBER_POS_METHOD + 0.2
		}
	end

	def parse_doc(scanner, position)
		scanner.standard_tag({:tagname => @tagname, :type => false, :name => true})
	end

	def process_doc(h, tags, position)
		tag = tags[0]
		h[:name] = tag[:name]
		h[:type] = "String"
	end
end

class EchoEvent < JsDuck::Tag::Tag
	def initialize
		@tagname = :echo_event
		@pattern = "echo_event"
		@member_type = {
			:name => @tagname,
			:category => :method_like,
			:title => "Events",
			:position => MEMBER_POS_EVENT - 0.1
		}
	end

	def parse_doc(scanner, position)
		name = scanner.ident_chain
		{
			:tagname => @tagname,
			:name => name,
			:doc => :multiline
		}
	end

	def process_doc(context, tags, position)
		context[:name] = tags[0][:name]
		context[:name] = context[:name].sub(/^.*\.(\w+)$/, "\\1")
		context[:doc] = tags[0][:doc]
	end
end
