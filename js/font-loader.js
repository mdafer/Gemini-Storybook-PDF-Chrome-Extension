// Font loader to ensure Gemini storybook font styles are preserved
(() => {
  'use strict';

  // Inject font face CSS early with both font families
  const injectFontCSS = () => {
    const existingStyle = document.querySelector('#gemini-font-loader');
    if (existingStyle) return;

    const style = document.createElement('style');
    style.id = 'gemini-font-loader';
    
    style.textContent = `
      @font-face {
        font-family: 'GeminiFont';
        src: url("${chrome.runtime.getURL('font.ttf')}") format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'GeminiFontAlt';
        src: url("${chrome.runtime.getURL('font.ttf')}") format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
      
      /* Enhanced text rendering */
      * {
        font-family: 'GeminiFont', 'GeminiFontAlt', 'Times New Roman', 'Georgia', 'Garamond', 'Book Antiqua', 'Palatino', serif !important;
        text-rendering: optimizeLegibility !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
      }
    `;
    document.head.appendChild(style);
    console.log('Gemini font CSS injected successfully');
  };

  // Simplified font application
  const applyFonts = () => {
    const fontFamily = "'GeminiFont', 'GeminiFontAlt', 'Times New Roman', 'Georgia', 'Garamond', 'Book Antiqua', 'Palatino', serif";
    
    // Apply to all text elements
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      if (element.tagName && !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(element.tagName)) {
        element.style.fontFamily = fontFamily;
      }
    });

    // Apply to buttons specifically
    const buttons = document.querySelectorAll('.gemini-video-generator-button');
    buttons.forEach(button => {
      button.style.fontFamily = fontFamily;
      button.style.fontWeight = '500';
      button.style.letterSpacing = '0.25px';
      
      // Ensure nested elements inherit
      const nested = button.querySelectorAll('*');
      nested.forEach(el => el.style.fontFamily = 'inherit');
    });

    // Apply to story text elements with enhanced styling
    const storyElements = document.querySelectorAll(`
      .story-text, 
      .story-and-actions-container p,
      storybook-text-page-content p,
      [class*="story-text"],
      .story-content,
      .text-content,
      div[class*="text"]:not([class*="button"])
    `.replace(/\s+/g, ' ').trim());
    
    storyElements.forEach(element => {
      const text = element.textContent?.trim();
      if (text && text.length > 30) {
        element.style.fontFamily = fontFamily;
        element.style.lineHeight = '1.7';
        element.style.fontSize = '18px';
        element.style.color = '#2c2c2c';
        element.style.letterSpacing = '0.02em';
        element.style.wordSpacing = '0.05em';
        element.style.textRendering = 'optimizeLegibility';
        
        if (text.length > 100) {
          element.classList.add('story-paragraph');
          element.style.textAlign = 'justify';
          element.style.textJustify = 'inter-word';
        } else if (text.length > 50) {
          element.classList.add('story-text-enhanced');
        }
      }
    });
  };

  // Initialize font loading
  const init = () => {
    injectFontCSS();
    
    // Apply fonts when ready
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(applyFonts);
    } else {
      setTimeout(applyFonts, 100);
    }
    
    // Monitor for new content
    const observer = new MutationObserver(() => {
      clearTimeout(window.geminiStyleTimeout);
      window.geminiStyleTimeout = setTimeout(applyFonts, 200);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
