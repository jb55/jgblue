/* init the o3djs api only when we create the client */
o3djs.require('o3djs.util');
o3djs.require('o3djs.math');
o3djs.require('o3djs.rendergraph');
o3djs.require('o3djs.primitives');
o3djs.require('o3djs.effect');
o3djs.require('o3djs.io');
o3djs.require('o3djs.arcball');
o3djs.require('o3djs.material');
o3djs.require('o3djs.quaternion');

var jgblue = jgblue || {};
jgblue.j3d = jgblue.j3d || {};

jgblue.j3d.getTexture = function (textureName, callback) {

    var lookup = jgblue.j3d.pack.getObjects(textureName, 'o3d.Texture');

    var assetDir = "/j3d/assets/textures/";
    o3djs.io.loadTexture(jgblue.j3d.pack, assetDir + textureName, function (texture, exception) {
        if (!exception) {
            texture.name = textureName;
        } else {
            window.console.log(exception);
        }

        callback(texture, exception);
    });
};

jgblue.j3d.getMaterial = function (shader) {
    var client = jgblue.j3d;
    var material = o3djs.material.createMaterialFromFile(client.pack, 
        "shaders/" + shader, client.view.performanceDrawList);

    return material;
};

jgblue.j3d.getTextureMaterial = function (textureName, callback) {
    jgblue.j3d.getTexture(textureName, function (texture) {
        var material = jgblue.j3d.getMaterial("texture-only.shader");
        jgblue.j3d.sampler.texture = texture;

        material.getParam('texSampler0').value = jgblue.j3d.sampler;
        callback(material);
    });
};

jgblue.j3d.Entity = Class.extend({
    
    init: function () {
        this.pos = [0.0, 0.0, 0.0];
        this.client = jgblue.j3d;
        this.oclient = jgblue.j3d.client;
        this.loc_transform = this.client.pack.createObject('Transform');
        this.loc_transform.parent = this.client.root;
        this.rot_transform = this.client.pack.createObject('Transform');
        this.rot_transform.parent = this.loc_transform;
    },

    move: function (x, y, z) {
        var clock = this.client.clock;

        this.pos[0] += (x?x:0 * clock);
        this.pos[1] += (y?y:0 * clock);
        this.pos[2] += (z?z:0 * clock);

        this.loc_transform.identity();
        this.loc_transform.translate(this.pos);
    },

    rotateY: function (amount) {
        this.rot_transform.identity();
        this.rot_transform.rotateY(amount * this.client.clock);
    },

    rotateX: function (amount) {
        this.rot_transfo;rm.identity();
        this.rot_transform.rotateX(amount * this.client.clock);
    },

    rotate: function (x, y, z) {
        var vec = this.client.math.mulVectorScalar([x?x:0, y?y:0, z?z:0], this.client.clock); 
        this.rot_transform.identity();
        this.rot_transform.rotateZYX(vec);
    },

    setUpdateFn: function (fn) {
        this.update = fn;
    },

    update: function () {
        // implement me
    }

});

jgblue.j3d.Primitive = jgblue.j3d.Entity.extend({
    
    init: function (shape) {
        this._super();
        
    },

    getShape: function () {
        return this.shape;
    },

    setTexture: function (name) {
        var texture = jgblue.j3d.getTexture(name);
        
    }

});

jgblue.j3d.Cube = jgblue.j3d.Primitive.extend({

    init: function (material, instOf) {
        this._super(material, shape);

        var pack = this.client.pack;
        var shape;

        if (instOf) {
            shape = instOf.getShape();
        } else {
            shape = o3djs.primitives.createCube(pack, material, 1.0);
        }

        this.shape = shape;
        this.rot_transform.addShape(shape);
    }

});

jgblue.j3d.Spacecraft = jgblue.j3d.Entity.extend({

    init: function () {
        this._super();
    }

});

jgblue.j3d.init = function (options, onInit) {

    var that = jgblue.j3d;
    
    if (options.focusIndicator) {
        that.focusIndicator = $(options.focusIndicator);
    }

    that.hasFocus = false;
    $(document).focus( function () {
        that.lostFocus();
    });

    o3djs.util.makeClients( function (clientElements) {
        var o3dElement = clientElements[0]; 
        that.o3dElement = o3dElement;
        that.o3d = o3dElement.o3d;
        that.math = o3djs.math;
        that.quaternions = o3djs.quaternions;
        that.client = o3dElement.client;
        that.clock = 0;
        that.timeMult = 1;

        that.pack = that.client.createPack();
        that.root = that.pack.createObject('Transform');

        /* connect the data root to the client */
        that.root.parent = that.client.root;
        that.entities = [];

        that.view = o3djs.rendergraph.createBasicView(
            that.pack,
            that.client.root,
            that.client.renderGraphRoot,
            [32/255, 37/255, 43/255, 1.0]
        );

        /* global params */
        that.global = o3djs.material.createAndBindStandardParams(that.pack);
        that.global.lightWorldPos.value = [30, 60, 40];
        that.global.lightColor.value = [1, 1, 1, 1];

        /* sampler */
        that.sampler = that.pack.createObject('Sampler');
        that.sampler.minFilter = that.o3d.Sampler.ANISOTROPIC;
        that.sampler.maxAnisotropy = 4;

        /* events */
        o3djs.event.addEventListener(that.o3dElement, 'resize', that.onResize);
        o3djs.event.addEventListener(that.o3dElement, 'mousedown', that.startDragging);
        o3djs.event.addEventListener(that.o3dElement, 'mousemove', that.drag);
        o3djs.event.addEventListener(that.o3dElement, 'mouseup', that.stopDragging);
        

        /* arcball */
        that.arcball = o3djs.arcball.create(that.client.width, that.client.height);

        that.client.renderMode = that.o3d.Client.RENDERMODE_ON_DEMAND;
        that.initContext();

        that.client.render();

        if (onInit) {
            onInit(that);
        }
    });

};

