# $:.push File.expand_path("../lib", __FILE__)
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
# Maintain your gem's version:
require "rails_markdown_editor/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "rails_markdown_editor"
  s.version     = Rails::Markdown::Editor::VERSION
  s.authors     = ["hzh"]
  s.email       = ["sforce1000@gmail.com"]
  s.homepage    = "homepage"
  s.summary     = "Summary of RailsMarkdownEditor."
  s.description = "Description of RailsMarkdownEditor."
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 4.2.0"
  s.add_dependency "codemirror-rails", "~> 5.0"

end
