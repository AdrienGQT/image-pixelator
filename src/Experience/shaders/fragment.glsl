uniform sampler2D baseImage;
uniform float subdivisions;

varying vec2 vUv;

void main(){
    float subdivisionFactor = 1.0 / subdivisions;

    // Grid
    vec2 customUv = round((vUv + (subdivisionFactor * 0.5)) / subdivisionFactor) * subdivisionFactor;

    // Dot
    float strength = 1.0 - step(smoothstep(distance(customUv, vUv + (subdivisionFactor * 0.5)), 0.0, subdivisionFactor * 0.25), 0.5);

    // Image
    vec4 color = texture2D(baseImage, customUv);

    // Opacity
    float opacity = color.w - strength;

    gl_FragColor = vec4(color.xyz, opacity);
}