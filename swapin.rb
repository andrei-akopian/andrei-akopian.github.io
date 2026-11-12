require 'erb'

def backgroundinsert(input)
  background = File.read(input)[/<!--START-->(.*?)<!--END-->/m, 1]
  return background
end

template = File.read(ARGV[0])
result = ERB.new(template).result(binding)

File.write(ARGV[1], result)