// 应用状态管理
class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.editingTodo = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateStats();
        this.loadTheme();
    }

    bindEvents() {
        // 表单提交
        document.getElementById('todo-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        // 筛选标签
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // 清除已完成
        document.getElementById('clear-completed').addEventListener('click', () => {
            this.clearCompleted();
        });

        // 主题切换
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // 模态框事件
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('save-edit').addEventListener('click', () => {
            this.saveEdit();
        });

        document.getElementById('cancel-edit').addEventListener('click', () => {
            this.closeModal();
        });

        // 点击模态框外部关闭
        document.getElementById('edit-modal').addEventListener('click', (e) => {
            if (e.target.id === 'edit-modal') {
                this.closeModal();
            }
        });

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    addTodo() {
        const input = document.getElementById('todo-input');
        const prioritySelect = document.getElementById('priority-select');
        const dueDateInput = document.getElementById('due-date');

        const text = input.value.trim();
        if (!text) return;

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            priority: prioritySelect.value,
            dueDate: dueDateInput.value || null,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        this.saveToStorage();
        this.render();
        this.updateStats();

        // 重置表单
        input.value = '';
        dueDateInput.value = '';
        prioritySelect.value = 'medium';
        input.focus();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            this.render();
            this.updateStats();
        }
    }

    deleteTodo(id) {
        if (confirm('确定要删除这个任务吗？')) {
            this.todos = this.todos.filter(t => t.id !== id);
            this.saveToStorage();
            this.render();
            this.updateStats();
        }
    }

    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            this.editingTodo = todo;
            document.getElementById('edit-input').value = todo.text;
            document.getElementById('edit-priority').value = todo.priority;
            document.getElementById('edit-due-date').value = todo.dueDate || '';
            document.getElementById('edit-modal').style.display = 'block';
            document.getElementById('edit-input').focus();
        }
    }

    saveEdit() {
        if (!this.editingTodo) return;

        const newText = document.getElementById('edit-input').value.trim();
        if (!newText) {
            alert('任务内容不能为空！');
            return;
        }

        this.editingTodo.text = newText;
        this.editingTodo.priority = document.getElementById('edit-priority').value;
        this.editingTodo.dueDate = document.getElementById('edit-due-date').value || null;

        this.saveToStorage();
        this.render();
        this.closeModal();
    }

    closeModal() {
        document.getElementById('edit-modal').style.display = 'none';
        this.editingTodo = null;
    }

    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        if (completedCount === 0) {
            alert('没有已完成的任务！');
            return;
        }

        if (confirm(`确定要清除 ${completedCount} 个已完成的任务吗？`)) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveToStorage();
            this.render();
            this.updateStats();
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // 更新活动标签
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.filter === filter);
        });

        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'pending':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    updateStats() {
        const completed = this.todos.filter(t => t.completed).length;
        const pending = this.todos.length - completed;

        document.getElementById('completed-count').textContent = completed;
        document.getElementById('pending-count').textContent = pending;
    }

    render() {
        const todoList = document.getElementById('todo-list');
        const emptyState = document.getElementById('empty-state');
        const filteredTodos = this.getFilteredTodos();

        if (filteredTodos.length === 0) {
            todoList.innerHTML = '';
            emptyState.style.display = 'flex';
            return;
        }

        emptyState.style.display = 'none';
        todoList.innerHTML = filteredTodos.map(todo => this.createTodoHTML(todo)).join('');

        // 绑定事件
        this.bindTodoEvents();
    }

    createTodoHTML(todo) {
        const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;
        const priorityClass = `priority-${todo.priority}`;
        const priorityEmoji = {
            low: '🔵',
            medium: '🟡',
            high: '🔴'
        };
        
        return `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <div class="todo-content">
                    <div class="todo-text" title="双击编辑">${this.escapeHtml(todo.text)}</div>
                    <div class="todo-meta">
                        <span class="priority-badge ${priorityClass}">${priorityEmoji[todo.priority]} ${this.getPriorityText(todo.priority)}</span>
                        ${todo.dueDate ? `
                            <span class="due-date ${isOverdue ? 'overdue' : ''}">
                                📅 ${this.formatDate(todo.dueDate)}
                            </span>
                        ` : ''}
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="action-btn edit-btn" title="编辑">✏️</button>
                    <button class="action-btn delete-btn" title="删除">🗑️</button>
                </div>
            </li>
        `;
    }

    bindTodoEvents() {
        // 复选框事件
        document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const id = parseInt(e.target.closest('.todo-item').dataset.id);
                this.toggleTodo(id);
            });
        });

        // 双击编辑
        document.querySelectorAll('.todo-text').forEach(text => {
            text.addEventListener('dblclick', (e) => {
                const id = parseInt(e.target.closest('.todo-item').dataset.id);
                this.editTodo(id);
            });
        });

        // 编辑按钮
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.todo-item').dataset.id);
                this.editTodo(id);
            });
        });

        // 删除按钮
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.todo-item').dataset.id);
                this.deleteTodo(id);
            });
        });
    }

    saveToStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // 更新图标
        const icon = document.getElementById('theme-icon');
        icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const icon = document.getElementById('theme-icon');
        icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // 更新图标
        const icon = document.getElementById('theme-icon');
        icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }

    getPriorityText(priority) {
        const map = {
            low: '低',
            medium: '中',
            high: '高'
        };
        return map[priority] || priority;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return '今天';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return '明天';
        } else {
            return date.toLocaleDateString('zh-CN', {
                month: 'short',
                day: 'numeric'
            });
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 拖拽排序功能
class DragDropManager {
    constructor(todoApp) {
        this.todoApp = todoApp;
        this.draggedElement = null;
        this.init();
    }

    init() {
        this.bindDragEvents();
    }

    bindDragEvents() {
        const todoList = document.getElementById('todo-list');
        
        todoList.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('todo-item')) {
                this.draggedElement = e.target;
                e.target.style.opacity = '0.5';
            }
        });

        todoList.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('todo-item')) {
                e.target.style.opacity = '';
                this.draggedElement = null;
            }
        });

        todoList.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(todoList, e.clientY);
            const draggable = e.target.closest('.todo-item');
            
            if (draggable && draggable !== this.draggedElement) {
                if (afterElement == null) {
                    todoList.appendChild(this.draggedElement);
                } else {
                    todoList.insertBefore(this.draggedElement, afterElement);
                }
            }
        });

        todoList.addEventListener('drop', (e) => {
            e.preventDefault();
            this.updateTodoOrder();
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    updateTodoOrder() {
        const items = document.querySelectorAll('.todo-item');
        const newOrder = [];
        
        items.forEach(item => {
            const id = parseInt(item.dataset.id);
            const todo = this.todoApp.todos.find(t => t.id === id);
            if (todo) {
                newOrder.push(todo);
            }
        });

        // 保持未筛选的项目在原来的位置
        const filteredOut = this.todoApp.todos.filter(t => 
            !newOrder.some(newT => newT.id === t.id)
        );

        this.todoApp.todos = [...newOrder, ...filteredOut];
        this.todoApp.saveToStorage();
    }

    makeItemsDraggable() {
        document.querySelectorAll('.todo-item').forEach(item => {
            item.setAttribute('draggable', true);
        });
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    const app = new TodoApp();
    const dragDropManager = new DragDropManager(app);
    
    // 在每次渲染后使项目可拖拽
    const originalRender = app.render.bind(app);
    app.render = function() {
        originalRender();
        if (app.currentFilter === 'all') {
            dragDropManager.makeItemsDraggable();
        }
    };
    
    // 首次渲染
    app.render();
    
    // 添加一些初始提示
    if (app.todos.length === 0) {
        setTimeout(() => {
            console.log('💡 提示：双击任务可以编辑，拖拽可以重新排序！');
        }, 1000);
    }
});

// 添加触摸支持
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, { passive: true });
}

// 注册Service Worker（PWA支持）
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker 注册成功:', registration);
      })
      .catch(error => {
        console.log('Service Worker 注册失败:', error);
      });
  });
}

// 应用安装提示
let deferredPrompt;
const installButton = document.createElement('button');
installButton.className = 'install-btn';
installButton.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 24px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  z-index: 1000;
  display: none;
  transition: all 0.3s ease;
`;

installButton.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('用户接受了安装提示');
    }
    deferredPrompt = null;
    installButton.style.display = 'none';
  }
});

document.body.appendChild(installButton);

// 监听安装提示事件
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installButton.style.display = 'block';
  installButton.textContent = '📱 安装应用';
});

// 隐藏安装按钮（如果已安装）
window.addEventListener('appinstalled', () => {
  installButton.style.display = 'none';
  deferredPrompt = null;
});

// 检查是否已作为PWA运行
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('正在以PWA模式运行');
} else {
  console.log('正在以浏览器模式运行');
}