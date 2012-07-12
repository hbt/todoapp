#!/usr/bin/env ruby

# deprecated -- now using requirejs
# generate index.html based on index.template.html
# replaces placeholders by scripts
def build_web_index
    def transform(filename, key)
        case key
        when :models, :views then
            js_src = filename[filename.index(/assets/)..filename.size]
            str = <<-eos
                   <script type="text/javascript" src="#{js_src}">
                   </script>
            eos
        when :templates then
            template_name = File.basename(filename).split('.')[0]
            content = File.read(filename)
            str = <<-eos
                   <script type="text/html" id="tmpl-#{template_name}">
                   #{content}
                   </script>
            eos
        end
    end

    Dir.chdir(File.dirname(File.expand_path(__FILE__)) + '/../web/')
    # get all files
    extensions = 'js,css,html'
    files = Dir["**/*.{#{extensions}}"].map! { |f| Dir.pwd + File::SEPARATOR + f }

    # structure files by type
    type_file = {:models => [], :templates => [], :views => []}

    # match
    files.each do |f|
        type_file.keys.each do |k|
            type_file[k] << transform(f, k) if f.index(k.to_s)
        end
    end

    tmpl = File.read(Dir.pwd + '/index.template.html')

    type_file.each do |k,v|
        key = "%%#{k.to_s.upcase}%%"

        tmpl.gsub!(key, v.join("\n"))
    end

    # write to index file
    File.open(Dir.pwd + '/index.html', 'w'){|f| f.write(tmpl)}
    update_version
end

# update version file and triggers a page reload when in debug mode
# watch_and_do . js,css,json,html utils/build.rb
def update_version
    Dir.chdir(File.dirname(File.expand_path(__FILE__)) + '/../web/')
    filename = Dir.pwd + '/version.txt'

    version = 0
    if File.exists? filename
        version = eval(File.read(filename))
    end
    version += 1

    tmpfile = File.new filename, "w"
    tmpfile.write version
    tmpfile.flush

    puts version
end

update_version
#build_web_index