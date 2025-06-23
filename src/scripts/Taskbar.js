// TODOS:
// [] Taskbar consists of three main components: Start Button, Tabs, and Tray (Time, Volume and Music)
// [] Start Button will just show a dialog displaying information about the project.
// [] Tabs consist of Terminal, Windows Manager and Guestbook.
// [] When a tab is selected, it shows a panel on top of the taskbar with the content for the selected tab

export default class Taskbar {
    constructor() {
        this.element = document.querySelector('.taskbar');
        this.drawer = this.element.querySelector('.drawer');
        this.tabs = this.element.querySelectorAll('.taskbar-tab');
        this.time = this.element.querySelector('#current-time');

        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.handleTabClick(tab));
        });
        
        this.state = {
            visible: false,
            activeTab: null
        }

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
        this.drawer.style.display = 'block';
        this.state.visible = true;

        this.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.state.activeTab = tab;
    }

    closeDrawer() {
        this.drawer.style.display = 'none';
        this.state.visible = false;

        if (this.state.activeTab) {
            this.state.activeTab.classList.remove('active');
        }

        this.state.activeTab = null;
    }
    
    // TODO: Fix the timing.
    updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        this.time.textContent = `${hours}:${minutes}`;

        // Calculate delay until the start of the next minute
        clearTimeout(this.timeTimeout);
        const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
        this.timeTimeout = setTimeout(() => this.updateTime(), delay);
    }
}