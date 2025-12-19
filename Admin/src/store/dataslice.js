import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    adminTheater:null,
    onStatusChange:false
}
export const dataSlice = createSlice({

    name: "data",
    initialState,
    reducers: {
        
        setAdminTheater:(state,action)=>{
            state.adminTheater = action.payload
        },
        setOnStatusChange:(state)=>{
            state.onStatusChange = !state.onStatusChange
        }
    
    }
})
export const {setOnStatusChange,setAdminTheater} = dataSlice.actions

export default dataSlice.reducer