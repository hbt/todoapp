require "bundler/setup"
require 'json'


desc "pulls new code + restarts server"
task :release do
    %x[git pull origin master]

    Rake::Task["start_node"].invoke
end

desc "pulls new code + restarts server"
task :start_node do
    Dir.chdir(File.dirname(File.expand_path(__FILE__)) + '/app/server/')

    unless !%x[which forever].empty? && File.exists?(%x[which forever].split("\n")[0])
        print "install forever as sudo `npm install forever -g`\n"
        exit
    end

    %x[mkdir -p ~/logs/tasktree]

    print %x[forever -v stop app.js]
    print %x[forever --append -d -v -o ~/logs/tasktree/node_out.log -e ~/logs/tasktree/node_err.log start app.js]
end

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
#        formated_content = `js-beautify --brace-style=expand -s 4 #{file}`
        formated_content = `js-beautify -s 4 #{file}`
        File.open(file, 'w') {|f| f.write(formated_content) }
    end
    exit
end


task :switch_env do
    # exit if index.html does not exist
    index_file = File.dirname(File.expand_path(__FILE__)) + '/app/web/index.html'
    exit unless File.exists?(index_file)

    # default environment are development (dev) and production (prod)
    # did we pass the right environment name?
    envs = ['dev', 'prod']
    if ARGV.size != 2 || (ARGV & envs).empty?
        p "invalid environment name.  try #{envs.join(' or ')}"
        exit
    end

    # mode is environment name
    mode = ARGV[1]

    dev_str = <<-eos
        <!-- do not edit (generated) begin -->
        <link rel="stylesheet" type="text/css" href="/assets/stylesheets/deps/jasmine.css">
        <script type="text/javascript">
            window.DEBUG = 1;
        </script>
        <script language="javascript" data-main="/assets/javascripts/app.js" src="assets/javascripts/deps/require/requirejs.js" type="text/javascript"></script>
        <!--  end -->
eos

    prod_str = <<-eos
        <!-- do not edit (generated) begin -->
        <script language="javascript" src="assets/javascripts/deps/require/requirejs.js" type="text/javascript"></script>
        <script language="javascript" src="assets/javascripts/min.js"></script>
        <!--  end -->
eos

    content = File.read(index_file)

    # replace content in index.html based on which key is present
    content.gsub!(dev_str, prod_str) if mode == 'prod'
    content.gsub!(prod_str, dev_str) if mode == 'dev'

    # write index.html
    File.open(index_file, 'w'){|f| f.write(content)}
    Dir.chdir(File.dirname(File.expand_path(__FILE__)) + '/app/build')

    # build minified if env is prod
    print %x[node r.js -o build.js] if mode == 'prod'

    p "switching to #{mode}"

    exit
end