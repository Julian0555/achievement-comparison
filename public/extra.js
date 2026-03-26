import * as THREE from 'three';

export const FresnelMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x5555ff,
  metalness: 0,
  roughness: 0
});

FresnelMaterial.onBeforeCompile = (shader) => {
	//console.log(shader.vertexShader);
	//console.log(shader.fragmentShader);
	shader.vertexShader = 
		`varying float vFresnel;
		#define STANDARD
		varying vec3 vViewPosition;
		#ifdef USE_TRANSMISSION
			varying vec3 vWorldPosition;
		#endif
		#include <common>
		#include <batching_pars_vertex>
		#include <uv_pars_vertex>
		#include <displacementmap_pars_vertex>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <normal_pars_vertex>
		#include <morphtarget_pars_vertex>
		#include <skinning_pars_vertex>
		#include <shadowmap_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>
        varying vec2 vUv; 
		void main() {
			#include <uv_vertex>
			#include <color_vertex>
			#include <morphinstance_vertex>
			#include <morphcolor_vertex>
			#include <batching_vertex>
			#include <beginnormal_vertex>
			#include <morphnormal_vertex>
			#include <skinbase_vertex>
			#include <skinnormal_vertex>
			#include <defaultnormal_vertex>
			#include <normal_vertex>
			#include <begin_vertex>
			#include <morphtarget_vertex>
			#include <skinning_vertex>
			#include <displacementmap_vertex>
			#include <project_vertex>
			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			vViewPosition = - mvPosition.xyz;
			#include <worldpos_vertex>
			#include <shadowmap_vertex>
			#include <fog_vertex>
		#ifdef USE_TRANSMISSION
			vWorldPosition = worldPosition.xyz;
		#endif
			vec3 viewNormal = normalize( normalMatrix * objectNormal );
			vec3 viewPosition = normalize( (modelViewMatrix * vec4(position, 1.0)).xyz );
			vFresnel = pow(1.0 - abs(dot(viewNormal, viewPosition)), 3.0);
            //vFresnel = pow(1.0 - abs(normal.z), 3.0); 
            vUv = uv;      

		}`;
		
	shader.fragmentShader = 
		`
        vec3 rgb2hsv(vec3 c)
        {
            vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
            vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
            vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

            float d = q.x - min(q.w, q.y);
            float e = 1.0e-10;
            return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }

        vec3 hsv2rgb(vec3 c)
        {
            vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        varying vec2 vUv;
        varying float vFresnel;
		#define STANDARD
		#ifdef PHYSICAL
			#define IOR
			#define USE_SPECULAR
		#endif
		uniform vec3 diffuse;
		uniform vec3 emissive;
		uniform float roughness;
		uniform float metalness;
		uniform float opacity;
		#ifdef IOR
			uniform float ior;
		#endif
		#ifdef USE_SPECULAR
			uniform float specularIntensity;
			uniform vec3 specularColor;
			#ifdef USE_SPECULAR_COLORMAP
				uniform sampler2D specularColorMap;
			#endif
			#ifdef USE_SPECULAR_INTENSITYMAP
				uniform sampler2D specularIntensityMap;
			#endif
		#endif
		#ifdef USE_CLEARCOAT
			uniform float clearcoat;
			uniform float clearcoatRoughness;
		#endif
		#ifdef USE_DISPERSION
			uniform float dispersion;
		#endif
		#ifdef USE_IRIDESCENCE
			uniform float iridescence;
			uniform float iridescenceIOR;
			uniform float iridescenceThicknessMinimum;
			uniform float iridescenceThicknessMaximum;
		#endif
		#ifdef USE_SHEEN
			uniform vec3 sheenColor;
			uniform float sheenRoughness;
			#ifdef USE_SHEEN_COLORMAP
				uniform sampler2D sheenColorMap;
			#endif
			#ifdef USE_SHEEN_ROUGHNESSMAP
				uniform sampler2D sheenRoughnessMap;
			#endif
		#endif
		#ifdef USE_ANISOTROPY
			uniform vec2 anisotropyVector;
			#ifdef USE_ANISOTROPYMAP
				uniform sampler2D anisotropyMap;
			#endif
		#endif
		varying vec3 vViewPosition;
		#include <common>
		#include <packing>
		#include <dithering_pars_fragment>
		#include <color_pars_fragment>
		#include <uv_pars_fragment>
		#include <map_pars_fragment>
		#include <alphamap_pars_fragment>
		#include <alphatest_pars_fragment>
		#include <alphahash_pars_fragment>
		#include <aomap_pars_fragment>
		#include <lightmap_pars_fragment>
		#include <emissivemap_pars_fragment>
		#include <iridescence_fragment>
		#include <cube_uv_reflection_fragment>
		#include <envmap_common_pars_fragment>
		#include <envmap_physical_pars_fragment>
		#include <fog_pars_fragment>
		#include <lights_pars_begin>
		#include <normal_pars_fragment>
		#include <lights_physical_pars_fragment>
		#include <transmission_pars_fragment>
		#include <shadowmap_pars_fragment>
		#include <bumpmap_pars_fragment>
		#include <normalmap_pars_fragment>
		#include <clearcoat_pars_fragment>
		#include <iridescence_pars_fragment>
		#include <roughnessmap_pars_fragment>
		#include <metalnessmap_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>
		void main() {
            #ifdef disableDiffuse
				vec4 diffuseColor = vec4( vec3(1.0), opacity );
            #else
				vec4 diffuseColor = vec4( diffuse, opacity );
            #endif
			#include <clipping_planes_fragment>
			ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
            
            vec3 totalEmissiveRadiance = emissive;
        #ifdef enableFresnel
            vec3 hsldiffuse = rgb2hsv(texture2D(map, vUv).rgb);
        	#ifdef isJacket
				hsldiffuse.y = hsldiffuse.y * 1.5;
				hsldiffuse.z = 0.8;
			#else
				hsldiffuse.y = 0.7;
				hsldiffuse.z = 1.0;
			#endif
            totalEmissiveRadiance += mix(vec3(0.0), hsv2rgb(hsldiffuse) * 0.1, vFresnel);
        #endif
            #include <logdepthbuf_fragment>
			#ifndef disableDiffuse
				#include <map_fragment>
			#endif
			#include <color_fragment>
			#include <alphamap_fragment>
			#include <alphatest_fragment>
			#include <alphahash_fragment>
			#include <roughnessmap_fragment>
			#include <metalnessmap_fragment>
			#include <normal_fragment_begin>
			#include <normal_fragment_maps>
			#include <clearcoat_normal_fragment_begin>
			#include <clearcoat_normal_fragment_maps>
			#include <emissivemap_fragment>
			#include <lights_physical_fragment>
			#include <lights_fragment_begin>
			#include <lights_fragment_maps>
			#include <lights_fragment_end>
			#include <aomap_fragment>
			vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
			vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
			#include <transmission_fragment>
			vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
			#ifdef USE_SHEEN
				float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
				outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
			#endif
			#ifdef USE_CLEARCOAT
				float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
				vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
				outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
			#endif
			#include <opaque_fragment>
			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>
			#include <dithering_fragment>
            #ifdef disableShading
				gl_FragColor.rgb = pow(texture2D(map, vUv).rgb, vec3(1.0/2.2));
			#endif
		}`;
};