require 'erb'
require 'yaml'

BOOKS_TEMPLATE_PATH = 'books-template.html.erb'.freeze
BOOK_TEMPLATE_PATH = 'book-template.html.erb'.freeze
YAML_FILE_PATH = 'books.yaml'.freeze

books_template = ERB.new(File.read(BOOKS_TEMPLATE_PATH), trim_mode: "-")
book_template = ERB.new(File.read(BOOK_TEMPLATE_PATH), trim_mode: "-")

books_yaml = []
good_books = []
more_books = []

YAML.load_stream(File.read(YAML_FILE_PATH)) do |document|
  books_yaml.push(document)
end

books_yaml[0].each do |book|
  good_books.push(book_template.result_with_hash(book))
end

books_yaml[1].each do |book|
  more_books.push(book_template.result_with_hash(book))
end

output = books_template.result_with_hash({good_books: good_books, more_books: more_books})

File.write('books.html', output)
