browsertest:
	browserify -a jsdom:. test/index.js -o test/bundle.js
