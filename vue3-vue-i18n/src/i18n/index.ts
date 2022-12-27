import { createI18n } from 'vue-i18n';
import id from './id.json';

console.log(id);

const parse = (v) => {
  console.log(Object.values(v)[0]);
  return Object.values(v)[0].default;
};

const messages = {
  en: {
    message: parse(import.meta.glob('./en.yml', { eager: true })),
  },
  ja: {
    message: parse(import.meta.glob('./ja.yml', { eager: true })),
  },
  id: {
    message: id,
  },
};

// 2. Create i18n instance with options
const i18n = createI18n({
  locale: 'ja', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
  // If you need to specify other options, you can set other options
  // ...
});

console.log(i18n);

export default i18n;
