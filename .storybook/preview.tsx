import type { Preview, Decorator } from '@storybook/react';
import { useEffect } from 'react';
import '../src/app/globals.css';

// Переключает класс .dark на <html> в зависимости от выбранной темы
const withTheme: Decorator = (Story, { globals }) => {
  const isDark = globals['theme'] === 'dark';

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
  }, [isDark]);

  return <Story />;
};

const preview: Preview = {
  // Глобальные переменные тулбара
  globalTypes: {
    theme: {
      name: 'Theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark',  title: 'Dark',  icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [withTheme],

  parameters: {
    // Controls — автоматически подхватывают цвет/дату из названия prop
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    // Фоны для тестирования компонентов на разных поверхностях
    backgrounds: {
      default: 'page',
      values: [
        { name: 'page',   value: '#ffffff' },
        { name: 'subtle', value: '#f7f7f8' },
        { name: 'muted',  value: '#efefef' },
        { name: 'dark',   value: '#0f0f0f' },
      ],
    },

    // Вьюпорты
    viewport: {
      viewports: {
        mobile:  { name: 'Mobile',  styles: { width: '375px',  height: '812px'  } },
        tablet:  { name: 'Tablet',  styles: { width: '768px',  height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1440px', height: '900px'  } },
      },
    },

    // По умолчанию компоненты по центру
    layout: 'centered',

    // A11y — показываем нарушения, но не роняем CI
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
