o3djs.require('o3djs.util');
o3djs.require('o3djs.math');
o3djs.require('o3djs.rendergraph');

$(window).load( init );
$(window).unload (uninit);

// global variables
var g_o3d;
var g_math;
var g_client;
var g_pack;
var g_clock = 0;
var g_timeMult = 1;
var g_cubeTransform;
var g_finished = false;  // for selenium testing

function createColor(r, g, b, a) {
    return [r/255, g/255, b/255, a/255];
}

/**
 * Creates a O3D shape representing a cube.  The shape consists of
 * a single primitive with eight vertices and 12 triangles (two for each face
 * of the cube).
 * @param {o3d.Material} material the material used by the primitive.
 * @return {o3d.Shape} The Shape object created.
 */
function createCube(material) {
  // Create a Shape object for the mesh.
  var cubeShape = g_pack.createObject('Shape');

  // Create the Primitive that will contain the geometry data for
  // the cube.
  var cubePrimitive = g_pack.createObject('Primitive');

  // Create a StreamBank to hold the streams of vertex data.
  var streamBank = g_pack.createObject('StreamBank');

  // Assign the material that was passed in to the primitive.
  cubePrimitive.material = material;

  // Assign the Primitive to the Shape.
  cubePrimitive.owner = cubeShape;

  // Assign the StreamBank to the Primitive.
  cubePrimitive.streamBank = streamBank;

  // The cube is made of 12 triangles. There's eight vertices in total which
  // are shared between the face triangles.
  cubePrimitive.primitiveType = g_o3d.Primitive.TRIANGLELIST;
  cubePrimitive.numberPrimitives = 12; // 12 triangles
  cubePrimitive.numberVertices = 8;    // 8 vertices in total

  // Create a javascript array that stores the X, Y and Z coordinates of each
  // of the 8 corners of the cube.
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

  // The following array defines how vertices are to be put together to form
  // the triangles that make up the cube's faces.  In the index array, every
  // three elements define a triangle.  So for example vertices 0, 1 and 2
  // make up the first triangle, vertices 2, 1 and 3 the second one, etc.
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

  // Create buffers containing the vertex data.
  var positionsBuffer = g_pack.createObject('VertexBuffer');
  var positionsField = positionsBuffer.createField('FloatField', 3);
  positionsBuffer.set(positionArray);

  var indexBuffer = g_pack.createObject('IndexBuffer');
  indexBuffer.set(indicesArray);

  // Associate the positions Buffer with the StreamBank.
  streamBank.setVertexStream(
      g_o3d.Stream.POSITION, // semantic: This stream stores vertex positions
      0,                     // semantic index: First (and only) position stream
      positionsField,        // field: the field this stream uses.
      0);                    // start_index: How many elements to skip in the
                             //     field.

  // Associate the triangle indices Buffer with the primitive.
  cubePrimitive.indexBuffer = indexBuffer;

  return cubeShape;
}

/**
 * This method gets called every time O3D renders a frame.  Here's where
 * we update the cube's transform to make it spin.
 * @param {o3d.RenderEvent} renderEvent The render event object that gives
 *     us the elapsed time since the last time a frame was rendered.
 */
function renderCallback(renderEvent) {
  g_clock += renderEvent.elapsedTime * g_timeMult;
  // Rotate the cube around the Y axis.
  g_cubeTransform.identity();
  g_cubeTransform.rotateY(2.0 * g_clock);
}


/**
 * Creates the client area.
 */
function init() {
  o3djs.util.makeClients(initStep2);
}

/**
 * Initializes O3D, creates the cube and sets up the transform and
 * render graphs.
 * @param {Array} clientElements Array of o3d object elements.
 */
function initStep2(clientElements) {
  // Initializes global variables and libraries.
  var o3dElement = clientElements[0];
  g_client = o3dElement.client;
  g_o3d = o3dElement.o3d;
  g_math = o3djs.math;

  // Initialize O3D sample libraries.
  o3djs.base.init(o3dElement);

  // Create a pack to manage the objects created.
  g_pack = g_client.createPack();

  // Create the render graph for a view.
  var viewInfo = o3djs.rendergraph.createBasicView(
      g_pack,
      g_client.root,
      g_client.renderGraphRoot,
      createColor(32,37,43,255));
    

  // Set up a simple orthographic view.

  viewInfo.drawContext.projection = g_math.matrix4.perspective(
      g_math.degToRad(30), // 30 degree fov.
      g_client.width / g_client.height,
      1,                  // Near plane.
      5000);              // Far plane.

  // Set up our view transformation to look towards the world origin where the
  // cube is located.
  viewInfo.drawContext.view = g_math.matrix4.lookAt([0, 1, 5],  // eye
                                            [0, 0, 0],  // target
                                            [0, 1, 0]); // up

  // Create an Effect object and initialize it using the shaders from the
  // text area.
  var redEffect = g_pack.createObject('Effect');
  var shaderString = document.getElementById('effect').value;
  redEffect.loadFromFXString(shaderString);

  // Create a Material for the mesh.
  var redMaterial = g_pack.createObject('Material');

  // Set the material's drawList.
  redMaterial.drawList = viewInfo.performanceDrawList;

  // Apply our effect to this material. The effect tells the 3D hardware
  // which shaders to use.
  redMaterial.effect = redEffect;

  // Create the Shape for the cube mesh and assign its material.
  var cubeShape = createCube(redMaterial);

  // Create a new transform and parent the Shape under it.
  g_cubeTransform = g_pack.createObject('Transform');
  g_cubeTransform.addShape(cubeShape);

  // Parent the cube's transform to the client root.
  g_cubeTransform.parent = g_client.root;

  // Generate the draw elements for the cube shape.
  cubeShape.createDrawElements(g_pack, null);

  // Set our render callback for animation.
  // This sets a function to be executed every time a frame is rendered.
  g_client.setRenderCallback(renderCallback);

  g_finished = true;  // for selenium testing.
}

/**
 * Removes any callbacks so they don't get called after the page has unloaded.
 */
function uninit() {
  if (g_client) {
    g_client.cleanup();
  }
}

