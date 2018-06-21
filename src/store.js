import { createStore } from "redux";
import rootReducer from "./reducers";

export default () => {
  if (process.env.NODE_ENV === "production") {
    const store = createStore(rootReducer);
    return store;
  } else {
    const store = createStore(
      rootReducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    return store;
  }
};
