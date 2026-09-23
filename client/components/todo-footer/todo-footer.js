/**
 * TodoFooter 状态统计与过滤组件
 * 
 * 契约规范：
 * window.createTodoFooter(containerElement, options)
 * 
 * options:
 *   - activeFilter?: 'all' | 'active' | 'completed' (默认 'all')
 *   - onFilterChange: (filter: 'all' | 'active' | 'completed') => void
 *   - onClearCompleted?: () => void
 * 
 * 返回实例：
 *   - update: ({ activeCount, completedCount }) => void
 *   - setFilter: (filter) => void
 *   - destroy: () => void
 */

(function (global) {
  'use strict';

  function createTodoFooter(container, options) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('[TodoFooter] 必须提供有效的 DOM 容器元素作为第一个参数');
    }

    var opts = options || {};
    var currentFilter = opts.activeFilter || 'all';
    var onFilterChange = typeof opts.onFilterChange === 'function' ? opts.onFilterChange : function () {};
    var onClearCompleted = typeof opts.onClearCompleted === 'function' ? opts.onClearCompleted : null;

    var activeCount = 0;
    var completedCount = 0;

    // 创建 DOM 结构
    var footerEl = document.createElement('footer');
    footerEl.className = 'todo-footer';

    // 1. 左侧剩余统计
    var countEl = document.createElement('span');
    countEl.className = 'todo-footer__count';

    var countNumEl = document.createElement('strong');
    countNumEl.className = 'todo-footer__count-num';
    countNumEl.textContent = '0';

    var countTextEl = document.createTextNode(' 项待办未完成');
    countEl.appendChild(countNumEl);
    countEl.appendChild(countTextEl);

    // 2. 中间过滤 Tabs
    var filtersNav = document.createElement('nav');
    filtersNav.className = 'todo-footer__filters';

    var filterConfigs = [
      { key: 'all', label: '全部' },
      { key: 'active', label: '未完成' },
      { key: 'completed', label: '已完成' }
    ];

    var filterButtons = {};

    filterConfigs.forEach(function (cfg) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'todo-footer__filter-btn' + (cfg.key === currentFilter ? ' is-active' : '');
      btn.dataset.filter = cfg.key;
      btn.textContent = cfg.label;

      btn.addEventListener('click', function () {
        if (currentFilter !== cfg.key) {
          applyFilter(cfg.key);
          onFilterChange(cfg.key);
        }
      });

      filterButtons[cfg.key] = btn;
      filtersNav.appendChild(btn);
    });

    // 3. 右侧清除已完成按钮
    var clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'todo-footer__clear-btn is-hidden';
    clearBtn.textContent = '清除已完成';

    if (onClearCompleted) {
      clearBtn.addEventListener('click', function () {
        onClearCompleted();
      });
    }

    footerEl.appendChild(countEl);
    footerEl.appendChild(filtersNav);
    footerEl.appendChild(clearBtn);

    container.appendChild(footerEl);

    // 内部应用过滤高亮状态
    function applyFilter(filterKey) {
      currentFilter = filterKey;
      Object.keys(filterButtons).forEach(function (key) {
        if (key === filterKey) {
          filterButtons[key].classList.add('is-active');
        } else {
          filterButtons[key].classList.remove('is-active');
        }
      });
    }

    // 实例方法定义
    var instance = {
      update: function (stats) {
        if (stats) {
          if (typeof stats.activeCount === 'number') {
            activeCount = stats.activeCount;
            countNumEl.textContent = activeCount.toString();
          }
          if (typeof stats.completedCount === 'number') {
            completedCount = stats.completedCount;
          }
        }

        if (completedCount > 0 && onClearCompleted) {
          clearBtn.classList.remove('is-hidden');
        } else {
          clearBtn.classList.add('is-hidden');
        }
      },

      setFilter: function (filter) {
        if (filterButtons[filter]) {
          applyFilter(filter);
        }
      },

      destroy: function () {
        if (footerEl.parentNode) {
          footerEl.parentNode.removeChild(footerEl);
        }
      }
    };

    return instance;
  }

  // 挂载到全局
  global.createTodoFooter = createTodoFooter;

})(typeof window !== 'undefined' ? window : this);
