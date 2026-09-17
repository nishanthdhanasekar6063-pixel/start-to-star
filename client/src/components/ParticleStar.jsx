import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ParticleStar() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // PARTICLES
    const particleCount = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const scatteredPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const baseColor = new THREE.Color("#ADD8E6");
    
    // Generate Target Star Positions
    const outerRadius = 5;
    const innerRadius = 2;
    
    function getStarBoundary(t) {
       const sine = Math.sin(Math.PI / 5);
       return (outerRadius * innerRadius * sine) / 
              (innerRadius * Math.sin(Math.PI / 5 - t) + outerRadius * Math.sin(t));
    }

    for (let i = 0; i < particleCount; i++) {
       let r, theta, isInside = false;
       let x, y;
       
       // 40% of particles on the edge, 60% inside
       const isOnEdge = Math.random() < 0.4;
       
       while (!isInside) {
           x = (Math.random() - 0.5) * outerRadius * 2.5;
           y = (Math.random() - 0.5) * outerRadius * 2.5;
           r = Math.sqrt(x*x + y*y);
           theta = Math.atan2(y, x);
           let angle = (theta - Math.PI / 2);
           while (angle < 0) angle += Math.PI * 2;
           angle = angle % (Math.PI * 2 / 5);
           if (angle > Math.PI / 5) angle = (Math.PI * 2 / 5) - angle;
           
           const maxR = getStarBoundary(angle);
           if (isOnEdge) {
               // Force it to be right on the edge
               r = maxR * (0.95 + Math.random() * 0.05); // Very close to the edge
               x = r * Math.cos(theta);
               y = r * Math.sin(theta);
               isInside = true;
           } else {
               if (r <= maxR) {
                   isInside = true;
               }
           }
       }
       
       const z = (Math.random() - 0.5) * 0.4; // Reduced Depth for sharper shape
       
       // Introduce some floating outliers (5%)
       if (Math.random() > 0.95) {
           x *= 1.1 + Math.random() * 0.5;
           y *= 1.1 + Math.random() * 0.5;
       }

       targetPositions[i * 3] = x;
       targetPositions[i * 3 + 1] = y;
       targetPositions[i * 3 + 2] = z;

       // Scattered Position
       scatteredPositions[i * 3] = (Math.random() - 0.5) * 60;
       scatteredPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
       scatteredPositions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 15;

       // Initial position (scattered)
       positions[i * 3] = scatteredPositions[i * 3];
       positions[i * 3 + 1] = scatteredPositions[i * 3 + 1];
       positions[i * 3 + 2] = scatteredPositions[i * 3 + 2];

       // Vary color brightness slightly
       const brightness = 0.6 + Math.random() * 0.4;
       colors[i * 3] = baseColor.r * brightness;
       colors[i * 3 + 1] = baseColor.g * brightness;
       colors[i * 3 + 2] = baseColor.b * brightness;

       // Random size
       sizes[i] = Math.random() * 2.5 + 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader material for glowing dots with sizes
    const material = new THREE.ShaderMaterial({
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                float d = distance(gl_PointCoord, vec2(0.5));
                if (d > 0.5) discard;
                float alpha = (0.5 - d) * 2.0; // Soft edge glow
                gl_FragColor = vec4(vColor, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // SCROLL LOGIC
    let scrollProgress = 0;
    
    const handleScroll = () => {
        const scrollY = window.scrollY;
        // Adjust for typical viewport scroll
        // 0-100: scattered
        // 100-400: fast formation
        // 400-800: rotating
        // > 800: scattering
        
        let p = 0;
        if (scrollY > 50 && scrollY <= 350) {
            p = (scrollY - 50) / 300;
        } else if (scrollY > 350 && scrollY <= 700) {
            p = 1;
        } else if (scrollY > 700 && scrollY <= 1000) {
            p = 1 - (scrollY - 700) / 300;
        } else if (scrollY > 1000) {
            p = 0;
        }
        
        // Easing function for fast energetic formation
        p = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p; // EaseInOutQuad
        
        scrollProgress = Math.max(0, Math.min(1, p));
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call to set state
    handleScroll();
    
    // ANIMATION LOOP
    let animationFrameId;
    let time = 0;

    const currentPositions = geometry.attributes.position.array;

    const animate = () => {
        time += 0.005;
        
        // Interpolate positions based on scroll progress
        for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            // Target lerp
            const targetX = scatteredPositions[idx] * (1 - scrollProgress) + targetPositions[idx] * scrollProgress;
            const targetY = scatteredPositions[idx+1] * (1 - scrollProgress) + targetPositions[idx+1] * scrollProgress;
            const targetZ = scatteredPositions[idx+2] * (1 - scrollProgress) + targetPositions[idx+2] * scrollProgress;
            
            // Fast follow (energetic movement)
            currentPositions[idx] += (targetX - currentPositions[idx]) * 0.15;
            currentPositions[idx+1] += (targetY - currentPositions[idx+1]) * 0.15;
            currentPositions[idx+2] += (targetZ - currentPositions[idx+2]) * 0.15;
            
            // Add subtle random float
            if (scrollProgress === 1) {
               currentPositions[idx] += Math.sin(time * 5 + i) * 0.005;
               currentPositions[idx+1] += Math.cos(time * 5 + i) * 0.005;
            }
        }
        
        geometry.attributes.position.needsUpdate = true;
        
        // Rotate the entire system slightly based on time and scroll
        particles.rotation.y = time * 0.5 + scrollProgress * Math.PI * 0.5;
        particles.rotation.x = time * 0.2;

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // RESIZE LOGIC
    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        if (containerRef.current) {
            containerRef.current.removeChild(renderer.domElement);
        }
        geometry.dispose();
        material.dispose();
        renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1, // Keep behind content
        pointerEvents: 'none', // Don't block interactions
        background: '#0A0F1C' // Dark/black background
      }}
    />
  );
}
