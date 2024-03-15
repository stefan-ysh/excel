// tailwind.config.cjs
export default {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  // 若不想要默认的设置生效，添加下面的配置
  // corePlugins: {
  //   preflight: false
  // }
};
