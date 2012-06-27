sdk:
	@echo "Making SDK..."
	@cp -r src/* web/sdk
	@cp -r tests web/sdk
	@echo "Done!"

doc:
	@echo "Removing old docs..."
	rm -rf web/sdk/docs
	@echo "Making docs..."
	jsduck src --output web/sdk/docs
	@echo "Done!"
