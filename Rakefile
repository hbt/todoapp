require "bundler/setup"
require 'json'

desc "Format javascript files\n format one file `rake format_js [filename]` \n format all files in git status `rake format_js`\n format all files `rake format_js all`"
task :format_js do
    extensions = ['.js', '.json']
    if ARGV[1] == 'all'
        # all files
        javascript_files = Dir["**/*{#{extensions.join(',')}}"]
    elsif ARGV.length > 1
        # specific files
        javascript_files = ARGV[1..-1]
    else
        # only scan for modified/added files
        javascript_files = `git status --porcelain`.split("\n")
        javascript_files.map! {|jsf| (jsf.strip || jsf).split(" ")[1] }
        javascript_files.select! do |jsf|
            extensions.index {|ext| jsf.end_with? ext } != nil
        end
    end

    javascript_files.map do |file|
        p "formatting #{file}"
        formated_content = `js-beautify --brace-style=expand -s 4 #{file}`
        File.open(file, 'w') {|f| f.write(formated_content) }
    end
    exit
end


task :switch_env do
    index_file = File.dirname(File.expand_path(__FILE__)) + '/app/web/index.html'
    exit unless File.exists?(index_file)

    envs = ['dev', 'prod']
    if ARGV.size != 2 || (ARGV & envs).empty?
        p "invalid environment name.  try #{envs.join(' or ')}"
        exit
    end
  
    mode = ARGV[1]

    dev_str = <<-eos
<script language="javascript" data-main="/assets/javascripts/app.js" src="assets/javascripts/deps/require/requirejs.js" type="text/javascript"></script>
eos

    prod_str = <<-eos
<script language="javascript" src="assets/javascripts/deps/require/requirejs.js" type="text/javascript"></script>
<script language="javascript" src="assets/javascripts/min.js"></script>
eos

    content = File.read(index_file)

    content.gsub!(dev_str, prod_str) if mode == 'prod'
    content.gsub!(prod_str, dev_str) if mode == 'dev'


    File.open(index_file, 'w'){|f| f.write(content)}
    Dir.chdir(File.dirname(File.expand_path(__FILE__)) + '/app/build')

    print %x[node r.js -o build.js] if mode == 'prod'

    p "switching to #{mode}"

    exit
end