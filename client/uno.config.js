import { defineConfig, presetUno, presetIcons, presetAttributify } from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),       // use icons like i-carbon-home
    presetAttributify(), // write attributes instead of classnames
  ],
});
