import React, {
  Dispatch,
  ReactNode,
  Reducer,
  useReducer,
  createContext,
  Context,
  useContext,
} from 'react';

export const TockStateContext: Context<TockState | undefined> = createContext<
  TockState | undefined
>(undefined);
export const TockStateDispatch: Context<Dispatch<TockAction> | undefined> = createContext<
  Dispatch<TockAction> | undefined
>(undefined);

export const useTockState: () => TockState = () => {
  const state: TockState | undefined = useContext(TockStateContext);
  if (!state) {
    throw new Error('useTockState must be used in a TockContext');
  }
  return state;
};

export const useTockDispatch: () => Dispatch<TockAction> = () => {
  const dispatch: Dispatch<TockAction> | undefined = useContext(TockStateDispatch);
  if (!dispatch) {
    throw new Error('useTockDispatch must be used in a TockContext');
  }
  return dispatch;
};

export interface PostButton {
  title: string;
  payload: string;
}

export interface QuickReply {
  payload?: string;
  label: string;
}

export interface Message {
  author: 'bot' | 'user';
  message: string;
  type: 'message';
}

export interface Card {
  imageUrl?: string;
  title: string;
  subTitle?: string;
  buttons?: { label: string; url: string }[];
  type: 'card';
}

export interface Carousel {
  cards: Card[];
  type: 'carousel';
}

export interface TockState {
  quickReplies: QuickReply[];
  postButtons: PostButton[];
  messages: (Message | Card | Carousel)[];
  userId: string;
}

export interface TockAction {
  type: 'SET_QUICKREPLIES' | 'ADD_MESSAGE' | 'SET_POST_BUTTONS';
  quickReplies?: QuickReply[];
  postButtons?: PostButton[];
  messages?: (Message | Card | Carousel)[];
}

export const tockReducer: Reducer<TockState, TockAction> = (
  state: TockState,
  action: TockAction
): TockState => {
  switch (action.type) {
    case 'SET_QUICKREPLIES':
      if (action.quickReplies) {
        return {
          ...state,
          quickReplies: action.quickReplies,
        };
      }
    case "SET_POST_BUTTONS":
      if(action.postButtons) {
        return {
          ...state,
          postButtons: action.postButtons
        }
      }
    case 'ADD_MESSAGE':
      if (action.messages) {
        return {
          ...state,
          messages: [...state.messages, ...action.messages],
        };
      }
    default:
      break;
  }
  return state;
};

const TockContext: (props: { children?: ReactNode }) => JSX.Element = ({
  children,
}: {
  children?: ReactNode;
}) => {
  const [state, dispatch]: [TockState, Dispatch<TockAction>] = useReducer(tockReducer, {
    quickReplies: [],
    postButtons: [],
    messages: [],
    userId: (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
  });
  return (
    <TockStateContext.Provider value={state}>
      <TockStateDispatch.Provider value={dispatch}>{children}</TockStateDispatch.Provider>
    </TockStateContext.Provider>
  );
};

export default TockContext;
