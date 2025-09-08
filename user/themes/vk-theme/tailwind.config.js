/** @type {import('tailwindcss').Config} */
module.exports = {
  // This section tells Tailwind where to look for class names.
  // The default paths are excellent for a Grav theme.
  content: [
    '../../config/**/*.yaml',
    '../../pages/**/*.md',
    './blueprints/**/*.yaml',
    './js/**/*.js',
    './templates/**/*.twig',
    './kocietexty.yaml',
    './kocietexty.php',
    './user/themes/vk-theme/templates/**/*.twig'
  ],

  // You can enable dark mode based on a class ('dark') on the <html> tag.
  darkMode: 'class',

  // This is where we extend the default Tailwind theme.
  theme: {
    extend: {
      // We are adding our custom color palette here.
      // You can now use classes like `bg-ink`, `text-paper`, `border-orange`, etc.
      colors: {
        ink: '#090b15',    // A dark, near-black for text
        paper: '#f5f0f4',  // A warm, off-white for backgrounds
        orange: '#f78f1f', // A vibrant orange
        teal: '#4ca4a4',   // A soft teal for accents
        red: '#9d1f2f',    // A standard red
        green: '#2f6b50',  // A bright green
        plum: '#7a4b8a', // A rich purple
      },
    },
  },

  variants: {
    extend: {}
  },

  // This section includes the default plugins that come with the theme skeleton.
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-debug-screens'),
  ]
}