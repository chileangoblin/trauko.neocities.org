// TODO: Refactor this class, this was made quickly and with not much thinking

export default class Taskbar {
    constructor() {
        this.element = document.querySelector('.taskbar');
        this.drawer = this.element.querySelector('.drawer');
        this.tabs = this.element.querySelectorAll('.taskbar-tab');
        this.time = this.element.querySelector('#current-time');
        this.drawerContents = this.drawer.querySelectorAll('[data-drawer-id]');

        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.handleTabClick(tab));
        });

        this.state = {
            visible: false,
            activeTab: null,
            activeDrawer: null,
        };

        this.updateTime();
    }

    handleTabClick(tab) {
        const isSameTab = this.state.activeTab === tab;

        if (isSameTab && this.state.visible) {
            this.closeDrawer();
        } else {
            this.openDrawer(tab);
        }
    }

    openDrawer(tab) {
        // Get the corresponding drawer content ID
        const tabId = tab.id.replace('taskbar-', '');
        const drawerId = `drawer-${tabId}`;
        const drawerContent = this.drawer.querySelector(`[data-drawer-id="${drawerId}"]`);

        // Hide all drawer contents
        this.drawerContents.forEach(content => content.style.display = 'none');

        // Show the selected drawer content
        if (drawerContent) {
            drawerContent.style.display = 'block';
        }

        // Update drawer visibility and tab styling
        this.drawer.style.display = 'block';
        this.state.visible = true;

        this.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        this.state.activeTab = tab;
        this.state.activeDrawer = drawerContent;
    }

    closeDrawer() {
        // Hide drawer and drawer contents
        this.drawer.style.display = 'none';
        this.drawerContents.forEach(content => content.style.display = 'none');

        // Clear tab active state
        if (this.state.activeTab) {
            this.state.activeTab.classList.remove('active');
        }

        this.state.visible = false;
        this.state.activeTab = null;
        this.state.activeDrawer = null;
    }

    updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        this.time.textContent = `${hours}:${minutes}`;

        // Update at the start of the next minute
        clearTimeout(this.timeTimeout);
        const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
        this.timeTimeout = setTimeout(() => this.updateTime(), delay);
    }
}
