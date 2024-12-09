const useAppStore=defineStore('app',{
  state:()=>({
    sidebar: {
      opened: localStorage.getItem('sidebarStatus') ? !!+localStorage.getItem('sidebarStatus') : true,
      withoutAnimation: false
    },
    device: 'desktop',
    personCoolDown: []
  }),
  actions:{
    TOGGLE_SIDEBAR() {
      this.sidebar.opened = !this.sidebar.opened;
      this.sidebar.withoutAnimation = false;
      if (this.sidebar.opened) {
        localStorage.setItem('sidebarStatus', 1);
      } else {
        localStorage.setItem('sidebarStatus', 0);
      }
    },
    CLOSE_SIDEBAR( withoutAnimation) {
      localStorage.setItem('sidebarStatus', 0);
      this.sidebar.opened = false;
      this.sidebar.withoutAnimation = withoutAnimation;
    },
    TOGGLE_DEVICE( device) {
      this.device = device;
    },
    SET_PERSON_COOL_DOWN(list) {
      this.personCoolDown = list;
    },

    toggleSideBar() {
      this.TOGGLE_SIDEBAR()
    },
    closeSideBar({ withoutAnimation }) {
      this.CLOSE_SIDEBAR(withoutAnimation)
    },
    toggleDevice(device) {
      this.TOGGLE_DEVICE(device)
    }
  }
})


export default useAppStore

