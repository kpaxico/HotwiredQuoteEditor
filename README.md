# HotwiredQuoteEditor


1. Add *ClientApp* folder and go to that folder run the following, which will create a `package.json` file.

```cmd
> npm init -y
```

To be able to use CSS in our webpack app, we need to set up a new **loader**. Out-of-the-box, webpack only understands `Javascript` and `JSON`. With a loader, we can translate another type of file to a format that webpack understands and can work with.

Loaders are just pure JavaScript functions: they take some data as input and do something to that data and returns a transformed version of the data. When you use two loaders in webpack then it takes the output of the first and sends it as input to the second. In our example it takes the CSS file and runs it through `css-loader` then it takes the output and runs it as input to the `style-loader`.
```json
rules: [{
    test: /\.css$/,
    use: [
        'style-loader',
        'css-loader'
    ]
}]
```

2. Inside *ClientApp* folder, run the following to add *development dependencies*:

- We need `Webpack` to bundle our code.
- With `webpack-cli` we will be using some CLI features for Webpack to make our life easier while writing some scripts.
- We will create a server using the `webpack-dev-server` package. This is only meant to be used in the `development` environment, and not for `production`. This means while developing and working on our code, we don’t need a separate server like Node.js.
- `terser-webpack-plugin` is used for optimization and minification.
- `webpack-merge` is for dividing our configuration into chunks.

- `babel-loader`: This is the loader that helps webpack compile `.js` files.
- `@babel/core`: Babel core compiler, this is a dependency that lets you use `babel-loader`.
- `@babel/preset-env`: Babel preset that allows you to use the latest JavaScript
- `@babel/plugin-proposal-class-properties`: Converts our `class` syntax into a function for browsers that don’t support class syntax.

- `css-loader` reads the CSS from the CSS file and returns the CSS with the `import` and `url(...)` resolved correctly. 
- `style-loader` adds CSS to the DOM by injecting a `script` tag in the header so that the styles are active and visible on the page. This is needed because the CSS is put into the `bundle.js` file - there is no separate styles.css file.
- But it’s possible to output a separate `styles.css` file by using the `mini-css-extract-plugin` instead of using `style-loader`.
- Now when you run webpack, it will output `main.css` file in the `dist` folder that you can reference from your index.html file. (remove the `import "./styles.css"`; line from `index.js` if you added that)
- We use `url-loader` to bundle images, smaller than the specified limit for the image file size, as base64 strings inlined in our code.
- If `url-loader` finds that the size of the file is larger than the specified limit of 8kb, so it passes on the file to the `file-loader`.
- With webpack allowing us to import images as modules, in frameworks, like angular or react, that allow using HTML templates, two-way binding of variables or JSX, its easy to specify src for an `<img>` tag to the image imported in javascript as we saw in the previous lesson. However sometimes if you have too many images on the page, or if you are not using html templates or js-to-html bindings, then importing images in javasscript may not make much sense. Rather you may specify the src path for `<img>` directly in html.
    - With no `import/require` statements for our image resources in javascript, webpack would not process the images as part of bundling as it won’t see those as dependencies.
    - In such cases, we can configure webpack to copy all our image resources to the dist folder using `CopyWebpackPlugin`. With images copied to the distfolder, our relative paths in src of `<img>` tags in html should work.
```
> npm install cross-env --save-dev

> npm install webpack --save-dev
> npm install webpack-cli --save-dev
> npm install copy-webpack-plugin --save-dev
> npm install terser-webpack-plugin --save-dev

> npm install mini-css-extract-plugin --save-dev
> npm install css-loader --save-dev

> npm install babel-loader --save-dev
> npm install @babel/core --save-dev
> npm install @babel/preset-env --save-dev
> npm install @babel/plugin-proposal-class-properties --save-dev
> npm install babel-preset-stage-0 --save-dev
```

3. Add TailwindCSS library
```
> npm install tailwindcss@latest --save-dev
> npm install postcss@latest autoprefixer@latest --save-dev
> npm install postcss-loader --save-dev
> npm install cssnano --save-dev
> npm install @tailwindcss/forms --save-dev
```

Run the Tailwind initialization command:
```cmd
> npx tailwind init -p
```
```cmd
> npx tailwindcss init tailwind-full-config.js --full
```

Add `tailwindcss` and `autoprefixer` to your `postcss.config.js` file, or wherever PostCSS is configured in your project.
```json
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

Add the `@tailwind` directives for each of Tailwind’s layers to your main CSS file.
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. Inside *ClientApp* folder run the following to add *dependencies*:
```cmd
> npm install stimulus --save
> npm install @hotwired/turbo --save

> npm install -D stimulus-transition
> npm install -D stimulus-use
> npm install -D el-transition
```

5. Install SignalR
```
> npm install @microsoft/signalr
```

6. Add Font Awesome package
```cmd
npm install --save-dev @fortawesome/fontawesome-pro
```

7. Extra stimulus components
```cmd
npm install --save-dev stimulus-notification
```

# RUNNING THE APP
```cmd
cd MvcWebApp
dotnet run
```

```
cd MvcWebApp\ClientApp
npm run dev
```
