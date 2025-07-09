// import { doc, getDoc } from "firebase/firestore";
// import { create } from "zustand";
// import { db } from "./firebase";
// import useUserStore from "./UserStore";

// const useChatStore = create((set) => ({
//   chatId: null,
//   user: true,
//   isCurrentUserBlocked: false,
//   isRecieverBlocked: false,
//   changeChat: (chatId, user) => {
//     const currentUser = useUserStore.getState().currentUser;

//     if (user.blocked.includes(currentUser.id)) {
//       return set({
//         chatId,
//         user: true,
//         isCurrentUserBlocked: true,
//         isRecieverBlocked: false,
//       });
//     }

//     else if (currentUser.blocked.includes(user.id)) {
//       return set({
//         chatId,
//         user: user,
//         isCurrentUserBlocked: false,
//         isRecieverBlocked: true,
//       });
//     } else {
//       return set({
//         chatId,
//         user,
//         isCurrentUserBlocked: false,
//         isRecieverBlocked: false,
//       });
//     }
//   },
//   changeBlock: () => {
//     set((state) => ({
//       ...state,
//       isRecieverBlocked: !state.isRecieverBlocked,
//     }));
//   },
// }));
// export default useChatStore;
import { create } from "zustand";
import useUserStore from "./UserStore";

const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isRecieverBlocked: false,

  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    const userBlocked = user?.blocked ?? [];
    const currentUserBlocked = currentUser?.blocked ?? [];

    if (userBlocked.includes(currentUser?.id)) {
      set({
        chatId,
        user,
        isCurrentUserBlocked: true,
        isRecieverBlocked: false,
      });
    } else if (currentUserBlocked.includes(user?.id)) {
      set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isRecieverBlocked: true,
      });
    } else {
      set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isRecieverBlocked: false,
      });
    }
  },

  changeBlock: () => {
    set((state) => ({
      ...state,
      isRecieverBlocked: !state.isRecieverBlocked,
    }));
  },
}));

export default useChatStore;
