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
      opacity: 0.1,
      wireframe: true
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    scene.add(orb);
    
    // Create a smaller inner sphere
    const innerOrbGeometry = new THREE.SphereGeometry(4.5, 32, 32);
    const innerOrbMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x60a5fa, 
      transparent: true, 
      opacity: 0.05
    });
    const innerOrb = new THREE.Mesh(innerOrbGeometry, innerOrbMaterial);
    scene.add(innerOrb);
    
    // Create text sprites for countries
    const countrySprites = [];
    const sampleCountries = countries.slice(0, 30); // Limit to 30 countries for performance
    
    sampleCountries.forEach((country, index) => {
      // Create a canvas for the text
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 128;
      
      // Draw text on canvas
      context.fillStyle = 'rgba(0, 0, 0, 0)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = '20px Roboto Mono';
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.fillText(country.name.common, canvas.width / 2, canvas.height / 2);
      
      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        opacity: 0.8,
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
      countrySprites.push({
        sprite,
        initialPosition: { ...sprite.position },
        speed: 0.0003 + Math.random() * 0.0005, // Even slower speed
        direction: new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize()
      });
    });
    
    // Position camera
    camera.position.z = 10;
    
    // Animation
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      
      // Rotate the orb slowly
      orb.rotation.x += 0.0002;
      orb.rotation.y += 0.0002;
      innerOrb.rotation.x -= 0.0001;
      innerOrb.rotation.y -= 0.0001;
      
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