jgblue.j3d.initContext = function () {
    var that = jgblue.j3d;

    that.eyeView = [0, 1, 5];
    that.isDragging = false;
    that.root.identity();
    that.lastRot = that.math.matrix4.identity();
    that.thisRot = that.math.matrix4.identity();

    that.onResize();
    that.view.drawContext.view = that.math.matrix4.lookAt(
        that.eyeView,  // eye
        [0, 0, 0],  // target 
        [0, 1, 0]); // up
};

jgblue.j3d.onResize = function () {
    var that = jgblue.j3d;
    that.view.drawContext.projection = that.math.matrix4.perspective(
        that.math.degToRad(30), // 30 degree fov.
        that.client.width / that.client.height,
        1,                  // Near plane.
        5000);              // Far plane.
};

jgblue.j3d.createClient = function (options, onInit) {
    jgblue.j3d.init(options, onInit);
    return jgblue.j3d;
};

jgblue.j3d.createTestMaterial = function () {
    // Create an Effect object and initialize it using the shaders from the
    // text area.
    var redEffect = this.pack.createObject('Effect');
    var shaderString = document.getElementById('effect').value;
    redEffect.loadFromFXString(shaderString);

    // Create a Material for the mesh.
    var redMaterial = this.pack.createObject('Material');

    // Set the material's drawList.
    redMaterial.drawList = this.view.performanceDrawList;

    // Apply our effect to this material. The effect tells the 3D hardware
    // which shaders to use.
    redMaterial.effect = redEffect;

    return redMaterial;
};

jgblue.j3d.render = function (renderEvent) {
    var that = jgblue.j3d;
    that.clock += renderEvent.elapsedTime * that.timeMult;

    for (var i = 0; i < that.entities.length; ++i) {
        var ent = that.entities[i];
        ent.update();
    }
};

jgblue.j3d.addEntity = function (entity) {
    if (entity instanceof Array) {
        for (var i = 0; i < entity.length; ++i) {
            this.entities.push(entity[i]);
        }
    } else {
        this.entities.push(entity);
    }
};

jgblue.j3d.drag = function (e) {
    var j3d = jgblue.j3d;
    if (j3d.isDragging) {
        var rotQuat = j3d.arcball.drag([e.x, e.y]);
        var rotMat = j3d.quaternions.quaternionToRotation(rotQuat);
        j3d.thisRot = j3d.math.matrix4.mul(j3d.lastRot, rotMat);
        var m = j3d.root.localMatrix;
        j3d.math.matrix4.setUpper3x3(m, j3d.thisRot);
        j3d.root.localMatrix = m;

        j3d.client.render();
    }
};

jgblue.j3d.startDragging = function (e) {
    jgblue.j3d.lastRot = jgblue.j3d.thisRot;
    jgblue.j3d.arcball.click([e.x, e.y]);
    jgblue.j3d.isDragging = true;    
    if (!jgblue.j3d.hasFocus) {
        jgblue.j3d.gotFocus();
    }
};

jgblue.j3d.stopDragging = function (e) {
    jgblue.j3d.isDragging = false;
};


jgblue.j3d.gotFocus = function (e) {
    jgblue.j3d.focusIndicator.text("Got Focus");
    hasFocus = true;
};

jgblue.j3d.lostFocus = function (e) {
    jgblue.j3d.focusIndicator.text("Lost Focus");
    hasFocus = false;
};

jgblue.j3d.scroll = function (e) {
    var zoom = (e.deltaY < 0) ? 1 / jgblue.j3d.zoomFactor : jgblue.j3d.zoomFactor;
    jgblue.j3d.zoomInOut(zoom);
    jgblue.j3d.client.render();
};

jgblue.j3d.loadTestScene = function () {
    var that = jgblue.j3d;
    jgblue.j3d.getTextureMaterial("me.jpg", function (testMaterial) {
        var numCubes = 2;
        var cube;
        for (var i = 0; i < numCubes; ++i) {
            var newCube = new jgblue.j3d.Cube(testMaterial, cube);
            cube = newCube;
            newCube.setUpdateFn(cubeUpdate);
            that.addEntity(newCube);
        }

        function cubeUpdate() {
            this.rotate(1.0, 1.0);
        }

        that.client.render();
    });

};

