sdk:
	@echo "Making SDK..."
	@cp -r src/* web/sdk
	@cp -r tests web/sdk
	@echo "Done!"

docs:
	@echo "Removing old docs..."
	rm -rf web/sdk/docs
	@echo "Making docs..."
	jsduck src --ignore-global  --title="Echo JS SDK" --pretty-json --output web/sdk/docs
	@echo "Done!"
