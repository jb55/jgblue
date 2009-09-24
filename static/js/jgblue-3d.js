o3djs.require('o3djs.util');
o3djs.require('o3djs.math');
o3djs.require('o3djs.rendergraph');
o3djs.require('o3djs.primitives');
o3djs.require('o3djs.effect');

// global variables
var g_o3dElement;
var g_client;
var g_o3d;
var g_math;
var g_pack;
var g_viewInfo;
var g_clockParam;

/**
 * Creates the client area.
 */
function init() {
  // These are here so that they are visible to both the browser (so
  // selenium sees them) and the embedded V8 engine.
  window.g_clock = 0;
  window.g_timeMult = 1;
  window.g_finished = false;  // for selenium testing.

  // Comment out the line below to run the sample in the browser
  // JavaScript engine.  This may be helpful for debugging.
  o3djs.util.setMainEngine(o3djs.util.Engine.V8);

  o3djs.util.makeClients(initStep2, 'LargeGeometry');
}


/**
 * Initializes global variables, positions camera, creates the material, and
 * draws the plane.
 * @param {Array} clientElements Array of o3d object elements.
 */
function initStep2(clientElements) {
  // Init global variables.
  initGlobals(clientElements);

  // Set up the view and projection transformations.
  initContext();

  // Add the shapes to the transform heirarchy.
  createPlane();

  // Setup render callback.
  g_client.setRenderCallback(onRender);

  window.g_finished = true;  // for selenium testing.
}


/**
 * Initializes global variables and libraries.
 * @param {Array} clientElements An array of o3d object elements assumed
 *   to have one entry.
 */
function initGlobals(clientElements) {
  g_o3dElement = clientElements[0];
  g_o3d = g_o3dElement.o3d;
  g_math = o3djs.math;

  // Set window.g_client as well.  Otherwise when the sample runs in
  // V8, selenium won't be able to find this variable (it can only see
  // the browser environment).
  window.g_client = g_client = g_o3dElement.client;

  // Create a pack to manage the objects created.
  g_pack = g_client.createPack();

  // Create the render graph for a view.
  g_viewInfo = o3djs.rendergraph.createBasicView(
      g_pack,
      g_client.root,
      g_client.renderGraphRoot);
}


/**
 * Sets up reasonable view and projection matrices.
 */
function initContext() {
  // Set up a perspective transformation for the projection.
  g_viewInfo.drawContext.projection = g_math.matrix4.perspective(
      g_math.degToRad(30), // 30 degree frustum.
      g_client.width / g_client.height, // Aspect ratio.
      1,                  // Near plane.
      5000);              // Far plane.

  // Set up our view transformation to look towards the world origin where the
  // cube is located.
  g_viewInfo.drawContext.view = g_math.matrix4.lookAt(
      [4, 4, 4],   // eye
      [0, 0, 0],   // target
      [0, 1, 0]);  // up
}


/**
 * Creates an effect using the shaders in the textarea in the document, applies
 * the effect to a new material, binds the uniform parameters of the shader
 * to parameters of the material, and sets certain parameters: the light and
 * camera position.
 * @return {Material} The material.
 */
function createMaterial() {
  // Create a new, empty Material and Effect object.
  var material = g_pack.createObject('Material');
  var effect = g_pack.createObject('Effect');

  // Load shader string from document.
  var shaderString = o3djs.util.getElementContentById('effect');
  effect.loadFromFXString(shaderString);

  // Apply the effect to this material.
  material.effect = effect;

  // Bind uniform parameters declared in shader to parameters of material.
  effect.createUniformParameters(material);

  // Set the material's drawList.
  material.drawList = g_viewInfo.performanceDrawList;

  // Set light and camera positions for the pixel shader.
  material.getParam('lightWorldPos').value = [3, 10, 0];
  material.getParam('cameraWorldPos').value = [1, 3, 12];

  // Look up clock param.
  g_clockParam = material.getParam('clock');

  return material;
}


/**
 * Creates the plane using the primitives utility library, and adds it to the
 * transform graph at the root node.
 */
function createPlane() {
  // This will create a plane subdivided into 180,000 triangles.
  var plane = o3djs.primitives.createPlane(
      g_pack, createMaterial(), 4, 4, 300, 300);

  // Add the shape to the transform heirarchy.
  g_client.root.addShape(plane);
}


/**
 * Updates the clock for the animation.
 * @param {!o3d.RenderEvent} renderEvent Rendering Information.
 */
function onRender(renderEvent) {
  var elapsedTime = renderEvent.elapsedTime;

  // Update g_clock in the browser and cache a V8 copy that can be
  // accessed efficiently. g_clock must be in the browser for selenium.
  var clock = window.g_clock + elapsedTime * window.g_timeMult;
  window.g_clock = clock;

  g_clockParam.value = clock;
}


/**
 * Cleanup before exiting.
 */
function unload() {
  if (g_client) {
    g_client.cleanup();
  }
}

