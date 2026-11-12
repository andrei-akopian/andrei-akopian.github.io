BUILD_DIR = public

.PHONY: all
all: $(BUILD_DIR) $(BUILD_DIR)/index.html $(BUILD_DIR)/assets $(BUILD_DIR)/files $(BUILD_DIR)/puzzles $(BUILD_DIR)/tools $(BUILD_DIR)/simple.html $(BUILD_DIR)/styles.css $(BUILD_DIR)/notes
	du -hd 1

clean:
	rm -r ./$(BUILD_DIR)

$(BUILD_DIR):
	mkdir -p ./$(BUILD_DIR)

$(BUILD_DIR)/index.html: index.html.erb assets/backgrounds
	ruby swapin.rb index.html.erb $(BUILD_DIR)/index.html

$(BUILD_DIR)/assets: assets
	cp -r assets ./public/assets

$(BUILD_DIR)/files: files
	cp -r files ./public/files

$(BUILD_DIR)/notes: notes dev
	mkdir -p ./public/notes
	cp -r notes ./public/
	ruby dev/books/generator.rb dev/books/ ./public/notes/a-stack-of-books.html

$(BUILD_DIR)/puzzles: puzzles
	cp -r puzzles ./public/puzzles

$(BUILD_DIR)/tools: tools
	cp -r tools ./public/tools

$(BUILD_DIR)/simple.html: simple.html
	cp simple.html ./public/simple.html

$(BUILD_DIR)/styles.css: styles.css
	cp styles.css ./public/styles.css
