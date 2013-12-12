module Echo
	class Module < JsDuck::Tag::BooleanTag
		def initialize
			@tagname = :module
			@pattern = "module"
			@html_position = POS_ASIDE - 0.1
			super
		end

		def to_html(context)
			module_name = context[:files][0][:filename].gsub(/^.*\/src\/(.+)\.js/, "echo/\\1")
			<<-EOHTML
				<p>
					Can be used as an AMD module: <b>#{module_name}</b>
				</p>
				<pre><code>Echo.define([\n    \"#{module_name}\"\n], function() { ... });</code></pre>
			EOHTML
		end
	end

	class Package < JsDuck::Tag::Tag
		def initialize
			@tagname = :package
			@pattern = "package"
			@html_position = POS_DOC + 0.1
			@repeatable = true
		end

		def parse_doc(scanner, position)
			text = scanner.match(/.*$/)
			{
				:tagname => @tagname,
				:text => text
			}
		end

		def process_doc(context, tags, position)
			context[@tagname] = tags.map {|tag| tag[:text] }
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

	class Template < JsDuck::Tag::MemberTag
		def initialize
			@tagname = :echo_template
			@pattern = "echo_template"
			@member_type = {
				:title => "Templates",
				:position => MEMBER_POS_METHOD + 0.1,
				:icon => File.dirname(__FILE__) + "/../../docs/icons/template.png",
			}
		end

		def parse_doc(scanner, position)
			scanner.standard_tag({
				:tagname => @tagname,
				:type => false,
				:name => false,
				:default => true
			})
		end

		def process_code(code)
			h = super(code)
			h[:type] = "String"
			h[:renderers] = []
			code[:default].scan(/\{(?:plugin.)?class:([^\}]+)\}/) {|name|
				h[:renderers].push(name[0])
			}
			h
		end

		def to_html(member, cls)
			existing_renderers = {}
			# select explicitly defined :echo_renderer members
			cls[:members].each {|tag|
				if tag[:tagname] == :echo_renderer
					existing_renderers[tag[:name]] = tag
				end
			}
			# add implicit :echo_renderer members to the class
			member[:renderers].each {|name|
				next if existing_renderers[name]
				tag = {
					:tagname => :echo_renderer,
					:name => name,
					:files => member[:files],
					:params => Echo::Renderer.generic_params,
					:return => Echo::Renderer.generic_return,
					:fires => false,
					:id => "echo_renderer-" + name,
					:owner => member[:owner]
				}
				cls[:members].push(tag)
				existing_renderers[name] = tag
			}

			# XXX: remove all @echo_template tags to hide them for a while
			# the next code block doesn't really work because of these lines
			cls[:members].delete_if {|tag|
				tag[:tagname] == :echo_template
			}

			# generate HTML for all the renderer tags
			member_link(member) + " : String" +
			"<p>The following renderers are available for this template:" +
				"<ul>" +
					member[:renderers].sort().map {|name|
						"<li><a href=\"#!/api/" + existing_renderers[name][:owner] + "-" + existing_renderers[name][:id] + "\">" + name + "</a></li>"
					}.join("\n") +
				"</ul>" +
			"</p>"
		end
	end

	class Renderer < JsDuck::Tag::MemberTag
		def initialize
			@tagname = :echo_renderer
			@pattern = "echo_renderer"
			@member_type = {
				:title => "Renderers",
				:position => MEMBER_POS_METHOD + 0.2,
				:icon => File.dirname(__FILE__) + "/../../docs/icons/renderer.png",
			}
		end

		def parse_doc(scanner, position)
			scanner.standard_tag({
				:tagname => @tagname,
				:type => true,
				:name => true
			})
		end

		def process_doc(h, tags, position)
			tag = tags[0]
			h[:name] = tag[:name]
			h[:params] = Echo::Renderer.generic_params
			h[:return] = Echo::Renderer.generic_return
			h[:fires] = false
		end

		def to_html(member, cls)
			member_link(member) + member_params(member[:params])
		end

		def self.generic_params
			[{
				:tagname => :params,
				:name => "element",
				:type => "HTMLElement",
				:html_type => "HTMLElement",
				:doc => "The jQuery wrapped DOM element"
			}]
		end

		def self.generic_return
			{
				:type => "HTMLElement",
				:html_type => "HTMLElement",
				:doc => "The same element as in renderer parameters"
			}
		end
	end

	class Label < JsDuck::Tag::MemberTag
		def initialize
			@tagname = :echo_label
			@pattern = "echo_label"
			@member_type = {
				:title => "Labels",
				:position => MEMBER_POS_METHOD + 0.3,
				:icon => File.dirname(__FILE__) + "/../../docs/icons/label.png",
			}
			super
		end

		def parse_doc(scanner, position)
			scanner.standard_tag({:tagname => @tagname, :type => false, :name => true})
		end

		def process_doc(h, tags, position)
			tag = tags[0]
			h[:name] = tag[:name]
			h[:type] = "String"
		end

		def process_code(code)
			h = super(code)
			h[:name] = code[:name]
			h[:value] = code[:default]
			h
		end

		def to_html(member, cls)
			member_link(member) + " : " + CGI.escapeHTML(member[:value] || "")
		end
	end

	class Event < JsDuck::Tag::MemberTag
		def initialize
			@tagname = :echo_event
			@pattern = "echo_event"
			@member_type = {
				:title => "Events",
				:position => MEMBER_POS_EVENT - 0.1,
				:icon => File.dirname(__FILE__) + "/../../docs/icons/event.png",
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
			tag = tags[0]
			context[:topic] = tag[:name]
			# use last part of the topic as the event name
			context[:name] = tag[:name].sub(/^.*\.(\w+)$/, "\\1")
			context[:doc] = tag[:doc]
		end

		def merge(hash, docs, code)
			hash[:params] = [] unless hash[:params]
			# put topic @param on the first place in param list unless it was specified in docs
			if !hash[:params][0] || hash[:params][0][:name] != "topic"
				hash[:params].unshift({
					:tagname => :params,
					:name => "topic",
					:type => "String",
					:doc => "Full name of the event \"" + hash[:topic] + "\""
				})
			end
			# put data @param on the second place in param list unless it was specified in docs
			if !hash[:params][1] || hash[:params][1][:name] != "data"
				hash[:params].push({
					:tagname => :params,
					:name => "data",
					:type => "Object",
					:doc => "Data object with arbitrary properties"
				})
			end
		end

		def to_html(member, cls)
			member_link(member) + member_params(member[:params])
		end
	end
end

class JsDuck::Tag::Method
	alias_method :old_initialize, :initialize
	def initialize
		old_initialize
		# we want different icon for the @method tag
		@member_type[:icon] = File.dirname(__FILE__) + "/../../docs/icons/method.png"
	end

	alias_method :old_merge, :merge
	def merge(hash, docs, code)
		old_merge(hash, docs, code)
		# turn off autodetection for the @fires tag because we never fire Ext events
		hash[:autodetected][:fires] = nil if hash[:autodetected]
	end
end

class JsDuck::Tag::Cfg
	alias_method :old_initialize, :initialize
	def initialize
		old_initialize
		# we want different icon for the @cfg tag
		@member_type[:icon] = File.dirname(__FILE__) + "/../../docs/icons/cfg.png"
	end
end
