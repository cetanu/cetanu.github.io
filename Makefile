.PHONY: help post journal serve build

help:
	@echo "Usage:"
	@echo "  make post title=\"My Post Title\"  - Create a new blog post"
	@echo "  make journal                     - Create a new daily journal entry"
	@echo "  make serve                       - Start Zola development server"
	@echo "  make build                       - Build the static site"

post:
	@if [ -z "$(title)" ]; then echo "Error: title is required. Use 'make post title=\"Your Title\"'"; exit 1; fi
	@FILENAME="content/blog/$$(echo \"$(title)\" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-').md"; \
	if [ -f "$$FILENAME" ]; then echo "Error: $$FILENAME already exists"; exit 1; fi; \
	echo "+++" > "$$FILENAME"; \
	echo "title = \"$(title)\"" >> "$$FILENAME"; \
	echo "date = $$(date +%Y-%m-%d)" >> "$$FILENAME"; \
	echo "+++" >> "$$FILENAME"; \
	echo "" >> "$$FILENAME"; \
	echo "<replace with content>" >> "$$FILENAME"; \

journal:
	@DATE=$$(date +%Y-%m-%d); \
	FILENAME="content/journal/$$DATE.md"; \
	if [ -f "$$FILENAME" ]; then echo "Error: $$FILENAME already exists"; exit 1; fi; \
	echo "+++" > "$$FILENAME"; \
	echo "title = \"$$DATE\"" >> "$$FILENAME"; \
	echo "date = $$DATE" >> "$$FILENAME"; \
	echo "" >> "$$FILENAME"; \
	echo "[taxonomies]" >> "$$FILENAME"; \
	echo "tags = [\"personal\"]" >> "$$FILENAME"; \
	echo "+++" >> "$$FILENAME"; \
	echo "" >> "$$FILENAME"; \
	echo "<replace with content>" >> "$$FILENAME"; \

serve:
	zola serve

build:
	zola build
