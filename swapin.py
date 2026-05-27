"""
Inserts HTML files into other HTML files. (basically home made web framework).
"""

import sys
argv = sys.argv
if len(argv) < 3:
    print("specify file to pwerform swaps in.")
    exit(1)

target = argv[1]
output = argv[2]
print("compiling", target, "into", output)

CONST = "<!--SWAPIN "
START = "<!--START-->"
END   = "<!--END-->"

def get_file(path) -> str:
    with open(path) as g:
        content = g.read()
    return content[content.find(START)+len(START):content.find(END)].strip(" ")

with open(target, "r") as f:
    with open(output, "w") as o:
        for line in f:
            if CONST in line:
                tabs = line.count("\t")
                i = line.find(CONST) + len(CONST)
                e = line.find(" ", i)
                path = line[i:e]
                content = get_file(path)
                print("inserting", path, "into", target)
                o.write(get_file(path))
            else:
                o.write(line)
