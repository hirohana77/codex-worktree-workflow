/**
 * client/components/todo-input/todo-input.js
 * 
 * 契约定义：
 * window.createTodoInput(containerElement, options)
 * 
 * options:
 *   - placeholder?: string (默认 "想做点什么？")
 *   - onSubmit: (title: string) => void | Promise<void>
 * 
 * returns:
 *   - focus(): void
 *   - clear(): void
 *   - setDisabled(disabled: boolean): void
 *   - destroy(): void
 */

(function (global) {
  function createTodoInput(container, options = {}) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('[TodoInput] container must be a valid HTMLElement');
    }

    const placeholder = options.placeholder || '想做点什么？';
    const onSubmit = typeof options.onSubmit === 'function' ? options.onSubmit : () => {};

    // 创建 DOM
    const wrapper = document.createElement('form');
    wrapper.className = 'todo-input-wrapper';
    wrapper.setAttribute('novalidate', 'true');

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'todo-input-field';
    input.placeholder = placeholder;
    input.autocomplete = 'off';

    const button = document.createElement('button');
    button.type = 'submit';
    button.className = 'todo-input-btn';
    button.textContent = '添加';

    wrapper.appendChild(input);
    wrapper.appendChild(button);
    container.appendChild(wrapper);

    let isSubmitting = false;

    async function handleSubmit(e) {
      if (e) {
        e.preventDefault();
      }

      if (isSubmitting) return;

      const trimmedValue = input.value.trim();
      if (!trimmedValue) {
        input.focus();
        return;
      }

      try {
        const result = onSubmit(trimmedValue);
        if (result && typeof result.then === 'function') {
          isSubmitting = true;
          setDisabled(true);
          await result;
          clear();
        } else {
          clear();
        }
      } catch (err) {
        console.error('[TodoInput] onSubmit error:', err);
      } finally {
        if (isSubmitting) {
          isSubmitting = false;
          setDisabled(false);
          input.focus();
        }
      }
    }

    wrapper.addEventListener('submit', handleSubmit);

    function focus() {
      input.focus();
    }

    function clear() {
      input.value = '';
    }

    function setDisabled(disabled) {
      input.disabled = !!disabled;
      button.disabled = !!disabled;
    }

    function destroy() {
      wrapper.removeEventListener('submit', handleSubmit);
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    }

    return {
      focus,
      clear,
      setDisabled,
      destroy
    };
  }

  global.createTodoInput = createTodoInput;
})(typeof window !== 'undefined' ? window : globalThis);
