PUBDIR=../../static/js/
OUTDIR=./build/
COMPRESSOR=../yui/build/yuicompressor-2.4.2.jar
ARGS=
VPATH=${OUTDIR}
INST_TARGETS=${OUTDIR}jgblue.js

jgblue.js: combined.js
	java -jar ${COMPRESSOR} ${ARGS} ${OUTDIR}$< -o ${OUTDIR}$@

combined.js: ext.js main.js
	cat $^ > ${OUTDIR}$@ 

.PHONY: install clean

install:
	cp ${INST_TARGETS} ${PUBDIR}

clean:
	rm ${OUTDIR}*.js

