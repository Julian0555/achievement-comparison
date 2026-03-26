---
layout: none
full-width: true
---

<html lang="en">
  <head>
    <link rel="stylesheet" href="apollo.css">
    <meta charset="utf-8">
    <title>My first three.js app</title>
    <style>
      body { margin: 0; }
    </style>
  </head>
  <body>
	<script type="importmap">
	{
	"imports": {
		"three": "https://cdn.jsdelivr.net/npm/three@v0.176.0/build/three.module.js",
		"three/addons/": "https://cdn.jsdelivr.net/npm/three@v0.176.0/examples/jsm/"
		}
	}
	</script>
    <script type="module" src="apollo.js"></script>
  </body>
  <div id="apollo_settings">
    <div class="slidecontainer">
      <input type="range" min="0" max="36" value="0" class="slider" id="myRange">
    </div>
    <input type="checkbox" id="white_background" name="white_background">
    <label for="white_background"> Use White Background </label><br>
    <input type="checkbox" id="hide_jacket" name="hide_jacket">
    <label for="hide_jacket"> Hide Jacket </label><br>
    <input type="checkbox" id="toggle_ortho" name="toggle_ortho">
    <label for="toggle_ortho"> Orthographic View </label><br>
    <input type="checkbox" id="toggle_fresnel" name="toggle_fresnel" checked=true>
    <label for="toggle_fresnel"> Enable Outer Glow </label><br>
    <input type="checkbox" id="toggle_shading" name="toggle_shading" checked=true>
    <label for="toggle_shading"> Enable Shading </label><br>
    <input type="checkbox" id="toggle_diffuse" name="toggle_diffuse" checked=true>
    <label for="toggle_diffuse"> Enable Diffuse </label><br>
    <input type="checkbox" id="show_normals" name="show_normals">
    <label for="show_normals"> Show Normals </label><br>
  </div>
</html>