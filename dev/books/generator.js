/*
bun install -g js-yaml

How to Run
bun run generator.js

books-template.html has a line with \n!INSERT GOOD BOOKS HERE\n which will be replaced with generated content.

Once done with dev, run
bun run generator.js release
*/

const yaml = require('js-yaml');
const fs = require('fs');

// Builder
function build(template, output, replaces) {
    fs.readFile(template, 'utf8', (err, file) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        for (const [mark_pattern, filler_func] of Object.entries(replaces)) {
            file = file.replace(mark_pattern, "\n" + filler_func());
        }
        fs.writeFile(output, file, (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            } else {
                console.log(`${template} > ${output} successful!`);
            }
        });
    });
}

// Get document, or throw exception on error

function parseYaml(filename) {
    try {
        return yaml.loadAll(fs.readFileSync(filename, 'utf8'));
    } catch (e) {
        console.log(e);
    }
}

function bookStackHTMLGenerator(books) {
    let bookstack = "";
    for (let book of books) {
        bookstack += converterHTML(bookGenerator(book));
    }
    return bookstack;
}

function bookGenerator(book) {
    let item = {
        "tag": "div",
        "attributes": {
            "class": "book"
        },
        "children": [
            spineGenerator(book.title, book.hotlink),
            coverGenerator(book)
        ]
    }
    return item;
}

function coverGenerator(book) {
    let title_text = linkGenerator(book.title, book.hotlink);
    let title = elementGenerator("h4", {}, [title_text], true);
    let cover_text = {
        "tag": "div",
        "attributes": {
            "class": "cover-text"
        },
        "children": [
            title,
            elementGenerator("p", {}, [book.subheading], true),
            elementGenerator("p", {}, ["by " + book.author], true),
            elementGenerator("p", {
                "class": "description"
            }, [book.description], true)
        ]
    }
    let link_list = elementGenerator('div', {
        "class": "link-list"
    }, []);
    for (const [key, value] of Object.entries(book.links)) {
        link_list["children"].push(linkGenerator(key, value))
    }
    let link_list_wrapper = elementGenerator('div', {
        "class": "link-list-wrapper"
    }, [link_list]);
    cover_text["children"].push(link_list_wrapper);
    let cover = elementGenerator("div", {
            "class": "cover"
        },
        ["<div class=\"cover-fold\"></div>",
            cover_text,
        ]);
    return cover
}

function spineGenerator(title, hotlink) {
    let item = elementGenerator("div", {
        "class": "spine"
    }, [linkGenerator(title, hotlink)]);
    return item;
}

function linkGenerator(text, link) {
    return elementGenerator('a', {
        "href": link
    }, [text], true)
}

/* Structure:
{
  "tag":"div",
  "attributes":[],
  "children":[],
}
*/

function elementGenerator(tag, attributes, children, inline = false) {
    return {
        "tag": tag,
        "attributes": attributes,
        "children": children,
        "inline": inline,
    }
}

function converterHTML(structure, indent_depth = 0, inherited_inline = false) {
    const indent = "\t".repeat(indent_depth);
    if (typeof(structure) == 'string') {
        return (inherited_inline ? "" : indent) + structure + (inherited_inline ? "" : "\n");
    } else if (structure instanceof Object) {
        // inline
        let inline = "inline" in structure ? structure["inline"] : false;
        let full_inline = inline || inherited_inline;
        // conversion
        let result = (inherited_inline ? "" : indent) + "<" + structure['tag'];
        for (let key in structure['attributes']) {
            result += ` ${key}="${structure['attributes'][key]}"`;
        }
        result += ">" + (full_inline ? "" : "\n");
        for (let child of structure['children']) {
            result += converterHTML(child, indent_depth + 1, full_inline);
        }
        return result + (full_inline ? "" : indent) + "</" + structure['tag'] + ">" + (inherited_inline ? "" : "\n");
    }
}

// Run
const dev = "./books.html";
const release = "../../notes/a-stack-of-books.html";
let output = dev;
if (process.argv[2] == "release") {
    output = release;
}
let books_yaml = parseYaml("books.yaml");
build('books-template.html', output, {
    '\n!INSERT GOOD BOOKS HERE\n': () => (bookStackHTMLGenerator(books_yaml[0])),
    '\n!INSERT MORE BOOKS HERE\n': () => (bookStackHTMLGenerator(books_yaml[1]))
})