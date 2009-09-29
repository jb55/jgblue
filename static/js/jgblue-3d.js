/* init the o3djs api only when we create the client */
o3djs.require('o3djs.util');
o3djs.require('o3djs.math');
o3djs.require('o3djs.rendergraph');
o3djs.require('o3djs.primitives');
o3djs.require('o3djs.effect');

var jgblue = jgblue || {};
jgblue.j3d = jgblue.j3d || {};

jgblue.j3d.Entity = Class.extend({
    
    init: function () {
        this.client = jgblue.j3d.client;
        this.oclient = jgblue.j3d.client.client;
        this.loc_transform = this.client.pack.createObject('Transform');
        this.loc_transform.parent = this.client.root;
        this.rot_transform = this.client.pack.createObject('Transform');
        this.rot_transform.parent = this.loc_transform;
    },

    move: function (x, y, z) {
        this.loc_transform.translate([x?x:0, y?y:0, z?z:0]);
    },

    rotateY: function (amount) {
        this.rot_transform.identity();
        this.rot_transform.rotateY(amount * this.client.clock);
    },

    rotateX: function (amount) {
        this.rot_transform.identity();
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
    
    init: function (material) {
        this._super();
        var pack = this.client.pack;

        this.shape = pack.createObject('Shape');
        this.primitive = pack.createObject('Primitive');
        this.streamBank = pack.createObject('StreamBank');
        this.primitive.material = material;
        this.primitive.owner = this.shape;
        this.primitive.streamBank = this.streamBank;
        this.rot_transform.addShape(this.shape);
    }

});

jgblue.j3d.Cube = jgblue.j3d.Primitive.extend({

    init: function (material) {
        // TODO: pass a material to super
        this._super(material);
        var pack = this.client.pack;

        this.primitive.primitiveType = this.client.o3d.Primitive.TRIANGLELIST;
        this.primitive.numberPrimitives = 12;
        this.primitive.numberVertices = 8;

        this.primitive.createDrawElement(pack, null);

        var positionArray = [
            -0.5, -0.5,  0.5,  // vertex 0
             0.5, -0.5,  0.5,  // vertex 1
            -0.5,  0.5,  0.5,  // vertex 2
             0.5,  0.5,  0.5,  // vertex 3
            -0.5,  0.5, -0.5,  // vertex 4
             0.5,  0.5, -0.5,  // vertex 5
            -0.5, -0.5, -0.5,  // vertex 6
             0.5, -0.5, -0.5   // vertex 7
        ];

        var indicesArray = [
            0, 1, 2,  // face 1
            2, 1, 3,
            2, 3, 4,  // face 2
            4, 3, 5,
            4, 5, 6,  // face 3
            6, 5, 7,
            6, 7, 0,  // face 4
            0, 7, 1,
            1, 7, 3,  // face 5
            3, 7, 5,
            6, 0, 4,  // face 6
            4, 0, 2
        ];

        var positionsBuffer = pack.createObject('VertexBuffer');
        var positionsField = positionsBuffer.createField('FloatField', 3);
        positionsBuffer.set(positionArray);

        var indexBuffer = pack.createObject('IndexBuffer');
        indexBuffer.set(indicesArray);

        // Associate the positions buffer with the stream bank
        this.streamBank.setVertexStream(
            this.client.o3d.Stream.POSITION, // this stream stores vertex positions
            0,                               // first position of stream
            positionsField,                  // the field this stream uses 
            0);                              // step amount

        this.primitive.indexBuffer = indexBuffer;
    }

});

jgblue.j3d.Spacecraft = jgblue.j3d.Entity.extend({

    init: function () {
        this._super();
    }

});

jgblue.j3d.Client = function (onInit) {

    var that = this;
    o3djs.util.makeClients( function (clientElements) {
        var o3dElement = clientElements[0]; 
        that.o3d = o3dElement.o3d;
        that.math = o3djs.math;
        that.client = o3dElement.client;
        that.clock = 0;
        that.timeMult = 1;

        that.pack = that.client.createPack();
        that.view = o3djs.rendergraph.createBasicView(
            that.pack,
            that.client.root,
            that.client.renderGraphRoot,
            [32/255, 37/255, 43/255, 1.0]
        );

        that.view.drawContext.projection = that.math.matrix4.perspective(
            that.math.degToRad(30), // 30 degree fov.
            that.client.width / that.client.height,
            1,                  // Near plane.
            5000);              // Far plane.

        that.view.drawContext.view = that.math.matrix4.lookAt([0, 1, 5],  // eye
                                                              [0, 0, 0],  // target 
                                                              [0, 1, 0]); // up
        /* create a transform to put data on */
        that.root = that.pack.createObject('Transform');

        /* connect the data root to the client */
        that.root.parent = that.client.root;
        that.entities = [];

        that.client.setRenderCallback(that.renderCallback);
        if (onInit) {
            onInit(that);
        }
    });

}

jgblue.j3d.createClient = function (onInit) {
    jgblue.j3d.client = jgblue.j3d.client || new jgblue.j3d.Client(onInit);
    return jgblue.j3d.client;
}

jgblue.j3d.Client.prototype.createTestMaterial = function () {
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
}

jgblue.j3d.Client.prototype.renderCallback = function (renderEvent) {
    var that = jgblue.j3d.client;
    that.clock += renderEvent.elapsedTime * that.timeMult;

    for (var i = 0; i < that.entities.length; ++i) {
        var ent = that.entities[i];
        ent.update();
    }
}

jgblue.j3d.Client.prototype.addEntity = function (entity) {
    if (entity instanceof Array) {
        for (var i = 0; i < entity.length; ++i) {
            this.entities.push(entity[i]);
        }
    } else {
        this.entities.push(entity);
    }
}

jgblue.j3d.Client.prototype.loadTestScene = function () {
    var testMaterial = this.createTestMaterial();
    var cube = new jgblue.j3d.Cube(testMaterial);
    //var cube2 = new jgblue.j3d.Cube(testMaterial);
    cube.setUpdateFn(cubeUpdate);
    //cube2.setUpdateFn(cubeUpdate2);
    this.addEntity(cube);
    //this.addEntity(cube2);

    function cubeUpdate() {
        this.move(0.0, 0.0, -0.05);
        this.rotate(2.0, 1.0);
    }
/*
    function cubeUpdate2() {
        this.move(0.0, 0.0, -0.01);
        this.rotate(2.0, 1.0);
    }*/
}


