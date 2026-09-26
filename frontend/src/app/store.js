// Import the function used to create the Redux store
import { configureStore } from "@reduxjs/toolkit";

// Create the central Redux store
const store = configureStore({
    reducer: {},
});

// Export the store so React can use it
export default store;