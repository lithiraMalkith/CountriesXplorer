import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const FloatingCountriesOrb = ({ countries }) => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    if (!countries || countries.length === 0) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create a large sphere (the orb)
    const orbGeometry = new THREE.SphereGeometry(5, 32, 32);
    const orbMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x3b82f6, 
      transparent: true, 
      opacity: 0.3,
      wireframe: true
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    scene.add(orb);
    
    // Create a smaller inner sphere
    const innerOrbGeometry = new THREE.SphereGeometry(4.5, 32, 32);
    const innerOrbMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x60a5fa, 
      transparent: true, 
      opacity: 0.1
    });
    const innerOrb = new THREE.Mesh(innerOrbGeometry, innerOrbMaterial);
    scene.add(innerOrb);
    
    // Create text sprites for countries
    const countrySprites = [];
    const sampleCountries = countries.slice(0, 30); // Limit to 30 countries for performance
    
    // Function to create a sonar pulse effect at a given position
    const createSonarPulse = (position, color = 0x3b82f6) => {
      const pulseGroup = new THREE.Group();
      
      // Create the center dot
      const dotGeometry = new THREE.SphereGeometry(0.05, 16, 16);
      const dotMaterial = new THREE.MeshBasicMaterial({ 
        color: color,
        transparent: false,
        opacity: 1
      });
      const dot = new THREE.Mesh(dotGeometry, dotMaterial);
      pulseGroup.add(dot);
      
      // Create the pulse rings (3 rings with different scales and opacities)
      const rings = [];
      for (let i = 0; i < 3; i++) {
        // Use more segments (64) to ensure perfect circles
        const ringGeometry = new THREE.RingGeometry(0.1, 0.12, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.7,
          side: THREE.DoubleSide,
          depthTest: false, // Prevent z-fighting
          depthWrite: false // Prevent depth buffer writing
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.scale.set(1, 1, 1);
        ring.userData = {
          initialOpacity: 0.7,
          // Reduce pulse speed by 3x
          pulseSpeed: (0.02 + (i * 0.01)) / 3, 
          pulseSize: 1,
          maxPulseSize: 2 + i, // Different max sizes
          active: false,
          delay: i * 20 // Stagger the start of each ring's animation
        };
        pulseGroup.add(ring);
        rings.push(ring);
      }
      
      // Set position
      pulseGroup.position.copy(position);
      
      // Add to scene
      scene.add(pulseGroup);
      
      return { pulseGroup, rings, position };
    };
    
    // We'll create the pulses after creating the country sprites
    const locationPulses = [];
    
    sampleCountries.forEach((country, index) => {
      // Create a canvas for the text
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 128;
      
      // Draw text on canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = '24px Roboto Mono';
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.fillText(country.name.common, canvas.width / 2, canvas.height / 2);
      
      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      texture.premultiplyAlpha = true; // Fix transparency issues
      const material = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        opacity: 1.2,
        alphaTest: 0.1
      });
      
      const sprite = new THREE.Sprite(material);
      
      // Position the sprite randomly within the orb
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 4 * Math.random() + 0.5; // Random radius between 0.5 and 4.5
      
      sprite.position.x = radius * Math.sin(phi) * Math.cos(theta);
      sprite.position.y = radius * Math.sin(phi) * Math.sin(theta);
      sprite.position.z = radius * Math.cos(phi);
      
      sprite.scale.set(2, 1, 1);
      scene.add(sprite);
      
      // Create a sonar pulse at the same position as the country name
      const blueColors = [0x3b82f6, 0x60a5fa, 0x93c5fd, 0x2563eb, 0x1d4ed8];
      const pulse = createSonarPulse(sprite.position.clone(), blueColors[index % blueColors.length]);
      
      // Store the country sprite reference with the pulse
      pulse.countrySprite = sprite;
      locationPulses.push(pulse);
      
      countrySprites.push({
        sprite,
        initialPosition: { ...sprite.position },
        speed: 0.0003 + Math.random() * 0.0005, // Even slower speed
        direction: new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize(),
        pulse: pulse // Store reference to the pulse
      });
    });
    
    // Position camera
    camera.position.z = 10;
    
    // Animation
    let frame = 0;
    let time = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      time += 0.01;
      
      // Rotate the orb slowly
      orb.rotation.x += 0.0006;
      orb.rotation.y += 0.0006;
      innerOrb.rotation.x -= 0.0003;
      innerOrb.rotation.y -= 0.0003;
      
      // Animate sonar pulses
      locationPulses.forEach(pulse => {
        // Update pulse position to follow the country sprite
        if (pulse.countrySprite) {
          pulse.pulseGroup.position.copy(pulse.countrySprite.position);
        }
        
        pulse.rings.forEach((ring, i) => {
          const userData = ring.userData;
          
          // Start animation after delay
          if (time > userData.delay * 0.1) {
            userData.active = true;
          }
          
          if (userData.active) {
            // Increase the size
            userData.pulseSize += userData.pulseSpeed;
            
            // Reset when reaching max size
            if (userData.pulseSize > userData.maxPulseSize) {
              userData.pulseSize = 1;
            }
            
            // Update scale and opacity based on pulse size
            // Use the same scale for x and y to ensure perfect circles
            ring.scale.set(userData.pulseSize, userData.pulseSize, 1);
            
            // Decrease opacity as the ring expands
            const opacityFactor = 1 - ((userData.pulseSize - 1) / (userData.maxPulseSize - 1));
            ring.material.opacity = userData.initialOpacity * opacityFactor;
          }
          
          // Make the pulse group look at the camera
          pulse.pulseGroup.lookAt(camera.position);
        });
      });
      
      // Move country sprites
      countrySprites.forEach(item => {
        // Move in the direction with the defined speed
        item.sprite.position.x += item.direction.x * item.speed;
        item.sprite.position.y += item.direction.y * item.speed;
        item.sprite.position.z += item.direction.z * item.speed;
        
        // Check if the sprite is too far from its initial position
        const distance = new THREE.Vector3()
          .subVectors(item.sprite.position, item.initialPosition)
          .length();
        
        // If too far, reverse direction
        if (distance > 1.5) {
          item.direction.negate();
        }
        
        // Always face the camera
        item.sprite.lookAt(camera.position);
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frame);
      
      // Properly dispose of all resources
      countrySprites.forEach(item => {
        if (item.sprite.material.map) {
          item.sprite.material.map.dispose();
        }
        item.sprite.material.dispose();
      });
      
      // Dispose location pulses
      locationPulses.forEach(pulse => {
        pulse.rings.forEach(ring => {
          ring.geometry.dispose();
          ring.material.dispose();
        });
        pulse.pulseGroup.children.forEach(child => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      });
      
      orbGeometry.dispose();
      orbMaterial.dispose();
      innerOrbGeometry.dispose();
      innerOrbMaterial.dispose();
      
      // Remove from DOM
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose renderer
      renderer.dispose();
    };
  }, [countries]);
  
  return (
    <div 
      ref={mountRef} 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default FloatingCountriesOrb;
