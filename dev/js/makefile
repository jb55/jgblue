STATIC=../../static/
PUBDIR=${STATIC}js/
OUTDIR=./build/
COMPRESSOR=../yui/build/yuicompressor-2.4.2.jar
ARGS=
VPATH=${OUTDIR}
INST_TARGETS=${OUTDIR}jgblue.js ${OUTDIR}jgblue3d.js

O3D=${STATIC}j3d/o3djs/
J3D=${STATIC}j3d/
J3D_TARGETS=${O3D}base.js ${O3D}util.js ${O3D}event.js ${O3D}error.js ${O3D}math.js \
	${O3D}rendergraph.js ${O3D}primitives.js ${O3D}effect.js ${O3D}io.js \
	${O3D}arcball.js ${O3D}quaternions.js ${O3D}material.js ${PUBDIR}jgblue-3d.js

COMPRESS_CMD=java -jar ${COMPRESSOR} ${ARGS} ${OUTDIR}$< -o ${OUTDIR}$@
CAT_CMD=cat $^ > ${OUTDIR}$@ 

SED_REPLACE=-e 's/^o3djs\.require\(.*\);$$//g'

jgblue3d.js: combined3d.js
	${COMPRESS_CMD}

jgblue.js: combined.js
	${COMPRESS_CMD}

combined.js: ${PUBDIR}ext.js ${PUBDIR}main.js
	${CAT_CMD}
	sed ${SED_REPLACE} ${OUTDIR}$@ > ${OUTDIR}$@.clean
	mv ${OUTDIR}$@.clean ${OUTDIR}$@

combined3d.js: ${J3D_TARGETS}
	${CAT_CMD}
	sed ${SED_REPLACE} ${OUTDIR}$@ > ${OUTDIR}$@.clean
	mv ${OUTDIR}$@.clean ${OUTDIR}$@

.PHONY: install clean all

all: jgblue3d.js jgblue.js

install:
	cp ${INST_TARGETS} ${PUBDIR}

clean:
	rm ${OUTDIR}*.js

