import { ref } from 'vue';
const STORAGE_KEY = 'app-theme';

class ThemeService {
  themes = ['light', 'dark']
  themeClassNamePrefix = 'dx-swatch-';
  currentTheme = ref('');
  isDark = ref(false);

  constructor() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);

    const initialTheme = this.themes.includes(savedTheme)
      ? savedTheme
      : this.themes[0];

    this.currentTheme.value = initialTheme;
    this.isDark.value = initialTheme === 'dark';

    const app = document.getElementById('app');
    if (app) {
      app.classList.add(this.themeClassNamePrefix + initialTheme);
    }
  }

  switchAppTheme() {
    const prevTheme = this.currentTheme.value;
    const isCurrentThemeDark = prevTheme === 'dark';

    this.currentTheme.value = this.themes[prevTheme === this.themes[0] ? 1 : 0];

    document.getElementById('app').classList.replace(
      this.themeClassNamePrefix + prevTheme,
      this.themeClassNamePrefix + this.currentTheme.value
    );

    const additionalClassNamePrefix = this.themeClassNamePrefix + 'additional';
    const additionalClassNamePostfix = isCurrentThemeDark ? '-' + prevTheme : '';
    const additionalClassName = `${additionalClassNamePrefix}${additionalClassNamePostfix}`

    document.getElementById('app')
      .querySelector(`.${additionalClassName}`)?.classList
      .replace(additionalClassName, additionalClassNamePrefix + (isCurrentThemeDark ? '' : '-dark'));

    this.isDark.value = this.currentTheme.value === 'dark';
    localStorage.setItem(STORAGE_KEY, this.currentTheme.value);
  }
}

export const themeService = new ThemeService();
