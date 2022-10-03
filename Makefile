release:
	npm run release
start-dev:
	make -C server dev & make -C client start
init-app:
	make -C server install & make -C client install
