uniform sampler2D uTexture;

varying vec2 vUv;

void main()
{
    vec3 planeTexture = texture(uTexture, vUv).rgb;
    gl_FragColor = vec4(planeTexture, 1.0);
}