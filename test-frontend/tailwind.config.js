// C:\Users\marce\Documents\GitHub\grav-tutorial\test-frontend\tailwind.config.js
export default {
  content: [
    "./public/**/*.php",
    "./templates/**/*.php",
    "./src/**/*.php",
    "./js/**/*.js",
    '../user/themes/kocietexty/templates/**/*.twig',
    '../user/themes/kocietexty/js/**/*.js',
    '../user/themes/vk-theme/templates/**/*.twig',
    '../user/themes/vk-theme/js/**/*.js' 
    
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1a202c',
        'secondary': '#2d3748',
        'accent': '#4a5568',
        'background': '#f7fafc',
        'text': '#2d3748',
        'link': '#3182ce',
        'link-hover': '#2b6cb0',
        'border': '#e2e8f0',
        'error': '#e53e3e',
        'success': '#38a169',
        'warning': '#dd6b20',
        'info': '#3182ce',
        'light': '#f7fafc',
        'dark': '#2d3748',
        'muted': '#a0aec0',
        'muted-light': '#edf2f7',
        'muted-dark': '#4a5568',
        'shadow': 'rgba(0, 0, 0, 0.1)',
        'shadow-dark': 'rgba(0, 0, 0, 0.2)',
        'shadow-light': 'rgba(255, 255, 255, 0.1)'
      }
    }
  },
  plugins: []
}