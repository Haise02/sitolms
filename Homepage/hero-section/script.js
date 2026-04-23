// ========================================
// SFONDO ANIMATO BLU NAVY
// ========================================
(function() {
  const vShader = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

  const fShader = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;
void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv * 2.0 - 1.0) * uResolution / mr;
  float d = -uTime * 0.5;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5;
  float p1 = cos(uv.x * d) * 0.5 + 0.5;
  float p2 = cos(uv.y * a) * 0.5 + 0.5;
  
  // Colore #132E55 con variazioni
  vec3 col = vec3(0.0745, 0.1804, 0.3333) * (0.7 + p1 * 0.5 + p2 * 0.3);
  
  gl_FragColor = vec4(col, 1.0);
}`;

  function initBg() {
    const container = document.getElementById('iridescence-bg-unique');
    if (!container) return;
    
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none';
    container.appendChild(canvas);
    
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    
    function createShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }
    
    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl.VERTEX_SHADER, vShader));
    gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fShader));
    gl.linkProgram(program);
    gl.useProgram(program);
    
    const vertices = new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    const pos = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uRes = gl.getUniformLocation(program, 'uResolution');
    
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = container.offsetWidth * dpr;
      canvas.height = container.offsetHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    function animate(t) {
      gl.uniform1f(uTime, t * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(animate);
    }
    animate(0);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBg);
  } else {
    setTimeout(initBg, 100);
  }
})();

// ========================================
// PLAY VIDEO AL CLICK — YOUTUBE EMBED
// Al click: nascondi thumbnail, mostra iframe YouTube forzando autoplay
// tramite il parametro &autoplay=1 nell'URL.
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const videoWrapper = document.getElementById('videoWrapper');
    const playButton = document.getElementById('playButton');
    const videoThumbnail = document.getElementById('videoThumbnail');
    const youtubeIframe = document.getElementById('youtubePlayer');

    if (!videoWrapper || !playButton || !videoThumbnail || !youtubeIframe) return;

    function startVideo(e) {
        if (e) { e.stopPropagation(); e.preventDefault(); }

        // Evita doppio avvio
        if (videoThumbnail.classList.contains('hidden')) return;

        videoThumbnail.classList.add('hidden');
        playButton.classList.add('hidden');
        youtubeIframe.style.display = 'block';

        const src = youtubeIframe.getAttribute('src') || '';
        if (!/[?&]autoplay=1(&|$)/.test(src)) {
            const separator = src.includes('?') ? '&' : '?';
            youtubeIframe.setAttribute('src', src + separator + 'autoplay=1');
        }
    }

    // Click sul bottone play o su tutta l'area del video (più tollerante al tap)
    playButton.addEventListener('click', startVideo);
    videoThumbnail.addEventListener('click', startVideo);
    videoWrapper.addEventListener('click', function(e) {
        if (e.target === youtubeIframe) return; // l'iframe gestisce i click al suo interno
        startVideo(e);
    });
});

// ========================================
// EFFETTO 3D VIDEO CHE SEGUE IL MOUSE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const videoWrapper = document.getElementById('videoWrapper');
    
    if (!videoWrapper) return;
    
    // Configurazione effetto 3D
    const maxRotation = 15; // Gradi massimi di rotazione
    const smoothness = 0.1; // Quanto veloce segue il mouse (0-1)
    
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    
    // Traccia posizione mouse
    videoWrapper.addEventListener('mousemove', function(e) {
        const rect = videoWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Normalizza coordinate (-1 a 1)
        const normalizedX = (x / rect.width) * 2 - 1;
        const normalizedY = (y / rect.height) * 2 - 1;
        
        // Calcola rotazione target
        targetX = normalizedY * maxRotation; // Inverte Y per rotazione naturale
        targetY = normalizedX * -maxRotation;
    });
    
    // Reset quando mouse esce
    videoWrapper.addEventListener('mouseleave', function() {
        targetX = 0;
        targetY = 0;
    });
    
    // Animazione smooth
    function animate() {
        // Interpolazione smooth
        currentX += (targetX - currentX) * smoothness;
        currentY += (targetY - currentY) * smoothness;
        
        // Applica trasformazione 3D
        videoWrapper.style.transform = `
            rotateX(${currentX}deg) 
            rotateY(${currentY}deg)
            scale(1.02)
        `;
        
        requestAnimationFrame(animate);
    }
    
    animate();
});
