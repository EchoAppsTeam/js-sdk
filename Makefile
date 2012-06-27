sdk:
	@echo "Making SDK..."
	@cp -r src/* web/sdk
	@cp -r tests web/sdk
	@echo "Done!"

doc:
	@echo "Removing old docs..."
	rm -rf docs
	@echo "Making docs..."
	jsduck src --output docs
	@echo "Done!"
