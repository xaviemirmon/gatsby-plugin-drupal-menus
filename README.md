# Drupal menus for Gatsby

This module works alongside the [Gatsby Live Preview](https://www.drupal.org/project/gatsby)  module for Drupal.

## Installation

`npm -i gatsby-plugin-drupal-menus`

In your `gatsby-config.js` add:

module.exports = {
  plugins: [
    `gatsby-plugin-drupal-menus`
  ]
}

## Usage

To use this component simply add the following to your site's  where your wish for your menu to appear

```jsx harmony
<Menu />
```

And the `main` menu will appear.  

The menu also accepts a prop of `menuName` which is the drupal machine name for the menu. 

If for example, you wished to add the footer menu, you could do something like the following:

```jsx harmony
<Menu menuName={`footer`} />
```
